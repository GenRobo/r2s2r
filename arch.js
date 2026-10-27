// Play the architecture figure's inset clips only while the figure is on screen,
// and not at all when the visitor prefers reduced motion.
(() => {
  const clips = [...document.querySelectorAll('.arch-clip')];
  if (!clips.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const figure = document.querySelector('.arch-figure');
  new IntersectionObserver(([entry]) => {
    clips.forEach(v => entry.isIntersecting ? v.play().catch(() => {}) : v.pause());
  }, { threshold: 0.25 }).observe(figure);
})();

// Enlarge figure media in a dialog; videos open the full source clip with controls.
(() => {
  const dialog = document.querySelector('.arch-lightbox');
  if (!dialog) return;
  const media = dialog.querySelector('.arch-lightbox-media');
  const label = dialog.querySelector('.media-label');
  document.querySelectorAll('.arch-zoom').forEach(btn => btn.addEventListener('click', () => {
    const el = document.createElement(btn.dataset.kind === 'video' ? 'video' : 'img');
    el.src = btn.dataset.src;
    if (el.tagName === 'VIDEO') Object.assign(el, { controls: true, autoplay: true, muted: true, loop: true, playsInline: true });
    else el.alt = btn.dataset.label;
    media.replaceChildren(el);
    label.textContent = btn.dataset.label;
    dialog.showModal();
  }));
  const close = () => dialog.close();
  dialog.querySelector('[data-close]').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => media.replaceChildren());
})();
