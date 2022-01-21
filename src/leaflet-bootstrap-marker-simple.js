/****************************************************************************
leaflet-bootstrap-marker-simple.js

Create a L.bsMarkerCircle without icon.

****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
    "use strict";

    /*****************************************************
    L.BsMarkerSimple
    *****************************************************/
    L.BsMarkerSimple = L.BsMarkerCircle.extend({
        createIcon: function( sizeId, options ){
            options.html = null;
            return L.divIcon( options );
        },
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

