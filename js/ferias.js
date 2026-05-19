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

  // ===== Data =====
  const feriasData = {
    lima: [
      {
        name: 'Feria Gastronómica Mistura',
        date: '5-14 de Septiembre',
        description:
          'La feria gastronómica más grande de América Latina. Celebra la diversidad culinaria peruana con los mejores chefs y productos del país.',
      },
      {
        name: 'Feria del Señor de los Milagros',
        date: '18-28 de Octubre',
        description:
          'Tradicional festividad religiosa que congrega a miles de devotos. Incluye procesiones, gastronomía y actividades culturales.',
      },
      {
        name: 'Feria Internacional del Libro',
        date: '20-31 de Julio',
        description:
          'Evento cultural que reúne a escritores, editoriales y amantes de la lectura. Literatura, conferencias y talleres.',
      },
    ],
    cusco: [
      {
        name: 'Inti Raymi',
        date: '24 de Junio',
        description:
          'Fiesta del Sol, la celebración inca más importante. Ceremonia ancestral con danzas, música y representaciones.',
      },
      {
        name: 'Feria de Santurantikuy',
        date: '24 de Diciembre',
        description:
          'Tradicional mercado navideño cusqueño. Artesanías, retablos y arte popular en la Plaza de Armas.',
      },
      {
        name: 'Corpus Christi',
        date: 'Mayo-Junio',
        description:
          'Festividad religiosa con procesión de 15 santos. Gastronomía tradicional, danzas y música en el centro histórico.',
      },
    ],
    arequipa: [
      {
        name: 'Aniversario de Arequipa',
        date: '15 de Agosto',
        description:
          'Celebración de la fundación española de la ciudad. Desfiles, fuegos artificiales, eventos culturales y corso de la amistad.',
      },
      {
        name: 'Feria del Queso y Vino',
        date: '15-17 de Septiembre',
        description:
          'Exhibición de quesos artesanales y vinos de la región. Degustaciones, concursos y gastronomía arequipeña.',
      },
      {
        name: 'Festival del Rocoto Relleno',
        date: '10-12 de Noviembre',
        description:
          'Homenaje al plato emblemático arequipeño. Concursos culinarios, degustaciones y actividades tradicionales.',
      },
    ],
    piura: [
      {
        name: 'Feria de Reyes',
        date: '6 de Enero',
        description:
          'Tradicional feria comercial y ganadera. Artesanías, gastronomía norteña y presentaciones folclóricas.',
      },
      {
        name: 'Festival del Limón',
        date: '20-25 de Junio',
        description:
          'Celebración del cítrico emblemático de Piura. Concursos gastronómicos y productos derivados del limón.',
      },
      {
        name: 'Feria del Mango',
        date: '15-20 de Enero',
        description:
          'Exhibición de variedades de mango piurano. Degustaciones, productos derivados y gastronomía regional.',
      },
    ],
    lambayeque: [
      {
        name: 'Festival del King Kong',
        date: '18-20 de Julio',
        description:
          'Homenaje al dulce tradicional lambayecano. Concursos de elaboración, degustaciones y dulces típicos.',
      },
      {
        name: 'Feria del Caballo de Paso',
        date: '25-30 de Abril',
        description:
          'Exhibición del caballo peruano de paso. Concursos ecuestres, shows de marinera y actividades culturales.',
      },
      {
        name: 'Semana Turística de Lambayeque',
        date: '5-12 de Marzo',
        description:
          'Promoción del patrimonio cultural. Tours, danzas, gastronomía y visitas a museos y sitios históricos.',
      },
    ],
  };

  const provinces = ['lima', 'cusco', 'arequipa', 'piura', 'lambayeque'];
  const provinceNames = {
    lima: 'Lima',
    cusco: 'Cusco',
    arequipa: 'Arequipa',
    piura: 'Piura',
    lambayeque: 'Lambayeque',
  };

  // ===== State =====
  let currentProvinceIndex = 0;
  let currentSlideIndex = 0;
  let provinceTimer;
  let slideTimer;

  // ===== UI refs =====
  const slidesContainer = () => qs('#feriaSlides');
  const indicatorsContainer = () => qs('#feriaIndicators');
  const provinceNameEl = () => qs('#currentProvince');

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
      slide.innerHTML = `
        <div class="feria-image">${feria.name.substring(0, 1)}</div>
        <div class="feria-info">
          <h3>${feria.name}</h3>
          <div class="feria-date">${feria.date}</div>
          <p class="feria-description">${feria.description}</p>
        </div>
      `;
      sc.appendChild(slide);

      const dot = document.createElement('span');
      dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
      ic.appendChild(dot);
    });

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

  function activateProvinceOnMap(province) {
    const all = qsa('.province');
    all.forEach((p) => p.classList.remove('active'));

    const provinceEl = qs(`[data-province="${province}"]`);
    if (provinceEl) provinceEl.classList.add('active');
  }

  function changeProvince(index) {
    const province = provinces[index];
    activateProvinceOnMap(province);
    loadFeriaSlides(province);

    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(changeSlide, 5000);
  }

  function nextProvince() {
    currentProvinceIndex = (currentProvinceIndex + 1) % provinces.length;
    changeProvince(currentProvinceIndex);
  }

  function boot() {
    // Click en provincias
    const provinceElements = qsa('.province');

    provinceElements.forEach((el) => {
      el.addEventListener('click', () => {
        const provinceName = el.getAttribute('data-province');
        const idx = provinces.indexOf(provinceName);
        if (idx === -1) return;

        if (provinceTimer) clearInterval(provinceTimer);
        if (slideTimer) clearInterval(slideTimer);

        currentProvinceIndex = idx;
        changeProvince(idx);
        provinceTimer = setInterval(nextProvince, 15000);
      });
    });

    // Iniciar con Lima
    changeProvince(0);
    slideTimer = setInterval(changeSlide, 5000);
    provinceTimer = setInterval(nextProvince, 15000);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
