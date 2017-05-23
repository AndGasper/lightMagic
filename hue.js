$(document).ready(function () {
    $("#hueGET").on('click', toggleLightsOffOn);
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
            console.log("success callLights", response);
            // then toggle the lights off
            for (let i = 0; i < Object.keys(response); i++) {
                toggleLightsOff(i); // toggle each light off by iterating through with this axios call
            }
        },
        error: function (response) {
            console.log("callLights error", response);
        }

    });
}

function toggleLightsOffOn() {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/11/state`;
    const state = $("#onOffCheckbox:checked");
    console.log("toggleLightsOff state", state);
    let lightState = { "on": "true" };

    console.log("lightState", lightState);
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: '{"on": true}',
        success: function (response) {
            console.log("toggleLights success response", response);
        },
        error: function (response) {
            console.log("toggleLights error response", response);
        }
    })
}

function toggleAllLightsOffOn(boolean) {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/groups/3/action`;
    const state = $("#onOffCheckbox:checked");
    console.log("toggleLightsOff state", state);
    let lightState = { "on": boolean };
    console.log("lightState", lightState);
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: JSON.stringify(lightState),
        success: function (response) {
            console.log("toggleLights success response", response);
        },
        error: function (response) {
            console.log("toggleLights error response", response);
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

var controller = Leap.loop(function (frame) {
    if (frame.hands.length > 0) {
        console.log('frame hands',frame.hands[0].type);
        if(frame.hands[0].type === "left"){
            var hand = frame.hands[0];
            var isFist = checkFist(hand);

        }else{
            console.log("right hand");
            return false
        }
        // var hand = frame.hands.type;
    }
});

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
            console.log("Decreasing threshold", lightSwitchThreshold);
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
            console.log("Increasing threshold", lightSwitchThreshold);
        }
        if (lightSwitchThreshold == upperThreshold && cooldown == false) {
            switchCooldown();
        }
    }
}

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
        //temp
        toggleAllLightsOffOn(false);
    } else if (lightSwitchThreshold == upperThreshold) {
        console.log("We have returned true, TURN THAT SHIT ON!");
        setTimeout(function () {
            cooldown = false;
        }, cooldownTimer);
        // True value once reached upperThreshold will be passed into toggleAllLightsOffOn
        //temp
        toggleAllLightsOffOn(true);
    }

}