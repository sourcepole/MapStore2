/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CONFIGURE_PRINT_FRAME = 'CONFIGURE_PRINT_FRAME';
const CLEAR_PRINT_FRAME = 'CLEAR_PRINT_FRAME';

function configurePrintFrame(center, scale, widthmm, heightmm) {
    return {
        type: CONFIGURE_PRINT_FRAME,
        center: center,
        scale: scale,
        widthmm: widthmm,
        heightmm: heightmm
    }
}

function clearPrintFrame() {
    return {
        type: CLEAR_PRINT_FRAME
    }
}

module.exports = {
    CONFIGURE_PRINT_FRAME,
    CLEAR_PRINT_FRAME,
    configurePrintFrame,
    clearPrintFrame
}
