/****************************************************************************

leaflet-marker-icon.js,

Create L.bsMarkerIcon = a marker with only a fa-icon

****************************************************************************/
(function ($, L/*, window, document, undefined*/) {
	"use strict";

    //Create name-space L.BsMarker
//    var ns = L.BsMarker = L.BsMarker || {};

    /*****************************************************
    L.BsMarkerIcon
    *****************************************************/
    L.BsMarkerIcon = L.BsMarkerBase.extend({
        options: {
            type       : 'icon',
            iconClass  : 'fa-circle',
            setColor: {
                alsoAsCss  : true,
                cssAttrName: 'color'
            },
            setBorderColor: {
                alsoAsCss  : true,
                cssAttrName: 'color'
            },

            //iconClassPrefix = the prefix (class-name") used be the tree icons. Allow for the use of other font-family
            iconClassPrefix: {
                solid : 'fas',
                border: ''    //Default is set to $.FONTAWESOME_PREFIX on creation
            },
            //iconClassExtra = Extra class-names added to the different icons
            iconClassExtra: {
                solid : '',
                border: ''
            }
        },

        initialize: function(latLng, options){
            options = options || {};
            options.faClassName = options.faClassName || options.iconClass;
            L.BsMarkerBase.prototype.initialize.call(this, latLng, options);
            return this;
        },

        createIcon: function( sizeId, options ){
            var iconClassPrefixSolid  =  this.options.iconClassPrefix.solid + ' ' + this.options.iconClass,
                iconClassPrefixBorder =  this.options.iconClassPrefix.border || ($.FONTAWESOME_PREFIX == 'fa' ? 'fas' : 'fal');

            iconClassPrefixSolid  +=  ' ' + this.options.iconClass + ' ' + (this.options.iconClassExtra.solid || '');
            iconClassPrefixBorder +=  ' ' + this.options.iconClass + ' ' + (this.options.iconClassExtra.border || '');

/*
var dim = ns.size[this.options.size];

var draw = SVG().size('100%', '100%');
var rect = draw
                .rect(dim/2, dim/2)
                .move(dim/4, dim/4)
                .addClass('NIELS-HOLT')
                .attr({ fill: 'blue' })
*/





            options.html =
                '<div class="lbm-content-outer">' +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-puls"></i>' +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-shadow"></i>' +
                    (this.options.noFill ? '' : '<i class="' + iconClassPrefixSolid  + ' lbm-content lbm-content-background"></i>') +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-border"></i>' +

//LATER                    '<div class="inner2 SVG">'+draw.html()+'</div>' +


                '</div>';



            return L.divIcon( options );
        },

        getElements: function(){
            this.$icon = $(this._icon);

            if (this.options.noFill){
                this.$background  = this.$icon.find('.lbm-content-border, .lbm-content-shadow, .lbm-content-puls');
                this.$border      = $();//Empty $-element
            }
            else {
                this.$background  = this.$icon.find('.lbm-content-background, .lbm-content-shadow, .lbm-content-puls');
                this.$border      = this.$icon.find('.lbm-content-border');
            }
            this.$inner       = this.$icon.find('.inner');
            this.$innerParent = this.$icon.find('.lbm-content-outer');
        },
    });

    L.bsMarkerIcon = function bsMarkerIcon(latlng, options) {
        return new L.BsMarkerIcon(latlng, options);
    };

}(jQuery, L, this, document));



