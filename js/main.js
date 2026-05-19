/*
  main.js
  - Navbar mobile
  - Smooth scrolling con offset
  - Carrusel de capturas
  - Navegación activa
  - Animaciones reveal
  - Formulario contacto demo
*/
(function () {
  const headerOffset = 96;

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  const menuToggle = qs('#menuToggle');
  const navLinks = qs('#navLinks');

  function setMenu(open) {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
    navLinks.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) setMenu(false);
    });
  }

  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  const appShotsEl = qs('#appShots');
  const dotsEl = qs('#appShotsDots');
  const featureTitleEl = qs('#featureTitle');
  const featureDescEl = qs('#featureDescription');

  const appShots = [
    {
      label: 'Pantalla Principal',
      img: 'assets/sources/screen_pantallaprincipal.png',
      title: 'Inicio claro para descubrir y publicar',
      text: 'Una pantalla principal enfocada en acceso rápido a publicaciones, productos, ferias y navegación del ecosistema WiGo.',
    },
    {
      label: 'Menú',
      img: 'assets/sources/screen_menu.png',
      title: 'Menú simple para moverte rápido',
      text: 'Accesos ordenados para comprador, vendedor, perfil, ferias y funcionalidades principales sin saturar la experiencia.',
    },
    {
      label: 'Ferias',
      img: 'assets/sources/screen_ferias.png',
      title: 'Ferias para campañas y temporadas',
      text: 'Un espacio ideal para agrupar vendedores, anuncios y promociones por región, fecha o temática comercial.',
    },
    {
      label: 'Experiencia',
      img: 'assets/sources/screen_intuitivo.png',
      title: 'Diseño móvil pensado para usuarios reales',
      text: 'Flujos directos, jerarquía visual clara y componentes preparados para crecer sin perder orden.',
    },
  ];

  let current = 0;
  let timer;

  function renderShots() {
    if (!appShotsEl || !dotsEl) return;
    appShotsEl.innerHTML = '';
    dotsEl.innerHTML = '';

    appShots.forEach((s, idx) => {
      const slide = document.createElement('div');
      slide.className = 'appshot' + (idx === 0 ? ' is-active' : '');
      slide.setAttribute('data-index', String(idx));
      slide.innerHTML = `<img src="${s.img}" alt="${s.label}" loading="lazy" decoding="async" />`;
      appShotsEl.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'appshots__dot' + (idx === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir a ${s.label}`);
      dot.addEventListener('click', () => goTo(idx));
      dotsEl.appendChild(dot);
    });

    applyText(0);
  }

  function applyText(idx) {
    if (featureTitleEl) featureTitleEl.textContent = appShots[idx].title;
    if (featureDescEl) featureDescEl.textContent = appShots[idx].text;
  }

  function goTo(idx) {
    const slides = qsa('.appshot', appShotsEl);
    const dots = qsa('.appshots__dot', dotsEl);
    slides[current]?.classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = idx;
    slides[current]?.classList.add('is-active');
    dots[current]?.classList.add('is-active');
    applyText(current);
    resetTimer();
  }

  function next() { goTo((current + 1) % appShots.length); }
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  function bootReveal() {
    const items = qsa('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => observer.observe(el));
  }

  function bootActiveNav() {
    const links = qsa('.nav__links a[href^="#"]');
    const sections = links.map((link) => qs(link.getAttribute('href'))).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const form = qs('#contactForm');
  const status = qs('#formStatus');
  function setStatus(msg) { if (status) status.textContent = msg; }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = qs('#nombre')?.value?.trim();
      const email = qs('#email')?.value?.trim();
      const asunto = qs('#asunto')?.value?.trim();
      const mensaje = qs('#mensaje')?.value?.trim();
      if (!nombre || !email || !asunto || !mensaje) {
        setStatus('Completa todos los campos, por favor.');
        return;
      }
      setStatus('¡Gracias! Tu mensaje fue registrado.');
      form.reset();
      setTimeout(() => setStatus(''), 3500);
    });
  }

  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  document.addEventListener('DOMContentLoaded', () => {
    renderShots();
    resetTimer();
    bootReveal();
    bootActiveNav();
  });
})();
