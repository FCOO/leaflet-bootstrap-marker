/****************************************************************************
leaflet-bootstrap-marker-base.js,

Base object-class for all type of markers

****************************************************************************/
(function ($, L, window/*, document, undefined*/) {
    "use strict";


    //Create name-space L.BsMarker
    var ns = L.BsMarker = L.BsMarker || {};

    //size = {id: width}
    ns.ORIGINAL_size = {
        xs:  8,
        sm: 14,
        nl: 20,
        lg: 26,
        xl: 32,
    };
    ns.size = {
        xs:  8,
        sm: 14,
        nl: 24,
        lg: 32,
        xl: 42,
    };


    ns.iconList = []; //[TYPE][SIZE] of L.divIcon or other icon

    //colorNameToColor = list of name:color.MUST match the list in src/_leaflet-bootstrap-marker-colors.scss
    var colorNameToColor = {
            pink      : 'pink',
            purple    : 'purple',
            red       : 'red',
            orange    : 'orange',
            yellow    : 'yellow',
            green     : 'green',
            cyan      : 'cyan',
            blue      : 'blue',
            brown     : 'brown',
            white     : 'white',
            grey      : 'grey',
            black     : 'black',
            indigo    : 'indigo',
            teal      : 'teal',
            darkgray  : 'darkgray',
            primary   : null, // = $primary,
            secondary : null, // = $secondary,
            success   : null, // = $success,
            info      : null, // = $info,
            warning   : null, // = $warning,
            danger    : null, // = $danger,
            light     : null, // = $light,
            dark      : null, // = $dark,
            standard  : '#4285F4' //= rgba(66, 133, 244) = google maps color for location icon
    };

    //Get color-values from Bootstrap-variables
	$(function() {
        var $div = $('<div/>').appendTo($('body'));
        $.each(colorNameToColor, function(colorName, color){
            if (!color)
                colorNameToColor[colorName] = $div.removeClass().addClass('bg-'+colorName).css("background-color");
        });
        $div.remove();
	});

    /*****************************************************
    L.bsMarkerAsIcon
    Return the options to create a icon locking like a bsMarker[TYPE]
    with the given color and border-color
    *****************************************************/
    L.bsMarkerAsIcon = function(colorName, borderColorName, faClassName /*options*/){
        return $.bsMarkerIcon(
                    'fa-lbm-color-'+(colorName || 'white'),
                    'fa-lbm-border-color-'+(borderColorName || 'black'),
                    faClassName ? {faClassName: faClassName} : null
               );
    };

    /*****************************************************
    L.BsMarkerBase
    *****************************************************/
    L.BsMarkerBase = L.Marker.extend({
        options: {
            type       : 'base',  //Type of the marker
            size       : 'nl',    //Size of the marker. Possble values: 'extrasmall'/'sx', 'small'/'sm', '', 'large'/'lg', 'xlarge'*'xl'

            scale      : null,    //Value = 80, 90, 120, 130 or 150: Scale specific icons to fit the other icons. Only for icon-marker

            iconClass     : '',          //Fontawesome Font class-name ("fa-marker") for icon
            innerIconClass: '',          //Fontawesome Font class-name ("fa-home") for icon inside the marker
            faClassName   : 'fa-circle', //fa-class to be used when create the marker as fa-icon. Default is fa-circle


//HER            iconSize        : 0,         //0: normal, 1. larger with icon or number, 2: Very large (touch-mode)
//HER            round           : true,      //If false the icon is square
//HER            number          : undefined, //Number inside the marker

            draggable       : false,     //Whether the marker is draggable with mouse/touch or not.
            autoPan         : true,      //Set to true if you want the map to do panning animation when marker hits the edges.

//HER            useBigIcon      : false,     //True to make the icon big
//HER            bigIconWhenTouch: false,     //True to make big icon when window.bsIsTouch == true and options.draggable == true

            useTouchSize    : false, //True to make size = large when window.bsIsTouch == true and options.draggable == true

            transparent     : false, //True to make the marker semi-transparent
            hover           : false, //True to show shadow and 0.9 opacuity for lbm-transparent when hover
            shadow          : false, //true to add a shadow to the marker
            puls            : false, //true to have a pulsart icon
            thickBorder     : false, //true to have thicker border

            optionsWithClass: ['transparent', 'shadow', 'hover', 'thickBorder', 'puls'],

            colorName      : '',    //or fillColor: Name of inside fill-color of the marker
            borderColorName: '',    //or lineColor: Name of border/line-color of the marker

            setColor : {
                alsoAsCss  : false, //color are set by class-name, true: color are also set directly by css-attr using cssAttrName
                cssAttrName: 'background-color'
            },
            setBorderColor: {
                alsoAsCss  : true, //color are set by class-name, true: color are also set directly by css-attr using cssAttrName
                cssAttrName: 'border-color'
            },

            //Default FACTORS for size and anchor for the icon
            iconSize   : {width: 1, height: 1},
            iconAnchor : null, //{width: 0, height: 0},
            popupAnchor: null, //{width: 0, height: 0},

            //Css for inner text-div. Used to adjust font-size and/or top-position for specific icon-class
            innerCss: {}, //{"font-size": "0.4em", top: "-4.2em" }

            rotatable      : false, //If true the marker can be rotated using .setDirection(...)
            direction      : 0, //direction
            directionOffset: 0, //Offset for direction if the icon is not N-S

            tooltip                 : null,     //Content of tooltip
            tooltipPermanent        : false,    //Whether to open the tooltip permanently or only on mouseover.
            tooltipHideWhenDragging : false,    //True and tooltipPermanent: false => the tooltip is hidden when dragged
            tooltipHideWhenPopupOpen: false,    //True and tooltipPermanent: false => the tooltip is hidden when popup is displayed
            shadowWhenPopupOpen     : true      //When true a big-sdhadow is shown when the popup for the marker is open
        },

        /*****************************************************
        _adjustOptions
        *****************************************************/
        _adjustOptions: function( options ){
            options = options || this.options;

            options.colorName = options.colorName || options.fillColorName;
            options.borderColorName = options.borderColorName || options.lineColorName;
            options.color = options.color || options.textColor || options.iconColor;
            options.size = options.size.toLowerCase();
            options.size =  options.size == 'extrasmall' ? 'xs' :
                            options.size == 'small' ? 'sm' :
                            options.size == 'large' ? 'lg' :
                            options.size == 'xlarge' ? 'xl' :
                            options.size == 'normal' ? 'nl' :
                            options.size;

            if ($.type(options.useTouchSize) !== 'boolean')
                options.useTouchSize = !!options.bigIconWhenTouch;

            this.options = options;
            return options;
        },

        /*****************************************************
        initialize
        *****************************************************/
        initialize: function(latLng, options){
            //Adjust options
            if (options && options.bigIconWhenTouch && options.draggable && window.bsIsTouch)
                options.size = 'lg';


            L.Marker.prototype.initialize.call(this, latLng, options);

            this.on('dragstart',  this._bsMarkerBase_dragstart,  this);
            this.on('dragend',    this._bsMarkerBase_dragend,    this);
            this.on('popupopen',  this._bsMarkerBase_popupopen,  this);
            this.on('popupclose', this._bsMarkerBase_popupclose, this);

            return this;
        },

        /*****************************************************
        createIcon - create the icon-object in given size (*)
        *****************************************************/
        createIcon: function(/* sizeId, options */){
            return null;
        },

        /*****************************************************
        getIcon - return the icon-object in given size
        *****************************************************/
        getIcon: function( sizeId ){
            function point( width, whFactor ){
                return  whFactor ?
                        L.point(
                            Math.round( (whFactor.width  || 0)*width ),
                            Math.round( (whFactor.height || 0)*width )
                        ) :
                        null;
            }

            var iconList = ns.iconList[this.options.type] = ns.iconList[this.options.type] || [],
                width = ns.size[sizeId],
                className = 'lbm-type-'+this.options.type;

            if (this.options.scale){
                width = Math.round( width * this.options.scale / 100 );
                className = className + ' lbm-scale-'+this.options.scale;
            }

            var iconOptions = {
                    className  : className,
                    html       : '',
                    iconSize   : point( width, this.options.iconSize    ),
                    iconAnchor : point( width, this.options.iconAnchor  ),
                    popupAnchor: point( width, this.options.popupAnchor ),
                },
                iconId = sizeId + '_' + (this.options.iconClass || ''),
                result = iconList[iconId] = iconList[iconId] || this.createIcon(sizeId, iconOptions);
            return result;
        },

        /*****************************************************
        getElements
        *****************************************************/
        getElements: function(){
            this.$icon        = $(this._icon);
            this.$background  = this.$icon;
            this.$border      = this.$icon;
            this.$innerParent = this.$icon;
            this.$inner       = this.$icon.find('.inner');
            this.$direction   = null;
        },

        /*****************************************************
        updateIcon
        Update the marker regarding all options except size
        *****************************************************/
        updateIcon: function(options){
            this._adjustOptions(options);

            this.getElements();

            //Set options using differnet class-names on $icon
            var _this = this;

            $.each(this.options.optionsWithClass, function( index, id ){
                _this.toggleOption(id, !!_this.options[id] );
            });

            if (this.options.colorName)
                this.setColor(this.options.colorName);
            if (this.options.borderColorName)
                this.setBorderColor(this.options.borderColorName);

            if (this.options.number !== undefined)
                this.setNumber(this.options.number);

            if (this.options.innerIconClass)
                this.setInnerIconClass(this.options.innerIconClass);

            if (this.options.direction || this.options.directionOffset)
                this.setDirection( this.options.direction, !!this.options.directionOffset );

        },

        /*****************************************************
        onAdd
        *****************************************************/
        onAdd: function( map ){
            var result = L.Marker.prototype.onAdd.call(this, map);

            if (this.options.tooltip)
                this.bindTooltip(this.options.tooltip);

            this.setSize(this.options.size);

            return result;
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
            this.toggleClass( 'lbm-'+optionId, this.options[optionId]);
        },

        /*****************************************************
        setSize
        *****************************************************/
        setSize: function(size){
            var className = '',
                tooltip = this.getTooltip();

            if (this.$icon){
                this.$icon.removeClass('lbm-type-'+this.options.type+' lbm-size-'+this.size);
                className = this.$icon.attr('class');
            }

            if (tooltip)
                $(tooltip._container).removeClass('leaflet-tooltip-icon-'+this.size);

            this.options.size = size || this.options.size;
            this._adjustOptions();
            this.size = this.options.size;

            this.options.icon = this.getIcon( this.size );
            this.setIcon( this.options.icon );

            this.$icon = $(this._icon);

            this.$icon.addClass('lbm-base ' + className + ' lbm-type-'+this.options.type+' lbm-size-'+this.size);
            if (tooltip)
                $(tooltip._container).addClass('leaflet-tooltip-icon-'+this.size);

            this.updateIcon();
            return this;
        },

        /*****************************************************
        setColor( colorName )
        *****************************************************/
        setColor: function( colorName ){
            this._setAnyColor( 'colorName', colorName, 'lbm-color-', this.$background, this.options.setColor);
            this._setTextColor();
            return this;
        },

        /*****************************************************
        setBorderColor( borderColorName )
        *****************************************************/
        setBorderColor: function( borderColorName ){
            return this._setAnyColor( 'borderColorName', borderColorName, 'lbm-border-color-', this.$border, this.options.setBorderColor);
        },


        _setAnyColor: function( id, newColorName, classNamePrefix, $element, options ){
            if (this[id])
                this.removeClass(classNamePrefix + this[id]);
            this[id] = newColorName;

            this.addClass(classNamePrefix + newColorName);
            if (options.alsoAsCss)
                $element.css(options.cssAttrName, colorNameToColor[newColorName]);
            return this;
        },

        /*****************************************************
        _setTextColor()
        *****************************************************/
        _setTextColor: function(){
            var bgColorRGBStr = this.$background.first().css( this.options.setColor.cssAttrName),
                bgColorRGB = bgColorRGBStr.split("(")[1].split(")")[0].split(','),
                color = window.colorContrastRGB(parseInt(bgColorRGB[0]), parseInt(bgColorRGB[1]), parseInt(bgColorRGB[2])),
                colorIsBlack = (color == '#000000');
                this.$icon.toggleClass('lbm-text-is-black', colorIsBlack);
                this.$icon.toggleClass('lbm-text-is-white', !colorIsBlack);
        },

        /*****************************************************
        setIconClass( innerIconClass )
        setInnerIcon( innerIconClass )
        setInnerIconClass( innerIconClass )
        *****************************************************/
        setIconClass: function(){ return this.setInnerIconClass.apply(this, arguments); },
        setInnerIcon: function(){ return this.setInnerIconClass.apply(this, arguments); },

        setInnerIconClass: function( innerIconClass ){
            //If this.$inner don't exists => create it
            if (!this.$inner || !this.$inner.length)
                this.$inner =
                    $('<div/>')
                        .addClass('inner')
                        .css(this.options.innerCss)
                        .appendTo(this.$innerParent);

            this.$inner.empty().removeClass('text');
            this.options.innerIconClass = innerIconClass || '';
            if (this.options.innerIconClass)
                $._bsCreateIcon(this.options.innerIconClass, this.$inner);
            return this;
        },

        /*****************************************************
        setNumber( number )
        *****************************************************/
        setNumber: function( number ){
            this.$inner.empty().addClass('text');
            this.options.number = $.isNumeric(number) ? number : null;
            if ($.isNumeric(this.options.number))
                this.$inner.text(this.options.number);
        },


        /*****************************************************
        setDirection( direction )
        *****************************************************/
        setDirection: function( direction, force ){
            this.options.direction = (direction || 0) % 360;
            if (this.$direction && (this.options.rotatable || force))
                this.$direction.css('transform', 'rotate(' + ( this.options.direction + (this.options.directionOffset || 0) ) +'deg)');

            return this;
        },

        /*****************************************************
        setDeltaDirection( deltaDirection )
        *****************************************************/
        setDeltaDirection: function( deltaDirection ){
            return this.setDirection( this.options.direction + (deltaDirection || 0) );
        },


        /*****************************************************
        asIcon()
        Return a json-record to be used as icon-options in any
        jquery-bootstrap content-options (eq. as header)
        *****************************************************/
        asIcon: function(){
            return L.bsMarkerAsIcon(this.colorName, this.borderColorName, this.options.faClassName);
        },

        /*****************************************************
        EVENTS
        _bsMarkerBase_popupopen : Add shadow and remove transparent and hover (if set) when popup is open
        _bsMarkerBase_popupclose: Reset shadow, transparent, adn hover when popup is closed
        _bsMarkerBase_dragstart : Fired when the drag starts: Mark the map to ignore next click
        _bsMarkerBase_dragend   : Fired when the drag ends: Mark the map to include click within 10ms
        *****************************************************/
        _bsMarkerBase_popupopen: function(){
            this._bringToFront();
            if (this.options.shadowWhenPopupOpen && !this.options.shadow)
                this.addClass( 'lbm-shadow' );
            if (this.options.transparent)
                this.removeClass( 'lbm-transparent' );
            if (this.options.hover)
                this.removeClass( 'lbm-hover' );
        },
        _bsMarkerBase_popupclose: function(){
            if (this.options.shadowWhenPopupOpen && !this.options.shadow)
                this.removeClass( 'lbm-shadow' );
            if (this.options.transparent)
                this.addClass( 'lbm-transparent' );
            if (this.options.hover)
                this.addClass( 'lbm-hover' );
        },
        _bsMarkerBase_dragstart: function(){
            this._map.ignoreNextEvent('click');
        },
        _bsMarkerBase_dragend: function(){
            setTimeout( $.proxy( this._map.includeNextEvent, this._map, 'click'), 100 );
        },

    });


    L.bsMarkerBase = function bsMarkerBase(latlng, options) {
        return new L.BsMarkerBase(latlng, options);
    };

}(jQuery, L, this, document));

