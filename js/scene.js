var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 );

camera.position.z = 600;
camera.lookAt(new THREE.Vector3(0,300,0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var render = function () {
    requestAnimationFrame( render );


    renderer.render(scene, camera);
};

render();