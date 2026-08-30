/* =============================================================================
   Jaya Bhattacharya — portfolio interactions
   Vanilla JS, no dependencies. Everything degrades if JS or motion is off.
   ========================================================================== */

/* Animations that start from a hidden state are gated behind html.js, so the
   page stays fully readable if this file fails to load or parse. */
document.documentElement.classList.add('js');

/* Failsafe: whatever happens below, nothing stays invisible. */
function jbShowAll() {
  document.body.classList.add('is-ready');
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
}
setTimeout(jbShowAll, 2500);

(function () {
  'use strict';
  try {

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lerp = function (a, b, n) { return a + (b - a) * n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* -------------------------------------------------- hero entrance ----- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
  });

  /* -------------------------------------------------- scroll reveals ---- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    els.forEach(function (el) {
      // Tiles in the same row cascade rather than snapping in together.
      if (el.classList.contains('tile')) {
        var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
        var d = (sibs % 4) * 80;
        el.querySelectorAll('.tile__btn, video, figcaption').forEach(function (n) {
          n.style.transitionDelay = d + 'ms';
        });
      }
      io.observe(el);
    });
  })();

  /* -------------------------------------------------- stat count-up ----- */
  (function () {
    var figs = document.querySelectorAll('[data-count]');
    if (!figs.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = el.dataset.count;
      var nums = target.match(/\d+/g);
      if (!nums) return;
      var parts = target.split(/\d+/);
      var goals = nums.map(Number);
      var t0 = null;
      var DUR = 1300;

      function frame(t) {
        if (t0 === null) t0 = t;
        var p = clamp((t - t0) / DUR, 0, 1);
        var e = 1 - Math.pow(1 - p, 4);            // easeOutQuart
        var out = '';
        for (var i = 0; i < parts.length; i++) {
          out += parts[i];
          if (i < goals.length) out += Math.round(goals[i] * e);
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    figs.forEach(function (f) { io.observe(f); });
  })();

  /* -------------------------------------------------- scroll progress --- */
  (function () {
    var bar = document.querySelector('.progress span');
    var topbar = document.querySelector('.bar');
    if (!bar) return;
    var last = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0) + ')';

      if (topbar && !REDUCED) {
        // Tuck the bar away when scrolling down past the hero, bring it back on the way up.
        if (y > 420 && y > last) topbar.classList.add('is-tucked');
        else topbar.classList.remove('is-tucked');
      }
      last = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  })();

  /* -------------------------------------------------- marquee ----------- */
  (function () {
    var track = document.querySelector('.marquee__track');
    if (!track || REDUCED) return;

    track.style.animation = 'none';           // hand control to JS
    var half = 0, x = 0, base = 0.45, boost = 0, lastY = window.scrollY, running = true;

    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      boost += (y - lastY) * 0.35;            // scrolling flings the marquee along
      lastY = y;
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { running = e[0].isIntersecting; })
        .observe(track.parentNode);
    }

    (function tick() {
      if (running && half) {
        boost = lerp(boost, 0, 0.06);
        x -= base + boost;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        track.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
      requestAnimationFrame(tick);
    })();
  })();

  /* -------------------------------------------------- hero spotlight ---- */
  (function () {
    var hero = document.getElementById('hero');
    if (!hero || !FINE || REDUCED) return;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  })();

  /* -------------------------------------------------- custom cursor ----- */
  (function () {
    var cur = document.querySelector('.cursor');
    if (!cur || !FINE || REDUCED) return;

    var ring = cur.querySelector('.cursor__ring');
    var dot = cur.querySelector('.cursor__dot');
    var label = cur.querySelector('.cursor__label');
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var rx = tx, ry = ty;

    document.body.classList.add('has-cursor');

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      cur.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cur.classList.add('is-hidden'); });

    (function tick() {
      rx = lerp(rx, tx, 0.19);
      ry = lerp(ry, ty, 0.19);
      dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(tick);
    })();

    var SEL = '[data-cursor], a, button, summary, video';
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest(SEL);
      if (!t) return;
      var txt = t.dataset.cursor || (t.tagName === 'VIDEO' ? 'Play' : '');
      label.textContent = txt;
      cur.classList.toggle('is-active', !!txt);
      if (!txt) ring.style.borderColor = 'rgba(242,237,228,.9)';
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest(SEL) && !(e.relatedTarget && e.relatedTarget.closest(SEL))) {
        cur.classList.remove('is-active');
        ring.style.borderColor = '';
      }
    });
  })();

  /* -------------------------------------------------- index hover peek -- */
  (function () {
    var peek = document.querySelector('.peek');
    var rows = document.querySelectorAll('.idx[data-thumb]');
    if (!peek || !rows.length || !FINE || REDUCED) return;

    var img = peek.querySelector('img');
    var tx = 0, ty = 0, rx = 0, ry = 0, on = false;

    rows.forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        img.src = row.dataset.thumb;
        peek.classList.add('is-on');
        on = true;
      });
      row.addEventListener('pointerleave', function () {
        peek.classList.remove('is-on');
        on = false;
      });
      row.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; });
    });

    (function tick() {
      if (on) {
        rx = lerp(rx || tx, tx, 0.13);
        ry = lerp(ry || ty, ty, 0.13);
        peek.style.left = rx + 'px';
        peek.style.top = ry + 'px';
      } else { rx = tx; ry = ty; }
      requestAnimationFrame(tick);
    })();
  })();

  /* -------------------------------------------------- magnetic links ---- */
  (function () {
    if (!FINE || REDUCED) return;
    document.querySelectorAll('.clink, .hero__cue, .about__li').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + dx * 12 + 'px,' + dy * 8 + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* -------------------------------------------------- lightbox gallery -- */
  (function () {
    var box = document.getElementById('lightbox');
    if (!box) return;
    var img = document.getElementById('lightboxImg');
    var closeBtn = box.querySelector('.lb__x');
    var prevBtn = box.querySelector('.lb__nav--prev');
    var nextBtn = box.querySelector('.lb__nav--next');
    var countEl = box.querySelector('.lb__count');
    var textEl = box.querySelector('.lb__text');
    var group = [], at = 0, lastFocus = null;

    function paint() {
      var btn = group[at];
      img.src = btn.dataset.full;
      img.alt = btn.querySelector('img').alt || '';
      countEl.textContent = (at + 1) + ' / ' + group.length;
      var cap = btn.closest('.tile').querySelector('figcaption');
      textEl.textContent = cap ? cap.textContent.trim() : img.alt;
      prevBtn.disabled = at === 0;
      nextBtn.disabled = at === group.length - 1;
      // Warm the neighbour so stepping through feels instant.
      if (group[at + 1]) new Image().src = group[at + 1].dataset.full;
    }

    function open(btn) {
      var grid = btn.closest('.grid');
      group = Array.prototype.slice.call(
        (grid || document).querySelectorAll('.tile__btn'));
      at = Math.max(0, group.indexOf(btn));
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      paint();
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    function step(d) {
      var n = at + d;
      if (n < 0 || n >= group.length) return;
      at = n;
      paint();
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.tile__btn');
      if (btn) { open(btn); return; }
      if (box.hidden) return;
      if (e.target.closest('.lb__nav--prev')) return step(-1);
      if (e.target.closest('.lb__nav--next')) return step(1);
      if (e.target.closest('.lb__x') || !e.target.closest('.lb__stage')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* -------------------------------------------- one video at a time ----- */
  document.addEventListener('play', function (e) {
    if (e.target.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(function (v) {
      if (v !== e.target) v.pause();
    });
  }, true);

  } catch (err) {
    console.error('[portfolio]', err);
    jbShowAll();
  }
})();
