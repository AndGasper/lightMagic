$(document).ready(function () {
    $("#hueGET").click(function(){
        toggleLightsOffOn("11");
    });
    $("#allLights").on('click', toggleAllLightsOffOn);
});
//color square disconnect and connect
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


// constants for base url are pulled from hue_config.js

function callLights() {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}`;
    $.ajax({
        url: `${BASE_URL}/lights`,
        dataType: "JSON",
        method: "GET",
        success: function (response) {
            // then toggle the lights off
            for (let i = 0; i < Object.keys(response); i++) {
                toggleLightsOff(i); // toggle each light off by iterating through with this axios call
            }
        },
        error: function (response) {
        }
    });
}
var Finger = function(id){
    this.lightState = false;
    this.lightId = id;
};

var thumb = new Finger(11);
var index = new Finger(12);
var middle = new Finger(5);
var ring = new Finger(16);
var pinky = new Finger(17);

function toggleLightsOffOn(fingerObj) {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/${fingerObj.lightId}/state`;
    const state = $("#onOffCheckbox:checked");
    if(fingerObj.lightState === true){
        fingerObj.lightState = false;
    }
    else{
        fingerObj.lightState = true;
    }
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: '{"on": '+fingerObj.lightState+'}',
        success: function (response) {
          
        },
        error: function (response) {
          
        }
    });

}

var controller = Leap.loop({
    hand: function (hand){
        var finger = hand.fingers;
        for(var f=0;f<finger.length;f++){
            if(finger[f].extended && hand.type === "left"){
                if(f === 0 && thumb.lightState === false){
                    toggleLightsOffOn(thumb)
                    console.log("thumb extended")
                }
                if(f === 1 && index.lightState === false){
                    toggleLightsOffOn(index)
                    console.log("index extended")
                }
                if(f === 2 && middle.lightState === false){
                    toggleLightsOffOn(middle)
                    console.log("middle extended")
                }
                if(f === 3 && ring.lightState === false){
                    toggleLightsOffOn(ring)
                    console.log("ring extended")
                }
                if(f === 4 && pinky.lightState === false){
                    toggleLightsOffOn(pinky)
                    console.log("pinky extended")
                }
            }
            if(!finger[f].extended && hand.type === "left"){
                if(f === 0 && thumb.lightState === true){
                    toggleLightsOffOn(thumb)
                    console.log("thumb not extended")
                }
                if(f === 1 && index.lightState === true){
                    toggleLightsOffOn(index)
                    console.log("index not extended")
                }
                if(f === 2 && middle.lightState === true){
                    toggleLightsOffOn(middle)
                    console.log("middle not extended")
                }
                if(f === 3 && ring.lightState === true){
                    toggleLightsOffOn(ring)
                    console.log("ring not extended")
                }
                if(f === 4 && pinky.lightState === true){
                    toggleLightsOffOn(pinky)
                    console.log("pinky not extended")
                }
            }
        }
    }
});

// Convert RGB color values to Hue, Saturation and brightness, function returns an object
function getHSB(r,g,b) {
    let HSB = {
        hue: null,
        saturation: null,
        brightness: null
    };
    // Normalize the color values out of 255
    let red = r/255;
    let green = g/255;
    let blue = b/255;

    let colorMin = Math.min(red,green,blue); // get the miniumum of the adjusted color
    let colorMax = Math.max(red,green, blue); // Get the maximum of the adjusted color
    let deltaColor = colorMax - colorMin;
    // formula for lightness; note: lightness = brightness
    HSB.brightness = (colorMax+colorMin)/2;
    // if deltaColor = 0 then set saturation equal to 0,
    // else set sautration equal to (deltaColor/1-|2*brightness - 1|)
    (deltaColor === 0) ? (HSB.saturation = 0) : (HSB.saturation = (deltaColor / (1 - Math.abs(2*HSB.brightness-1) ) ) );

    switch(colorMax) {
        case(red):
            //Max number 6 modulo' well not really magic
            HSB.hue = (60 * ( ((green - blue)/deltaColor)%6));
            return HSB; // return the now complete Hue, Saturation, and Brightness object
            break;

        case(blue):
            HSB.hue = (60 * ( ((red-green)/deltaColor) + 4));
            return HSB;
            break;

        case(green):
            HSB.hue = (60 * ( ((blue-red)/deltaColor) + 2));
            return HSB;
            break;
        default:
            console.log("Something has gone wrong if you've made it all the way here");
    }
}

// console.log("getHue", getHue(230,255,211));
console.log("getHue(255,250,100)", getHSB(255,250,100));
//RGB and their HSL Values
    // RGB = 255, 250, 100
    // HSL = 58, 100.0, 69.6 - Yellow
    // RGB = 255, 100, 255
    // HSL = 300, 100, 69.6 - Pink
    // RGB = 100, 255, 255
    // HSL = 180, 100, 69.6 - Cyan


// HSB version. takes in a color object with r,g,b
function changeColor(lightNumber, color) {
    const BASE_URL_LIGHTS = `http://${bridgeIPAddress}/api/${hueUsername}/lights`;
    const {r, g, b} = color; // pull off r, g, and b from color
    const {hue, saturation, brightness} =  getHSB(r,g, b); // pull off hue saturation and brightness from the HSB return value

    let hueAdjusted = parseInt((hue/365)*65535);
    let saturationAdjusted = parseInt(saturation*254);
    let brightnessAdjusted = parseInt(brightness*254);

    $.ajax({
        url: `${BASE_URL_LIGHTS}/${lightNumber}/state`,
        method: "PUT",
        dataType: "JSON",
        data: JSON.stringify({"hue": hueAdjusted, "sat": saturationAdjusted, "bri": brightnessAdjusted}),
        success: (response) => {
            console.log("changeColor success", response);
        },
        error: (response) => {
            console.log("changeColor error", response);
        }
    });
}

function toggleAllLightsOffOn(boolean) {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/groups/3/action`;
    const state = $("#onOffCheckbox:checked");
    let lightState = { "on": boolean };
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: JSON.stringify(lightState),
        success: function (response) {
        },
        error: function (response) {
        }
    })
}


function sendColor(color){
    document.getElementById('box').style.backgroundColor = color;
}
function changeRadius(distance){
    document.getElementById("box").style.borderRadius = distance;
}

// ************************************************************
// Old way to do light control with fist/palm STARTS HERE
// ************************************************************

// LeapMotion Fist on / off
// Gesture thresholds in order to turn Hue lights on and off
// const minValue = 0.5;
// let cooldownTimer = 250;
// let cooldown = false;
// let lightSwitchThreshold = 0;
// let upperThreshold = 50;

// var controller = Leap.loop(function (frame) {
//     if (frame.hands.length > 0) {
//         if(frame.hands[0].type === "left"){
//             var hand = frame.hands[0];
//             var isFist = checkFist(hand);

//         }else{
//             var x = Math.floor((frame.hands[0].direction[0] + 1) * 128);
//             var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128);
//             var y = Math.floor((frame.hands[0].direction[2] + 1) *  128);
//             var distance = frame.hands[0].sphereCenter[1] + 'px'
//             var color = 'rgb(' + x + "," + z + "," + y + ')';
//             sendColor(color);
//             changeRadius(distance);
//             if (haveLoggedFrame == false && frame.hands[0]){
//                 haveLoggedFrame = true;
//             }
//             // return false
//         }
//         // var hand = frame.hands.type;
//     }
// });

// function checkFist(hand) {
//     var sum = 0;
//     for (var i = 0; i < hand.fingers.length; i++) {
//         var finger = hand.fingers[i];
//         var meta = finger.bones[0].direction();
//         var proxi = finger.bones[1].direction();
//         var inter = finger.bones[2].direction();
//         var dMetaProxi = Leap.vec3.dot(meta, proxi);
//         var dProxiInter = Leap.vec3.dot(proxi, inter);
//         sum += dMetaProxi;
//         sum += dProxiInter
//     }
//     sum = sum / 10;

//     // Conditional used to check if you have a fist
//     // Fist should decrease our threshold to returns a false boolean
//     // Threshold is currently set to 0 for Off
//     if (sum <= minValue && getExtendedFingers(hand) == 0) {
//         if (lightSwitchThreshold > 0 && cooldown == false) {
//             lightSwitchThreshold--;
//         }
//         if (lightSwitchThreshold == 0 && cooldown == false) {
//             switchCooldown();
//         }
//         // Else conditional used to check if you don't have a fist(palm)
//         // Open hand or palm increases our threshold to returns a true boolean
//         // Threshold is currently set to 100 for On
//     } else {
//         if (lightSwitchThreshold < upperThreshold && cooldown == false) {
//             lightSwitchThreshold++;
//         }
//         if (lightSwitchThreshold == upperThreshold && cooldown == false) {
//             switchCooldown();
//         }
//     }
// }

// function getExtendedFingers(hand) {
//     var f = 0;
//     for (var i = 0; i < hand.fingers.length; i++) {
//         if (hand.fingers[i].extended) {
//             f++;
//         }
//     }
//     return f;
// }


// // Timeout to prevent multiple triggers for light on/off functionality
// // Sets cooldown to true to prevent multiple truthy/falsey values to be returned
// // cooldownTimer global variable used to adjust for cooldown length
// function switchCooldown() {
//     cooldown = true;
//     if (lightSwitchThreshold == 0) {
//         setTimeout(function () {
//             cooldown = false;
//         }, cooldownTimer);
//         // False value once reached upperThreshold will be passed into toggleAllLightsOffOn
//         //temp
//         toggleAllLightsOffOn(false);
//     } else if (lightSwitchThreshold == upperThreshold) {
//         setTimeout(function () {
//             cooldown = false;
//         }, cooldownTimer);
//         // True value once reached upperThreshold will be passed into toggleAllLightsOffOn
//         //temp
//         toggleAllLightsOffOn(true);
//     }

// }

// ************************************************************
// Old way to do light control with fist/palm ENDS HERE
// ************************************************************