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
    var lastSvgId = 0;
    function stamp(obj) {
        /*eslint-disable */
        obj._lbm_svg_id = obj._lbm_svg_id || ++lastSvgId;
        return obj._lbm_svg_id;
        /* eslint-enable */
    }

    //colorNameToColor = list of name:color.MUST match the list in src/_leaflet-bootstrap-marker-colors.scss
    var colorNameToColor = ns.colorNameToColor = {
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


    var colorNameToRGB = ns.colorNameToRGB = {};

    function addTo_colorNameToRGB( colorName, rgbStr ){
        var sep = rgbStr.indexOf(",") > -1 ? "," : " ";
        colorNameToRGB[colorName] = rgbStr.substr(4).split(")")[0].split(sep).map(Number);
    }

    //Get color-values from Bootstrap-variables
	$(function() {
        var $div = $('<div/>').appendTo($('body')),
            div = $div.get(0);

        $.each(colorNameToColor, function(colorName, color){
            if (!color)
                colorNameToColor[colorName] = $div.removeClass().addClass('bg-'+colorName).css("background-color");

            div.style.color = colorNameToColor[colorName];

            addTo_colorNameToRGB( colorName, window.getComputedStyle(div).color );

        });
        $div.remove();
	});


    /*****************************************************
    L.BsMarker._lbmAddColorName = function(colorName)
    Used by other packages to add css for own color-name using
    leaflet-bootstrap-marker-mixin
    _lbmAddColorName will add the color-values to
    colorNameToColor and colorNameToRGB to be used for eq. svg-function
    *****************************************************/
    var $div = null;
    ns._lbmAddColorName = function(colorName){
        if (colorNameToColor[colorName])
            return;

        $div = $div || $('<div/>').appendTo($('body'));
        $div.removeClass().addClass('fa-lbm-color-'+colorName).appendTo($('body'));

        var rgbStr = window.getComputedStyle($div.get(0)).color;

        colorNameToColor[colorName] = rgbStr;
        addTo_colorNameToRGB( colorName, rgbStr );

        $div.remove();

    };

    /*****************************************************
    _adjustOptions
    *****************************************************/
    ns._adjustOptions = function(options={}){
        options.colorName = options.colorName || options.fillColorName || 'white';
        options.borderColorName = options.borderColorName || options.lineColorName || 'black';
        options.iconColorName = options.iconColorName || options.textColorName || 'black';
//BRUGES MÅSKE IKKE:             options.color = options.color || options.textColor || options.iconColor;

        options.size = options.size ? options.size.toLowerCase() : 'nl';
        options.size =  options.size == 'extrasmall' ? 'xs' :
                        options.size == 'small' ? 'sm' :
                        options.size == 'large' ? 'lg' :
                        options.size == 'xlarge' ? 'xl' :
                        options.size == 'normal' ? 'nl' :
                        options.size;

        return options;
    };


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

            if (a.faClassName)
                options.faClassName = a.faClassName;

            if (!options.faClassName && (a.round === false))
                options.faClassName = 'fa-square';
        }
        else {
            //2:, 3:, or 4:
            colorName = a || colorName;
            borderColorName = b || borderColorName;

            if (typeof c === 'boolean'){
                //2: (STRING, STRING, BOOLEAN)
                if (!c)
                    options.faClassName = 'fa-square';
            }
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
            noBorder        : true, //HERfalse, //True to have no border

            optionsWithClass: ['transparent', 'shadow', 'hover', 'thickBorder', 'thinBorder', 'noBorder', 'puls'],

            colorName      : '',    //or fillColorName: Name of inside fill-color of the marker
            borderColorName: '',    //or lineColorName: Name of border/line-color of the marker
            iconColorName  : '',    //or textColorName: Name of color of the inner icon or text

            noFill         : false, //When true only colorName is used and no background-icon is used

            iconHtml       : '', //The html-string used in createing L.divIcon in createIcon


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
            shadowWhenPopupOpen     : true,     //When true a big-sdhadow is shown when the popup for the marker is open

            noPopup: false, //If true the marker will not get any popups added

        },

        /*****************************************************
        _adjustOptions
        *****************************************************/
        _adjustOptions: function( options ){
            options = options || this.options;
            options = ns._adjustOptions( options );

            if ($.type(options.useTouchSize) !== 'boolean')
                options.useTouchSize = !!options.bigIconWhenTouch;

            if (options.useTouchSize && options.draggable && window.bsIsTouch)
                options.size = 'lg';

            $.extend(this.options, options);
        },

        /*****************************************************
        initialize
        *****************************************************/
        initialize: function(latLng, options){
            L.Marker.prototype.initialize.call(this, latLng, options);
            this._adjustOptions();

            //Create 'dummy' $icon to allow setColor etc. before the marker is added
            this.$icon = $('<div/>');

            if (this.options.draggable){
                this.on('dragstart',  this._bsMarkerBase_dragstart,  this);
                this.on('dragend',    this._bsMarkerBase_dragend,    this);
            }

            if (!this.options.noPopup){
                this.on('popupopen',  this._bsMarkerBase_popupopen,  this);
                this.on('popupclose', this._bsMarkerBase_popupclose, this);
            }

            return this;
        },

        /*****************************************************
        getWH - Return [width,height] of the icon
        *****************************************************/
        getWH: function( sizeId ){
            var width = ns.size[sizeId || this.size],
                height = width;

            if (this.options.scale){
                width = Math.round( width * this.options.scale / 100 );
                height = Math.round( height * this.options.scale / 100 );
            }

            if (this.options.scaleX)
                width = Math.round( width * this.options.scaleX / 100 );

            if (this.options.scaleY)
                height = Math.round( height * this.options.scaleY / 100 );

            return [width, height];

        },

        /*****************************************************
        getIconHtml - Return the html used inside L.divIcon
        *****************************************************/
        getIconHtml: function(){
            return this.options.iconHtml;
        },

        /*****************************************************
        createIcon - create the icon-object in given size (*)
        *****************************************************/
        createIcon: function( sizeId, options ){
            function colorNameToRgbStr(colorName){
                return 'rgb(' + ns.colorNameToRGB[ colorName ].join(',') + ')';
            }

            var o       = this.options,
                wh      = this.getWH(sizeId),
                width   = wh[0],
                height  = wh[1],
                borderW = 2;

            if (o.thickBorder)  borderW = 3;
            if (o.thinBorder)   borderW = 1;
            if (o.noBorder)     borderW = 0;

            width  = width - 2*borderW;
            height = height - 2*borderW;

            options.html = this.getIconHtml();

            if (this.options.svg){
                //Create a SVG-object to draw on
                var draw = window.SVG().size('100%', '100%');
                o.svg({
                    draw       : draw,
                    width      : width,
                    height     : height,
                    color      : colorNameToRgbStr(o.colorName),
                    borderColor: colorNameToRgbStr(o.borderColorName),
                    iconColor  : colorNameToRgbStr(o.iconColorName),
                    marker     : this
                });

                var svgHtml = draw.html();
                //If the svg is inside with other content => place inside a adjusted DIV
                if (options.html)
                    svgHtml = '<div class="leaflet-marker-svg-container">' + svgHtml + '</div>';

                options.html = options.html + svgHtml;
            }

            return L.divIcon( options );
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
                wh = this.getWH(sizeId),
                width  = wh[0],
                height = wh[1],
                className = 'lbm-type-'+(this.options.typeClassName || this.options.type);

            if (this.options.markerClassName)
                className = className + ' ' + this.options.markerClassName;

            if (this.options.scale)
                className = className + ' lbm-scale-'+this.options.scale;

            if (this.options.scaleX)
                className = className + ' lbm-scale-x-'+this.options.scaleX;

            if (this.options.scaleY)
                className = className + ' lbm-scale-y-'+this.options.scaleY;

            if (this.options.scaleInner)
                className = className + ' lbm-scale-inner-'+this.options.scaleInner;

            if (this.options.noFill)
                className = className + ' lbm-no-fill';

            var iconOptions = {
                    className  : className,
                    html       : '',
                    iconSize   : point( width, height, this.options.iconSize    ),
                    iconAnchor : point( width, height, this.options.iconAnchor  ),
                    popupAnchor: point( width, height, this.options.popupAnchor ),
                },
                //iconId = unique for the same inner-icon and svg
                iconId =    sizeId + '_' +
                            (this.options.iconClass || '') + '_' +
                            (this.options.innerIconClass || '') + '_' +
                            (this.options.scaleInner || '') + '_' +

                            (this.options.svg ? stamp(this.options.svg) : '') + '_' +
                            (this.options.round ? '_round' : ''),
                result = iconList[iconId] = iconList[iconId] || this.createIcon(sizeId, iconOptions);

            //If the marker need individual creation of icon => just recreate the icon
            if (this.options.individualContent)
                result = this.createIcon(sizeId, iconOptions);

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
            this._adjustOptions(options);

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
            this._adjustOptions();
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

                this._setInnerColor();
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
            case 'simple'  : Constructor = L.BsMarkerSimple;   break;
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
