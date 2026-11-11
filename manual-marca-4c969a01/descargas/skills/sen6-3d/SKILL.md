---
name: sen6-3d
description: Crea imágenes y animaciones 3D con la estética SEN6 (bodegón Bauhaus — esfera naranja, cubo tinta, triángulo sunset (play extruido, relleno, punta a la derecha), aro oliva, ciclorama crema, luz cálida, sombras duras) con Blender por script o three.js, sin IA generativa — SOLO para pósters y piezas adicionales (láminas del estudio, fondos de pantalla, merch y piezas especiales). Usala cuando pidan "un póster", "una lámina", "un fondo de pantalla", "merch", "un render", "una escena 3D" o "un bodegón" con la marca SEN6, aunque no nombre la skill. No la uses para reels, miniaturas, webs, presentaciones, documentos, emails, redes ni Skool: ahí la marca es plana.
---

# SEN6 · 3D

> Marca: aplicá siempre la skill `sen6-marca` (colores, tipografías, logo, voz y checklist). Si no está instalada, mínimos: crema #E8D8BA, papel #F0E9E3, tinta #191919, naranja #D06224, blanco #FFFFFF, oliva #8A8635 (≤5 %); Jost 800-900 MAYÚSCULAS + Instrument Serif itálica naranja como acento + Space Mono para datos; Bauhaus plano (grilla, círculo/cuadrado/triángulo-play/aro en color plano, bloques, aire; el 3D va en pósters, piezas adicionales, piezas audiovisuales, webs y presentaciones HTML; el merch, plano); sin emojis ni sombras blandas; SEN6 siempre en mayúsculas.

## Alcance (regla de la marca)
- **SÍ**: pósters, láminas del estudio, piezas especiales, piezas audiovisuales (reels y videos), webs, presentaciones HTML, Skool y el manual de marca.
- **NO**: miniaturas, merch, fondos de pantalla, documentos, emails, redes. Ahí círculo, cuadrado, triángulo-play y aro van planos (skill `sen6-marca`). Si te piden 3D para una de esas piezas, avisá la regla y proponé la versión plana.

## Base
`base/escena_base.py` es el script de Blender con el que se hicieron los fondos de pantalla oficiales: ciclorama curvo sin horizonte, materiales mate con los colores exactos de la marca (convertidos a lineal), sol cálido con sombras duras, luz de relleno de área y 5 escenas (bodegón, noche, naranja, papel, el 6). Se corre así:
```bash
blender -b -P escena_base.py -- --escena 1 --formato 16x9|ultrawide|telefono --samples 96 --out /ruta/salida.png
```
Para una escena nueva: copiá un bloque `elif ESC == N` y cambiá las piezas. Probá primero con `--escala 0.2 --samples 16`.

## Reglas de la escena
- Piezas: esfera, cubo, triángulo-play extruido (relleno), cilindro, aro, escalones y losas; el 6 de SEN6 en volumen (importado del SVG oficial) como pieza estrella.
- Una sola luz principal cálida (sol con ángulo 1-2°), sombras duras; relleno suave. Nada de luces de colores ni neón.
- Materiales mate (rugosidad 0,6-0,95). Gestión de color "Standard" para que los HEX de la marca se respeten.
- Composición asimétrica, mucho aire para el texto o los íconos del escritorio. En vertical, el grupo en el tercio de abajo (arriba va el reloj o el texto).
- Animación (pósters animados y piezas especiales): movimientos lentos y pesados (curvas suaves, sin rebotes), cámara con un solo movimiento continuo.
- Pieza especial interactiva (no una web de marca ni una landing): three.js con las mismas piezas, MeshStandardMaterial mate, HemisphereLight + DirectionalLight cálida con sombras, un solo contexto WebGL.
