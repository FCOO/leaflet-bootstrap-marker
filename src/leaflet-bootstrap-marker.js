/****************************************************************************
leaflet-bootstrap-marker.js,

Create L.bsMarker = a round marker with options for color, shadow and pulsart

****************************************************************************/
(function ($, L, window, document, undefined) {
    "use strict";

    /*****************************************************
    L.bsMarkerAsIcon
    Return the options to create a icon locking like a bsMarker
    with the given color and border-color
    *****************************************************/
    L.bsMarkerAsIcon = function(colorName, borderColorName, options){
        colorName = colorName || 'white';
        borderColorName = borderColorName || 'black';
        return $.bsMarkerIcon('fa-lbm-icon-'+colorName, 'fa-lbm-icon-border-'+borderColorName, options);
    };


    var markerSizeList = [14, 20, 24], //MUST match $markerSizeList in _leaflet-bootstrap-marker.scss AND _leaflet-bootstrap-tooltip.scss
        iconList = [];
    $.each( markerSizeList, function( index, size ){
        iconList.push( L.divIcon({iconSize: [size, size], className: 'lbm-icon lbm-icon-'+index }) );
    });


    //Extend L.Map with ignoreNextEvent(type) and includeNextEvent(type) to prevent the next firing of a event
    L.Map.prototype.fire = function ( fire ){
        return function ( type ) {
            return this._ignoreNextEvent[type] ? this.includeNextEvent( type ) : fire.apply(this, arguments);
        };
    } (L.Map.prototype.fire);

    L.Map.prototype.initialize = function (initialize) {
        return function () {
            this._ignoreNextEvent = {};
            return initialize.apply(this, arguments);
        };
    } (L.Map.prototype.initialize);


    L.Map.prototype.ignoreNextEvent = function( type ){
        this._ignoreNextEvent[type] = true;
        return this;
    };
    L.Map.prototype.includeNextEvent = function( type ){
        this._ignoreNextEvent[type] = false;
        return this;
    };

    var classNames = {
            round        : 'lbm-round',
            transparent  : 'lbm-transparent',
            shadow       : 'lbm-shadow',
            hover        : 'lbm-hover',
            puls         : 'lbm-puls',
            thickBorder  : 'lbm-thick-border'
        };

    /*****************************************************
    L.BsMarker
    *****************************************************/
    L.BsMarker = L.Marker.extend({
        options: {
            icon            : iconList[0],

            iconSize        : 0,         //0: normal, 1. larger with icon or umber, 2: Very large (touch-mode)
            iconClass       : '',        //Fontawesome Font class-name ("fa-home") for icon inside the marker
            round           : true,      //If false the icon is square
            number          : undefined, //Number inside the marker

            draggable       : false,     //Whether the marker is draggable with mouse/touch or not.
            autoPan         : true,      //Set to true if you want the map to do panning animation when marker hits the edges.

            useBigIcon      : false,     //True to make the icon big
            bigIconWhenTouch: false,     //True to make big icon when window.bsIsTouch == true and options.draggable == true
            transparent     : false,     //True to make the marker semi-transparent
            hover           : false,     //True to show shadow and 0.9 opacuity for lbm-transparent when hover
            shadow          : false,     //true to add a shadow to the marker
            puls            : false,     //true to have a pulsart icon
            colorName       : '',    	 //Class-name to give the color of the marker
            borderColorName : '',        //Class-name to give the border-color
            thickBorder     : false,    //true to have thicker border


            tooltip                 : null,     //Content of tooltip
            tooltipPermanent        : false,    //Whether to open the tooltip permanently or only on mouseover.
            tooltipHideWhenDragging : false,    //True and tooltipPermanent: false => the tooltip is hidden when dragged
            tooltipHideWhenPopupOpen: false,    //True and tooltipPermanent: false => the tooltip is hidden when popup is displayed
            shadowWhenPopupOpen     : true      //When true a big-sdhadow is shown when the popup for the marker is open
        },

        /*****************************************************
        initialize
        *****************************************************/
        initialize: function(latLng, options){
            L.Marker.prototype.initialize.call(this, latLng, options);

            if (this.options.useBigIcon)
                this.iconSizeIndex = 2;
            else
                //Change to big icon if bigIconWhenTouch == false and window.bsIsTouch == true and options.draggable == true
                if (this.options.bigIconWhenTouch && this.options.draggable && window.bsIsTouch)
                    this.iconSizeIndex = 2;
                else
                    this.iconSizeIndex = this.options.iconSize || 0;

            //Create $icon to hold class-names
            this.$icon = $('<div/>');

            var _this = this;
            $.each(['round', 'transparent', 'shadow', 'hover', 'puls', 'thickBorder'], function( index, id ){
                _this.toggleOption(id, !!_this.options[id] );
            });

            if (this.options.colorName)
                this.setColor(this.options.colorName);
            if (this.options.borderColorName)
                this.setBorderColor(this.options.borderColorName);

            //this.setSize(this.iconSizeIndex);

            this.on('dragstart', this._bsMarker_onDragStart, this );
            this.on('dragend',   this._bsMarker_onDragEnd,   this );

            this.on('popupopen',  this._popupopen, this);
            this.on('popupclose', this._popupclose, this);
        },

        /*****************************************************
        setSize
        *****************************************************/
        setSize: function(sizeIndex){

            this.$icon.removeClass('lbm-icon-'+this.iconSizeIndex);
            var className = this.$icon.get(0).className,
                tooltip = this.getTooltip();
            if (tooltip)
                $(tooltip._container).removeClass('leaflet-tooltip-icon-'+this.iconSizeIndex);

            this.iconSizeIndex = sizeIndex;

            this.setIcon( iconList[sizeIndex] );
            this.$icon = $(this._icon);
            this.$icon.addClass(className+' lbm-icon-'+sizeIndex);
            if (tooltip)
                $(tooltip._container).addClass('leaflet-tooltip-icon-'+this.iconSizeIndex);
        },


        /*****************************************************
        onAdd
        *****************************************************/
        onAdd: function( map ){
            L.Marker.prototype.onAdd.call(this, map);

            this.$content = null;

            if (this.options.tooltip)
                this.bindTooltip(this.options.tooltip);

            this.setSize(this.iconSizeIndex);
            if (this.options.number !== undefined)
                this.setNumber(this.options.number);
            if (this.options.iconClass)
                this.setIconClass(this.options.iconClass);

        },

        /*****************************************************
        addClass, removeClass, toggleClass
        *****************************************************/
        addClass   : function(){ this.$icon.addClass.apply   ( this.$icon, arguments ); },
        removeClass: function(){ this.$icon.removeClass.apply( this.$icon, arguments ); },
        toggleClass: function(){ this.$icon.toggleClass.apply( this.$icon, arguments ); },

        /*****************************************************
        toggleOption(optionId) - Toggle the state of options[optionId]
        *****************************************************/
        toggleOption: function( optionId, state ){
            this.options[optionId] = typeof state === "boolean" ? state : !this.options[optionId];
            this.toggleClass( classNames[optionId], this.options[optionId]);
        },

        /*****************************************************
        setColor( colorName )
        *****************************************************/
        setColor: function( colorName ){
            if (this.colorName)
                this.removeClass('lbm-'+this.colorName);
            this.colorName = colorName;
            if (this.colorName)
                this.addClass('lbm-'+this.colorName);
        },

        /*****************************************************
        setBorderColor( borderColorName )
        *****************************************************/
        setBorderColor: function( borderColorName ){
            if (this.borderColorName)
                this.removeClass('lbm-border-'+this.colorName);
            this.borderColorName = borderColorName;
            if (this.borderColorName)
                this.addClass('lbm-border-'+this.borderColorName);
        },

        /*****************************************************
        setIconClass( icon )
        *****************************************************/
        setIconClass: function( icon, minSize ){
            if (minSize && (minSize > this.iconSizeIndex))
                this.setSize( minSize );
            this.$icon.empty();
            $._bsCreateIcon('fa-home', this.$icon);
        },
        /*****************************************************
        setNumber( number )
        *****************************************************/
        setNumber: function( number, minSize ){
            if (minSize && (minSize > this.iconSizeIndex))
                this.setSize( minSize );
            this.$icon.empty();
            $('<div/>')
                .addClass('inner-text')
                .text(number)
                .appendTo( this.$icon );
        },


        /*****************************************************
        asIcon()
        *****************************************************/
        asIcon: function( options ){
            options = $.extend(
                        this.options.round ? {} : {baseClass: 'fa-square'},
                        options || {}
                      );
            return L.bsMarkerAsIcon(this.colorName, this.borderColorName, options);
        },

        /*****************************************************

        *****************************************************/
        _popupopen: function(){
            this._bringToFront();
            if (this.options.shadowWhenPopupOpen && !this.options.shadow)
                this.addClass( classNames['shadow'] );
            if (this.options.transparent)
                this.removeClass( classNames['transparent'] );
            if (this.options.hover)
                this.removeClass( classNames['hover'] );
        },
        _popupclose: function(){
            if (this.options.shadowWhenPopupOpen && !this.options.shadow)
                this.removeClass( classNames['shadow'] );
            if (this.options.transparent)
                this.addClass( classNames['transparent'] );
            if (this.options.hover)
                this.addClass( classNames['hover'] );
        },

        /*****************************************************
        _bsMarker_onDragStart - Fired when the drag starts: Mark the map to ignore next click
        _bsMarker_onDragEnd - Fired when the drag ends: Mark the map to include click within 10ms
        *****************************************************/
        _bsMarker_onDragStart: function(){
            this._map.ignoreNextEvent('click');
        },

        _bsMarker_onDragEnd  : function(){
            setTimeout( $.proxy( this._map.includeNextEvent, this._map, 'click'), 100 );
        },

    });


    L.bsMarker = function bsMarker(latlng, options) {
        return new L.BsMarker(latlng, options);
    };

}(jQuery, L, this, document));

