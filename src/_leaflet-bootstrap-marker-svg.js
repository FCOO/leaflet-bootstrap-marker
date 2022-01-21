/****************************************************************************
leaflet-bootstrap-marker-svg.js

Extending L.CircleMarker with options for color, size (shadow and pulsart?)


****************************************************************************/
(function ($, L /*, window, document, undefined*/) {
    "use strict";

    //Create name-space L.BsMarker
    var ns = L.BsMarker = L.BsMarker || {};



    /**
     * Adds a svg icon to the map which you can style with any color with a rgb sring value.
     * Phil Willis
     */

    L.svgMarker = {
        defaultIconSize: [20,20], //[35, 35],
        defaultIconAnchor: [10, 10], //[17, 35],
        defaultPopupAnchor: [1, -35],
        defaultMarkerRgb: "rgb(84, 188, 255)"
      };

    function makeIconSvg(color,svg) {
        var icon;
        var fill = color;
        var border = 'black';//color.replace("rgb", "rgba").replace(")", ", 0.74)");
        if (!svg) {
          // Default SVG for the marker
          icon =
            '<svg version="1.1" class="svgMarker-marker" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="222.826px" height="300px" viewBox="0 0 222.826 300" enable-background="new 0 0 222.826 300" xml:space="preserve">' +
                '<path class="svgMarker-marker-outer" stroke="black" stroke-width="2" fill="none" XXfill="' +border +'" d="M102.612,1.725C84.106,4.293,74.831,6.91,62.176,13.094c-7.469,3.664-9.609,4.948-17.03,10.418 c-9.609,6.993-16.269,13.653-23.31,23.215C7.47,66.231,0.049,88.542,0.001,112.042c-0.047,11.56,1.855,21.597,6.708,35.917 c6.041,17.885,18.362,43.194,32.158,65.885c4.853,8.039,16.983,26.307,21.264,32.206c18.41,24.975,31.979,36.125,42.73,44.449 c2.331,1.808,6.48,4.668,7.907,4.668c1.379,0,5.983-2.86,8.361-4.668c8.944-6.801,26.819-21.474,38.665-37.837 c1.569-2.188,3.282-4.52,3.853-5.232c1.903-2.428,12.035-17.363,16.698-24.595c19.171-29.875,34.917-62.604,40.958-85.342 c2.616-9.753,3.568-16.46,3.521-25.451c0-34.728-16.936-67.884-45.146-88.53c-7.468-5.47-9.562-6.754-17.03-10.418 c-15.745-7.659-30.303-11.179-47.571-11.417C108.13,1.582,103.421,1.629,102.612,1.725z"/>' +
//                ' <path class="svgMarker-marker-inner" fill-opacity="1" fill="' +fill + '" d="M104.054,19.958c-15.474,2.148-23.231,4.336-33.812,9.507c-6.246,3.063-8.036,4.137-14.241,8.711 c-8.036,5.848-13.604,11.417-19.491,19.412c-12.014,16.31-18.219,34.966-18.259,54.617c-0.04,9.666,1.551,18.059,5.609,30.033 c5.052,14.956,15.354,36.119,26.89,55.094c4.058,6.722,14.201,21.997,17.781,26.93c15.395,20.884,27.089,34.249,36.08,41.21 c1.949,1.512,5.419,3.903,6.612,3.903c1.154,0,5.003-2.392,6.991-3.903c7.479-5.687,22.078-21.997,31.983-35.681 c1.313-1.83,2.745-3.779,3.222-4.375c1.592-2.03,10.063-14.52,13.963-20.566c16.03-24.98,29.197-52.349,34.249-71.362 c2.188-8.155,2.983-13.764,2.943-21.282c0-29.039-14.161-56.764-37.75-74.029c-6.245-4.574-7.995-5.648-14.241-8.711 c-13.166-6.404-25.339-9.348-39.778-9.547C108.667,19.839,104.73,19.878,104.054,19.958z"/>' +
             '</svg>';


          icon =
            '<svg version="1.1" class="svgMarker-marker" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">' +
                '<path class="svgMarker-marker-outer" stroke="black" stroke-width="2" fill="none" XXfill="' +border + '" d="M0,0 L0,20 L20,20 L20 0 Z"/>' +
//                ' <path class="svgMarker-marker-inner" fill-opacity="1" fill="' +fill + '" d="M104.054,19.958c-15.474,2.148-23.231,4.336-33.812,9.507c-6.246,3.063-8.036,4.137-14.241,8.711 c-8.036,5.848-13.604,11.417-19.491,19.412c-12.014,16.31-18.219,34.966-18.259,54.617c-0.04,9.666,1.551,18.059,5.609,30.033 c5.052,14.956,15.354,36.119,26.89,55.094c4.058,6.722,14.201,21.997,17.781,26.93c15.395,20.884,27.089,34.249,36.08,41.21 c1.949,1.512,5.419,3.903,6.612,3.903c1.154,0,5.003-2.392,6.991-3.903c7.479-5.687,22.078-21.997,31.983-35.681 c1.313-1.83,2.745-3.779,3.222-4.375c1.592-2.03,10.063-14.52,13.963-20.566c16.03-24.98,29.197-52.349,34.249-71.362 c2.188-8.155,2.983-13.764,2.943-21.282c0-29.039-14.161-56.764-37.75-74.029c-6.245-4.574-7.995-5.648-14.241-8.711 c-13.166-6.404-25.339-9.348-39.778-9.547C108.667,19.839,104.73,19.878,104.054,19.958z"/>' +
             '</svg>';


        }
        else {
            icon = svg;
        }


        // here's the trick, base64 encode the URL
        return "data:image/svg+xml;base64," + btoa(icon);
    }

    L.svgMarker.Icon = L.Icon.extend({
        options: {
            iconSize: L.svgMarker.defaultIconSize,
            iconAnchor: L.svgMarker.defaultIconAnchor,
            popupAnchor: L.svgMarker.defaultPopupAnchor,
            rgb: L.svgMarker.defaultMarkerRgb,
        },

        initialize: function(options) {
            options = L.setOptions(this, options);
            options.iconUrl = makeIconSvg(options.rgb, options.svg);
        }
    });

    L.svgMarker.icon = function(options) {
        return new L.svgMarker.Icon(options);
    };




//Leaflet-SVGIcon
//SVG icon for any marker class
//Ilya Atkin
//ilya.atkin@unh.edu

L.DivIcon.SVGIcon = L.DivIcon.extend({
    options: {
        "className": "svg-icon",
        "circleAnchor": null, //defaults to [iconSize.x/2, iconSize.x/2]
        "circleColor": null, //defaults to color
        "circleFillColor": "rgb(255,255,255)",
        "circleFillOpacity": null, //default to opacity
        "circleImageAnchor": null, //defaults to [(iconSize.x - circleImageSize.x)/2, (iconSize.x - circleImageSize.x)/2]
        "circleImagePath": null, //no default, preference over circleText
        "circleImageSize": null, //defaults to [iconSize.x/4, iconSize.x/4] if circleImage is supplied
        "circleOpacity": null, // defaults to opacity
        "circleRatio": 0.5,
        "circleText": "",
        "circleWeight": null, //defaults to weight
        "color": "rgb(0,102,255)",
        "fillColor": null, // defaults to color
        "fillOpacity": 0.4,
        "fontColor": "rgb(0, 0, 0)",
        "fontOpacity": "1",
        "fontSize": null, // defaults to iconSize.x/4
        "fontWeight": "normal",
        "iconAnchor": null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
        "iconSize": L.point(32,48),
        "opacity": 1,
        "popupAnchor": null,
        "shadowAngle": 45,
        "shadowBlur": 1,
        "shadowColor": "rgb(0,0,10)",
        "shadowEnable": false,
        "shadowLength": .75,
        "shadowOpacity": 0.5,
        "shadowTranslate": L.point(0,0),
        "weight": 2
    },
    initialize: function(options) {
        options = L.Util.setOptions(this, options)

        //iconSize needs to be converted to a Point object if it is not passed as one
        options.iconSize = L.point(options.iconSize)

        //in addition to setting option dependant defaults, Point-based options are converted to Point objects
        if (!options.circleAnchor) {
            options.circleAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.x)/2)
        }
        else {
            options.circleAnchor = L.point(options.circleAnchor)
        }
        if (!options.circleColor) {
            options.circleColor = options.color
        }
        if (!options.circleFillOpacity) {
            options.circleFillOpacity = options.opacity
        }
        if (!options.circleOpacity) {
            options.circleOpacity = options.opacity
        }
        if (!options.circleWeight) {
            options.circleWeight = options.weight
        }
        if (!options.fillColor) {
            options.fillColor = options.color
        }
        if (!options.fontSize) {
            options.fontSize = Number(options.iconSize.x/4)
        }
        if (!options.iconAnchor) {
            options.iconAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.y))
        }
        else {
            options.iconAnchor = L.point(options.iconAnchor)
        }
        if (!options.popupAnchor) {
            options.popupAnchor = L.point(0, (-0.75)*(options.iconSize.y))
        }
        else {
            options.popupAnchor = L.point(options.popupAnchor)
        }
        if (options.circleImagePath && !options.circleImageSize) {
            options.circleImageSize = L.point(Number(options.iconSize.x)/4, Number(options.iconSize.x)/4)
        }
        else {
            options.circleImageSize = L.point(options.circleImageSize)
        }
        if (options.circleImagePath && !options.circleImageAnchor) {
            options.circleImageAnchor = L.point(
                (Number(options.iconSize.x) - Number(options.circleImageSize.x))/2,
                (Number(options.iconSize.x) - Number(options.circleImageSize.y))/2
            )
        }
        else {
            options.circleImageAnchor = L.point(options.circleImageAnchor)
        }

        options.html = this._createSVG()
    },
    _createCircle: function() {
        var cx = Number(this.options.circleAnchor.x)
        var cy = Number(this.options.circleAnchor.y)
        var radius = this.options.iconSize.x/2 * Number(this.options.circleRatio)
        var fill = this.options.circleFillColor
        var fillOpacity = this.options.circleFillOpacity
        var stroke = this.options.circleColor
        var strokeOpacity = this.options.circleOpacity
        var strokeWidth = this.options.circleWeight
        var className = this.options.className + "-circle"

        var circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
            '" fill="' + fill + '" fill-opacity="'+ fillOpacity +
            '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity + '" stroke-width="' + strokeWidth + '"/>'

        return circle
    },
    _createCircleImage: function() {
        var x = this.options.circleImageAnchor.x
        var y = this.options.circleImageAnchor.y
        var height = this.options.circleImageSize.y
        var width = this.options.circleImageSize.x
        var href = this.options.circleImagePath

        var image = '<image x="' + x + '" y="' + y + '" height="' + height + '" width="' + width + '" href="' + href + '"</image>'

        return image
    },
    _createPathDescription: function() {
        var height = Number(this.options.iconSize.y)
        var width = Number(this.options.iconSize.x)
        var weight = Number(this.options.weight)
        var margin = weight / 2

        var startPoint = "M " + margin + " " + (width/2) + " "
        var leftLine = "L " + (width/2) + " " + (height - weight) + " "
        var rightLine = "L " + (width - margin) + " " + (width/2) + " "
        var arc = "A " + (width/4) + " " + (width/4) + " 0 0 0 " + margin + " " + (width/2) + " Z"

        var d = startPoint + leftLine + rightLine + arc

        return d
    },
    _createPath: function() {
        var pathDescription = this._createPathDescription()
        var strokeWidth = this.options.weight
        var stroke = this.options.color
        var strokeOpacity = this.options.opacity
        var fill = this.options.fillColor
        var fillOpacity = this.options.fillOpacity
        var className = this.options.className + "-path"

        var path = '<path class="' + className + '" d="' + pathDescription +
            '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
            '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>'

        return path
    },
    _createShadow: function() {
        var pathDescription = this._createPathDescription()
        var strokeWidth = this.options.weight
        var stroke = this.options.shadowColor
        var fill = this.options.shadowColor
        var className = this.options.className + "-shadow"

        var origin = (this.options.iconSize.x / 2) + "px " + (this.options.iconSize.y) + "px"
        var rotation = this.options.shadowAngle
        var height = this.options.shadowLength
        var opacity = this.options.shadowOpacity
        var blur = this.options.shadowBlur
        var translate = this.options.shadowTranslate.x + "px, " + this.options.shadowTranslate.y + "px"

        var blurFilter = "<filter id='iconShadowBlur'><feGaussianBlur in='SourceGraphic' stdDeviation='" + blur + "'/></filter>"

        var shadow = '<path filter="url(#iconShadowBlur") class="' + className + '" d="' + pathDescription +
            '" fill="' + fill + '" stroke-width="' + strokeWidth + '" stroke="' + stroke +
            '" style="opacity: ' + opacity + '; ' + 'transform-origin: ' + origin +'; transform: rotate(' + rotation + 'deg) translate(' + translate + ') scale(1, '+ height +')' +
            '"/>'

        return blurFilter+shadow
    },
    _createSVG: function() {
        var path = this._createPath()
        var circle = this._createCircle()
        var shadow = this.options.shadowEnable ? this._createShadow() : ""
        var innerCircle = this.options.circleImagePath ? this._createCircleImage() : this._createText()
        var className = this.options.className + "-svg"
        var width = this.options.iconSize.x
        var height = this.options.iconSize.y

        if (this.options.shadowEnable) {
            width += this.options.iconSize.y * this.options.shadowLength - (this.options.iconSize.x / 2)
            width = Math.max(width, 32)
            height += this.options.iconSize.y * this.options.shadowLength
        }

        var style = "width:" + width + "px; height:" + height

        var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="' + className + '" style="' + style + '">' + shadow + path + circle + innerCircle + '</svg>';

          svg =
            '<svg version="1.1" class="svgMarker-marker" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">' +
                '<path class="svgMarker-marker-outer" stroke="black" stroke-width="2" fill="none" XXfill="red" d="M0,0 L0,20 L20,20 L20 0 Z"/>' +
             '</svg>';


        return svg
    },
    _createText: function() {
        var fontSize = this.options.fontSize + "px"
        var fontWeight = this.options.fontWeight
        var lineHeight = Number(this.options.fontSize)

        var x = this.options.circleAnchor.x
        var y = this.options.circleAnchor.y + (lineHeight * 0.35) //35% was found experimentally
        var circleText = this.options.circleText
        var textColor = this.options.fontColor.replace("rgb(", "rgba(").replace(")", "," + this.options.fontOpacity + ")")

        var text = '<text text-anchor="middle" x="' + x + '" y="' + y + '" style="font-size: ' + fontSize + '; font-weight: ' + fontWeight +'" fill="' + textColor + '">' + circleText + '</text>'

        return text
    }
})

L.divIcon.svgIcon = function(options) {
    return new L.DivIcon.SVGIcon(options)
}

L.Marker.SVGMarker = L.Marker.extend({
    options: {
        "iconFactory": L.divIcon.svgIcon,
        "iconOptions": {}
    },
    initialize: function(latlng, options) {
        options = L.Util.setOptions(this, options)
        options.icon = options.iconFactory(options.iconOptions)
        this._latlng = latlng
    },
    onAdd: function(map) {
        L.Marker.prototype.onAdd.call(this, map)
    },
    setStyle: function(style) {
        if (this._icon) {
            var svg = this._icon.children[0]
            var iconBody = this._icon.children[0].children[0]
            var iconCircle = this._icon.children[0].children[1]

            if (style.color && !style.iconOptions) {
                var stroke = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.opacity+")")
                var fill = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.fillOpacity+")")
                iconBody.setAttribute("stroke", stroke)
                iconBody.setAttribute("fill", fill)
                iconCircle.setAttribute("stroke", stroke)

                this.options.icon.fillColor = fill
                this.options.icon.color = stroke
                this.options.icon.circleColor = stroke
            }
            if (style.opacity) {
                this.setOpacity(style.opacity)
            }
            if (style.iconOptions) {
                if (style.color) { style.iconOptions.color = style.color }
                var iconOptions = L.Util.setOptions(this.options.icon, style.iconOptions)
                this.setIcon(L.divIcon.svgIcon(iconOptions))
            }
        }
    }
})

L.marker.svgMarker = function(latlng, options) {
    return new L.Marker.SVGMarker(latlng, options)
}








































/********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************/

    /*****************************************************
    L.BsMarkerSVG
    Extend L.CircleMarker to draw marker as bsMarkerCircle
    *****************************************************/
    L.BsMarkerSVG = L.CircleMarker.extend({
        options: {
fillColor: 'green',
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
            canvasPadding: .1,

            NIELS: {
                //draw: function or string or array of XY with
            },
        },


        /*************************************************
        initialize
        *************************************************/
        initialize: function (latLng, options) {
            L.CircleMarker.prototype.initialize.apply(this, [latLng, options]);

            this.options = ns._adjustOptions( this.options );
            this.options.dimension = ns.size[this.options.size];

            this.options.radius = Math.floor(this.options.dimension / 2);
            this._radius = this.options.radius;

//this.options.NIELS = false;
            if (this.options.NIELS){
                var newOptions = $.extend({}, options, {NIELS: false, tooltip: false});
                this.innerXX = L.bsMarkerSVG(latLng, newOptions);
            }
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
        addTo
        *************************************************/
  	    addTo: function (_addTo) {
            return function(map){
console.log('addTo', this);
                var result = _addTo.apply(this, arguments);
                if (this.innerXX)
                    this.innerXX.addTo(map);
                return result;
            };
      	}(L.CircleMarker.prototype.addTo),


        /*************************************************
        onAdd
        *************************************************/
  	    onAdd: function (_onAdd) {
            return function(map){
                var result = _onAdd.apply(this, arguments);

//HERconsole.log('HER', this.innerXX);
//HER                if (this.innerXX)
//HER                    this.innerXX.addTo(map);

//HER//HERthis.innerPath = $(this._path).clone(true).get(0);
//HERconsole.log('this.innerPath', this.innerPath);
//HERconsole.log('typeof', typeof this._path);

                if (this.options.tooltip)
                    this.bindTooltip(this.options.tooltip);


if (this.innerXX){
                this.on('mouseover', this._mouseover, this);
                this.on('mouseout', this._mouseout, this);
}
/*
                this.on('popupopen',  this._popupopen,  this);
                this.on('popupclose', this._popupclose, this);
*/

//HER                if (this.innerPath){
//HER  		            this._renderer._rootGroup.appendChild(this.innerPath);
//HER  		            this.addInteractiveTarget(this.innerPath);
//HER
//HER//HER  		            this._rootGroup.appendChild(layer._path);
//HER//HER  		            layer.addInteractiveTarget(layer._path);
//HER
//HER//                    this._renderer._addPath(this.innerPath);
//HER
//HER    //HER  		        this._renderer._initPath(this);
//HER//HER      		    this._reset();
//HER//HER  	    	    this._renderer._addPath(this);
//HER                }
//HERthis.redraw();
                return result;
            };
      	}(L.CircleMarker.prototype.onAdd),

        /*************************************************
        onRemove
        *************************************************/
      	onRemove: function (_onRemove) {
            return function(){
                var result = _onRemove.apply(this, arguments);

                this.off('mouseover', this._mouseover, this);
                this.off('mouseout', this._mouseout, this);

                this.off('popupopen',  this._popupopen,  this);
                this.off('popupclose', this._popupclose, this);

//HER  	    	    this._renderer._removePath(this);

//                if (this.innerPath)
//                    this._renderer._removePath(this.innerPath);

                return result;
            };
      	}(L.CircleMarker.prototype.onRemove),


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
console.log('OVER');
return;
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
console.log('OUT');
return;
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
            this._renderer._updateMarkerSVG(this);
console.log(this.innerXX);
            if (this.innerXX && this.innerXX._path)
                this.innerXX._updatePath();

        },





        bringToFront: function (_bringToFront) {
            return function(){
                _bringToFront.apply(this, arguments);

if (this.innerXX)
    this.innerXX.bringToFront();


//HER                if (this.innerPath && this._renderer)
//HER                    this._renderer._bringToFront(this.innerPath);

  		        return this;
            };
        }(L.CircleMarker.prototype.bringToFront)

   });

    L.bsMarkerSVG = function bsMarkerSVG(latLng, options) {
        return new L.BsMarkerSVG(latLng, options);
    };





    /*****************************************************
    Extend L.SVG with method to draw the marker
M = moveto
L = lineto
H = horizontal lineto
V = vertical lineto
C = curveto
S = smooth curveto
Q = quadratic Bézier curve
T = smooth quadratic Bézier curveto
A = elliptical Arc
Z = closepath
    *****************************************************/
    L.SVG.include({
      	_updateMarkerSVG: function (layer) {
  	    	var p = layer._point,
  		        r = Math.max(Math.round(layer._radius), 1),
                s = r,
      		    arc = 'a' + r + ',' + r + ' 0 1,0 ',
                d = '', d2 = '';
/*
  	    	// drawing a circle with two half-arcs
  		    d = layer._empty() ? 'M0 0' :
  			    'M' + (p.x - r) + ',' + p.y +
      			arc + (r * 2) + ',0 ' +
  	    		arc + (-r * 2) + ',0 Z';
*/
//            d = d + "M "+ (p.x-s)+ " "+ (p.y)+ ", L " + (p.x) +" "+ (p.y-s)+ ", L"  + (p.x+s) + " " + (p.y)+ ", L"  + (p.x) + " " + (p.y+s) +", L"  + (p.x-s) + " " + (p.y);

if (!layer.innerXX)
    s = s/2;
            d = d + 'M '+ (p.x-s)+ ' '+ (p.y-s)+ ', L ' + (p.x+s) +' '+ (p.y-s)+ ', L'  + (p.x+s) + ' ' + (p.y+s)+ ', L'  + (p.x-s) + ' ' + (p.y+s) +', L'  + (p.x-s) + ' ' + (p.y-s);
            s = s/2;
            d2 = d2 +
                'M ' + (p.x+s) + ' ' + (p.y-s) + ', ' +
                'L ' + (p.x-s) + ' ' + (p.y-s) + ', ' +

//HER                'M ' + (p.x-s) + ' ' + (p.y-s) + ', ' +
//HER                'L ' + (p.x+s) + ' ' + (p.y-s) + ', ' +

                'M ' + (p.x+s) + ' ' + (p.y-s) + ', ' +
                'L'  + (p.x+s) + ' ' + (p.y+s) + ', ' +

//                'L'  + (p.x-s) + ' ' + (p.y+s) + ', ' +
//                'L'  + (p.x-s) + ' ' + (p.y-s) +
                '';

/*
var $p = $(layer._path),
    p2 = $p.clone().insertAfter($p).get(0);

//$p2.get(0).v = d2;

console.log(layer, layer._path, p2);
*/
//HERconsole.log($p2);
//HER            layer._path.setAttribute('stroke', 'red');
//HER            layer._path.setAttribute('fill', 'blue');
//HER            layer._path.setAttribute('fill-opacity', '1');

//HERconsole.log(layer);
//HER            layer.innerPath.setAttribute('fill', 'green');
//HER            layer.innerPath.setAttribute('fill-opacity', '1');

//HER  			path.setAttribute('stroke-opacity', options.opacity);
//HER  			path.setAttribute('stroke-width', options.weight);

//HER            if (layer.innerPath){
//HER                layer.innerPath.setAttribute('stroke', 'yellow');
//HER                layer.innerPath.setAttribute('d', d2);
//HER  		        layer.innerPath.v = d2;
//HER  		        layer.innerPath.v = d2;
//HER            }

//HERconsole.log(layer.innerXX);
            if (!layer.options.NIELS){
                layer._path.setAttribute('fill', 'yellow');
                layer._path.setAttribute('fill-opacity', '1');
            }
  		    this._setPath(layer, d);//layer.options.NIELS ? d : d2);
//HER            if (layer.innerXX && layer.innerXX._path){
//HER                layer.innerXX._path.setAttribute('stroke', 'red');
//HER                this._setPath(layer.innerXX, d2);
//HER  	        }
  	    }

    });

    /*****************************************************
    Extend L.Canvas with method to draw the marker
    *****************************************************/
/*
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
*/

}(jQuery, L, this, document));

