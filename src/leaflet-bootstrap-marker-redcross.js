/****************************************************************************

leaflet-marker-redcross.js,

Create L.bsMarkerRedCross = a red cross used to mark click

****************************************************************************/
(function ($, L/*, window, document, undefined*/) {
	"use strict";

    /*****************************************************
    L.BsMarkerRedCross
    *****************************************************/
    var height   = 32/54,
        centerY = 13/32 * height;

    L.BsMarkerRedCross = L.BsMarkerBase.extend({
        options: {
            type            : 'redcross',
            optionsWithClass: [],

            iconSize   : { width: 1,   height: height  },
            iconAnchor : { width: 0.5, height: centerY },
            popupAnchor: { width: 0,   height: 0       }

        },

        createIcon: function( sizeId, options ){
            options.iconUrl = 'images/map_cross.png';
            return L.icon( options );
        },

    });

    L.bsMarkerRedCross = L.bsMarkerRedcross = function bsMarkerRedCross(latlng, options) {
        return new L.BsMarkerRedCross(latlng, options);
    };

}(jQuery, L, this, document));


