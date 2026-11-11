---
name: sen6-presentacion
description: Arma presentaciones de SEN6 en HTML 16:9 (clases, pitch a socios o sponsors, workshops, reportes) con el motor de diapositivas propio — cada diapo un póster Bauhaus, texturas Bauhaus animadas de fondo, transición de figuras entre secciones, notas del presentador y control remoto. Usala cuando pidan "una presentación", "slides", "diapositivas", "una clase", "un pitch", "un deck" para SEN6, aunque no nombre la skill.
---

# SEN6 · Presentaciones

> Marca: aplicá siempre la skill `sen6-marca` (colores, tipografías, logo, voz y checklist). Si no está instalada, mínimos: crema #E8D8BA, papel #F0E9E3, tinta #191919, naranja #D06224, blanco #FFFFFF, oliva #8A8635 (≤5 %); Jost 800-900 MAYÚSCULAS + Instrument Serif itálica naranja como acento + Space Mono para datos; Bauhaus plano (grilla, círculo/cuadrado/triángulo-play/aro en color plano, bloques, aire; el 3D va en pósters, piezas adicionales, piezas audiovisuales, webs y presentaciones HTML; el merch, plano); sin emojis ni sombras blandas; SEN6 siempre en mayúsculas.

## Cómo se arma
1. Pedí (si no está claro): objetivo, público, duración, cantidad aproximada de diapos y si hay datos o imágenes propias.
2. Copiá `motor/shell.html` a la carpeta del proyecto como `src/shell.html` y **leelo entero**: trae el CSS, los temas de color y el motor. No lo modifiques salvo el `<title>`.
3. Escribí cada sección en `src/secciones/NN-nombre.html` con diapos así:
   `<section class="slide" data-sec="N" data-nom="Nombre" data-tema="claro|papel|blanco|oscuro|naranja|olive|sunset|chile" data-3d="oculto|abre|portada" data-id="algo">…<aside class="notas">…</aside></section>`
   - Temas de fondo: siempre están disponibles **blanco** (`blanco`, #FFFFFF) y **negro** (`oscuro`, tinta #191919), además de crema (`claro`), papel, naranja y oliva (oliva solo en aperturas puntuales).
   - Formas de fondo: el motor las dibuja **planas** (círculo, cuadrado, triángulo-play, aro en color plano). No uses `data-solido="1"`: el 3D no va en presentaciones, queda para pósters y piezas adicionales.
   - **Texturas de fondo**: `data-3d` decide dónde va la lámina generativa Bauhaus (plana, animada): `portada` (mosaico grande a la derecha), `abre` (lámina vertical en la mitad derecha, un patrón por sección), `oculto` (nada, para páginas con mucho contenido). Patrones: ondas, arcos, cuartos, damero, puntos, sol, eclipse, play, anillos, mosaico; para forzar uno, `data-textura="ondas"`. En aperturas y portada conviene una foto de la marca aplicada (taza, libro, stickers, pantalla) en un ambiente Bauhaus: `data-foto="clave"` con la imagen embebida en `window.ASSET[clave]`; reemplaza a la textura. El 3D sólo aparece con `data-solido="1"` (pósters).
   - Primera diapo de cada sección = apertura: `class="slide apertura"`, `.titulo` con `.kicker` + `h1`, `<div class="gigante">02</div>`, `data-3d="abre"`, tema fuerte.
   - Clases: `.kicker`, `h1` 140 px, `h2` 86 px, `h3`, `em` (acento serif), `.lead`, `.lista` con `li data-n="01"`, `.grid2/3/4`, `.card`, `.tag`, `.mono`, `.chico`, `.fuente`, `.marco`, `.btn`.
   - Entradas: `class="in|in-x|in-s"` con `style="--d:2"`. Revelar de a uno: `data-paso="1"`, `"2"`…
   - Imágenes: embebidas por `build.py` desde `assets/*.jpg` → `<img data-asset="nombre">`.
4. Armá con este `build.py` (en la raíz del proyecto):
```python
import pathlib, base64, json
R = pathlib.Path(__file__).parent
shell = (R/'src/shell.html').read_text()
cuerpo = '\n'.join(p.read_text() for p in sorted((R/'src/secciones').glob('*.html')))
assets = {p.stem: 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode() for p in sorted((R/'assets').glob('*.jpg'))}
out = shell.replace('<!--SLIDES-->', cuerpo).replace('</head>', '<script>window.ASSET=' + json.dumps(assets) + ';</script>\n</head>', 1)
(R/'index.html').write_text(out); print('ok', out.count('class="slide'), 'diapos')
```
5. Revisá con capturas (Chrome headless, `index.html?cap#N`, 1920×1080): nada se pisa, nada se sale, se lee de lejos, nada importante debajo de y=1000.

## Reglas de diapo
- Una idea por diapo; máximo ~12 palabras grandes en pantalla. El resto va a las notas (tecla N).
- Ninguna diapo seguida con el mismo layout. Cada una tiene que verse como un póster.
- Números y datos en Space Mono; fuentes en `.fuente`.
- Solo datos verificados. Obras con derechos: recrearlas con código y marcarlas "recreación".
- Para presentar: ← → (o control remoto), F pantalla completa, I índice, N notas, H ocultar barra.
