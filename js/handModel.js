
// # Basic Hands without any options.  Use as fallback if Advanced is broken
// (window.controller = new Leap.Controller)
    // .use('riggedHand')
    // .connect();

// # Advanced Hands with options defined.
(window.controller = new Leap.Controller)
    .setBackground(false)
    .use('handHold', {})
    .use('handEntry', {})
    .use('riggedHand', {
        // # Scene and scope objects are not defined.  For future use
        // parent: scene,
        // # this is called on every animationFrame
        // renderFn: function() {
        //     renderer.render(scene, camera);
        //     return controller.update();
        // },

        // # These options are merged with the material options hash
        // # Any valid Three.js material options are valid here.
        materialOptions: {
            // wireframe: true,
            opacity: 1,
            color: new THREE.Color(0xfafafa)
        },
        // geometryOptions: {},

        // # This will show pink dots at the raw position of every leap joint on the last hand object created
        // # they will be slightly offset from the rig shape, due to it having slightly different proportions.
        // dotsMode: true,

        // # sets the scale of the mesh in the scene.  The default scale works with a camera of distance ~15.
        // scale: 1.5,
        // positionScale: 2,

        // # Turn this function off to remove the text from displaying on the bones hands
        // boneLabels: function(boneMesh, leapHand) {
        //     return boneMesh.name;
        // },

        // # allows individual bones to be colorized
        // # Currently, thumb and index finger turn blue while pinching with any finger
        // # this method is called for every bone on each frame
        // # should return an object with hue, saturation, and an optional lightness ranging from 0 to 1
        // # http://threejs.org/docs/#Reference/Math/Color [setHSL]
        boneColors: function(boneMesh, leapHand) {
            if ((boneMesh.name.indexOf('T_3') === 0) || (boneMesh.name.indexOf('I_3') === 0)) {
                return {
                    hue: 0.6,
                    saturation: leapHand.pinchStrength
                };
            }
        },
        checkWebGL: true
    }).connect();


scene = window.controller.plugins.riggedHand.parent; // window.controller because that is what it is called above


var geometry = new THREE.BoxGeometry( 40, 40, 40);
var material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true} );

// Cube A = left extrema of ellipse
var cubeA = new THREE.Mesh( geometry, material );
cubeA.position.set(-350,250,-50);

var cubeB = new THREE.Mesh( geometry, material );
cubeB.position.set(-225,350,-100);

// Cube C = Center cube of elliptical layout
// x: -5 centers the cubes
var cubeC = new THREE.Mesh( geometry, material );
cubeC.position.set(-5,425,-125);

var cubeD = new THREE.Mesh( geometry, material );
cubeD.position.set(225,350,-100);

// Cube E = right extrema of ellipse
var cubeE = new THREE.Mesh( geometry, material );
cubeE.position.set(350,250,-50);
//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
var group = new THREE.Group();
group.add( cubeA );
group.add( cubeB );
group.add( cubeC );
group.add( cubeD );
group.add( cubeE );
scene.add( group );


var sphere, sphereMesh;
sphere = new THREE.Mesh(new THREE.SphereGeometry(30), sphereMesh = new THREE.MeshBasicMaterial({color: 0x00ff00}));

scene = window.controller.plugins.riggedHand.parent;
scene.add(sphere);

function findRight(hand){
    if (hand.type === 'right' && hand.grabStrength < 1)
        return displaySphere(hand);
}

function displaySphere (hand){
    handMesh = hand.data('riggedHand.mesh');
    sphere.visible = true;
    return handMesh.scenePosition(hand.sphereCenter, sphere.position);
}

// This is the post render callback function.  It gets called on each frame received
controller.on('frame', function(frame) {
    sphere.visible = false;
    frame.hands.forEach(findRight);
});
