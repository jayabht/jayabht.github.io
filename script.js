document.getElementById('year').textContent = new Date().getFullYear();

/* ------------------------------------------------------------ scroll reveal */
(function () {
  var els = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  els.forEach(function (el, i) {
    // Stagger tiles within a row so grids cascade rather than pop at once.
    if (el.classList.contains('tile')) el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });
})();

/* ---------------------------------------------------------------- lightbox */
(function () {
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightboxImg');
  var closeBtn = box.querySelector('.lb__x');
  var lastFocus = null;

  function open(src, alt) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tile__btn');
    if (btn) {
      open(btn.dataset.full, btn.querySelector('img').alt);
      return;
    }
    if (!box.hidden && e.target.closest('#lightbox')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) close();
  });
})();

/* ------------------------------------------- only one video plays at a time */
document.addEventListener('play', function (e) {
  if (e.target.tagName !== 'VIDEO') return;
  document.querySelectorAll('video').forEach(function (v) {
    if (v !== e.target) v.pause();
  });
}, true);

/* --------------------------------- pause the marquee while it's off-screen */
(function () {
  var track = document.querySelector('.marquee__track');
  if (!track || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
  }).observe(track);
})();
