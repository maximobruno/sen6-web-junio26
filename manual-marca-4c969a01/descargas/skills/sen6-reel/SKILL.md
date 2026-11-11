---
name: sen6-reel
description: Hace reels y videos verticales 1080×1920 de SEN6 con motion graphics en código (Remotion o HyperFrames) — sobre un video a cámara o faceless — respetando la zona segura de Instagram, la paleta y la tipografía de la marca y el CTA "Comentá CLASE". Usala cuando pidan "un reel", "un short", "un video vertical", "motion para Instagram" para SEN6, aunque no nombre la skill.
---

# SEN6 · Reels y video vertical

> Marca: aplicá siempre la skill `sen6-marca` (colores, tipografías, logo, voz y checklist). Si no está instalada, mínimos: crema #E8D8BA, papel #F0E9E3, tinta #191919, naranja #D06224, blanco #FFFFFF, oliva #8A8635 (≤5 %); Jost 800-900 MAYÚSCULAS + Instrument Serif itálica naranja como acento + Space Mono para datos; Bauhaus plano (grilla, círculo/cuadrado/triángulo-play/aro en color plano, bloques, aire; el 3D va en pósters, piezas adicionales, piezas audiovisuales, webs y presentaciones HTML; el merch, plano); sin emojis ni sombras blandas; SEN6 siempre en mayúsculas.

## Normas del formato
- 1080×1920, 30 fps. **Zona segura**: todo texto y gráfico dentro de x 60-940 / y 250-1460.
- Si hay alguien a cámara: video a pantalla completa, el motion vive en el aire arriba de la cabeza. Nada tapa la cara.
- Gancho visual en los primeros 3 s; un elemento nuevo cada 3-5 s; cortes con golpe de zoom.
- Sin subtítulos (solo apoyo de motion), salvo que lo pidan.
- Cierre con el CTA **"Comentá CLASE"** (caja de comentario que se escribe sola + un sello). En YouTube largo no va CLASE.
- Motion premium: cámara, reencuadres, formas planas o en 3D (esfera, cubo, triángulo-play relleno, aro; mate, luz cálida) que entran con ritmo, tarjetas con borde negro de 3 px, números en Space Mono. **Sin 3D** (es solo para pósters y piezas adicionales). **Nada de emojis ni stickers.**
- Mismos colores y tipografías siempre; los componentes rotan de video en video (no repetir el mismo layout dos veces seguidas).

## Flujo
1. Transcribir con tiempos por palabra (faster-whisper) y anclar cada gráfico a la palabra exacta.
2. Recortar silencios si es a cámara.
3. Componer en Remotion/HyperFrames; revisar fotogramas sueltos en grilla antes del render completo.
4. Render mudo + mezcla aparte (voz −14 LUFS, música baja, efectos por evento) y unir con ffmpeg; verificar desfase 0 ms.
5. Entregar un solo archivo final.
