/****************************************************************************

leaflet-marker-icon2.js, aka leaflet-marker-standard.js,

Create L.bsMarkerStandard = a classic Leaflet marker with options for color, icon and number

****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
	"use strict";

    /*****************************************************
    L.BsMarkerStandard
    *****************************************************/
    L.BsMarkerStandard = L.BsMarkerIcon.extend({
        options: {
            faClassName    : 'fa-map-marker',
            markerClassName: 'lbm-type-icon-standard',

            scale         : 120,

            iconAnchor    : {width: 0.5, height: 1},
            popupAnchor   : {width: 0,   height: -0.5  },
            rotationOrigin: 'center bottom',
        },

        initialize: function(latLng, options){
            options = options || {};
            options.innerIconClass = options.innerIconClass || options.iconClass;
            options.iconClass = 'fa-map-marker';

            L.BsMarkerIcon.prototype.initialize.call(this, latLng, options);
            return this;
        },
    });

    L.bsMarkerStandard = function bsMarkerStandard(latlng, options) {
        return new L.BsMarkerStandard(latlng, options);
    };
}(jQuery, L, this, document));