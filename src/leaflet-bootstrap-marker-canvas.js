/****************************************************************************
leaflet-bootstrap-marker-circle-CANVAS.js

Extending L.CircleMarker with options for color, size (shadow and pulsart?)


****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
    "use strict";

    //Create name-space L.BsMarker
    var ns = L.BsMarker = L.BsMarker || {};

    /*****************************************************
    L.BsMarkerCanvas
    Extend L.CircleMarker to draw marker as bsMarkerCircle
    *****************************************************/
    L.BsMarkerCanvas = L.CircleMarker.extend({
        options: {
            round       : true, //If false the icon is square
            size        : 'nl', //Size of the marker. Possble values: 'extrasmall'/'sx', 'small'/'sm', '', 'large'/'lg', 'xlarge'*'xl'

            transparent : false, //True to make the marker semi-transparent
            hover       : false, //True to show shadow and 0.9 opacuity for lbm-transparent when hover
            shadow      : false, //true to add a shadow to the marker
            //NOT IMPLEMENTED puls        : false, //true to have a pulsart icon
            thickBorder : false, //true to have thicker border
            thinBorder  : false, //True to have a thin border
            noBorder    : false, //True to have no border

            tooltip                 : null,     //Content of tooltip
            tooltipPermanent        : false,    //Whether to open the tooltip permanently or only on mouseover.
            tooltipHideWhenDragging : false,    //True and tooltipPermanent: false => the tooltip is hidden when dragged
            tooltipHideWhenPopupOpen: false,    //True and tooltipPermanent: false => the tooltip is hidden when popup is displayed
            shadowWhenPopupOpen     : true,     //When true a big-sdhadow is shown when the popup for the marker is open

            //draw: function(ctx, x, y, dimension, radius, ctxOptions) = function to draw extra feature n the marker

            pane         : 'markerPane',
            canvasPadding: .1

        },


        /*************************************************
        initialize
        *************************************************/
        initialize: function (latlng, options) {
            options.renderer = options.renderer ||
                L.canvas({
                    pane   : 'markerPane',
                    padding: options.canvasPadding || this.options.canvasPadding
                });

            L.CircleMarker.prototype.initialize.apply(this, [latlng, options]);

            this.options = ns._adjustOptions( this.options );
            this.options.dimension = ns.size[this.options.size];

            this.options.radius = Math.floor(this.options.dimension / 2);
            this._radius = this.options.radius;

            //Create the different options for canvas
            var o = this.options,
                co = this.ctxOptions = {};

            //Save shadow
            o.saveShadow = o.shadow;

            //Line color and width
            co.lineWidth = 0;
            if (!o.noBorder){
                co.strokeStyle = ns.colorNameToColor[o.borderColorName];
                co.lineWidth = 2; //Standard

                if (o.thickBorder)
                    co.lineWidth = 3;

                if (o.thinBorder)
                    co.lineWidth = 1;

                this.lineOffset =
                    this.options.round ?
                        - co.lineWidth / 2 :
                        co.lineWidth / 2 - this._radius;
            }

            //Background-color
            var fillStyle = 'rgb(' + ns.colorNameToRGB[this.options.colorName].join(',');

            this.options.fillStyle_shadow = fillStyle + ', .28)'; //.28 = estimate to look like google maps

            if (this.options.transparent){
                this.options.fillStyle_hover  = fillStyle + ', .9)';
                fillStyle = fillStyle + ', .7'; //.7 Same as .lbm-transparent .lbm-content-background
            }
            else
                this.options.fillStyle_hover  = fillStyle + ')';

            fillStyle = fillStyle + ')';
            this.options.fillStyle = fillStyle;

            co.fillStyle = fillStyle;
        },

        /*************************************************
        onAdd
        *************************************************/
        onAdd: function(){
            var result = L.CircleMarker.prototype.onAdd.apply(this, arguments);

            if (this.options.tooltip)
                this.bindTooltip(this.options.tooltip);

            this.on('mouseover', this._mouseover, this);
            this.on('mouseout', this._mouseout, this);

            this.on('popupopen',  this._popupopen,  this);
            this.on('popupclose', this._popupclose, this);

            return result;
        },

        /*************************************************
        onRemove
        *************************************************/
        onRemove: function(){
            var result = L.CircleMarker.prototype.onRemove.apply(this, arguments);

            this.off('mouseover', this._mouseover, this);
            this.off('mouseout', this._mouseout, this);

            this.off('popupopen',  this._popupopen,  this);
            this.off('popupclose', this._popupclose, this);

            return result;
        },


        /*************************************************
        set
        *************************************************/
        set: function(fillStyle, shadow){
            this.ctxOptions.fillStyle = fillStyle;
            this.options.shadow = shadow;
            this.redraw();
        },

        /*************************************************
        reset
        *************************************************/
        reset: function(){
            this.ctxOptions.fillStyle = this.options.fillStyle;
            this.options.shadow = this.options.saveShadow;
            this.redraw();
        },

        /*************************************************
        _mouseover
        *************************************************/
        _mouseover: function(){
            if (!this.popupIsOpen)
                this.set(
                    this.options.hover ? this.options.fillStyle_hover : this.options.fillStyle,
                    this.options.shadow || this.options.hover
                );
        },

        /*************************************************
        _mouseout
        *************************************************/
        _mouseout: function(){
            if (!this.popupIsOpen)
                this.reset();
        },

        /*************************************************
        _popupopen
        *************************************************/
        _popupopen: function(){
            this.bringToFront();
            this.popupIsOpen = true;
            this.set(
                this.options.fillStyle_hover,
                this.options.shadowWhenPopupOpen || this.options.saveShadow
            );
        },

        /*************************************************
        _popupclose
        *************************************************/
        _popupclose: function(){
            this.popupIsOpen = false;
            this._mouseout();
        },


        /*************************************************
        _updatePath
        *************************************************/
        _updatePath: function () {
            this._renderer._updateMarkerCanvas(this);
        }
   });

    L.bsMarkerCanvas = function bsMarkerCanvas(latlng, options) {
        return new L.BsMarkerCanvas(latlng, options);
    };

    /*****************************************************
    Extend L.Canvas with method to draw the marker
    *****************************************************/
    L.Canvas.include({
        _updateMarkerCanvas: function(layer){
            if (!this._drawing || layer._empty()) { return; }

            var p           = layer._point,
                x           = p.x,
                y           = p.y,
                ctx         = this._ctx,
                options     = layer.options,
                round       = options.round,
                dim         = options.dimension,
                halfDim     = options.radius,
                ctxOptions  = layer.ctxOptions;

            //Shadow
            ctx.beginPath();
            var shadowOffset = 1,
                lineWidth;
            if (options.shadow){
                lineWidth = 5;
                shadowOffset = 2.5;
                ctx.strokeStyle = options.fillStyle_shadow;
            }
            else {
                //Semi-transparent white ring/outline
                lineWidth = round ? 1.5 : 1;
                shadowOffset = 1;
                ctx.strokeStyle = 'rgb(255, 255, 255, .5)';
            }
            ctx.lineWidth = lineWidth;
            if (round)
                ctx.arc(x, y, halfDim + shadowOffset, 0, 2 * Math.PI);
            else {
                ctx.strokeRect(
                    x - halfDim - lineWidth/2,
                    y - halfDim - lineWidth/2,
                    dim + lineWidth,
                    dim + lineWidth
                );
            }
            ctx.stroke();


            $.extend(ctx, ctxOptions);


            //Background
            ctx.beginPath();
            if (!round){
                ctx.fillRect(x - halfDim, y - halfDim, dim, dim);
            }

            //Line
            if (ctxOptions.lineWidth){
                round ?
                    ctx.arc(x, y, halfDim + layer.lineOffset, 0, 2 * Math.PI) :
                    ctx.strokeRect(
                        x + layer.lineOffset,
                        y + layer.lineOffset,
                        dim - ctx.lineWidth,
                        dim - ctx.lineWidth
                    );
            }
            else
                if (round){
                    //Round without border => redraw shadow
                    ctx.lineWidth = .5;
                    ctx.strokeStyle = 'rgb(255, 255, 255, .5)';
                    ctx.arc(x, y, halfDim, 0, 2 * Math.PI);
                }

            ctx.fill();
            ctx.stroke();


            //Individuel drawing
            if (options.draw){
                ctx.beginPath();
                options.draw.apply(layer, [ctx, x, y, dim, halfDim, ctxOptions]);
                ctx.stroke();
            }
        }
    });


}(jQuery, L, this, document));

