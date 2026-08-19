// Cursor personalizado de escritorio (círculo con el logo "go" adentro),
// coherente con la marca Wigo. Reemplaza el cursor nativo del sistema SOLO en dispositivos con mouse
// real (hover:hover + pointer:fine); en touch/tablet/móvil este script no
// hace nada (los estilos de .custom-cursor también se ocultan por su cuenta
// en esos dispositivos, ver css/styles.css).
//
// Color según el fondo bajo el cursor: usa el atributo data-cursor-theme
// ("light" | "blue" | "yellow") en el HTML — ver index.html (#impacto,
// .nav__go, .nav__cta, .hero-v2__cta, .btn--ghost de descargas) y
// js/ferias.js (.feria-cta). Sin un ancestro con data-cursor-theme, el tema
// por defecto es "light" (fondo blanco/claro del resto del sitio).
//
// data-cursor-nobadge: quita el círculo de color de la insignia de hover
// (queda solo el logo "go" flotando, sin fondo propio) para elementos que
// ya son logos/íconos circulares (ver .impact-note__logo en index.html).
//
// Puramente decorativo: el elemento tiene pointer-events:none y
// aria-hidden="true" en el HTML, así que nunca intercepta clics ni afecta
// el foco de teclado, los inputs, ni la navegación por accesibilidad.
(function () {
  'use strict';

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;
  cursor.classList.add('on-light'); // estado inicial explícito (ver setTheme más abajo)

  // Elementos "interactivos" que hacen crecer el círculo al pasar por encima.
  // .province cubre las regiones clickeables del mapa de Ferias (son <path>
  // de SVG, no <a>/<button>, así que no los cubre el resto del selector).
  // [data-cursor-hover] queda como salida de escape para sumar algo más
  // adelante sin tocar este archivo de nuevo.
  var HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], .province, [data-cursor-hover]';

  var currentTheme = 'light';
  var isHovering = false;
  var hasMoved = false;
  var mouseX = 0;
  var mouseY = 0;
  var rafId = null;

  function applyPosition() {
    cursor.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0)';
    rafId = null;
  }

  function setTheme(theme) {
    theme = theme || 'light';
    if (theme === currentTheme) return;
    cursor.classList.remove('on-' + currentTheme);
    cursor.classList.add('on-' + theme);
    currentTheme = theme;
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!hasMoved) {
      hasMoved = true;
      cursor.style.opacity = '1';
    }
    // Posición: transform vía rAF, sin transition en CSS → sigue al mouse
    // sin lag ni "elástico".
    if (rafId === null) rafId = requestAnimationFrame(applyPosition);

    // e.target ya es el elemento real bajo el mouse en este punto (mismo
    // resultado que document.elementFromPoint aquí, sin pagar esa segunda
    // consulta): un único listener central resuelve hover + tema, sin
    // duplicar listeners por sección.
    var target = e.target;
    var hoveredEl = target && target.closest ? target.closest(HOVER_SELECTOR) : null;
    var nowHovering = !!hoveredEl;
    if (nowHovering !== isHovering) {
      isHovering = nowHovering;
      cursor.classList.toggle('is-hovering', isHovering);
    }

    var themedEl = target && target.closest ? target.closest('[data-cursor-theme]') : null;
    setTheme(themedEl ? themedEl.getAttribute('data-cursor-theme') : 'light');

    // [data-cursor-nobadge]: elementos que ya son logos/íconos circulares
    // propios (p.ej. los logos de fuente CAPECE/Gestión/INEI en #impacto),
    // donde el círculo de color de la insignia se ve como "otro círculo
    // encima". Ver ".custom-cursor.is-hovering.no-badge" en css/styles.css.
    var noBadgeEl = target && target.closest ? target.closest('[data-cursor-nobadge]') : null;
    cursor.classList.toggle('no-badge', !!noBadgeEl);
  }

  function onDown() {
    cursor.classList.add('is-clicking');
  }

  function onUp() {
    cursor.classList.remove('is-clicking');
  }

  function hide() {
    cursor.style.opacity = '0';
    cursor.classList.remove('is-clicking');
  }

  function show() {
    if (hasMoved) cursor.style.opacity = '1';
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup', onUp);
  // mouseleave/mouseenter en <html> (no burbujea) para ocultar el cursor al
  // salir realmente de la ventana, y mostrarlo de nuevo al volver a entrar.
  document.documentElement.addEventListener('mouseleave', hide);
  document.documentElement.addEventListener('mouseenter', show);
  // Suelta el estado de click si la ventana pierde foco a mitad de un
  // mousedown (p.ej. Alt+Tab con el botón apretado).
  window.addEventListener('blur', onUp);
})();