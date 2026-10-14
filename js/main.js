/* =========================================================
   ROEP TECH — main.js
   1. Título animado del hero
   2. Menú móvil y navegación
   3. Datos de proyectos  ← EDITA AQUÍ TUS PROYECTOS
   4. Carrusel de proyectos
   5. Tarjetas de demo
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
  const contentWrap = document.getElementById('contentWrap');
  const heroLinks = document.getElementById('heroLinks');
  const menuToggle = document.getElementById('menuToggle');
  let contentOpened = false;

  function openContent(targetId) {
    if (!contentOpened) {
      contentWrap.classList.add('open');
      contentOpened = true;
    }
    setTimeout(() => {
      const el = targetId ? document.getElementById(targetId) : contentWrap;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, contentOpened ? 120 : 380);
  }

  // Exponer globalmente para uso desde HTML si se necesita
  window.openContent = openContent;

  document.getElementById('openBtn').addEventListener('click', () => openContent('proyectos'));

  menuToggle.addEventListener('click', () => {
    const isOpen = heroLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.hero-links button').forEach(btn => {
    btn.addEventListener('click', () => {
      openContent(btn.dataset.target);
      heroLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Datos de proyectos ----------
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
      demoTitle: 'Demo · Punto de venta',
      demoDesc: 'Ventas, existencias y cortes de caja tipo tienda de conveniencia.',
      demoStatus: 'test',
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

  /* ---------- 4. Carrusel de proyectos ---------- */
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
      card.className = 'card';
      card.style.transform = `translateX(${offset * 150}px) rotateY(${offset * -28}deg) scale(${1 - Math.min(abs, 2) * 0.14})`;
      card.style.zIndex = 100 - abs;
      card.style.opacity = abs > 2 ? '0' : '1';
      card.style.filter = offset === 0 ? 'none' : 'brightness(0.85)';

      card.innerHTML = `
        <div class="thumb">${icons[p.icon]}</div>
        <div class="meta">
          <div class="tag">${p.tag}</div>
          <h3>${p.title}</h3>
          <p>${p.subtitle}</p>
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

  /* ---------- 5. Tarjetas de demo ---------- */
  const demoGrid = document.getElementById('demoGrid');

  proyectos.forEach(p => {
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
})();
