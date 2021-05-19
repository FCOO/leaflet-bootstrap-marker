# leaflet-bootstrap-marker
>


## Description
Create different types of Leaflet markers using [FCOO/leaflet-bootstrap](https://github.com/FCOO/leaflet-bootstrap)  

There are the following types of marker:

- **`bsMarkerCircle`** Round or square marker with optional fill and border color and icon or text
- **`bsMarkerIcon`** Fontawesome icons as marker with optional fill and border color and icon or text
- **`bsMarkerStandard`** A standard Leaflet marker with optional fill and border color and icon or text
- **`bsMarkerRedCross`** Special marker as a red cross on the map

## Installation
### bower
`bower install https://github.com/FCOO/leaflet-bootstrap-marker.git --save`

## Demo
http://FCOO.github.io/leaflet-bootstrap-marker/demo/ 

## Usage

### options 
- `bsMarkerCircle`: All options
- `bsMarkerIcon`: All options except options marked with `(*)`
- `bsMarkerRedCross`: Only standard Leaflet options plus `size`

        options: {
            type       : 'base',  //Type of the marker
            size       : 'nl',    //Size of the marker. Possble values: 'sx', 'sm', '', 'lg', or 'xl'

            scale      : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale specific icons to fit the other icons. Only for icon-marker
            scaleY     : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale height of specific icons to better fit icons with very low height
            scaleInner : null,    //Value = 40, 50, 60, 70, 80, 90, 120, 130, 150, 180 or 200: Scale inner icon in type=circle

            iconClass     : '',          //Fontawesome Font class-name ("fa-marker") for icon
            innerIconClass: '',          //Fontawesome Font class-name ("fa-home") for icon inside the marker
            faClassName   : 'fa-circle', //fa-class to be used when create the marker as fa-icon. Default is fa-circle

            useTouchSize    : false, //True to make size = large when window.bsIsTouch == true and options.draggable == true

            transparent: false, //True to make the marker semi-transparent
            hover      : false, //True to show shadow and 0.9 opacuity for lbm-transparent when hover
            shadow     : false, //true to add a shadow to the marker
            puls       : false, //true to have a pulsart icon

            thickBorder: false, //true to have thicker border
            thinBorder : false, //True to have a thin border
            noBorder   : false, //True to have no border

            colorName      : '',    //or fillColorName: Name of inside fill-color of the marker
            borderColorName: '',    //or lineColorName: Name of border/line-color of the marker
            iconColorName  : '',    //or textColorName: Name of color of the inner icon or text

            noFill         : false, //When true only colorName is used and no background-icon is used

            //Default FACTORS for size and anchor for the icon
            iconSize   : {width: 1, height: 1},
            iconAnchor : null, //{width: 0, height: 0},
            popupAnchor: null, //{width: 0, height: 0},

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

### `colorName`, `borderColorName`, and `iconColorName`
The following values can be used for `colorName`, `borderColorName`, and `iconColorName`
#### Standard colors:

    "pink" "purple" "red" "orange" "yellow" "green" "cyan" "blue" "brown" "white" "grey" "black" "indigo" "teal" "darkgray"     

#### Bootstrap colors:

	"primary" "secondary" "success" "info" "warning" "danger" "light" "dark"

#### Google map color

    "standard"  : #4285F4 //= rgba(66, 133, 244) = google maps color for location icon

<table border=1>
<tr>
    <td style="background-color: black; color:white">black</td>
    <td style="background-color: blue; color:white">blue</td>
    <td style="background-color: brown; color:white">brown</td>
    <td style="background-color: cyan">cyan</td>
    <td style="background-color: rgb(220, 53, 69)">danger</td>
    <td style="background-color: rgb(52, 58, 64); color:white">dark</td>
    <td style="background-color: darkgray; color:white">darkgray</td>
    <td style="background-color: green">green</td>
</tr><tr>
    <td style="background-color: grey">grey</td>
    <td style="background-color: indigo; color:white">indigo</td>
    <td style="background-color: rgb(23, 162, 184)">info</td>
    <td style="background-color: rgb(248, 249, 250)">light</td>
    <td style="background-color: orange">orange</td>
    <td style="background-color: pink">pink</td>
    <td style="background-color: rgb(0, 123, 255)">primary</td>
    <td style="background-color: purple; color:white">purple</td>
</tr><tr>
    <td style="background-color: red">red</td>
    <td style="background-color: rgb(108, 117, 125)">secondary</td>
    <td style="background-color: #4285F4">standard</td>
    <td style="background-color: rgb(40, 167, 69)">success</td>
    <td style="background-color: teal">teal</td>
    <td style="background-color: rgb(255, 193, 7)">warning</td>
    <td style="background-color: white">white</td>
    <td style="background-color: yellow">yellow</td>
</tr>
</table>

### Methods

        .setSize(size)
        .setColor( colorName )
        .setBorderColor( borderColorName )
        .setIconColor( iconColorName )
        .setInnerIconClass( innerIconClass )
        .setNumber: function( number )
        .setDirection( direction )
        .setDeltaDirection( deltaDirection )
        .asIcon()   //Return a json-record to be used as icon-options in any jquery-bootstrap content-options (eq. as header)


## `L.bsMarkerIcon`
This type of marker requiter that [Font Awesome Pro](https://fontawesome.com/pro) is used and only icons where the regular-version is the border of the icon (eq. [fa-arrow-alt-up](https://fontawesome.com/icons/arrow-alt-up?style=solid))


## `L.bsMarkerAsIcon`
Return the options to create a icon locking like a BsMarker

Can be used in four different ways:

    1:  L.bsMarkerAsIcon(options: OBJECT)
            options = same as for BsMarkerBase or BsMarkerCircle

    2:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, round: BOOLEAN = true)

    3:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, faClassName: STRING)

    4:  L.bsMarkerAsIcon(colorName: STRING, borderColorName: STRING, options: OBJECT)
            options = {
                faClassName   : STRING (default = 'fa-circle'),
                extraClassName: STRING (default = '')}
            }


<!-- 
### options
| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| options1 | boolean | true | If <code>true</code> the ... |
| options2 | string | null | Contain the ... |

 -->


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-bootstrap-marker/LICENSE).

Copyright (c) 2019 [FCOO](https://github.com/FCOO)

