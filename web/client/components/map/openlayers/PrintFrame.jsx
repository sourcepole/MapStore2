/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const assign = require('object-assign');
const CoordinatesUtils = require('../../../utils/CoordinatesUtils');
require('./printframe.css');

const PrintFrame = React.createClass({
    propTypes: {
        map: React.PropTypes.object,
        center: React.PropTypes.object,
        scale: React.PropTypes.number,
        widthmm: React.PropTypes.number,
        heightmm: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            map: null,
            center: null,
            scale: 0,
            widthmm: 0,
            heightmm: 0
        }
    },
    getInitialState() {
        return {origin: [0, 0], widthpx: 0, heightpx: 0};
    },
    componentWillReceiveProps(newProps) {
        let newState = this.getInitialState();
        if(newProps.widthmm !== 0 && newProps.heightmm !== 0) {
            let angle = -newProps.map.getView().getRotation();
            let cosa = Math.cos(angle);
            let sina = Math.sin(angle);

            let mapProj = newProps.map.getView().getProjection().getCode();
            let center = CoordinatesUtils.reproject(newProps.center, newProps.center.crs, mapProj);
            let width = newProps.scale * newProps.widthmm / 1000.;
            let height = newProps.scale * newProps.heightmm / 1000.;
            let mapp1 = [center.x - .5 * width * cosa - .5 * height * sina,
                         center.y + .5 * width * sina - .5 * height * cosa];
            let mapp2 = [center.x + .5 * width * cosa + .5 * height * sina,
                         center.y - .5 * width * sina + .5 * height * cosa];
            let pixp1 = newProps.map.getPixelFromCoordinate(mapp1);
            let pixp2 = newProps.map.getPixelFromCoordinate(mapp2);
            newState = {
                origin: [Math.min(pixp1[0], pixp2[0]), Math.min(pixp1[1], pixp2[1])],
                widthpx: Math.abs(pixp2[0]- pixp1[0]),
                heightpx: Math.abs(pixp2[1]- pixp1[1])
            };
        }
        this.setState(newState);
    },
    render() {
        if(!this.props.map || this.state.widthpx === 0 || this.state.heightpx === 0) {
            return null;
        }
        let boxStyle = {
            left: this.state.origin[0] + 'px',
            top: this.state.origin[1] + 'px',
            width: this.state.widthpx + 'px',
            height: this.state.heightpx + 'px'
        };
        return (
            <div id="PrintFrame" style={boxStyle}>
            </div>
        );
    }
});

module.exports = PrintFrame;
