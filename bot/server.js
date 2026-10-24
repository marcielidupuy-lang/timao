// Bot de WhatsApp da demo do Timão.
// Conecta um número de teste pelo QR code (como o WhatsApp Web) e expõe um endpoint que o painel chama
// pra mandar a mensagem pronta. Só manda pro número da demo (DESTINO), só com a senha e com limite de ritmo.
//
//   npm install && npm start
//   abre http://localhost:3333/qr, escaneia com o celular do bot e depois abre o link de configuração
//   que aparece no terminal (ele guarda o endereço e a senha do bot no navegador).

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const pino = require("pino");
const QRCode = require("qrcode");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");

const PORT = Number(process.env.PORT || 3333);
const DESTINO = String(process.env.DESTINO || "554599967324").replace(/\D/g, "");
const PAINEL = process.env.PAINEL || "https://marcielidupuy-lang.github.io/timao/";
const AUTH = path.join(__dirname, "auth");

// A senha fica em auth/token.txt (fora do git). Dá pra trocar com a variável TOKEN.
fs.mkdirSync(AUTH, { recursive: true });
const tokenFile = path.join(AUTH, "token.txt");
const TOKEN = process.env.TOKEN || (fs.existsSync(tokenFile) ? fs.readFileSync(tokenFile, "utf8").trim() : (() => {
  const t = crypto.randomBytes(9).toString("base64url");
  fs.writeFileSync(tokenFile, t);
  return t;
})());

let sock = null, conectado = false, qrAtual = null, jidDestino = null;

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH);
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({ version, auth: state, logger: pino({ level: "silent" }), browser: ["Timão", "Chrome", "1.0"] });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrAtual = qr;
      console.log(`\nEscaneie o QR com o WhatsApp do número do bot (Aparelhos conectados > Conectar um aparelho).`);
      console.log(`Se o QR abaixo sair torto, abra http://localhost:${PORT}/qr\n`);
      console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }
    if (connection === "open") {
      conectado = true;
      qrAtual = null;
      // O número da demo pode estar sem o 9 da frente: pergunta pro WhatsApp qual é o JID certo.
      const [r] = await sock.onWhatsApp(DESTINO).catch(() => []);
      jidDestino = r && r.exists ? r.jid : `${DESTINO}@s.whatsapp.net`;
      console.log(`\nBot conectado como ${sock.user && sock.user.id}. Destino: ${jidDestino}${r && r.exists ? "" : " (não achei esse número no WhatsApp)"}`);
      console.log(`\nAbra este link UMA vez no navegador da demo pra ligar o envio de verdade:\n${PAINEL}?bot=${encodeURIComponent(`http://localhost:${PORT}`)}&token=${TOKEN}\n`);
    }
    if (connection === "close") {
      conectado = false;
      const code = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log("O WhatsApp desconectou este aparelho. Apague a pasta bot/auth e rode de novo pra gerar outro QR.");
        return;
      }
      setTimeout(conectar, 2000);
    }
  });
}

// Limite de ritmo: no máximo 1 mensagem a cada 3 s e 40 por hora.
const envios = [];
function podeEnviar() {
  const agora = Date.now();
  while (envios.length && agora - envios[0] > 3600e3) envios.shift();
  if (envios.length && agora - envios[envios.length - 1] < 3000) return "Espere uns segundos entre um envio e outro.";
  if (envios.length >= 40) return "Limite de 40 mensagens por hora atingido.";
  return "";
}

function responder(res, status, corpo) {
  res.writeHead(status, {
    "content-type": typeof corpo === "string" ? "text/html; charset=utf-8" : "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, x-token",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    // O painel publicado (https) chama o bot em localhost: o Chrome pede essa permissão de rede local.
    "access-control-allow-private-network": "true"
  });
  res.end(typeof corpo === "string" ? corpo : JSON.stringify(corpo));
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "OPTIONS") return responder(res, 204, {});
  if (req.method === "GET" && url.pathname === "/status") return responder(res, 200, { conectado, destino: DESTINO });
  if (req.method === "GET" && url.pathname === "/qr") {
    if (conectado) return responder(res, 200, `<meta charset="utf-8"><body style="font:16px system-ui;padding:40px">Bot conectado ✅. Pode fechar esta página.</body>`);
    if (!qrAtual) return responder(res, 200, `<meta charset="utf-8"><meta http-equiv="refresh" content="2"><body style="font:16px system-ui;padding:40px">Gerando o QR…</body>`);
    const img = await QRCode.toDataURL(qrAtual, { margin: 1, width: 320 });
    return responder(res, 200, `<meta charset="utf-8"><meta http-equiv="refresh" content="20"><body style="font:16px system-ui;padding:40px;text-align:center"><h2>Escaneie com o WhatsApp do bot</h2><p>Aparelhos conectados › Conectar um aparelho</p><img src="${img}" alt="QR code do WhatsApp"></body>`);
  }
  if (req.method === "POST" && url.pathname === "/enviar") {
    if (req.headers["x-token"] !== TOKEN) return responder(res, 401, { erro: "senha do bot errada" });
    if (!conectado || !jidDestino) return responder(res, 503, { erro: "bot desconectado" });
    const espera = podeEnviar();
    if (espera) return responder(res, 429, { erro: espera });
    let corpo = "";
    for await (const parte of req) { corpo += parte; if (corpo.length > 8000) return responder(res, 413, { erro: "mensagem grande demais" }); }
    let texto = "";
    try { texto = String(JSON.parse(corpo).texto || "").trim().slice(0, 2000); } catch (e) {}
    if (!texto) return responder(res, 400, { erro: "mensagem vazia" });
    try {
      await sock.sendMessage(jidDestino, { text: texto });
      envios.push(Date.now());
      console.log(`[${new Date().toLocaleTimeString("pt-BR")}] enviado: ${texto.slice(0, 70)}${texto.length > 70 ? "…" : ""}`);
      return responder(res, 200, { ok: true });
    } catch (e) {
      return responder(res, 500, { erro: "o WhatsApp recusou o envio" });
    }
  }
  responder(res, 404, { erro: "não existe" });
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Bot do Timão em http://localhost:${PORT} · destino ${DESTINO}`);
  conectar();
});
