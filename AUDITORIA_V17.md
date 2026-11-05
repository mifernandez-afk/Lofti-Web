# AUDITORÍA V17 — Inventario de afirmaciones

## Tabla de claims

| # | Página | Texto literal | Estado real | Evidencia | Texto nuevo V17 | Riesgo |
|---|--------|--------------|-------------|-----------|-----------------|--------|
| 1 | index.html | "ARRIENDOS MÁS SIMPLES Y SEGUROS" | Planeado | No hay backend de seguridad operativo | Sin cambio (hero aprobado, intocable) | Medio — promesa de seguridad sin evidencia. Mitigado por ser tagline aspiracional |
| 2 | index.html + 5 más | "Antes de abrir el chat, Lofti verifica tu identidad. El dueño también está verificado" | No verificado | KYC simulado sin proveedor real (ClaveÚnica, DICOM) | **"Lofti verificará tu identidad. El dueño también pasará por verificación. Funcionalidad en desarrollo."** | Alto — corregido V17 |
| 3 | index.html + 5 más | "confirmamos tu identidad" (detalle propiedad) | No verificado | Mismo KYC simulado | **"será necesario verificar tu identidad (en desarrollo)"** | Alto — corregido V17 |
| 4 | index.html + 5 más | "con identidad ya verificada" (paso chat demo) | No verificado | Identidad no se verifica realmente | **"una vez que ambas identidades estén verificadas (en desarrollo)"** | Alto — corregido V17 |
| 5 | index.html + 5 más | "Procesando pago con Venti…" / "Pago registrado" | Demo | setTimeout simula pago, no hay API Venti | **"Simulando pago con Venti…" / "Pago simulado. Integración con Venti pendiente."** | Alto — corregido V17 |
| 6 | index.html + 5 más | "Venti procesa y te abona a tu cuenta" (vista propietario) | Planeado | Venti no integrado | Sin cambio — texto solo visible en rama propietario del demo, contexto suficiente | Medio |
| 7 | index.html + 5 más | "Verificado (demo)" (badge KYC) | Demo | Etiquetado como demo explícitamente | Sin cambio | Bajo |
| 8 | index.html + 5 más | "Firma electrónica simple (Ley 19.799) — proveedor pendiente de integración" | Planeado | Texto ya declara pendiente | Sin cambio | Bajo — autodeclarado |
| 9 | index.html + 5 más | "Ambas partes firman con firma simple. Cuando firman las dos, el contrato queda activo" | Planeado | Firma simulada, proveedor pendiente | Sin cambio — demo context claro | Medio |
| 10 | index.html | "capa de confianza que verifica a ambas partes" | Planeado | No operativo | Sin cambio (sección aprobada por usuario) | Medio |
| 11 | index.html | "protege la garantía" | Planeado | Lofti no custodia ni retiene garantía | Sin cambio (hero) — pero ver #16 | Alto — potencialmente engañoso |
| 12 | companeros.html | "Tus respuestas son privadas y solo se usan para encontrar coincidencias" | Planeado | TIPI se procesa client-side, no hay backend de matching real | Sin cambio — afirmación correcta técnicamente (datos no salen del browser) | Bajo |
| 13 | companeros.html | "Cada persona firma su propio contrato individual con el dueño" | Planeado | Firma no implementada | Sin cambio — describe modelo contractual, no estado operativo | Bajo |
| 14 | respaldo.html | "Identidad y autorización con estado verificable" | No verificado | KYC no operativo | Pendiente de revisión textual | Medio |
| 15 | respaldo.html | "Venti procesa los pagos. Lofti no retiene garantías" | Planeado | Venti no integrado; afirmación de no-custodia es correcta | Sin cambio — segunda parte es verdadera | Medio |
| 16 | respaldo.html | "Firma electrónica avanzada aún no está integrada" | No integrado | Texto ya lo declara | Sin cambio | Bajo — autodeclarado |
| 17 | precios.html | "$10.000 CLP/mes" tarifa fija Lofti | Operativo | Definido en código: `tenantFeeClp: 10000, landlordFeeClp: 10000` | Sin cambio | Bajo — es decisión de negocio |
| 18 | precios.html | "Comisión Venti es referencial" | Demo | Tasas hardcodeadas (1.30%/1.60%+IVA), no confirmadas con Venti | Sin cambio — ya dice "referencial" | Bajo |
| 19 | precios.html | "Lofti no cobra ni retiene comisión Venti" | Operativo | Correcto por diseño de negocio | Sin cambio | Bajo |
| 20 | preguntas.html | "Lofti no procesa pagos directamente ni retiene fondos" | Operativo | Correcto — diseño de negocio | Sin cambio | Bajo |
| 21 | preguntas.html | "La firma electrónica avanzada aún no está integrada en Lofti" | No integrado | Autodeclarado | Sin cambio | Bajo |
| 22 | preguntas.html | Verificación de propiedad "no está implementado" | No implementado | Autodeclarado | Sin cambio | Bajo |
| 23 | preguntas.html | Ley 19.628 / Ley 21.719 referencias | Legal | BCN links verificados, distinción vigente/futura correcta | Sin cambio | Bajo |
| 24 | preguntas.html | Ley 19.799 / Ley 18.101 / CC 1545-1546 | Legal | Referencias normativas correctas | Sin cambio — requiere validación jurídica final | Bajo |
| 25 | demo.html | "No se firma ningún contrato ni se realizan pagos reales" | Disclaimer | Correcto | Sin cambio | Bajo |
| 26 | demo.html | "SIN VALIDEZ DE FIRMA" | Disclaimer | Correcto | Sin cambio | Bajo |
| 27 | demo.html | "No acredita transferencia ni pago real" | Disclaimer | Correcto | Sin cambio | Bajo |
| 28 | js/property-explorer.js | 8 propiedades fallback ficticias | Demo | Sin etiqueta visible pre-V17 | **V17: `demo: true` flag + banner "Datos de demostración" + badges "Demo"** | Alto — corregido V17 |
| 29 | js/pricing-ui.js | Resultados stale con input inválido | Bug | Catch no limpiaba resultados en mode no-commit | **V17: Resultados se limpian siempre con input inválido** | Medio — corregido V17 |

## Resumen de estados

| Estado | Cantidad | Acción V17 |
|--------|----------|------------|
| **Corregido V17** | 7 | Texto cambiado a futuro/condicional o demo explícito |
| **Operativo** | 4 | Afirmaciones correctas sobre modelo de negocio |
| **Autodeclarado** | 5 | Ya dicen "pendiente" o "no implementado" |
| **Planeado (sin cambio hero)** | 8 | Requieren integración futura; hero intocable |
| **Demo disclaimer** | 3 | demo.html correctamente disclaimer |
| **Legal** | 2 | Referencias normativas correctas, requieren validación jurídica final |

## Pendientes que no pueden verificarse sin backend/proveedor

1. **KYC real** — requiere integración con ClaveÚnica o proveedor acreditado de identidad
2. **Firma electrónica** — requiere contrato con proveedor (simple o avanzada, Ley 19.799)
3. **Venti** — requiere configuración de API keys, sandbox y production
4. **DICOM / antecedentes** — requiere API de consulta comercial
5. **Verificación de propiedad** (CBR) — no implementado, declarado así

## Comando para ejecutar tests

```bash
node --test js/pricing.test.js
```

14/14 PASS (2026-11-02).

## Matriz e2e por página

| Prueba | index | vivienda | como-func | compañeros | respaldo | precios | preguntas | demo |
|--------|-------|----------|-----------|------------|----------|---------|-----------|------|
| Carga sin error JS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Sin overflow horizontal | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Hero intacto | PASS | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| Ilustraciones V16 | n/a | n/a | PASS | PASS | PASS | n/a | n/a | n/a |
| Calculadora módulo ESM | n/a | n/a | n/a | n/a | n/a | PASS | n/a | n/a |
| Calculadora $600k débito | n/a | n/a | n/a | n/a | n/a | PASS | n/a | n/a |
| Calculadora $600k crédito | n/a | n/a | n/a | n/a | n/a | PASS | n/a | n/a |
| Stale results fix | n/a | n/a | n/a | n/a | n/a | PASS | n/a | n/a |
| Demo pago texto "simulado" | PASS | PASS | PASS | n/a | PASS | PASS | PASS | n/a |
| Verificación futuro/condicional | PASS | PASS | PASS | n/a | PASS | PASS | PASS | n/a |
| Demo disclaimer (demo.html) | n/a | n/a | n/a | n/a | n/a | n/a | n/a | PASS |
| Explorer API data | n/a | PASS | n/a | n/a | n/a | n/a | n/a | n/a |
| Explorer demo labeling (sin API) | n/a | code-ok | n/a | n/a | n/a | n/a | n/a | n/a |
| Tabs V15 (compañeros) | n/a | n/a | n/a | PASS | n/a | n/a | n/a | n/a |
| CTA wiring (compañeros) | n/a | n/a | n/a | PASS | n/a | n/a | n/a | n/a |
| FAQ accordion | n/a | n/a | n/a | n/a | n/a | n/a | PASS | n/a |
| `node --test js/pricing.test.js` | PASS 14/14 | — | — | — | — | — | — | — |
| Lista/Mapa sync | n/a | NO EJEC. | n/a | n/a | n/a | n/a | n/a | n/a |
| Filtros explorer | n/a | NO EJEC. | n/a | n/a | n/a | n/a | n/a | n/a |
| Responsive 375px | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. |
| Responsive 768px | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. |
| Responsive 1440px | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. |
| Contraste AA | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. | NO EJEC. |
| Playwright/Cypress e2e | NO EJEC. (no configurado) | — | — | — | — | — | — | — |

### Leyenda
- **PASS**: verificado en browser pane o test runner
- **code-ok**: lógica verificada en código, no ejecutado en browser (API activa impide fallback)
- **NO EJEC.**: no ejecutado (sin Playwright/Cypress, sin resize programático confiable, o browser pane con limitaciones de screenshot)
- **n/a**: no aplica a esa página
