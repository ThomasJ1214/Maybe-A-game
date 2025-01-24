import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, player, path;
let puzzles = [];
let solved = 0;

function init() {
  // Scene and Renderer
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Camera (Player View)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 10);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;

  // Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 10, 0);
  scene.add(ambientLight, pointLight);

  // Path
  const pathGeometry = new THREE.PlaneGeometry(5, 50);
  const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  path = new THREE.Mesh(pathGeometry, pathMaterial);
  path.rotation.x = -Math.PI / 2;
  scene.add(path);

  // Player (invisible representation)
  player = new THREE.Object3D();
  player.position.set(0, 1.5, 8);
  scene.add(player);

  // Puzzles (Glowing Cubes)
  createPuzzle(-2, -15);
  createPuzzle(2, -30);
  createPuzzle(0, -45);

  // Animation Loop
  animate();
}

function createPuzzle(x, z) {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(x, 0.5, z);
  puzzles.push(cube);
  scene.add(cube);
}

function solvePuzzle(index) {
  const puzzle = puzzles[index];
  puzzle.material.emissive.setHex(0x000000);
  puzzle.material.color.setHex(0xffffff);
  solved++;
  if (solved === puzzles.length) {
    alert("You solved all puzzles! Congratulations!");
  } else {
    alert(`Puzzle ${index + 1} solved! Keep going.`);
  }
}

function checkCollision() {
  for (let i = 0; i < puzzles.length; i++) {
    const puzzle = puzzles[i];
    const distance = player.position.distanceTo(puzzle.position);
    if (distance < 1.5) {
      solvePuzzle(i);
      puzzles.splice(i, 1);
      return;
    }
  }
}

function animate() {
  controls.target.copy(player.position); // Camera follows the player
  controls.update();
  checkCollision();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function handleKeyDown(event) {
  const speed = 0.3;
  switch (event.key.toLowerCase()) {
    case "w":
      player.position.z -= speed;
      break;
    case "s":
      player.position.z += speed;
      break;
    case "a":
      player.position.x -= speed;
      break;
    case "d":
      player.position.x += speed;
      break;
  }
}

// Event Listeners
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the Game
init();
