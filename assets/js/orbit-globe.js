(() => {
  const canvas = document.querySelector('[data-orbit-globe]');
  const stage = document.querySelector('[data-orbit-stage]');
  if (!canvas || !stage) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const palette = ['#ffb38f', '#ffd8b2', '#fff0de', '#78e6ea'];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let lights = [];
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let visible = true;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function randomFactory(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function gaussian(random) {
    const u = Math.max(random(), 0.0001);
    const v = Math.max(random(), 0.0001);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
  }

  function buildScene() {
    const random = randomFactory(991105);
    const starCount = width < 600 ? 95 : 190;
    stars = Array.from({ length: starCount }, () => ({
      x: random(),
      y: random(),
      size: 0.35 + random() * 1.45,
      alpha: 0.22 + random() * 0.7,
      phase: random() * TAU
    }));

    const regions = [
      [52, 13, 11, 22, 120],
      [35, 105, 13, 24, 150],
      [22, 79, 9, 12, 90],
      [36, -95, 15, 25, 130],
      [-15, -58, 20, 14, 70],
      [1, 108, 12, 18, 70],
      [4, 22, 21, 19, 85]
    ];
    const density = width < 600 ? 0.58 : 1;
    lights = [];
    regions.forEach(([lat, lon, latSpread, lonSpread, count], regionIndex) => {
      for (let i = 0; i < Math.round(count * density); i += 1) {
        lights.push({
          lat: Math.max(-72, Math.min(72, lat + gaussian(random) * latSpread * 0.52)),
          lon: lon + gaussian(random) * lonSpread * 0.54,
          size: 0.45 + random() * 1.7,
          alpha: 0.24 + random() * 0.72,
          phase: random() * TAU,
          color: palette[(regionIndex + Math.floor(random() * palette.length)) % palette.length]
        });
      }
    });
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScene();
    draw(elapsed);
  }

  function project(lat, lon, rotation, centerX, centerY, radius) {
    const phi = lat * Math.PI / 180;
    const theta = lon * Math.PI / 180 + rotation;
    const cosPhi = Math.cos(phi);
    const depth = cosPhi * Math.cos(theta);
    return {
      x: centerX + radius * cosPhi * Math.sin(theta),
      y: centerY - radius * Math.sin(phi),
      depth
    };
  }

  function drawStars(time) {
    stars.forEach((star) => {
      const pulse = 0.62 + Math.sin(time * 0.0012 + star.phase) * 0.38;
      ctx.globalAlpha = star.alpha * pulse;
      ctx.fillStyle = '#f5e9ff';
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, TAU);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  const bands = [
    { offset: -0.91, width: 20, wave: 0.080, tilt: -0.04, speed: 0.00030, phase: 0.2, frontStart: 0.20, frontEnd: 0.82 },
    { offset: -0.68, width: 27, wave: 0.075, tilt: 0.05, speed: -0.00026, phase: 1.0, frontStart: 0.12, frontEnd: 0.90 },
    { offset: -0.43, width: 25, wave: 0.095, tilt: -0.04, speed: 0.00024, phase: 2.0, frontStart: 0.20, frontEnd: 0.98 },
    { offset: -0.17, width: 16, wave: 0.060, tilt: 0.07, speed: -0.00028, phase: 2.9, frontStart: 0.02, frontEnd: 0.72 },
    { offset: 0.10, width: 22, wave: 0.085, tilt: -0.06, speed: 0.00025, phase: 3.8, frontStart: 0.15, frontEnd: 0.93 },
    { offset: 0.36, width: 29, wave: 0.070, tilt: 0.05, speed: -0.00022, phase: 4.7, frontStart: 0.03, frontEnd: 0.79 },
    { offset: 0.63, width: 32, wave: 0.090, tilt: -0.04, speed: 0.00027, phase: 5.4, frontStart: 0.12, frontEnd: 0.95 },
    { offset: 0.86, width: 25, wave: 0.055, tilt: 0.04, speed: -0.00025, phase: 6.2, frontStart: 0.22, frontEnd: 0.84 }
  ];

  function traceBand(band, centerX, centerY, radius, time, start, end) {
    const steps = 54;
    const drift = Math.sin(time * band.speed * 0.72 + band.phase) * radius * 0.035;
    ctx.beginPath();
    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const t = start + (end - start) * progress;
      const x = centerX + (t * 2.72 - 1.36) * radius + drift;
      const envelope = 0.35 + Math.sin(Math.PI * t) * 0.65;
      const wave = Math.sin(t * TAU * 1.08 + band.phase + time * band.speed) * band.wave * radius * envelope;
      const roughness = Math.sin(t * 31 + band.phase * 4 + time * 0.00016) * radius * 0.007;
      const y = centerY + band.offset * radius + (x - centerX) * band.tilt + wave + roughness + pointer.y * radius * 0.025;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  function drawBand(band, centerX, centerY, radius, time, front) {
    const start = front ? band.frontStart : 0;
    const end = front ? band.frontEnd : 1;
    const gradient = ctx.createLinearGradient(centerX - radius * 1.35, centerY, centerX + radius * 1.35, centerY);
    const upper = band.offset < -0.1;
    gradient.addColorStop(0, upper ? '#3f6399' : '#28538d');
    gradient.addColorStop(0.48, upper ? '#81739b' : '#42669b');
    gradient.addColorStop(1, upper ? '#efb4c8' : '#8e82aa');

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = upper ? 'rgba(231, 166, 194, .20)' : 'rgba(45, 91, 157, .24)';
    ctx.shadowBlur = front ? 7 : 3;
    traceBand(band, centerX, centerY, radius, time, start, end);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = front ? 0.96 : 0.42;
    ctx.lineWidth = band.width * Math.max(0.72, radius / 285);
    ctx.stroke();

    traceBand(band, centerX, centerY, radius, time, start, end);
    ctx.globalAlpha = front ? 0.13 : 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, band.width * 0.075);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawGrid(centerX, centerY, radius, rotation) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, TAU);
    ctx.clip();
    ctx.strokeStyle = 'rgba(65, 204, 190, .10)';
    ctx.lineWidth = 0.8;

    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let drawing = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const point = project(lat, lon, rotation, centerX, centerY, radius);
        if (point.depth > 0) {
          if (!drawing) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          drawing = true;
        } else drawing = false;
      }
      ctx.stroke();
    }

    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath();
      let drawing = false;
      for (let lat = -86; lat <= 86; lat += 3) {
        const point = project(lat, lon, rotation, centerX, centerY, radius);
        if (point.depth > 0) {
          if (!drawing) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          drawing = true;
        } else drawing = false;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGlobe(centerX, centerY, radius, rotation, time) {
    ctx.save();
    ctx.shadowColor = 'rgba(72, 94, 225, .42)';
    ctx.shadowBlur = radius * 0.22;
    const globe = ctx.createRadialGradient(
      centerX - radius * 0.34,
      centerY - radius * 0.3,
      radius * 0.08,
      centerX,
      centerY,
      radius * 1.05
    );
    globe.addColorStop(0, '#123b42');
    globe.addColorStop(0.42, '#08242d');
    globe.addColorStop(0.76, '#071421');
    globe.addColorStop(1, '#02050c');
    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    drawGrid(centerX, centerY, radius, rotation);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 1, 0, TAU);
    ctx.clip();
    lights.forEach((light, index) => {
      const point = project(light.lat, light.lon, rotation, centerX, centerY, radius);
      if (point.depth <= 0) return;

      ctx.globalAlpha = 0.06 + point.depth * 0.12;
      ctx.fillStyle = '#0b6d66';
      ctx.beginPath();
      ctx.arc(point.x, point.y, light.size * 2.3, 0, TAU);
      ctx.fill();

      if ((index + Math.floor(time * 0.001)) % 3 === 0) return;
      const twinkle = 0.68 + Math.sin(time * 0.002 + light.phase) * 0.32;
      ctx.globalAlpha = light.alpha * twinkle * Math.pow(point.depth, 0.42);
      ctx.fillStyle = light.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, light.size * (0.65 + point.depth * 0.5), 0, TAU);
      ctx.fill();
    });

    const shade = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    shade.addColorStop(0, 'rgba(0, 0, 0, .58)');
    shade.addColorStop(0.48, 'rgba(0, 0, 0, 0)');
    shade.addColorStop(1, 'rgba(3, 5, 14, .52)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = shade;
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.strokeStyle = 'rgba(139, 123, 255, .30)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, TAU);
    ctx.stroke();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const background = ctx.createRadialGradient(width * 0.5, height * 0.48, 20, width * 0.5, height * 0.48, Math.max(width, height) * 0.72);
    background.addColorStop(0, '#0c1230');
    background.addColorStop(0.48, '#070b1d');
    background.addColorStop(1, '#03050d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    drawStars(time);

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    const radius = Math.min(width * 0.42, height * 0.39);
    const centerX = width * 0.5 + pointer.x * radius * 0.045;
    const centerY = height * 0.53 + pointer.y * radius * 0.035;
    const rotation = -0.32 + time * 0.000065 + pointer.x * 0.14;

    bands.forEach((band) => drawBand(band, centerX, centerY, radius, time, false));
    drawGlobe(centerX, centerY, radius, rotation, time);
    bands.forEach((band) => drawBand(band, centerX, centerY, radius, time, true));
  }

  function animate(timestamp) {
    if (!visible) return;
    if (!lastFrame) lastFrame = timestamp;
    const delta = Math.min(40, timestamp - lastFrame);
    if (timestamp - lastFrame >= 1000 / 30) {
      elapsed += delta;
      lastFrame = timestamp;
      draw(elapsed);
    }
    frame = window.requestAnimationFrame(animate);
  }

  function start() {
    if (reducedMotion.matches || frame) {
      draw(elapsed);
      return;
    }
    lastFrame = 0;
    frame = window.requestAnimationFrame(animate);
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  }

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  stage.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }, { rootMargin: '180px' })
    : null;
  observer?.observe(stage);

  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(stage);
  if (!resizeObserver) window.addEventListener('resize', resize, { passive: true });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) stop();
    else if (visible) start();
    draw(elapsed);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (visible) start();
  });

  resize();
  if (!observer) start();

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
})();
