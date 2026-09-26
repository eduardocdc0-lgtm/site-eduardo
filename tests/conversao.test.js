const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.join(__dirname, "..");
const conv = require(path.join(raiz, "js", "conversao.js"));

const PAGINAS = [
  "index.html",
  "bpc-autista-negado/deficiencia/index.html",
  "bpc-autista-negado/renda/index.html",
];

const TAG_GOOGLE = 'src="https://www.googletagmanager.com/gtag/js?id=AW-16981875984"';
const CONFIG = "gtag('config', 'AW-16981875984')";

// ---------- unit: função pura ----------
test("ehContato reconhece WhatsApp e telefone e ignora o resto", () => {
  assert.equal(conv.ehContato("https://wa.me/5581984084525?text=oi"), true);
  assert.equal(conv.ehContato("https://api.whatsapp.com/send?phone=55"), true);
  assert.equal(conv.ehContato("tel:+5581984084525"), true);
  assert.equal(conv.ehContato("https://adveduardorodrigues.com.br/"), false);
  assert.equal(conv.ehContato("#faq"), false);
  assert.equal(conv.ehContato(""), false);
  assert.equal(conv.ehContato(null), false);
});

// ---------- behavior: clique no botão dispara a conversão ----------
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

test("clique num link data-wpp hidratado com wa.me dispara gtag com o send_to certo", () => {
  const doc = docFalso();
  const chamadas = [];
  conv.instala(doc, () => (...a) => chamadas.push(a));
  const a = el("A", { href: "https://wa.me/5581984084525?text=oi" });
  doc.clicar(a);
  assert.equal(chamadas.length, 1);
  assert.deepEqual(chamadas[0], ["event", "conversion", { send_to: conv.SEND_TO, value: 1.0, currency: "BRL" }]);
  assert.equal(conv.SEND_TO, "AW-16981875984/c_WJCKSr3IMdEJC6y6E_");
});

test("clique no ícone dentro do botão sobe até o <a> e conta uma vez só", () => {
  const doc = docFalso();
  const chamadas = [];
  conv.instala(doc, () => (...a) => chamadas.push(a));
  const a = el("A", { href: "tel:+5581984084525" });
  const svg = el("svg", {}, a);
  const pathEl = el("path", {}, svg);
  doc.clicar(pathEl);
  assert.equal(chamadas.length, 1);
});

test("clique em link comum ou fora de link não dispara nada", () => {
  const doc = docFalso();
  const chamadas = [];
  conv.instala(doc, () => (...a) => chamadas.push(a));
  doc.clicar(el("A", { href: "#faq" }));
  doc.clicar(el("BUTTON", {}));
  doc.clicar(el("DIV", {}));
  assert.equal(chamadas.length, 0);
});

test("se o gtag ainda não carregou, o clique não quebra a página", () => {
  const doc = docFalso();
  conv.instala(doc, () => undefined);
  assert.doesNotThrow(() => doc.clicar(el("A", { href: "https://wa.me/55" })));
  assert.equal(conv.registra(undefined), false);
});

// ---------- integração: as páginas publicadas carregam a tag e o script ----------
for (const p of PAGINAS) {
  test(`${p} tem a tag do Google no <head> e o script de conversão`, () => {
    const html = fs.readFileSync(path.join(raiz, p), "utf8");
    const head = html.slice(0, html.indexOf("</head>"));
    assert.ok(head.includes(TAG_GOOGLE), "gtag.js ausente no head");
    assert.ok(head.includes(CONFIG), "config AW-16981875984 ausente no head");
    assert.ok(html.includes('src="/js/conversao.js"'), "conversao.js não carregado");
    assert.ok(/wa\.me|data-wpp/.test(html), "página sem botão de WhatsApp");
  });
}

test("a tag do Google aparece uma vez só por página", () => {
  for (const p of PAGINAS) {
    const html = fs.readFileSync(path.join(raiz, p), "utf8");
    assert.equal(html.split(TAG_GOOGLE).length - 1, 1, p);
  }
});
