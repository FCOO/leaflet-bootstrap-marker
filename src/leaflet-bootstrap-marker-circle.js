/****************************************************************************
leaflet-bootstrap-marker-circle.js,

Create L.bsMarkerCircle = a round marker with options for color, shadow and pulsart

****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
    "use strict";

    /*****************************************************
    L.BsMarkerCircle
    *****************************************************/
    var optionsWithClass = L.BsMarkerBase.prototype.options.optionsWithClass.slice();
    optionsWithClass.push('round');

    L.BsMarkerCircle = L.BsMarkerBase.extend({
        options: {
            type            : 'circle',
            round           : true, //If false the icon is square
            optionsWithClass: optionsWithClass,
            setBorderColor: {
                alsoAsCss  : false,
            }
        },

        initialize: function(latLng, options){
            options = options || {};
            options.innerIconClass = options.innerIconClass || options.iconClass;
            L.BsMarkerBase.prototype.initialize.call(this, latLng, options);
            if (!this.options.round)
                this.options.faClassName = 'fa-square';
            return this;
        },

        createIcon: function( sizeId, options ){
            options.html = '<div class="inner"></div>';
            return L.divIcon( options );
        },
    });

    L.bsMarkerCircle = function bsMarkerCircle(latlng, options) {
        return new L.BsMarkerCircle(latlng, options);
    };

}(jQuery, L, this, document));

