/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const ol = require('openlayers');
const uuid = require('uuid');
const assign = require('object-assign');

const DrawSupport = React.createClass({
    propTypes: {
        map: React.PropTypes.object,
        drawOwner: React.PropTypes.string,
        drawStatus: React.PropTypes.string,
        drawMethod: React.PropTypes.string,
        features: React.PropTypes.array,
        onChangeDrawingStatus: React.PropTypes.func,
        onEndDrawing: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            map: null,
            drawOwner: null,
            drawStatus: null,
            drawMethod: null,
            features: null,
            onChangeDrawingStatus: () => {},
            onEndDrawing: () => {}
        };
    },
    componentWillReceiveProps(newProps) {
        switch (newProps.drawStatus) {
            case ("create"):
                this.addLayer(newProps);
                break;
            case ("start"):
                this.addInteractions(newProps);
                break;
            case ("stop"):
                this.removeDrawInteraction();
                break;
            case ("replace"):
                this.replaceFeatures(newProps);
                break;
            case ("clean"):
                this.clean();
                break;
            default:
                return;
        }
    },
    render() {
        return null;
    },
    addLayer: function(newProps) {
        var source;
        var vector;
        this.geojson = new ol.format.GeoJSON();

        // create a layer to draw on
        source = new ol.source.Vector();
        vector = new ol.layer.Vector({
            source: source,
            zIndex: 1000000,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                  width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        this.props.map.addLayer(vector);

        if (newProps.features && newProps.features > 0) {
            for (let i = 0; i < newProps.features.length; i++) {
                let feature = newProps.features[i];
                if (!(feature instanceof Object)) {
                    feature = this.geojson.readFeature(newProps.feature);
                }

                source.addFeature(feature);
            }
        }

        this.drawSource = source;
        this.drawLayer = vector;
    },
    replaceFeatures: function(newProps) {
        if (!this.drawLayer) {
            this.addLayer(newProps);
        } else {
            this.drawSource.clear();
            this.selectInteraction.getFeatures().clear();

            newProps.features.map((geom) => {
                let feature = new ol.Feature({
                    id: geom.id,
                    geometry: new ol.geom[geom.type](geom.coordinates)
                });

                this.drawSource.addFeature(feature);
            });

            this.drawSource.changed();
        }
    },
    addInteractions: function(newProps) {
        if (!this.drawLayer) {
            this.addLayer(newProps);
        }

        if (this.drawInteraction) {
            this.removeDrawInteraction();
        }

        this.drawInteraction = new ol.interaction.Draw(this.drawPropertiesForGeometryType(newProps.drawMethod));

        this.drawInteraction.on('drawstart', function(evt) {
            this.sketchFeature = evt.feature;
            this.selectInteraction.getFeatures().clear();
            this.selectInteraction.setActive(false);
        }, this);

        this.drawInteraction.on('drawend', function(evt) {
            this.sketchFeature = evt.feature;
            this.sketchFeature.set('id', uuid.v1());

            let feature = this.featureToObject(this.sketchFeature);

            this.props.onEndDrawing(feature, this.props.drawOwner);
            this.props.onChangeDrawingStatus('stop', this.props.drawMethod, this.props.drawOwner, this.props.features.concat([feature]));

            this.selectInteraction.setActive(true);
        }, this);

        this.props.map.addInteraction(this.drawInteraction);

        if (!this.selectInteraction) {
          this.selectInteraction = new ol.interaction.Select({layers: [this.drawLayer]});
          this.selectInteraction.on('select', function(event) {
            let selectedFeature = event.selected.length > 0 ? this.featureToObject(event.selected[0]) : null;
            this.props.onChangeDrawingStatus('select', null, this.props.drawOwner, this.props.features, selectedFeature);
          }.bind(this));
          this.props.map.addInteraction(this.selectInteraction);
        }

        if (!this.translateInteraction) {
          this.translateInteraction = new ol.interaction.Translate({features: this.selectInteraction.getFeatures()});
          this.props.map.addInteraction(this.translateInteraction);
        }

        if (!this.modifyInteraction) {
          this.modifyInteraction = new ol.interaction.Modify({features: this.selectInteraction.getFeatures()});
          this.props.map.addInteraction(this.modifyInteraction);
        }
    },
    drawPropertiesForGeometryType(geometryType) {
      let drawBaseProps = {
          source: this.drawSource,
          type: /** @type {ol.geom.GeometryType} */ geometryType,
          style: new ol.style.Style({
              fill: new ol.style.Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                  color: 'rgba(0, 0, 0, 0.5)',
                  lineDash: [10, 10],
                  width: 2
              }),
              image: new ol.style.Circle({
                  radius: 5,
                  stroke: new ol.style.Stroke({
                      color: 'rgba(0, 0, 0, 0.7)'
                  }),
                  fill: new ol.style.Fill({
                      color: 'rgba(255, 255, 255, 0.2)'
                  })
              })
          }),
          condition: ol.events.condition.always
      };

      // Prepare the properties for the BBOX drawing
      let roiProps = {};
      if (geometryType === "BBOX") {
          roiProps.type = "LineString";
          roiProps.maxPoints = 2;
          roiProps.geometryFunction = function(coordinates, geometry) {
              let geom = geometry;
              if (!geom) {
                  geom = new ol.geom.Polygon(null);
              }

              let start = coordinates[0];
              let end = coordinates[1];
              geom.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
              ]);

              return geom;
          };
      } else if (geometryType === "Circle") {
          roiProps.maxPoints = 100;
          roiProps.geometryFunction = ol.interaction.Draw.createRegularPolygon(roiProps.maxPoints);
      }

      return assign({}, drawBaseProps, roiProps);
    },
    featureToObject: function(feature) {
      let geometry = feature.getGeometry(),
          extent = geometry.getExtent(),
          center = ol.extent.getCenter(geometry.getExtent()),
          coordinates = geometry.getCoordinates();

      return {
          id: feature.get('id'),
          type: geometry.getType(),
          extent: extent,
          center: center,
          coordinates: coordinates,
          projection: this.props.map.getView().getProjection().getCode()
      };
    },
    removeDrawInteraction: function() {
        if (this.drawInteraction !== null) {
            this.props.map.removeInteraction(this.drawInteraction);
            this.drawInteraction = null;
            this.sketchFeature = null;
        }
    },
    clean: function() {
        this.removeDrawInteraction();

        if (this.drawLayer) {
            this.props.map.removeLayer(this.drawLayer);
            this.geojson = null;
            this.drawLayer = null;
            this.drawSource = null;
        }
    }
});

module.exports = DrawSupport;
