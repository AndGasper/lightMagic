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
  if (state == 'paused'){
      return
  }
  if (state == 'pausing') {
    state = 'paused';
  }else{
    if(frame.hands[0] && frame.hands[0].type === 'right'){
        var x = Math.floor((frame.hands[0].direction[0] + 1) * 128);
        var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128);
        var y = Math.floor((frame.hands[0].direction[2] + 1) *  128);
        var color = 'rgb(' + x + "," + z + "," + y + ')';
        sendColor(color);
    }
  }

  if (haveLoggedFrame == false && frame.hands[0]){
    haveLoggedFrame = true;
  }

});

  window.addEventListener("keypress", userColorChoice);


  let redColor = {'r': 255, 'g': 0, 'b': 0};
  let yellowColor = {'r': 255, 'g': 255, 'b': 0};
  let greenColor = {'r': 0, 'g':255, 'b': 0};
  let blueColor = {'r':0, 'g': 0, 'b': 255};
  let violetColor = {'r': 75, 'g':0, 'b':150};
  let whiteColor = {'r':255, 'g':255, 'b':255};


function userColorChoice() {
    switch(event.keyCode) {
        case(97):
            // 97 = a
            changeColor(11, redColor);
            changeColor(12, redColor);
            changeColor(5, redColor);
            changeColor(16, redColor);
            changeColor(17, redColor);
            break;
        case(115):
            // 115 = s
            changeColor(11, yellowColor);
            changeColor(12, yellowColor);
            changeColor(5, yellowColor);
            changeColor(16, yellowColor);
            changeColor(17, yellowColor);

            break;
        case(100):
            // 100 = d
            changeColor(11, greenColor);
            changeColor(12, greenColor);
            changeColor(15, greenColor);
            changeColor(16, greenColor);
            changeColor(17, greenColor);
            break;
        case(102):
            // 102 = f
            changeColor(11, blueColor);
            changeColor(12, blueColor);
            changeColor(15, blueColor);
            changeColor(16, blueColor);
            changeColor(17, blueColor);
            break;
        case(103):
            // 103 = g
            changeColor(11, violetColor );
            changeColor(12, violetColor);
            changeColor(5, violetColor);
            changeColor(16, violetColor);
            changeColor(17, violetColor);
            break;
        default:
            changeColor(11, whiteColor);
            changeColor(12, whiteColor);
            changeColor(5, whiteColor);
            changeColor(16, whiteColor);
            changeColor(17, whiteColor);
    };
}


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
        data: JSON.stringify({"xy":[x,y], "transitiontime": 0, "alert": "select"}), // time in milliseconds for the light change to take effect
        // data: JSON.stringify({"hue": hueAdjusted, "sat": saturationAdjusted, "bri": brightnessAdjusted, "transitiontime": 0}),
        success: (response) => {

        },
        error: (response) => {

        }
    });
}