// Menu toggle for mobile
        function toggleMenu() {
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.querySelector('.menu-toggle');
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        }

        function closeMenu() {
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.querySelector('.menu-toggle');
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Carousel functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll('.carousel-dot');
        
        const descriptions = [
            {
                title: "Interfaz Intuitiva",
                text: "Nuestra pantalla principal está diseñada para que encuentres todo lo que necesitas al alcance de tu mano. Navegación simple, diseño limpio y acceso rápido a todas las funciones principales de Wigo."
            },
            {
                title: "Tienda",
                text: "La publicacion de productos de manera practica y sencilla. para que puedas publicar todo lo que ofrezcas desde donde quieras y hacia donde quieras expandirte."
            },
            {
                title: "Ferias",
                text: "Participa de nuestras ferias de temporada, queremos romper las barreras de las distancia otorgando una ventana virtual para todo el Peru."
            },
            {
                title: "Personalización Total",
                text: "Ajusta Wigo a tus necesidades con opciones de configuración flexibles. Temas personalizables, notificaciones inteligentes y preferencias avanzadas para una experiencia única."
            }
        ];

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = n;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            document.getElementById('feature-title').textContent = descriptions[currentSlide].title;
            document.getElementById('feature-description').textContent = descriptions[currentSlide].text;
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        setInterval(nextSlide, 4000);

        // Form submission
        function handleSubmit(e) {
            e.preventDefault();
            alert('¡Gracias por contactarnos! Te responderemos pronto.');
            e.target.reset();
        }

        // Ferias data
        const feriasData = {
            lima: [
                { name: 'Feria Gastronómica Mistura', date: '5-14 de Septiembre', description: 'La feria gastronómica más grande de América Latina. Celebra la diversidad culinaria peruana con los mejores chefs y productos del país.' },
                { name: 'Feria del Señor de los Milagros', date: '18-28 de Octubre', description: 'Tradicional festividad religiosa que congrega a miles de devotos. Incluye procesiones, gastronomía y actividades culturales.' },
                { name: 'Feria Internacional del Libro', date: '20-31 de Julio', description: 'Evento cultural que reúne a escritores, editoriales y amantes de la lectura de todo el mundo. Literatura, conferencias y talleres.' }
            ],
            cusco: [
                { name: 'Inti Raymi', date: '24 de Junio', description: 'Fiesta del Sol, la celebración inca más importante. Ceremonia ancestral que rinde homenaje al dios Sol con danzas, música y representaciones.' },
                { name: 'Feria de Santurantikuy', date: '24 de Diciembre', description: 'Tradicional mercado navideño cusqueño. Artesanías, retablos, figuras de nacimiento y arte popular en la Plaza de Armas.' },
                { name: 'Corpus Christi', date: 'Mayo-Junio', description: 'Festividad religiosa con procesión de 15 santos. Gastronomía tradicional, danzas y música en las calles del centro histórico.' }
            ],
            arequipa: [
                { name: 'Aniversario de Arequipa', date: '15 de Agosto', description: 'Celebración de la fundación española de la ciudad. Desfiles, fuegos artificiales, eventos culturales y tradicional corso de la amistad.' },
                { name: 'Feria del Queso y Vino', date: '15-17 de Septiembre', description: 'Exhibición de los mejores quesos artesanales y vinos de la región. Degustaciones, concursos y gastronomía arequipeña.' },
                { name: 'Festival del Rocoto Relleno', date: '10-12 de Noviembre', description: 'Homenaje al plato emblemático arequipeño. Concursos culinarios, degustaciones y actividades gastronómicas tradicionales.' }
            ],
            piura: [
                { name: 'Feria de Reyes', date: '6 de Enero', description: 'Tradicional feria comercial y ganadera. Exposición de artesanías, gastronomía norteña y presentaciones folclóricas típicas de la región.' },
                { name: 'Festival del Limón', date: '20-25 de Junio', description: 'Celebración del cítrico emblemático de Piura. Concursos gastronómicos, degustación de piscos y productos derivados del limón.' },
                { name: 'Feria del Mango', date: '15-20 de Enero', description: 'Exhibición de las diversas variedades de mango piurano. Degustaciones, productos derivados y gastronomía regional.' }
            ],
            lambayeque: [
                { name: 'Festival del King Kong', date: '18-20 de Julio', description: 'Homenaje al dulce tradicional lambayecano. Concursos de elaboración, degustaciones y exhibición de dulces típicos norteños.' },
                { name: 'Feria del Caballo de Paso', date: '25-30 de Abril', description: 'Exhibición del caballo peruano de paso. Concursos ecuestres, shows de marinera norteña y actividades culturales.' },
                { name: 'Semana Turística de Lambayeque', date: '5-12 de Marzo', description: 'Promoción del patrimonio arqueológico y cultural. Tours, danzas, gastronomía y visitas a museos y sitios históricos.' }
            ]
        };

        let currentProvinceIndex = 0;
        let currentSlideIndex = 0;
        let provinceTimer;
        let slideTimer;

        const provinces = ['lima', 'cusco', 'arequipa', 'piura', 'lambayeque'];
        const provinceNames = {
            lima: 'Lima',
            cusco: 'Cusco',
            arequipa: 'Arequipa',
            piura: 'Piura',
            lambayeque: 'Lambayeque'
        };

        function loadFeriaSlides(province) {
            const slides = feriasData[province];
            const slidesContainer = document.getElementById('feriaSlides');
            const indicatorsContainer = document.getElementById('feriaIndicators');
            const provinceNameEl = document.getElementById('currentProvince');
            
            provinceNameEl.textContent = provinceNames[province];
            slidesContainer.innerHTML = '';
            indicatorsContainer.innerHTML = '';

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
                slidesContainer.appendChild(slide);

                const indicator = document.createElement('span');
                indicator.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
                indicatorsContainer.appendChild(indicator);
            });

            currentSlideIndex = 0;
        }

        function changeSlide() {
            const slides = document.querySelectorAll('.feria-slide');
            const indicators = document.querySelectorAll('.indicator-dot');
            
            slides[currentSlideIndex].classList.remove('active');
            indicators[currentSlideIndex].classList.remove('active');
            
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            slides[currentSlideIndex].classList.add('active');
            indicators[currentSlideIndex].classList.add('active');
        }

        function changeProvince(index) {
            const allProvinces = document.querySelectorAll('.province');
            allProvinces.forEach(p => p.classList.remove('active'));
            
            const province = provinces[index];
            const provinceEl = document.querySelector(`[data-province="${province}"]`);
            if (provinceEl) {
                provinceEl.classList.add('active');
            }
            
            loadFeriaSlides(province);
            
            clearInterval(slideTimer);
            slideTimer = setInterval(changeSlide, 5000);
        }

        function nextProvince() {
            currentProvinceIndex = (currentProvinceIndex + 1) % provinces.length;
            changeProvince(currentProvinceIndex);
        }

        // Event listeners para provincias
        document.addEventListener('DOMContentLoaded', () => {
            const provinceElements = document.querySelectorAll('.province');
            
            if (provinceElements && provinceElements.length > 0) {
                provinceElements.forEach((element) => {
                    element.addEventListener('click', () => {
                        const provinceName = element.getAttribute('data-province');
                        const provinceIndex = provinces.indexOf(provinceName);
                        
                        if (provinceIndex !== -1) {
                            clearInterval(provinceTimer);
                            clearInterval(slideTimer);
                            currentProvinceIndex = provinceIndex;
                            changeProvince(provinceIndex);
                            provinceTimer = setInterval(nextProvince, 15000);
                        }
                    });
                });

                // Iniciar con Lima
                changeProvince(0);
                slideTimer = setInterval(changeSlide, 5000);
                provinceTimer = setInterval(nextProvince, 15000);
            }
        });
