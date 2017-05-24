var state = 'play';
window.onkeypress = function(e) {
  if (e.charCode == 32) { //spacebar
    if (state == 'play') {
      state = 'pausing';
    }else{
      state = 'play';
    }
  }
};
var haveLoggedFrame = false;
var controller = new Leap.Controller({enableGestures: true, loopWhileDisconnected: false});

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

controller.on('gesture', onGesture);

function onGesture(gesture, frame) {
  console.log(gesture.type + "w/ID" + gesture.id + "id n frame" + frame.id);
}

// controller.plugin('holdColor', function() {
//   return (
//       color:
//   )
// });

// if(frame.hands[0] && frame.hands[0].type === 'right'){
//     console.log("frame.hands[0].direction[0]+1", frame.hands[0].direction[0]+1);
//     var x = Math.floor((frame.hands[0].direction[0] + 1) * 128); // x = red
//     var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128); // z = green
//     var y = Math.floor((frame.hands[0].direction[2] + 1) *  128); // y = blue
//     var color = 'rgb(' + x + "," + z + "," + y + ')';
//     sendColor(color);
//     changeColor(11, {"r":x, "g": z, "b": y}); // add a 500 ms delay before changing the color call
//
// }


// function framePositionToColor(frame) {
//   return function () {
//
//       // if(frame.hands[0] && frame.hands[0].type === 'right'){
// //     console.log("frame.hands[0].direction[0]+1", frame.hands[0].direction[0]+1);
// //     var x = Math.floor((frame.hands[0].direction[0] + 1) * 128); // x = red
// //     var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128); // z = green
// //     var y = Math.floor((frame.hands[0].direction[2] + 1) *  128); // y = blue
// //     var color = 'rgb(' + x + "," + z + "," + y + ')';
// //     sendColor(color);
// //     changeColor(11, {"r":x, "g": z, "b": y}); // add a 500 ms delay before changing the color call
// //
// // }
// };

let frameArray = []; // Global frame array. Sorry global namespace
controller.loop(function(frame) {
    if (state == 'paused') return;
    if (state == 'pausing') {
        state = 'paused';
    } else {
        if (frame.hands[0] && frame.hands[0].type === 'right') {
            frameArray.push(frame.timestamp); // push the current time stamp into the array
            // Compare the frames being rendered ~110 fps
            if (frameArray[frameArray.length-1] - frameArray[parseInt(frameArray.length/2)] > 100) {
                var x = Math.floor((frame.hands[0].direction[0] + 1) * 128); // x = red
                var z = Math.floor((frame.hands[0].direction[1] + 1) * 128); // z = green
                var y = Math.floor((frame.hands[0].direction[2] + 1) * 128); // y = blue
                var color = 'rgb(' + x + "," + z + "," + y + ')';
                sendColor(color);
                changeColor(11, {"r": x, "g": z, "b": y}); // add a 500 ms delay before changing the color call
            }
        }
        if (haveLoggedFrame == false && frame.hands[0]) {
            haveLoggedFrame = true;
        }
    }
});
function sendColor(color){
    document.getElementById('box').style.backgroundColor = color;
}
// function getHSB(r,g,b) {
//     let HSB = {
//         hue: null,
//         saturation: null,
//         brightness: null
//     };
//     // Normalize the color values out of 255
//     let red = r/255;
//     let green = g/255;
//     let blue = b/255;
//
//     let colorMin = Math.min(red,green,blue); // get the miniumum of the adjusted color
//     let colorMax = Math.max(red,green, blue); // Get the maximum of the adjusted color
//     let deltaColor = colorMax - colorMin;
//     // formula for lightness; note: lightness = brightness
//     HSB.brightness = (colorMax+colorMin)/2;
//     // if deltaColor = 0 then set saturation equal to 0,
//     // else set sautration equal to (deltaColor/1-|2*brightness - 1|)
//     (deltaColor === 0) ? (HSB.saturation = 0) : (HSB.saturation = (deltaColor / (1 - Math.abs(2*HSB.brightness-1) ) ) );
//
//     switch(colorMax) {
//         case(red):
//             //Max number 6 modulo' well not really magic
//             HSB.hue = (60 * ( ((green - blue)/deltaColor)%6));
//             (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
//             return HSB; // return the now complete Hue, Saturation, and Brightness object
//             break;
//
//         case(blue):
//             HSB.hue = (60 * ( ((red-green)/deltaColor) + 4));
//             (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
//             return HSB;
//             break;
//
//         case(green):
//             HSB.hue = (60 * ( ((blue-red)/deltaColor) + 2));
//             (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
//             return HSB;
//             break;
//         default:
//             console.log("Something has gone wrong if you've made it all the way here");
//     }
// }
// function getHSB (r, g, b) {
//     r /= 255, g /= 255, b /= 255;
//
//     var max = Math.max(r, g, b), min = Math.min(r, g, b);
//     var h, s, v = max;
//
//     var d = max - min;
//     s = max == 0 ? 0 : d / max;
//
//     if (max == min) {
//         h = 0; // achromatic
//     } else {
//         switch (max) {
//             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//             case g: h = (b - r) / d + 2; break;
//             case b: h = (r - g) / d + 4; break;
//         }
//
//         h /= 6;
//     }
//
//     return {hue: h, saturation: s, brightness: v };
// }

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
        data: JSON.stringify({"xy":[x,y], "transitiontime": 0}),
        // data: JSON.stringify({"hue": hueAdjusted, "sat": saturationAdjusted, "bri": brightnessAdjusted, "transitiontime": 0}),
        success: (response) => {

        },
        error: (response) => {

        }
    });
}