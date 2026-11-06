import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------- ۱. صحنه ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1a);
scene.fog = new THREE.Fog(0x0f0f1a, 10, 30);

// ---------- ۲. دوربین ----------
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 3, 7);

// ---------- ۳. رندرر ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ---------- ۴. نورپردازی ----------
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x4fc3f7, 30, 20);
pointLight.position.set(-3, 2, 3);
scene.add(pointLight);

// ---------- ۵. زمین ----------
const groundGeo = new THREE.CircleGeometry(12, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.8,
  metalness: 0.2,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// ---------- ۶. ساخت ماشین (با چند مکعب) ----------
const car = new THREE.Group();

const bodyMat = new THREE.MeshStandardMaterial({
  color: 0xe63946,
  metalness: 0.7,
  roughness: 0.25,
});
const glassMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  metalness: 0.9,
  roughness: 0.1,
});
const wheelMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.9,
});

// بدنه اصلی
const body = new THREE.Mesh(new THREE.BoxGeometry(4, 0.7, 1.8), bodyMat);
body.position.y = 0.3;
body.castShadow = true;
car.add(body);

// کابین
const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.5), glassMat);
cabin.position.set(-0.2, 0.95, 0);
cabin.castShadow = true;
car.add(cabin);

// چرخ‌ها
const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 24);
const wheelPositions = [
  [1.3, 0, 0.95],
  [1.3, 0, -0.95],
  [-1.3, 0, 0.95],
  [-1.3, 0, -0.95],
];
wheelPositions.forEach(([x, y, z]) => {
  const wheel = new THREE.Mesh(wheelGeo, wheelMat);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(x, y, z);
  wheel.castShadow = true;
  car.add(wheel);
});

// چراغ‌های جلو
const lightMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffaa,
  emissiveIntensity: 2,
});
const headlightGeo = new THREE.BoxGeometry(0.1, 0.2, 0.4);
[0.5, -0.5].forEach((z) => {
  const hl = new THREE.Mesh(headlightGeo, lightMat);
  hl.position.set(2, 0.35, z);
  car.add(hl);
});

car.position.y = 0.5;
scene.add(car);

// ---------- ۷. کنترل‌ها ----------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 4;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.target.set(0, 0.5, 0);

// ---------- ۸. حلقه انیمیشن ----------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ---------- ۹. رویداد تغییر اندازه ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
