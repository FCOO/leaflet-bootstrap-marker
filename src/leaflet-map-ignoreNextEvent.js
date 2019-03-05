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

