(() => {
  const root = document.documentElement;
  const items = [...document.querySelectorAll('[data-reveal]')];

  if (!items.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const showImmediately = () => {
    items.forEach((item) => {
      item.classList.add('is-revealed', 'is-reveal-complete');
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
      const delay = type === 'heading'
        ? 0
        : type === 'content'
          ? 110
          : 150 + itemIndex++ * 135;
      item.style.setProperty('--ls-reveal-delay', `${Math.min(delay, 555)}ms`);
    });
  });

  const complete = (item) => {
    if (!item.classList.contains('is-revealed')) return;
    item.classList.add('is-reveal-complete');
  };

  const reveal = (item) => {
    if (item.classList.contains('is-revealed')) return;
    item.classList.add('is-revealed');
    const onAnimationEnd = (event) => {
      if (event.target !== item) return;
      item.removeEventListener('animationend', onAnimationEnd);
      complete(item);
    };
    item.addEventListener('animationend', onAnimationEnd);
    window.setTimeout(() => complete(item), 2100);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px',
  });

  items.forEach((item) => observer.observe(item));
})();
