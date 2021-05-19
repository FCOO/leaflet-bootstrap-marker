/****************************************************************************
leaflet-bootstrap-marker-base.js,

Base object-class for all type of markers

****************************************************************************/
(function ($, L, window/*, document, undefined*/) {
    "use strict";


    //Create name-space L.BsMarker
    var ns = L.BsMarker = L.BsMarker || {};

    //size = {id: width}
/*
    ns.ORIGINAL_size = {
        xs:  8,
        sm: 14,
        nl: 20,
        lg: 26,
        xl: 32,
    };
*/
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
    Can be used in four ways:
        1:  L.bsMarkerAsIcon(options: OBJECT)
                options = same as for BsMarkerBase BsMarkerCircle

        2:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, round: BOOLEAN = true)

        3:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, faClassName: STRING)

        4:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, options: OBJECT)
                options = {
                    faClassName   : STRING (default = 'fa-circle'),
                    extraClassName: STRING (default = '')}
                }
    *****************************************************/
    L.bsMarkerAsIcon = function(a, b = '', c = true){
        var colorName       = 'white',
            borderColorName = 'black',
            options         = {};

        //1: (OBJECT)
        if (typeof a === 'object'){
            colorName       = a.colorName || colorName;
            borderColorName = a.borderColorName || borderColorName;
            if (a.noBorder)
                borderColorName = colorName;

            options.faClassName = a.faClassName || '';
            if (!options.faClassName && (a.round === false))
                options.faClassName = 'fa-square';
        }
        else {
            //2:, 3:, or 4:
            colorName = a || colorName;
            borderColorName = b || borderColorName;

            if (typeof c === 'boolean')
                //2: (STRING, STRING, BOOLEAN)
                if (!c)
                    options.faClassName = 'fa-square';

            else

            if (typeof c === 'string')
                //3: (STRING, STRING, STRING)
                options.faClassName = c;

            else

            if (typeof c === 'object')
                //4: (STRING, STRING, OBJECT)
                options = c;

        }

        return $.bsMarkerAsIcon(
                    'fa-lbm-color-'+colorName,
                    'fa-lbm-border-color-'+borderColorName,
                    options
               );
    };

    /*****************************************************
    L.BsMarkerBase
    *****************************************************/
    L.BsMarkerBase = L.Marker.extend({
        options: {
            type       : 'base',  //Type of the marker
            size       : 'nl',    //Size of the marker. Possble values: 'extrasmall'/'sx', 'small'/'sm', '', 'large'/'lg', 'xlarge'*'xl'

            scale      : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale specific icons to fit the other icons. Only for icon-marker
            scaleY     : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale height of specific icons to better fit icons with very low height
            scaleInner : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale inner icon in type=circle

            iconClass     : '',          //Fontawesome Font class-name ("fa-marker") for icon
            innerIconClass: '',          //Fontawesome Font class-name ("fa-home") for icon inside the marker
            faClassName   : 'fa-circle', //fa-class to be used when create the marker as fa-icon. Default is fa-circle

            markerClassName: '', //Extra class added to the marker

//HER            iconSize        : 0,         //0: normal, 1. larger with icon or number, 2: Very large (touch-mode)

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
            thinBorder      : false, //True to have a thin border
            noBorder        : false, //True to have no border

            optionsWithClass: ['transparent', 'shadow', 'hover', 'thickBorder', 'thinBorder', 'noBorder', 'puls'],

            colorName      : '',    //or fillColorName: Name of inside fill-color of the marker
            borderColorName: '',    //or lineColorName: Name of border/line-color of the marker
            iconColorName  : '',    //or textColorName: Name of color of the inner icon or text

            noFill         : false, //When true only colorName is used and no background-icon is used

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
            popupAnchor: {width: 0, height: 0},

            //Css for inner text-div. Used to adjust font-size and/or top-position for specific icon-class
            innerCss: {}, //{"font-size": "0.4em", top: "-4.2em" }

            rotationOrigin : 'center', //Origion around witch the marker is rotated
            direction      : 0, //direction
            directionOffset: 0, //Offset for direction if the icon is not N-S
            rotateInner    : 0, //Rotation of the inner-icon

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
            options.iconColorName = options.iconColorName || options.textColorName;
//BRUGES MÅSKE IKKE:             options.color = options.color || options.textColor || options.iconColor;

            options.size = options.size.toLowerCase();
            options.size =  options.size == 'extrasmall' ? 'xs' :
                            options.size == 'small' ? 'sm' :
                            options.size == 'large' ? 'lg' :
                            options.size == 'xlarge' ? 'xl' :
                            options.size == 'normal' ? 'nl' :
                            options.size;

            if ($.type(options.useTouchSize) !== 'boolean')
                options.useTouchSize = !!options.bigIconWhenTouch;

            if (options.useTouchSize && options.draggable && window.bsIsTouch)
                options.size = 'lg';

            return options;
        },

        /*****************************************************
        initialize
        *****************************************************/
        initialize: function(latLng, options){
            L.Marker.prototype.initialize.call(this, latLng, options);
            this.options = this._adjustOptions();

            //Create 'dummy' $icon to allow setColor etc. before the marker is added
            this.$icon = $('<div/>');

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
            function point( width, height, whFactor ){
                return  whFactor ?
                        L.point(
                            Math.round( (whFactor.width  || 0)*width ),
                            Math.round( (whFactor.height || 0)*height )
                        ) :
                        null;
            }

            var iconList = ns.iconList[this.options.type] = ns.iconList[this.options.type] || [],
                width = ns.size[sizeId],
                height = width,
                className = 'lbm-type-'+this.options.type;

            if (this.options.markerClassName)
                className = className + ' ' + this.options.markerClassName;

            if (this.options.scale){
                width = Math.round( width * this.options.scale / 100 );
                height = Math.round( height * this.options.scale / 100 );
                className = className + ' lbm-scale-'+this.options.scale;
            }
            if (this.options.scaleX){
                width = Math.round( width * this.options.scaleX / 100 );
                className = className + ' lbm-scale-x-'+this.options.scaleX;
            }
            if (this.options.scaleY){
                height = Math.round( height * this.options.scaleY / 100 );
                className = className + ' lbm-scale-y-'+this.options.scaleY;
            }
            if (this.options.scaleInner){
                className = className + ' lbm-scale-inner-'+this.options.scaleInner;
            }
            if (this.options.noFill)
                className = className + ' lbm-no-fill';

            var iconOptions = {
                    className  : className,
                    html       : '',
                    iconSize   : point( width, height, this.options.iconSize    ),
                    iconAnchor : point( width, height, this.options.iconAnchor  ),
                    popupAnchor: point( width, height, this.options.popupAnchor ),
                },
                iconId = sizeId + '_' + (this.options.iconClass || '') + '_' + (this.options.innerIconClass || '') + (this.options.round ? '_round' : ''),
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
        },

        /*****************************************************
        updateIcon
        Update the marker regarding all options except size
        *****************************************************/
        updateIcon: function(options, forceColor){
            this.options = this._adjustOptions(options);

            this.getElements();

            //Set options using different class-names on $icon
            var _this = this;

            $.each(this.options.optionsWithClass, function( index, id ){
                _this.toggleOption(id, !!_this.options[id] );
            });

            this.setColor(this.colorName || this.options.colorName, forceColor);
            this.setBorderColor(this.borderColorName || this.options.borderColorName, forceColor);

            if (this.options.number !== undefined)
                this.setNumber(this.options.number);

            if (this.options.innerIconClass)
                this.setInnerIconClass(this.options.innerIconClass);

            if (this.options.direction || this.options.directionOffset)
                this.setDirection( this.options.direction );

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
                className = this.$icon.attr('class') || '';
            }

            if (tooltip)
                $(tooltip._container).removeClass('leaflet-tooltip-icon-'+this.size);

            this.options.size = size || this.options.size;
            this.options = this._adjustOptions();
            this.size = this.options.size;

            this.options.icon = this.getIcon( this.size );
            this.setIcon( this.options.icon );

            this.$icon = $(this._icon);

            this.$icon.addClass('lbm-base ' + className + ' lbm-type-'+this.options.type+' lbm-size-'+this.size);
            if (tooltip)
                $(tooltip._container).addClass('leaflet-tooltip-icon-'+this.size);

            this.updateIcon(null, true);
            return this;
        },

        /*****************************************************
        setColor( colorName, force )
        *****************************************************/
        setColor: function( colorName, force ){
            if (colorName && ((colorName != this.colorName) || force)){
                this._setAnyColor( 'colorName', colorName, 'lbm-color-', this.$background, this.options.setColor);
                this._setInnerColor();
            }
            return this;
        },

        /*****************************************************
        setBorderColor( borderColorName, force )
        *****************************************************/
        setBorderColor: function( borderColorName, force ){
            if (borderColorName && ((borderColorName != this.borderColorName) || force))
                this._setAnyColor( 'borderColorName', borderColorName, 'lbm-border-color-', this.$border, this.options.setBorderColor);
            return this;
        },

        /*****************************************************
        setIconColor( iconColorName )
        *****************************************************/
        setIconColor: function( iconColorName ){
            this.options.iconColorName = iconColorName;
            return this._setInnerColor();
        },

        _setAnyColor: function( id, newColorName, classNamePrefix, $element, options = {}){
            if (this[id])
                this.removeClass(classNamePrefix + this[id]);
            this[id] = newColorName;

            this.addClass(classNamePrefix + newColorName);
            if (options.alsoAsCss && $element && $element.length)
                $element.css(options.cssAttrName, colorNameToColor[newColorName]);
            return this;
        },

        /*****************************************************
        _setInnerColor()
        *****************************************************/
        _setInnerColor: function(){
            //If the color of the inner text/icon is given in options.iconColorName => use it
            if (this.options.iconColorName){
                this.$inner.removeClass(this['iconColorName']);
                this['iconColorName'] = 'fa-lbm-color-'+this.options.iconColorName;
                this.$inner.addClass(this['iconColorName']);
            }
            else
                //..else use white or black with the best contrast to the background-color
                if (this.$background && this.$background.first().length){
                    var bgColorRGBStr = this.$background.first().css( this.options.setColor.cssAttrName );

                    //Validate that it is rgba(123,123,123,...)
                    var regex = /\((\d{1,3}%?,\s?){3}.*\)/;
                    if (regex.test(bgColorRGBStr)) {
                        var bgColorRGB = bgColorRGBStr ? bgColorRGBStr.split("(")[1].split(")")[0].split(',') : null,
                            color = bgColorRGB ? window.colorContrastRGB(parseInt(bgColorRGB[0]), parseInt(bgColorRGB[1]), parseInt(bgColorRGB[2])) : null;
                        if (color){
                            var colorIsBlack = (color == '#000000');
                            this.$icon.toggleClass('lbm-text-is-black', colorIsBlack);
                            this.$icon.toggleClass('lbm-text-is-white', !colorIsBlack);
                        }
                    }
                }
            return this;
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
            if (!this.$inner || !this.$inner.length){
                this.$inner =
                    $('<div/>')
                        .addClass('inner')
                        .css(this.options.innerCss)
                        .appendTo(this.$innerParent);
            }
            if (this.options.rotateInner || this.$inner.css('transform'))
                this.$inner.css('transform', 'rotate('+this.options.rotateInner+'deg)');

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
        setDirection: function( direction ){
            this.options.direction = (direction || 0) % 360;
            direction = (this.options.direction + this.options.directionOffset) % 360;
            this.setRotationAngle(direction);
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

    /*****************************************************
    L.bsMarker - Create a bsMarker[TYPE]
    *****************************************************/
    L.bsMarker = function bsMarker(latlng, options) {
        var Constructor;
        switch (options.type){
            case 'circle'  : Constructor = L.BsMarkerCircle;   break;
            case 'redcross': Constructor = L.BsMarkerRedCross; break;
            case 'icon'    : Constructor = L.BsMarkerIcon;     break;
            default        : Constructor = L.BsMarkerBase;
        }

        return new Constructor(latlng, options);
    };

    /***************************************************************
    Leaflet.RotadedMarker
    (c) https://github.com/bbecquet/Leaflet.RotatedMarker

    Removed the IE9 support
    ***************************************************************/
    // save these original methods before they are overwritten
    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    L.Marker.addInitHook(function () {
        var iconOptions = this.options.icon && this.options.icon.options;
        var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', function(e) { e.target._applyRotation(); });
    });

    L.Marker.include({
        _initIcon: function() {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        _applyRotation: function () {
            if(this.options.rotationAngle) {
                this._icon.style[L.DomUtil.TRANSFORM+'Origin'] = this.options.rotationOrigin;
                this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
            }
        },

        setRotationAngle: function(angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function(origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        }
    });

}(jQuery, L, this, document));

;
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


;
/****************************************************************************

leaflet-marker-icon.js,

Create L.bsMarkerIcon = a marker with only a fa-icon

****************************************************************************/
(function ($, L/*, window, document, undefined*/) {
	"use strict";

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

            options.html =
                '<div class="lbm-content-outer">' +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-puls"></i>' +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-shadow"></i>' +
                    (this.options.noFill ? '' : '<i class="' + iconClassPrefixSolid  + ' lbm-content lbm-content-background"></i>') +
                    '<i class="' + iconClassPrefixBorder + ' lbm-content lbm-content-border"></i>' +
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




;
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
;
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



;
/****************************************************************************
leaflet-map-ignoreNextEvent.js,

Extent L.Map with methods
    function ignoreNextEvent( type )  : prevent the next firing of a event-type
    function includeNextEvent( type ) : allow  the next firing of a event-type

****************************************************************************/
(function ($, L/*, window, document, undefined*/) {
    "use strict";

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
}(jQuery, L, this, document));

