var React = require('react');
var connect = require('react-redux').connect;
var LMap = require('../../../components/map/openlayers/Map');
var LLayer = require('../../../components/map/openlayers/Layer');
require('../../../components/map/openlayers/plugins/index');
// var Feature = require('../../../components/map/openlayers/Feature');
// var Locate = require('../../../components/map/openlayers/Locate');
// var MeasurementSupport = require('../../../components/map/openlayers/MeasurementSupport');
// var Overview = require('../../../components/map/openlayers/Overview');
// var ScaleBar = require('../../../components/map/openlayers/ScaleBar');
// var DrawSupport = require('../../../components/map/openlayers/DrawSupport');
// var HighlightFeatureSupport = require('../../../components/map/openlayers/HighlightFeatureSupport');

// const {changeMapView, clickOnMap} = require('../../../actions/map');
// const {layerLoading, layerLoad, invalidLayer} = require('../../../actions/layers');
// const {changeMousePosition} = require('../../../actions/mousePosition');
// const {changeMeasurementState} = require('../../../actions/measurement');
// const {changeLocateState, onLocateError} = require('../../../actions/locate');
// const {changeDrawingStatus, endDrawing} = require('../../../actions/draw');
// const {updateHighlighted} = require('../../../actions/highlight');

// const {connect} = require('react-redux');
// const assign = require('object-assign');

// const Empty = () => { return <span/>; };

var QWC2 = React.createClass({
    propTypes: {
        // redux store slice with map configuration (bound through connect to store at the end of the file)
        mapConfig: React.PropTypes.object,
        // redux store dispatch func
        dispatch: React.PropTypes.func
    },
    renderLayers(layers) {
        if (layers) {
            return layers.map(function(layer) {
                return <LLayer type={layer.type} key={layer.name} options={layer} />;
            });
        }
        return null;
    },
    render() {
        // wait for loaded configuration before rendering
        if (this.props.mapConfig && this.props.mapConfig.map) {
            return (
                <LMap id="map" center={this.props.mapConfig.map.center} zoom={this.props.mapConfig.map.zoom}>
                     {this.renderLayers(this.props.mapConfig.layers)}
                </LMap>
            );
        }
        return null;
    }
});

// include support for OSM and WMS layers
require('../../../components/map/openlayers/plugins/OSMLayer');
require('../../../components/map/openlayers/plugins/WMSLayer');

// connect Redux store slice with map configuration
module.exports = connect((state) => {
    return {
        mapConfig: state.mapConfig
    };
})(QWC2);
