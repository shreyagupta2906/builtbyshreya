(() => {
  const card = document.querySelector('.memory-card');
  if (!card) return;
  const slides = [...card.querySelectorAll('.memory-slide')];
  const dots = [...card.querySelectorAll('[data-slide]')];
  const play = card.querySelector('.memory-play');
  const container = card.querySelector('.memory-slides');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = reducedMotion.matches, timer;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  }
  function sync() {
    clearInterval(timer);
    play.textContent = paused ? 'Play' : 'Pause';
    play.setAttribute('aria-label', paused ? 'Play photo slideshow' : 'Pause photo slideshow');
    container.setAttribute('aria-live', paused ? 'polite' : 'off');
    if (!paused && !document.hidden && !card.contains(document.activeElement)) timer = setInterval(() => show(current + 1), 6000);
  }
  dots.forEach(dot => dot.addEventListener('click', () => { paused = true; show(Number(dot.dataset.slide)); sync(); }));
  play.addEventListener('click', () => { paused = !paused; sync(); });
  card.addEventListener('focusin', () => clearInterval(timer));
  card.addEventListener('focusout', () => setTimeout(sync, 0));
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) paused = true; sync(); });
  show(0); sync();
})();
