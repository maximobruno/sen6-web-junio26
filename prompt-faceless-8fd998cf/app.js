/* Prompt Faceless · lógica de la página */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- copiar ----------
  function copiar(texto, btn) {
    const ok = () => { const o = btn.textContent; btn.textContent = '¡Copiado!'; btn.classList.add('ok'); setTimeout(() => { btn.textContent = o; btn.classList.remove('ok'); }, 1500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, () => viejo());
    else viejo();
    function viejo() { const a = document.createElement('textarea'); a.value = texto; a.style.position = 'fixed'; a.style.opacity = 0; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) { } a.remove(); ok(); }
  }
  $$('.bloque .copiar').forEach(b => b.addEventListener('click', () => copiar(b.nextElementSibling.innerText, b)));

  // ---------- datos ----------
  const MUNDO_TXT = {
    carta: 'una carta náutica antigua gigante: pergamino, costas grabadas a plumín, rumbos, rosas de los vientos y barcos dibujados',
    escritorio: 'la mesa de un investigador vista desde arriba: madera, papeles, fotos reales, chinches con hilo rojo y una lupa',
    ciudad: 'una ciudad de noche vista desde el aire: manzanas con ventanas encendidas, calles con luz y un pin que marca cada lugar',
    cielo: 'un cielo nocturno enorme: estrellas que se unen en figuras, nebulosas suaves y un planeta',
    pizarra: 'una pizarra de tiza gigante: diagramas, flechas y círculos que se dibujan a mano mientras se explica',
    tiempo: 'una línea de tiempo larga como un riel: años grandes, y tarjetas con fotos que se levantan al llegar a cada fecha',
    otro: 'el mundo que mejor cuente esta historia (proponeme 2 opciones antes de construir)',
  };
  const ESTETICAS = {
    grabado: ['Grabado antiguo', 'pergamino sepia, tinta negra grabada con rayado, títulos en gótico rojo oscuro y notas en cursiva caligráfica'],
    noir: ['Noir', 'blanco y negro de alto contraste, sombras duras, un solo color de acento rojo y grano fuerte'],
    neon: ['Noche y neón', 'fondo casi negro, luces naranjas y doradas, glow marcado y tipografía condensada'],
    tiza: ['Tiza', 'trazos de tiza blanca sobre verde oscuro, con un acento naranja para lo importante'],
    recorte: ['Papel recortado', 'collage de papeles con sombra real, colores planos y textura de cartón'],
    limpia: ['Infografía limpia', 'fondo crema, tipografía grande sin serifa, íconos de línea y solo dos colores'],
    acuarela: ['Acuarela', 'manchas suaves de acuarela, bordes húmedos y papel con textura'],
    refs: ['Copiá mis referencias', 'la de mis referencias: copiá su paleta, tipografía, textura y clima'],
  };
  const VOZ = {
    tengo: 'Ya tengo la locución: está en la carpeta locucion/. Sacá los tiempos de cada palabra con Whisper.',
    eleven: 'Todavía no tengo la locución: generala con ElevenLabs a partir de mi guion (guion.txt). Antes de generar, decime cuántos créditos va a usar y esperá mi OK.',
    local: 'Todavía no tengo la locución: generá un borrador con una voz local gratuita (Qwen TTS) a partir de mi guion (guion.txt).',
    guion: 'Solo tengo el guion (guion.txt). Ayudame a elegir cómo hacer la locución antes de empezar; la duración del video depende del audio.',
  };
  const FOTOS = {
    tengo: 'Fotos reales de las personas, lugares u objetos: están en la carpeta fuentes/.',
    wiki: 'No tengo fotos: buscá imágenes reales en Wikimedia Commons (dominio público o CC), con buena resolución, y anotá el crédito y la licencia de cada una en fuentes/creditos.md.',
    ambas: 'Tengo algunas fotos en fuentes/. Completá lo que falte con imágenes reales de Wikimedia Commons (dominio público o CC) y anotá el crédito y la licencia de cada una en fuentes/creditos.md.',
  };
  const MUSICA = {
    mixkit: 'Música y efectos de Mixkit (libres para YouTube y redes, sin atribución): un tema de fondo que no tape la voz y efectos cortos en los momentos clave (papel cuando cae una foto, golpe en los sellos, whoosh en los viajes). Todo normalizado a −14 LUFS.',
    mia: 'La música está en la carpeta musica/. Que no tape la voz; efectos cortos en los momentos clave. Todo normalizado a −14 LUFS.',
    no: 'Sin música. Solo efectos cortos en los momentos clave, normalizado a −14 LUFS.',
  };

  // ---------- chips ----------
  const estado = { mundo: 'carta', estetica: 'grabado', efectos: new Set(['push', 'cae', 'golpe', 'ruta']), modo: 'completo' };
  function chips(cont, items, multi, clave) {
    const el = $(cont); el.innerHTML = '';
    items.forEach(([v, txt]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = txt; b.dataset.v = v;
      b.addEventListener('click', () => {
        if (multi) { estado[clave].has(v) ? estado[clave].delete(v) : estado[clave].add(v); }
        else estado[clave] = v;
        pintar(); generar();
      });
      el.appendChild(b);
    });
    function pintar() { $$('.chip', el).forEach(b => b.classList.toggle('on', multi ? estado[clave].has(b.dataset.v) : estado[clave] === b.dataset.v)); }
    pintar(); return pintar;
  }
  const M = window.PF_MUNDOS || {};
  const pintarMundo = chips('#chipsMundo', Object.keys(M).map(k => [k, M[k].nombre]).concat([['otro', 'Que lo proponga Claude']]), false, 'mundo');
  chips('#chipsEstetica', Object.entries(ESTETICAS).map(([k, v]) => [k, v[0]]), false, 'estetica');
  chips('#chipsEfectos', (window.PF_EFECTOS || []).filter(e => e.id !== 'libre').map(e => [e.id, e.n]), true, 'efectos');

  // ---------- generador ----------
  const form = $('#genForm');
  form.addEventListener('input', generar); form.addEventListener('change', generar);
  $$('.tab').forEach(t => t.addEventListener('click', () => { estado.modo = t.dataset.modo; $$('.tab').forEach(x => x.classList.toggle('on', x === t)); generar(); }));

  function generar() {
    const f = Object.fromEntries(new FormData(form).entries());
    const tema = f.tema.trim() || '[TEMA DEL VIDEO]';
    const publico = f.publico.trim() || 'público general curioso';
    const mundo = MUNDO_TXT[estado.mundo];
    const est = ESTETICAS[estado.estetica][1];
    const efectos = [...estado.efectos].map(id => (window.PF_EFECTOS || []).find(e => e.id === id)).filter(Boolean);
    let p;
    if (estado.modo === 'skill') {
      p = `Usá la skill faceless-plano-continuo.

Tema: ${tema}. Público: ${publico}.
Formato: ${f.formato}. Duración: ${f.duracion}.
Mundo: ${mundo}.
Estética: ${est}.${f.refs === 'tengo' ? ' Mis referencias están en referencias/.' : ''}
${VOZ[f.voz]}
${FOTOS[f.fotos]}
${MUSICA[f.musica]}${efectos.length ? `
Movimientos que quiero sí o sí:
${efectos.map(e => '- ' + e.pedido).join('\n')}` : ''}

Empezá por la tabla de beats y mostrámela antes de construir.`;
      $('#notaModo').innerHTML = 'Necesitás tener la skill instalada (<a href="#skill">parada 06</a>). Es mucho más corto porque las reglas ya están adentro de la skill.';
    } else {
      p = `Quiero un video de motion cinematográfico hecho completamente con código. Sin generadores de video con IA y sin material de stock. Cada cuadro tiene que estar dibujado con código (Remotion, SVG o canvas) y renderizado a MP4.

EL VIDEO
- Tema: ${tema}.
- Público: ${publico}.
- Formato: ${f.formato}. Duración: ${f.duracion}; tiene que coincidir exactamente con la locución.

INSUMOS
- ${VOZ[f.voz]}
- ${FOTOS[f.fotos]}
- ${f.refs === 'tengo' ? 'Referencias de estilo: están en la carpeta referencias/. Copiá su clima.' : 'No tengo referencias: proponeme 2 direcciones de estilo con una imagen de muestra cada una antes de construir.'}
- ${MUSICA[f.musica]}

EL MUNDO Y EL ESTILO
- Todo el video es UN solo movimiento de cámara continuo sobre ${mundo}. Nada corta y no cambian diapositivas. La cámara se desliza, empuja sobre los detalles, se aleja para viajar y vuelve a entrar.
- Estética: ${est}.
- El movimiento tiene que sentirse suave y filmado. Cada arranque y cada freno llevan ease in y out (resorte críticamente amortiguado). La cámara nunca se detiene en seco: en las pausas sigue derivando despacio hacia donde va a ir. Sumá cámara en mano sutil, motion blur en los movimientos rápidos, grano de película, un glow suave y viñeta.
- Las fotos y documentos reales caen sobre el mundo como objetos físicos (copias, papeles, recortes), en el lugar donde pasa la historia.${efectos.length ? `
- Movimientos que quiero sí o sí:
${efectos.map(e => '  · ' + e.n + ': ' + e.pedido).join('\n')}` : ''}

REGLAS DE NARRACIÓN Y LECTURA (lo más importante)
1. Una idea por línea de locución. Cada línea tiene UN protagonista en pantalla (una foto, una palabra o un documento) y todo lo demás se atenúa.
2. Cada frase aparece en pantalla una sola vez. Si el narrador la dice, o se ve en un documento real o se tipea en pantalla, nunca las dos cosas.
3. Nada de texto de relleno. El cuerpo de los documentos son líneas grises suaves que se leen como papel.
4. Tipografía grande y legible. Si no se lee en un celular en un segundo, es muy chica o hay demasiado.
5. Menos es más: afuera la cinta, los sellos, las notas y las etiquetas de más que no cuenten la historia.
6. Los momentos visuales caen exactamente en la palabra dicha: usá los tiempos por palabra de Whisper para anclar cada cosa.
7. Cada texto protagonista sale del todo después de su beat, para que no se pise con lo que viene.

PROCESO
- Antes de construir, escribí una tabla de beats: tiempo → narración → protagonista en pantalla → texto en pantalla. Mostrámela y preguntame todo lo que no esté claro.
- La calidad importa más que la velocidad. Priorizá diseño, movimiento suave y claridad antes que agregar cosas.
- Antes del render final, renderizá stills de cada beat y secuencias de los movimientos de cámara, mostrámelos en una grilla y corregí lo amontonado, ilegible, superpuesto, o lo que salte o frene de golpe.
- Render mudo y la mezcla de audio aparte; después unilos con ffmpeg.
- Entregá un solo MP4 final con la locución sincronizada, en el formato exacto de arriba.`;
      $('#notaModo').innerHTML = 'Pegalo en Claude Code, dentro de la carpeta de tu proyecto. Funciona sin la skill, solo con el <a href="#kit">kit</a> instalado.';
    }
    // resaltar lo que vino del formulario
    const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    let html = esc(p).replace(/^([A-ZÁÉÍÓÚÑ ()]{4,})$/gm, '<span class="h">$1</span>');
    [tema, publico].forEach(v => { if (v && !v.startsWith('[')) html = html.split(esc(v)).join(`<span class="v">${esc(v)}</span>`); });
    $('#prompt').innerHTML = html; $('#prompt').dataset.txt = p;
  }
  $('#copiarPrompt').addEventListener('click', e => copiar($('#prompt').dataset.txt, e.target));
  generar();

  // ---------- mundos ----------
  const lista = $('#mundoLista');
  let visorMundo = null;
  Object.entries(M).forEach(([k, m], i) => {
    const b = document.createElement('button'); b.className = 'mundo-item' + (i ? '' : ' on'); b.dataset.k = k;
    b.innerHTML = `<b>${m.nombre}</b><span>${m.desc}</span><em>${m.ideal}</em><a class="btn chico usar" href="#generador">Usar este mundo</a>`;
    b.addEventListener('click', ev => {
      if (ev.target.classList.contains('usar')) { estado.mundo = k; pintarMundo(); generar(); return; }
      $$('.mundo-item').forEach(x => x.classList.toggle('on', x === b)); visorMundo && visorMundo.cargar(k);
    });
    lista.appendChild(b);
  });

  function arrancarMundos() {
    if (!window.THREE) return;
    visorMundo = PF_Visor($('#mundoCanvas'), {
      onParada(i, n, m) { $('#mundoParada').textContent = `PARADA ${i + 1}/${n}`; $('#mundoNombre').textContent = m.nombre.toUpperCase(); }
    });
    visorMundo.cargar('carta');
    const hero = PF_Visor($('#heroCanvas'), { blurCSS: true });
    hero.cargar('carta');
  }

  // ---------- cámara ----------
  const ef = $('#efectos');
  (window.PF_EFECTOS || []).forEach((e, i) => {
    const b = document.createElement('button'); b.className = 'efecto' + (i ? '' : ' on'); b.dataset.id = e.id;
    b.innerHTML = `<i>${String(i).padStart(2, '0')}</i>${e.n}`;
    b.addEventListener('click', () => { $$('.efecto').forEach(x => x.classList.toggle('on', x === b)); cam && cam.poner(e.id); });
    ef.appendChild(b);
  });
  const chk = id => () => $('#' + id).checked;
  let cam = null;
  function arrancarCamara() {
    cam = PF_Camara($('#camCanvas'), {
      resorte: chk('optResorte'), deriva: chk('optDeriva'), mano: chk('optMano'), blur: chk('optBlur'),
      rig: () => parseFloat($('#optRig').value) / 1.2,
      onEfecto(e) { $('#camEfecto').textContent = e.n.toUpperCase(); $('#pedidoTxt').textContent = e.pedido; },
      onVel(v) { $('#camVel').textContent = 'vel ' + Math.round(v); },
    });
    cam.poner('libre');
  }
  $('#copiarPedido').addEventListener('click', e => copiar($('#pedidoTxt').textContent, e.target));
  $('#optRig').addEventListener('input', e => $('#rigVal').textContent = (+e.target.value).toFixed(1));
  [['optGrano', 'camGrano'], ['optVineta', 'camVineta'], ['optGlow', 'camGlow']].forEach(([o, c]) => $('#' + o).addEventListener('change', e => $('#' + c).style.display = e.target.checked ? '' : 'none'));

  // ---------- riel activo ----------
  const secs = $$('main .sec'), links = $$('.riel a');
  const obsRiel = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => obsRiel.observe(s));

  // arrancar cuando estén las fuentes (los textos de los mundos se dibujan en canvas)
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    Promise.all(['700 40px Oswald', 'italic 40px "IM Fell English"', '400 20px "Space Mono"'].map(f => document.fonts.load(f).catch(() => { }))).then(() => { arrancarMundos(); arrancarCamara(); });
  });
})();
