$(document).ready(function(){
    $("#hueGET").on('click', callLights);
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

function toggleLightsOff(lightNumber) {
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/${lightNumber}/state`;
    const state = $("#onOffCheckbox:checked");
    console.log("toggleLightsOff state", state);
    $.ajax({
        url: `${BASE_URL}/lights/${lightNumber}/state`,
        dataType: "JSON",
        method: "PUT",
        data: {"on": `${state}`},
        success: function(response) {
            console.log("toggleLights success response", response);
        },
        error: function(response) {
            console.log("toggleLights error response", response);
        }
    })
}