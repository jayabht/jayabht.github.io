/* ============================================================================
   Jaya Bhattacharya — interactions
   No dependencies. Nothing here is required to read the page.
   ========================================================================== */

document.documentElement.classList.add('js');

/* Safety net: whatever happens below, nothing stays hidden. */
function showAll() {
  document.body.classList.add('go');
  document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
}
setTimeout(showAll, 2500);

(function () {
  'use strict';
  try {

  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lerp = function (a, b, n) { return a + (b - a) * n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  document.getElementById('yr').textContent = new Date().getFullYear();

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('go'); });
  });

  /* ---------------------------------------------------------- reveals -- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });

    els.forEach(function (el) {
      // Siblings in a row cascade rather than arriving together.
      var sibs = el.parentNode.children;
      var i = Array.prototype.indexOf.call(sibs, el);
      if (sibs.length > 1 && i > 0 && i < 6) el.style.transitionDelay = (i * 70) + 'ms';
      io.observe(el);
    });
  })();

  /* ------------------------------------------------- hero rotator ------- */
  (function () {
    var items = document.querySelectorAll('.rot__i');
    if (items.length < 2 || REDUCED) return;
    var at = 0, timer = null;

    function step() {
      var cur = items[at];
      at = (at + 1) % items.length;
      var nxt = items[at];
      cur.classList.remove('is-on');
      cur.classList.add('is-out');
      nxt.classList.remove('is-out');
      nxt.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 600);
    }
    function play() { timer = setInterval(step, 2600); }
    function stop() { clearInterval(timer); timer = null; }

    play();
    // Don't animate to an empty room.
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : (timer || play());
    });
  })();

  /* ------------------------------------------------- count-ups ---------- */
  (function () {
    var figs = document.querySelectorAll('[data-count]');
    if (!figs.length || REDUCED || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = el.dataset.count;
      var nums = target.match(/\d+(?:\.\d+)?/g);
      if (!nums) return;
      var parts = target.split(/\d+(?:\.\d+)?/);
      var goals = nums.map(Number);
      var dec = nums.map(function (n) { return (n.split('.')[1] || '').length; });
      var t0 = null, DUR = 1200;

      function frame(t) {
        if (t0 === null) t0 = t;
        var p = clamp((t - t0) / DUR, 0, 1);
        var e = 1 - Math.pow(1 - p, 4);
        var out = '';
        for (var i = 0; i < parts.length; i++) {
          out += parts[i];
          if (i < goals.length) out += (goals[i] * e).toFixed(dec[i]);
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target); io.unobserve(e.target);
      });
    }, { threshold: 0.55 });
    figs.forEach(function (f) { io.observe(f); });
  })();

  /* ------------------------------------------------- nav ---------------- */
  (function () {
    var nav = document.querySelector('.bar');
    var links = document.querySelectorAll('.bar__nav a');
    var secs = Array.prototype.map.call(links, function (a) {
      return document.querySelector(a.getAttribute('href'));
    });
    var last = scrollY, tick = false;

    function upd() {
      var y = scrollY;
      if (nav && !REDUCED) {
        if (y > 500 && y > last) nav.classList.add('tuck');
        else nav.classList.remove('tuck');
      }
      last = y;
      // Mark the section currently occupying the upper third of the viewport.
      var cut = y + innerHeight * 0.35, on = -1;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= cut) on = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === on); });
      tick = false;
    }
    addEventListener('scroll', function () {
      if (tick) return; tick = true; requestAnimationFrame(upd);
    }, { passive: true });
    upd();
  })();

  /* ------------------------------------------------- mobile menu -------- */
  (function () {
    var btn = document.querySelector('.bar__btn');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;
    var t = btn.querySelector('.bar__btn-t');

    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      t.textContent = open ? t.dataset.close : t.dataset.open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add('in'); });
      } else {
        menu.classList.remove('in');
        setTimeout(function () { menu.hidden = true; }, REDUCED ? 0 : 400);
      }
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') set(false);
    });
  })();

  /* ------------------------------------------------- ticker ------------- */
  (function () {
    var t = document.querySelector('.tick__t');
    if (!t || REDUCED) return;
    var half = 0, x = 0, base = 0.35, kick = 0, ly = scrollY, live = true;

    function measure() { half = t.scrollWidth / 2; }
    measure();
    addEventListener('resize', measure);
    addEventListener('scroll', function () { kick += (scrollY - ly) * 0.28; ly = scrollY; }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { live = e[0].isIntersecting; }).observe(t.parentNode);
    }
    (function loop() {
      if (live && half) {
        kick = lerp(kick, 0, 0.07);
        x -= base + kick;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        t.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ------------------------------------------------- drag rows ---------- */
  document.querySelectorAll('[data-drag]').forEach(function (row) {
    var down = false, sx = 0, sl = 0, moved = 0;
    row.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;      // native touch scroll is better
      down = true; moved = 0; sx = e.clientX; sl = row.scrollLeft;
      row.classList.add('grabbing');
    });
    addEventListener('pointerup', function () {
      down = false; row.classList.remove('grabbing');
    });
    row.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = e.clientX - sx;
      moved += Math.abs(d);
      row.scrollLeft = sl - d;
      if (moved > 6) e.preventDefault();
    });
    // A drag shouldn't also open the lightbox.
    row.addEventListener('click', function (e) {
      if (moved > 8) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  /* ------------------------------------------------- custom cursor ------ */
  (function () {
    var cur = document.querySelector('.cursor');
    if (!cur || !FINE || REDUCED) return;
    var ring = cur.querySelector('.cursor__ring');
    var dot = cur.querySelector('.cursor__dot');
    var label = cur.querySelector('.cursor__label');
    var tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty;

    document.body.classList.add('has-cursor');
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; cur.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cur.classList.add('is-hidden'); });

    (function tick() {
      rx = lerp(rx, tx, 0.19); ry = lerp(ry, ty, 0.19);
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
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest(SEL) && !(e.relatedTarget && e.relatedTarget.closest(SEL))) {
        cur.classList.remove('is-active');
      }
    });
  })();

  /* ------------------------------------------------- index peek --------- */
  (function () {
    var peek = document.querySelector('.peek');
    if (!peek || !FINE || REDUCED) return;
    var img = peek.querySelector('img');
    var tx = 0, ty = 0, rx = 0, ry = 0, on = false;

    document.querySelectorAll('.idx[data-thumb]').forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        img.src = row.dataset.thumb;
        peek.classList.add('on'); on = true;
      });
      row.addEventListener('pointerleave', function () { peek.classList.remove('on'); on = false; });
      row.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; });
    });

    (function loop() {
      if (on) {
        rx = lerp(rx || tx, tx, 0.14); ry = lerp(ry || ty, ty, 0.14);
        peek.style.left = rx + 'px'; peek.style.top = ry + 'px';
      } else { rx = tx; ry = ty; }
      requestAnimationFrame(loop);
    })();
  })();

  document.addEventListener('play', function (e) {
    if (e.target.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(function (v) { if (v !== e.target) v.pause(); });
  }, true);

  /* ------------------------------------------------- lightbox ----------- */
  (function () {
    var box = document.getElementById('lb');
    if (!box) return;
    var img = document.getElementById('lbImg');
    var x = box.querySelector('.lb__x'), p = box.querySelector('.lb__p'), n = box.querySelector('.lb__n');
    var cEl = box.querySelector('.lb__c'), tEl = box.querySelector('.lb__t');
    var set = [], at = 0, back = null;

    function paint() {
      var b = set[at];
      img.src = b.dataset.full;
      img.alt = b.querySelector('img').alt || '';
      cEl.textContent = (at + 1) + ' / ' + set.length;
      var cap = b.closest('.tile').querySelector('figcaption');
      tEl.textContent = cap ? cap.textContent.trim() : img.alt;
      p.disabled = at === 0; n.disabled = at === set.length - 1;
      if (set[at + 1]) new Image().src = set[at + 1].dataset.full;
    }
    function open(b) {
      var scope = b.closest('.grid') || document;
      set = Array.prototype.slice.call(scope.querySelectorAll('.tile__btn'));
      at = Math.max(0, set.indexOf(b));
      back = document.activeElement;
      box.hidden = false; document.body.style.overflow = 'hidden';
      paint(); x.focus();
    }
    function close() {
      box.hidden = true; img.src = ''; document.body.style.overflow = '';
      if (back) back.focus();
    }
    function step(d) {
      var i = at + d;
      if (i < 0 || i >= set.length) return;
      at = i; paint();
    }

    document.addEventListener('click', function (e) {
      var b = e.target.closest('.tile__btn');
      if (b) { open(b); return; }
      if (box.hidden) return;
      if (e.target.closest('.lb__p')) return step(-1);
      if (e.target.closest('.lb__n')) return step(1);
      if (e.target.closest('.lb__x') || !e.target.closest('.lb__st')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { e.preventDefault(); x.focus(); }
    });
  })();

  } catch (err) {
    console.error('[portfolio]', err);
    showAll();
  }
})();
