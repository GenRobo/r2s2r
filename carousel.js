(() => {
  document.querySelectorAll('.asset-carousel').forEach(root => {
  const slides = [...root.querySelectorAll('.comparison-slide')];
  const selectors = [...root.querySelectorAll('[data-slide-to]')];
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      if (slide.hidden) slide.querySelectorAll('video').forEach(video => video.pause());
    });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    root.querySelector('.carousel-status').textContent = `${current + 1} / ${slides.length}`;
  }
  selectors.forEach((button, i) => button.addEventListener('click', () => show(i)));
  root.querySelector('.carousel-prev').addEventListener('click', () => show(current - 1));
  root.querySelector('.carousel-next').addEventListener('click', () => show(current + 1));
  root.querySelector('.carousel-toolbar').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    show(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    selectors[current].focus();
  });
  function fromHash() {
    const index = slides.findIndex(slide => '#' + slide.id === location.hash);
    if (index >= 0) show(index);
  }
  show(0);
  fromHash();
  window.addEventListener('hashchange', fromHash);
  });
})();
