$(document).ready(function(){
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
        success: function(response) {
            console.log("success callLights", response);
            // then toggle the lights off
            for (let i = 0; i < Object.keys(response); i++) {
                toggleLightsOff(i); // toggle each light off by iterating through with this axios call
            }
        },
        error: function(response) {
            console.log("callLights error", response);
        }

    });
}

function toggleLightsOffOn() {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/11/state`;
    const state = $("#onOffCheckbox:checked");
    console.log("toggleLightsOff state", state);
    let lightState = {"on": "true"};

    console.log("lightState", lightState);
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: '{"on": true}',
        success: function(response) {
            console.log("toggleLights success response", response);
        },
        error: function(response) {
            console.log("toggleLights error response", response);
        }
    })
}

function toggleAllLightsOffOn() {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/groups/3/action`;
    const state = $("#onOffCheckbox:checked");
    console.log("toggleLightsOff state", state);
    let lightState = {"on": true};
    console.log("lightState", lightState);
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "PUT",
        data: JSON.stringify(lightState),
        success: function(response) {
            console.log("toggleLights success response", response);
        },
        error: function(response) {
            console.log("toggleLights error response", response);
        }
    })
}