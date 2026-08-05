/* Portafolio Leslie Redlich — interacciones mínimas */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
    document.querySelectorAll('.pipe__step').forEach(function (el) {
      el.classList.add('is-live');
    });
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

  /* El pipeline se enciende estado por estado, como una orden que avanza */
  var pipe = document.getElementById('pipe');
  if (pipe) {
    var steps = Array.prototype.slice.call(pipe.querySelectorAll('.pipe__step'));
    var pipeWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        steps.forEach(function (step, i) {
          setTimeout(function () {
            step.classList.add('is-live');
          }, i * 320);
        });
        pipeWatcher.disconnect();
      });
    }, { threshold: 0.3 });
    pipeWatcher.observe(pipe);
  }
})();
