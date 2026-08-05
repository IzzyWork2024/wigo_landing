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
  const headerOffset = 112;

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

  const fanPhones = qsa('.fan-phone', qs('#appFan'));
  const downloadTextEl = qs('#downloadText');
  const dotsEl = qs('#appShotsDots');
  const featureTitleEl = qs('#featureTitle');
  const featureDescEl = qs('#featureDescription');

  const appShots = [
    {
      label: 'Inicio',
      img: 'assets/sources/screen_pantallaprincipal.png',
      title: 'Wigo en tu ciudad',
      text: 'Conecta con anuncios verificados, comenta y comparte con otros usuarios<br>que también quieren comprar y vender cerca de ti.',
    },
    {
      label: 'Perfil',
      img: 'assets/sources/screen_perfil.png',
      title: 'Perfiles para comprar y vender',
      text: 'Gestiona tus ventas y haz seguimiento a tus compras,<br>todo desde tu perfil en Wigo.',
    },
    {
      label: 'Publicación',
      img: 'assets/sources/screen_intuitivo.png',
      title: 'Crea tu anuncio en segundos',
      text: 'Publica anuncios ilimitados con fotos y videos, revisa el impacto que están generando y gestiónalos todo desde tu celular.',
    },
  ];

  let current = 0;
  let timer;

  // Devuelve el índice de appShots ubicado `offset` posiciones desde el actual (circular).
  function idxAt(offset) {
    const n = appShots.length;
    return ((current + offset) % n + n) % n;
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    appShots.forEach((s, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'download__dot' + (idx === current ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir a ${s.label}`);
      dot.addEventListener('click', () => goTo(idx));
      dotsEl.appendChild(dot);
    });
  }

  function syncDots() {
    qsa('.download__dot', dotsEl).forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === current);
    });
  }

  const TEXT_FADE_MS = 400;

  // Reasigna qué teléfono ocupa cada posición (left / center / right) según el índice activo.
  // El cambio de atributo dispara la transición CSS de posición/tamaño/color en .fan-phone.
  function applySlots() {
    const slotFor = {};
    slotFor[idxAt(-1)] = 'left';
    slotFor[idxAt(0)] = 'center';
    slotFor[idxAt(1)] = 'right';
    fanPhones.forEach((el) => {
      const idx = Number(el.getAttribute('data-index'));
      el.setAttribute('data-slot', slotFor[idx]);
    });
  }

  function applyFrame() {
    applySlots();

    const center = appShots[current];
    if (downloadTextEl) downloadTextEl.style.opacity = '0';

    window.setTimeout(() => {
      if (featureTitleEl) featureTitleEl.textContent = center.title;
      if (featureDescEl) featureDescEl.innerHTML = center.text;
      if (downloadTextEl) downloadTextEl.style.opacity = '1';
    }, TEXT_FADE_MS);

    syncDots();
  }

  function goTo(idx) {
    current = idx;
    applyFrame();
    resetTimer();
  }

  function next() { goTo(idxAt(1)); }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 4200);
  }

  function bootAppFan() {
    if (!fanPhones.length) return;
    renderDots();
    applyFrame();
    resetTimer();

    fanPhones.forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number(el.getAttribute('data-index'));
        if (idx !== current) {
          goTo(idx);
          return;
        }
        const img = el.querySelector('img');
        if (img) openAppZoom(idx);
      });
    });
  }

  const appZoom = qs('#appZoom');
  const appZoomImg = qs('#appZoomImg');
  const appZoomClose = qs('#appZoomClose');
  const appZoomPrev = qs('#appZoomPrev');
  const appZoomNext = qs('#appZoomNext');
  let zoomIndex = 0;

  function renderZoomImage() {
    if (!appZoomImg) return;
    const shot = appShots[zoomIndex];
    appZoomImg.src = shot.img;
    appZoomImg.alt = shot.label;
  }

  const siteHeader = qs('.site-header');

  function openAppZoom(idx) {
    if (!appZoom || !appZoomImg) return;
    zoomIndex = idx;
    renderZoomImage();
    appZoom.classList.add('is-open');
    appZoom.setAttribute('aria-hidden', 'false');
    if (siteHeader) siteHeader.style.display = 'none';
    if (timer) clearInterval(timer);
  }

  function zoomStep(offset) {
    const n = appShots.length;
    zoomIndex = ((zoomIndex + offset) % n + n) % n;
    renderZoomImage();
  }

  function closeAppZoom() {
    if (!appZoom) return;
    appZoom.classList.remove('is-open');
    appZoom.setAttribute('aria-hidden', 'true');
    if (siteHeader) siteHeader.style.display = '';
    resetTimer();
  }

  if (appZoomClose) appZoomClose.addEventListener('click', closeAppZoom);
  if (appZoomPrev) appZoomPrev.addEventListener('click', () => zoomStep(-1));
  if (appZoomNext) appZoomNext.addEventListener('click', () => zoomStep(1));
  if (appZoom) {
    appZoom.addEventListener('click', (e) => {
      if (e.target === appZoom) closeAppZoom();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!appZoom || !appZoom.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeAppZoom();
    if (e.key === 'ArrowLeft') zoomStep(-1);
    if (e.key === 'ArrowRight') zoomStep(1);
  });

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

  function bootScrollHeader() {
    if (!siteHeader) return;
    const setState = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    setState();
    window.addEventListener('scroll', setState, { passive: true });
  }

  function bootZoneBadge(triggerSelector, sectionIds) {
    const trigger = qs(triggerSelector);
    const zoneSections = sectionIds.map((id) => qs(id)).filter(Boolean);
    if (!trigger || !zoneSections.length || !('IntersectionObserver' in window)) return;

    const activeMap = new Map(zoneSections.map((el) => [el, false]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => activeMap.set(entry.target, entry.isIntersecting));
      const anyActive = Array.from(activeMap.values()).some(Boolean);
      trigger.classList.toggle('zone-active', anyActive);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    zoneSections.forEach((section) => observer.observe(section));
  }

  function bootFloatingParticles() {
    const container = qs('#impactParticles');
    if (!container) return;

    const TOTAL = 80;
    const TARGET_GO = 10;
    const II_SRC = 'assets/sources/ii.png';
    const GO_SRC = 'assets/sources/icono_go_app.png';
    const WIGO_SRC = 'assets/sources/wigo-header02.png';
    const CHECK_INTERVAL = 250; // ms entre revisiones de colisión
    const GO_LIFE_MIN = 9000, GO_LIFE_MAX = 16000; // cuánto dura un GO antes de reciclarse
    const WIGO_LIFE_MIN = 13000, WIGO_LIFE_MAX = 23000; // un WIGO dura más, se siente más especial
    const WIGO_CHANCE = 0.6; // probabilidad de que 2 GO que se cruzan formen un WIGO
    const NO_MERGE_COOLDOWN = 2000; // si el azar no favorece la fusión, no se vuelve a intentar por un rato

    const placed = [];
    const minGapPct = 4.5;
    function findSpot() {
      for (let attempt = 0; attempt < 15; attempt++) {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const tooClose = placed.some((p) => Math.hypot(p.left - left, p.top - top) < minGapPct);
        if (!tooClose) return { left, top };
      }
      return { left: Math.random() * 100, top: Math.random() * 100 };
    }

    function randomMotion() {
      return {
        duration: 16 + Math.random() * 10,
        delay: Math.random() * -26,
        radius: 55 + Math.random() * 65,
        direction: Math.random() < 0.5 ? 'normal' : 'reverse',
      };
    }

    function makeParticle(left, top) {
      const size = 18 + Math.random() * 14;
      const opacity = 0.18 + Math.random() * 0.16;
      const motion = randomMotion();

      const wrap = document.createElement('span');
      wrap.setAttribute('aria-hidden', 'true');
      wrap.className = 'impact-section__particle';
      wrap.style.setProperty('--r', motion.radius.toFixed(0) + 'px');
      wrap.style.width = size.toFixed(0) + 'px';
      wrap.style.height = size.toFixed(0) + 'px';
      wrap.style.left = left.toFixed(1) + '%';
      wrap.style.top = top.toFixed(1) + '%';
      wrap.style.opacity = opacity.toFixed(2);
      wrap.style.animationDuration = motion.duration.toFixed(1) + 's';
      wrap.style.animationDelay = motion.delay.toFixed(1) + 's';
      wrap.style.animationDirection = motion.direction;

      const single = document.createElement('img');
      single.src = II_SRC;
      single.alt = '';
      single.className = 'impact-section__particle-single';
      wrap.appendChild(single);

      container.appendChild(wrap);
      return { el: wrap, single, state: 'ii', mergeAt: 0, lastDodgeAt: 0, noMergeUntil: 0 };
    }

    const particles = [];
    for (let i = 0; i < TOTAL; i++) {
      const { left, top } = findSpot();
      placed.push({ left, top });
      particles.push(makeParticle(left, top));
    }

    let goCount = 0;
    let wigoCount = 0;

    function spawnBurst(rectA, rectB, containerRect, big) {
      const midX = (rectA.left + rectA.width / 2 + rectB.left + rectB.width / 2) / 2 - containerRect.left;
      const midY = (rectA.top + rectA.height / 2 + rectB.top + rectB.height / 2) / 2 - containerRect.top;
      const burst = document.createElement('span');
      burst.className = 'impact-section__burst' + (big ? ' impact-section__burst--big' : '');
      burst.style.left = midX.toFixed(1) + 'px';
      burst.style.top = midY.toFixed(1) + 'px';
      container.appendChild(burst);
      setTimeout(() => burst.remove(), 700);
    }

    function turnIntoGo(p) {
      p.state = 'go';
      p.single.src = GO_SRC;
      p.el.classList.remove('is-wigo');
      p.el.classList.add('is-go');
      p.mergeAt = performance.now() + GO_LIFE_MIN + Math.random() * (GO_LIFE_MAX - GO_LIFE_MIN);
      goCount++;
    }

    function turnIntoWigo(p) {
      p.state = 'wigo';
      p.single.src = WIGO_SRC;
      p.el.classList.remove('is-go');
      p.el.classList.add('is-wigo');
      p.mergeAt = performance.now() + WIGO_LIFE_MIN + Math.random() * (WIGO_LIFE_MAX - WIGO_LIFE_MIN);
      wigoCount++;
    }

    function revertToIi(p, containerRect) {
      // El sobreviviente vuelve a ser ii.png
      p.state = 'ii';
      p.single.src = II_SRC;
      p.el.classList.remove('is-go');
      goCount--;

      // Y aparece un segundo ii.png cerca, restaurando la pareja
      const rect = p.el.getBoundingClientRect();
      const left = containerRect.width ? ((rect.left - containerRect.left) / containerRect.width) * 100 : Math.random() * 100;
      const top = containerRect.height ? ((rect.top - containerRect.top) / containerRect.height) * 100 : Math.random() * 100;
      const partner = makeParticle(
        Math.min(98, Math.max(0, left + (Math.random() * 6 - 3))),
        Math.min(98, Math.max(0, top + (Math.random() * 6 - 3)))
      );
      particles.push(partner);
    }

    function revertWigoToGo(p, containerRect) {
      // El sobreviviente vuelve a ser GO
      turnIntoGo(p); // ya suma +1 a goCount y limpia is-wigo
      wigoCount--;

      // Y aparece un segundo GO cerca, restaurando la pareja
      const rect = p.el.getBoundingClientRect();
      const left = containerRect.width ? ((rect.left - containerRect.left) / containerRect.width) * 100 : Math.random() * 100;
      const top = containerRect.height ? ((rect.top - containerRect.top) / containerRect.height) * 100 : Math.random() * 100;
      const partner = makeParticle(
        Math.min(98, Math.max(0, left + (Math.random() * 6 - 3))),
        Math.min(98, Math.max(0, top + (Math.random() * 6 - 3)))
      );
      particles.push(partner);
      turnIntoGo(partner);
    }

    function tick() {
      const now = performance.now();
      const containerRect = container.getBoundingClientRect();

      // 1) Reciclar los GO y WIGO que ya cumplieron su tiempo
      particles.filter((p) => p.state === 'go' && now >= p.mergeAt).forEach((p) => revertToIi(p, containerRect));
      particles.filter((p) => p.state === 'wigo' && now >= p.mergeAt).forEach((p) => revertWigoToGo(p, containerRect));

      // 2) Buscar colisiones entre ii.png disponibles
      if (goCount < TARGET_GO) {
        const iiParticles = particles.filter((p) => p.state === 'ii');
        const rects = iiParticles.map((p) => p.el.getBoundingClientRect());
        const used = new Set();
        for (let i = 0; i < iiParticles.length && goCount < TARGET_GO; i++) {
          const a = iiParticles[i];
          if (used.has(a)) continue;
          const rectA = rects[i];
          for (let j = i + 1; j < iiParticles.length; j++) {
            const b = iiParticles[j];
            if (used.has(b)) continue;
            const rectB = rects[j];
            const dx = (rectA.left + rectA.width / 2) - (rectB.left + rectB.width / 2);
            const dy = (rectA.top + rectA.height / 2) - (rectB.top + rectB.height / 2);
            const dist = Math.hypot(dx, dy);
            const threshold = (rectA.width + rectB.width) / 2 + 2;
            if (dist < threshold) {
              used.add(a); used.add(b);
              spawnBurst(rectA, rectB, containerRect);
              turnIntoGo(a); // "a" sobrevive convertido en GO
              b.el.classList.add('is-merging');
              setTimeout(() => {
                b.el.remove();
                const idx = particles.indexOf(b);
                if (idx !== -1) particles.splice(idx, 1);
              }, 260);
              break;
            }
          }
        }
      }

      // 3) Buscar cruces entre GO — con alta probabilidad (85%) se convierten en WIGO
      const goParticles = particles.filter((p) => p.state === 'go');
      const goRects = goParticles.map((p) => p.el.getBoundingClientRect());
      const usedGo = new Set();
      for (let i = 0; i < goParticles.length; i++) {
        const a = goParticles[i];
        if (usedGo.has(a) || now < a.noMergeUntil) continue;
        const rectA = goRects[i];
        for (let j = i + 1; j < goParticles.length; j++) {
          const b = goParticles[j];
          if (usedGo.has(b) || now < b.noMergeUntil) continue;
          const rectB = goRects[j];
          const dx = (rectA.left + rectA.width / 2) - (rectB.left + rectB.width / 2);
          const dy = (rectA.top + rectA.height / 2) - (rectB.top + rectB.height / 2);
          const dist = Math.hypot(dx, dy);
          const threshold = (rectA.width + rectB.width) / 2 + 20;
          if (dist < threshold) {
            if (Math.random() < WIGO_CHANCE) {
              usedGo.add(a); usedGo.add(b);
              spawnBurst(rectA, rectB, containerRect, true);
              goCount -= 2; // "a" y "b" dejan de contar como GO (uno se vuelve WIGO, el otro desaparece)
              turnIntoWigo(a);
              b.el.classList.add('is-merging');
              setTimeout(() => {
                b.el.remove();
                const idx = particles.indexOf(b);
                if (idx !== -1) particles.splice(idx, 1);
              }, 260);
            } else {
              // Esta vez no se fusionan: se dejan pasar sin reintentar por un rato
              a.noMergeUntil = now + NO_MERGE_COOLDOWN;
              b.noMergeUntil = now + NO_MERGE_COOLDOWN;
            }
            break;
          }
        }
      }
    }

    setInterval(tick, CHECK_INTERVAL);
  }

  function bootCounters() {
    const els = qsa('[data-count]');
    if (!els.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function formatNumber(value, decimals) {
      return value.toLocaleString('es-PE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    function animateCount(el) {
      const to = parseFloat(el.getAttribute('data-count-to') || '0');
      const decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
      const prefix = el.getAttribute('data-count-prefix') || '';
      const suffix = el.getAttribute('data-count-suffix') || '';
      const render = (value) => { el.textContent = `${prefix}${formatNumber(value, decimals)}${suffix}`; };

      if (reduceMotion) { render(to); return; }

      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        render(to * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else render(to);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(animateCount);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    els.forEach((el) => observer.observe(el));
  }

  function bootRegionCards() {
    const cardA = qs('#regionCardA');
    const cardB = qs('#regionCardB');
    const nameA = qs('#regionNameA');
    const nameB = qs('#regionNameB');
    if (!cardA || !cardB || !nameA || !nameB) return;

    const departamentos = [
      'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
      'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
      'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
      'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
      'Tumbes', 'Ucayali',
    ];

    function pickPair() {
      const i = Math.floor(Math.random() * departamentos.length);
      let j = Math.floor(Math.random() * departamentos.length);
      while (j === i) j = Math.floor(Math.random() * departamentos.length);
      return [departamentos[i], departamentos[j]];
    }

    function formatRegionName(name) {
      const parts = name.split(' ');
      if (parts.length <= 1) return name;
      return `${parts[0]}<br />${parts.slice(1).join(' ')}`;
    }

    function swap() {
      const [a, b] = pickPair();
      nameA.classList.add('is-updating');
      nameB.classList.add('is-updating');
      setTimeout(() => {
        nameA.innerHTML = formatRegionName(a);
        nameB.innerHTML = formatRegionName(b);
        nameA.classList.remove('is-updating');
        nameB.classList.remove('is-updating');
      }, 300);
    }

    setInterval(swap, 4000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bootAppFan();
    bootReveal();
    bootActiveNav();
    bootScrollHeader();
    bootZoneBadge('#navGo', ['#quienes-somos', '#historia']);
    bootZoneBadge('#navCta', ['#contacto']);
    bootRegionCards();
    bootCounters();
    bootFloatingParticles();
  });
})();