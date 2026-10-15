/* =========================================================
   ROEP TECH — main.js
   1. Título animado del hero
   2. Menú móvil y navegación
   3. Cotizador interactivo
   4. Datos de proyectos  ← EDITA AQUÍ TUS PROYECTOS
   5. Carrusel de proyectos
   6. Tarjetas de demo
   7. Animaciones de scroll y navegación activa
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Título animado del hero ---------- */
  const titleParts = [
    { text: 'Sistemas que', accent: false },
    { text: 'resuelven.', accent: true }
  ];

  const heroTitle = document.getElementById('heroTitle');
  let wordIndex = 0;

  titleParts.forEach(part => {
    part.text.split(' ').forEach(word => {
      const span = document.createElement('span');
      span.className = 'word' + (part.accent ? ' accent' : '');
      span.textContent = word;
      span.style.animationDelay = (0.1 + wordIndex * 0.09) + 's';
      span.style.marginRight = '0.28em';
      heroTitle.appendChild(span);
      wordIndex++;
    });
  });

  /* ---------- 2. Menú móvil y navegación ---------- */
  const heroLinks = document.getElementById('heroLinks');
  const menuToggle = document.getElementById('menuToggle');

  function scrollToSection(targetId) {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.scrollToSection = scrollToSection;

  // Botones del hero (Ver proyectos / Simular cotización)
  document.querySelectorAll('.hero-cta [data-target]').forEach(btn => {
    btn.addEventListener('click', () => scrollToSection(btn.dataset.target));
  });

  menuToggle.addEventListener('click', () => {
    const isOpen = heroLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.hero-links button').forEach(btn => {
    btn.addEventListener('click', () => {
      scrollToSection(btn.dataset.target);
      heroLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Cotizador interactivo ---------- */

  // Número de WhatsApp de ROEP TECH (cambiar por el real)
  const WHATSAPP_NUM = '5212461234567';

  // Servicios disponibles con precios según tipo de equipo
  const serviciosCotizador = {
    comun: [
      { id: 'mant-software', name: 'Mantenimiento de software', desc: 'Optimización completa para que tu equipo vaya más rápido.', price: 500 },
      { id: 'so-ligero', name: 'Cambio de sistema operativo (ligero)', desc: 'Sistema rápido sin licencia. Incluye respaldo y drivers.', price: 700 },
      { id: 'so-windows', name: 'Cambio a Windows con licencia', desc: 'Mano de obra. La licencia de Windows se cotiza aparte.', price: 500 },
      { id: 'software-lic', name: 'Instalación de software (con licencia)', desc: 'Mano de obra. El precio de la licencia se agrega aparte.', price: 400 },
      { id: 'software-sin', name: 'Instalación de software (sin licencia)', desc: 'Instalación y configuración del programa que necesites.', price: 550 },
      { id: 'office-lic', name: 'Instalación de Office (con licencia)', desc: 'Mano de obra. La licencia de Office se cotiza aparte.', price: 200 },
      { id: 'office-sin', name: 'Instalación de Office (sin licencia)', desc: 'Word, Excel, PowerPoint y más, listos para usar.', price: 300 },
      { id: 'soporte-remoto', name: 'Soporte remoto', desc: 'Resolución de problemas de software por TeamViewer/AnyDesk.', price: 350 }
    ],
    pc: [
      { id: 'ram-pc', name: 'Aumento de memoria RAM', desc: 'Mano de obra. El módulo de RAM se cotiza aparte.', price: 300 },
      { id: 'disco-pc', name: 'Cambio de disco a SSD', desc: 'Mano de obra. El SSD se cotiza aparte. Incluye migración de datos.', price: 300 }
    ],
    laptop: [
      { id: 'ram-lap', name: 'Aumento de memoria RAM', desc: 'Mano de obra. El módulo de RAM se cotiza aparte.', price: 300 },
      { id: 'disco-lap', name: 'Cambio de disco a SSD', desc: 'Mano de obra. El SSD se cotiza aparte. Incluye migración de datos.', price: 300 },
      { id: 'teclado', name: 'Cambio de teclado', desc: 'Mano de obra. El teclado se cotiza aparte.', price: 300 }
    ]
  };

  const deviceBtns = document.querySelectorAll('.device-btn');
  const quoteServices = document.getElementById('quoteServices');
  const serviceOptionsEl = document.getElementById('serviceOptions');
  const quoteSummary = document.getElementById('quoteSummary');
  const quoteTotalEl = document.getElementById('quoteTotal');
  const quoteWhatsapp = document.getElementById('quoteWhatsapp');
  const quoteReset = document.getElementById('quoteReset');

  let selectedDevice = null;
  const selectedServices = new Set();

  const fmtMXN = n => '$' + n.toLocaleString('es-MX') + ' MXN';

  // Contador animado para el total
  let countAnim = null;
  function animateCount(target) {
    cancelAnimationFrame(countAnim);
    const current = parseInt((quoteTotalEl.textContent || '').replace(/\D/g, '')) || 0;
    const diff = target - current;
    if (diff === 0) { quoteTotalEl.textContent = fmtMXN(target); return; }
    const steps = 18;
    let step = 0;
    function tick() {
      step++;
      const val = Math.round(current + diff * (step / steps));
      quoteTotalEl.textContent = fmtMXN(step >= steps ? target : val);
      if (step < steps) countAnim = requestAnimationFrame(tick);
    }
    tick();
  }

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDevice = btn.dataset.device;
      selectedServices.clear();

      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderServiceOptions();
      quoteServices.style.display = '';
      quoteSummary.style.display = '';
      updateTotal();
    });
  });

  function renderServiceOptions() {
    const all = [...serviciosCotizador.comun, ...serviciosCotizador[selectedDevice]];
    serviceOptionsEl.innerHTML = '';

    all.forEach(s => {
      const div = document.createElement('div');
      div.className = 'service-option';
      div.innerHTML = `
        <input type="checkbox" id="svc-${s.id}" data-id="${s.id}">
        <label for="svc-${s.id}">
          <span class="so-name">${s.name}</span>
          <span class="so-desc">${s.desc}</span>
          <span class="so-price">${fmtMXN(s.price)}</span>
        </label>`;
      serviceOptionsEl.appendChild(div);

      div.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) selectedServices.add(s.id);
        else selectedServices.delete(s.id);
        updateTotal();
      });
    });

    // Animación de entrada
    serviceOptionsEl.classList.remove('show');
    void serviceOptionsEl.offsetWidth; // reflow para reiniciar animación
    serviceOptionsEl.classList.add('show');
  }

  function getSelectedList() {
    const all = [...serviciosCotizador.comun, ...serviciosCotizador[selectedDevice]];
    return all.filter(s => selectedServices.has(s.id));
  }

  function updateTotal() {
    const list = getSelectedList();
    const total = list.reduce((sum, s) => sum + s.price, 0);
    animateCount(total);

    // Armar mensaje de WhatsApp
    const deviceLabel = selectedDevice === 'pc' ? 'PC (Escritorio)' : 'Laptop';
    let msg = 'Hola ROEP TECH, quiero cotizar:\n\n';
    msg += 'Equipo: ' + deviceLabel + '\n';
    msg += 'Servicios:\n';
    list.forEach(s => { msg += '• ' + s.name + ' (' + fmtMXN(s.price) + ')\n'; });
    msg += '\nTotal estimado: ' + fmtMXN(total);
    msg += '\n\n¿Podemos agendar?';

    quoteWhatsapp.href = 'https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(msg);
  }

  quoteReset.addEventListener('click', () => {
    selectedDevice = null;
    selectedServices.clear();
    deviceBtns.forEach(b => b.classList.remove('active'));
    quoteServices.style.display = 'none';
    quoteSummary.style.display = 'none';
    serviceOptionsEl.innerHTML = '';
  });

  /* ---------- 4. Datos de proyectos ----------
     Editá este arreglo con tus proyectos reales.
     - tag / title / subtitle  → se muestran en el carrusel
     - demoTitle / demoDesc    → se muestran en la sección de demos
     - demoStatus              → 'live' | 'test' | 'dev'
     - demoLinks               → array de { label, url } (varios enlaces)
       o demoUrl               → un solo enlace
  */
  const proyectos = [
    {
      tag: 'transporte · monitoreo',
      title: 'Ruta 18',
      subtitle: 'Monitoreo y control de tiempos',
      icon: 'route',
      badge: 'EN PRODUCCIÓN',
      demoTitle: 'Demo · Monitoreo de rutas',
      demoDesc: 'Seguimiento en vivo de unidades y tiempos por parada.',
      demoStatus: 'live',
      demoLinks: [
        { label: 'Panel pasajero', url: 'https://pruebarutaas.pages.dev/' },
        { label: 'Panel dueño', url: 'https://pruebarutaas.pages.dev/dueno' },
        { label: 'Panel checador', url: 'https://pruebarutaas.pages.dev/checador' },
        { label: 'Panel conductor', url: 'https://pruebarutaas.pages.dev/conductor' }
      ]
    },
    {
      tag: 'tienda · punto de venta',
      title: 'Grupo Lobo',
      subtitle: 'Punto de venta e inventario',
      icon: 'shop',
      badge: 'EN PRODUCCIÓN',
      real: true,
      demoUrl: 'https://grupolobo1.github.io/TiendaOnline/'
    },
    {
      tag: 'comida · pedidos',
      title: 'Antojería',
      subtitle: 'Catálogo y pedidos en línea',
      icon: 'food',
      demoTitle: 'Demo · Pedidos de comida',
      demoDesc: 'Menú, armado de pedido y estatus de preparación.',
      demoStatus: 'dev',
      demoUrl: 'https://digital-dimention.github.io/Antojitos/'
    }
  ];

  /* ---------- 5. Carrusel de proyectos ---------- */
  const icons = {
    route: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="12" r="4"/><circle cx="38" cy="36" r="4"/><path d="M10 16v6a8 8 0 0 0 8 8h12a8 8 0 0 1 8 8" stroke-dasharray="3 4"/></svg>',
    shop: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 18v20h32V18M6 18l4-10h28l4 10M6 18h36"/><path d="M18 38v-8h12v8"/></svg>',
    food: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="24" cy="27" r="13"/><path d="M24 10v7M18 10v7M30 10v7"/></svg>'
  };

  const statusLabel = { live: 'en producción', test: 'en pruebas', dev: 'en desarrollo' };

  const stage = document.getElementById('stage');
  const dotsWrap = document.getElementById('dots');
  const countEl = document.getElementById('stage-count');
  let current = 0;

  const pad = n => String(n + 1).padStart(2, '0');

  function renderStage() {
    stage.innerHTML = '';
    const total = proyectos.length;

    proyectos.forEach((p, idx) => {
      let offset = idx - current;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const abs = Math.abs(offset);
      const card = document.createElement('div');
      card.className = 'card' + (offset === 0 ? ' active' : '');
      card.style.transform = `translateX(${offset * 150}px) rotateY(${offset * -28}deg) scale(${1 - Math.min(abs, 2) * 0.14})`;
      card.style.zIndex = 100 - abs;
      card.style.opacity = abs > 2 ? '0' : '1';
      card.style.filter = offset === 0 ? 'none' : 'brightness(0.85)';

      // Link de demo en la tarjeta activa (solo apps públicas — Ruta 18 es privada)
      let demoHtml = '';
      if (p.demoUrl) {
        demoHtml = `<a class="card-demo" href="${p.demoUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${p.real ? 'Ver sistema →' : 'Ver demo →'}</a>`;
      }

      const badgeHtml = p.badge ? `<span class="badge-real">${p.badge}</span>` : '';

      card.innerHTML = `
        <div class="thumb">${icons[p.icon]}</div>
        <div class="meta">
          ${badgeHtml}
          <div class="tag">${p.tag}</div>
          <h3>${p.title}</h3>
          <p>${p.subtitle}</p>
          ${demoHtml}
        </div>`;

      card.addEventListener('click', () => {
        current = idx;
        update();
      });

      stage.appendChild(card);
    });
  }

  function renderDots() {
    dotsWrap.innerHTML = '';
    proyectos.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Ir al proyecto ' + (idx + 1));
      btn.setAttribute('aria-current', idx === current ? 'true' : 'false');
      btn.addEventListener('click', () => {
        current = idx;
        update();
      });
      dotsWrap.appendChild(btn);
    });
  }

  function update() {
    renderStage();
    renderDots();
    countEl.textContent = `${pad(current)} / ${pad(proyectos.length - 1)}`;
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    current = (current - 1 + proyectos.length) % proyectos.length;
    update();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    current = (current + 1) % proyectos.length;
    update();
  });

  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
  });

  update();

  /* ---------- 6. Tarjetas de demo ---------- */
  const demoGrid = document.getElementById('demoGrid');
  const proyectosConDemo = proyectos.filter(p => p.demoTitle);

  proyectosConDemo.forEach(p => {
    const el = document.createElement('div');
    el.className = 'demo-card';

    const linksHtml = p.demoLinks
      ? `<div class="demo-links">${p.demoLinks.map(l => `<a class="open" href="${l.url}" target="_blank" rel="noopener">${l.label} →</a>`).join('')}</div>`
      : `<a class="open" href="${p.demoUrl}" target="_blank" rel="noopener">Ver demo →</a>`;

    el.innerHTML = `
      <div class="status ${p.demoStatus === 'live' ? 'live' : ''}">
        <span class="led"></span>${statusLabel[p.demoStatus]}
      </div>
      <h3>${p.demoTitle}</h3>
      <p>${p.demoDesc}</p>
      <p class="note">* datos de muestra, sin información real del negocio</p>
      ${linksHtml}`;

    demoGrid.appendChild(el);
  });

  /* ---------- 7. Carrusel de servicios ---------- */
  const servicesGrid = document.getElementById('servicesGrid');
  const svcPrev = document.getElementById('svcPrevBtn');
  const svcNext = document.getElementById('svcNextBtn');

  if (servicesGrid && svcPrev && svcNext) {
    const scrollAmount = () => {
      const card = servicesGrid.querySelector('.service-card');
      return card ? card.offsetWidth + 20 : 320;
    };
    svcPrev.addEventListener('click', () => servicesGrid.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    svcNext.addEventListener('click', () => servicesGrid.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }

  /* ---------- 8. Desglose del cotizador ---------- */
  const quoteBreakdown = document.getElementById('quoteBreakdown');

  function updateBreakdown() {
    if (!quoteBreakdown) return;
    const list = getSelectedList();
    quoteBreakdown.innerHTML = list.map(s =>
      `<div class="breakdown-row"><span>${s.name}</span><strong>${fmtMXN(s.price)}</strong></div>`
    ).join('');
  }

  // Hook: sobrescribir updateTotal para incluir desglose
  const _origUpdateTotal = updateTotal;
  updateTotal = function () {
    _origUpdateTotal();
    updateBreakdown();
  };

  /* ---------- 9. Animaciones de scroll y navegación activa ---------- */

  // Agregar clases de animación automáticamente
  document.querySelectorAll('.section-head').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.services-grid, .demo-grid, .faq-list').forEach(el => el.classList.add('stagger'));

  // IntersectionObserver para revelar elementos al hacer scroll
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));
  } else {
    // Navegador sin IntersectionObserver: revelar todo
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('revealed'));
  }

  // Navegación activa según sección visible
  const navSections = ['proyectos', 'demos', 'servicios', 'cotizador', 'faq'];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.hero-links button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === id);
          });
        }
      });
    }, { threshold: 0.25 });

    navSections.forEach(id => {
      const el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
  }
})();
