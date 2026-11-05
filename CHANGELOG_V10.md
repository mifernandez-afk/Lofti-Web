# CHANGELOG V10 — Lofti

Fecha: 2026-10-31

## Archivos modificados

| Archivo | Modificación | Motivo |
|---------|-------------|--------|
| `styles.css` | Tokens V10: `--page-white`, `--line-soft`, `--text-muted`, `--hover-soft`. Nuevos componentes: `.results-bar`, `.view-switch` pill, `.properties-grid` (3 columnas), `.map-layout` grid 35%/65%, `.map-results` sidebar con scroll, `.map-results__scroll`, `.map-results__header`, `.map-results__empty`, `.map-stage`. Filter enhancements: `.exp-filters-clear`, `.exp-active-chips`, `.exp-active-chip`. White background pass: `body` background `--page-white`, `.v9-card`/`.v9-step`/`.v9-faq-item` borders a `--line-soft`. Mobile map responsive: carrusel horizontal en sidebar. | V10 spec: explorador lista/mapa, diseño blanco, pill view switch, sidebar contextual con viewport filtering. |
| `js/property-explorer.js` | Archivo nuevo. Lógica de explorador extraída de vivienda.html inline JS. Estado, filtros, renderizado de lista y mapa. Map sidebar con `moveend` debounced (200ms) para viewport filtering via `propertiesInBounds()`. Pin-card sync bidireccional. localStorage para preferencia de vista (`lofti.propertyView`). Chips de filtros activos removibles. Botón "Limpiar filtros". Init idempotente con guard `__loftiExplorerReady`. | V10 spec: JS refactor, explorador a archivo separado, panel contextual con sync mapa-lista. |
| `vivienda.html` | H1 "Encuentra un lugar para vivir". Nuevo HTML: `.results-bar` con counter + `.view-switch` pill. `.properties-grid` para lista. `.map-layout` con `.map-results` sidebar + `.map-stage`. Removed: inline explorer JS (~190 líneas), `#map-toolbar`, `#exp-detail`, `.exp-mapwrap`. Added: `<script src="js/property-explorer.js" defer>`. Botón "Limpiar filtros", chips de filtros activos. | V10 spec: nuevo explorador lista/mapa con sidebar, extracción JS. |
| `como-funciona.html` | H1 "Arrendar puede ser más simple." | V10 copy update. |
| `companeros.html` | H1 "Compartir hogar comienza por conocerse." | V10 copy update. |
| `respaldo.html` | H1 "Acuerdos claros para ambas partes." | V10 copy update. |
| `precios.html` | H1 "Precios claros desde el comienzo." | V10 copy update. |
| `preguntas.html` | H1 "Resolvemos tus dudas." | V10 copy update. |
| `demo.html` | H1 "Prueba cómo funciona Lofti." (punto final añadido) | V10 copy update. |

## Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `js/property-explorer.js` | Módulo IIFE con lógica completa del explorador de propiedades: filtros, vista lista/mapa, sidebar contextual, Leaflet lazy-load, moveend viewport filtering, pin-card sync. |

## Notas

- Navegación idéntica en todas las páginas (fuente única `js/site-nav.js`).
- Calculadora sigue usando `js/pricing.js` como única fuente de verdad.
- Demo mantiene máquina de estados en `js/demo-state.js`.
- No se modificó `index_single_page_backup.html`.
- Integración Venti: sigue deshabilitada (`NOT_CONFIGURED`).
- Firma electrónica real: pendiente de proveedor.
- Hero skyline e imagen de inicio preservados sin cambio.
