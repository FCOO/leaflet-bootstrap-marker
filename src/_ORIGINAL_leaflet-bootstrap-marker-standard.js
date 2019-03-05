/****************************************************************************

leaflet-marker-standard.js,

Create L.bsMarkerStandard = a classic Leaflet marker with options for color, icon and number

****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
	"use strict";

    /*****************************************************
    L.BsMarkerStandard
    *****************************************************/
    var whRatio = 4/3;


    L.BsMarkerStandard = L.BsMarkerBase.extend({
        options: {
            type            : 'standard',
            faClassName     : 'fa-map-marker',

            setColor: {
                alsoAsCss  : true,
                cssAttrName: 'color'
            },
            setBorderColor: {
                alsoAsCss  : true,
                cssAttrName: 'color'
            },

            iconSize   : {width: 1,   height: whRatio      },
            iconAnchor : {width: 0.5, height: whRatio      },
            popupAnchor: {width: 0,   height: -0.5*whRatio }

        },

        initialize: function(latLng, options){
            L.BsMarkerBase.prototype.initialize.call(this, latLng, options);
            return this;
        },

        createIcon: function( sizeId, options ){
            options.html =
                '<i class="fas fa-map-marker lbm-content lbm-content-shadow"></i>' +
                '<i class="fal fa-map-marker lbm-content lbm-content-border"></i>' +
                '<i class="fas fa-map-marker lbm-content lbm-content-background"></i>' +
                '<div class="inner"></div>';
            return L.divIcon( options );
        },

        getElements: function(){
            this.$icon       = $(this._icon);
            this.$background = this.$icon.find('.lbm-content-background, .lbm-content-shadow');
            this.$border     = this.$icon.find('.lbm-content-border');
            this.$inner      = this.$icon.find('.inner');
        }
    });

    L.bsMarker = L.bsMarkerStandard = function bsMarkerStandard(latlng, options) {
        return new L.BsMarkerStandard(latlng, options);
    };

}(jQuery, L, this, document));


