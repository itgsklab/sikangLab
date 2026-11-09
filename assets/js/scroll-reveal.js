(() => {
  const root = document.documentElement;
  const items = [...document.querySelectorAll('[data-reveal]')];

  if (!items.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const showImmediately = () => {
    items.forEach((item) => {
      item.removeAttribute('data-reveal');
      item.style.removeProperty('--ls-reveal-delay');
    });
    root.classList.remove('has-scroll-reveal');
  };

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    showImmediately();
    return;
  }

  root.classList.add('has-scroll-reveal');

  document.querySelectorAll('.ls-section').forEach((section) => {
    let itemIndex = 0;
    section.querySelectorAll('[data-reveal]').forEach((item) => {
      const type = item.dataset.reveal;
      const delay = type === 'heading' ? 0 : type === 'content' ? 80 : itemIndex++ * 100;
      item.style.setProperty('--ls-reveal-delay', `${Math.min(delay, 400)}ms`);
    });
  });

  const complete = (item) => {
    if (!item.hasAttribute('data-reveal')) return;
    item.removeAttribute('data-reveal');
    item.classList.remove('is-revealed');
    item.style.removeProperty('--ls-reveal-delay');
  };

  const reveal = (item) => {
    item.classList.add('is-revealed');
    const onTransitionEnd = (event) => {
      if (event.propertyName !== 'transform') return;
      item.removeEventListener('transitionend', onTransitionEnd);
      complete(item);
    };
    item.addEventListener('transitionend', onTransitionEnd);
    window.setTimeout(() => complete(item), 1500);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px',
  });

  items.forEach((item) => observer.observe(item));
})();
