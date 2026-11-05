# AUDITORIA V5 - Lofti Proyecto

**Fecha:** 2026-10-31
**Alcance:** Todos los `.html` (excepto `index_single_page_backup.html`) y `server/*.js`
**Severidades:** P0 = bloquea produccion, P1 = bloquea piloto, P2 = mejora

---

## P0 - Bloquean produccion

| # | Archivo:linea | Hallazgo | Descripcion | Correccion propuesta |
|---|---------------|----------|-------------|----------------------|
| 1 | `server/index.js:20` | Session secret fallback `lofti-dev-secret` | El secreto de sesion usa un fallback hardcodeado `'lofti-dev-secret'` cuando `SESSION_SECRET` no esta en env. En produccion cualquiera puede forjar cookies de sesion. | Eliminar el fallback. Si `SESSION_SECRET` no existe, lanzar error y no iniciar el servidor. |
| 2 | `server/index.js:25` | `secure: false` en cookie | La cookie de sesion tiene `secure: false`, lo que permite enviarla por HTTP sin cifrar. En produccion esto expone el session ID a ataques MITM. | Usar `secure: process.env.NODE_ENV === 'production'` o `secure: true` detras de HTTPS. |
| 3 | `server/index.js:14-17` | CORS permisivo con credenciales | CORS acepta origenes localhost con `credentials: true`. En produccion debe limitar origenes al dominio real. Ademas, si se deja `*` o localhost en prod, cualquier sitio puede hacer peticiones autenticadas. | Cargar origenes desde variable de entorno. En produccion solo permitir el dominio de Lofti. |
| 4 | `server/index.js` (ausencia) | CSRF no implementado | No hay middleware CSRF (`csurf` o equivalente) en ningun lugar del servidor. Cualquier sitio externo puede enviar POST a `/api/auth/register`, `/api/auth/login` o `/api/properties` con las cookies del usuario. | Agregar middleware CSRF (ej. `csrf-csrf` o `csurf`) a todas las rutas que mutan estado. |
| 5 | `server/index.js:19-29` | MemoryStore por defecto | `express-session` sin store explicito usa `MemoryStore`. En produccion: fuga de memoria progresiva, sesiones se pierden al reiniciar, no escala a mas de un proceso. | Usar `connect-pg-simple`, `connect-redis` u otro store persistente. |
| 6 | `server/routes/auth.js` (ausencia) | Sin rate limiting en auth | Las rutas `/api/auth/login` y `/api/auth/register` no tienen rate limiting. Permite ataques de fuerza bruta y creacion masiva de cuentas. | Agregar `express-rate-limit` con limites estrictos (ej. 5 intentos/min por IP en login, 3 registros/hora por IP). |
| 7 | `server/routes/auth.js:41` | `verified` retornado sin verificacion real | El endpoint `/register` retorna `verified: user.verified` en la respuesta. El campo `verified` viene de la DB sin que exista ningun flujo de verificacion real (email, telefono, KYC). El usuario podria asumir que esta verificado. | Implementar flujo de verificacion de email. No retornar `verified: true` hasta que se complete. |
| 8 | `server/routes/properties.js` (ausencia) | Sin validacion de uploads (MIME/size) | No existe ningun endpoint de upload de imagenes, pero el modelo tiene campo `photos`. Si se agrega upload sin validacion de MIME type y tamano maximo, permite subir archivos maliciosos. | Antes del piloto, implementar upload con validacion de MIME (solo image/*), tamano max (ej. 5MB), y almacenamiento seguro (S3 con signed URLs). |

---

## P1 - Bloquean piloto

| # | Archivo:linea | Hallazgo | Descripcion | Correccion propuesta |
|---|---------------|----------|-------------|----------------------|
| 9 | `index.html:428`, `preguntas.html:343`, `respaldo.html:568`, `como-funciona.html:469`, `companeros.html:488`, `vivienda.html:331` | Calculadora usa `n * .05` (5%) en vez de tarifa fija | Multiples paginas tienen la calculadora con `o.textContent = fmt(n * .05)` que calcula un 5% de la renta. Esto contradice el modelo de negocio actual de tarifa fija $10.000/mes. Solo `precios.html` tiene la calculadora correcta con tarifa fija. | Reemplazar `fmt(n * .05)` por `fmt(10000)` en todas las paginas excepto `precios.html` (que ya esta bien). Alternativa: centralizar la logica de calculadora en un solo archivo JS compartido. |
| 10 | `index.html:56-57` | `Ingresar` y `Crear cuenta` apuntan al mismo destino | Tanto el boton "Ingresar" como "Crear cuenta" del nav apuntan a `preguntas.html#registro`. No hay forma de distinguir si el usuario quiere iniciar sesion o crear cuenta nueva. Mismo problema en todas las paginas (nav compartido). | Separar las rutas: "Ingresar" deberia abrir el formulario de login directamente, "Crear cuenta" el de registro. Idealmente paginas o modales separados. |
| 11 | `index.html:1001-1002`, `vivienda.html:905-906`, `como-funciona.html:1042-1043`, `companeros.html:1061-1062`, `preguntas.html:916-917` | Venti con setTimeout simulado como pago exitoso | El boton "Pagar con Venti" usa `setTimeout` de 1200ms y luego muestra mensaje de exito sin integracion real. El mensaje dice "Pago registrado" lo cual es engaganoso. | El texto del demo debe decir claramente "Simulacion - integracion pendiente" (ya lo dice parcialmente, pero el estado "Pago registrado" es confuso). Asegurar que ningun usuario real pueda confundir esto con un pago procesado. |
| 12 | `index.html:787`, `precios.html:698`, `preguntas.html:702`, `respaldo.html` (script KYC), `vivienda.html`, `como-funciona.html`, `companeros.html` | setTimeout en flujo de verificacion KYC | `setTimeout(function(){ i++; renderStep(); }, 900)` simula verificacion de identidad con un timer de 900ms. La verificacion se muestra como completada sin ningun check real. | Acceptable como demo, pero debe estar claramente marcado. Agregar banner visible "Demostracion - verificacion simulada" (ya existe `kyc-demo` span, verificar que sea visible). |
| 13 | `index.html:791-792` | Badge "Verificado" sin verificacion real | El modal KYC muestra "Verificado" con checkmark y texto "Identidad confirmada, sin anotaciones y perfil precalificado" despues de una simulacion de 900ms x 3 pasos. No hay verificacion real detras. | En la demo, agregar "(simulado)" al badge. En produccion, este badge solo debe aparecer cuando la verificacion real (KYC provider) confirme. |
| 14 | `server/routes/auth.js:11` | El cliente elige su propio rol | El registro acepta `role` directamente del `req.body`. Un usuario puede registrarse como "dueno" sin validacion, lo que le da acceso a crear/editar/eliminar propiedades. | Considerar que el rol inicial sea siempre basico y que se eleve a "dueno" solo despues de verificacion documental. O al menos, validar que los duenos completen verificacion antes de publicar. |
| 15 | `index.html:669`, `precios.html:580`, `preguntas.html:584`, `vivienda.html`, `como-funciona.html`, `companeros.html` | `Total con Lofti: fmt(d.precio+10000)` correcto | Las cards de propiedad muestran `fmt(d.precio+10000)` que es la tarifa fija de $10.000. Esto es correcto. | OK - Uso correcto del modelo de tarifa fija $10.000 en las cards. Sin accion requerida. |
| 16 | `index.html:998`, `precios.html:136`, `respaldo.html:230` | `$10.000` / `10000` como cargo Lofti | Multiples referencias a "$10.000" o `10000` como cargo fijo de Lofti. Todas consistentes con el modelo actual de tarifa fija. | OK - Uso correcto. Verificar que no haya mezcla con el 5% del punto #9. |
| 17 | `respaldo.html:99` | Garantia: "no recibe ni custodia esos fondos" | FAQ de preguntas.html:99 y respaldo.html:250 dicen claramente "Lofti permite documentar lo pactado, pero no recibe ni custodia esos fondos." Esto es correcto y consistente. | OK - El texto actual es claro. No se usa lenguaje enganoso sobre retencion de garantia. |

---

## P2 - Mejoras

| # | Archivo:linea | Hallazgo | Descripcion | Correccion propuesta |
|---|---------------|----------|-------------|----------------------|
| 18 | `index.html:807-821`, `precios.html:714-732`, `preguntas.html:717-733`, `respaldo.html` (pay script) | `pay-btn` simulacion de pago con setInterval | El boton "Simular pago" usa `setInterval` de 700ms para animar nodos y luego muestra "Pago acreditado". Es solo animacion UI pero el texto podria confundir. | Cambiar "Pago acreditado" por "Pago acreditado (simulacion)" en el demo. |
| 19 | `precios.html:132-133` | Comision Venti referencial | La calculadora muestra "Comision Venti (dueno)" con valores referenciales. El texto aclara que es referencial. | Agregar tooltips o notas mas visibles de que estos valores deben confirmarse con Venti antes del piloto. |
| 20 | `index.html:45`, `precios.html:45`, `respaldo.html:45`, etc. (todas las paginas) | Links internos usan `*.html` | Todos los links internos usan formato `archivo.html` (ej. `vivienda.html`, `como-funciona.html`). Esto funciona con archivos estaticos pero no es ideal para SPA o SSR futuro. | Acceptable para sitio estatico actual. Migrar a rutas limpias cuando se implemente routing del lado del servidor. |
| 21 | `server/index.js:31-33` | `express.static` sirve todo el directorio padre | El servidor sirve archivos estaticos desde `join(__dirname, '..')` que es la raiz del proyecto. Esto expone potencialmente archivos sensibles como `.env`, `package.json`, etc. | Crear un directorio `public/` dedicado y servir solo desde ahi. Mover los HTML y assets a `public/`. |
| 22 | `server/routes/properties.js:34` | `JSON.parse(p.photos)` sin try/catch | Si el campo `photos` en la DB tiene JSON invalido, el servidor crashea con un error no manejado. | Envolver `JSON.parse` en try/catch con fallback a array vacio `[]`. |
| 23 | `index.html:53`, `precios.html:53`, `preguntas.html` (nav), `respaldo.html:53`, etc. | "Crea tu cuenta" en nav-links duplica CTA | El nav tiene "Crea tu cuenta" como link regular Y como boton CTA "Crear cuenta". Duplicacion visual. | Eliminar el link "Crea tu cuenta" del `nav-links` ya que el boton CTA cumple esa funcion. |
| 24 | `server/routes/properties.js:96-127` | PUT permite update parcial sin sanitizacion | El endpoint PUT permite actualizar propiedades con campos opcionales pero no sanitiza los valores. Por ejemplo, `available` se acepta directamente del body sin validar que sea boolean. | Agregar validacion de tipos con Zod o Joi. Sanitizar todos los campos de entrada. |
| 25 | `index.html:1014-1018` | Doble tag `</body>` | El archivo tiene dos tags `</body>` (lineas 1014 y 1017). Markup invalido. | Eliminar el `</body>` duplicado. |
| 26 | `preguntas.html:151-157` | Doble tag `</main>` | Hay dos `</main>` (lineas 151 y 157). Markup invalido que puede causar problemas de accesibilidad. | Eliminar el `</main>` duplicado en linea 157. |
| 27 | Todas las paginas HTML | Scripts inline duplicados | Cada pagina HTML repite el mismo bloque de JS (WebGL hero, menu movil, calculadora, auth, explorador de propiedades, modales KYC, modales proceso). Miles de lineas duplicadas. | Extraer todo el JS compartido a archivos externos (`main.js`, `explorer.js`, `auth.js`, `kyc.js`, `proceso.js`). Reduce mantenimiento y riesgo de inconsistencias (como el bug del 5% vs tarifa fija). |
| 28 | `server/routes/auth.js:75` | `verified: user.verified` en /login y /me | Los endpoints retornan el campo `verified` que el frontend podria usar como badge de confianza sin que haya flujo real de verificacion. | Implementar verificacion de email como minimo. No mostrar badge "verificado" en UI hasta que se complete un flujo real. |
| 29 | `server/index.js:14-17` | CORS origins hardcodeados | Los origenes CORS estan hardcodeados como `localhost:8081`, `localhost:3000`, `127.0.0.1:8081`. | Mover a variable de entorno `CORS_ORIGINS` con fallback a localhost solo en development. |
| 30 | Todas las paginas | CSP con `'unsafe-inline'` para scripts | La Content-Security-Policy incluye `script-src 'self' 'unsafe-inline'`. Esto debilita significativamente la proteccion contra XSS. | Migrar scripts inline a archivos externos y usar nonces o hashes en la CSP. Eliminar `'unsafe-inline'` de `script-src`. |

---

## Resumen de patrones buscados

| Patron | Resultado |
|--------|-----------|
| `5%` como fee (no CSS/stats) | ENCONTRADO en 6 paginas: calculadoras con `n * .05` (deberia ser tarifa fija $10.000). Bug activo. |
| `garantia` + `retiene/custodia` | OK - El texto actual dice explicitamente que Lofti NO retiene ni custodia fondos de garantia. |
| `app.html` links | NO encontrado en paginas activas. Solo en `index_single_page_backup.html` (excluido del audit). |
| `setTimeout` para pago/verificacion | ENCONTRADO en todas las paginas: KYC (900ms), pago Venti (1200ms), payment sim (700ms setInterval). Todos son demos. |
| `Venti` con exito simulado | ENCONTRADO en todas las paginas. Mensaje dice "Integracion pendiente" pero estado dice "Pago registrado". |
| `verified`/`verificado` sin check real | ENCONTRADO en `server/routes/auth.js:41,75` y KYC modal en todas las paginas. No hay verificacion real implementada. |
| `lofti-dev-secret` | ENCONTRADO en `server/index.js:20`. Fallback inseguro del session secret. |
| `secure: false` | ENCONTRADO en `server/index.js:25`. Cookie no marcada como secure. |
| `cors` permisivo | ENCONTRADO en `server/index.js:14-17`. Origins hardcodeados a localhost con credentials. |
| `csrf` ausente | CONFIRMADO. No hay middleware CSRF en el servidor. |
| `MemoryStore` | CONFIRMADO. No hay session store configurado, usa MemoryStore por defecto. |
| `req.body.ownerId` trust | NO encontrado. `ownerId` se toma de `req.session.userId` (correcto). |
| `req.body.paid` trust | NO encontrado. No hay campo `paid` en el codigo. |
| `httpOnly` en cookies | OK - `httpOnly: true` esta configurado en `server/index.js:24`. |
| `p-pay` simulacion | ENCONTRADO en todas las paginas con scripts de proceso. Boton "Pagar con Venti" con setTimeout. |
| `10.000` / `10000` | ENCONTRADO y correcto como tarifa fija Lofti en cards, proceso, y precios. |
| `"PAID"` / `paid` client-side | NO encontrado como status seteado client-side. Los pagos son solo simulaciones UI. |
| Rate limiting en auth | AUSENTE. No hay rate limiting en ninguna ruta. |
| Upload validation | AUSENTE. No hay endpoints de upload implementados. Necesario antes de que se agreguen. |
| `preguntas.html#registro` para ambos flujos | CONFIRMADO. Tanto "Ingresar" como "Crear cuenta" apuntan a `preguntas.html#registro` en TODAS las paginas. |

---

## Correcciones aplicadas en esta sesion

| # | Hallazgo | Estado | Detalle |
|---|----------|--------|---------|
| 1 | Session secret fallback | **CORREGIDO** | `server/index.js`: falla con `process.exit(1)` si `SESSION_SECRET` no existe en produccion. Fallback solo en dev. |
| 2 | `secure: false` en cookie | **CORREGIDO** | `server/index.js`: `secure: IS_PROD` (true en produccion, false en dev). |
| 3 | CORS permisivo | **CORREGIDO** | `server/index.js`: origenes cargados desde `CORS_ORIGINS` env var con fallback localhost en dev. |
| 6 | Rate limiting auth | **CORREGIDO** | `server/index.js`: `express-rate-limit` en `/api/auth/login` y `/api/auth/register` (20 req/15min). |
| 9 | Calculadora 5% | **CORREGIDO** | 6 paginas: `fmt(n * .05)` reemplazado por `fmt(10000)`. `precios.html`: calculadora con debito/credito y desglose Venti. |
| 10 | Ingresar = Crear cuenta | **CORREGIDO** | 7 paginas: "Ingresar" apunta a `#ingresar`, "Crear cuenta" a `#registro`. `preguntas.html` detecta hash para modo login. |
| 29 | CORS hardcoded | **CORREGIDO** | Integrado con correccion #3. |
| - | Email validation | **CORREGIDO** | `server/routes/auth.js`: regex validation en registro. |
| - | Session regeneration | **CORREGIDO** | `server/routes/auth.js`: `req.session.regenerate()` en login contra session fixation. |
| - | JSON body limit | **CORREGIDO** | `server/index.js`: `express.json({ limit: '1mb' })` previene payload overflow. |
| - | js/pricing.js | **CREADO** | Modulo ES con `quoteMonthly()`, 8 tests unitarios pasando. Control: debito 600K = venti $9.282, neto $580.718. |

## Pendientes prioritarios

| # | Hallazgo | Prioridad | Bloqueo |
|---|----------|-----------|---------|
| 4 | CSRF middleware | P0 | Requiere `csrf-csrf` o equivalente. Parcialmente mitigado por `sameSite: 'lax'`. |
| 5 | MemoryStore | P0 | Necesita `connect-sqlite3` o Redis para produccion. OK para desarrollo. |
| 7 | `verified` sin verificacion real | P0 | Necesita flujo de verificacion email. No mostrar badge hasta check real. |
| 8 | Upload validation | P0 | Necesario antes de agregar endpoint de upload. Multer ya instalado. |
| 21 | express.static desde raiz | P2 | Mover a directorio `public/` dedicado. |
| 22 | JSON.parse sin try/catch | P2 | Envolver photos parsing. |
| 25-26 | Tags HTML duplicados | P2 | Limpiar markup. |
| 27 | Scripts inline duplicados | P2 | Extraer a archivos JS compartidos (mayor refactor). |
| 30 | CSP unsafe-inline | P2 | Requiere extraer scripts inline primero (#27). |

## Hallazgos positivos

- `httpOnly: true` esta presente en la cookie de sesion.
- `sameSite: 'lax'` esta configurado (proteccion parcial contra CSRF).
- Las contrasenas se hashean con bcrypt (SALT_ROUNDS = 10).
- `ownerId` en propiedades se toma de la sesion, no del body del request.
- La propiedad se verifica contra `req.session.userId` antes de update/delete.
- Existe Content-Security-Policy en todas las paginas HTML.
- El texto de garantia es claro: Lofti no custodia fondos.
- Los demos tienen labels "Demostracion" y "Ejemplo" visibles.
- Input sanitization basica con `_esc()` para XSS en HTML generado dinamicamente.
- Las validaciones del lado del servidor existen para campos obligatorios en registro y propiedades.
- Session regeneration on login (contra session fixation).
- Rate limiting en rutas de autenticacion.
- Email validation en registro.
