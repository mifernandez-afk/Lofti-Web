/**
 * Lofti V10 — Property Explorer
 * List/Map view with sidebar, moveend viewport filtering, pin-card sync.
 */
(function () {
  'use strict';

  var ZONES = {
    'Las Condes': { x: 74, y: 26 }, 'Providencia': { x: 54, y: 42 },
    'Ñuñoa': { x: 58, y: 60 }, 'Santiago': { x: 36, y: 54 }, 'Macul': { x: 62, y: 76 }
  };
  var TINT = {
    'Las Condes': 'var(--home)', 'Providencia': 'var(--people-soft)',
    'Ñuñoa': 'var(--match-soft)', 'Santiago': 'var(--brand-soft)', 'Macul': 'var(--home-soft)'
  };
  var IMGS = ['img/ejemplo__requisitos_de_una_pie.webp', 'img/card.webp', 'img/ejemplo_de_publicaci_n.webp', 'img/img_15.webp'];
  var API_BASE = window.location.port === '3000' ? '' : 'http://localhost:3000';
  var DATA = [];
  var TIPO_LABEL = { depto: 'Departamento', casa: 'Casa', pieza: 'Pieza' };
  var COMUNAS = ['Providencia', 'Ñuñoa', 'Santiago', 'Las Condes', 'Macul'];
  var STORAGE_KEY = 'lofti.propertyView';

  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('es-CL'); };
  var fmtK = function (n) { return '$' + Math.round(n / 1000) + 'K'; };
  var esc = window._esc || function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  var state = {
    comuna: null,
    maxPrice: 0,
    rooms: 0,
    tipo: '',
    banos: 0,
    view: 'list',
    active: null
  };

  var leafletMap = null, markerLayer = null, markers = {}, mapReady = false;
  var leafletCenter = [-33.4489, -70.6293];
  var leafletLoading = false;
  var isPanningTo = false;
  var moveendTimer = null;

  function geo(d) { return [Number(d.lat), Number(d.lng)]; }

  function savedView() {
    try { return localStorage.getItem(STORAGE_KEY) || 'list'; } catch (e) { return 'list'; }
  }
  function saveView(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* noop */ }
  }

  function mapProp(p) {
    return {
      id: p.id, titulo: p.title, comuna: p.comuna, tipo: p.type, precio: p.price,
      piezas: p.rooms, m2: p.area || 0,
      bano: p.bathrooms === 1 ? '1 baño' : p.bathrooms + ' baños',
      banos: p.bathrooms, lat: p.lat, lng: p.lng, desc: p.description,
      ownerName: p.owner ? p.owner.name : '', ownerVerified: p.owner ? p.owner.verified : false
    };
  }

  function loadProperties() {
    fetch(API_BASE + '/api/properties').then(function (r) { return r.json(); }).then(function (d) {
      DATA = d.items.map(mapProp);
      render();
    }).catch(function () {
      DATA = [
        { id: 1, titulo: 'Departamento luminoso en Providencia', comuna: 'Providencia', tipo: 'depto', precio: 420000, piezas: 2, m2: 48, bano: '1 baño', banos: 1, lat: -33.432, lng: -70.614, demo: true },
        { id: 2, titulo: 'Departamento en Ñuñoa, cerca del metro', comuna: 'Ñuñoa', tipo: 'depto', precio: 380000, piezas: 2, m2: 52, bano: '1 baño', banos: 1, lat: -33.456, lng: -70.598, demo: true },
        { id: 3, titulo: 'Casa familiar en Las Condes', comuna: 'Las Condes', tipo: 'casa', precio: 590000, piezas: 3, m2: 74, bano: '2 baños', banos: 2, lat: -33.414, lng: -70.575, demo: true },
        { id: 4, titulo: 'Studio en Santiago Centro', comuna: 'Santiago', tipo: 'depto', precio: 270000, piezas: 1, m2: 34, bano: '1 baño', banos: 1, lat: -33.446, lng: -70.656, demo: true },
        { id: 5, titulo: 'Casa con terraza en Macul', comuna: 'Macul', tipo: 'casa', precio: 450000, piezas: 3, m2: 68, bano: '2 baños', banos: 2, lat: -33.489, lng: -70.599, demo: true },
        { id: 6, titulo: 'Pieza luminosa en Providencia', comuna: 'Providencia', tipo: 'pieza', precio: 330000, piezas: 1, m2: 16, bano: 'baño compartido', banos: 1, lat: -33.429, lng: -70.610, demo: true },
        { id: 7, titulo: 'Pieza amplia en Ñuñoa', comuna: 'Ñuñoa', tipo: 'pieza', precio: 260000, piezas: 1, m2: 14, bano: 'baño privado', banos: 1, lat: -33.453, lng: -70.601, demo: true },
        { id: 8, titulo: 'Departamento en Santiago, buen metro', comuna: 'Santiago', tipo: 'depto', precio: 340000, piezas: 2, m2: 50, bano: '1 baño', banos: 1, lat: -33.449, lng: -70.651, demo: true }
      ];
      showDemoBanner();
      render();
    });
  }

  // --- Pure filter ---
  function filtered() {
    return DATA.filter(function (d) {
      if (state.comuna && d.comuna !== state.comuna) return false;
      if (state.maxPrice && d.precio > state.maxPrice) return false;
      if (state.tipo && d.tipo !== state.tipo) return false;
      if (state.banos === 1 && d.banos !== 1) return false;
      if (state.banos === 2 && d.banos < 2) return false;
      if (state.rooms === 3 && d.piezas < 3) return false;
      if (state.rooms && state.rooms < 3 && d.piezas !== state.rooms) return false;
      return true;
    });
  }

  // --- Viewport filter for map sidebar ---
  function propertiesInBounds(list) {
    if (!mapReady || !leafletMap) return list;
    var bounds = leafletMap.getBounds();
    return list.filter(function (d) {
      return bounds.contains(L.latLng(d.lat, d.lng));
    });
  }

  // --- Card HTML ---
  window.LOFTI_IMG = function (d) { return IMGS[(d.id - 1) % IMGS.length]; };

  function showDemoBanner() {
    var grid = $('exp-list');
    if (!grid) return;
    var wrap = grid.parentElement;
    if (wrap && !wrap.querySelector('.demo-banner')) {
      var b = document.createElement('div');
      b.className = 'demo-banner';
      b.setAttribute('role', 'status');
      b.textContent = 'Datos de demostración — las viviendas, precios y ubicaciones son ficticios.';
      wrap.insertBefore(b, wrap.firstChild);
    }
  }

  function cardHTML(d) {
    var demoBadge = d.demo ? '<span class="exp-badge exp-badge--demo">Demo</span>' : '';
    return '<div class="exp-photo" style="background:' + TINT[d.comuna] + '">'
      + '<img class="exp-img" src="' + IMGS[(d.id - 1) % IMGS.length] + '" alt="" loading="lazy">'
      + '<span class="exp-badge">Ejemplo</span>' + demoBadge
      + '<span class="exp-tag">' + d.piezas + (d.piezas > 1 ? ' piezas' : ' pieza') + '</span>'
      + '</div>'
      + '<div class="exp-body"><h3>' + esc(d.titulo) + '</h3>'
      + '<p class="exp-meta">' + esc(TIPO_LABEL[d.tipo] || '') + ' · ' + esc(d.comuna) + ' · ' + esc(d.m2) + ' m² · ' + esc(d.bano) + '</p>'
      + '<div class="exp-price">' + fmt(d.precio) + ' <span>/mes</span></div>'
      + '<p class="exp-total">Total con Lofti: ' + fmt(d.precio + 10000) + '/mes</p></div>';
  }

  // --- Leaflet ---
  function loadLeaflet(callback) {
    if (window.L) { callback(); return; }
    if (leafletLoading) {
      var id = setInterval(function () { if (window.L) { clearInterval(id); callback(); } }, 50);
      return;
    }
    leafletLoading = true;
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.integrity = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
    s.crossOrigin = 'anonymous';
    s.onload = callback;
    s.onerror = function () {
      leafletLoading = false;
      var el = $('exp-map');
      if (el) el.textContent = 'No se pudo cargar el mapa. Revisa tu conexión a Internet.';
    };
    document.head.appendChild(s);
  }

  function initMap() {
    if (mapReady) return;
    leafletMap = L.map('exp-map', { scrollWheelZoom: false, zoomControl: true }).setView(leafletCenter, 12);
    var tl = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> '
    }).addTo(leafletMap);

    var note = document.createElement('div');
    note.className = 'map-fallback';
    note.hidden = true;
    note.textContent = 'El mapa de calles se carga en el sitio web publicado. En esta vista previa se muestran solo las ubicaciones.';
    document.getElementById('exp-map').appendChild(note);
    tl.on('tileerror', function () { note.hidden = false; });

    markerLayer = L.layerGroup().addTo(leafletMap);
    mapReady = true;

    // Debounced moveend for viewport filtering
    leafletMap.on('moveend', function () {
      if (isPanningTo) { isPanningTo = false; }
      clearTimeout(moveendTimer);
      moveendTimer = setTimeout(function () {
        renderMapSidebar();
      }, 200);
    });
  }

  function ensureMap() {
    if (mapReady) return;
    loadLeaflet(function () {
      initMap();
      syncMap(filtered());
      fitPoints();
      setTimeout(renderMapSidebar, 300);
    });
  }

  function fitPoints() {
    if (!mapReady) return;
    var list = filtered();
    if (!list.length) { leafletMap.setView(leafletCenter, 12); renderMapSidebar(); return; }
    leafletMap.fitBounds(L.latLngBounds(list.map(geo)).pad(.4), { maxZoom: 13, animate: false });
  }

  function syncMap(list) {
    if (!mapReady) { ensureMap(); return; }
    markerLayer.clearLayers();
    markers = {};
    list.forEach(function (d) {
      var sel = state.active === d.id;
      var icon = L.divIcon({
        html: '<span>' + fmtK(d.precio) + '</span>',
        className: 'map-price-pin' + (sel ? ' active' : ''),
        iconSize: [75, 34], iconAnchor: [37, 17]
      });
      var mk = L.marker(geo(d), { icon: icon, title: d.titulo, keyboard: true, alt: d.titulo }).addTo(markerLayer);
      mk.on('click', function () {
        state.active = d.id;
        renderMapSidebar();
        highlightSidebarCard(d.id);
        scrollSidebarToCard(d.id);
      });
      markers[d.id] = mk;
    });
    setTimeout(function () { leafletMap.invalidateSize(); }, 0);
  }

  // --- Sidebar card HTML (horizontal: photo left, details right) ---
  function sidebarCardHTML(d) {
    var demoTag = d.demo ? ' <span class="sb-demo">(demo)</span>' : '';
    return '<img class="sb-photo" src="' + IMGS[(d.id - 1) % IMGS.length] + '" alt="" loading="lazy">'
      + '<div class="sb-body">'
      + '<span class="sb-title">' + esc(d.titulo) + demoTag + '</span>'
      + '<span class="sb-meta">' + d.piezas + ' dorm · ' + esc(d.bano) + ' · ' + d.m2 + ' m²</span>'
      + '<span class="sb-price">' + fmt(d.precio) + ' /mes</span>'
      + '</div>';
  }

  // --- Map sidebar rendering ---
  function renderMapSidebar() {
    var sidebar = $('map-results-list');
    var countEl = $('map-visible-count');
    if (!sidebar) return;

    var allFiltered = filtered();
    var visible = propertiesInBounds(allFiltered);

    if (countEl) {
      countEl.textContent = visible.length + (visible.length === 1 ? ' vivienda visible' : ' viviendas visibles');
    }

    sidebar.innerHTML = '';
    if (visible.length === 0) {
      sidebar.innerHTML = '<p class="map-results__empty">No hay viviendas en esta zona del mapa. Mueve el mapa o ajusta los filtros.</p>';
      return;
    }

    visible.forEach(function (d) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'map-sidebar-card';
      el.setAttribute('data-id', d.id);
      if (state.active === d.id) el.classList.add('active');
      el.innerHTML = sidebarCardHTML(d);
      el.__lofti = d;
      el.addEventListener('click', function () {
        state.active = d.id;
        isPanningTo = true;
        leafletMap.panTo(geo(d), { animate: true });
        highlightSidebarCard(d.id);
        updatePinStyles();
        if (window.openProp) window.openProp(this.__lofti);
      });
      sidebar.appendChild(el);
    });
  }

  function highlightSidebarCard(id) {
    var sidebar = $('map-results-list');
    if (!sidebar) return;
    var cards = sidebar.querySelectorAll('.map-sidebar-card');
    cards.forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-id') == id);
    });
    updatePinStyles();
  }

  function scrollSidebarToCard(id) {
    var scroll = $('map-results-list');
    if (!scroll) return;
    var card = scroll.querySelector('[data-id="' + id + '"]');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updatePinStyles() {
    Object.keys(markers).forEach(function (id) {
      var mk = markers[id];
      var el = mk.getElement();
      if (!el) return;
      var pin = el.querySelector('.map-price-pin') || el;
      if (Number(id) === state.active) {
        pin.classList.add('active');
      } else {
        pin.classList.remove('active');
      }
    });
  }

  // --- Active filter chips ---
  function renderChips() {
    var container = $('exp-active-chips');
    if (!container) return;
    container.innerHTML = '';
    var hasFilter = false;

    if (state.comuna) {
      hasFilter = true;
      container.appendChild(makeChip(state.comuna, function () { state.comuna = null; syncComunaChips(); }));
    }
    if (state.tipo) {
      hasFilter = true;
      container.appendChild(makeChip(TIPO_LABEL[state.tipo], function () { state.tipo = ''; $('exp-tipo').value = ''; }));
    }
    if (state.maxPrice) {
      hasFilter = true;
      container.appendChild(makeChip('Hasta ' + fmt(state.maxPrice), function () { state.maxPrice = 0; $('exp-price').value = '0'; }));
    }
    if (state.rooms) {
      hasFilter = true;
      var label = state.rooms >= 3 ? '3+ piezas' : state.rooms + (state.rooms === 1 ? ' pieza' : ' piezas');
      container.appendChild(makeChip(label, function () { state.rooms = 0; $('exp-rooms').value = '0'; }));
    }
    if (state.banos) {
      hasFilter = true;
      var blabel = state.banos >= 2 ? '2+ baños' : '1 baño';
      container.appendChild(makeChip(blabel, function () { state.banos = 0; $('exp-bano').value = '0'; }));
    }

    container.hidden = !hasFilter;
    var clearBtn = $('exp-clear-filters');
    if (clearBtn) clearBtn.hidden = !hasFilter;
  }

  function makeChip(text, onRemove) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'exp-active-chip';
    btn.innerHTML = esc(text) + ' <svg width="12" height="12" viewBox="0 0 256 256" aria-hidden="true"><use href="#i-miss"/></svg>';
    btn.addEventListener('click', function () {
      onRemove();
      state.active = null;
      render();
    });
    return btn;
  }

  function clearAllFilters() {
    state.comuna = null;
    state.maxPrice = 0;
    state.rooms = 0;
    state.tipo = '';
    state.banos = 0;
    state.active = null;
    syncComunaChips();
    $('exp-tipo').value = '';
    $('exp-price').value = '0';
    $('exp-rooms').value = '0';
    $('exp-bano').value = '0';
    render();
  }

  function syncComunaChips() {
    var cc = $('exp-communes');
    if (!cc) return;
    Array.prototype.forEach.call(cc.children, function (ch) {
      ch.setAttribute('aria-pressed', ch.textContent === state.comuna ? 'true' : 'false');
    });
  }

  // --- View switching ---
  function setView(v) {
    state.view = v;
    saveView(v);
    $('exp-v-list').setAttribute('aria-pressed', v === 'list' ? 'true' : 'false');
    $('exp-v-map').setAttribute('aria-pressed', v === 'map' ? 'true' : 'false');
    $('exp-list').hidden = v !== 'list';
    $('exp-map-wrap').hidden = v !== 'map';
    render();
    if (v === 'map') {
      setTimeout(function () {
        ensureMap();
        if (mapReady) {
          leafletMap.invalidateSize();
          fitPoints();
          renderMapSidebar();
        }
      }, 80);
    }
  }

  // --- Main render ---
  function render() {
    var list = filtered();
    var countEl = $('exp-count');
    if (countEl) {
      countEl.textContent = list.length + (list.length === 1 ? ' propiedad' : ' propiedades') + (state.comuna ? (' en ' + state.comuna) : '');
    }

    renderChips();

    // List view
    var grid = $('exp-list');
    if (grid && state.view === 'list') {
      grid.innerHTML = '';
      if (list.length === 0) {
        grid.innerHTML = '<p class="exp-empty">Sin resultados. Prueba con otra comuna, más piezas o un precio mayor.</p>';
      }
      list.forEach(function (d) {
        var el = document.createElement('button');
        el.type = 'button';
        el.className = 'exp-card';
        el.innerHTML = cardHTML(d);
        el.__lofti = d;
        el.addEventListener('click', function () { if (window.openProp) window.openProp(this.__lofti); });
        grid.appendChild(el);
      });
    }

    // Map view: sync markers + sidebar
    if (state.view === 'map' && mapReady) {
      syncMap(list);
      renderMapSidebar();
    }
  }

  // --- Init ---
  function init() {
    var cc = $('exp-communes');
    if (!cc) return;

    // Comuna chips
    COMUNAS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'exp-chip';
      b.textContent = c;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        state.comuna = (state.comuna === c) ? null : c;
        syncComunaChips();
        state.active = null;
        render();
      });
      cc.appendChild(b);
    });

    // Filter controls
    $('exp-tipo').addEventListener('change', function (e) { state.tipo = e.target.value; state.active = null; render(); });
    $('exp-price').addEventListener('change', function (e) { state.maxPrice = +e.target.value; state.active = null; render(); });
    $('exp-rooms').addEventListener('change', function (e) { state.rooms = +e.target.value; state.active = null; render(); });
    $('exp-bano').addEventListener('change', function (e) { state.banos = +e.target.value; state.active = null; render(); });

    // View switch
    $('exp-v-list').addEventListener('click', function () { setView('list'); });
    $('exp-v-map').addEventListener('click', function () { setView('map'); });

    // Clear filters
    var clearBtn = $('exp-clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);

    // Restore saved view preference
    var preferred = savedView();
    setView(preferred);
    loadProperties();

    // Preload Leaflet so map switch is instant
    loadLeaflet(function () {});
  }

  // Idempotent: only init once
  if (!window.__loftiExplorerReady) {
    window.__loftiExplorerReady = true;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
