# QA — V6.1 Navegación Unificada

## Cambios realizados

| Archivo | Cambio |
|---------|--------|
| `js/site-nav.js` | Nuevo. Fuente única de verdad para nav desktop y móvil. Inyecta `<header class="nav">` en `#site-header`. |
| `index.html` | Header HTML reemplazado por `<div id="site-header"></div>` + `<script>`. Menu JS inline removido. |
| `vivienda.html` | Idem. |
| `como-funciona.html` | Idem. |
| `companeros.html` | Idem. |
| `respaldo.html` | Idem. |
| `precios.html` | Idem. |
| `preguntas.html` | Idem. |
| `styles.css` | Tokens `--nav-height`, `--nav-max-width`, `--nav-gap` agregados a `:root`. |

## Eliminaciones

- Link redundante "Crea tu cuenta" dentro de `.nav-links` (existía en 6 de 7 páginas, duplicaba CTA de `.nav-cta`).
- JS inline de menú móvil (13 líneas por página × 7 páginas = 91 líneas eliminadas).
- Atributos `aria-current="page"` hardcodeados (ahora dinámicos vía JS).

## Matriz de verificación

| Página | Desktop nav | Mobile menu | aria-current | Links correctos | Sin overflow |
|--------|:-----------:|:-----------:|:------------:|:---------------:|:------------:|
| index.html | OK | OK | ninguno (home) | OK | OK |
| vivienda.html | OK | OK | "Vivienda" | OK | OK |
| como-funciona.html | OK | OK | "Cómo funciona" | OK | OK |
| companeros.html | OK | OK | "Compañeros" | OK | OK |
| respaldo.html | OK | OK | "Respaldo" | OK | OK |
| precios.html | OK | OK | "Precios" | OK | OK |
| preguntas.html | OK | OK | "Preguntas" | OK | OK |

## Accesibilidad

- `<nav aria-label="Principal">` presente.
- `<button id="menu" aria-expanded="false/true" aria-controls="mnav">` correcto.
- `aria-current="page"` dinámico según URL.
- Escape cierra menú y devuelve foco al botón.
- Click fuera cierra menú.
- Media query `(min-width: 1101px)` auto-cierra menú al volver a desktop.

## Breakpoints verificados

| Ancho | Resultado |
|-------|-----------|
| 375px | Menu btn visible, nav-links ocultos, menú panel funcional |
| 1280px | Nav-links visibles, menu btn oculto |

## Estructura del menú (idéntica en las 7 páginas)

**Desktop:** Logo | Vivienda | Cómo funciona | Compañeros | Respaldo | Precios | Preguntas | [Ingresar] [Crear cuenta]

**Mobile:** Inicio, Grupo 1 (Ver propiedades, Qué estás buscando, Para dueños), Grupo 2 (Qué es Lofti, Paso a paso), Grupo 3 (Compatibilidad, Buscar con amigos), Grupo 4 (Contrato, Garantía, Pagos, Seguridad, Precios, Preguntas), [Ingresar] [Crear cuenta]

## Pendientes

- Verificar en viewport 520px, 700px, 860px (requiere servidor real).
- Test E2E automatizado de navegación cruzada.
