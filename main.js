import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ==========================================
// بخش ۱: صحنه
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1a);
scene.fog = new THREE.Fog(0x0f0f1a, 15, 40);

// ==========================================
// بخش ۲: دوربین
// ==========================================
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(6, 4, 9);

// ==========================================
// بخش ۳: رندرر
// ==========================================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ==========================================
// بخش ۴: محیط انعکاس (Environment)
// ==========================================
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;

// ==========================================
// بخش ۵: نورپردازی
// ==========================================
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(8, 12, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -12;
dirLight.shadow.camera.right = 12;
dirLight.shadow.camera.top = 12;
dirLight.shadow.camera.bottom = -12;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

const fillLight = new THREE.PointLight(0x4fc3f7, 40, 25);
fillLight.position.set(-6, 4, 4);
scene.add(fillLight);

const backLight = new THREE.PointLight(0xff6b6b, 30, 25);
backLight.position.set(4, 3, -6);
scene.add(backLight);

// ==========================================
// بخش ۶: زمین (با انعکاس ملایم)
// ==========================================
const groundGeo = new THREE.CircleGeometry(20, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x14141f,
  roughness: 0.35,
  metalness: 0.6,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// حلقه نورانی دور زمین
const ringGeo = new THREE.RingGeometry(6, 6.1, 64);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0x4fc3f7,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.4,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.01;
scene.add(ring);

// ==========================================
// بخش ۷: متریال‌های مشترک
// ==========================================
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x1a1a2e,
  metalness: 0.9,
  roughness: 0.05,
  transmission: 0.5,
  transparent: true,
  opacity: 0.85,
});
const wheelMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.85,
  metalness: 0.2,
});
const rimMat = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.2,
  metalness: 1,
});
const headlightMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffcc,
  emissiveIntensity: 3,
});
const taillightMat = new THREE.MeshStandardMaterial({
  color: 0xff2222,
  emissive: 0xff0000,
  emissiveIntensity: 2,
});

// متریال بدنه (قابل تغییر رنگ)
const bodyMat = new THREE.MeshPhysicalMaterial({
  color: 0xe63946,
  metalness: 0.8,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});

// ==========================================
// بخش ۸: تابع ساخت چرخ
// ==========================================
function createWheel() {
  const wheelGroup = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.3, 32),
    wheelMat
  );
  tire.rotation.x = Math.PI / 2;
  tire.castShadow = true;
  wheelGroup.add(tire);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.32, 16),
    rimMat
  );
  rim.rotation.x = Math.PI / 2;
  wheelGroup.add(rim);

  // پره‌های رینگ
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.05, 0.06),
      rimMat
    );
    spoke.rotation.z = (i * Math.PI * 2) / 5;
    spoke.position.z = 0.17;
    wheelGroup.add(spoke);
  }

  return wheelGroup;
}

// ==========================================
// بخش ۹: تابع ساخت ماشین اسپرت
// ==========================================
function createSportsCar() {
  const car = new THREE.Group();

  // بدنه اصلی
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.6, 1.8),
    bodyMat
  );
  body.position.y = 0.4;
  body.castShadow = true;
  car.add(body);

  // کاپوت شیب‌دار
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 1.7),
    bodyMat
  );
  hood.position.set(1.4, 0.75, 0);
  hood.rotation.z = -0.15;
  hood.castShadow = true;
  car.add(hood);

  // کابین
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.65, 1.5),
    glassMat
  );
  cabin.position.set(-0.3, 1, 0);
  cabin.castShadow = true;
  car.add(cabin);

  // سقف
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.1, 1.5),
    bodyMat
  );
  roof.position.set(-0.3, 1.35, 0);
  roof.castShadow = true;
  car.add(roof);

  // اسپویلر عقب
  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.1, 1.6),
    bodyMat
  );
  spoiler.position.set(-2, 1.05, 0);
  spoiler.castShadow = true;
  car.add(spoiler);

  // پایه‌های اسپویلر
  [-0.7, 0.7].forEach((z) => {
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.3, 0.1),
      bodyMat
    );
    stand.position.set(-2, 0.85, z);
    car.add(stand);
  });

  // چراغ‌های جلو
  [0.55, -0.55].forEach((z) => {
    const hl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.2, 0.35),
      headlightMat
    );
    hl.position.set(2.02, 0.5, z);
    car.add(hl);
  });

  // چراغ‌های عقب
  [0.55, -0.55].forEach((z) => {
    const tl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.2, 0.4),
      taillightMat
    );
    tl.position.set(-2.02, 0.5, z);
    car.add(tl);
  });

  // چرخ‌ها
  const wheelPositions = [
    [1.35, 0.45, 0.95],
    [1.35, 0.45, -0.95],
    [-1.35, 0.45, 0.95],
    [-1.35, 0.45, -0.95],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel();
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  return car;
}

// ==========================================
// بخش ۱۰: تابع ساخت شاسی‌بلند
// ==========================================
function createSUV() {
  const car = new THREE.Group();

  // بدنه
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.2, 2),
    bodyMat
  );
  body.position.y = 1;
  body.castShadow = true;
  car.add(body);

  // کابین
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.9, 1.85),
    glassMat
  );
  cabin.position.set(-0.3, 1.95, 0);
  cabin.castShadow = true;
  car.add(cabin);

  // سقف
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.1, 1.9),
    bodyMat
  );
  roof.position.set(-0.3, 2.45, 0);
  roof.castShadow = true;
  car.add(roof);

  // چراغ‌های جلو
  [0.7, -0.7].forEach((z) => {
    const hl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.25, 0.35),
      headlightMat
    );
    hl.position.set(2.12, 1.1, z);
    car.add(hl);
  });

  // چراغ‌های عقب
  [0.7, -0.7].forEach((z) => {
    const tl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.25, 0.4),
      taillightMat
    );
    tl.position.set(-2.12, 1.1, z);
    car.add(tl);
  });

  // چرخ‌ها
  const wheelPositions = [
    [1.45, 0.55, 1.05],
    [1.45, 0.55, -1.05],
    [-1.45, 0.55, 1.05],
    [-1.45, 0.55, -1.05],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel();
    wheel.scale.set(1.2, 1.2, 1.2);
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  return car;
}

// ==========================================
// بخش ۱۱: تابع ساخت کامیون
// ==========================================
function createTruck() {
  const car = new THREE.Group();

  // کابین
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 2),
    bodyMat
  );
  cabin.position.set(1.3, 1.3, 0);
  cabin.castShadow = true;
  car.add(cabin);

  // شیشه کابین
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.7, 1.7),
    glassMat
  );
  windshield.position.set(2.21, 1.6, 0);
  car.add(windshield);

  // بار عقب
  const cargo = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.6, 2),
    new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.7,
      metalness: 0.3,
    })
  );
  cargo.position.set(-0.9, 1.4, 0);
  cargo.castShadow = true;
  car.add(cargo);

  // چراغ‌های جلو
  [0.7, -0.7].forEach((z) => {
    const hl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.25, 0.3),
      headlightMat
    );
    hl.position.set(2.22, 0.9, z);
    car.add(hl);
  });

  // چراغ‌های عقب
  [0.7, -0.7].forEach((z) => {
    const tl = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.25, 0.35),
      taillightMat
    );
    tl.position.set(-2.31, 1.2, z);
    car.add(tl);
  });

  // چرخ‌ها
  const wheelPositions = [
    [1.3, 0.55, 1.05],
    [1.3, 0.55, -1.05],
    [-1.5, 0.55, 1.05],
    [-1.5, 0.55, -1.05],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel();
    wheel.scale.set(1.3, 1.3, 1.3);
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  return car;
}

// ==========================================
// بخش ۱۲: مدیریت ماشین‌ها
// ==========================================
const cars = {
  sport: createSportsCar(),
  suv: createSUV(),
  truck: createTruck(),
};

const carRoot = new THREE.Group();
scene.add(carRoot);

let currentCarKey = 'sport';
carRoot.add(cars.sport);
// ماشین‌های دیگر مخفی
cars.suv.visible = false;
cars.truck.visible = false;

// ==========================================
// بخش ۱۳: کنترل‌ها
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 4;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.target.set(0, 0.8, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;

// ==========================================
// بخش ۱۴: داده‌های ماشین‌ها
// ==========================================
const carData = {
  '0xe63946': {
    name: '🔥 Ferrari Red',
    specs: `موتور: <span>V8 Twin-Turbo</span><br />
            قدرت: <span>650 اسب بخار</span><br />
            سرعت نهایی: <span>320 km/h</span><br />
            شتاب 0-100: <span>3.2 ثانیه</span><br />
            وزن: <span>1450 کیلوگرم</span>`,
  },
  '0x4fc3f7': {
    name: '💧 Ocean Blue',
    specs: `موتور: <span>V6 Turbo</span><br />
            قدرت: <span>420 اسب بخار</span><br />
            سرعت نهایی: <span>280 km/h</span><br />
            شتاب 0-100: <span>4.1 ثانیه</span><br />
            وزن: <span>1520 کیلوگرم</span>`,
  },
  '0xffd166': {
    name: '⚡ Electric Yellow',
    specs: `موتور: <span>Electric Dual-Motor</span><br />
            قدرت: <span>500 اسب بخار</span><br />
            سرعت نهایی: <span>250 km/h</span><br />
            شتاب 0-100: <span>2.8 ثانیه</span><br />
            وزن: <span>1800 کیلوگرم</span>`,
  },
  '0x06d6a0': {
    name: '🌿 Hybrid Green',
    specs: `موتور: <span>Hybrid I4</span><br />
            قدرت: <span>300 اسب بخار</span><br />
            سرعت نهایی: <span>230 km/h</span><br />
            شتاب 0-100: <span>5.5 ثانیه</span><br />
            وزن: <span>1400 کیلوگرم</span>`,
  },
  '0x9b5de5': {
    name: '👾 Midnight Purple',
    specs: `موتور: <span>V12</span><br />
            قدرت: <span>800 اسب بخار</span><br />
            سرعت نهایی: <span>350 km/h</span><br />
            شتاب 0-100: <span>2.5 ثانیه</span><br />
            وزن: <span>1600 کیلوگرم</span>`,
  },
};

// ==========================================
// بخش ۱۵: تغییر رنگ با کلیک
// ==========================================
const nameEl = document.getElementById('car-name');
const specsEl = document.getElementById('car-specs');

document.querySelectorAll('.color-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    bodyMat.color.set(color);

    const data = carData[color];
    if (data) {
      nameEl.innerHTML = `🏎️ ${data.name}`;
      specsEl.innerHTML = data.specs;
    }
  });
});

// ==========================================
// بخش ۱۶: تعویض ماشین از گالری
// ==========================================
document.querySelectorAll('.gallery button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.car;
    if (key === currentCarKey) return;

    // مخفی کردن ماشین قبلی
    carRoot.remove(cars[currentCarKey]);

    // نمایش ماشین جدید
    currentCarKey = key;
    carRoot.add(cars[key]);

    // به‌روزرسانی دکمه فعال
    document.querySelectorAll('.gallery button').forEach((b) =>
      b.classList.remove('active')
    );
    btn.classList.add('active');
  });
});

// توقف چرخش خودکار وقتی کاربر کنترل را دست می‌گیرد
controls.addEventListener('start', () => {
  controls.autoRotate = false;
});

// ==========================================
// بخش ۱۷: حلقه انیمیشن
// ==========================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // چرخش ملایم ماشین (نور و انیمیشن کوچک)
  carRoot.rotation.y = Math.sin(t * 0.3) * 0.05;

  // انیمیشن چرخ‌ها (خیلی ملایم)
  carRoot.traverse((obj) => {
    if (obj.isGroup && obj.children.length > 0) {
      // چرخ‌ها گروه هستند
      obj.rotation.z = t * 0.5;
    }
  });

  // حرکت نور محیطی برای زیبایی
  fillLight.position.x = Math.sin(t * 0.5) * 6;
  fillLight.position.z = Math.cos(t * 0.5) * 6;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ==========================================
// بخش ۱۸: رویداد تغییر اندازه
// ==========================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
