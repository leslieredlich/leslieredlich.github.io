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

  /* Carrusel de capturas. Un slider con una sola imagen se deja tal cual:
     los controles solo se activan cuando de verdad hay algo que recorrer. */
  document.querySelectorAll('.slider').forEach(function (slider) {
    var track = slider.querySelector('.slider__track');
    var slides = track ? track.querySelectorAll('.slider__slide') : [];
    if (!track || slides.length < 2) return;

    slider.classList.add('is-multi');

    var prev = slider.querySelector('.slider__btn--prev');
    var next = slider.querySelector('.slider__btn--next');
    var dotsBox = slider.querySelector('.slider__dots');
    var count = slider.querySelector('.slider__count');
    var dots = [];

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', 'Ver captura ' + (i + 1) + ' de ' + slides.length);
      dot.addEventListener('click', function () { goTo(i); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });

    /* El índice se guarda aparte y no se deriva del scroll en cada clic:
       durante el desplazamiento suave scrollLeft va retrasado, y pulsar la
       flecha varias veces seguidas avanzaría una sola posición. */
    var index = 0;

    function paint(i) {
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === i ? 'true' : 'false'); });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: index * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
      paint(index);
    }

    /* Para gestos de deslizamiento, donde la posición la decide el usuario.
       Si la pista aún no tiene ancho (la tarjeta no se ha maquetado todavía),
       dividir daría NaN: en ese caso se conserva el índice que ya teníamos. */
    function sync() {
      var w = track.clientWidth;
      if (w) index = Math.round(track.scrollLeft / w);
      paint(index);
    }

    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); });

    /* Flechas del teclado cuando el carrusel tiene el foco */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    });

    var ticking;
    track.addEventListener('scroll', function () {
      clearTimeout(ticking);
      ticking = setTimeout(sync, 80);
    }, { passive: true });

    window.addEventListener('resize', sync);
    sync();
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
