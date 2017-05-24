
// # Basic Hands without any options.  Use as fallback if Advanced is broken
// (window.controller = new Leap.Controller)
    // .use('riggedHand')
    // .connect();

// # Advanced Hands with options defined.
(window.controller = new Leap.Controller)
    .use('handHold', {})
    .use('handEntry', {})
    .use('riggedHand', {
        // # Scene and scope objects are not defined.  For future use
        // parent: scene,
        // # this is called on every animationFrame
        // renderFn: function() {
        //     renderer.render(scene, camera);
        //     return controls.update();
        // },

        // # These options are merged with the material options hash
        // # Any valid Three.js material options are valid here.
        materialOptions: {
            // wireframe: true,
            color: new THREE.Color(0xff0000)
        },
        // geometryOptions: {},

        // # This will show pink dots at the raw position of every leap joint on the last hand object created
        // # they will be slightly offset from the rig shape, due to it having slightly different proportions.
        dotsMode: true,

        // # sets the scale of the mesh in the scene.  The default scale works with a camera of distance ~15.
        // scale: 1.5,
        // positionScale: 2,

        // # Turn this function off to remove the text from displaying on the bones hands
        boneLabels: function(boneMesh, leapHand) {
            return boneMesh.name;
        },

        // # allows individual bones to be colorized
        // # Currently, thumb and index finger turn blue while pinching with any finger
        // # this method is called for every bone on each frame
        // # should return an object with hue, saturation, and an optional lightness ranging from 0 to 1
        // # http://threejs.org/docs/#Reference/Math/Color [setHSL]
        boneColors: function(boneMesh, leapHand) {
            if ((boneMesh.name.indexOf('T_') === 0) || (boneMesh.name.indexOf('I_') === 0)) {
                return {
                    hue: 0.6,
                    saturation: leapHand.pinchStrength
                };
            }
        },
        checkWebGL: true
    }).connect();