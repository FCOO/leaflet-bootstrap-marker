# leaflet-bootstrap-marker
>


## Description
Create different types of Leaflet markers using [FCOO/leaflet-bootstrap](https://github.com/FCOO/leaflet-bootstrap)  

There are the following types of marker:

- **`bsMarker`** Round or square marker with optional fill and border color and icon or text
- **`faMarker`** Fontawesome icons as marker with optional fill and border color - TODO
- **`colorMarker`** Default Leaflet marker with optional size, icon, fill and border color - TODO
- **`redCrossMarker`** Special marker as a red cross on the map - TODO
- **`vesselMarker`** Shaped like a ship or plan with optional fill and border color - TODO

## Installation
### bower
`bower install https://github.com/FCOO/leaflet-bootstrap-marker.git --save`

## Demo
http://FCOO.github.io/leaflet-bootstrap-marker/demo/ 

## Usage

### Common options 
All markers support

	options: {
        draggable       : false,           //Whether the marker is draggable with mouse/touch or not.
        autoPan         : true,            //Sit to true if you want the map to do panning animation when marker hits the edges.

        colorName       : '',    	        //Class-name to give the (fill-)color of the marker
        borderColorName : '',               //Class-name to give the border-color

        tooltip                 : null,     //Content of tooltip
        tooltipPermanent        : false,    //Whether to open the tooltip permanently or only on mouseover.
        tooltipHideWhenDragging : false,    //True and tooltipPermanent: false => the tooltip is hidden when dragged
        tooltipHideWhenPopupOpen: false     //True and tooltipPermanent: false => the tooltip is hidden when popup is displayed

	} 

### `colorName` and `borderColorName`
The following values can be used for `colorName` and `borderColorName`
#### Standard colors:

    "pink" "purple" "red" "orange" "yellow" "green" "cyan" "blue" "brown" "white" "grey" "black" "indigo" "teal" "darkgray"     

#### Bootstrap colors:

	"primary" "secondary" "success" "info" "warning" "danger" "light" "dark"

#### Google map color

    "standard"  : #4285F4 //= rgba(66, 133, 244) = google maps color for location icon


### L.bsMarker


    options: {
        iconSize        : 0,          //0: normal, 1. larger with icon or number, 2: Very large (touch-mode)
        iconClass       : '',         //Fontawesome Font class-name ("fa-home") for icon inside the marker
        number          : undefined,  //Number inside the marker

        useBigIcon         : false,   //True to make the icon big
        bigIconWhenTouch   : false,   //True to make big icon when window.bsIsTouch == true and options.draggable == true
        transparent        : false,   //True to make the marker semi-transparent
        hover              : false,   //True to show shadow and 0.9 opacuity for lbm-transparent when hover
        shadow             : false,   //true to add a shadow to the marker
        puls               : false,   //true to have a pulsart icon
		thickBorder        : false,   //true to have thicker border 
        shadowWhenPopupOpen: true     //When true a shadow is shown when the popup for the marker is open

    }

    
    //Methods
    .toggleOption(optionId)             //Toggle the state of options[optionId]
    .setColor( colorName )              //Set the color
    .setBorderColor( borderColorName )  //Set the border-color
    .setSize(sizeIndex)                 //Set the size of the marker (0-2)
    .setIconClass( iconClass, minSize ) //Set the classname for the icon inside the marker
    .setNumber( number, minSize )       //Set a number inside the marker
    .asIcon()                           //Return options for this as icon in bsHeader etc.


### `L.faMarker`

### `L.colorMarker`

### `L.vesselMarker`

### `L.redCrossMarker`


<!-- 
### options
| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| options1 | boolean | true | If <code>true</code> the ... |
| options2 | string | null | Contain the ... |

### Methods

    .methods1( arg1, arg2,...): Do something
    .methods2( arg1, arg2,...): Do something else
 -->


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-bootstrap-marker/LICENSE).

Copyright (c) 2018 [FCOO](https://github.com/FCOO)

