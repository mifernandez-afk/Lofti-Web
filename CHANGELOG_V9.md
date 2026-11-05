# CHANGELOG V9 — Lofti

Fecha: 2026-10-31

## Archivos modificados

| Archivo | Modificación | Motivo |
|---------|-------------|--------|
| `styles.css` | Añadido sistema de componentes V9: `.v9-header`, `.v9-cards`, `.v9-card`, `.v9-steps`, `.v9-tabs`, `.v9-faq`, `.v9-stepper`, `.v9-layout`, `.btn-outline-brand`. Responsive breakpoints incluidos. | Wireframes V9 requieren nuevo sistema de tarjetas, acordeones y encabezados unificados. |
| `js/site-nav.js` | Botón CTA unificado: solo "Ingresar" con `.btn-outline-brand`. Enlace "Vivienda" renombrado a "Viviendas". Menú mobile: una sola columna CTA. | V9 prompt requiere un solo botón de registro. Consistencia de nomenclatura. |
| `index.html` | Hero: nuevo eyebrow, H1, bajada. Dos tarjetas V9 ("Busco arrendar" / "Quiero poner en arriendo"). Eliminadas afirmaciones no comprobables. | Wireframe 01_inicio.png. Dos públicos equivalentes sin promesas vacías. |
| `vivienda.html` | Nuevo `v9-header shell` con eyebrow "Explorar viviendas". H1 "Encuentra tu próximo hogar". Filtros y cards preservados. | Wireframe 02_viviendas.png. Encabezado V9 sin alterar funcionalidad de búsqueda. |
| `como-funciona.html` | `<main>` completo reemplazado. V9 header con eyebrow "PASO A PASO". Tabs accesibles "Busco arrendar" / "Publico mi propiedad" con `role="tablist"`. 5 pasos numerados por tab. Side card con CTA a demo. | Wireframe 03_como_funciona.png. Tabs con ARIA correcto y navegación por teclado. |
| `companeros.html` | `<main>` reemplazado. V9 header "Compatibilidad". Dos tarjetas V9: "Mi forma de convivir" + "Lo que compartimos". Sin puntajes predictivos no validados. | Wireframe 04_companeros.png. Layout simplificado con dos entradas claras. |
| `respaldo.html` | `<main>` reemplazado. V9 header "Confianza". Tres tarjetas V9 (Verificación, Contrato digital activo, Pagos). Garantía: "Lofti no retiene esos fondos". | Wireframe 05_respaldo.png. Tres secciones claras sin llamar verificado a lo que no lo es. |
| `precios.html` | `<main>` reemplazado. V9 header "CALCULADORA". Dos tarjetas: "Tarifa Lofti" (info) + "Calcula tu arriendo" (activa, con calculadora). Labels V9. Radios débito/crédito. Script module preservado. | Wireframe 06_precios.png. Calculadora única fuente de verdad (`pricing.js`). |
| `preguntas.html` | `<main>` reemplazado. V9 header "Ayuda". 13 preguntas en acordeón V9 con `button`, `aria-expanded`, `aria-controls`. Incluye preguntas sobre documentos, garantía, roommates, firma electrónica, verificación de propiedad. | Wireframe 07_preguntas.png. FAQ accesible con botones en vez de `<details>`. |
| `demo.html` | Eyebrow cambiado a "MODO DEMOSTRACIÓN". H1 "Prueba cómo funciona Lofti". Clases CSS migradas a V9 (`.v9-stepper`, `.v9-card`). Funcionalidad demo intacta. | Wireframe 08_demo_integrada.png. Consistencia visual con sistema V9. |
| `server/index.js` | Añadido middleware de bloqueo para paths sensibles (`/server/*`, `/.env`, `/.git`, `/prisma/*`, `*.db`, `*.sqlite`, backup). `dotfiles: 'deny'` en express.static. | V9 QA: express.static no debe servir código fuente, secretos ni base de datos. |

## Notas

- Navegación idéntica en todas las páginas (fuente única `js/site-nav.js`).
- Calculadora usa `js/pricing.js` como única fuente de verdad aritmética.
- Demo mantiene máquina de estados en `js/demo-state.js` con namespace `LOFTI_DEMO`.
- No se modificó `index_single_page_backup.html`.
- Integración Venti: deshabilitada (adaptador `NOT_CONFIGURED`).
- Firma electrónica real: pendiente de proveedor.
