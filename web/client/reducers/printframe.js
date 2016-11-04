/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {CONFIGURE_PRINT_FRAME, CLEAR_PRINT_FRAME} = require('../actions/printframe');
const assign = require('object-assign');


function printFrame(state = {}, action)
{
    switch (action.type) {
        case CONFIGURE_PRINT_FRAME:
            return assign({}, state, {
                center: assign({}, action.center),
                scale: action.scale,
                widthmm: action.widthmm,
                heightmm: action.heightmm
            });
        case CLEAR_PRINT_FRAME:
            return null;
        default:
            return state;
    }
}

module.exports = printFrame;
