(() => {
  const links = [...document.querySelectorAll('[data-home-section]')];
  if (!links.length) return;

  const homeUrl = new URL(links[0].href, window.location.href);
  const normalizePath = path => path.replace(/\/+$/, '') || '/';
  const isHome = normalizePath(window.location.pathname) === normalizePath(homeUrl.pathname);

  const setActive = id => {
    links.forEach(link => {
      const active = link.dataset.homeSection === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  links.forEach(link => {
    link.addEventListener('click', () => {
      setActive(link.dataset.homeSection);
      document.body.classList.remove('menu-open');
      document.querySelector('.menu-button')?.setAttribute('aria-expanded', 'false');
    });
  });

  if (!isHome) return;

  const sections = links
    .map(link => document.getElementById(link.dataset.homeSection))
    .filter(Boolean);
  if (!sections.length) return;

  let scheduled = false;
  const updateActiveSection = () => {
    scheduled = false;
    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 290);
    let current = sections[0].id;
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });
    setActive(current);
  };

  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  updateActiveSection();
})();
