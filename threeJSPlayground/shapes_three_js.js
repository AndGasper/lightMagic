var scene = new THREE.Scene();
// PerspectiveCamera(fov, aspect, near, far)
// fov - camera frustrum vertical field of view
// aspect - camera frustrum aspect ratio
// near - camera frustrum near plane
// far - camera frustrum far plane
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer(); // WebGL renderer => Makes stuff
renderer.setSize( window.innerWidth, window.innerHeight ); // Set the innerWidth and innerHeight equal to the window size
function ToroidGenerator() {
    // radius, tube, radialSegments, tubular
    let torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    let torusMesh = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let torus = new THREE.Mesh(torusGeometry, torusMesh);
    return torus;
};
function CubeGenerator() {
    let cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
    let cubeMesh = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    let cube = new THREE.Mesh( cubeGeometry, cubeMesh);
    return cube;
};

// Call the
function createGeometriesAndGroup() {
    // Could maybe do an array of these geometric shapes and do a loop to
    const cube =  CubeGenerator();
    const torus = ToroidGenerator();
    cube.position.set(0,10,0);
    torus.position.set(20,0,0);
    torus.rotation.x += 0.1;
    torus.rotation.y += 0.1;
    let group = new THREE.Group();
    group.add(cube);
    group.add(torus);
    return group;
}

const group = createGeometriesAndGroup();
scene.add(group);



camera.position.z = 100;

var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);

};

render();
