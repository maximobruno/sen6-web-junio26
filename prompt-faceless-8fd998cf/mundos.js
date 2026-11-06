/* Prompt Faceless · mundos en three.js (r128, script clásico)
   Cada mundo es una superficie grande + paradas. Una sola cámara la recorre sin cortar:
   resorte críticamente amortiguado, deriva hacia la próxima parada, cámara en mano y blur por velocidad. */
(function () {
  const C = { ink: 0x0B0D12, cream: 0xF5F3EF, naranja: 0xD4450A, glow: 0xF26A2E, oro: 0xE8C27A, terra: 0xC8502A };
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);

  function lienzo(w, h, dibujar) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    dibujar(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.encoding = THREE.sRGBEncoding; return t;
  }
  function plano(map, w, h, transp) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map, roughness: .9, transparent: !!transp, depthWrite: !transp }));
    m.rotation.x = -Math.PI / 2; return m;
  }
  function texto(t, { color = '#F5F3EF', size = 120, font = 'Oswald', peso = 700, w = 1024, h = 220, halo } = {}) {
    return lienzo(w, h, (x) => {
      x.font = `${peso} ${size}px ${font},Impact,serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
      if (halo) { x.lineWidth = size * .18; x.strokeStyle = halo; x.lineJoin = 'round'; x.strokeText(t, w / 2, h / 2); }
      x.fillStyle = color; x.fillText(t, w / 2, h / 2);
    });
  }
  function cartel(t, w, h, o) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texto(t, o), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; return m; }
  function ruido(x, w, h, n, a, col) { for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${col},${Math.random() * a})`; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 3); } }
  function manchas(x, w, h, n, col, a) { for (let i = 0; i < n; i++) { const r = 40 + Math.random() * 260, cx = Math.random() * w, cy = Math.random() * h; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); } }

  // foto sepia "real" dibujada (silueta) para no depender de archivos
  function foto(tipo, sep = true) {
    return lienzo(360, 440, (x, w, h) => {
      x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, w, h);
      const g = x.createLinearGradient(0, 30, 0, h - 60); g.addColorStop(0, sep ? '#8a6a45' : '#55606e'); g.addColorStop(1, sep ? '#3b2817' : '#1f2630');
      x.fillStyle = g; x.fillRect(22, 22, w - 44, h - 90);
      x.fillStyle = sep ? 'rgba(20,12,5,.85)' : 'rgba(5,8,12,.85)';
      if (tipo === 'retrato') { x.beginPath(); x.arc(w / 2, 170, 62, 0, 7); x.fill(); x.beginPath(); x.ellipse(w / 2, 330, 120, 90, 0, Math.PI, 0); x.fill(); }
      else if (tipo === 'edificio') { x.fillRect(80, 180, 200, 170); x.beginPath(); x.moveTo(60, 180); x.lineTo(180, 100); x.lineTo(300, 180); x.fill(); x.fillRect(245, 70, 22, 70); }
      else if (tipo === 'barco') { x.beginPath(); x.moveTo(60, 290); x.lineTo(300, 290); x.lineTo(260, 340); x.lineTo(100, 340); x.fill(); x.fillRect(176, 100, 8, 190); x.beginPath(); x.moveTo(184, 110); x.lineTo(270, 250); x.lineTo(184, 250); x.fill(); }
      else { x.beginPath(); x.moveTo(30, 330); x.lineTo(130, 200); x.lineTo(200, 270); x.lineTo(260, 180); x.lineTo(w - 22, 330); x.fill(); }
      ruido(x, w, h, 2500, .12, '0,0,0');
      x.fillStyle = 'rgba(60,40,20,.5)'; x.fillRect(22, h - 52, 160, 8); x.fillRect(22, h - 36, 110, 8);
    });
  }
  function papel(lineas = 16, color = '#efe6d2') {
    return lienzo(420, 560, (x, w, h) => {
      x.fillStyle = color; x.fillRect(0, 0, w, h); manchas(x, w, h, 4, '120,90,50', .12);
      x.fillStyle = 'rgba(40,30,20,.75)'; x.fillRect(40, 44, 220, 22);
      x.fillStyle = 'rgba(60,50,40,.22)'; for (let i = 0; i < lineas; i++) x.fillRect(40, 100 + i * 26, i % 5 === 4 ? 200 : 330, 9);
      ruido(x, w, h, 1500, .08, '0,0,0');
    });
  }

  // ======================= MUNDOS =======================
  const MUNDOS = {};

  // ---------- 1. Carta náutica ----------
  MUNDOS.carta = {
    nombre: 'Carta náutica', desc: 'Pergamino, costas grabadas, rumbos y barcos.', ideal: 'Historia · viajes · exploradores · guerras',
    fondo: 0x1a120b, niebla: [0x1a120b, 40, 120],
    crear(scene, anim) {
      const tex = lienzo(2400, 1400, (x, w, h) => {
        x.fillStyle = '#e2cda0'; x.fillRect(0, 0, w, h); manchas(x, w, h, 40, '150,110,60', .18);
        // rumbos
        x.strokeStyle = 'rgba(90,60,30,.22)'; x.lineWidth = 1.4;
        [[700, 650], [1700, 700]].forEach(([cx, cy]) => { for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 2600, cy + Math.sin(a) * 2600); x.stroke(); } });
        // costas
        const costa = (pts, fill) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = fill; x.fill(); for (let k = 1; k <= 3; k++) { x.strokeStyle = `rgba(70,45,20,${.35 / k})`; x.lineWidth = 2; x.save(); x.translate(0, 0); x.stroke(); x.restore(); } x.strokeStyle = '#3a2410'; x.lineWidth = 3.2; x.stroke(); };
        const blob = (cx, cy, rx, ry, n, j) => { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const r = 1 + (Math.sin(a * 3 + j) * .18 + Math.sin(a * 7 + j * 2) * .08 + (rnd() - .5) * .08); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
        costa(blob(2050, 520, 380, 420, 90, 1), '#c9a96e');
        costa(blob(2120, 1180, 300, 330, 80, 2), '#c9a96e');
        costa(blob(330, 520, 330, 460, 90, 3), '#c9a96e');
        costa(blob(470, 1180, 160, 230, 60, 4), '#c9a96e');
        for (let i = 0; i < 9; i++) costa(blob(820 + rnd() * 500, 820 + rnd() * 300, 18 + rnd() * 30, 12 + rnd() * 20, 20, i), '#c9a96e');
        // ondas
        x.strokeStyle = 'rgba(80,55,30,.25)'; x.lineWidth = 1.5;
        for (let i = 0; i < 70; i++) { const a = 700 + rnd() * 1000, b = 200 + rnd() * 1000; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 10, b - 8, a + 20, b); x.quadraticCurveTo(a + 30, b + 8, a + 40, b); x.stroke(); }
        // rosa
        x.save(); x.translate(1180, 1150); x.fillStyle = '#5a3a1a';
        for (let i = 0; i < 8; i++) { x.rotate(Math.PI / 4); x.beginPath(); x.moveTo(0, 0); x.lineTo(i % 2 ? 26 : 34, 0); x.lineTo(0, i % 2 ? -110 : -160); x.closePath(); x.fillStyle = i % 2 ? '#7a1a12' : '#3a2410'; x.fill(); }
        x.restore();
        x.font = 'italic 46px "IM Fell English",serif'; x.fillStyle = 'rgba(70,45,20,.6)'; x.fillText('Mar Océano', 1080, 520);
        ruido(x, w, h, 20000, .06, '60,30,10');
      });
      scene.add(plano(tex, 120, 70));
      // ruta punteada que se dibuja
      const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push(new THREE.Vector3(43 - u * 70, .05, 3 + Math.sin(u * Math.PI) * -7)); }
      const puntos = pts.map(p => { const m = new THREE.Mesh(new THREE.CircleGeometry(.32, 16), new THREE.MeshBasicMaterial({ color: 0x7a1a12 })); m.rotation.x = -Math.PI / 2; m.position.copy(p); scene.add(m); return m; });
      // barco
      const barco = plano(lienzo(400, 400, (x) => {
        x.strokeStyle = '#2a1d12'; x.lineWidth = 7; x.lineJoin = 'round'; x.fillStyle = '#efe2c2';
        x.beginPath(); x.moveTo(60, 280); x.lineTo(340, 280); x.lineTo(300, 340); x.lineTo(100, 340); x.closePath(); x.fill(); x.stroke();
        x.beginPath(); x.moveTo(200, 280); x.lineTo(200, 50); x.moveTo(120, 280); x.lineTo(120, 120); x.stroke();
        [[200, 70, 90, 90], [200, 170, 110, 95], [120, 135, 60, 120]].forEach(([cx, y, w, h]) => { x.beginPath(); x.moveTo(cx - w / 2, y); x.quadraticCurveTo(cx, y + h * .15, cx + w / 2, y); x.lineTo(cx + w / 2 + 6, y + h); x.quadraticCurveTo(cx, y + h * 1.12, cx - w / 2 - 6, y + h); x.closePath(); x.fill(); x.stroke(); });
        x.fillStyle = '#a3260f'; x.fillRect(193, 190, 14, 60); x.fillRect(170, 213, 60, 14);
        x.fillStyle = '#a3260f'; x.beginPath(); x.moveTo(200, 50); x.lineTo(240, 60); x.lineTo(200, 70); x.fill();
        x.strokeStyle = 'rgba(42,29,18,.6)'; x.lineWidth = 3; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(40 + i * 60, 360); x.quadraticCurveTo(55 + i * 60, 350, 70 + i * 60, 360); x.stroke(); }
      }), 6, 6, true); barco.position.set(-22, .2, 2); scene.add(barco);
      // retrato que cae
      const ret = plano(foto('retrato'), 7, 8.6); ret.position.set(8, .3, -14); scene.add(ret);
      const marco = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 9.2), new THREE.MeshBasicMaterial({ color: 0xf6efe0 })); marco.rotation.x = -Math.PI / 2; marco.position.set(8, .25, -14); scene.add(marco);
      const sombra = new THREE.Mesh(new THREE.PlaneGeometry(8, 9.6), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .25 })); sombra.rotation.x = -Math.PI / 2; scene.add(sombra);
      // sello y título
      const sello = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, .3, 40), new THREE.MeshStandardMaterial({ color: 0x8a1c14, roughness: .5 })); sello.position.set(30, .2, 14); scene.add(sello);
      const tit = cartel('1492', 16, 4, { color: '#7a1a12', font: 'Oswald', size: 170, halo: '#e2cda0' }); tit.position.set(-26, .1, -16); scene.add(tit);
      anim.push((t, ciclo) => {
        const u = (ciclo % 1);
        puntos.forEach((p, i) => p.visible = i / puntos.length < Math.min(1, u * 1.6));
        barco.position.x = -22 + Math.sin(t * .3) * .6; barco.position.z = 2 + Math.sin(t * .7) * .3;
        const caida = Math.min(1, ((t % 14) - 3) / .5); const y = caida < 0 ? 10 : (caida < 1 ? 10 * (1 - caida) * (1 - caida) : 0);
        [ret, marco].forEach((m, k) => { m.position.y = .25 + k * -.05 + y + (k ? 0 : .05); m.rotation.z = .08; });
        sombra.position.set(8.4, .21, -13.6); sombra.material.opacity = .28 * (1 - Math.min(1, y / 10)); sombra.rotation.z = .08;
        const g = (t % 14) - 9; sello.scale.setScalar(g > 0 && g < .25 ? 1.6 - g * 2.4 : 1);
        tit.material.opacity = .4 + .6 * Math.max(0, Math.sin(t * .4));
      });
      return [[-22, 2, 2.4], [8, -14, 2.0], [30, 14, 2.6], [-26, -16, 1.7], [5, 0, .55]];
    }
  };

  // ---------- 2. Escritorio de investigador ----------
  MUNDOS.escritorio = {
    nombre: 'Mesa del investigador', desc: 'Papeles, fotos, hilo rojo y una lupa.', ideal: 'True crime · misterios · biografías · casos',
    fondo: 0x0c0806, niebla: [0x0c0806, 30, 90],
    crear(scene, anim) {
      const madera = lienzo(2048, 1200, (x, w, h) => {
        x.fillStyle = '#3b2416'; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 260; i++) { x.strokeStyle = `rgba(${20 + rnd() * 30},${10 + rnd() * 15},5,${.25 + rnd() * .3})`; x.lineWidth = 1 + rnd() * 3; x.beginPath(); const y = rnd() * h; x.moveTo(0, y); for (let k = 0; k <= 20; k++) x.lineTo(k * w / 20, y + Math.sin(k * .7 + i) * 6); x.stroke(); }
        manchas(x, w, h, 10, '0,0,0', .3); ruido(x, w, h, 15000, .05, '255,220,180');
      });
      scene.add(plano(madera, 110, 64));
      const items = [];
      const poner = (tex, w, h, x, z, r) => { const m = plano(tex, w, h); m.position.set(x, .05 + items.length * .01, z); m.rotation.z = r; scene.add(m); items.push(m); return m; };
      poner(papel(18), 9, 12, -24, -6, .08); poner(papel(14, '#e8dfc9'), 9, 12, -14, 6, -.12);
      const f1 = poner(foto('retrato'), 7, 8.6, 2, -10, .05); poner(foto('edificio'), 7, 8.6, 16, 4, -.09);
      poner(foto('barco'), 7, 8.6, 30, -12, .14); poner(papel(10, '#f3eedd'), 9, 12, 32, 10, .04);
      // chinches + hilo rojo
      const pins = [[-24, -10], [2, -14], [30, -16], [16, 0], [-14, 2]];
      pins.forEach(([a, b]) => { const p = new THREE.Mesh(new THREE.SphereGeometry(.45, 16, 16), new THREE.MeshStandardMaterial({ color: 0xc0201a, roughness: .3 })); p.position.set(a, .6, b); scene.add(p); });
      const hilo = new THREE.Line(new THREE.BufferGeometry().setFromPoints([0, 1, 3, 2, 4, 0].map(i => new THREE.Vector3(pins[i][0], .55, pins[i][1]))), new THREE.LineBasicMaterial({ color: 0xd42a20 }));
      scene.add(hilo);
      // lupa
      const lupa = new THREE.Group();
      const aro = new THREE.Mesh(new THREE.TorusGeometry(3, .32, 16, 60), new THREE.MeshStandardMaterial({ color: 0xb08a4a, metalness: .8, roughness: .3 })); aro.rotation.x = -Math.PI / 2;
      const vidrio = new THREE.Mesh(new THREE.CircleGeometry(3, 40), new THREE.MeshStandardMaterial({ color: 0xbfd6e6, transparent: true, opacity: .18, metalness: .2 })); vidrio.rotation.x = -Math.PI / 2;
      const mango = new THREE.Mesh(new THREE.BoxGeometry(1, .5, 6), new THREE.MeshStandardMaterial({ color: 0x241510 })); mango.position.set(2.6, 0, 5);  mango.rotation.y = -.5;
      lupa.add(aro, vidrio, mango); lupa.position.set(4, 1.2, -9); scene.add(lupa);
      // taza
      const taza = new THREE.Mesh(new THREE.CylinderGeometry(2, 1.8, 3, 32), new THREE.MeshStandardMaterial({ color: 0xece4d4, roughness: .4 })); taza.position.set(-30, 1.5, 14); scene.add(taza);
      const tit = cartel('CASO 47', 14, 3.4, { color: '#F26A2E', size: 150, halo: '#1a0f08' }); tit.position.set(-14, .4, 13); scene.add(tit);
      anim.push((t) => { lupa.position.x = 4 + Math.sin(t * .35) * 3; lupa.position.z = -9 + Math.cos(t * .27) * 2; f1.rotation.z = .05 + Math.sin(t * .5) * .01; });
      return [[-24, -6, 1.5], [2, -10, 1.6], [30, -12, 1.5], [16, 4, 1.6], [-14, 10, 1.4], [0, 0, .6]];
    }
  };

  // ---------- 3. Ciudad de noche ----------
  MUNDOS.ciudad = {
    nombre: 'Ciudad de noche', desc: 'Manzanas, luces y un pin que marca el lugar.', ideal: 'Economía · empresas · crímenes urbanos · geografía',
    fondo: 0x05070c, niebla: [0x05070c, 30, 110],
    crear(scene, anim) {
      const suelo = lienzo(1024, 1024, (x, w, h) => { x.fillStyle = '#0a0d14'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(232,194,122,.35)'; x.lineWidth = 3; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } });
      suelo.wrapS = suelo.wrapT = THREE.RepeatWrapping; suelo.repeat.set(4, 4);
      scene.add(plano(suelo, 160, 160));
      const ventanas = lienzo(128, 256, (x, w, h) => { x.fillStyle = '#121722'; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let c = 0; c < 6; c++) { const on = rnd() < .45; x.fillStyle = on ? (rnd() < .2 ? '#F26A2E' : '#E8C27A') : '#0b0e16'; x.globalAlpha = on ? .55 + rnd() * .45 : 1; x.fillRect(8 + c * 20, 8 + r * 15, 12, 9); } x.globalAlpha = 1; });
      const mat = new THREE.MeshStandardMaterial({ map: ventanas, emissive: 0xffffff, emissiveMap: ventanas, emissiveIntensity: .9, roughness: .8 });
      const techo = new THREE.MeshStandardMaterial({ color: 0x151a24 });
      for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) {
        if (rnd() < .18) continue;
        const h = 1.5 + Math.pow(rnd(), 2.2) * (Math.abs(i) + Math.abs(j) < 5 ? 22 : 9);
        const b = new THREE.Mesh(new THREE.BoxGeometry(5.5, h, 5.5), [mat, mat, techo, techo, mat, mat]);
        b.position.set(i * 8, h / 2, j * 8); scene.add(b);
      }
      const pin = new THREE.Group();
      const cab = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), new THREE.MeshBasicMaterial({ color: C.glow }));
      const pata = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.4, 24), new THREE.MeshBasicMaterial({ color: C.glow })); pata.rotation.x = Math.PI; pata.position.y = -2;
      pin.add(cab, pata); pin.position.set(12, 30, 4); scene.add(pin);
      const aro = new THREE.Mesh(new THREE.RingGeometry(2, 2.5, 48), new THREE.MeshBasicMaterial({ color: C.glow, transparent: true })); aro.rotation.x = -Math.PI / 2; aro.position.set(12, .1, 4); scene.add(aro);
      const tit = cartel('WALL STREET', 30, 6, { color: '#F5F3EF', size: 140, halo: '#05070c' }); tit.position.set(12, 31, 14); tit.rotation.x = -Math.PI / 2.6; scene.add(tit);
      anim.push((t) => { pin.position.y = 28 + Math.sin(t * 2) * .8; const u = (t * .6) % 1; aro.scale.setScalar(1 + u * 4); aro.material.opacity = 1 - u; });
      return [[12, 4, .95, 1.3], [-30, -24, .85], [40, -30, .9], [-20, 30, .85], [0, 0, .42]];
    }
  };

  // ---------- 4. Cielo y constelaciones ----------
  MUNDOS.cielo = {
    nombre: 'Cielo y constelaciones', desc: 'Estrellas que se unen en figuras y un planeta.', ideal: 'Ciencia · espacio · mitología · filosofía',
    fondo: 0x03050c, niebla: [0x03050c, 60, 160],
    crear(scene, anim) {
      const fondo = lienzo(2048, 1200, (x, w, h) => { const g = x.createRadialGradient(w * .6, h * .4, 50, w * .6, h * .4, w * .8); g.addColorStop(0, '#1a1f3a'); g.addColorStop(1, '#03050c'); x.fillStyle = g; x.fillRect(0, 0, w, h); manchas(x, w, h, 14, '120,80,160', .08); manchas(x, w, h, 10, '242,106,46', .05); });
      scene.add(plano(fondo, 160, 94));
      const n = 1800, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = (rnd() - .5) * 160; p[i * 3 + 1] = rnd() * 2; p[i * 3 + 2] = (rnd() - .5) * 94; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const estrellas = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: .32, transparent: true, opacity: .85 })); scene.add(estrellas);
      const figs = [
        { c: [-30, -10], pts: [[0, 0], [4, -3], [9, -2], [12, 2], [8, 6], [3, 5], [0, 0]], n: 'ORIÓN' },
        { c: [20, -18], pts: [[0, 0], [5, 1], [10, -1], [14, 2], [18, 1], [21, 4]], n: 'OSA MAYOR' },
        { c: [-6, 16], pts: [[0, 0], [3, -5], [7, 0], [3, 5], [0, 0]], n: 'CRUZ DEL SUR' },
      ];
      const lineas = figs.map(f => {
        f.pts.forEach(([a, b]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff3d6 })); s.position.set(f.c[0] + a, .5, f.c[1] + b); scene.add(s); });
        const geo = new THREE.BufferGeometry().setFromPoints(f.pts.map(([a, b]) => new THREE.Vector3(f.c[0] + a, .45, f.c[1] + b)));
        const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: C.oro, transparent: true, opacity: .95, linewidth: 2 })); scene.add(l);
        const et = cartel(f.n, 14, 3, { color: '#E8C27A', size: 110, font: 'Oswald', peso: 600 }); et.position.set(f.c[0] + 6, .4, f.c[1] + 9); scene.add(et);
        return { l, n: f.pts.length };
      });
      const planeta = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 48), new THREE.MeshStandardMaterial({ map: lienzo(512, 256, (x, w, h) => { for (let i = 0; i < h; i++) { x.fillStyle = `hsl(${20 + Math.sin(i * .1) * 10},${50 + Math.sin(i * .05) * 20}%,${35 + Math.sin(i * .3) * 12}%)`; x.fillRect(0, i, w, 1); } }), roughness: .8 }));
      planeta.position.set(42, 3, 14); scene.add(planeta);
      const anillo = new THREE.Mesh(new THREE.RingGeometry(9, 13, 80), new THREE.MeshBasicMaterial({ color: C.oro, transparent: true, opacity: .45, side: THREE.DoubleSide })); anillo.position.copy(planeta.position); anillo.rotation.x = -1.2; scene.add(anillo);
      anim.push((t, ciclo) => {
        lineas.forEach((o, k) => o.l.geometry.setDrawRange(0, Math.max(0, Math.min(o.n, Math.floor(((t * .6 + k * 2) % 9))))));
        planeta.rotation.y = t * .15; estrellas.material.opacity = .7 + .15 * Math.sin(t * 3);
      });
      return [[-24, -8, 1.15], [28, -16, 1.15], [-2, 18, 1.25], [42, 14, 1.0], [5, 0, .5]];
    }
  };

  // ---------- 5. Pizarra ----------
  MUNDOS.pizarra = {
    nombre: 'Pizarra de tiza', desc: 'Diagramas, flechas y círculos que se dibujan solos.', ideal: 'Explicaciones · finanzas · cómo funciona X · educación',
    fondo: 0x0a0f0c, niebla: [0x0a0f0c, 40, 120],
    crear(scene, anim) {
      const tex = lienzo(2400, 1400, (x, w, h) => {
        x.fillStyle = '#1c2a22'; x.fillRect(0, 0, w, h); manchas(x, w, h, 30, '255,255,255', .035); ruido(x, w, h, 30000, .05, '255,255,255');
        x.strokeStyle = 'rgba(240,240,230,.85)'; x.fillStyle = 'rgba(240,240,230,.9)'; x.lineWidth = 6; x.lineCap = 'round';
        x.font = '700 96px Oswald'; x.fillText('OFERTA', 300, 330); x.fillText('DEMANDA', 1500, 330);
        x.beginPath(); x.moveTo(300, 1100); x.lineTo(300, 450); x.moveTo(300, 1100); x.lineTo(1000, 1100); x.stroke();
        x.beginPath(); x.moveTo(330, 1000); x.bezierCurveTo(500, 900, 700, 650, 950, 500); x.stroke();
        x.beginPath(); x.moveTo(330, 520); x.bezierCurveTo(500, 650, 700, 900, 950, 1020); x.stroke();
        x.font = '400 54px "Space Mono"'; x.fillText('precio', 160, 430); x.fillText('cantidad', 860, 1170);
        x.beginPath(); x.rect(1400, 450, 300, 180); x.stroke(); x.beginPath(); x.rect(1850, 750, 300, 180); x.stroke(); x.beginPath(); x.rect(1400, 1000, 300, 180); x.stroke();
        x.beginPath(); x.moveTo(1700, 540); x.lineTo(1850, 840); x.moveTo(1850, 840); x.lineTo(1700, 1090); x.stroke();
        x.font = '700 64px Oswald'; x.fillText('$', 1530, 570); x.fillText('?', 1985, 870); x.fillText('%', 1525, 1120);
      });
      scene.add(plano(tex, 120, 70));
      // círculo de tiza naranja que se dibuja
      const pts = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2.1; pts.push(new THREE.Vector3(-26.3 + Math.cos(a) * 4.2, .1, 5.3 + Math.sin(a) * 3.4)); }
      const circ = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: C.glow })); scene.add(circ);
      const flecha = cartel('EQUILIBRIO', 18, 4, { color: '#F26A2E', size: 130 }); flecha.position.set(-16, .15, -2); scene.add(flecha);
      const tiza = new THREE.Mesh(new THREE.BoxGeometry(2.4, .5, .5), new THREE.MeshStandardMaterial({ color: 0xf2efe6 })); tiza.position.set(-20, .4, 26); scene.add(tiza);
      anim.push((t) => { const u = (t * .25) % 1.4; circ.geometry.setDrawRange(0, Math.floor(Math.min(1, u) * 121)); flecha.material.opacity = u > 1 ? 1 : 0; });
      return [[-26, 5, 2.2], [-16, -2, 1.8], [25, -8, 1.7], [30, 10, 2.0], [0, 0, .55]];
    }
  };

  // ---------- 6. Línea de tiempo ----------
  MUNDOS.tiempo = {
    nombre: 'Línea de tiempo', desc: 'Un riel largo con años y tarjetas que se levantan.', ideal: 'Historia de marcas · evolución · antes y después',
    fondo: 0x0B0D12, niebla: [0x0B0D12, 30, 100],
    crear(scene, anim) {
      const piso = lienzo(1024, 1024, (x, w, h) => { x.fillStyle = '#0f1218'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < w; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } });
      piso.wrapS = piso.wrapT = THREE.RepeatWrapping; piso.repeat.set(6, 4);
      scene.add(plano(piso, 200, 80));
      const riel = new THREE.Mesh(new THREE.BoxGeometry(170, .3, .6), new THREE.MeshBasicMaterial({ color: C.glow })); riel.position.y = .15; scene.add(riel);
      const anios = ['1903', '1927', '1955', '1969', '1984', '2007', '2026'];
      const tarjetas = anios.map((a, i) => {
        const x = -75 + i * 25;
        const hito = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .4, 24), new THREE.MeshBasicMaterial({ color: i === 6 ? C.oro : C.cream })); hito.position.set(x, .3, 0); scene.add(hito);
        const et = cartel(a, 12, 3.6, { color: i === 6 ? '#E8C27A' : '#F5F3EF', size: 150 }); et.position.set(x, .2, 5); scene.add(et);
        const tj = plano(foto(['edificio', 'barco', 'retrato', 'paisaje'][i % 4], i < 3), 8, 9.8); tj.position.set(x, .3, -8); scene.add(tj);
        return { tj, x };
      });
      anim.push((t) => { tarjetas.forEach((o, i) => { const u = Math.max(0, Math.sin(t * .5 - i * .7)); o.tj.position.y = .3 + u * 2.2; o.tj.rotation.x = -Math.PI / 2 + u * .5; }); });
      return anios.map((a, i) => [-75 + i * 25, -2, 1.05]).concat([[0, 0, .4]]);
    }
  };

  // ======================= VISOR =======================
  function Visor(canvas, { auto = true, blurCSS = true, onParada } = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    const cam = new THREE.PerspectiveCamera(40, 16 / 9, .1, 400);
    let scene, anim = [], paradas = [], idx = 0, tPar = 0, mundoKey = null;
    // estado del resorte: x, z, log(zoom)
    const s = { x: 0, z: 0, lz: 0, vx: 0, vz: 0, vl: 0 };
    let visible = true, ultimo = performance.now(), reloj = 0, prev = { x: 0, z: 0, lz: 0 };
    const DUR = 3.6;

    function cargar(key) {
      mundoKey = key; const M = MUNDOS[key];
      scene = new THREE.Scene(); scene.background = new THREE.Color(M.fondo);
      scene.fog = new THREE.Fog(M.niebla[0], M.niebla[1], M.niebla[2]);
      scene.add(new THREE.AmbientLight(0xffffff, .5));
      const sol = new THREE.DirectionalLight(0xfff1dc, .5); sol.position.set(-20, 40, 20); scene.add(sol);
      const lamp = new THREE.PointLight(C.glow, .35, 50, 2); lamp.position.set(0, 14, 0); scene.add(lamp); scene.userData.lamp = lamp;
      anim = []; paradas = M.crear(scene, anim);
      idx = 0; tPar = 0;
      const p0 = paradas[paradas.length - 1]; s.x = p0[0]; s.z = p0[1]; s.lz = Math.log(p0[2]); s.vx = s.vz = s.vl = 0;
      if (onParada) onParada(idx, paradas.length, M);
    }
    function tam() { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    window.addEventListener('resize', tam);
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(canvas);

    function paso(ahora) {
      requestAnimationFrame(paso);
      const dtReal = Math.min(.05, (ahora - ultimo) / 1000); ultimo = ahora;
      if (!visible || !scene) return;
      reloj += dtReal; tPar += dtReal;
      if (auto && tPar > DUR) { tPar = 0; idx = (idx + 1) % paradas.length; if (onParada) onParada(idx, paradas.length, MUNDOS[mundoKey]); }
      const k = paradas[idx], nx = paradas[(idx + 1) % paradas.length];
      const d = auto ? .07 * Math.min(1, tPar / DUR) : 0; // deriva
      const tx = k[0] + (nx[0] - k[0]) * d, tz = k[1] + (nx[1] - k[1]) * d, tl = Math.log(k[2]) + (Math.log(nx[2]) - Math.log(k[2])) * d;
      const w = 1.25 * 2.2 * (k[3] || 1), sub = 4, dt = dtReal / sub;
      for (let i = 0; i < sub; i++) {
        s.vx += (w * w * (tx - s.x) - 2 * w * s.vx) * dt; s.x += s.vx * dt;
        s.vz += (w * w * (tz - s.z) - 2 * w * s.vz) * dt; s.z += s.vz * dt;
        s.vl += (w * w * (tl - s.lz) - 2 * w * s.vl) * dt; s.lz += s.vl * dt;
      }
      const zoom = Math.exp(s.lz), D = 30 / zoom;
      const hx = .25 * Math.sin(reloj * .7) + .15 * Math.sin(reloj * 1.9 + 1), hz = .2 * Math.sin(reloj * .9 + .4) + .12 * Math.sin(reloj * 2.3);
      const mano = 1 / Math.max(.6, zoom);
      cam.position.set(s.x + hx * mano * .6, D * .92, s.z + D * .62 + hz * mano * .6);
      cam.lookAt(s.x + hx * mano, 0, s.z + hz * mano);
      cam.rotation.z += .004 * Math.sin(reloj * .5);
      if (scene.userData.lamp) scene.userData.lamp.position.set(s.x, 12, s.z + 4);
      anim.forEach(f => f(reloj, reloj / (DUR * paradas.length)));
      // motion blur por velocidad (pantalla)
      if (blurCSS) {
        const v = Math.hypot(s.x - prev.x, s.z - prev.z) * zoom / Math.max(dtReal, .001) + Math.abs(s.lz - prev.lz) / Math.max(dtReal, .001) * 6;
        const b = Math.max(0, Math.min(3.2, (v - 18) / 22));
        const bb = b * Math.min(1, canvas.clientWidth / 1100); canvas.style.filter = bb > .15 ? `blur(${bb.toFixed(2)}px)` : 'none';
      }
      prev = { x: s.x, z: s.z, lz: s.lz };
      renderer.render(scene, cam);
    }
    tam(); requestAnimationFrame(paso);
    return { cargar, tam, ir(i) { idx = i; tPar = 0; }, get mundo() { return mundoKey; } };
  }

  window.PF_MUNDOS = MUNDOS;
  window.PF_Visor = Visor;
})();
