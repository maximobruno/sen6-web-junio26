/* Medición de sen6.online en la Oficina SEN6: una visita por página, con su fuente (sin cookies ni datos personales).
   - Visitante: id al azar en localStorage (sen6_v), el mismo que manda el quiz.
   - Fuente de la visita: ?f= o utm_source; si no, el sitio de donde viene (google, youtube, instagram, skool…); si no, "directo".
   - Fuente de la sesión (sen6_fuente, la que el quiz manda con el lead): en /noticias queda "noticias", así la conversión
     del blog se ve en la oficina; en el resto se guarda la primera fuente de la sesión. */
(function () {
  var URL_EV = 'https://oficina-sen6.onrender.com/evento', v = '';
  try { v = localStorage.getItem('sen6_v') || ''; if (!v) { v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); localStorage.setItem('sen6_v', v); } } catch (e) {}
  var q = new URLSearchParams(location.search), f = q.get('f') || q.get('utm_source') || '';
  if (!f && document.referrer) {
    try {
      var h = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (h !== location.hostname.replace(/^www\./, '')) {
        f = /(^|\.)google\./.test(h) ? 'google' : /(^|\.)bing\./.test(h) ? 'bing' : /youtube\.com|youtu\.be/.test(h) ? 'youtube'
          : /instagram\.com/.test(h) ? 'instagram' : /facebook\.com|fb\.me/.test(h) ? 'facebook' : /(^|\.)(t\.co|x\.com|twitter\.com)$/.test(h) ? 'x'
          : /skool\.com/.test(h) ? 'skool' : /chatgpt\.com|openai\.com|perplexity|claude\.ai/.test(h) ? 'ia' : h;
      }
    } catch (e) {}
  }
  var enBlog = location.pathname.indexOf('/noticias') === 0, ses = '';
  try { ses = sessionStorage.getItem('sen6_fuente') || ''; if (enBlog) ses = 'noticias'; else if (!ses) ses = f || 'directo'; sessionStorage.setItem('sen6_fuente', ses); } catch (e) {}
  try {
    var b = JSON.stringify({ t: 'visita', v: v, fuente: f || (enBlog ? 'noticias' : ses) || 'directo', path: location.pathname });
    if (!(navigator.sendBeacon && navigator.sendBeacon(URL_EV, new Blob([b], { type: 'text/plain' })))) fetch(URL_EV, { method: 'POST', body: b, keepalive: true, mode: 'cors' });
  } catch (e) {}
})();
