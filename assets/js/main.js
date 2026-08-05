/* Portafolio Leslie Redlich — interacciones mínimas */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Muestra todo de una vez. Es el estado final y también la red de seguridad:
     si el observador nunca dispara, el contenido igual queda visible. */
  function showEverything() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
    var block = document.getElementById('txblock');
    if (!block) return;
    block.classList.add('is-open');
    block.querySelectorAll('.tx__step').forEach(function (el) {
      el.classList.add('is-done');
    });
  }

  /* Ningún visitante debería quedarse mirando una página en blanco porque
     IntersectionObserver no se activó. A los 4 segundos, se muestra todo. */
  setTimeout(showEverything, 4000);

  /* Año actual en el footer */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Hairline en la nav al hacer scroll */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showEverything();
    return;
  }

  /* Aparición al entrar en pantalla */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealer.observe(el);
  });

  /* La transacción se ejecuta: baja el rail y cada paso se confirma en orden */
  var txblock = document.getElementById('txblock');
  if (txblock) {
    var steps = Array.prototype.slice.call(txblock.querySelectorAll('.tx__step'));
    var txWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        txblock.classList.add('is-open');
        steps.forEach(function (step, i) {
          setTimeout(function () {
            step.classList.add('is-done');
          }, 260 + i * 300);
        });
        txWatcher.disconnect();
      });
    }, { threshold: 0.22 });
    txWatcher.observe(txblock);
  }
})();
