(() => {
  const NAV_LINKS = [
    { href: 'vivienda.html', label: 'Viviendas' },
    { href: 'como-funciona.html', label: 'Cómo funciona' },
    { href: 'companeros.html', label: 'Arrendar juntos' },
    { href: 'respaldo.html', label: 'Respaldo' },
    { href: 'precios.html', label: 'Precios' },
    { href: 'preguntas.html', label: 'Preguntas' }
  ];

  const MOBILE_GROUPS = [
    { title: 'Explorar', items: [
      { href: 'vivienda.html', label: 'Ver propiedades' },
      { href: 'companeros.html', label: 'Arrendar juntos' },
      { href: 'index.html#situaciones', label: 'Qué estás buscando' }
    ]},
    { title: 'Cómo funciona', items: [
      { href: 'como-funciona.html', label: 'Paso a paso' },
      { href: 'como-funciona.html#dueños', label: 'Para dueños' }
    ]},
    { title: 'Ayuda y confianza', items: [
      { href: 'respaldo.html', label: 'Respaldo' },
      { href: 'precios.html', label: 'Precios' },
      { href: 'preguntas.html', label: 'Preguntas' }
    ]}
  ];

  var current = location.pathname.split('/').pop() || 'index.html';
  var container = document.getElementById('site-header');
  if (!container) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k) {
      if (k === 'className') node.className = attrs[k];
      else if (k === 'textContent') node.textContent = attrs[k];
      else if (k === 'ariaLabel') node.setAttribute('aria-label', attrs[k]);
      else if (k === 'ariaCurrent') node.setAttribute('aria-current', attrs[k]);
      else if (k === 'ariaExpanded') node.setAttribute('aria-expanded', attrs[k]);
      else if (k === 'ariaControls') node.setAttribute('aria-controls', attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    if (children) children.forEach(function(c) {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function navLink(href, label) {
    var attrs = { href: href };
    if (href === current || (current === 'index.html' && href === 'index.html')) {
      attrs.ariaCurrent = 'page';
      attrs.className = 'active';
    }
    return el('a', attrs, [label]);
  }

  // Desktop nav links
  var navLinksDiv = el('div', { className: 'nav-links' });
  NAV_LINKS.forEach(function(lk) { navLinksDiv.appendChild(navLink(lk.href, lk.label)); });

  // Desktop CTA
  var navCta = el('div', { className: 'nav-cta' }, [
    el('a', { className: 'btn btn-outline-brand btn-sm', href: 'preguntas.html#ingresar', 'data-track': 'nav_ingresar' }, ['Ingresar'])
  ]);

  // Menu button
  var menuBtn = el('button', { className: 'menu-btn', type: 'button', id: 'menu', ariaExpanded: 'false', ariaControls: 'mnav' }, ['Menú']);

  // Mobile nav
  var mnav = el('div', { className: 'mnav', id: 'mnav', 'data-open': 'false' });
  mnav.appendChild(navLink('index.html', 'Inicio'));
  MOBILE_GROUPS.forEach(function(g) {
    mnav.appendChild(el('p', { className: 'mnav-group' }, [g.title]));
    g.items.forEach(function(it) { mnav.appendChild(el('a', { href: it.href }, [it.label])); });
  });
  var mnavCta = el('div', { className: 'mnav-cta' }, [
    el('a', { className: 'btn btn-outline-brand', href: 'preguntas.html#ingresar', 'data-track': 'menu_ingresar' }, ['Ingresar'])
  ]);
  mnav.appendChild(mnavCta);

  // Logo
  var logoImg = el('img', { className: 'logo', src: 'img/principal.png', alt: 'Lofti', width: '59', height: '24' });
  var logoLink = el('a', { className: 'brand', href: 'index.html', ariaLabel: 'Lofti, inicio' }, [logoImg]);

  // Build nav bar
  var navBar = el('nav', { className: 'nav-bar', ariaLabel: 'Principal' }, [logoLink, navLinksDiv, navCta, menuBtn, mnav]);

  // Build header
  var header = el('header', { className: 'nav' }, [navBar]);
  container.appendChild(header);

  // Menu toggle logic
  function setMenu(open) {
    mnav.dataset.open = String(open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function() { setMenu(mnav.dataset.open !== 'true'); });
  mnav.addEventListener('click', function(e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mnav.dataset.open === 'true') { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('pointerdown', function(e) {
    if (mnav.dataset.open === 'true' && !e.target.closest('#mnav, #menu')) setMenu(false);
  });
  var wide = matchMedia('(min-width: 1101px)');
  if (wide.addEventListener) wide.addEventListener('change', function() { if (wide.matches) setMenu(false); });
})();
