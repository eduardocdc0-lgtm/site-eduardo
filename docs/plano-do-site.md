# Plano do site (30/10/2026)

Método dos 7 prompts do post "O Claude deixa o seu site com cara de site da Apple"
(Guilherme Morais, instagram.com/p/DejicDzkZef/), rodado na ordem, com o que vale pro escritório.
O que cada prompt decidiu está aqui. O que virou código está em `index.html`.

## 1. Planta do site

Quem chega: segurado do INSS, de Carpina, da Zona da Mata e do Nordeste, vindo de anúncio ou do
Instagram, no celular, muitas vezes com internet fraca. Quer saber duas coisas: se tem direito e se
pode confiar.

Sensação nos 3 primeiros segundos: esse escritório existe, fica em Carpina e explica antes de cobrar.

Ordem dos blocos, de cima pra baixo:

1. Topo fixo: marca e botão de WhatsApp.
2. Primeira dobra: título, uma frase, o botão, e a prova (OAB, endereço, nota no Google), com a foto do Eduardo.
3. Seu caso é um desses: os quatro produtos escritos como pergunta, na fala do segurado, cada um com um link de WhatsApp já com o assunto.
4. Nordeste: por que o escritório é daqui e atende os nove estados.
5. Como funciona: quatro passos, o mesmo texto da página de links da bio.
6. O que mais perguntam: as cinco dúvidas que travam o clique.
7. Quem já passou por isso: nota do Google, link pras avaliações, três depoimentos sem nome e sem resultado.
8. O escritório: foto, endereço e mapa.
9. Fale com o escritório: convite e botão.
10. Rodapé: OAB, endereço, aviso do Provimento 205 e privacidade.

No celular, uma barra fixa no pé da tela com o botão de WhatsApp. Ele nunca some.

Fora da planta: aposentadoria e revisão como produto em destaque (fora da tabela do manual do closer),
número de clientes ou contratos, valor em reais, depoimento com resultado, "especialista".

## 2. Primeira dobra

Três títulos pra testar. O primeiro está no ar.

1. Do Nordeste, pro povo do Nordeste.
2. Você entende o seu direito antes de decidir qualquer coisa.
3. O INSS negou? Em Carpina tem quem olhe o seu caso.

Frase de apoio: escritório de advocacia previdenciária em Carpina, na Zona da Mata de Pernambuco, que
cuida do INSS de quem trabalha no Nordeste inteiro e explica o direito antes de a pessoa decidir.

Prova visível sem rolar: foto do Eduardo, OAB/PE 64.717 com o nome completo, Rua Djalma Dutra, 123,
e a nota 5,0 no Google com 188 avaliações (conferido em 30/10).

Um botão só: "Falar com o escritório", que abre o WhatsApp (81) 99930-4526 com a mensagem
"Olá, vim pelo site do escritório".

## 3. Como o site se mexe

Quase nada. O público usa celular básico e internet fraca.

- Sem animação de entrada, sem efeito ao rolar, sem script além do da conversão do Google Ads.
- Só o botão muda de cor ao passar o mouse e afunda um pixel ao tocar.
- O botão de WhatsApp nunca se mexe e nunca some. No celular ele é a barra fixa do pé da tela.
- Uma fonte (Poppins, três pesos) carregada com `display=swap`. Se não chegar, o texto aparece na fonte do aparelho.
- Quem pede menos movimento no aparelho não recebe rolagem suave.

## 4. Texto

Regras que valeram pra cada frase:

- Palavras do segurado: "caiu de moto", "botou placa", "tá encostado", "cortou o benefício", "negou".
- As dúvidas que travam viraram seção: precisa ir no escritório, cobra pra olhar, é golpe, já negou, demora.
- Sem promessa de resultado, sem valor, sem número de cliente, sem "especialista", sem "recurso". É "ação judicial" ou "procurar a Justiça".
- Saúde falada pelo benefício e pelo lugar (laudo, CAPS, escola), nunca pela doença da pessoa.
- Quem atende é a equipe. O Eduardo acompanha o caso. O site não diz "quem vai te atender sou eu".
- Honorário não aparece no site. Isso a equipe explica no WhatsApp antes de qualquer assinatura.
- Frase curta, ordem direta, sem travessão.

## 5. Plano de construção

- Um arquivo `index.html`, sem framework, sem build. Sobe no GitHub Pages como está.
- Marca igual à do Instagram e da página de links: preto `#0B0B0B`, branco, Poppins 400/700/800, borda de 2px, caixa alta nos títulos.
- Fotos do banco do Figma (arquivo "Carrossel imersão", página "Banco de fotos"), em webp, no máximo 880px de largura, com `width` e `height` no HTML pra não pular a página enquanto carrega. A do topo tem `fetchpriority="high"`, as outras `loading="lazy"`.
- Blocos que se repetem e que servem pra uma página por benefício: o bloco "caso" (pergunta, explicação, link de WhatsApp com o assunto), os quatro passos, as dúvidas em `details`, a prova do Google, o rodapé.
- Próximas páginas, nessa ordem: auxílio-acidente, salário-maternidade, BPC TEA, BPC, auxílio-doença. As duas de BPC autista que já existem (`bpc-autista-negado/`) continuam no ar e entram na auditoria abaixo.
- Conversão do Google Ads: o `js/conversao.js` escuta o clique em qualquer link `wa.me` ou `tel:`. Não mudou.
- Teste: `npm test` confere a tag do Google e o botão de WhatsApp em cada página.

## 6. Auditoria de conversão

Feita em 30/10 no site que estava no ar e nas duas páginas de BPC autista.

Página principal, antes desta versão:

| Onde travava | Correção |
| --- | --- |
| O único botão de WhatsApp ficava no fim de uma página com mais de 12 telas de altura no celular | Botão no topo, na primeira dobra, em cada produto e numa barra fixa no celular |
| "Treze anos" e "+2 mil processos" não batiam com a imersão nem com o manual do closer | Saíram. A prova agora é OAB, endereço e Google |
| WhatsApp (81) 98855-3190, diferente do perfil no Google e da bio | Trocado pelo (81) 99930-4526 em todos os botões |
| Depoimento com o nome do filho da cliente e a condição de saúde | Nome saiu |
| 189 avaliações no site, 188 no Google | 188 |
| "Quem vai te atender sou eu" | A equipe atende, o Eduardo acompanha |
| Azul com fonte serifada, diferente do Instagram e da bio | Preto e branco com Poppins |
| Salário-maternidade, o maior produto da casa, não aparecia | Entrou como um dos quatro casos |

Páginas de BPC autista (`bpc-autista-negado/deficiencia` e `/renda`), corrigido nesta versão: número
de WhatsApp, "13 anos" (saiu) e "189 avaliações" (188).

O que ficou pra decidir nas páginas de BPC autista:

- "Falar com especialista" e "Quero falar com um especialista" aparecem 16 vezes. O Provimento 205 só permite "especialista" com título registrado na OAB. Trocar por "Falar com o escritório".
- "Análise gratuita" aparece 8 vezes. Referência a gratuidade em peça de captação é risco pelo Provimento. Trocar por "Conversar pelo WhatsApp".
- "Reverter minha negativa agora" soa como promessa de resultado. Trocar por "Falar sobre a minha negativa".
- As duas páginas dizem "Atendemos em todo o Brasil". A principal diz Nordeste. Alinhar.
- As duas páginas usam azul e as fontes Inter e Instrument Sans. Quando forem refeitas, entram na marca preto e branco.

Métrica que prova: cliques no WhatsApp por visita. Hoje, pelo Instagram, 6% de quem visita clica.
A meta da primeira semana é passar disso no site.

## 7. Plano de lançamento

Dia 0, ao subir:

- Cadastrar o site no perfil do Google (hoje aparece "Adicionar website").
- Trocar o link da bio do Instagram pela página de links, que leva pra cá.
- Conferir no celular de verdade, com 4G, os dez links de WhatsApp.

Semana 1 a 4 (tráfego que o escritório controla):

- Anúncio: as campanhas que já rodam continuam mandando pro WhatsApp. O site entra como destino só da campanha do Google Ads, que já tem a conversão medida.
- Instagram: o posicionamento manda quem visita o perfil pra bio, e a bio pra cá.
- O que olhar toda segunda, no resumo da semana: visitas ao site (Google Ads e Search Console), cliques no WhatsApp (conversão do Google Ads) e quantas dessas conversas viraram contrato no CRM.

Quando parar de mexer: depois de 30 dias com o mesmo título. Só aí trocar pelo título 2 ou 3 e comparar
os cliques por visita. Uma mudança por vez.
