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
