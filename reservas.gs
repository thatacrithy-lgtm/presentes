/**
 * Reserva compartilhada da lista de presentes — chá de casa nova da Tata e do Tutu.
 * Google Apps Script publicado como Web App — o "backend" que o GitHub Pages não tem.
 *
 * ┌── COMO PUBLICAR ────────────────────────────────────────────────────────┐
 * │ IMPORTANTE: faça tudo logado numa conta Google PESSOAL (Gmail).         │
 * │ Conta de Workspace corporativo dá conflito ao abrir o editor.           │
 * │                                                                          │
 * │ 1. Crie uma planilha nova em sheets.new. Não precisa configurar nada    │
 * │    dentro dela — a aba "reservas" e os títulos                          │
 * │    (item_id | nome | timestamp) são criados pelo próprio script.        │
 * │                                                                          │
 * │ 2. Na planilha: Extensões → Apps Script. Apague o conteúdo do           │
 * │    Code.gs e cole este arquivo inteiro. Salve.                          │
 * │                                                                          │
 * │ 3. Implantar → Nova implantação → engrenagem → App da Web.              │
 * │        Executar como:        Eu (sua conta)                             │
 * │        Quem pode acessar:    Qualquer pessoa                            │
 * │    "Qualquer pessoa" é obrigatório — quem visita a lista não tem conta   │
 * │    Google logada no contexto da página. Sem isso a chamada volta 401.   │
 * │                                                                          │
 * │ 4. Autorize quando ele pedir (vai aparecer o aviso de "app não          │
 * │    verificado" → Avançado → Acessar projeto sem verificação; é seu      │
 * │    próprio script, rodando na sua conta).                               │
 * │                                                                          │
 * │ 5. Copie a URL do App da Web — a que termina em /exec, não /dev — e     │
 * │    cole em RESERVAS_URL, no topo do app.js. Commit + push. Pronto.      │
 * │                                                                          │
 * │ Teste rápido: abra a URL /exec no navegador. Deve responder             │
 * │ {"ok":true,"reservas":[]}. Se pedir login, o passo 3 saiu errado.       │
 * │                                                                          │
 * │ Ao editar este arquivo depois: Implantar → Gerenciar implantações →     │
 * │ lápis → Versão: Nova versão → Implantar. A URL /exec continua a mesma.  │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Escopo: o Web App é público e anônimo, então qualquer um que descubra a URL
 * pode reservar e desmarcar. Para uma lista de chá de casa nova isso é
 * aceitável — o pior caso é alguém zerar as reservas, e a planilha guarda o
 * histórico pra você reconstruir. Não coloque nada sensível nessa planilha.
 */

var ABA = 'reservas';

/* Lock de 10s: dois cliques simultâneos no mesmo item não podem virar duas
   linhas. Quem chegar depois espera, relê a planilha e recebe "ocupado". */
var LOCK_MS = 10000;

function aba_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(ABA);
  if (!s) {
    s = ss.insertSheet(ABA);
    s.appendRow(['item_id', 'nome', 'timestamp']);
  }
  return s;
}

function ids_(s) {
  var n = s.getLastRow();
  if (n < 2) return [];
  return s.getRange(2, 1, n - 1, 1).getValues()
    .map(function (r) { return String(r[0]).trim(); })
    .filter(function (v) { return v !== ''; });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET → { ok: true, reservas: ["airfryer", "tv"] } */
function doGet() {
  try {
    return json_({ ok: true, reservas: ids_(aba_()) });
  } catch (e) {
    return json_({ ok: false, erro: String(e) });
  }
}

/**
 * POST body: { "acao": "reservar" | "desmarcar", "id": "airfryer", "nome": "" }
 * → { ok: true,  reservas: [...] }
 * → { ok: false, erro: "ocupado", reservas: [...] }   // alguém pegou primeiro
 *
 * O app.js manda Content-Type: text/plain de propósito: assim a requisição é
 * "simples" e o navegador não dispara o preflight OPTIONS, que o Apps Script
 * não responde. O corpo continua sendo JSON.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_MS);
  } catch (err) {
    return json_({ ok: false, erro: 'ocupado_lock' });
  }

  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var id = String(body.id || '').trim();
    var acao = String(body.acao || '').trim();
    if (!id) return json_({ ok: false, erro: 'sem_id' });

    var s = aba_();
    var atuais = ids_(s);

    if (acao === 'desmarcar') {
      // De trás pra frente: apagar linha reindexa as de baixo.
      for (var r = s.getLastRow(); r >= 2; r--) {
        if (String(s.getRange(r, 1).getValue()).trim() === id) s.deleteRow(r);
      }
      return json_({ ok: true, reservas: ids_(s) });
    }

    if (acao === 'reservar') {
      if (atuais.indexOf(id) >= 0) {
        return json_({ ok: false, erro: 'ocupado', reservas: atuais });
      }
      s.appendRow([id, String(body.nome || ''), new Date().toISOString()]);
      return json_({ ok: true, reservas: ids_(s) });
    }

    return json_({ ok: false, erro: 'acao_invalida' });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}
