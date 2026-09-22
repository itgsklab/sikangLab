import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('[data-orbit-globe]');
const stage = document.querySelector('[data-orbit-stage]');

if (canvas && stage) {
  const starfield = document.querySelector('[data-starfield]');
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
    if (!starfield) return;
    const count = window.innerWidth < 768 ? 150 : 320;
    let seed = 991105;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const star = document.createElement('i');
      const sizeRoll = random();
      const meteor = random() < 0.14;
      const size = meteor ? 1.7 + random() * 1.3 : sizeRoll > 0.94 ? 3.2 : sizeRoll > 0.72 ? 2.1 : 1.15;
      const travelAngle = (18 + random() * 24) * Math.PI / 180;
      const travelDistance = meteor ? 360 + random() * 260 : 100 + random() * 140;
      const driftX = Math.cos(travelAngle) * travelDistance;
      const driftY = Math.sin(travelAngle) * travelDistance;
      if (meteor) star.classList.add('is-meteor');
      star.style.setProperty('--star-x', `${(random() * 100).toFixed(2)}%`);
      star.style.setProperty('--star-y', `${(random() * 100).toFixed(2)}%`);
      star.style.setProperty('--star-size', `${size}px`);
      star.style.setProperty('--star-opacity', (0.34 + random() * 0.58).toFixed(2));
      star.style.setProperty('--star-start-x', `${(-driftX * 0.5).toFixed(2)}px`);
      star.style.setProperty('--star-start-y', `${(-driftY * 0.5).toFixed(2)}px`);
      star.style.setProperty('--star-end-x', `${(driftX * 0.5).toFixed(2)}px`);
      star.style.setProperty('--star-end-y', `${(driftY * 0.5).toFixed(2)}px`);
      star.style.setProperty('--star-travel-duration', `${(meteor ? 2.5 + random() * 2.7 : 4.8 + random() * 4.2).toFixed(2)}s`);
      star.style.setProperty('--star-travel-delay', `${(-random() * 12).toFixed(2)}s`);
      star.style.setProperty('--star-twinkle-duration', `${(2.4 + random() * 4.8).toFixed(2)}s`);
      star.style.setProperty('--star-twinkle-delay', `${(-random() * 7).toFixed(2)}s`);
      star.style.setProperty('--star-trail-length', `${(32 + random() * 54).toFixed(2)}px`);
      star.style.setProperty('--star-travel-angle', `${(travelAngle * 180 / Math.PI).toFixed(2)}deg`);
      fragment.appendChild(star);
    }
    starfield.replaceChildren(fragment);
  }

  createStars();
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
  const isChinese = document.documentElement.lang.toLowerCase().startsWith('zh');
  const subject = encodeURIComponent(isChinese ? `来自 Sikang Lab 的留言：${name}` : `Message from Sikang Lab: ${name}`);
  const body = encodeURIComponent(isChinese ? `姓名：${name}\n邮箱：${email}\n\n${message}` : `Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
