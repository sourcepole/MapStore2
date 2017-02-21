/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var GeoCodingApi = require('../api/Nominatim');

const TEXT_SEARCH_RESULTS_LOADED = 'TEXT_SEARCH_RESULTS_LOADED';
const TEXT_SEARCH_PERFORMED = 'TEXT_SEARCH_PERFORMED';
const TEXT_SEARCH_RESULTS_PURGE = 'TEXT_SEARCH_RESULTS_PURGE';
const TEXT_SEARCH_RESET = 'TEXT_SEARCH_RESET';
const TEXT_SEARCH_ADD_MARKER = 'TEXT_SEARCH_ADD_MARKER';
const TEXT_SEARCH_TEXT_CHANGE = 'TEXT_SEARCH_TEXT_CHANGE';
const TEXT_SEARCH_SET_HIGHLIGHTED_FEATURE = 'TEXT_SEARCH_SET_HIGHLIGHTED_FEATURE';

function searchResultLoaded(results, append=false) {
    return {
        type: TEXT_SEARCH_RESULTS_LOADED,
        results: results.data,
        append: append
    };
}

function searchTextChanged(text) {
    return {
        type: TEXT_SEARCH_TEXT_CHANGE,
        searchText: text
    };
}

function resultsPurge() {
    return {
        type: TEXT_SEARCH_RESULTS_PURGE
    };
}

function resetSearch() {
    return {
        type: TEXT_SEARCH_RESET
    };
}

function addMarker(itemPosition, itemText) {
    return {
        type: TEXT_SEARCH_ADD_MARKER,
        markerPosition: itemPosition,
        markerLabel: itemText
    };
}

function setHighlightedFeature(feature) {
    return {
        type: TEXT_SEARCH_SET_HIGHLIGHTED_FEATURE,
        highlightedFeature: feature
    };
}

function textSearch(text) {
    return (dispatch) => {
        GeoCodingApi.geocode(text).then((response) => {
            dispatch(searchResultLoaded(response));
        }).catch((e) => {
            dispatch(searchResultLoaded(e));
        });
    };
}


module.exports = {
    TEXT_SEARCH_RESULTS_LOADED,
    TEXT_SEARCH_PERFORMED,
    TEXT_SEARCH_RESULTS_PURGE,
    TEXT_SEARCH_RESET,
    TEXT_SEARCH_ADD_MARKER,
    TEXT_SEARCH_TEXT_CHANGE,
    TEXT_SEARCH_SET_HIGHLIGHTED_FEATURE,
    searchResultLoaded,
    textSearch,
    resultsPurge,
    resetSearch,
    addMarker,
    searchTextChanged,
    setHighlightedFeature
};
