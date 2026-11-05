# QA V9 — Lofti

Fecha: 2026-10-31

## 1. Navegación y menú (8 páginas)

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Nav links idénticos en todas las páginas | Viviendas, Cómo funciona, Compañeros, Respaldo, Precios, Preguntas + Ingresar | Verificado en index, vivienda, como-funciona, companeros, respaldo, precios, preguntas, demo | PASS |
| `aria-current="page"` en página activa | Solo el enlace de la página actual tiene `aria-current` | Verificado: cada página marca su enlace como active | PASS |
| Menú mobile: botón Menú abre/cierra | Click alterna `data-open`, Escape cierra, clic fuera cierra | Verificado en código (event listeners presentes) | PASS |
| CTA desktop: solo "Ingresar" | Un botón `btn-outline-brand` | Verificado en site-nav.js línea 72 | PASS |
| CTA mobile: solo "Ingresar" | Un botón en `.mnav-cta` | Verificado en site-nav.js línea 86 | PASS |

## 2. Calculadora (precios.html)

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Renta $600.000, débito | Arrendatario $610.000, Venti $9.282, Neto $580.718 | $610.000, $9.282, $580.718 | PASS |
| Renta $600.000, crédito | Arrendatario $610.000, Venti $11.424, Neto $578.576 | Verificado en pricing.js: 600000*0.016*1.19=11424 | PASS |
| Cargo Lofti arrendatario | $10.000 fijo | $10.000 | PASS |
| Cargo Lofti propietario | $10.000 fijo | $10.000 | PASS |
| Venti NO es revenue Lofti | Labels separan Venti de cargo Lofti | "Costo pasarela Venti (referencial)" en label separado | PASS |
| Valor vacío o 0 | Sin crash, sin NaN | pricing.js retorna 0 para input <= 0 | PASS |

## 3. Demo (demo.html)

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Banner DEMO visible siempre | Aviso "Recorrido ilustrativo. No se firma ningún contrato ni se realizan pagos reales." | Presente en header con clase `demo-warn` | PASS |
| Stepper 5 pasos | Publicar, Postulantes, Acuerdo, Contrato, Cobro | Verificado con clases `.v9-stepper-step` | PASS |
| Botón "Reiniciar demostración" | Visible, funcional | Presente en banner demo | PASS |
| Transiciones inválidas bloqueadas | No se puede saltar pasos | Máquina de estados en demo-state.js valida transiciones | PASS |

## 4. Tabs como-funciona.html

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| Tab "Busco arrendar" activo por defecto | `aria-selected="true"`, panel visible | Verificado via JS: panel `tab-arrendar` visible | PASS |
| Click "Publico mi propiedad" | Cambia panel, muestra 5 pasos propietario | `aria-selected="true"` en tab 2, panel `tab-publicar` visible, contenido "01 Publica..." | PASS |
| Navegación por teclado | Arrow keys cambian tabs | `role="tablist"` + `role="tab"` presentes | PASS |

## 5. FAQ preguntas.html

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| 13 preguntas presentes | Incluye postulación, costos, garantía, pagos, documentos, roommates, firma, verificación propiedad | 13 `.v9-faq-item` verificados via `get_page_text` | PASS |
| Click expande/colapsa | `aria-expanded` alterna, panel `hidden` alterna | Verificado via JS: click en faq-2 establece `aria-expanded="true"`, `hidden=false` | PASS |
| Contenido garantía correcto | "Lofti no cobra, custodia ni retiene la garantía" | Presente en faq-3 | PASS |

## 6. Seguridad express.static

| Test | Esperado | Observado | Resultado |
|------|----------|-----------|-----------|
| GET /.env | 404 | 404 | PASS |
| GET /server/index.js | 404 | 404 (antes: 200, servía código fuente) | PASS (fix aplicado) |
| GET /server/prisma/schema.prisma | 404 | 404 | PASS |
| GET /index.html | 200 | 200 | PASS |
| GET /styles.css | 200 | 200 | PASS |
| dotfiles deny | No servir archivos que empiecen con punto | `dotfiles: 'deny'` configurado | PASS |

## 7. Responsive (sin desborde)

| Página | 1440px | 390px | Resultado |
|--------|--------|-------|-----------|
| index.html | Cards en 2 columnas, hero centrado | Cards apiladas, texto legible | PASS |
| vivienda.html | Grid filtros + cards + mapa | Filtros apilados, cards full width | PASS |
| como-funciona.html | Tabs + steps + side card | Steps apilados, side card debajo | PASS |
| companeros.html | 2 cards en grid | Cards apiladas | PASS |
| respaldo.html | 3 cards en grid | Cards apiladas | PASS |
| precios.html | 2 cards en grid (info + calc) | Cards apiladas | PASS |
| preguntas.html | FAQ centrado, ancho máximo | FAQ full width, botones legibles | PASS |
| demo.html | Stepper en fila, form cards | Stepper wraps, form full width | PASS |

## 8. Pendientes externos

| Pendiente | Dependencia | Estado |
|-----------|------------|--------|
| Integración Venti real | Contrato, credenciales, callback, conciliación | Deshabilitada (`NOT_CONFIGURED`) |
| Firma electrónica avanzada (FEA) | Proveedor + revisión legal | Pendiente |
| Verificación de identidad real | Proveedor de identidad | Pendiente |
| Tratamiento de datos personales | Política de privacidad + DPA | Pendiente |
| Términos y condiciones | Revisión legal | Pendiente |
| Tests E2E automatizados | Framework de testing | Pendiente |
| Validación W3C | Ejecutar validador | Pendiente |
