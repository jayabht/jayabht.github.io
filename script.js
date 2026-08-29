// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------------------- lightbox
(function () {
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightboxImg');
  var closeBtn = box.querySelector('.lightbox__close');
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

// ------------------------------------------------- pause other videos on play
document.addEventListener('play', function (e) {
  if (e.target.tagName !== 'VIDEO') return;
  document.querySelectorAll('video').forEach(function (v) {
    if (v !== e.target) v.pause();
  });
}, true);
