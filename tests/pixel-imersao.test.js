const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.join(__dirname, "..");
const pixel = require(path.join(raiz, "js", "pixel-imersao.js"));
const PAGINA = fs.readFileSync(path.join(raiz, "imersao", "index.html"), "utf8");

// ---------- unit ----------
test("tipoDoClique separa botão da vaga, pagamento e o resto", () => {
  assert.equal(pixel.tipoDoClique("#lista"), "vaga");
  assert.equal(pixel.tipoDoClique("https://www.asaas.com/000/c/k36iihl6a2ueqwkj"), "pagamento");
  assert.equal(pixel.tipoDoClique("#topo"), null);
  assert.equal(pixel.tipoDoClique("https://wa.me/5581"), null);
  assert.equal(pixel.tipoDoClique(""), null);
  assert.equal(pixel.tipoDoClique(null), null);
});

// ---------- behavior ----------
function docFalso() {
  const ouvintes = [];
  return {
    addEventListener(tipo, fn) { ouvintes.push({ tipo, fn }); },
    clicar(el) { ouvintes.filter(o => o.tipo === "click").forEach(o => o.fn({ target: el })); },
  };
}
function el(tag, attrs, parentNode) {
  return { tagName: tag, parentNode, getAttribute: k => (attrs || {})[k] ?? null };
}
function montar() {
  const doc = docFalso();
  const chamadas = [];
  const p = pixel.instala(doc, () => (...a) => chamadas.push(a));
  return { doc, chamadas, p };
}

test("clique em Quero minha vaga manda CliqueVaga", () => {
  const { doc, chamadas } = montar();
  doc.clicar(el("A", { href: "#lista" }));
  assert.deepEqual(chamadas, [["trackCustom", "CliqueVaga"]]);
});

test("clique no link do Asaas manda InitiateCheckout com R$ 47", () => {
  const { doc, chamadas } = montar();
  const a = el("A", { href: "https://www.asaas.com/000/c/k36iihl6a2ueqwkj" });
  doc.clicar(el("span", {}, a));
  assert.deepEqual(chamadas, [["track", "InitiateCheckout", { value: 47, currency: "BRL" }]]);
});

test("clique em outro link ou fora de link não manda nada", () => {
  const { doc, chamadas } = montar();
  doc.clicar(el("A", { href: "#topo" }));
  doc.clicar(el("div", {}));
  assert.equal(chamadas.length, 0);
});

test("formulário enviado conta Lead uma vez só", () => {
  const { chamadas, p } = montar();
  assert.equal(p.cadastro(), true);
  assert.equal(p.cadastro(), false);
  assert.deepEqual(chamadas, [["track", "Lead", { value: 47, currency: "BRL" }]]);
});

test("sem o fbq carregado (bloqueador de anúncio) nada quebra, e o Lead ainda pode contar depois", () => {
  let fbq = undefined;
  const chamadas = [];
  const p = pixel.cria(() => fbq);
  assert.equal(p.clique("#lista"), false);
  assert.equal(p.cadastro(), false);
  fbq = (...a) => chamadas.push(a);
  assert.equal(p.cadastro(), true);
  assert.equal(chamadas.length, 1);
});

// ---------- a página ----------
test("a página da imersão inicia o pixel certo, carrega o script e conta o cadastro", () => {
  assert.ok(PAGINA.includes("fbq('init','3569814383178707')"));
  assert.ok(PAGINA.includes('<script src="../js/pixel-imersao.js"></script>'));
  assert.ok(/function mostraPagamento\(\) \{\s*if \(window\.PixelImersao\) window\.PixelImersao\.cadastro\(\)/.test(PAGINA));
  assert.equal((PAGINA.match(/InitiateCheckout/g) || []).length, 0, "InitiateCheckout em dobro na página");
});
