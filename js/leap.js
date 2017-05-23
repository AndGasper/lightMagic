function moveFinger(Finger, posX, posY, posZ) {
  Finger.style.webkitTransform = "translate3d("+posX+"px, "+posY+"px, "+posZ+"px)";
}

function moveSphere(Sphere, posX, posY, posZ, rotX, rotY, rotZ) {
  Sphere.style.webkitTransform = Sphere.style.mozTransform =
  Sphere.style.transform = "translateX("+posX+"px) translateY("+posY+"px) translateZ("+posZ+"px) rotateX("+rotX+"deg) rotateY(0deg) rotateZ(0deg)";
}

var fingers = {};
var spheres = {};
Leap.loop(function(frame) {
  var seenFingers = {};
  var handIds = {};
  if (frame.hands === undefined ) {
    var handsLength = 0
  } else {
    var handsLength = frame.hands.length;
  }

  for (var handId = 0, handCount = handsLength; handId != handCount; handId++) {
    var hand = frame.hands[handId];
    var posX = (hand.palmPosition[0]*3);
    var posY = (hand.palmPosition[2]*3)-200;
    var posZ = (hand.palmPosition[1]*3)-400;
    var rotX = (hand._rotation[2]*90);
    var rotY = (hand._rotation[1]*90);
    var rotZ = (hand._rotation[0]*90);
    var sphere = spheres[hand.id];
    if (!sphere) {
      var sphereDiv = document.getElementById("sphere").cloneNode(true);
      sphereDiv.setAttribute('id',hand.id);
      sphereDiv.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16);
      document.getElementById('scene').appendChild(sphereDiv);
      spheres[hand.id] = hand.id;
    } else {
      var sphereDiv =  document.getElementById(hand.id);
      if (typeof(sphereDiv) != 'undefined' && sphereDiv != null) {
        moveSphere(sphereDiv, posX, posY, posZ, rotX, rotY, rotZ);
      }
    }
    handIds[hand.id] = true;
  }
  for (handId in spheres) {
    if (!handIds[handId]) {
      var sphereDiv =  document.getElementById(spheres[handId]);
      sphereDiv.parentNode.removeChild(sphereDiv);
      delete spheres[handId];
    }
  }

  for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
    var pointable = frame.pointables[pointableId];
    var newFinger = false;
    if (pointable.finger) {
      if (!fingers[pointable.id]) {
        fingers[pointable.id] = [];
        newFinger = true;
      }

      for (var partId = 0, length; partId != 4; partId++) {
        var posX = (pointable.positions[partId][0]*3);
        var posY = (pointable.positions[partId][2]*3)-200;
        var posZ = (pointable.positions[partId][1]*3)-400;

        var id = pointable.id+'_'+partId;

        var finger = fingers[id];
        if (newFinger) {
          var fingerDiv = document.getElementById("finger").cloneNode(true);
          fingerDiv.setAttribute('id', id);
          fingerDiv.style.backgroundColor='#'+Math.floor(pointable.type*500).toString(16);
          document.getElementById('scene').appendChild(fingerDiv);
          fingers[pointable.id].push(id);
        } else  {
          var fingerDiv =  document.getElementById(id);
          if (typeof(fingerDiv) != 'undefined' && fingerDiv != null) {
            moveFinger(fingerDiv, posX, posY, posZ);
          }
        }
        seenFingers[pointable.id] = true;
      }

      //var dirX = -(pointable.direction[1]*90);
      //var dirY = -(pointable.direction[2]*90);
      //var dirZ = (pointable.direction[0]*90);
    }
  }
  for (var fingerId in fingers) {
    if (!seenFingers[fingerId]) {
      var ids = fingers[fingerId];
      for (var index in ids) {
        var fingerDiv =  document.getElementById(ids[index]);
        fingerDiv.parentNode.removeChild(fingerDiv);
      }
      delete fingers[fingerId];
    }
  }
  document.getElementById('showHands').addEventListener('mousedown', function() {
    document.getElementById('app').setAttribute('class','show-hands');
  }, false);
  document.getElementById('hideHands').addEventListener('mousedown', function() {
    document.getElementById('app').setAttribute('class','');
  }, false);
});
