$(document).ready(function() {
    $(".colorButton").on("click", function() {
        switch(this.value) {
            case("red"):
                changeColor(11, {'r': 255, 'g': 0, 'b': 0});
                break;
            case("yellow"):
                changeColor(11, {'r': 255, 'g': 255, 'b': 0});
                break;
            case("green"):
                changeColor(11, {'r': 0, 'g':255, 'b': 0});
                break;
            case("blue"):
                changeColor(11, {'r':0, 'g':0, 'b':255});
                break;
            case('violet'):
                changeColor(11, {'r': 238, 'g':130, 'b':238});
                break;
            default:
                changeColor(11, {'r':255, 'g':255, 'b':255});
        };
    });
});
let controller = new Leap.Controller();

// Probably does not really need to be named onBlur, but it does seem to only want a function with no parameters
// change the color to red
controller.on('blur', onBlur);
function onBlur() {

    changeColor(11,{'r':255, 'g': 0, 'b': 0});
}
controller.on('focus', onFocus);
// On focus toggle the color to blue
function onFocus() {
  changeColor(11,{'r':0, 'g':0, 'b':255});
}

// let frameArray = []; // Global frame array. Sorry global namespace
// controller.loop(function(frame) {
//     if (state == 'paused') return;
//     if (state == 'pausing') {
//         state = 'paused';
//     } else {
//         if (frame.hands[0] && frame.hands[0].type === 'right') {
//             frameArray.push(frame.timestamp); // push the current time stamp into the array
//             // Compare the frames being rendered ~110 fps
//             if (frameArray[frameArray.length-1] - frameArray[parseInt(frameArray.length/2)] > 100) {
//                 var x = Math.floor((frame.hands[0].direction[0] + 1) * 128); // x = red
//                 var z = Math.floor((frame.hands[0].direction[1] + 1) * 128); // z = green
//                 var y = Math.floor((frame.hands[0].direction[2] + 1) * 128); // y = blue
//                 var color = 'rgb(' + x + "," + z + "," + y + ')';
//                 sendColor(color);
//                 changeColor(11, {"r": x, "g": z, "b": y}); // add a 500 ms delay before changing the color call
//             }
//         }
//         if (haveLoggedFrame == false && frame.hands[0]) {
//             haveLoggedFrame = true;
//         }
//     }
// });

function calculate_cieXY_from_rgb(R,G,B){
    const X = 0.4124*R + 0.3576*G + 0.1805*B;
    const Y = 0.2126*R + 0.7152*G + 0.0722*B;
    const Z = 0.0193*R + 0.1192*G + 0.9505*B;
    const x = X / (X + Y + Z);
    const y = Y / (X + Y + Z);
    const xy = {
        x: x,
        y: y
    };
    return(xy);
}

function changeColor(lightNumber, color) {
    const BASE_URL_LIGHTS = `http://${bridgeIPAddress}/api/${hueUsername}/lights`;
    const {r, g, b} = color; // pull off r, g, and b from color
    const {x,y} =  calculate_cieXY_from_rgb(r,g,b); // pull off hue saturation and brightness from the HSB return value

    // let hueAdjusted = parseInt((hue/360)*65535);
    // let saturationAdjusted = parseInt(saturation*254);
    // let brightnessAdjusted = parseInt(brightness*254);

    $.ajax({
        url: `${BASE_URL_LIGHTS}/${lightNumber}/state`,
        method: "PUT",
        dataType: "JSON",
        data: JSON.stringify({"xy":[x,y], "transitiontime": 0}), // time in milliseconds for the light change to take effect
        // data: JSON.stringify({"hue": hueAdjusted, "sat": saturationAdjusted, "bri": brightnessAdjusted, "transitiontime": 0}),
        success: (response) => {

        },
        error: (response) => {

        }
    });
}