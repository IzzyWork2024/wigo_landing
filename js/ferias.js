/*
  ferias.js
  - Data de ferias
  - Lógica del mapa (click en provincias)
  - Carrusel por provincia
*/

(function () {
  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }


  const feriaImageCandidates = {
    'CONAMB - Convención Nacional Ambiental': ['logotipo_1.jpeg', 'logotipo_1.jpg', 'logotipo_1.png'],
  };

  function buildAssetPath(fileName) {
    return `assets/sources/${fileName}`;
  }

  window.tryNextFeriaImage = function tryNextFeriaImage(img) {
    const raw = img.getAttribute('data-candidates');
    if (!raw) return;

    let candidates = [];
    try { candidates = JSON.parse(raw); } catch (_) { candidates = []; }

    const currentIndex = Number(img.getAttribute('data-current-index') || '0');
    const nextIndex = currentIndex + 1;

    if (nextIndex < candidates.length) {
      img.setAttribute('data-current-index', String(nextIndex));
      img.src = buildAssetPath(candidates[nextIndex]);
      return;
    }

    const fallback = img.closest('.feria-image')?.querySelector('.feria-image__fallback');
    img.style.display = 'none';
    if (fallback) fallback.style.display = 'grid';
  };

  function renderFeriaImage(feria) {
    const candidates = feriaImageCandidates[feria.name] || [];
    const initial = feria.name.substring(0, 1);
    const logoClass = feria.logo ? ' feria-image--logo' : '';

    if (!candidates.length) {
      return `<div class="feria-image${logoClass}"><span class="feria-image__fallback">${initial}</span></div>`;
    }

    const encoded = JSON.stringify(candidates).replace(/"/g, '&quot;');
    return `
        <div class="feria-image${logoClass}">
          <img
            src="${buildAssetPath(candidates[0])}"
            alt="${feria.name}"
            loading="lazy"
            decoding="async"
            data-candidates="${encoded}"
            data-current-index="0"
            onerror="tryNextFeriaImage(this)"
          />
          <span class="feria-image__fallback" style="display:none">${initial}</span>
        </div>
      `;
  }

  // ===== Data =====
  // Primer evento real de WIGO: CONAMB en Cajamarca. El resto de regiones ya no tiene
  // ferias de relleno — se irán sumando aquí a medida que existan eventos reales.
  const feriasData = {
    cajamarca: [
      {
        name: 'CONAMB - Convención Nacional Ambiental',
        date: '26, 27 y 28 de agosto de 2026',
        location: 'Universidad Nacional de Cajamarca, Cajamarca, Perú',
        description:
          'Espacio de diálogo que reúne a jóvenes, profesionales e instituciones públicas y privadas para proponer soluciones frente a los desafíos ambientales del país, con miras a una agenda sostenible al 2030.',
        logo: true,
        link: 'https://www.facebook.com/convencionnacionalambiental',
      },
    ],
  };

  const provinces = ['cajamarca'];
  // Nombres bien escritos (con tildes) de los 25 departamentos reales del SVG — se usa tanto
  // para la pastilla "Lima/Cusco/..." del carrusel (loadFeriaSlides) como para la nueva pastilla
  // flotante de hover (bootMapHover). Los identificadores son los data-province REALES del SVG
  // (revisados en index.html), no inventados.
  const provinceNames = {
    amazonas: 'Amazonas',
    ancash: 'Áncash',
    apurimac: 'Apurímac',
    arequipa: 'Arequipa',
    ayacucho: 'Ayacucho',
    cajamarca: 'Cajamarca',
    callao: 'Callao',
    cusco: 'Cusco',
    huancavelica: 'Huancavelica',
    huanuco: 'Huánuco',
    ica: 'Ica',
    junin: 'Junín',
    lalibertad: 'La Libertad',
    lambayeque: 'Lambayeque',
    lima: 'Lima',
    loreto: 'Loreto',
    madrededios: 'Madre de Dios',
    moquegua: 'Moquegua',
    pasco: 'Pasco',
    piura: 'Piura',
    puno: 'Puno',
    sanmartin: 'San Martín',
    tacna: 'Tacna',
    tumbes: 'Tumbes',
    ucayali: 'Ucayali',
  };

  // ===== State =====
  let currentProvinceIndex = 0;
  let currentSlideIndex = 0;
  let provinceTimer;
  let slideTimer;

  // ===== UI refs =====
  const slidesContainer = () => qs('#feriaSlides');
  const indicatorsContainer = () => qs('#feriaIndicators');
  const provinceNameEl = () => qs('#currentProvinceName');

  function loadFeriaSlides(province) {
    const slides = feriasData[province] ?? [];
    const sc = slidesContainer();
    const ic = indicatorsContainer();
    const pn = provinceNameEl();

    if (!sc || !ic || !pn) return;

    pn.textContent = provinceNames[province] ?? province;
    sc.innerHTML = '';
    ic.innerHTML = '';

    slides.forEach((feria, index) => {
      const slide = document.createElement('div');
      slide.className = `feria-slide ${index === 0 ? 'active' : ''}`;
      const locationHtml = feria.location
        ? `<p class="feria-location">${feria.location}</p>`
        : '';
      const linkHtml = feria.link
        ? `<a class="feria-cta" href="${feria.link}" target="_blank" rel="noopener noreferrer" data-cursor-theme="yellow" aria-label="Ver ${feria.name}">
             <img src="${buildAssetPath('go_header01.png')}" alt="" class="feria-cta__icon" loading="lazy" decoding="async" />
           </a>`
        : '';
      slide.innerHTML = `
        ${renderFeriaImage(feria)}
        <div class="feria-info">
          <h3>${feria.name}</h3>
          <div class="feria-date">${feria.date}</div>
          ${locationHtml}
          <p class="feria-description">${feria.description}</p>
          ${linkHtml}
        </div>
      `;
      sc.appendChild(slide);

      const dot = document.createElement('span');
      dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
      ic.appendChild(dot);
    });

    // Con un solo evento los puntos de paginación no aportan nada — se ocultan.
    ic.style.display = slides.length > 1 ? '' : 'none';

    currentSlideIndex = 0;
  }

  function changeSlide() {
    const slides = qsa('.feria-slide');
    const indicators = qsa('.indicator-dot');
    if (slides.length === 0) return;

    slides[currentSlideIndex]?.classList.remove('active');
    indicators[currentSlideIndex]?.classList.remove('active');

    currentSlideIndex = (currentSlideIndex + 1) % slides.length;

    slides[currentSlideIndex]?.classList.add('active');
    indicators[currentSlideIndex]?.classList.add('active');
  }

  // ===== Profundidad 2.5D del mapa =====
  // Genera capas puramente decorativas detrás de #provinces, desplazadas SOLO hacia abajo,
  // en azules progresivamente más oscuros. Cada path clonado pierde la clase "province" y el
  // atributo data-province (pasa a usar "province-depth"), así querySelectorAll('.province') y
  // los selectores por [data-province] de este archivo siguen apuntando EXCLUSIVAMENTE a los
  // paths reales del mapa. No se toca ni se reordena el <g id="provinces"> original.
  function bootMapDepth() {
    const svg = qs('.map__svg');
    const provinces = qs('#provinces');
    if (!svg || !provinces) return;
    if (svg.querySelector('.map__depth-layer')) return; // evita duplicar si boot() corre más de una vez

    const isMobile = window.innerWidth <= 768;
    const LAYERS = isMobile ? 4 : 7;
    // El SVG usa viewBox="0 0 600 800" y se escala para caber en .map__frame, así que
    // "translate(0, Npx)" con N en unidades de usuario NO equivale a N px reales en pantalla:
    // el resultado visible depende de cuánto se reduce el SVG al ajustarse al contenedor.
    // Para lograr un grosor real y consistente (no una suposición fija), medimos la escala
    // efectiva actual del SVG vía getScreenCTM() y calculamos las unidades de usuario
    // necesarias para producir el grosor deseado en px reales de pantalla.
    const TARGET_THICKNESS_PX = isMobile ? 4.5 : 7; // grosor visible real objetivo
    let scale = 1;
    try {
      const ctm = svg.getScreenCTM();
      if (ctm && ctm.a) scale = Math.abs(ctm.a);
    } catch (_) { /* getScreenCTM no disponible: se usa escala 1 como respaldo */ }
    const MAX_OFFSET = TARGET_THICKNESS_PX / (scale || 1);
    const colors = isMobile
      ? ['#155186', '#124A7B', '#10436F', '#0A3559']
      : ['#195B95', '#155186', '#124A7B', '#10436F', '#0D3D66', '#0A3559', '#0A3559'];

    for (let i = LAYERS; i >= 1; i--) {
      const offset = (MAX_OFFSET / LAYERS) * i;
      const color = colors[Math.min(i - 1, colors.length - 1)];

      const layerGroup = provinces.cloneNode(true);
      layerGroup.removeAttribute('id');
      layerGroup.setAttribute('class', 'map__depth-layer');
      layerGroup.setAttribute('aria-hidden', 'true');
      layerGroup.setAttribute('pointer-events', 'none');
      layerGroup.setAttribute('transform', `translate(0, ${offset.toFixed(2)})`);
      layerGroup.style.pointerEvents = 'none';

      qsa('.province', layerGroup).forEach((path) => {
        path.removeAttribute('data-province');
        path.removeAttribute('class');
        path.classList.add('province-depth');
        path.removeAttribute('style');
        path.style.fill = color;
        path.style.stroke = 'none';
        path.style.pointerEvents = 'none';
      });

      svg.insertBefore(layerGroup, provinces);
    }
  }

  // ===== Tooltip minimalista de hover (pastilla + línea + punto) =====
  // Una sola instancia en el DOM (#mapHoverUI), reposicionada por JS para cada departamento.
  // No sigue al cursor: el punto se ancla al centro de la región usando getBBox() (coordenadas
  // locales del path, estables) + getScreenCTM() del propio path (matriz real a pantalla, ya
  // incluye el viewBox/preserveAspectRatio y cualquier transform CSS vigente, incluida la
  // elevación de :hover) — la misma técnica ya usada en bootMapDepth para medir el mapa con
  // precisión, en vez de calcular a mano el ratio de escala del SVG.
  function bootMapHover() {
    const hoverUI = qs('#mapHoverUI');
    const hoverLabel = qs('#mapHoverLabel');
    const frame = qs('.map__frame');
    const svg = qs('.map__svg');
    const badge = qs('.map__badge'); // pastilla "go Perú" — la pastilla de hover no debe taparla
    if (!hoverUI || !hoverLabel || !frame || !svg) return null;

    function positionHoverUI(el) {
      if (typeof el.getBBox !== 'function' || typeof el.getScreenCTM !== 'function') return false;

      const bbox = el.getBBox();
      const ctm = el.getScreenCTM();
      if (!ctm) return false;

      const point = svg.createSVGPoint();
      point.x = bbox.x + bbox.width / 2; // centro horizontal del departamento
      point.y = bbox.y + bbox.height / 2; // centro vertical del departamento (el punto se ancla aquí)
      const screenPoint = point.matrixTransform(ctm);
      const frameRect = frame.getBoundingClientRect();

      const anchorX = screenPoint.x - frameRect.left;
      let anchorY = screenPoint.y - frameRect.top;

      // Departamentos muy al norte y alargados (Loreto, Tumbes...) pueden tener su centro
      // igual bastante arriba, cerca de donde vive la pastilla "go Perú". Si dejáramos el ancla
      // ahí, el stack pastilla+línea+punto (que se dibuja HACIA ARRIBA desde el ancla) taparía
      // el badge. Medimos la altura real del stack (hoverUI.offsetHeight, ya con el texto puesto)
      // y el borde inferior real del badge, y empujamos el ancla hacia abajo lo mínimo necesario
      // para que nunca se solapen — el resto de departamentos no se ven afectados porque su
      // anchorY natural ya cae por debajo de ese límite. Es el mismo cálculo genérico para las
      // 25 regiones, sin coordenadas manuales por departamento.
      if (badge) {
        const badgeRect = badge.getBoundingClientRect();
        const badgeBottomRelative = badgeRect.bottom - frameRect.top;
        const pillStackHeight = hoverUI.offsetHeight || 50;
        const SAFETY_GAP = 14;
        const minAnchorY = badgeBottomRelative + pillStackHeight + SAFETY_GAP;
        anchorY = Math.max(anchorY, minAnchorY);
      }

      hoverUI.style.left = `${anchorX}px`;
      hoverUI.style.top = `${anchorY}px`;
      return true;
    }

    function showHoverUI(el) {
      const province = el.getAttribute('data-province');
      const label = province ? provinceNames[province] : null;
      if (!label) return; // ignora elementos .province sin nombre real (p.ej. el lago Titicaca)

      hoverLabel.textContent = label; // se fija ANTES de medir, para que offsetHeight sea exacto
      if (!positionHoverUI(el)) return;

      hoverUI.classList.add('is-visible');
    }

    function hideHoverUI() {
      hoverUI.classList.remove('is-visible');
    }

    return { showHoverUI, hideHoverUI };
  }

  function activateProvinceOnMap(province) {
    const all = qsa('.province');
    all.forEach((p) => p.classList.remove('active'));

    const provinceEls = qsa(`[data-province="${province}"]`);
    provinceEls.forEach((el) => el.classList.add('active'));
  }

  function changeProvince(index) {
    const province = provinces[index];
    activateProvinceOnMap(province);
    loadFeriaSlides(province);

    if (slideTimer) clearInterval(slideTimer);
    // Con una sola feria no hay nada que rotar: evita el parpadeo de la clase
    // "active" quitándose y volviéndose a poner sobre el mismo slide cada 5s.
    const slideCount = (feriasData[province] ?? []).length;
    if (slideCount > 1) {
      slideTimer = setInterval(changeSlide, 5000);
    }
  }

  function nextProvince() {
    currentProvinceIndex = (currentProvinceIndex + 1) % provinces.length;
    changeProvince(currentProvinceIndex);
  }

  function boot() {
    // Capas decorativas de profundidad 2.5D (solo visuales, no interactivas)
    bootMapDepth();

    // Pastilla flotante de hover (null si el markup #mapHoverUI no está presente)
    const mapHover = bootMapHover();

    // Click en provincias
    const provinceElements = qsa('.province');

    provinceElements.forEach((el) => {
      el.addEventListener('click', () => {
        const provinceName = el.getAttribute('data-province');
        const idx = provinces.indexOf(provinceName);
        if (idx === -1) return;

        if (provinceTimer) clearInterval(provinceTimer);

        currentProvinceIndex = idx;
        changeProvince(idx);
        if (provinces.length > 1) {
          provinceTimer = setInterval(nextProvince, 15000);
        }
      });

      // Microinteracción de hover: solo pastilla + punto de luz, no toca el click de arriba
      if (mapHover) {
        el.addEventListener('mouseenter', () => mapHover.showHoverUI(el));
        el.addEventListener('mouseleave', () => mapHover.hideHoverUI());
      }
    });

    // Inicia fijo en Cajamarca, nuestra primera feria real. changeProvince() ya arma
    // su propio slideTimer solo si hay más de un slide que rotar.
    changeProvince(0);
    if (provinces.length > 1) {
      provinceTimer = setInterval(nextProvince, 15000);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();