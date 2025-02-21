// Core Three.js Setup
let scene, camera, renderer, model;
const sceneContainer = document.getElementById("scene-container");

// Initialize scene, camera, and renderer
function initScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0d0d0d, 0.001);

  camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  sceneContainer.appendChild(renderer.domElement);

  // Add ambient light and neon-like directional light
  const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0x39ff14, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
}

// Load the 3D model using GLTFLoader
function loadModel() {
  const loader = new THREE.GLTFLoader();
  // Replace with the path to your 3D model file (e.g., .glb or .gltf)
  loader.load('models/4d_woman.glb', (gltf) => {
    model = gltf.scene;
    // Scale and position the model appropriately
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);

    // Optionally start the walking animation using GSAP
    gsap.to(model.position, {
      z: -10,
      duration: 20,
      ease: "none",
      repeat: -1,
      yoyo: true
    });
  },
  undefined,
  (error) => { console.error('An error happened loading the model:', error); });
}

// Mouse movement interaction to slightly rotate the model/scene
function setupMouseInteraction() {
  document.addEventListener('mousemove', (e) => {
    // Normalize mouse coordinates (-1 to 1)
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Smoothly animate camera rotation based on mouse move
    gsap.to(camera.rotation, {
      x: mouseY * 0.1,
      y: mouseX * 0.1,
      duration: 0.5,
      ease: "power2.out"
    });
  });
}

// Smooth scroll update: you could even use scroll position to affect scene properties
function setupScrollInteraction() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Example: update scene fog density or model opacity based on scroll
    if(model) {
      model.rotation.y += scrollY * 0.0001;
    }
  });
}

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  
  // If you want continuous subtle animations (e.g., floating clouds)
  // scene.children.forEach(child => { ... });
  
  renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
});

// Ambient sound playback
function playAmbientSound() {
  const ambientAudio = document.getElementById("ambient-audio");
  ambientAudio.volume = 0.3; // adjust volume as needed
  ambientAudio.play().catch(err => console.log('Audio playback failed:', err));
}

// Initialize everything
function init() {
  initScene();
  loadModel();
  setupMouseInteraction();
  setupScrollInteraction();
  playAmbientSound();
  animate();
}

init();
