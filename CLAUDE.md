# Chá de casa nova — Tata e Tutu

> Contexto para o Claude Code. Projeto clonado em 16/09/2026 a partir de
> `../presentes` (lista do Matheus), mantendo o design system **Organic** e toda a
> mecânica de reserva. O que muda aqui é conteúdo e as contas envolvidas.

## O que é

Lista de presentes do chá de casa nova da **Tata e do Tutu**. Página pública única:
quem entra busca/filtra um item, clica em **"Eu dou esse"** (marca o item e abre o
WhatsApp) ou manda um PIX.

- **Repositório:** `github.com/<usuario-dela>/presentes` — *a criar*
- **URL prevista:** `https://<usuario-dela>.github.io/presentes/`
- **Deploy:** GitHub Pages, branch `main`, pasta `/`. Commit + push → ~1 min.
- Quem publica é o Matheus, logado na conta GitHub dela.

## Estrutura

Sem build, sem dependências, vanilla. Mesmos arquivos do projeto original:

| Arquivo | O quê |
|---|---|
| `index.html` | Casca estática: header, faixa de stats, controles, âncoras de render, bloco PIX, footer |
| `styles.css` | Tokens do design system Organic + camada da página. **Cópia literal** do `../presentes` |
| `app.js` | Dados (`ITENS`, `JA_TEM`), estado, filtros, sincronização, render |
| `reservas.gs` | Apps Script da reserva compartilhada. **Não é servido pelo Pages** — mora aqui como fonte versionada |
| `.nojekyll` | Precisa continuar no repositório |

Bloco de configuração no topo do `app.js`: `FONE`, `CHAVE_PIX`, `PIX_LABEL`, `PIX_DONO`,
`RESERVAS_URL`, `CASAL`.

## Dados desta lista

- **Contato:** Thaís Fagundes — WhatsApp `+55 27 99254-6458` (constante `FONE`).
- **PIX: é o CPF**, não o celular (mudou em 17/09/2026). `CHAVE_PIX` guarda só os dígitos
  (`19931010711`) porque é o que o botão copia e o que cola limpo no app do banco;
  `PIX_LABEL` guarda a versão formatada (`199.310.107-11`), que é o que aparece na tela.
  O rótulo do cartão no `renderEstaticos()` diz "Chave PIX (CPF)" — se a chave mudar de tipo,
  esse texto tem que mudar junto.
  O usuário foi avisado de que a página é pública e o CPF fica exposto; optou por manter.
  Alternativa, se mudarem de ideia: chave aleatória do PIX, que não expõe documento.
- **33 itens**, todos com link do Mercado Livre escolhido pelo casal. Os 4 últimos
  (kit bowl de cerâmica, fatiador + centrífuga, mixer, assadeiras de vidro) chegaram
  em 18/09/2026, depois da primeira publicação.
  Os links foram **limpos** dos parâmetros de tracking (`#polycard_client`, `tracking_id`,
  `ad_click_id` etc.) — ficou só o caminho canônico do produto. Ao adicionar item novo,
  faça o mesmo: link comprido de busca quebra e expira.
- **30 dos 33 itens têm preço real**, lido das páginas do Mercado Livre (26 em 17/09/2026,
  mais 4 em 18/09/2026).
  Não são estimativas — é o valor anunciado no dia. O card mostra "aprox." ao lado porque
  preço de marketplace muda toda hora.
- **3 itens ficaram em `preco: null`** e caem na faixa "A combinar": `kitpia`, `kitlavabo`
  e `lixeirabanh`. Os anúncios estão **indisponíveis** no Mercado Livre — por isso a leitura
  devolveu `0` (kitpia, lixeirabanh) ou nada (kitlavabo, que ainda por cima está em
  `produto.mercadolivre.com.br`, outro subdomínio, e sofre bloqueio de origem no fetch).
  Decisão do usuário em 17/09/2026: **manter só o link e "A combinar"**, sem preço.
  `0` nunca vira preço — é ausência de anúncio ativo, não valor.

### Como reler os preços

O Mercado Livre **não entrega o preço no HTML** para um agente automatizado: o `web_fetch`
volta vazio, a API (`api.mercadolibre.com`) exige token (401/403) e renderizar a página no
navegador controlado cai numa tela de verificação de conta (antirrobô). Não contorne isso.

O que funciona: o **próprio usuário** roda um trecho no console do navegador dele, numa aba
já aberta do Mercado Livre (mesma origem, sessão real). Peça isso a ele:

```js
const U = { /* id: 'url do produto' */ };
const out = {};
for (const [k,u] of Object.entries(U)) {
  try {
    const t = await (await fetch(u, {credentials:'include'})).text();
    const m = t.match(/"price"\s*:\s*"?([\d.]+)/)
           || t.match(/andes-money-amount__fraction[^>]*>([\d.]+)</)
           || t.match(/itemprop="price"[^>]*content="([\d.]+)"/);
    out[k] = m ? Number(m[1]) : null;
  } catch(e) { out[k] = null; }
  await new Promise(r => setTimeout(r, 300));   // pausa: sem isso parece robô
}
JSON.stringify(out)
```

Os ids do objeto `U` são os mesmos `id` de `ITENS`, então o retorno mapeia direto.
**Descarte `0` e `null`** — vire `preco: null`, nunca um número inventado.
- **`JA_TEM` está vazio** → a seção "Já temos em casa" fica escondida (`display:none`).
  Quando souber o que eles já têm, é só listar os nomes.
- **Sem data** no selo do topo: o casal não informou data do chá. Hoje o selo diz
  "Chá de casa nova · Tata & Tutu". Havendo data, entra no mesmo formato do original
  (`04 de agosto · ...`).

### Cômodos

`Cozinha` (20) · `Quarto e sala` (5) · `Área de serviço` (4) · `Banheiro` (2) · `Itens grandes` (2).
A ordem de exibição vem de `ORDEM_COMODOS`.

## Diferenças em relação ao `../presentes`

Duas melhorias nasceram aqui por causa da lista sem preços. **Se forem portadas de volta
para o projeto do Matheus, o comportamento lá não muda** (ele tem preços):

1. **`faixaTemItem()` + `renderFaixas()`** — faixa sem nenhum item não é renderizada, e se
   sobrar só uma opção a barra inteira some. Antes, clicar em "Até R$ 100" numa lista sem
   preços levava direto ao estado vazio.
2. **Stat adaptativo** (`#stat-destaque` / `#stat-destaque-label`) — com preços, mostra
   "o item mais baratinho"; sem preços, mostra quantos itens têm link pronto. No original
   esse stat era fixo (`#stat-menor`) e exibiria só um traço.

O resto do `app.js` é idêntico, inclusive os comentários que explicam as decisões da
sincronização — leia a seção abaixo antes de mexer nela.

## Reserva compartilhada

**Está ativa** desde 17/09/2026: `RESERVAS_URL` no `app.js` aponta para o Web App publicado,
e a planilha vive no Drive de uma conta Google **pessoal (Gmail)** — Workspace corporativo dá
conflito de conta ao abrir o editor do Apps Script.

Endpoint verificado no dia da publicação: o `GET` da URL `/exec` responde
`{"ok":true,"reservas":[]}` sem pedir login — é esse o teste rápido quando algo parecer errado.
Se pedir login ou devolver 401, a implantação saiu com "Quem pode acessar" diferente de
"Qualquer pessoa".

Dois conjuntos de ids, e a distinção entre eles é o que impede um visitante de desmarcar a
escolha de outro:

- **`state.reservas`** — tudo que está tomado, seu ou dos outros. Vem do servidor.
- **`state.minhas`** — só o que **este** navegador reservou. Persistido em
  `localStorage["presentes-tata-tutu-reservas-v1"]`.

Três estados de card: livre (`Eu dou esse`) · sua (`Sua escolha` + `Desmarcar`) · de
terceiro (`Escolhido` + `Já é de alguém`, sem ação).

Detalhes que não são óbvios e quebram se mexidos sem cuidado:

- O POST vai com `Content-Type: text/plain` **de propósito**: mantém a requisição "simples"
  e evita o preflight `OPTIONS`, que o Apps Script não sabe responder. O corpo é JSON.
- O Web App **tem** que ser publicado como "Qualquer pessoa". Quem visita a lista não tem
  conta Google no contexto da página; qualquer outra opção devolve 401.
- A reserva é **otimista com rollback**: a tela marca na hora e desfaz se o POST falhar.
- **Antes de desfazer, o cliente relê o servidor.** Se a mudança já está lá, foi a nossa
  escrita que chegou e só a resposta se perdeu — desfazer nesse caso travava o item.
  Não remova essa releitura.
- Corrida (dois reservando o mesmo item): o servidor responde `{ok:false, erro:'ocupado'}`
  e a página desmarca só a sua. O aviso assume que a mensagem do WhatsApp já saiu, porque
  o link abre antes do POST resolver.
- Sincroniza no load, ao voltar o foco pra aba, e a cada 45s com a aba visível.
- **Arranque frio do Apps Script leva 20–30s.** Enquanto `state.sync === 'carregando'`, a
  página mostra "Conferindo o que já foi escolhido…" — sem isso o visitante vê tudo como
  disponível e escolhe algo já reservado.

## Estilo

Design system **Organic**: creme `#f5ead8` / areia `#ebddc5`, acento terracota `#c67139`,
segundo acento sálvia `#7a8a5e`, **Caprasimo** (títulos) sobre **Figtree** (corpo).
Cantos arredondados: cards 32px, bloco PIX 40px, botões e inputs pill 999px.

Consuma os tokens (`var(--color-*)`, `var(--font-*)`, `var(--shadow-*)`) — **não repita hex**.
Exceção: `--text-2/3/4`, os três tons de texto secundário derivados do ramp neutro.
O bloco `:root` do Organic é cópia fiel do handoff: retoque a camada da página, não os tokens.

As fontes entram por `<link>` no `index.html` (com o peso 500 do Figtree, usado nos rótulos).

### Foto do casal

`foto.jpg` (1200×1600, ~370 KB) fica no cabeçalho, à direita do texto no desktop e empilhada
no celular. É **retângulo arredondado**, não círculo: a foto é de corpo inteiro e um recorte
circular deixaria os rostos minúsculos.

O `object-position: center 22%` existe porque o centro geométrico de uma foto de corpo inteiro
cai na altura da cintura — sem isso o enquadramento corta as cabeças. No mobile
(`max-width: 860px`) o recorte fica `4 / 5` com `18%`, senão um retrato 3/4 ocuparia a tela
toda antes de a lista aparecer. **Ao trocar a foto, reveja esses dois valores**: eles são
específicos deste enquadramento.

## Copy — o que não pode sumir

- **"Não tem item pequeno demais."** no parágrafo de abertura. Esse recado veio do projeto
  original e o usuário insistiu nele; precisa continuar visível.
- Tom leve e brincalhão nas `nota` de cada item — é o que dá personalidade à página.
- Textos são no **plural** (casal): "a gente", "vocês", "nossa casa". Ao editar, não volte
  pro singular do projeto original.

## Verificação

Não há suíte. Depois de editar, confira o básico:

- `index.html` termina em `</html>`; `app.js` termina no bloco de boot.
- Sintaxe do `app.js`: `node --check app.js`.
- Abra o `index.html` no navegador e confira: os 5 grupos de cômodo aparecem, o botão
  "Me surpreenda" sorteia, "Eu dou esse" marca o card e o bloco PIX mostra a chave.
