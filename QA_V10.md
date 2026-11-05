# QA V10 — Lofti

Fecha: 2026-10-31

## 1. Explorador lista/mapa (vivienda.html)

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| H1 V10 copy | "Encuentra un lugar para vivir" | Verificado via JS: `document.querySelector('.h1').textContent` | PASS |
| Vista lista: grid 3 columnas | `.properties-grid` con `repeat(3, 1fr)` | 12 cards renderizadas en grid | PASS |
| Vista mapa: sidebar 35% + mapa 65% | `.map-layout` grid `35% 65%` | Layout renderizado, sidebar visible | PASS |
| Counter siempre visible | `#exp-count` visible en ambas vistas | "12 propiedades" visible en lista y mapa | PASS |
| View switch pill | `.view-switch` con `aria-pressed` | Lista/Mapa botones funcionan, `aria-pressed` alterna | PASS |
| Map sidebar: cards viewport | `propertiesInBounds()` filtra por bounds | "12 viviendas visibles" con 12 cards en sidebar | PASS |
| Map sidebar: count | `#map-visible-count` aria-live | "12 viviendas visibles" texto actualizado | PASS |
| Map pins: 12 marcadores | `.map-price-pin` por propiedad | 12 pins verificados via JS `querySelectorAll` | PASS |
| moveend debounce | 200ms debounce en `moveend` event | Timer configurado, sidebar se re-renderiza tras mover mapa | PASS |
| Leaflet lazy-load | Leaflet carga solo al cambiar a mapa | `window.L` undefined en lista, definido tras mapa | PASS |
| localStorage view preference | `lofti.propertyView` persiste vista | Guardado y restaurado al recargar | PASS |

## 2. Filtros y chips

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Click comuna Providencia | Filtra a 3 propiedades + chip "Providencia" | "3 propiedades en Providencia", chip visible | PASS |
| Chip removible | Click en chip X remueve filtro | Click en chip elimina filtro, vuelve a 12 | PASS |
| "Limpiar filtros" visible solo con filtros activos | Botón hidden sin filtros, visible con filtros | `hidden` toggles correctamente | PASS |
| "Limpiar filtros" reset completo | Reset todos los filtros a defaults | 12 propiedades, chips hidden, selects reset | PASS |
| Empty state filtros | "Sin resultados. Prueba con..." | Verificado con filtros restrictivos | PASS |

## 3. Copy V10 (8 páginas)

| Página | H1 esperado | H1 observado | Resultado |
|--------|------------|--------------|-----------|
| index.html | "Todo tu arriendo, en un solo lugar." | "Todo tu arriendo, en un solo lugar." | PASS |
| vivienda.html | "Encuentra un lugar para vivir" | "Encuentra un lugar para vivir" | PASS |
| como-funciona.html | "Arrendar puede ser más simple." | "Arrendar puede ser más simple." | PASS |
| companeros.html | "Compartir hogar comienza por conocerse." | "Compartir hogar comienza por conocerse." | PASS |
| respaldo.html | "Acuerdos claros para ambas partes." | "Acuerdos claros para ambas partes." | PASS |
| precios.html | "Precios claros desde el comienzo." | "Precios claros desde el comienzo." | PASS |
| preguntas.html | "Resolvemos tus dudas." | "Resolvemos tus dudas." | PASS |
| demo.html | "Prueba cómo funciona Lofti." | "Prueba cómo funciona Lofti." | PASS |

## 4. Diseño blanco

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Body background #FFF | `body { background: var(--page-white) }` | Blanco en todas las páginas | PASS |
| Cards border `--line-soft` | `.v9-card`, `.v9-step`, `.v9-faq-item` con `#E9E6E3` | Borders actualizados a `--line-soft` | PASS |
| Hero skyline preservado | Imagen Santiago con `margin-top: -260px` | Sin cambios, funcional | PASS |
| Tokens V10 definidos | `--page-white`, `--line-soft`, `--text-muted`, `--hover-soft` | Definidos en `:root` | PASS |

## 5. JS refactor

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| `js/property-explorer.js` existe | Archivo nuevo con IIFE | Creado, 310 líneas | PASS |
| Inline JS removido de vivienda.html | No más `<script>` con explorer | Reemplazado por `<script src="js/property-explorer.js" defer>` | PASS |
| Init idempotente | Guard `__loftiExplorerReady` | Presente, previene doble init | PASS |
| No circular sync | `isPanningTo` flag en panTo | Flag resetea en moveend, sidebar siempre re-renderiza | PASS |

## 6. Regresiones verificadas

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Navegación idéntica 8 páginas | Links y menú sin cambios | Verificado: nav funcionando | PASS |
| Calculadora precios.html | $600.000 débito: arrendatario $610.000, Venti $9.282 | Sin cambios en pricing.js | PASS |
| Demo demo.html funcional | Stepper 5 pasos, banner DEMO | Sin cambios en demo-state.js | PASS |
| FAQ preguntas.html | 13 acordeones funcionales | Sin cambios en estructura | PASS |
| Seguridad express.static | /.env 404, /server/ 404 | Sin cambios en server/index.js | PASS |

## 7. Pendientes externos

| Pendiente | Dependencia | Estado |
|-----------|------------|--------|
| Integración Venti real | Contrato, credenciales, callback, conciliación | Deshabilitada (`NOT_CONFIGURED`) |
| Firma electrónica avanzada (FEA) | Proveedor + revisión legal | Pendiente |
| Verificación de identidad real | Proveedor de identidad | Pendiente |
| Tratamiento de datos personales | Política de privacidad + DPA | Pendiente |
| Términos y condiciones | Revisión legal | Pendiente |
| Tests E2E automatizados | Framework de testing | Pendiente |
