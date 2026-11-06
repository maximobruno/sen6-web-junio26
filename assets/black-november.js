/* Black November 2026 · pop-up (home) y franja inferior (resto de páginas).
   Se apaga solo al cierre: 27 nov 2026, 23:59 hora de Monterrey (UTC-6).
   Vista previa sin esperar ni recordar el cierre: agregar ?bn=1 a la URL. */
(function () {
  var FIN = Date.parse('2026-11-28T05:59:59Z');
  var CLAVE = 'sen6-bn26';
  var PAUSA = 3 * 24 * 3600 * 1000; // vuelve a aparecer a los 3 días
  var forzar = /[?&]bn=1\b/.test(location.search);
  if (Date.now() > FIN && !forzar) return;

  function leer() { try { return +localStorage.getItem(CLAVE) || 0; } catch (e) { return 0; } }
  function guardar() { try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) {} }
  if (!forzar && Date.now() - leer() < PAUSA) return;

  var p = location.pathname;
  var enHome = p === '/' || p === '/index.html';
  var destino = enHome ? '#quiz' : '/#quiz';
  var reducido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function evento(n) { try { if (window.gtag) window.gtag('event', n, { promo: 'black_november_2026' }); } catch (e) {} }

  function restante() {
    var s = Math.max(0, Math.floor((FIN - Date.now()) / 1000));
    var d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600); s %= 3600;
    var m = Math.floor(s / 60); s %= 60;
    return { d: d, h: h, m: m, s: s };
  }
  function dos(n) { return (n < 10 ? '0' : '') + n; }

  var css = '' +
    '.bn-fondo{position:fixed;inset:0;z-index:9998;background:rgba(11,13,18,.62);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .35s ease}' +
    '.bn-fondo.on{opacity:1}' +
    '.bn-card{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow-x:hidden;overflow-y:auto;background:#0B0D12;color:#F5F3EF;border-radius:24px;padding:28px 24px 18px;text-align:center;box-shadow:0 40px 80px -30px rgba(0,0,0,.7),0 0 0 1px rgba(244,199,107,.28);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;transform:translateY(18px) scale(.97);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)}' +
    '.bn-fondo.on .bn-card{transform:none}' +
    '.bn-card::before{content:"";position:absolute;left:50%;top:-140px;transform:translateX(-50%);width:120%;height:320px;border-radius:50%;background:radial-gradient(closest-side,rgba(212,69,10,.55),rgba(212,69,10,0));pointer-events:none}' +
    '.bn-card>*{position:relative}' +
    '.bn-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:#F5F3EF;font-size:26px;line-height:1;cursor:pointer;opacity:.7}' +
    '.bn-x:hover{opacity:1;background:rgba(245,243,239,.08)}' +
    '.bn-logo{width:44px;height:44px;display:block;margin:0 auto 10px}' +
    '.bn-eye{font-family:"Space Mono",ui-monospace,monospace;font-size:.72rem;letter-spacing:.32em;color:#F4C76B;margin:0 0 10px}' +
    '.bn-h{font-family:Oswald,Inter,sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(2rem,9vw,2.6rem);line-height:1;letter-spacing:.01em;margin:0}' +
    '.bn-serif{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:clamp(1.5rem,6.4vw,1.9rem);color:#F4C76B;line-height:1.15;margin:4px 0 14px}' +
    '.bn-txt{font-weight:700;text-transform:uppercase;letter-spacing:.02em;font-size:.98rem;line-height:1.3;margin:0 0 14px}' +
    '.bn-reloj{display:flex;justify-content:center;gap:8px;margin:0 0 6px}' +
    '.bn-reloj div{min-width:60px;padding:10px 4px 8px;border-radius:12px;background:rgba(245,243,239,.06);box-shadow:inset 0 0 0 1px rgba(245,243,239,.1)}' +
    '.bn-reloj b{display:block;font-family:Oswald,Inter,sans-serif;font-size:1.6rem;line-height:1;font-variant-numeric:tabular-nums}' +
    '.bn-reloj span{display:block;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:#a9a39a;margin-top:4px}' +
    '.bn-cierra{font-size:.8rem;color:#a9a39a;margin:0 0 14px}' +
    '.bn-btn{display:flex;align-items:center;justify-content:center;min-height:56px;padding:0 22px;border-radius:14px;background:#D4450A;color:#fff;font-weight:800;font-size:1.02rem;text-decoration:none;box-shadow:0 12px 28px -10px rgba(242,106,46,.75),inset 0 1px 0 rgba(255,255,255,.2);transition:transform .2s ease,background .2s ease}' +
    '.bn-btn:hover{background:#F26A2E;transform:translateY(-1px)}' +
    '.bn-no{display:inline-block;margin-top:6px;min-height:40px;border:0;background:transparent;color:#a9a39a;font:inherit;font-size:.86rem;cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '.bn-sorteo{font-family:"Space Mono",ui-monospace,monospace;font-size:.7rem;letter-spacing:.28em;color:#F4C76B;margin:8px 0 0}' +
    /* franja */
    '.bn-franja{position:fixed;left:12px;right:12px;bottom:12px;z-index:9997;display:flex;align-items:center;gap:12px;padding:10px 8px 10px 16px;border-radius:16px;background:#0B0D12;color:#F5F3EF;box-shadow:0 20px 40px -18px rgba(0,0,0,.6),0 0 0 1px rgba(244,199,107,.28);font-family:Inter,system-ui,sans-serif;transform:translateY(140%);transition:transform .45s cubic-bezier(.2,.9,.3,1.1);max-width:760px;margin:0 auto}' +
    '.bn-franja.on{transform:none}' +
    '.bn-franja p{margin:0;flex:1;min-width:0;font-size:.84rem;line-height:1.3}' +
    '.bn-franja p b{display:block;font-size:.66rem;letter-spacing:.22em;color:#F4C76B;font-weight:700}' +
    '.bn-franja .bn-tiempo{color:#a9a39a;font-variant-numeric:tabular-nums}' +
    '.bn-franja a{flex:none;display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:12px;background:#D4450A;color:#fff;font-weight:800;font-size:.84rem;text-decoration:none;white-space:nowrap}' +
    '.bn-franja button{flex:none;width:40px;height:44px;border:0;background:transparent;color:#F5F3EF;font-size:22px;cursor:pointer;opacity:.7}' +
    '@media (max-height:640px){.bn-logo,.bn-cierra{display:none}.bn-card{padding-top:22px}}' +
    '@media (max-width:420px){.bn-franja .bn-tiempo{display:none}}' +
    '@media (prefers-reduced-motion:reduce){.bn-fondo,.bn-card,.bn-franja{transition:none}}';

  function estilos() {
    if (document.getElementById('bn-css')) return;
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Instrument+Serif:ital@1&family=Space+Mono:wght@400&display=swap';
    document.head.appendChild(f);
    var s = document.createElement('style'); s.id = 'bn-css'; s.textContent = css;
    document.head.appendChild(s);
  }

  var mostrado = false;

  function popup() {
    if (mostrado) return; mostrado = true;
    estilos();
    var antes = document.activeElement;
    var fondo = document.createElement('div');
    fondo.className = 'bn-fondo';
    fondo.innerHTML =
      '<div class="bn-card" role="dialog" aria-modal="true" aria-labelledby="bn-h">' +
        '<button class="bn-x" type="button" aria-label="Cerrar">&times;</button>' +
        '<img class="bn-logo" src="/assets/isotipo-crema-160.webp" alt="" width="44" height="44">' +
        '<p class="bn-eye">BLACK NOVEMBER · SEN6</p>' +
        '<h2 class="bn-h" id="bn-h">Ellos ya lo lograron</h2>' +
        '<p class="bn-serif">y vos podés ser el próximo</p>' +
        '<p class="bn-txt">Entrá en noviembre y participá por Ether</p>' +
        '<div class="bn-reloj" aria-hidden="true">' +
          '<div><b data-u="d">0</b><span>días</span></div><div><b data-u="h">00</b><span>horas</span></div>' +
          '<div><b data-u="m">00</b><span>min</span></div><div><b data-u="s">00</b><span>seg</span></div>' +
        '</div>' +
        '<p class="bn-cierra">La promo cierra el 27 de noviembre a las 23:59 (hora de Monterrey)</p>' +
        '<a class="bn-btn" href="' + destino + '">Hacé el quiz y descubrí tu plan</a>' +
        '<button class="bn-no" type="button">Ahora no</button>' +
        '<p class="bn-sorteo">SORTEO · 28 DE DICIEMBRE</p>' +
      '</div>';
    document.body.appendChild(fondo);
    var nums = fondo.querySelectorAll('[data-u]');
    function tic() {
      var r = restante();
      for (var i = 0; i < nums.length; i++) {
        var u = nums[i].getAttribute('data-u');
        nums[i].textContent = u === 'd' ? r.d : dos(r[u]);
      }
    }
    tic(); var reloj = setInterval(tic, 1000);
    requestAnimationFrame(function () { fondo.classList.add('on'); });
    var x = fondo.querySelector('.bn-x');
    x.focus({ preventScroll: true });

    function cerrar() {
      guardar(); clearInterval(reloj);
      document.removeEventListener('keydown', teclas);
      fondo.classList.remove('on');
      setTimeout(function () { fondo.remove(); }, reducido ? 0 : 350);
      if (antes && antes.focus) try { antes.focus({ preventScroll: true }); } catch (e) {}
    }
    function teclas(e) {
      if (e.key === 'Escape') { cerrar(); evento('bn_cerrar'); }
      if (e.key === 'Tab') { // mantener el foco dentro del cartel
        var f = fondo.querySelectorAll('a,button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    document.addEventListener('keydown', teclas);
    x.addEventListener('click', function () { cerrar(); evento('bn_cerrar'); });
    fondo.querySelector('.bn-no').addEventListener('click', function () { cerrar(); evento('bn_cerrar'); });
    fondo.addEventListener('click', function (e) { if (e.target === fondo) { cerrar(); evento('bn_cerrar'); } });
    fondo.querySelector('.bn-btn').addEventListener('click', function () { evento('bn_quiz'); cerrar(); });
    evento('bn_ver');
  }

  function franja() {
    if (mostrado) return; mostrado = true;
    estilos();
    var el = document.createElement('div');
    el.className = 'bn-franja';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Promo Black November');
    el.innerHTML =
      '<p><b>BLACK NOVEMBER</b>Entrá en noviembre y participá por Ether <span class="bn-tiempo"></span></p>' +
      '<a href="' + destino + '">Hacé el quiz</a>' +
      '<button type="button" aria-label="Cerrar">&times;</button>';
    document.body.appendChild(el);
    var t = el.querySelector('.bn-tiempo');
    function tic() { var r = restante(); t.textContent = '· cierra en ' + r.d + 'd ' + dos(r.h) + 'h ' + dos(r.m) + 'm'; }
    tic(); var reloj = setInterval(tic, 30000);
    requestAnimationFrame(function () { el.classList.add('on'); });
    function cerrar() { guardar(); clearInterval(reloj); el.classList.remove('on'); setTimeout(function () { el.remove(); }, 450); }
    el.querySelector('button').addEventListener('click', function () { cerrar(); evento('bn_cerrar'); });
    el.querySelector('a').addEventListener('click', function () { evento('bn_quiz'); guardar(); });
    evento('bn_ver');
  }

  function iniciar() {
    if (!enHome) {
      // blog y demás páginas: franja chica abajo, sin tapar el contenido
      var lanzar = function () { window.removeEventListener('scroll', alBajar); franja(); };
      var alBajar = function () { if (scrollY > innerHeight * 0.6) lanzar(); };
      window.addEventListener('scroll', alBajar, { passive: true });
      setTimeout(lanzar, forzar ? 300 : 6000);
      return;
    }
    // home: no interrumpir a quien está haciendo el quiz
    var quiz = document.getElementById('quiz-card');
    var usandoQuiz = false;
    if (quiz) quiz.addEventListener('click', function () { usandoQuiz = true; }, { once: true });
    function quizEnPantalla() {
      if (!quiz) return false;
      var r = quiz.getBoundingClientRect();
      return r.top < innerHeight * 0.7 && r.bottom > innerHeight * 0.3;
    }
    function intentar() {
      if (mostrado || usandoQuiz) return;
      if (quizEnPantalla()) { setTimeout(intentar, 5000); return; }
      popup();
    }
    setTimeout(intentar, forzar ? 300 : 9000);
    window.addEventListener('scroll', function alBajar() {
      var h = document.documentElement.scrollHeight - innerHeight;
      if (h > 0 && scrollY / h > 0.45) { window.removeEventListener('scroll', alBajar); intentar(); }
    }, { passive: true });
    // compu: cuando el mouse sale por arriba para irse
    if (matchMedia('(pointer:fine)').matches) {
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0) intentar();
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
