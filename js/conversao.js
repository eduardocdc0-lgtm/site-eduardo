/* Conversão do Google Ads: o site não tem página de "obrigado", a conversão
   é o clique no WhatsApp ou no telefone. Escuta o clique no documento inteiro,
   então pega os botões hidratados depois (data-wpp) e os links fixos da home.
   A tag do Google (gtag.js, AW-16981875984) precisa estar no <head> da página. */
(function (root) {
  var SEND_TO = "AW-16981875984/c_WJCKSr3IMdEJC6y6E_";

  function ehContato(href) {
    if (!href) return false;
    return /wa\.me\/|api\.whatsapp\.com|^tel:/i.test(href);
  }

  function registra(gtag) {
    if (typeof gtag !== "function") return false;
    gtag("event", "conversion", { send_to: SEND_TO, value: 1.0, currency: "BRL" });
    return true;
  }

  function instala(doc, getGtag) {
    doc.addEventListener("click", function (e) {
      var alvo = e.target;
      while (alvo && alvo.tagName !== "A") alvo = alvo.parentNode;
      if (!alvo || !alvo.getAttribute) return;
      if (ehContato(alvo.getAttribute("href"))) registra(getGtag());
    }, true);
  }

  var api = { SEND_TO: SEND_TO, ehContato: ehContato, registra: registra, instala: instala };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else if (root.document) {
    instala(root.document, function () { return root.gtag; });
  }
})(typeof window !== "undefined" ? window : this);
