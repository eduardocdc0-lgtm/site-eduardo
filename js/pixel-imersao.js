/* Pixel da Meta na página da imersão (3569814383178707). O fbq('init') e o
   PageView ficam no <head> da página. Aqui moram os três passos de quem quer
   a vaga:
   - clique em "Garantir vaga" ou "Quero minha vaga" (link pra #lista) = CliqueVaga
   - formulário enviado (a pessoa chega na tela do pagamento) = Lead
   - clique no link do Asaas = InitiateCheckout
   A compra paga (Purchase) sai do CRM pessoal, pelo aviso do Asaas. */
(function (root) {
  var VALOR = { value: 47, currency: "BRL" };

  function tipoDoClique(href) {
    if (!href) return null;
    if (/asaas\.com/i.test(href)) return "pagamento";
    if (href === "#lista") return "vaga";
    return null;
  }

  function cria(getFbq) {
    var leadContado = false;
    function manda() {
      var fbq = getFbq();
      if (typeof fbq !== "function") return false;
      fbq.apply(null, arguments);
      return true;
    }
    return {
      clique: function (href) {
        var tipo = tipoDoClique(href);
        if (tipo === "vaga") return manda("trackCustom", "CliqueVaga");
        if (tipo === "pagamento") return manda("track", "InitiateCheckout", VALOR);
        return false;
      },
      cadastro: function () {
        if (leadContado) return false;
        leadContado = manda("track", "Lead", VALOR);
        return leadContado;
      },
    };
  }

  function instala(doc, getFbq) {
    var p = cria(getFbq);
    doc.addEventListener("click", function (e) {
      var alvo = e.target;
      while (alvo && alvo.tagName !== "A") alvo = alvo.parentNode;
      if (!alvo || !alvo.getAttribute) return;
      p.clique(alvo.getAttribute("href"));
    }, true);
    return p;
  }

  var api = { tipoDoClique: tipoDoClique, cria: cria, instala: instala };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else if (root.document) {
    root.PixelImersao = instala(root.document, function () { return root.fbq; });
  }
})(typeof window !== "undefined" ? window : this);
