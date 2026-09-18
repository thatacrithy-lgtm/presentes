/* ===================================================================
   CONFIGURAÇÃO RÁPIDA
   FONE vazio        → botões de WhatsApp somem.
   CHAVE_PIX vazia   → o cartão da chave e o botão de copiar somem.
   RESERVAS_URL vazia → reserva funciona só neste navegador (modo local).
                        Preenchida → reserva compartilhada entre visitantes.
                        Passo a passo em reservas.gs.
   =================================================================== */
const FONE         = '5527992546458';
const CHAVE_PIX    = '19931010711';         // CPF só com dígitos: cola limpo no app do banco
const PIX_LABEL    = '199.310.107-11';      // como a chave aparece na tela
const PIX_DONO     = 'Thaís Fagundes';
const RESERVAS_URL = 'https://script.google.com/macros/s/AKfycbx6wLQPFVaGo3J4PoRG18VePpYULs40_n3Na7GMh8ZMp1eOQX2OGJmaurTjqOxQiM4/exec';

/* Como o casal é chamado nos textos automáticos (WhatsApp, avisos). */
const CASAL = 'Tata e Tutu';

/* ===================================================================
   ITENS
   preco: número (R$) ou null quando ainda não há preço fechado.
          null cai na faixa "A combinar" — não invente valor aqui.
   comodo: Cozinha · Quarto e sala · Área de serviço · Banheiro · Itens grandes
   link:  vazio → o botão "Ver loja" cai numa busca no Mercado Livre.
   =================================================================== */
const ITENS = [
  /* ---------- Cozinha ---------- */
  {id:'liquidificador', nome:'Liquidificador',          comodo:'Cozinha', preco:135.94, nota:'Vitamina de manhã, molho à noite.',                     busca:'liquidificador', link:'https://www.mercadolivre.com.br/liquidificador-l900-fb-turbo-900w-27-litros-preto-mondial/up/MLBU1091956675'},
  {id:'airfryer',       nome:'Air fryer',                comodo:'Cozinha', preco:364, nota:'Sim, a gente virou essas pessoas.',                     busca:'air fryer fritadeira eletrica', link:'https://www.mercadolivre.com.br/fritadeira-airfryer-serie-1000-xl-na13000-preto/p/MLB52188249'},
  {id:'misteira',       nome:'Misteira (grill elétrico)',comodo:'Cozinha', preco:149.90, nota:'Pro misto quente das 23h. Sem julgamentos.',            busca:'grill eletrico sanduicheira misteira', link:'https://www.mercadolivre.com.br/grill-eletrico-cadence-click-1200w-grl200-127v-prateado/p/MLB55694956'},
  {id:'jantar',         nome:'Aparelho de jantar',       comodo:'Cozinha', preco:265.05, nota:'Pra receber visita sem improvisar prato.',              busca:'aparelho de jantar jogo de pratos', link:'https://www.mercadolivre.com.br/aparelho-de-jantar-kit-com-16-pecas-em-vidro-branco-jogo-pratos-raso-fundo-e-bowl-opalino-mesa-resistente-luxo/p/MLB75641093'},
  {id:'talheres',       nome:'Jogo de talheres',         comodo:'Cozinha', preco:66.06, nota:'Garfo, faca, colher. O clássico.',                      busca:'talheres faqueiro', link:'https://www.mercadolivre.com.br/faqueiro-tramontina-buzios-em-aco-inox-com-detalhe-24-pecas/p/MLB36709502'},
  {id:'facas',          nome:'Conjunto de facas',        comodo:'Cozinha', preco:149.89, nota:'Pra aposentar aquela faquinha que não corta nada.',     busca:'jogo de facas cozinha', link:'https://www.mercadolivre.com.br/lumai-jogo-de-facas-de-cozinha-zurich-de-aco-inoxidavel-high-carbon-steel-52-hrc-kit-de-faca-robusta-e-laminas-afiadas-faca-do-chef-faca-santoku-pao-e-utilitaria-conjunto-cozinha-completa/p/MLB45821618'},
  {id:'copos',          nome:'Jogo de copos',            comodo:'Cozinha', preco:53.90, nota:'Porque copo some, quebra e nunca é suficiente.',        busca:'copos jogo de copos vidro', link:'https://www.mercadolivre.com.br/kit-6-copos-vidro-420ml-borda-dourada-versalhes-agua/p/MLB44953853'},
  {id:'pressao',        nome:'Panela de pressão',        comodo:'Cozinha', preco:349, nota:'O feijão de domingo depende dela.',                     busca:'panela de pressao', link:'https://www.mercadolivre.com.br/panela-pressao-brinox-ceramic-pressure-inducao-68l-vanilla/p/MLB22931744'},
  {id:'frigideira',     nome:'Frigideira grill',         comodo:'Cozinha', preco:300.69, nota:'Aquela marquinha bonita no bife.',                      busca:'frigideira grill antiaderente', link:'https://www.mercadolivre.com.br/grill-ceramic-life-sirius-vanilla-28cm-2l-com-inducao-brinox/up/MLBU1460757701'},
  {id:'leiteira',       nome:'Leiteira',                 comodo:'Cozinha', preco:159.99, nota:'Café, leite, e o resgate do miojo.',                    busca:'leiteira fervedor inox', link:'https://www.mercadolivre.com.br/leiteira-fervedor-inducao-sirius-14cm-17l-vanilha-brinox/p/MLB52859885'},
  {id:'bowls',          nome:'Conjunto de bowls de inox',comodo:'Cozinha', preco:119.50, nota:'Pra tudo: salada, massa, bolo, bagunça.',               busca:'bowls tigelas inox conjunto', link:'https://www.mercadolivre.com.br/jogo-5-bowls-aco-inox-com-tampa-plastica-18-20-22-24-26-cm-kit-tigelas-bacia-para-preparo-armazenamento-saladeira-conjunto-cozinha-solar/p/MLB77193938'},
  {id:'tabua',          nome:'Tábua de carne',           comodo:'Cozinha', preco:56.16, nota:'Pra parar de cortar tudo em cima do prato.',            busca:'tabua de carne corte', link:'https://www.mercadolivre.com.br/tabua-de-corte-inox-e-pp-para-cozinha-dupla-face-antibacteriana-e-antiderrapante-tabua-de-carne-com-canaleta-para-suco-37x25cm/p/MLB65454235'},
  {id:'temperos',       nome:'Porta-temperos',           comodo:'Cozinha', preco:32.49, nota:'Organiza a bancada e dá um ar de chef.',                busca:'porta temperos potes', link:'https://www.mercadolivre.com.br/kit-porta-temperos-com-12-potes-vidro-tampa-inox-80ml/p/MLB25755773'},
  {id:'escorredor',     nome:'Escorredor de louça',      comodo:'Cozinha', preco:144.90, nota:'O fim da louça secando em pé na pia.',                  busca:'escorredor de louca pratos inox', link:'https://www.mercadolivre.com.br/escorredor-de-pratos-em-inox-fixo-20-pratos-c-porta-talher/p/MLB22954438'},
  {id:'kitpia',         nome:'Kit pia',                  comodo:'Cozinha', preco:null, nota:'Lixeira, detergente e rodinho — o combo da pia.',       busca:'kit pia cozinha dispenser lixeira', link:'https://www.mercadolivre.com.br/kit-pia-cozinha-lixeira-dispenser-porta-detergente-rodinho/up/MLBU4262270775'},
  {id:'passadeira',     nome:'Passadeira de cozinha',    comodo:'Cozinha', preco:67.80, nota:'Pra frente da pia não virar poça.',                     busca:'passadeira tapete cozinha kit', link:'https://www.mercadolivre.com.br/tapetes-kit-cozinha-rustico-3-pecas-antiderrapante-passadeira-capacho-jogo-natural-leve-pratico-lavavel/p/MLB65011064'},
  {id:'bowlsceramica',  nome:'Kit bowl de cerâmica',     comodo:'Cozinha', preco:90.14, nota:'Açaí, salada, sopa — tudo fica mais bonito.',           busca:'bowl ceramica kit tigelas', link:'https://www.mercadolivre.com.br/up/MLBU3987001026'},
  {id:'fatiador',       nome:'Fatiador de legumes e centrífuga', comodo:'Cozinha', preco:69.90, nota:'Pra salada deixar de ser desculpa.',            busca:'fatiador de legumes centrifuga salada', link:'https://www.mercadolivre.com.br/up/MLBU4271309210'},
  {id:'mixer',          nome:'Triturador e mixer elétrico', comodo:'Cozinha', preco:174.90, nota:'Sopa e molho sem sujar o liquidificador inteiro.',   busca:'mixer triturador eletrico', link:'https://www.mercadolivre.com.br/p/MLB17263868'},
  {id:'assadeiras',     nome:'Assadeiras de vidro',      comodo:'Cozinha', preco:134.90, nota:'A lasanha de domingo pede uma dessas.',                 busca:'assadeira de vidro refrataria', link:'https://www.mercadolivre.com.br/p/MLB28025230'},

  /* ---------- Quarto e sala ---------- */
  {id:'travesseiros',   nome:'Travesseiros',             comodo:'Quarto e sala', preco:94.99, nota:'De preferência os que não viram panqueca.',       busca:'travesseiro travesseiros', link:'https://www.mercadolivre.com.br/kit-4-travesseiros-oaktex-50x70-antialergico-fibra-siliconada-branco/p/MLB44160351'},
  {id:'capatrav',       nome:'Capa de travesseiro',      comodo:'Quarto e sala', preco:49.90, nota:'O item que ninguém lembra e todo mundo precisa.', busca:'capa de travesseiro impermeavel', link:'https://www.mercadolivre.com.br/kit-4-capas-de-travesseiro-lufiara-matelasse-para-alergicos-impermeavel-e-com-ziper-70x50-cm/p/MLB26719621'},
  {id:'capacolchao',    nome:'Capa de colchão',          comodo:'Quarto e sala', preco:78.90, nota:'Colchão novo merece proteção desde o dia 1.',    busca:'capa de colchao casal impermeavel', link:'https://www.mercadolivre.com.br/capa-colchao-protetora-impermeavel-antialergico-ortobom-branco-casal/p/MLB74321186'},
  {id:'cabides',        nome:'Cabides',                  comodo:'Quarto e sala', preco:59.79, nota:'Nunca são suficientes. Nunca.',                   busca:'cabide cabides kit', link:'https://www.mercadolivre.com.br/kit-60-cabides-pretos-adulto-antideslizante-reforcado-roupas/up/MLBU663943747'},
  {id:'difusor',        nome:'Difusor de ambiente',      comodo:'Quarto e sala', preco:78.90, nota:'Casa nova tem que ter cheiro de casa nova.',      busca:'difusor de aromas ambiente', link:'https://www.mercadolivre.com.br/kit-3-difusores-de-aromas-eletrico-bivolt-polimero-15ml/up/MLBU4092584177'},

  /* ---------- Área de serviço ---------- */
  {id:'ferro',          nome:'Ferro de passar',          comodo:'Área de serviço', preco:148.69, nota:'Pra gente parecer gente arrumada no trabalho.', busca:'ferro de passar roupa vapor', link:'https://www.mercadolivre.com.br/ferro-a-vapor-ceramic-express-mondial-200w-f-40/p/MLB34686428'},
  {id:'mop',            nome:'Mop',                      comodo:'Área de serviço', preco:99.90, nota:'Faxina de sábado com menos dor nas costas.',    busca:'mop esfregao giratorio balde', link:'https://www.mercadolivre.com.br/mop-esfregao-giratorio-condor-balde-inox-13-litros-refil-microfibra-cabo-longo-14-metros/p/MLB47285674'},
  {id:'balde',          nome:'Balde dobrável',           comodo:'Área de serviço', preco:94.99, nota:'Dobra, guarda e some — perfeito pra apê.',      busca:'balde dobravel cesto retratil', link:'https://www.mercadolivre.com.br/kit-cesto-26l-balde-10l-dobravel-branco-pratico-retratil-cor-cinza-vapt-vupt/p/MLB53616032'},
  {id:'poteslav',       nome:'Potes de lavanderia',      comodo:'Área de serviço', preco:65.79, nota:'Sabão em pó com cara de Pinterest.',            busca:'potes hermeticos lavanderia dosador', link:'https://www.mercadolivre.com.br/kit-3-potes-hermeticos-2l-com-dosador-transparente-sigma-home-cozinha-lavanderia/p/MLB49212228'},

  /* ---------- Banheiro ---------- */
  {id:'kitlavabo',      nome:'Kit lavabo',               comodo:'Banheiro', preco:null, nota:'Detalhe bobo que organiza a pia inteira.',             busca:'kit lavabo banheiro pecas', link:'https://produto.mercadolivre.com.br/MLB-4914606245-kit-lavabo-4-pecas-canele-com-minerais-de-pedras-naturais-_JM'},
  {id:'lixeirabanh',    nome:'Lixeira de banheiro',      comodo:'Banheiro', preco:null, nota:'A pequena, de tampa. Essencial.',                      busca:'lixeira banheiro tampa sensor', link:'https://www.mercadolivre.com.br/lixeira-inteligente-12l-sensor-automatico-banheiro-cozinha/up/MLBU4994823086'},

  /* ---------- Itens grandes ---------- */
  {id:'tv',             nome:'Televisão 50"',            comodo:'Itens grandes', preco:2499.52, nota:'O boss final da lista. Sem pressão.',             busca:'smart tv 50 polegadas 4k', link:'https://www.mercadolivre.com.br/smart-tv-pro-lg-50-4k-ultra-hd-ai-50un85c/p/MLB74962073'},
  {id:'robo',           nome:'Robô aspirador',           comodo:'Itens grandes', preco:1850, nota:'O sonho de consumo que limpa sozinho.',           busca:'robo aspirador de po', link:'https://www.mercadolivre.com.br/robo-aspirador-xiaomi-s40-pro-alexa-e-google-branco-bivolt/p/MLB64251864'},
];

/* Itens que eles já têm — evita presente repetido. Vazio = a seção some. */
const JA_TEM = [];

const ORDEM_COMODOS = ['Cozinha', 'Quarto e sala', 'Área de serviço', 'Banheiro', 'Itens grandes'];

/* A faixa "combinar" existe porque parte dos itens ainda não tem preço fechado.
   Faixas sem nenhum item não são exibidas — quando os preços entrarem, elas
   aparecem sozinhas. */
const FAIXAS = [
  {id:'todos',    label:'Todos os valores', min:0,   max:Infinity},
  {id:'ate100',   label:'Até R$ 100',       min:0,   max:100},
  {id:'100a300',  label:'R$ 100 – 300',     min:100, max:300},
  {id:'300a600',  label:'R$ 300 – 600',     min:300, max:600},
  {id:'acima600', label:'Acima de R$ 600',  min:600, max:Infinity},
  {id:'combinar', label:'A combinar',       min:null, max:null},
];

const CHAVE_LS = 'presentes-tata-tutu-reservas-v1';
const POLL_MS  = 45000;

/* ===================================================================
   ESTADO
   reservas → todos os ids tomados (seus + dos outros visitantes)
   minhas   → só os que ESTE navegador reservou. Sem isso, um visitante
              conseguiria desmarcar a escolha de outra pessoa.
   =================================================================== */
const state = {
  busca:'', faixa:'todos', ordem:'comodo', esconder:false,
  reservas:[], minhas:[], sugestao:null,
  sync: RESERVAS_URL ? 'carregando' : 'local',   // local | carregando | ok | offline
  aviso:null,
};

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* Preço redondo sai sem centavos ("R$ 400"); com centavos, sai completo. */
function brl(v){
  const casas = Number.isInteger(v) ? 0 : 2;
  return 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits:casas, maximumFractionDigits:casas});
}

function linkLoja(item){
  if (item.link) return item.link;
  return 'https://lista.mercadolivre.com.br/' + encodeURIComponent(item.nome.replace(/\(.*\)/, '').trim());
}

function linkWhats(item){
  if (!FONE) return '';
  const texto = 'Oi! Vou ficar com "' + item.nome + '" da lista de vocês. Felicidades pela casa nova!';
  return 'https://wa.me/' + FONE + '?text=' + encodeURIComponent(texto);
}

const tomado = id => state.reservas.indexOf(id) >= 0;
const minha  = id => state.minhas.indexOf(id) >= 0;

function salvarMinhas(lista){
  state.minhas = lista;
  try { localStorage.setItem(CHAVE_LS, JSON.stringify(lista)); } catch(e) {}
}

/* ===================================================================
   SINCRONIZAÇÃO — só entra em ação com RESERVAS_URL preenchida.
   Sem ela tudo continua funcionando local.
   =================================================================== */

/* Só ids que ainda existem em ITENS: um item removido não pode inflar a contagem. */
function limpar(ids){
  return (Array.isArray(ids) ? ids : []).filter(id => ITENS.some(i => i.id === id));
}

async function buscarRemoto(){
  const r = await fetch(RESERVAS_URL, {method:'GET', cache:'no-store'});
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const dados = await r.json();
  if (!dados || dados.ok !== true) throw new Error('resposta inesperada');
  return limpar(dados.reservas);
}

/* POST em text/plain de propósito: mantém a requisição "simples" e evita o
   preflight OPTIONS, que o Apps Script não sabe responder. */
async function enviarRemoto(acao, id){
  const r = await fetch(RESERVAS_URL, {
    method: 'POST',
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify({acao, id}),
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

async function sincronizar(){
  if (!RESERVAS_URL) return;
  try {
    const remotas = await buscarRemoto();
    // As suas entram na união: se a rede caiu no meio de um POST, a marcação
    // local não some da tela sem você saber.
    state.reservas = Array.from(new Set(remotas.concat(state.minhas)));
    state.sync = 'ok';
  } catch(e) {
    state.sync = 'offline';
  }
  render();
}

async function reservar(item){
  const desmarcando = minha(item.id);

  // Já é de outra pessoa: não deixa mexer.
  if (!desmarcando && tomado(item.id)) return;

  const reservasAntes = state.reservas.slice();
  const minhasAntes   = state.minhas.slice();

  // Atualização otimista — a tela responde na hora.
  if (desmarcando) {
    state.reservas = state.reservas.filter(x => x !== item.id);
    salvarMinhas(state.minhas.filter(x => x !== item.id));
  } else {
    state.reservas = state.reservas.concat([item.id]);
    salvarMinhas(state.minhas.concat([item.id]));
  }
  state.aviso = null;
  render();

  // O WhatsApp não é aberto aqui: "Eu dou esse" é um <a> de verdade, e a
  // navegação nativa do link nunca é barrada por bloqueador de pop-up.

  if (!RESERVAS_URL) return;

  try {
    const resp = await enviarRemoto(desmarcando ? 'desmarcar' : 'reservar', item.id);
    if (resp && resp.ok) {
      if (Array.isArray(resp.reservas)) {
        state.reservas = Array.from(new Set(limpar(resp.reservas).concat(state.minhas)));
      }
      state.sync = 'ok';
    } else if (resp && resp.erro === 'ocupado') {
      // Corrida: alguém confirmou esse item primeiro. Desfaz só a sua marcação.
      state.reservas = limpar(resp.reservas);
      salvarMinhas(minhasAntes.filter(x => x !== item.id));
      state.sync = 'ok';
      // A mensagem do WhatsApp já saiu quando o link abriu, então o aviso tem
      // que dizer o que fazer com ela — não só que deu ruim.
      state.aviso = 'Alguém escolheu ' + item.nome + ' um instante antes de você. Desmarquei aqui — pode escolher outro. Se você já mandou a mensagem, só avisa ' + CASAL + ' que trocou. 🙈';
    } else {
      throw new Error((resp && resp.erro) || 'falhou');
    }
  } catch(e) {
    // A escrita pode ter sido aplicada no servidor mesmo com a resposta se
    // perdendo — o Apps Script é lento no primeiro acesso e engasga quando o
    // GET do boot e este POST se cruzam. Então confere antes de desfazer: se o
    // servidor já reflete a mudança, foi a nossa escrita que chegou. Desfazer
    // aqui deixaria o item travado — reservado na planilha, exibido como "de
    // alguém" pra todo mundo e sem dono nenhum que possa liberar.
    let aplicou = false, remotas = null;
    try {
      remotas = await buscarRemoto();
      aplicou = desmarcando
        ? remotas.indexOf(item.id) < 0
        : remotas.indexOf(item.id) >= 0;
    } catch(_) {}

    if (aplicou) {
      state.reservas = Array.from(new Set(remotas.concat(state.minhas)));
      state.sync = 'ok';
    } else {
      // Aí sim: não chegou. Desfaz, senão a pessoa acha que reservou e não reservou.
      state.reservas = reservasAntes;
      salvarMinhas(minhasAntes);
      state.sync = 'offline';
      state.aviso = 'Não consegui registrar no site agora. Sua mensagem no WhatsApp vale — ' + CASAL + ' anota manualmente.';
    }
  }
  render();
}

/* ===================================================================
   FILTRO / AGRUPAMENTO
   =================================================================== */

function filtrar(){
  const termo = state.busca.trim().toLowerCase();
  const faixa = FAIXAS.find(f => f.id === state.faixa) || FAIXAS[0];

  return ITENS.filter(i => {
    if (termo && (i.nome + ' ' + i.busca).toLowerCase().indexOf(termo) < 0) return false;
    if (state.esconder && tomado(i.id)) return false;
    if (faixa.id === 'todos') return true;
    if (faixa.id === 'combinar') return i.preco == null;
    if (i.preco == null) return false;              // sem preço só aparece em "todos" e "a combinar"
    return i.preco >= faixa.min && i.preco <= faixa.max;
  });
}

/* Sem preço vai pro fim, tanto no "mais barato" quanto no "mais caro". */
function porPreco(a, b){
  if (a.preco == null && b.preco == null) return 0;
  if (a.preco == null) return 1;
  if (b.preco == null) return -1;
  return state.ordem === 'barato' ? a.preco - b.preco : b.preco - a.preco;
}

function agrupar(filtrados){
  if (state.ordem === 'comodo') {
    return ORDEM_COMODOS
      .map(c => ({ nome:c, itens: filtrados.filter(i => i.comodo === c) }))
      .filter(g => g.itens.length > 0);
  }
  const ord = filtrados.slice().sort(porPreco);
  return ord.length ? [{
    nome: state.ordem === 'barato' ? 'Do mais barato ao mais caro' : 'Do mais caro ao mais barato',
    itens: ord
  }] : [];
}

/* ===================================================================
   RENDER
   =================================================================== */

function cardHTML(i){
  const marcado = tomado(i.id);
  const eMinha  = minha(i.id);
  const preco   = i.preco != null ? brl(i.preco) : 'A combinar';
  // "aprox." só faz sentido ao lado de um número; em "A combinar" a linha fica limpa.
  const nota    = i.preco != null ? 'aprox.' : '';
  const selo    = marcado ? `<span class="selo">${eMinha ? 'Sua escolha' : 'Escolhido'}</span>` : '';

  let acao;
  if (!marcado) {
    // <a> em vez de <button>: a navegação nativa abre o WhatsApp sem risco de
    // bloqueio de pop-up. O data-reservar continua disparando a reserva no clique.
    const whats = linkWhats(i);
    acao = whats
      ? `<a class="btn-dou" href="${esc(whats)}" target="_blank" rel="noopener" data-reservar="${esc(i.id)}">Eu dou esse</a>`
      : `<button type="button" class="btn-dou" data-reservar="${esc(i.id)}">Eu dou esse</button>`;
  } else if (eMinha) {
    acao = `<button type="button" class="btn-dou" data-reservar="${esc(i.id)}">Desmarcar</button>`;
  } else {
    acao = `<span class="btn-tomado">Já é de alguém 💚</span>`;
  }

  return `<article class="item${marcado ? ' escolhido' : ''}">
    <div class="item-topo">
      <div class="item-txt">
        <div class="item-nome">${esc(i.nome)}</div>
        <div class="item-nota">${esc(i.nota)}</div>
      </div>
      ${selo}
    </div>
    <div class="item-base">
      <div class="item-preco">
        <span class="preco">${esc(preco)}</span>
        <span class="preco-nota">${esc(nota)}</span>
      </div>
      <div class="item-acoes">
        ${acao}
        <a class="btn-loja" href="${esc(linkLoja(i))}" target="_blank" rel="noopener">Ver loja</a>
      </div>
    </div>
  </article>`;
}

function grupoHTML(g){
  const n = g.itens.length;
  // Não reservados primeiro, dentro do grupo.
  const ordenados = g.itens.filter(i => !tomado(i.id)).concat(g.itens.filter(i => tomado(i.id)));
  return `<div class="grupo">
    <div class="grupo-head">
      <h3>${esc(g.nome)}</h3>
      <span class="regua"></span>
      <span class="grupo-contagem">${n === 1 ? '1 item' : n + ' itens'}</span>
    </div>
    <div class="grid">${ordenados.map(cardHTML).join('')}</div>
  </div>`;
}

/* Faixa sem nenhum item vira um filtro que só leva ao estado vazio. Enquanto
   os preços não entram, a barra mostra só "Todos os valores" e "A combinar". */
function faixaTemItem(f){
  if (f.id === 'todos') return true;
  if (f.id === 'combinar') return ITENS.some(i => i.preco == null);
  return ITENS.some(i => i.preco != null && i.preco >= f.min && i.preco <= f.max);
}

function renderFaixas(){
  const uteis = FAIXAS.filter(faixaTemItem);
  // Só uma opção sobrando não é filtro nenhum — esconde a barra inteira.
  $('faixas').innerHTML = uteis.length > 1 ? uteis.map(f =>
    `<button type="button" class="chip${f.id === state.faixa ? ' is-on' : ''}" data-faixa="${f.id}" aria-pressed="${f.id === state.faixa}">${esc(f.label)}</button>`
  ).join('') : '';
}

function renderSugestao(){
  const item = state.sugestao ? ITENS.find(i => i.id === state.sugestao) : null;
  if (!item) { $('sugestao').innerHTML = ''; return; }
  const preco = item.preco != null ? '~' + brl(item.preco) : 'a combinar';
  $('sugestao').innerHTML = `<div class="sugestao">
    <span class="sugestao-kicker">Sugestão da casa</span>
    <span class="sugestao-nome">${esc(item.nome)}</span>
    <span class="sugestao-preco">${esc(preco)}</span>
  </div>`;
}

function renderAviso(){
  const box = $('aviso');
  if (state.aviso) {
    box.innerHTML = `<div class="aviso" role="status">${esc(state.aviso)}</div>`;
  } else if (state.sync === 'offline') {
    box.innerHTML = `<div class="aviso" role="status">Sem conexão com a lista compartilhada — o que você marcar agora vale só neste navegador.</div>`;
  } else if (state.sync === 'carregando') {
    // O Apps Script tem arranque frio de 20-30s. Sem essa linha, o visitante vê
    // a lista toda como disponível e pode escolher algo que já foi reservado.
    box.innerHTML = `<div class="aviso aviso-suave" role="status">Conferindo o que já foi escolhido…</div>`;
  } else {
    box.innerHTML = '';
  }
}

function render(){
  const grupos = agrupar(filtrar());
  $('grupos').innerHTML = grupos.length
    ? grupos.map(grupoHTML).join('')
    : `<div class="vazio">
         <div class="vazio-titulo">Nada por aqui</div>
         Tenta afrouxar o filtro — ou manda um PIX e a gente resolve na conversa.
       </div>`;
  $('stat-reservados').textContent = state.reservas.length;
  renderFaixas();
  renderSugestao();
  renderAviso();
}

function renderEstaticos(){
  const comPreco = ITENS.filter(i => i.preco != null).map(i => i.preco);
  $('stat-total').textContent   = ITENS.length;
  $('stat-comodos').textContent = new Set(ITENS.map(i => i.comodo)).size;

  // Sem preço nenhum, "o item mais baratinho" seria um traço inútil. Enquanto
  // isso, o número que ajuda de verdade é quantos já têm link pronto.
  if (comPreco.length) {
    $('stat-destaque').textContent       = brl(Math.min.apply(null, comPreco));
    $('stat-destaque-label').textContent = 'o item mais baratinho';
  } else {
    $('stat-destaque').textContent       = ITENS.filter(i => i.link).length;
    $('stat-destaque-label').textContent = 'com link pronto pra comprar';
  }

  // Sem RESERVAS_URL esse número conta só as escolhas deste navegador. Dizer
  // "por alguém" ali seria mentira: os outros visitantes veriam sempre zero.
  $('stat-reservados-label').textContent = RESERVAS_URL
    ? 'já escolhidos por alguém'
    : 'que você escolheu aqui';

  if (JA_TEM.length) {
    $('jatem').innerHTML = JA_TEM.map(n => `<span class="jatem-pill">${esc(n)}</span>`).join('');
  } else {
    $('jatem-box').style.display = 'none';
  }

  let html = '';
  if (CHAVE_PIX) {
    html += `<div class="pix-card">
      <span class="pix-rotulo">Chave PIX (CPF)</span>
      <span class="pix-chave">${esc(PIX_LABEL || CHAVE_PIX)}</span>
      <span class="pix-dono">${esc(PIX_DONO)}</span>
    </div>
    <button type="button" class="btn-copiar" id="copiar">Copiar chave PIX</button>`;
  }
  if (FONE) {
    const texto = 'Oi! Vi a lista do chá de casa nova de vocês';
    html += `<a class="btn-whats" href="https://wa.me/${esc(FONE)}?text=${encodeURIComponent(texto)}" target="_blank" rel="noopener">Falar no WhatsApp</a>`;
  }
  if (!CHAVE_PIX && !FONE) {
    html = `<div class="pix-card"><span class="pix-chave">Chama a gente no particular que combinamos 😉</span></div>`;
  }
  $('pix-linha').innerHTML = html;

  const btn = $('copiar');
  if (btn) btn.addEventListener('click', () => {
    const volta = () => { btn.textContent = 'Copiar chave PIX'; };
    navigator.clipboard.writeText(CHAVE_PIX)
      .then(() => { btn.textContent = 'Copiado!'; setTimeout(volta, 2000); })
      .catch(() => { btn.textContent = 'Copia manualmente: ' + CHAVE_PIX; setTimeout(volta, 4000); });
  });
}

/* ===================================================================
   EVENTOS
   =================================================================== */

$('busca').addEventListener('input', e => { state.busca = e.target.value; render(); });
$('ordem').addEventListener('change', e => { state.ordem = e.target.value; render(); });

$('esconder').addEventListener('click', e => {
  state.esconder = !state.esconder;
  e.currentTarget.setAttribute('aria-pressed', String(state.esconder));
  render();
});

$('faixas').addEventListener('click', e => {
  const b = e.target.closest('[data-faixa]');
  if (!b) return;
  state.faixa = b.dataset.faixa;
  render();
});

$('grupos').addEventListener('click', e => {
  const b = e.target.closest('[data-reservar]');
  if (!b) return;
  const item = ITENS.find(i => i.id === b.dataset.reservar);
  if (item) reservar(item);
});

$('surpreenda').addEventListener('click', () => {
  const livres = ITENS.filter(i => !tomado(i.id) && i.id !== state.sugestao);
  const pool = livres.length ? livres : ITENS.filter(i => !tomado(i.id));
  if (!pool.length) return;
  state.sugestao = pool[Math.floor(Math.random() * pool.length)].id;
  state.busca = '';
  state.faixa = 'todos';
  $('busca').value = '';
  render();
  $('sugestao').scrollIntoView({behavior:'smooth', block:'center'});
});

/* ===================================================================
   BOOT
   =================================================================== */

try {
  const raw = localStorage.getItem(CHAVE_LS);
  if (raw) state.minhas = limpar(JSON.parse(raw));
} catch(e) {}

// Antes da primeira resposta do servidor, o que você já reservou aparece marcado.
state.reservas = state.minhas.slice();

renderEstaticos();
render();

if (RESERVAS_URL) {
  sincronizar();
  // Volta pra aba → confere na hora. Aba aberta e visível → confere de tempos em tempos.
  window.addEventListener('focus', sincronizar);
  setInterval(() => {
    if (document.visibilityState === 'visible') sincronizar();
  }, POLL_MS);
}
