import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('[data-orbit-globe]');
const stage = document.querySelector('[data-orbit-stage]');

if (canvas && stage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(-4, 3, 6);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, canvas);
  controls.autoRotate = !reducedMotion.matches;
  controls.autoRotateSpeed = 2;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0, 0);
  controls.update();

  function createStars() {
    const count = window.innerWidth < 768 ? 260 : 560;
    const positions = new Float32Array(count * 3);
    let seed = 991105;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      positions[offset] = (random() - 0.5) * 22;
      positions[offset + 1] = (random() - 0.5) * 15;
      positions[offset + 2] = -4 - random() * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xf4e8ff,
      size: window.innerWidth < 768 ? 0.032 : 0.026,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
    const stars = new THREE.Points(geometry, material);
    stars.renderOrder = -1;
    scene.add(stars);
    return stars;
  }

  const stars = createStars();
  let frame = 0;
  let visible = true;
  let lastTime = performance.now();

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    renderer.setPixelRatio(window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  function render(time) {
    if (!visible || document.hidden) {
      frame = 0;
      return;
    }

    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    controls.update(delta);
    stars.rotation.y += delta * 0.006;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(render);
  }

  function start() {
    if (frame || !visible || document.hidden) return;
    lastTime = performance.now();
    frame = window.requestAnimationFrame(render);
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  }

  new GLTFLoader().load(
    stage.dataset.modelUrl,
    (gltf) => {
      const planet = gltf.scene;
      planet.scale.setScalar(2.5);
      planet.position.set(0, 0, 0);
      planet.rotation.set(0, 0, 0);
      planet.traverse((node) => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
      });
      scene.add(planet);
      stage.classList.add('is-ready');
      resize();
      start();
    },
    undefined,
    (error) => {
      console.error('Unable to load the 3D planet model.', error);
      stage.classList.add('has-model-error');
    }
  );

  controls.addEventListener('start', () => stage.classList.add('is-dragging'));
  controls.addEventListener('end', () => stage.classList.remove('is-dragging'));

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }, { rootMargin: '180px' })
    : null;
  visibilityObserver?.observe(stage);

  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(stage);
  if (!resizeObserver) window.addEventListener('resize', resize, { passive: true });

  reducedMotion.addEventListener?.('change', () => {
    controls.autoRotate = !reducedMotion.matches;
    renderer.render(scene, camera);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  if (!visibilityObserver) start();
}

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const recipient = contactForm.dataset.contactEmail;
  const subject = encodeURIComponent(`来自 Sikang Lab 的留言：${name}`);
  const body = encodeURIComponent(`姓名：${name}\n邮箱：${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
