# Lofti — Plataforma de arriendo digital (Santiago, Chile)

Sitio web multi-pagina estatico para arriendo de viviendas en Santiago.
Conecta arrendatarios y arrendadores con transparencia, contrato digital y pagos gestionados.

## Estructura del proyecto

```
Lofti_proyecto/
├── index.html              Landing principal (hero skyline Santiago)
├── vivienda.html           Explorador de propiedades (lista + mapa Leaflet)
├── como-funciona.html      Paso a paso del proceso (tabs arrendar/publicar)
├── companeros.html         Arrendar juntos (busqueda de roommates)
├── respaldo.html           Verificacion + contrato digital
├── precios.html            Calculadora de costos con desglose
├── demo.html               Demostracion guiada del flujo completo
├── preguntas.html          FAQ accordion
├── styles.css              CSS compartido (tokens, componentes, responsive)
├── js/
│   ├── site-nav.js         Navegacion responsive
│   ├── pricing.js          Logica de calculo de costos
│   ├── pricing-ui.js       UI de calculadora
│   ├── property-explorer.js Explorador de propiedades + mapa
│   ├── arrendar-juntos.js  Encuesta de compatibilidad
│   └── demo-state.js       Estado del stepper de demo
├── img/                    Imagenes del sitio
│   └── lofti-editorial/    Ilustraciones canon
├── server/                 Backend Node + Express + Prisma + SQLite
├── docs/                   Especificaciones tecnicas
├── CONTRATO_MODELO_LOFTI.md   Contrato modelo (23 clausulas, 3 anexos)
├── CONTRATO_MODELO_LOFTI.pdf  Contrato modelo en PDF
├── REPORTE_LEGAL_LOFTI.pdf    Reporte de simulacion legal
├── CHAT_AGENTES_LEGALES.pdf   Transcripcion debate agentes legales
├── CAMBIOS_V19.md             Changelog version 19
└── SIMULACION_DEBATES_LEGALES.md  Debates simulacion MiroFish
```

## Modelo de negocio

- **Cargo Lofti arrendatario:** $10.000 CLP/mes (sumado a renta)
- **Cargo Lofti arrendador:** $10.000 CLP/mes (descontado de renta)
- **Pasarela Venti (separada):** 1,30%+IVA debito / 1,60%+IVA credito (cargo arrendador)
- Lofti **NO** retiene ni custodia garantias

## Stack

- HTML estatico multi-pagina (sin framework frontend)
- CSS custom con tokens (`--brand: #6B1518`, `--match: #AEA432`, `--home: #CEDAFF`, `--surface: #F6F1EA`)
- Fonts: Newsreader (display), Geist (sans/UI), Geist Mono (labels)
- Leaflet + OpenStreetMap para mapa de propiedades
- Backend: Node.js + Express + Prisma + SQLite
- Contrato modelo generado con simulacion MiroFish (12 agentes legales IA)

## Como correr localmente

```bash
# Servidor estatico (solo frontend)
cd Lofti_proyecto
python -m http.server 8080
# Abrir http://localhost:8080

# Backend (requiere Node.js)
cd server
npm install
npx prisma generate
npx prisma db push
node index.js
# API en http://localhost:3000
```

## Marco legal referenciado

- Codigo Civil, Libro IV, Titulo XXVI (Arrendamiento)
- Ley 18.101 (Arriendo predios urbanos)
- Ley 19.799 (Firma electronica)
- Ley 19.628 / 21.719 (Datos personales)
- Ley 19.496 (Proteccion consumidor / SERNAC)
- Ley 20.609 (No discriminacion, Zamudio)

## Advertencia

Este proyecto es un **prototipo/demo**. Los procesos de demostracion no reemplazan
firmas, pagos ni verificaciones reales. El contrato modelo es referencial y debe ser
revisado por un abogado antes de uso en operaciones reales.

## Creditos

- Iconos: Phosphor Icons (MIT)
- Mapa: Leaflet (BSD-2) + OpenStreetMap (ODbL)
- Tipografias: Google Fonts (Newsreader, Geist, Geist Mono)
- Simulacion legal: MiroFish + Groq API (Qwen 3.8-27B)
