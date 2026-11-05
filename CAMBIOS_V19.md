# CAMBIOS V19 — Lofti

## 1. CSS (`styles.css`)

| Cambio | Selector | Antes | Después |
|---|---|---|---|
| Action radius token | `:root` | — | `--action-radius: 12px; --action-height: 44px` |
| Button radius | `.btn` | `border-radius: 999px` | `border-radius: var(--action-radius)` |
| Menu button radius | `.menu-btn` | `border-radius: 999px` | `border-radius: var(--action-radius)` |
| Button hierarchy | — | No existía | `.btn-primary`, `.btn-secondary`, `.btn-tertiary` con `12px` radius y `44px` min-height |
| Reduced motion | — | No existía | `@media (prefers-reduced-motion: reduce)` para botones |
| Editorial grid | — | No existía | `.lofti-editorial` (58/42 grid, responsive a 1 columna bajo 760px) |
| CTA grid | — | No existía | `.lofti-cta` (lateral image + copy, responsive a 1 columna bajo 760px) |
| Hero alignment | `.aj-hero` | `text-align: center` | Sin centrado (alineado a izquierda en grid) |

## 2. `companeros.html`

| Bloque | Antes | Después |
|---|---|---|
| Hero layout | Centrado, texto + path cards apilados | `.lofti-editorial` grid: copy (izq) + `colaboracion_tablet.png` (der) |
| Hero subtítulo | "No necesitan…" genérico | "No necesitan pensar igual para vivir bien. Lofti te ayuda a explorar hábitos, expectativas y temas…" |
| Path A descripción | Genérica | "Responde algunas preguntas sobre tu forma de vivir y explora conexiones que tengan sentido para ti." |
| Path B descripción | Genérica | "Invita a esa persona y organicen juntos la búsqueda y postulación." |
| Escenarios título | Original | "Parecidos no siempre significa compatibles" |
| Dimensiones | Originales | Horarios, Limpieza y orden, Acuerdos del hogar, Visitas y espacio personal |
| CTA | `.v15-cta` centrado | `.lofti-cta` grid con `mudanza_en_armonia.png` lateral |
| CTA título | Original | "¿Listos para buscar hogar?" |
| CTA texto | Original | "Encuentra alguien con quien arrendar o invita a la persona con quien ya quieres hacerlo." |
| CTA botones | Con `btn-lg` | Sin `btn-lg` |

## 3. `como-funciona.html`

| Bloque | Antes | Después |
|---|---|---|
| H1 | "Arrendar puede ser más simple." | "Así funciona un arriendo con Lofti" |
| Lead | "Dos recorridos claros…" | "Conoce los pasos para buscar o publicar una vivienda…" |
| Tab labels | "Busco arrendar" / "Publico mi propiedad" | "Quiero arrendar" / "Quiero publicar" |
| Step names (arrendatario) | Originales | Busca una vivienda, Presenta tu postulación, Revisa las condiciones, Conoce el contrato, Coordina el pago |
| Step names (propietario) | Originales | Publica tu propiedad, Revisa postulaciones, Acuerda las condiciones, Prepara el contrato, Coordina el cobro |
| Sidebar demo card | "Prueba el recorrido" | "Probar el recorrido" con nota V19 |
| Illustration captions | Genéricas | "Revisa las condiciones antes de firmar." / "Al final del proceso, coordinas la entrega." |

## 4. `respaldo.html`

| Bloque | Antes | Después |
|---|---|---|
| Lead | "Documentación clara, verificación y condiciones de pago transparentes." | "Antes de arrendar, es importante saber con quién estás tratando, qué se acordó y dónde quedan los documentos." |
| Layout | Cards + illustration flotante con HTML roto (`</section>` huérfano) | `.lofti-editorial` grid: cards (izq) + `contrato_digital_en_casa.png` (der) |
| Card Verificación | "Identidad y autorización con estado verificable." | "Conoce qué antecedentes se solicitan y con qué finalidad. Cada persona decide qué autoriza compartir." |
| Card Contrato | "Borradores, versiones y aceptación por partes." | "Revisa las condiciones acordadas y conserva una copia. Los requisitos y la forma de firma dependen del documento y de las normas aplicables." |
| Card Pagos | "Venti procesa los pagos. Lofti no retiene garantías." | "Cuando el servicio esté habilitado, el medio de pago se identificará antes de confirmar la operación. Lofti no retiene garantías." |
| HTML roto | `</section>` huérfano línea 79, `</body>` duplicado | Corregido |
| Disclaimer | No existía | "Los procesos que aparecen como demostración no reemplazan firmas, pagos ni verificaciones reales." |

## 5. `js/site-nav.js`

| Antes | Después |
|---|---|
| 4 grupos numerados: "1 · Encontrar vivienda", "2 · Cómo funciona", "3 · Arrendar juntos", "4 · Respaldo y precios" | 3 grupos semánticos: "Explorar", "Cómo funciona", "Ayuda y confianza" |

## 6. Copy updates (otras páginas)

| Página | Campo | Antes | Después |
|---|---|---|---|
| `index.html` | Card Buscar | "Explora viviendas por comuna, precio y tipo." | "Explora departamentos, casas y piezas según tu presupuesto y la comuna donde quieres vivir." |
| `index.html` | Card Juntos | "Encuentra una persona compatible o arrienda con alguien que ya conoces." | "Busca con quién compartir un hogar o organiza la búsqueda con alguien que ya conoces." |
| `index.html` | Card Publicar | "Publica tu departamento, casa o pieza y recibe postulaciones." | "Muestra tu propiedad y organiza las postulaciones en un mismo lugar." |
| `index.html` | CTA Juntos | "Buscar compañeros" | "Arrendar juntos" |
| `vivienda.html` | Lead | "Resultados claros, filtros que funcionan y precio total visible." | "Busca por comuna, tipo de vivienda y presupuesto. Cambia entre lista y mapa cuando quieras." |
| `precios.html` | Lead | "Cambia el valor del arriendo y mira cómo varían todos los montos." | "Consulta el cargo de Lofti y cómo se calcula el monto para cada parte. Cambia el valor del arriendo para ver el desglose." |
| `preguntas.html` | Lead | "Respuestas directas sobre requisitos, contratos, pagos y garantías." | "Encuentra respuestas sobre búsquedas, contratos, pagos y convivencia. Si necesitas más detalle, abre cada pregunta." |

## 7. Imágenes V19

| Imagen | Página | Ubicación | Estado |
|---|---|---|---|
| `colaboracion_tablet.png` | `companeros.html` | Hero editorial grid | Integrada |
| `mudanza_en_armonia.png` | `companeros.html` | CTA `.lofti-cta` grid | Integrada |
| `contrato_digital_en_casa.png` | `respaldo.html` | Editorial grid junto a cards | Integrada |
| `contrato_digital_en_casa.png` | `como-funciona.html` | Sidebar panel visual | Mantenida |
| `entrega_de_llaves.png` | `como-funciona.html` | Sidebar paso final | Mantenida |
| `mujer_con_maleta_y_celular.png` | `vivienda.html` | Estado vacío | Opcional, no colocada |
