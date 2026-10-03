(() => {
  const panel = document.querySelector('.terminal');
  const handle = panel?.querySelector('.terminal-bar');
  const area = panel?.closest('.hero-inner');
  if (!panel || !handle || !area) return;
  let x = 0, y = 0, drag = null;
  function move(nextX, nextY) {
    const bounds = area.getBoundingClientRect();
    const rect = panel.getBoundingClientRect();
    const originX = rect.left - x;
    const originY = rect.top - y;
    x = Math.max(bounds.left - originX, Math.min(nextX, bounds.right - originX - rect.width));
    y = Math.max(bounds.top - originY, Math.min(nextY, bounds.bottom - originY - rect.height));
    panel.style.transform = `translate(${x}px, ${y}px)`;
  }
  handle.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    handle.setPointerCapture(event.pointerId);
    handle.classList.add('is-dragging');
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    move(drag.x + event.clientX - drag.startX, drag.y + event.clientY - drag.startY);
  });
  function stop() { drag = null; handle.classList.remove('is-dragging'); }
  handle.addEventListener('pointerup', stop);
  handle.addEventListener('pointercancel', stop);
  handle.addEventListener('lostpointercapture', stop);
  handle.addEventListener('keydown', event => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault(); x = 0; y = 0; panel.style.transform = ''; return;
    }
    if (!directions[event.key]) return;
    event.preventDefault();
    const [dx, dy] = directions[event.key];
    const step = event.shiftKey ? 30 : 10;
    move(x + dx * step, y + dy * step);
  });
  new ResizeObserver(() => { x = 0; y = 0; panel.style.transform = ''; }).observe(area);
})();
