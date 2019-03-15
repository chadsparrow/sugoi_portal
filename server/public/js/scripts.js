var renderer, scene, camera, controls;

//scene.background = new THREE.Color(0x666666);

window.onload = function() {
  init();
  animate();
};

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById("canvas").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  //scene.add(camera);

  camera.position.set(0, 50, 700);


  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -0.4;
  controls.enablePan = false;

  var ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  //keyLight.position.set(-100, 0, 100);

  var fillLight = new THREE.DirectionalLight(0xffffff, 0.15);
  fillLight.position.set(0, -100, -100);

  var backLight = new THREE.DirectionalLight(0xffffff, 0.15);
  backLight.position.set(0, 0, 100); //.normalize();

  scene.add(ambientLight);
  scene.add(fillLight);
  scene.add(backLight);

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath("./assets/");
  mtlLoader.setPath("./assets/");
  mtlLoader.load("CJ52M-SSSPFF-DRG_Colorway_1.mtl", function(materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("./assets/");
    objLoader.load("CJ52M-SSSPFF-DRG_Colorway_1.obj", function(object) {
      sideReplacer(object);
      scene.add(object);
      object.position.y -= 1225;
      object.position.z += 50;
      object.rotation.y = Math.PI / 1;
    });
  });
}

function sideReplacer(obj) {
  if (obj.material) {
    obj.material.side = THREE.BackSide;
  }
  if (obj.children && obj.children.length > 0) {
    for (var i in obj.children) {
      sideReplacer(obj.children[i]);
    }
  }
}

var animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
