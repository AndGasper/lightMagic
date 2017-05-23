$(document).ready(function(){
    $("#hueGET").on('click', toggleLightsOffOn);
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
// Is this light off or on?
function getLightState() {

    const lightNumber = $("#lightNumber").val();
    console.log("lightNumber", lightNumber);
    const BASE_URL = `http://${bridgeIPAddress}/api/${hueUsername}/lights/${lightNumber.toString()}`;
    console.log("getLightState BASE_URL", BASE_URL); // checking the base url
    $.ajax({
        url: `${BASE_URL}`,
        dataType: "JSON",
        method: "GET",
        success: (response) => {
            console.log("getLightState response.state", response.state);
            let lightStateText = response.state.on.toString(); // Convert the boolean to a string
            let lightState = $("<p>").text(lightStateText);
            $(".body").append(lightState);
        },
        error: (response) => {
            console.log("getLightState response error", response);
        }
    })
}

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
console.log("getHue(222,250,100)", getHSB(255,250,100));
//RGB and their HSL Values
    // RGB = 255, 250, 100
    // HSL = 58, 100.0, 69.6 - Yellow
    // RGB = 255, 100, 255
    // HSL = 300, 100, 69.6 - Pink
    // RGB = 100, 255, 255
    // HSL = 180, 100, 69.6 - Cyan


// color is an object with r,g,b
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



