



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
var controller = new Leap.Controller({enableGestures: true});
controller.loop(function(frame) {
  if (state == 'paused') return;
  if (state == 'pausing') {
    state = 'paused';
  }else{
      //  && frame.hands.type === 'right'
    if(frame.hands[0] && frame.hands[0].type === 'right'){
        var x = Math.floor((frame.hands[0].direction[0] + 1) * 128); // x = red
        var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128); // z = green
        var y = Math.floor((frame.hands[0].direction[2] + 1) *  128); // y = blue
        var color = 'rgb(' + x + "," + z + "," + y + ')';
        sendColor(color);

        changeColor(12, {"r":x, "g": z, "b": y}); // send the change color

    }
  }

  if (haveLoggedFrame == false && frame.hands[0]){
    haveLoggedFrame = true;
  }

});
function sendColor(color){
    document.getElementById('box').style.backgroundColor = color;
}
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
            (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
            return HSB; // return the now complete Hue, Saturation, and Brightness object
            break;

        case(blue):
            HSB.hue = (60 * ( ((red-green)/deltaColor) + 4));
            (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
            return HSB;
            break;

        case(green):
            HSB.hue = (60 * ( ((blue-red)/deltaColor) + 2));
            (HSB.hue < 0) ? (HSB.hue += 360) : (''); // If hue is negative, flip the color to the other side of the wheel by adding 360 degrees
            return HSB;
            break;
        default:
            console.log("Something has gone wrong if you've made it all the way here");
    }
}

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
        data: JSON.stringify({"hue": hueAdjusted, "sat": saturationAdjusted, "bri": brightnessAdjusted, "transitiontime": 0}),
        success: (response) => {

        },
        error: (response) => {

        }
    });
}