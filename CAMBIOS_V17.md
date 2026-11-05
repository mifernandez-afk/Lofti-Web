# CAMBIOS V17 — Auditoría y correcciones

## P0-1: Fix ESM export en `js/pricing.js`

**Problema:** `pricing.test.js` importa `quoteMonthly` con ESM `import`, pero `pricing.js` declaraba la función sin `export`. Node 22 fallaba con `SyntaxError: does not provide an export named 'quoteMonthly'`.

**Solución:**
- `js/pricing.js`: Agregado `export { quoteMonthly }` y `window.quoteMonthly = quoteMonthly` para compatibilidad dual ESM/browser.
- `js/pricing-ui.js`: Agregado `import { quoteMonthly } from './pricing.js'` al inicio. IIFE preservado.
- `precios.html`: Reemplazado dos `<script defer>` por un solo `<script type="module" src="js/pricing-ui.js">`. pricing-ui.js importa pricing.js, cadena de dependencias explícita.
- Creado `js/package.json` con `{"type": "module"}` para que Node trate `.js` como ESM.

**Verificación:**
- `node --test js/pricing.test.js`: 14/14 PASS (8 originales + 6 nuevos: $700k débito/crédito, $5M límite, overrides custom, Infinity, NaN).
- Calculadora funcional en navegador: $600k débito → tenant $610.000, Venti $9.282, owner $580.718.
- Crédito $600k → Venti $11.424, owner $578.576.

## P0-2: Etiquetado demo en `js/property-explorer.js`

**Problema:** Cuando `/api/properties` falla, se inyectan 8 propiedades ficticias sin indicación de que son datos de ejemplo.

**Solución:**
- Cada propiedad fallback lleva `demo: true`.
- `showDemoBanner()` inserta un banner con `role="status"`: "Datos de demostración — las viviendas, precios y ubicaciones son ficticios."
- `cardHTML()` muestra badge "Demo" (clase `.exp-badge--demo`) en propiedades con `demo: true`.
- `sidebarCardHTML()` muestra etiqueta "(demo)" junto al título en vista mapa.

**CSS agregado:**
- `.demo-banner`: fondo amarillo #FFF3CD, texto #856404, bordes redondeados.
- `.exp-badge--demo`: badge posicionado absolute top-right en cards.
- `.sb-demo`: chip inline en sidebar del mapa.

## P0-3: Invalidación de resultados stale en `js/pricing-ui.js`

**Problema:** Al escribir un monto inválido durante `input` event (sin commit), los resultados de la renta anterior permanecían visibles como si fueran la cotización actual.

**Solución:** Mover el limpiado de resultados (`o.textContent = '—'`) fuera del bloque `if (commit)` al inicio del `catch`. Ahora:
- Cada input inválido borra resultados inmediatamente (muestra "—").
- Mensaje de error solo aparece en blur/Enter o si ya estaba marcado `aria-invalid`.
- No penaliza tecleo incompleto con mensajes de error agresivos.

## P1: Tests ampliados en `js/pricing.test.js`

6 tests nuevos:
- `débito $700.000` y `crédito $700.000`: verifican Venti fee y neto propietario.
- `renta máxima $5.000.000 débito`: boundary superior.
- `custom fee overrides`: confirma que tenantFeeClp/landlordFeeClp personalizados funcionan.
- `Infinity lanza error` y `NaN lanza error`: edge cases numéricos.

## P0-4: Texto "Pago registrado" cambiado a "Pago simulado"

**Problema:** setTimeout en demo stepper decía "Pago registrado" tras simular un pago con Venti. "Registrado" implica transacción real.

**Solución:** Across 6 pages (index, vivienda, como-funciona, precios, preguntas, respaldo):
- "Procesando pago con Venti…" → "Simulando pago con Venti…"
- "Pago registrado" → "Pago simulado"

## P0-5: Claims de verificación cambiados a futuro/condicional

**Problema:** 6 páginas afirman "Lofti verifica tu identidad" y "El dueño también está verificado" sin KYC operativo.

**Solución:** Across 6 pages:
- "verifica tu identidad. El dueño también está verificado" → "verificará tu identidad. El dueño también pasará por verificación. Funcionalidad en desarrollo."
- "confirmamos tu identidad" → "será necesario verificar tu identidad (en desarrollo)"
- "con identidad ya verificada" → "una vez que ambas identidades estén verificadas (en desarrollo)"

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `js/pricing.js` | +2 líneas: `window.quoteMonthly` + `export` |
| `js/pricing-ui.js` | +1 import ESM, fix catch para invalidar resultados |
| `js/pricing.test.js` | +6 tests nuevos (14 total) |
| `js/property-explorer.js` | `demo: true` en fallback, `showDemoBanner()`, badges demo en cards/sidebar |
| `js/package.json` | Nuevo: `{"type": "module"}` |
| `precios.html` | Script tags simplificados a 1 module, pago simulado, verificación futuro |
| `styles.css` | +CSS: `.demo-banner`, `.exp-badge--demo`, `.sb-demo` |
| `index.html` | Pago simulado, verificación en desarrollo, identidad futuro |
| `vivienda.html` | Pago simulado, verificación en desarrollo, identidad futuro |
| `como-funciona.html` | Pago simulado, verificación en desarrollo, identidad futuro |
| `respaldo.html` | Pago simulado, verificación en desarrollo, identidad futuro |
| `preguntas.html` | Pago simulado, verificación en desarrollo, identidad futuro |
| `AUDITORIA_V17.md` | Nuevo: inventario 29 claims con estado, evidencia, texto nuevo |
