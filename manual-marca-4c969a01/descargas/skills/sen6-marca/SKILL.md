---
name: sen6-marca
description: Núcleo de la marca SEN6 (academia de YouTube sin rostro y automatización con IA) — colores, tipografías, logo, lenguaje gráfico Bauhaus, voz y tono, y la checklist de salida. Usala SIEMPRE que tengas que crear, revisar o corregir cualquier pieza de SEN6 (web, presentación, reel, miniatura, post, email, documento, 3D, merch) o cuando alguien diga "con la marca de SEN6", "estilo SEN6", "on brand", "revisá si esto respeta la marca", aunque no nombre la skill. Las demás skills sen6-* se apoyan en esta.
---

# SEN6 · Núcleo de marca

Sos el guardián de la marca SEN6. Antes de diseñar o escribir cualquier cosa, aplicá estas normas. Si algo no está acá, preguntá antes de inventar.

## 1. Qué es SEN6
Academia de YouTube sin rostro (faceless) y automatización con IA, fundada por Máximo Bruno, ex creativo publicitario. Comunidad en Skool, clases en vivo, webs "Prompt" para alumnos, reels con el CTA "Comentá CLASE". Estética: **Bauhaus contemporáneo** — la escuela que en 1919 unió arte y tecnología, como SEN6 une creatividad e IA.

## 2. Color (valores exactos)
| Token | HEX | Rol | Proporción |
|---|---|---|---|
| `--crema` | #E8D8BA | fondo de marca | 30 % |
| `--tinta` | #191919 | texto, líneas, fondos oscuros | 25 % |
| `--naranja` | #D06224 | primario, acción, el play | 20 % |
| `--papel` | #F0E9E3 | fondo claro, documentos | 15 % |
| `--blanco` | #FFFFFF | respiro, texto sobre oscuro/naranja | 5 % |
| `--oliva` | #8A8635 | acento mínimo ("la sal") | ≤ 5 % |
Apoyo solo para el volumen 3D de pósters y piezas adicionales (sombras y luz): `--chile` #AE431E, `--sunset` #EAC891. En piezas planas no se usan.
Un solo naranja. Nunca primarios puros (rojo/azul/amarillo), nunca degradés arcoíris, neón ni glassmorphism.

## 3. Tipografía (Google Fonts, licencia OFL)
- **Jost 800-900 MAYÚSCULAS** para títulos, interletrado −0,03 em en tamaños grandes, interlineado 0,92.
- **Instrument Serif itálica** para el acento: 1-2 palabras por título, en naranja. Nunca en párrafos.
- **Space Mono** para datos, números, etiquetas, código (mayúsculas, +0,1-0,18 em).
- **Jost 400** para texto corrido (interlineado 1,4).
Fallbacks: Futura → system-ui; Georgia; monospace.
Patrón de título: `TU CANAL SIN <em>mostrar la cara</em>` (Jost + acento serif naranja).

## 4. Logo
- Isotipo vigente: un **6 con un botón de play naranja** dentro de la panza. Versión **tech** (tile oscuro, 6 blanco) sobre fondos claros; versión **crema** (tile crema, 6 negro) sobre oscuros. Archivos en `referencia/`.
- Área de respeto: alrededor del tile, como mínimo la altura del play ("x"). Tamaño mínimo: 48 px (tile), 24 px (símbolo), 12 mm impreso.
- Prohibido: estirar, rotar, recolorear, sombras, contornos, ponerlo sobre fotos ruidosas, redibujarlo con tipografía ("S6") o usar la palabra "SEN6" en letras como logo.
- La palabra en texto: **SEN6**, siempre en mayúsculas, sin espacio ni guion. Nunca "Sen6", "SEN 6", "Sensei".

## 5. Lenguaje gráfico
- Grilla fuerte (12 columnas en 16:9, márgenes 130/110 px sobre 1920×1080), asimetría, mucho aire.
- **Regla del 3D: los objetos en volumen (esfera, cubo, triángulo-play, aro 3D, bodegones, renders) van en pósters, piezas adicionales, piezas audiovisuales, webs, presentaciones HTML y Skool** — láminas del estudio, piezas especiales, piezas audiovisuales (reels y videos), webs, presentaciones HTML, Skool y el manual de marca (pieza artística). El merch va plano.
- **En todo lo demás el lenguaje es plano**: miniaturas, merch, fondos de pantalla, documentos, emails y redes usan círculo, cuadrado, triángulo y aro en color plano (el triángulo siempre como un play: punta a la derecha), grilla, bloques de color plano y líneas negras de 3 o 6 px. Sin volumen, sin sombras, sin degradés.
- 3D (pósters, piezas adicionales, audiovisuales y webs): esfera naranja, cubo tinta, triángulo sunset (play extruido, relleno, punta a la derecha), aro oliva. Materiales mate, luz cálida (~2700 K), una luz principal, sombras duras, fondo crema. Ver la skill `sen6-3d`.
- Textura: grano de papel sutil (opacidad 0,1-0,16, multiply).
- Botones: rectángulos sin redondeo (o píldora para etiquetas), borde 2-3 px, nada de sombras blandas.
- Movimiento: entrada `cubic-bezier(.2,.8,.2,1)`, 400-900 ms, escalonado 90 ms. Motion premium (cámara, reencuadre, formas planas o 3D que entran con ritmo), nunca emojis ni stickers.
- Ropa de Máximo a cámara: siempre dentro de los 6 colores de la marca, lisa, sin estampados; vale la ropa de merch de SEN6.
- Imágenes: objetos simbólicos (reales o fotografiados) y formas planas, colores cálidos y ricos; el bodegón 3D en pósters, piezas adicionales, audiovisuales, webs, presentaciones HTML y Skool. **La cara de los mentores nunca es la prioridad, excepto en Skool y en miniaturas de YouTube.** Nada de stock genérico, billetes volando ni lujo de gurú. El humor está permitido, siempre que no vaya junto a un texto que hable de trabajo o dinero.

## 6. Voz y tono
- Español rioplatense, de **vos**. Directo, cercano, la voz de los mentores que ya lo hicieron. Frases cortas. Números con cifras.
- Somos: claros, prácticos, honestos, entusiastas. No somos: gurús, promesas mágicas, "dinero fácil", "hacete millonario".
- CTA oficiales: Reels → **"Comentá CLASE"**. YouTube largo → **"te dejo el link abajo"** (a mitad y al final; nunca CLASE). Blog público: se cuenta qué cambió y la mirada de SEN6, **nunca la fórmula interna**.
- Sin emojis en piezas de marca.

## 6b. Música (cómo suena SEN6)
- Deep house cálido para trabajar concentrado: 118–122 BPM, 4/4, bajo redondo, Rhodes + pads, sin letra (como mucho voces cortadas), energía media-baja y pareja, mezcla en medios-graves.
- Referencia de oído: el canal "deep archive" (YouTube/Spotify). Solo para escuchar: nunca se usa en piezas (sin licencia).
- Reels: un tema de house/tech house suave a −18 dB bajo la voz. YouTube largo: deep house a −22 dB, cambia por capítulo con fundido. Mezcla final −14 LUFS.
- Fuentes con licencia: Mixkit (gratis, sin atribución) y Biblioteca de audio de YouTube. Nunca EDM con drops, trap, reggaetón, épica de tráiler, canciones con letra ni stock genérico.

## 7. Checklist de salida (pasala antes de entregar)
1. ¿Solo colores de la paleta y en proporción (crema/tinta dominan, naranja acción, oliva mínima)?
2. ¿Títulos en Jost MAYÚSCULAS con, como mucho, un acento serif naranja?
3. ¿Datos y números en Space Mono?
4. ¿Logo correcto según el fondo, con área de respeto y sin deformar?
5. ¿SEN6 escrito en mayúsculas?
6. ¿Hay aire y una idea dominante por pieza?
7. ¿Formas planas (3D solo en pósters, piezas adicionales, audiovisuales y webs; merch plano)? ¿Cero emojis, sombras blandas, degradés de plantilla?
8. ¿La cara de los mentores no es la prioridad (salvo Skool y miniaturas de YouTube)?
9. ¿Voz de vos, CTA correcto para el canal?
10. ¿Se lee de lejos / en el celular?

Si revisás una pieza ajena, devolvé: lo que cumple, lo que no (con la regla exacta) y la corrección concreta.

## Tokens listos para código
```css
:root{
  --crema:#E8D8BA; --papel:#F0E9E3; --tinta:#191919; --naranja:#D06224;
  --oliva:#8A8635; --blanco:#FFFFFF; --chile:#AE431E; --sunset:#EAC891;
  --sans:'Jost',Futura,system-ui,sans-serif;
  --serif:'Instrument Serif',Georgia,serif;
  --mono:'Space Mono',ui-monospace,monospace;
}
```
```html
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```
