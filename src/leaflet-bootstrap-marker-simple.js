/****************************************************************************
leaflet-bootstrap-marker-simple.js

Create a L.bsMarkerCircle without icon.

Using SVG.js https://svgjs.dev/docs/3.0/ to create optional SVG-element inside the div
The options.svg can be a
    - function(draw, dimention)
    - PATH or []PATH


****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
    "use strict";

    /*****************************************************
    L.BsMarkerSimple
    *****************************************************/
    L.BsMarkerSimple = L.BsMarkerCircle.extend({
        options: {iconHtml: ''}
    });

    L.bsMarkerSimple = function bsMarkerSimple(latlng, options = {}) {
        return new L.BsMarkerSimple(latlng, options);
    };

    L.bsMarkerSimpleRound = function bsMarkerSimpleRound(latlng, options = {}) {
        options.round = true;
        return new L.BsMarkerSimple(latlng, options);
    };

    L.bsMarkerSimpleSquare = function bsMarkerSimpleSquare(latlng, options = {}) {
        options.round = false;
        return new L.BsMarkerSimple(latlng, options);
    };

}(jQuery, L, this, document));

