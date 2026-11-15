/* Crool animations: scroll reveal, typing headline, parallax depth */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { document.documentElement.classList.remove('js-anim'); return; }

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    /* ---------- 1. Scroll reveal ---------- */
    var groups = [
      ['.hero > div:first-child > *:not(h1)', ''],
      ['.hero-text > *:not(h1)', ''],
      ['.hero-media, .hero-img', 'zoom'],
      ['main section > p, main section > h2, section[id] > p, section[id] > h2', ''],
      ['.svc-card', ''], ['.work-card', ''],
      ['.flow-step, .flow-arrow', ''],
      ['.personality > *:not(ul)', ''], ['.hobbies-strip .pillar', ''],
      ['.journey-img', 'left'], ['.journey-text > *', 'right'],
      ['.why-visual', 'zoom'], ['.why-text > *', ''],
      ['.believe > *:not(.believe-cols)', ''], ['.believe-cols > p', ''],
      ['#contact > *, .cta > *', ''], ['footer', '']
    ];
    var seen = new Set();
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el) {
        if (seen.has(el) || el.closest('dialog')) return;
        seen.add(el);
        el.setAttribute('data-reveal', g[1]);
        var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return seen.has(c); });
        el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 90 + 'ms');
      });
    });

    /* Headline word-by-word */
    document.querySelectorAll('h1').forEach(function (h) {
      var i = 0;
      Array.prototype.slice.call(h.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span'); s.className = 'rw'; s.textContent = w;
            s.style.setProperty('--d', (i++ * 70) + 'ms'); frag.appendChild(s);
          });
          h.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          n.classList.add('rw'); n.style.setProperty('--d', (i++ * 70) + 'ms');
        }
      });
      requestAnimationFrame(function () { setTimeout(function () { h.classList.add('words-in'); }, 120); });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

    /* ---------- 4. Typing headline ---------- */
    var t = document.querySelector('.type-text');
    if (t) {
      var words = (t.getAttribute('data-words') || '').split('|').filter(Boolean);
      var wi = 0, ci = words[0].length, deleting = true;
      setTimeout(function tick() {
        var w = words[wi];
        if (deleting) {
          ci--; t.textContent = w.slice(0, ci);
          if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 300); }
          return setTimeout(tick, 35);
        }
        w = words[wi]; ci++; t.textContent = w.slice(0, ci);
        if (ci === w.length) { deleting = true; return setTimeout(tick, 1900); }
        setTimeout(tick, 75);
      }, 2600);
    }

    /* ---------- 5. Parallax depth ---------- */
    var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (px.length) {
      var ticking = false;
      function update() {
        var vh = window.innerHeight, k = window.innerWidth < 768 ? 0.5 : 1;
        px.forEach(function (el) {
          var r = el.parentNode.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute('data-parallax')) * k;
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        });
        ticking = false;
      }
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  });
})();
