/* Intro loader: shown once per visit (sessionStorage), skipped for reduced motion */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('loading')) return;

  function done() {
    root.classList.remove('loading', 'loader-active');
    try { sessionStorage.setItem('crool-intro', '1'); } catch (e) {}
    window.dispatchEvent(new Event('crool:loaded'));
  }

  function start() {
    var ov = document.createElement('div');
    ov.id = 'crool-loader';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="ld-stage"><div class="ld-glow"></div><div class="ld-ring"></div>' +
      '<div class="ld-coin"><img src="assets/favicon-512.png" alt=""></div></div>';
    document.body.appendChild(ov);
    root.classList.add('loader-active');
    root.classList.remove('loading');

    var t0 = performance.now(), MIN = 1500, MAX = 3200, fired = false;
    function go() {
      if (fired) return; fired = true;
      var wait = Math.max(0, MIN - (performance.now() - t0));
      setTimeout(fly, wait);
    }
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(go, MAX);

    function fly() {
      var coin = ov.querySelector('.ld-coin');
      var logo = document.querySelector('.site-logo');
      var from = coin.getBoundingClientRect();
      if (!logo) { ov.classList.add('fade'); setTimeout(function () { ov.remove(); done(); }, 600); return; }
      window.scrollTo(0, 0);
      var to = logo.getBoundingClientRect();

      /* Freeze the coin where it is, then move a copy onto Riku's head in the header logo */
      var f = document.createElement('img');
      f.src = 'assets/favicon-512.png'; f.alt = ''; f.className = 'ld-fly';
      f.style.width = from.width + 'px'; f.style.height = from.height + 'px';
      f.style.borderRadius = '50%'; f.style.boxShadow = '0 0 30px rgba(0,229,255,.5)';
      f.style.transform = 'translate(' + from.left + 'px,' + from.top + 'px)';
      ov.appendChild(f);
      coin.style.visibility = 'hidden';
      ov.classList.add('flying');

      var size = to.height * 0.62;                 /* Riku's head height inside the logo */
      var tx = to.left + to.height * 0.12, ty = to.top + to.height * 0.02;
      var s = size / from.width;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          f.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
          f.style.opacity = '0';
          ov.classList.add('fade');
          setTimeout(function () { root.classList.remove('loader-active'); }, 450);
          setTimeout(function () { ov.remove(); done(); }, 800);
        });
      });
    }
  }

  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
