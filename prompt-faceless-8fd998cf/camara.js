/* Prompt Faceless · cámara de bolsillo (canvas 2D)
   Un mundo de 3200x1800. La cámara es un resorte críticamente amortiguado sobre (x, y, log zoom, rotación).
   Cada efecto = paradas de cámara + lo que se dibuja encima, todo en función del tiempo. */
(function () {
  const W = 3200, H = 1800;
  const TINTA = '#2a1d12', ROJO = '#a3260f', NAR = '#F26A2E', PAPEL = '#e8d6ac';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  const backOut = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const prog = (t, a, d) => clamp((t - a) / d);

  // ---------- lugares del mundo ----------
  const L = {
    foto: [720, 640], anio: [1720, 520], sello: [2520, 720], texto: [1640, 1260], casa: [2620, 1380],
    cont: [1080, 1180], ruta0: [420, 1560], ruta1: [2900, 1500], general: [1600, 900], frase: [640, 1400]
  };

  // ---------- fondo estático ----------
  const base = document.createElement('canvas'); base.width = W; base.height = H;
  (function dibujarBase() {
    const x = base.getContext('2d');
    x.fillStyle = '#e4cfa2'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) { const r = 80 + Math.random() * 380, cx = Math.random() * W, cy = Math.random() * H; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, 'rgba(150,105,55,.16)'); g.addColorStop(1, 'rgba(150,105,55,0)'); x.fillStyle = g; x.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
    x.strokeStyle = 'rgba(90,60,30,.18)'; x.lineWidth = 1.3;
    [[900, 900], [2300, 900]].forEach(([cx, cy]) => { for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 3400, cy + Math.sin(a) * 3400); x.stroke(); } });
    x.strokeStyle = 'rgba(70,45,20,.12)'; for (let i = 0; i < W; i += 200) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (let i = 0; i < H; i += 200) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }
    // costas
    const blob = (cx, cy, rx, ry, j) => { x.beginPath(); for (let i = 0; i <= 90; i++) { const a = i / 90 * Math.PI * 2; const r = 1 + Math.sin(a * 3 + j) * .16 + Math.sin(a * 8 + j * 2) * .06; const px = cx + Math.cos(a) * rx * r, py = cy + Math.sin(a) * ry * r; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.fillStyle = '#cdb07a'; x.fill(); x.lineWidth = 4; x.strokeStyle = '#3a2410'; x.stroke(); };
    blob(3150, 300, 420, 520, 1); blob(3100, 1500, 330, 420, 2); blob(80, 400, 300, 600, 3);
    // rosa
    x.save(); x.translate(2050, 1600);
    for (let i = 0; i < 8; i++) { x.rotate(Math.PI / 4); x.beginPath(); x.moveTo(0, 0); x.lineTo(i % 2 ? 22 : 30, 0); x.lineTo(0, i % 2 ? -90 : -130); x.closePath(); x.fillStyle = i % 2 ? '#7a1a12' : '#3a2410'; x.fill(); }
    x.restore();
    x.font = 'italic 54px "IM Fell English",serif'; x.fillStyle = 'rgba(70,45,20,.5)'; x.fillText('Mar Océano', 1300, 820);
    // casa grabada
    x.save(); x.translate(...L.casa); x.strokeStyle = TINTA; x.lineWidth = 5; x.fillStyle = '#efe2c2';
    x.beginPath(); x.rect(-140, -40, 280, 170); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(-170, -40); x.lineTo(0, -150); x.lineTo(170, -40); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.rect(70, -260, 60, 180); x.fill(); x.stroke(); x.beginPath(); x.moveTo(100, -300); x.lineTo(100, -260); x.moveTo(84, -285); x.lineTo(116, -285); x.stroke();
    for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-100 + i * 60, 110, 20, Math.PI, 0); x.lineTo(-80 + i * 60, 130); x.lineTo(-120 + i * 60, 130); x.closePath(); x.stroke(); }
    x.lineWidth = 1.5; for (let i = -160; i < 160; i += 12) { x.beginPath(); x.moveTo(i, 135); x.lineTo(i + 30, 165); x.stroke(); }
    x.restore();
    // grano de papel
    for (let i = 0; i < 60000; i++) { x.fillStyle = `rgba(60,30,10,${Math.random() * .06})`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  })();

  const retrato = document.createElement('canvas'); retrato.width = 340; retrato.height = 420;
  (function () {
    const x = retrato.getContext('2d'); const w = 340, h = 420;
    x.fillStyle = '#f6efe0'; x.fillRect(0, 0, w, h);
    const g = x.createLinearGradient(0, 20, 0, h); g.addColorStop(0, '#7a5a38'); g.addColorStop(1, '#2e1d0f'); x.fillStyle = g; x.fillRect(20, 20, w - 40, h - 40);
    x.fillStyle = 'rgba(18,10,4,.88)'; x.beginPath(); x.arc(w / 2, 160, 60, 0, 7); x.fill(); x.beginPath(); x.ellipse(w / 2, 340, 125, 100, 0, Math.PI, 0); x.fill();
    x.fillStyle = 'rgba(240,210,170,.25)'; x.beginPath(); x.arc(w / 2 - 18, 150, 24, 0, 7); x.fill();
    for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(0,0,0,${Math.random() * .15})`; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  })();

  // ---------- piezas dinámicas (coordenadas del mundo) ----------
  function gotica(x, txt, px, py, size, p, color = ROJO, op = 1) {
    if (p <= 0 || op <= 0) return;
    x.save(); x.globalAlpha = op; x.font = `${size}px "IM Fell English",serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    const m = x.measureText(txt).width;
    x.beginPath(); x.rect(px - m / 2 - 20, py - size, (m + 40) * ease(p), size * 2); x.clip();
    x.lineWidth = size * .16; x.strokeStyle = PAPEL; x.lineJoin = 'round'; x.strokeText(txt, px, py); x.fillStyle = color; x.fillText(txt, px, py);
    x.restore();
  }
  function bloque(x, txt, px, py, size, p, color = TINTA, op = 1) {
    if (p <= 0 || op <= 0) return;
    x.save(); x.globalAlpha = op * clamp(p * 3); x.font = `700 ${size}px Oswald,Impact,sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    const s = .7 + .3 * backOut(p); x.translate(px, py); x.scale(s, s);
    x.lineWidth = size * .14; x.strokeStyle = PAPEL; x.lineJoin = 'round'; x.strokeText(txt, 0, 0); x.fillStyle = color; x.fillText(txt, 0, 0); x.restore();
  }
  function lamina(x, px, py, p, rot = .06, op = 1) {
    if (p <= 0 || op <= 0) return;
    const caida = 1 - easeOut(p), alto = caida * 260, esc = 1 + caida * .35;
    x.save(); x.globalAlpha = op;
    x.fillStyle = `rgba(30,15,5,${.32 * (1 - caida)})`; x.save(); x.translate(px + 26 + alto * .3, py + 30 + alto * .6); x.rotate(rot); x.fillRect(-180, -220, 360, 440); x.restore();
    x.translate(px, py - alto); x.rotate(rot + caida * .3); x.scale(esc, esc); x.drawImage(retrato, -170, -210, 340, 420); x.restore();
  }
  function sello(x, px, py, p, op = 1) {
    if (p <= 0 || op <= 0) return;
    const s = p < .25 ? 2.2 - 1.2 * (p / .25) : 1; x.save(); x.globalAlpha = op * clamp(p * 4); x.translate(px, py); x.scale(s, s);
    x.fillStyle = '#8a1c14'; x.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, r = 92 + (i % 2 ? 8 : 0); x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.fill();
    x.strokeStyle = 'rgba(255,220,200,.35)'; x.lineWidth = 4; x.beginPath(); x.arc(0, 0, 62, 0, 7); x.stroke();
    x.fillStyle = '#f0d3c0'; x.font = '84px "IM Fell English",serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('R', 0, 6); x.restore();
  }
  function ruta(x, p, op = 1) {
    if (p <= 0 || op <= 0) return;
    const [a, b] = [L.ruta0, L.ruta1]; const n = 44; x.save(); x.globalAlpha = op; x.fillStyle = ROJO;
    for (let i = 0; i < n * p; i++) { const u = i / n; const px = a[0] + (b[0] - a[0]) * u, py = a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 260; x.beginPath(); x.arc(px, py, 13, 0, 7); x.fill(); }
    x.restore();
  }
  function rutaPunto(u) { const [a, b] = [L.ruta0, L.ruta1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 260]; }
  function circulo(x, px, py, rx, ry, p) {
    if (p <= 0) return; x.save(); x.strokeStyle = NAR; x.lineWidth = 12; x.lineCap = 'round';
    x.beginPath(); const a0 = -2.2; for (let i = 0; i <= 80 * p; i++) { const a = a0 + i / 80 * Math.PI * 2.15; const r = 1 + .04 * Math.sin(a * 3); x.lineTo(px + Math.cos(a) * rx * r, py + Math.sin(a) * ry * r); } x.stroke(); x.restore();
  }
  function subrayado(x, px, py, w, p) { if (p <= 0) return; x.save(); x.strokeStyle = NAR; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(px - w / 2, py); x.quadraticCurveTo(px, py + 18, px - w / 2 + w * ease(p), py + 4); x.stroke(); x.restore(); }

  // ---------- efectos ----------
  // keys: [t, x, y, zoom, rot, rigidez]
  const G = L.general;
  const EFECTOS = [
    { id: 'libre', n: 'Recorrido libre', dur: 16,
      pedido: 'Un solo plano continuo: la cámara recorre el mundo, empuja sobre cada detalle, se aleja para viajar y vuelve a entrar. Sin cortes.',
      keys: [[0, ...G, .5], [2, ...L.foto, 1.6], [5, ...L.anio, 1.5], [8, ...L.sello, 1.7], [10.5, ...L.casa, 1.3], [13, ...L.cont, 1.4], [15, ...G, .5]],
      dib(x, t) { lamina(x, ...L.foto, prog(t, 2.4, .6)); gotica(x, '1492', ...L.anio, 210, prog(t, 5.2, .7)); sello(x, ...L.sello, prog(t, 8.3, .5)); } },
    { id: 'push', n: 'Empujar (push-in)', dur: 5,
      pedido: 'Cuando el narrador nombra al protagonista, la cámara empuja lento sobre él (de plano general a primer plano) con ease in/out. Nunca un zoom digital lineal.',
      keys: [[0, ...G, .5], [1, ...L.foto, 2.4, 0, .8]], dib(x, t) { lamina(x, ...L.foto, 1); } },
    { id: 'viaje', n: 'Alejarse para viajar', dur: 6,
      pedido: 'Para pasar de un lugar a otro, la cámara se aleja a un plano general, viaja y vuelve a entrar en el destino. Nunca cortes ni corte directo.',
      keys: [[0, ...L.foto, 2], [1, 1700, 900, .45, 0, 1], [2.6, ...L.casa, 2, 0, 1]], dib(x, t) { lamina(x, ...L.foto, 1); } },
    { id: 'deriva', n: 'Deriva en la pausa', dur: 7,
      pedido: 'En las pausas la cámara nunca queda quieta: sigue derivando muy despacio hacia la próxima parada.',
      keys: [[0, ...L.anio, 1.6]], deriva: [...L.sello], dib(x, t) { gotica(x, '1492', ...L.anio, 210, 1); } },
    { id: 'whip', n: 'Latigazo (whip pan)', dur: 4.5,
      pedido: 'Transición latigazo: la cámara barre rápido de un punto al otro con motion blur fuerte y frena suave en el destino.',
      keys: [[0, ...L.foto, 1.8], [1.2, ...L.sello, 1.8, 0, 3.4]], blurExtra: 2.2, dib(x, t) { lamina(x, ...L.foto, 1); sello(x, ...L.sello, 1); } },
    { id: 'golpe', n: 'Golpe de sello', dur: 4,
      pedido: 'En la palabra clave cae un sello que golpea: escala de 2,2 a 1 en 0,25 s y la cámara recibe una sacudida que decae en 0,35 s.',
      keys: [[0, ...L.sello, 1.9]], golpes: [1.2], dib(x, t) { sello(x, ...L.sello, prog(t, 1.2, .5)); } },
    { id: 'cae', n: 'Foto que cae', dur: 4.5,
      pedido: 'Las fotos reales caen sobre el mundo como láminas físicas: desde arriba, con sombra que se acerca, leve rotación y un asentamiento suave.',
      keys: [[0, ...L.foto, 1.4], [1.4, ...L.foto, 1.9, 0, .7]], dib(x, t) { lamina(x, ...L.foto, prog(t, 1, .9)); } },
    { id: 'circulo', n: 'Círculo a mano', dur: 4.5,
      pedido: 'Cuando se dice la palabra, un círculo naranja se dibuja a mano alrededor de ella en 0,6 s.',
      keys: [[0, ...L.anio, 1.7]], dib(x, t) { gotica(x, '1492', ...L.anio, 210, 1); circulo(x, L.anio[0], L.anio[1] + 10, 290, 150, prog(t, 1.3, .7)); } },
    { id: 'wipe', n: 'Revelado de texto', dur: 4.5,
      pedido: 'La palabra protagonista aparece con un revelado de izquierda a derecha (máscara), grande, con un halo del color del fondo para que se lea sobre cualquier cosa.',
      keys: [[0, ...L.texto, 1.6]], dib(x, t) { gotica(x, 'Nuevo Mundo', ...L.texto, 190, prog(t, 1, 1.1)); } },
    { id: 'ruta', n: 'Ruta que se dibuja', dur: 7,
      pedido: 'Una ruta punteada se dibuja mientras la cámara la sigue en travelling, siempre un poco por delante del último punto.',
      keys: [[0, ...L.ruta0, 1.5]], sigue: true, dib(x, t) { ruta(x, prog(t, .8, 5)); } },
    { id: 'foco', n: 'Un solo protagonista', dur: 5,
      pedido: 'En cada línea hay UN protagonista. Todo lo demás baja al 12 % de opacidad y vuelve solo cuando le toca.',
      keys: [[0, 1620, 660, .8]], dib(x, t) {
        const f = ease(prog(t, 1.2, .6));
        lamina(x, ...L.foto, 1, .06, 1 - .88 * f); sello(x, ...L.sello, 1, 1 - .88 * f); gotica(x, '1492', ...L.anio, 210, 1, ROJO, 1);
      }, apagaBase: 1.2 },
    { id: 'rack', n: 'Cambio de foco', dur: 5.5,
      pedido: 'Cambio de foco: el fondo empieza desenfocado y el protagonista nítido; en la palabra clave el foco pasa al otro elemento.',
      keys: [[0, 1250, 600, .95]], rack: true, dib(x, t) { } },
    { id: 'parallax', n: 'Paralaje', dur: 6,
      pedido: 'Paralaje: una capa de primer plano (polvo, papeles sueltos) se mueve más rápido que el mundo para dar profundidad.',
      keys: [[0, ...L.foto, 1.3], [1.2, ...L.anio, 1.3, 0, .8]], parallax: true, dib(x, t) { lamina(x, ...L.foto, 1); gotica(x, '1492', ...L.anio, 210, 1); } },
    { id: 'vertigo', n: 'Vértigo (dolly zoom)', dur: 5,
      pedido: 'Efecto vértigo: el fondo se aleja mientras el protagonista mantiene su tamaño. Usalo una sola vez, en el giro más fuerte de la historia.',
      keys: [[0, ...L.foto, 2.4], [1, ...L.foto, .9, 0, .5]], vertigo: true, dib(x, t) { } },
    { id: 'giro', n: 'Giro de cámara', dur: 5,
      pedido: 'Mientras se acerca, la cámara rota unos 6 grados para dar tensión, y vuelve a nivel al llegar.',
      keys: [[0, ...G, .55], [1, ...L.casa, 1.8, .11, .9], [3, ...L.casa, 1.9, 0, .9]], dib(x, t) { } },
    { id: 'contador', n: 'Contador', dur: 5,
      pedido: 'Un contador grande que corre de 1451 a 1492 con ease out, frena en el número exacto cuando el narrador lo dice.',
      keys: [[0, ...L.cont, 1.8]], dib(x, t) { const p = easeOut(prog(t, .8, 2.4)); bloque(x, String(Math.round(1451 + 41 * p)), ...L.cont, 220, Math.min(1, prog(t, .6, .3) + .01), TINTA); subrayado(x, L.cont[0], L.cont[1] + 130, 520, prog(t, 3.2, .5)); } },
    { id: 'frase', n: 'Palabra por palabra', dur: 5,
      pedido: 'La frase aparece palabra por palabra, cada una en el segundo exacto en que la dice el narrador (tiempos sacados con Whisper).',
      keys: [[0, 1090, 1400, 1.05]], dib(x, t) {
        const pal = ['buscaba', 'Asia,', 'no', 'un', 'continente'];
        x.save(); x.font = '700 120px Oswald,Impact,sans-serif'; x.textBaseline = 'middle';
        let px = 330; pal.forEach((w, i) => { const p = prog(t, .7 + i * .45, .25); x.globalAlpha = p; x.fillStyle = i === 1 ? ROJO : TINTA; x.lineWidth = 16; x.strokeStyle = PAPEL; x.lineJoin = 'round'; const dy = (1 - easeOut(p)) * 40; x.strokeText(w, px, 1400 + dy); x.fillText(w, px, 1400 + dy); px += x.measureText(w + ' ').width; });
        x.restore();
      } },
  ];

  // ---------- motor ----------
  function Camara(canvas, opts) {
    const x = canvas.getContext('2d');
    const polvo = Array.from({ length: 70 }, () => [Math.random() * W, Math.random() * H, 2 + Math.random() * 7, Math.random()]);
    let ef = EFECTOS[0], t0 = performance.now() / 1000, visible = true;
    const s = { x: G[0], y: G[1], lz: Math.log(.5), r: 0, vx: 0, vy: 0, vl: 0, vr: 0 };
    let prev = { x: s.x, y: s.y, lz: s.lz }, lin = null, ultimo = performance.now();
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(canvas);

    function poner(id) { ef = EFECTOS.find(e => e.id === id) || EFECTOS[0]; t0 = performance.now() / 1000; lin = null; opts.onEfecto && opts.onEfecto(ef); }
    function objetivo(t) {
      let i = 0; while (i + 1 < ef.keys.length && ef.keys[i + 1][0] <= t) i++;
      const k = ef.keys[i];
      let [tx, ty, z, r] = [k[1], k[2], k[3], k[4] || 0];
      const nx = ef.keys[i + 1];
      if (opts.deriva() && nx) { const d = .07 * clamp((t - k[0]) / Math.max(.5, nx[0] - k[0])); tx += (nx[1] - tx) * d; ty += (nx[2] - ty) * d; }
      if (opts.deriva() && ef.deriva) { const d = clamp(t / ef.dur) * .22; tx += (ef.deriva[0] - tx) * d; ty += (ef.deriva[1] - ty) * d; }
      if (ef.sigue) { const u = clamp(prog(t, .8, 5) + .06); [tx, ty] = rutaPunto(Math.min(1, u)); }
      return { tx, ty, tl: Math.log(z), tr: r, rig: (k[5] || 1) * opts.rig(), i, k };
    }

    function cuadro(ahora) {
      requestAnimationFrame(cuadro);
      const dtR = Math.min(.05, (ahora - ultimo) / 1000); ultimo = ahora;
      if (!visible) return;
      let t = ahora / 1000 - t0; if (t > ef.dur + 1.2) { t0 = ahora / 1000; t = 0; s.vx = s.vy = s.vl = 0; const k = ef.keys[0]; s.x = k[1]; s.y = k[2]; s.lz = Math.log(k[3]); s.r = k[4] || 0; lin = null; }
      const o = objetivo(t);
      if (opts.resorte()) {
        const w = o.rig * 2.2, sub = 4, dt = dtR / sub;
        for (let i = 0; i < sub; i++) {
          s.vx += (w * w * (o.tx - s.x) - 2 * w * s.vx) * dt; s.x += s.vx * dt;
          s.vy += (w * w * (o.ty - s.y) - 2 * w * s.vy) * dt; s.y += s.vy * dt;
          s.vl += (w * w * (o.tl - s.lz) - 2 * w * s.vl) * dt; s.lz += s.vl * dt;
          s.vr += (w * w * (o.tr - s.r) - 2 * w * s.vr) * dt; s.r += s.vr * dt;
        }
      } else {
        // "PowerPoint": velocidad constante y frenazo en seco
        if (!lin || lin.i !== o.i) lin = { i: o.i, x: s.x, y: s.y, lz: s.lz, r: s.r, t: t };
        const u = clamp((t - lin.t) / .7);
        s.x = lin.x + (o.tx - lin.x) * u; s.y = lin.y + (o.ty - lin.y) * u; s.lz = lin.lz + (o.tl - lin.lz) * u; s.r = lin.r + (o.tr - lin.r) * u;
        if (ef.sigue) { s.x = o.tx; s.y = o.ty; }
      }
      let zoom = Math.exp(s.lz);
      // cámara en mano + golpes
      let hx = 0, hy = 0, hr = 0;
      if (opts.mano()) { hx = 5 * Math.sin(t * .7) + 3 * Math.sin(t * 1.9 + 1) + 1.6 * Math.sin(t * 3.3 + 2); hy = 4 * Math.sin(t * .9 + .4) + 2.4 * Math.sin(t * 2.3) + 1.4 * Math.sin(t * 3.7 + 1); hr = .0025 * Math.sin(t * .5); }
      (ef.golpes || []).forEach(g => { const d = t - g; if (d > 0 && d < .35) { const a = 22 * (1 - d / .35); hx += a * Math.sin(d * 90); hy += a * Math.cos(d * 70); } });
      // vértigo: el mundo se aleja, el protagonista queda igual
      const cw = canvas.width, ch = canvas.height, k = cw / 1920;
      x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#1a120b'; x.fillRect(0, 0, cw, ch);
      x.save();
      x.translate(cw / 2 + hx * k, ch / 2 + hy * k); x.rotate(s.r + hr); x.scale(zoom * k, zoom * k); x.translate(-s.x, -s.y);
      // rack focus: fondo borroso
      let fondoBlur = 0;
      if (ef.rack) fondoBlur = t < 2 ? 5 : 5 * (1 - ease(prog(t, 2, .6)));
      if (fondoBlur > .1) x.filter = `blur(${fondoBlur}px)`;
      // atenuar base
      x.globalAlpha = ef.apagaBase ? 1 - .55 * ease(prog(t, ef.apagaBase, .6)) : 1;
      x.drawImage(base, 0, 0); x.globalAlpha = 1; x.filter = 'none';
      if (ef.rack) {
        const pa = t < 2 ? 0 : 6 * ease(prog(t, 2, .6)), pb = t < 2 ? 0 : 6 * (1 - ease(prog(t, 2, .6)));
        x.filter = pb > .1 ? `blur(${pb}px)` : 'none'; lamina(x, ...L.foto, 1); x.filter = 'none';
        x.filter = pa > .1 ? `blur(${6 - pa}px)` : 'blur(6px)'; if (t >= 2.6) x.filter = 'none'; gotica(x, '1492', ...L.anio, 210, 1); x.filter = 'none';
      }
      if (ef.vertigo) {
        // el protagonista se dibuja en escala compensada para mantener su tamaño en pantalla
        x.restore(); x.save();
        const z0 = 2.4; x.translate(cw / 2 + hx * k, ch / 2 + hy * k); x.scale(z0 * k, z0 * k); x.translate(-L.foto[0], -L.foto[1]);
        lamina(x, ...L.foto, 1);
      } else {
        ef.dib(x, t);
      }
      x.restore();
      // paralaje: polvo de primer plano
      if (ef.parallax || ef.id === 'libre') {
        x.save(); x.fillStyle = 'rgba(40,25,10,.55)';
        polvo.forEach(([px, py, r, z]) => { const f = 1.8 + z * 1.2; const sx = (px - s.x * f) % W, sy = (py - s.y * f * .9) % H; const X = ((sx + W) % W) / W * cw * 1.4 - cw * .2, Y = ((sy + H) % H) / H * ch * 1.4 - ch * .2; x.globalAlpha = .25 + z * .35; x.beginPath(); x.arc(X, Y, r * k * (ef.parallax ? 2.2 : 1), 0, 7); x.fill(); });
        x.restore();
      }
      // motion blur
      const dt = Math.max(dtR, .001);
      const vel = Math.hypot(s.x - prev.x, s.y - prev.y) * zoom / dt + Math.abs(s.lz - prev.lz) / dt * 900;
      const b = opts.blur() ? clamp((vel - 260) / 900) * 6 + (ef.blurExtra && vel > 400 ? ef.blurExtra : 0) : 0;
      const bb = b * Math.min(1, canvas.clientWidth / 1100); canvas.style.filter = bb > .2 ? `blur(${bb.toFixed(2)}px)` : 'none';
      prev = { x: s.x, y: s.y, lz: s.lz };
      opts.onVel && opts.onVel(vel);
    }
    requestAnimationFrame(cuadro);
    return { poner };
  }

  window.PF_EFECTOS = EFECTOS;
  window.PF_Camara = Camara;
})();
