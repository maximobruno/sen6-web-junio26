---
name: sen6-web
description: Diseña y construye webs y landings de SEN6 (webs "Prompt" para alumnos, páginas de venta, recursos, formularios) con la identidad Bauhaus de la marca, en un HTML autocontenido que se abre con doble clic. Usala cuando pidan "una web", "una landing", "una página", "un sitio" o "una herramienta web" para SEN6, aunque no nombre la skill.
---

# SEN6 · Webs y landings

> Marca: aplicá siempre la skill `sen6-marca` (colores, tipografías, logo, voz y checklist). Si no está instalada, mínimos: crema #E8D8BA, papel #F0E9E3, tinta #191919, naranja #D06224, blanco #FFFFFF, oliva #8A8635 (≤5 %); Jost 800-900 MAYÚSCULAS + Instrument Serif itálica naranja como acento + Space Mono para datos; Bauhaus plano (grilla, círculo/cuadrado/triángulo-play/aro en color plano, bloques, aire; el 3D va en pósters, piezas adicionales, piezas audiovisuales, webs y presentaciones HTML; el merch, plano); sin emojis ni sombras blandas; SEN6 siempre en mayúsculas.

## Estructura base
1. **Hero**: kicker en Space Mono naranja, título gigante en Jost 900 MAYÚSCULAS (clamp 56-160 px) con una palabra en Instrument Serif itálica naranja, bajada de 1-2 líneas, un solo botón principal.
2. **Prueba / qué es**: 3 bloques en grilla con número mono grande (01, 02, 03).
3. **El producto en acción**: video o demo real, en un marco con borde negro de 3 px.
4. **Cómo funciona**: pasos numerados, asimetría, una forma plana por paso.
5. **Testimonios / resultados** (solo reales).
6. **CTA final** sobre bloque naranja o tinta.
7. **Pie**: isotipo SEN6 (versión según fondo), links, © SEN6.

## Reglas
- Un solo archivo HTML con CSS y JS adentro; nada de módulos ES sueltos (tiene que abrir con doble clic). Fuentes desde Google Fonts.
- Fondos crema/papel por defecto; secciones de contraste en tinta o naranja. Oliva solo en detalles.
- Botones rectos, borde 2-3 px, hover = invertir colores. Nada de sombras blandas, glassmorphism ni degradés de plantilla.
- Grano de papel sutil de fondo (SVG feTurbulence, opacidad ~0,12).
- Responsive real: probar a 390 px de ancho (sin scroll horizontal) y a 1440 px.
- Animaciones de entrada con IntersectionObserver: subir 40 px + opacidad, cubic-bezier(.2,.8,.2,1), escalonado 90 ms. Respetar prefers-reduced-motion.
- Si es una web interna o para alumnos: `<meta name="robots" content="noindex">`.
- Formas planas: círculo, cuadrado, triángulo-play y aro en color plano, sin volumen ni sombra. **3D permitido en webs** como pieza destacada (three.js o renders de Blender): esfera, cubo, triángulo-play relleno y aro, mate y con luz cálida. El resto de la UI, plano.
