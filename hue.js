$(document).ready(function () {
    $("#hueGET").click(function(){
        toggleLightsOffOn("11");
    });
    $("#allLights").on('click', toggleAllLightsOffOn);
});
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

function toggleLightsOffOn(lightId, boolean) {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/${lightId}/state`;
    const state = $("#onOffCheckbox:checked");
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: '{"on": '+boolean+'}',
        success: function (response) {
        },
        error: function (response) {
        }
    });
    return boolean
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


// LeapMotion Fist on / off
// Gesture thresholds in order to turn Hue lights on and off
const minValue = 0.5;

let cooldownTimer = 250;
let cooldown = false;
let lightSwitchThreshold = 0;
let upperThreshold = 50;

// var controller = Leap.loop(function (frame) {
//     if (frame.hands.length > 0) {
//         var hand = frame.hands[0];
//         var isFist = checkFist(hand);
//     }
// });

function getExtendedFingers(hand) {
    var f = 0;
    for (var i = 0; i < hand.fingers.length; i++) {
        if (hand.fingers[i].extended) {
            f++;
        }
    }
    return f;
}

function checkFist(hand) {
    var sum = 0;
    for (var i = 0; i < hand.fingers.length; i++) {
        var finger = hand.fingers[i];
        var meta = finger.bones[0].direction();
        var proxi = finger.bones[1].direction();
        var inter = finger.bones[2].direction();
        var dMetaProxi = Leap.vec3.dot(meta, proxi);
        var dProxiInter = Leap.vec3.dot(proxi, inter);
        sum += dMetaProxi;
        sum += dProxiInter
    }
    sum = sum / 10;

    // Conditional used to check if you have a fist
    // Fist should decrease our threshold to returns a false boolean
    // Threshold is currently set to 0 for Off
    if (sum <= minValue && getExtendedFingers(hand) == 0) {
        if (lightSwitchThreshold > 0 && cooldown == false) {
            lightSwitchThreshold--;
        }
        if (lightSwitchThreshold == 0 && cooldown == false) {
            switchCooldown();
        }
        // Else conditional used to check if you don't have a fist(palm)
        // Open hand or palm increases our threshold to returns a true boolean
        // Threshold is currently set to 100 for On
    } else {
        if (lightSwitchThreshold < upperThreshold && cooldown == false) {
            lightSwitchThreshold++;
        }
        if (lightSwitchThreshold == upperThreshold && cooldown == false) {
            switchCooldown();
        }
    }
}


var controller = Leap.loop({
    hand: function (hand){
        var finger = hand.fingers;
        var fingerType = ["thumb","index","middle","ring","pinky"];
        for(var f=0;f<finger.length;f++){
            if(finger[f].extended && hand.type === "left"){
                console.log(fingerType[f]+" extended");
                if(f === 0){
                    toggleLightsOffOn("11",true)
                }
                if(f === 1){
                    toggleLightsOffOn("12",true)
                }
                if(f === 2){
                    toggleLightsOffOn("5", true)
                }
                if(f === 3){
                    toggleLightsOffOn("16", true)
                }
                if(f === 4){
                    toggleLightsOffOn("17", true)
                }
            }
            // else if(!finger[f].extended && hand.type === "left"){
            //     if(f === 0){
            //         toggleLightsOffOn("11", false)
            //     }
            //     if(f === 1){
            //         toggleLightsOffOn("12", false)
            //     }
            //     if(f === 2){
            //         toggleLightsOffOn("5", false)
            //     }
            //     if(f === 3){
            //         toggleLightsOffOn("16", false)
            //     }
            //     if(f === 4){
            //         toggleLightsOffOn("17", false)
            //     }
            // }
        }
    }
});

// Timeout to prevent multiple triggers for light on/off functionality
// Sets cooldown to true to prevent multiple truthy/falsey values to be returned
// cooldownTimer global variable used to adjust for cooldown length
function switchCooldown() {
    cooldown = true;
    if (lightSwitchThreshold == 0) {
        console.log("We have returned false, TURN THAT SHIT OFF!");
        setTimeout(function () {
            cooldown = false;
        }, cooldownTimer);
        // False value once reached upperThreshold will be passed into toggleAllLightsOffOn        
        toggleAllLightsOffOn(false);
    } else if (lightSwitchThreshold == upperThreshold) {
        console.log("We have returned true, TURN THAT SHIT ON!");
        setTimeout(function () {
            cooldown = false;
        }, cooldownTimer);
        // True value once reached upperThreshold will be passed into toggleAllLightsOffOn
        toggleAllLightsOffOn(true);
    }

}