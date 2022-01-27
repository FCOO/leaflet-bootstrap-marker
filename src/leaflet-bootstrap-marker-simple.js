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

    //Create name-space L.BsMarker
    var ns = L.BsMarker = L.BsMarker || {};

    /*****************************************************
    L.BsMarkerSimple
    *****************************************************/
    L.BsMarkerSimple = L.BsMarkerCircle.extend({
        createIcon: function( sizeId, options ){

            function colorNameToRgbStr(colorName){
                return 'rgb(' + ns.colorNameToRGB[ colorName ].join(',') + ')';
            }

            options.html = null;
            if (this.options.svg){
                //Create a SVG-object to draw on
                var draw    = window.SVG().size('100%', '100%'),
                    o       = this.options,
                    dim     = ns.size[o.size],
                    borderW = 2;

                if (o.thickBorder)  borderW = 3;
                if (o.thinBorder)   borderW = 1;
                if (o.noBorder)     borderW = 0;

                dim = dim - 2*borderW;


                if ($.isFunction(o.svg))
                    o.svg(
                        draw,
                        dim,
                        colorNameToRgbStr(o.colorName), //ns.colorNameToRGB[ o.colorName ] ),
                        colorNameToRgbStr(o.borderColorName), //ns.colorNameToRGB[ o.borderColorName ],
                        colorNameToRgbStr(o.iconColorName), //ns.colorNameToRGB[ o.iconColorName ],
                        this
                    );
                else {
                    var svgList = $.isArray(o.svg) ? o.svg : [o.svg];
                    $.each(svgList, function(index, pathOptions){
                        $.each(pathOptions, function(id, value){
                            draw[id](value);
                        });
                    });
                }

                options.html = draw.html();
            }

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

