(() => {
  const KEY = "timao-state-v1";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- estado (DATA + o que mudou na demo) ----------
  let S = load();
  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return JSON.parse(JSON.stringify(window.DATA));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    pulseSync();
  }

  // ---------- ícones ----------
  const I = {
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M20 11.5l-8.3 8.3a5 5 0 01-7.1-7.1l8.8-8.8a3.3 3.3 0 014.7 4.7l-8.8 8.8a1.7 1.7 0 01-2.4-2.4l8.1-8.1"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 3v4M16 3v4" stroke="currentColor"/><g fill="#fff" stroke="none"><rect x="6.5" y="10" width="3" height="2.4" rx=".5"/><rect x="10.5" y="10" width="3" height="2.4" rx=".5"/><rect x="14.5" y="10" width="3" height="2.4" rx=".5"/><rect x="6.5" y="14" width="3" height="2.4" rx=".5"/><rect x="10.5" y="14" width="3" height="2.4" rx=".5"/><rect x="14.5" y="14" width="3" height="2.4" rx=".5"/></g></svg>',
    link: '<svg viewBox="0 0 48 48" stroke-width="3.5"><path d="M20 28l8-8"/><path d="M22 14l3-3a7 7 0 0110 10l-3 3"/><path d="M26 34l-3 3a7 7 0 01-10-10l3-3"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="#111" stroke="#fff" stroke-width="1.4"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-3.8A8 8 0 1112 20a8 8 0 01-3.9-1z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.8-.9-.8.8a4 4 0 01-2.4-2.4l.8-.8-.9-1.8z" fill="currentColor" stroke="none"/></svg>',
    ticket: '<svg viewBox="0 0 24 24"><path d="M4 7h16v3a2 2 0 000 4v3H4v-3a2 2 0 000-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg>',
    meet: '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19a5.5 5.5 0 0111 0M14.5 18a4 4 0 017 0"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></svg>',
    dot: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>'
  };
  const GATILHO = {
    prazo: { ic: I.clock, nome: "Prazo vencido" },
    whatsapp: { ic: I.whatsapp, nome: "WhatsApp" },
    ticket: { ic: I.ticket, nome: "Chamado" },
    agenda: { ic: I.cal.replace('fill="currentColor"', 'fill="none" stroke="currentColor"'), nome: "Agenda" },
    reuniao: { ic: I.meet, nome: "Fim de reunião" },
    painel: { ic: I.spark, nome: "Painel" }
  };
  const DONO = { prefeitura: "Prefeitura", aprova: "Aprova", agente: "Agente" };
  const VST = { aprovado: "Aprovado", reprovado: "Ajuste pedido", pendente: "Aguardando você", ajuste: "Em ajuste pelo agente" };

  // ---------- datas ----------
  const now = () => new Date();
  const d = (iso) => new Date(iso);
  const dia = (iso) => d(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const hora = (iso) => d(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const isoNow = () => {
    const n = now();
    const p = (x) => String(x).padStart(2, "0");
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
  };
  function rel(iso) {
    const diff = (now() - d(iso)) / 60000;
    if (diff < 1) return "agora";
    if (diff < 60) return `há ${Math.round(diff)} min`;
    if (diff < 60 * 24 && d(iso).getDate() === now().getDate()) return `hoje, ${hora(iso)}`;
    return `${dia(iso)}, ${hora(iso)}`;
  }
  const daysUntil = (iso) => Math.ceil((d(iso) - now()) / 86400000);

  // ---------- helpers de estado ----------
  const allTasks = () => S.fases.flatMap((f) => f.tasks.map((t) => ({ ...t, fase: f })));
  const isLate = (t) => !t.feito && d(t.data) < now();
  function log(gatilho, texto) {
    S.atividade.unshift({ hora: isoNow(), gatilho, texto, novo: true });
  }
  let ticketSeq = 18380;
  const novoTicket = () => "#" + ticketSeq++;

  // ---------- topo ----------
  function renderTop() {
    const c = S.cliente;
    $("#client").innerHTML = `<b>${esc(c.nome)} · ${esc(c.uf)}</b><small>${esc(c.contrato)} · ${c.secretarias} secretarias · ${c.processos} processos · implantadora ${esc(c.implantador)} · Pylon ${esc(c.pylon)}</small>`;
  }
  let lastSync = Date.now();
  function pulseSync() {
    lastSync = Date.now();
    const el = $("#sync");
    el.classList.add("busy");
    $("#syncTxt").textContent = "Gravando no Pylon…";
    setTimeout(() => { el.classList.remove("busy"); tickSync(); }, 900);
  }
  function tickSync() {
    if ($("#sync").classList.contains("busy")) return;
    const s = Math.round((Date.now() - lastSync) / 1000);
    $("#syncTxt").textContent = s < 5 ? "Pylon sincronizado agora" : `Pylon sincronizado há ${s < 60 ? s + "s" : Math.round(s / 60) + " min"}`;
  }
  function tickClock() {
    $("#clock").textContent = now().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + "  " + now().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  // ---------- KPIs ----------
  function renderKpis() {
    const tasks = allTasks();
    const aguardando = tasks.filter((t) => t.dono === "prefeitura" && !t.feito).length + S.validacoes.filter((v) => v.status === "pendente").length;
    const entrega = Math.round((tasks.filter((t) => t.feito).length / tasks.length) * 100);
    const aprovados = S.validacoes.filter((v) => v.status === "aprovado").length;
    const dias = daysUntil(S.cliente.meta + "T09:00");
    $("#kpis").innerHTML = `
      <div class="kpi ${aguardando ? "alert" : "good"}"><span class="v">${aguardando}</span><span class="l">aguardando você</span><span class="s">tarefas e vídeos da prefeitura</span></div>
      <div class="kpi cyan"><span class="v">${entrega}%</span><span class="l">da implantação entregue</span><div class="bar"><i style="width:${entrega}%"></i></div></div>
      <div class="kpi good"><span class="v">${S.cliente.horasReuniaoEvitadas}h</span><span class="l">de reunião evitadas</span><span class="s">validação por vídeo em vez de call</span></div>
      <div class="kpi"><span class="v">${dias}</span><span class="l">dias para o go-live</span><span class="s">${aprovados} de ${S.validacoes.length} vídeos aprovados · meta ${dia(S.cliente.meta + "T09:00")}</span></div>`;
  }

  // ---------- fases ----------
  function renderFases() {
    $("#fases").innerHTML = S.fases.map((f) => {
      const feitas = f.tasks.filter((t) => t.feito).length;
      const tasks = [...f.tasks].sort((a, b) => (isLate(b) - isLate(a)) || (a.feito - b.feito) || (d(a.data) - d(b.data)));
      return `<section class="fase ${f.status}">
        <div class="fase-h"><h2>${esc(f.nome)}</h2><span class="desc">${esc(f.descricao)}</span><span class="count">${feitas}/${f.tasks.length}</span></div>
        <ul class="tasks">${tasks.map((t) => {
          const late = isLate(t);
          const podeMarcar = t.dono === "prefeitura" && f.status === "ativa";
          return `<li class="task ${t.feito ? "done" : ""} ${late ? "late" : ""}">
            <button class="cb" ${podeMarcar ? `data-task="${t.id}"` : "disabled"} aria-label="${t.feito ? "Feito" : "Marcar como feito"}">${t.feito ? I.check : ""}</button>
            <div class="t"><span class="tt">${esc(t.titulo)}</span>
              <span class="meta"><span class="tag ${t.dono}">${DONO[t.dono]}</span>${t.ticket ? `<span class="tag ticket">${esc(t.ticket)}</span>` : ""}${late ? `<span class="late-tag">atrasada · agente já cobrou no WhatsApp</span>` : ""}</span>
            </div>
            <span class="when">${dia(t.data)}<b>${hora(t.data)}</b></span>
          </li>`;
        }).join("")}</ul>
      </section>`;
    }).join("");
  }

  // ---------- reuniões ----------
  function renderReunioes() {
    const ico = { feito: I.check, atrasado: I.clock, andamento: I.bolt };
    $("#reunioes").innerHTML = [...S.reunioes].sort((a, b) => d(b.data) - d(a.data)).map((r) => `
      <div class="reu">
        <div class="reu-h"><h3>${esc(r.titulo)}<span class="st ${r.status}">${r.status === "realizada" ? "Realizada" : "Agendada"}</span></h3>
          <span class="d">${dia(r.data)} · ${hora(r.data)} · ${esc(r.secretaria)}</span></div>
        ${r.acionaveis ? `<ul>${r.acionaveis.map((a) => `<li><span class="ic s-${a.status}">${ico[a.status] || I.dot}</span><span>${esc(a.texto)} <span class="tag ${a.dono}">${DONO[a.dono]}</span>${a.fup ? `<span class="sub">${esc(a.fup)}</span>` : ""}</span></li>`).join("")}</ul>` : ""}
        ${r.pauta ? `<div class="pauta-l">Pauta montada pelo agente</div><ul>${r.pauta.map((p) => `<li><span class="ic s-pauta">${I.dot}</span><span>${esc(p)}</span></li>`).join("")}</ul>` : ""}
        ${r.confirmacao ? `<div class="conf">${esc(r.confirmacao)}</div>` : ""}
      </div>`).join("");
  }

  // ---------- checklist ----------
  function renderChecklist() {
    const pend = allTasks().filter((t) => t.dono === "prefeitura" && t.fase.status === "ativa").sort((a, b) => a.feito - b.feito || d(a.data) - d(b.data));
    const vids = S.validacoes.filter((v) => v.status === "pendente");
    const items = [
      ...pend.map((t) => {
        const dd = daysUntil(t.data);
        const aviso = t.feito ? "" : isLate(t) ? `Atrasada desde ${dia(t.data)}` : dd <= 1 ? "Falta 1 dia" : "";
        return `<li class="${t.feito ? "done" : ""}"><button class="rd" data-task="${t.id}" aria-label="Marcar">${t.feito ? I.check : ""}</button><span>${esc(t.titulo)}${aviso ? `<small>${aviso}</small>` : ""}</span></li>`;
      }),
      ...vids.map((v) => `<li><button class="rd" data-open="${v.id}" aria-label="Abrir vídeo"></button><span>Validar vídeo: ${esc(v.processo)}<small style="color:var(--amber)">vídeo novo</small></span></li>`)
    ];
    $("#checklist").innerHTML = items.join("") || `<li class="empty">Nada pendente hoje 🎉</li>`;
  }

  // ---------- feed do agente ----------
  function renderFeed() {
    $("#feed").innerHTML = S.atividade.slice(0, 30).map((a) => {
      const g = GATILHO[a.gatilho] || GATILHO.painel;
      return `<li class="${a.novo ? "new" : ""}"><span class="g">${g.ic}</span><span><span class="trg">${g.nome}</span> · ${esc(a.texto)}<span class="when">${rel(a.hora)}</span></span></li>`;
    }).join("");
    S.atividade.forEach((a) => delete a.novo);
  }

  // ---------- vídeos ----------
  let filtro = "todos";
  function mockHTML(v, playing) {
    const base = ["Nome do requerente", "CPF / CNPJ", "Endereço do imóvel"];
    let n = 0;
    const campos = base.map((l) => ({ l, novo: false })).concat(v.alteracoes.map((l) => ({ l, novo: true, n: n++ })));
    const slug = v.processo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    return `<div class="mock ${playing ? "play" : "mini"}" aria-hidden="true">
      <div class="mock-bar"><i></i><i></i><i></i><span>prefeitura.aprova.com.br/${slug}</span></div>
      <div class="mock-body"><div class="mock-title">${esc(v.processo)}</div>
        ${campos.map((c) => `<div class="mf ${c.novo ? "novo" : ""}" style="--n:${c.n || 0}"><label>${esc(c.l)}</label><div class="mi"></div></div>`).join("")}
        <span class="mock-btn">Enviar solicitação</span>
      </div>
      <div class="cursor">${I.cursor}</div>
    </div>`;
  }
  function renderValidacoes() {
    const cont = { todos: S.validacoes.length };
    S.validacoes.forEach((v) => (cont[v.status] = (cont[v.status] || 0) + 1));
    const tabs = [["todos", "Todos"], ["pendente", "Aguardando você"], ["aprovado", "Aprovados"], ["reprovado", "Ajuste pedido"], ["ajuste", "Em ajuste"]].filter(([k]) => k === "todos" || cont[k]);
    if (!tabs.some(([k]) => k === filtro)) filtro = "todos";
    $("#filters").innerHTML = tabs.map(([k, l]) => `<button role="tab" data-f="${k}" aria-selected="${k === filtro}">${l} · ${cont[k]}</button>`).join("");
    const lista = S.validacoes.filter((v) => filtro === "todos" || v.status === filtro);
    $("#vgrid").innerHTML = lista.map((v) => `
      <button class="vcard" data-open="${v.id}">
        <div class="vframe">${mockHTML(v, false)}<span class="link-ic">${I.link}</span><span class="play"><span>${I.play}</span></span></div>
        <div class="vlabel"><span class="st st-ic ${v.status}">${v.status === "aprovado" ? I.check : v.status === "reprovado" ? I.x : v.status === "ajuste" ? I.bolt : I.clock}</span>${esc(v.processo)}</div>
        <div class="vsub">${esc(VST[v.status])} · ${esc(v.ticket)}</div>
      </button>`).join("");
  }

  // ---------- usuários ----------
  function renderUsuarios() {
    const L = { cadastrado: "Cadastrado pelo agente", preenchido: "Dados preenchidos", "link-enviado": "Link enviado" };
    $("#usuarios").innerHTML = `<thead><tr><th>Nome</th><th>Cargo</th><th>Secretaria</th><th>Status</th></tr></thead><tbody>${S.usuarios.map((u) => `<tr><td><b>${esc(u.nome)}</b></td><td>${esc(u.cargo)}</td><td>${esc(u.secretaria)}</td><td><span class="ust ${u.status}">${L[u.status]}</span></td></tr>`).join("")}</tbody>`;
  }

  function renderAll() {
    renderTop(); renderKpis(); renderFases(); renderReunioes(); renderChecklist(); renderFeed(); renderValidacoes(); renderUsuarios();
  }

  // ---------- ai.aprova (simulado na demo; em produção é o agente) ----------
  function aiBox({ placeholder, chips = [], ctx = null, logEl = null }) {
    const box = document.createElement("div");
    box.className = "ai";
    box.innerHTML = `<div class="ai-log"></div>
      <form class="ai-bar">
        <label class="ic-btn" title="Anexar PDF, foto ou planilha">${I.clip}<input type="file" hidden></label>
        <input type="text" placeholder="${esc(placeholder)}" aria-label="Mensagem para o ai.aprova">
        <button type="button" class="ic-btn mic" title="Gravar áudio">${I.mic}</button>
        <button type="submit" class="ic-btn" title="Enviar">${I.send}</button>
      </form>
      ${chips.length ? `<div class="chips">${chips.map((c) => `<button type="button" class="chip">${esc(c)}</button>`).join("")}</div>` : ""}`;
    const logBox = $(".ai-log", box);
    const input = $("input[type=text]", box);
    const say = (who, html, cls = "") => {
      const m = document.createElement("div");
      m.className = `msg ${who} ${cls}`;
      m.innerHTML = who === "bot" ? `<b class="who">ai.aprova</b>${html}` : html;
      logBox.appendChild(m);
      logBox.scrollTop = logBox.scrollHeight;
      return m;
    };
    const send = (text) => {
      if (!text.trim()) return;
      say("user", esc(text));
      input.value = "";
      const t = say("bot", "digitando…", "typing");
      setTimeout(() => { t.remove(); say("bot", responder(text, ctx)); }, 800);
    };
    $("form", box).addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
    box.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => send(b.textContent)));
    $("input[type=file]", box).addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const chip = document.createElement("div");
      chip.className = "file-chip";
      chip.textContent = "📎 " + f.name;
      logBox.appendChild(chip);
      const t = say("bot", "lendo o arquivo…", "typing");
      setTimeout(() => {
        t.remove();
        const tk = novoTicket();
        log("ticket", `Arquivo "${f.name}" recebido pelo painel: regras extraídas e anexadas ao ${tk}`);
        save(); renderFeed();
        say("bot", `Recebi <b>${esc(f.name)}</b>. Extraí as regras e anexei ao chamado ${tk}. Quando o formulário estiver ajustado, mando o vídeo de validação aqui e no WhatsApp.`);
      }, 1200);
      e.target.value = "";
    });
    const mic = $(".mic", box);
    mic.addEventListener("click", () => {
      if (mic.classList.contains("rec")) {
        mic.classList.remove("rec");
        input.placeholder = placeholder;
        send(ctx ? "O campo de prazo tem que ser 30 dias, não 15" : "Quero mudar o formulário do Alvará");
      } else {
        mic.classList.add("rec");
        input.placeholder = "Gravando… toque de novo para enviar";
      }
    });
    if (logEl) logEl(say);
    return box;
  }

  function responder(text, ctx) {
    const t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (ctx) {
      const v = S.validacoes.find((x) => x.id === ctx);
      v.status = "ajuste";
      v.comentario = text;
      log("painel", `Ajuste pedido no vídeo do ${v.processo}: "${text}". Agente atualizou o ${v.ticket} e já está ajustando`);
      save(); afterChange(v.id);
      return `Anotado no chamado ${esc(v.ticket)}. Já estou ajustando o <b>${esc(v.processo)}</b> e te mando um vídeo novo em até 2h, aqui e no WhatsApp.`;
    }
    if (t.includes("valid")) {
      const pend = S.validacoes.filter((v) => v.status === "pendente");
      if (!pend.length) return "Nenhum vídeo aguardando você agora. Quando eu terminar um ajuste, ele aparece aqui.";
      setTimeout(() => openPlayer(pend[0].id), 900);
      return `Você tem <b>${pend.length} vídeo${pend.length > 1 ? "s" : ""}</b> pra validar. Abrindo o primeiro: ${esc(pend[0].processo)}. Arraste pra cima pra ver o próximo.`;
    }
    if (t.includes("formul") || t.includes("alter") || t.includes("mudar")) {
      return "Me diz qual processo e o que muda. Pode escrever, mandar áudio ou anexar a lei, uma foto do formulário de papel ou a planilha.\nEu abro o chamado, ajusto e devolvo um vídeo pra você aprovar.";
    }
    if (t.includes("cadastr") || t.includes("usuar")) {
      const n = S.usuarios.filter((u) => u.status === "link-enviado").length;
      return `Mando o link de cadastro no WhatsApp de quem você indicar. Ainda faltam <b>${n}</b> pessoas preencherem. Já reenviei o lembrete pra elas.`;
    }
    if (t.includes("prazo") || t.includes("quando") || t.includes("reuni")) {
      const prox = allTasks().filter((x) => !x.feito).sort((a, b) => d(a.data) - d(b.data))[0];
      return `Próximo passo: <b>${esc(prox.titulo)}</b> em ${dia(prox.data)} às ${hora(prox.data)}. Go-live previsto para ${dia(S.cliente.meta + "T09:00")}.`;
    }
    const tk = novoTicket();
    log("ticket", `Pedido pelo painel virou o chamado ${tk}: "${text}"`);
    save(); renderFeed();
    return `Abri o chamado ${tk} com isso e já comecei. Te aviso aqui e no WhatsApp quando estiver pronto.`;
  }

  // ---------- player / reel ----------
  let capTimer = null;
  function slideHTML(v) {
    return `<section class="slide" data-id="${v.id}">
      <div class="stage">
        <div><span class="pill">${esc(v.processo)}</span><span class="vstatus ${v.status}">${esc(VST[v.status])}</span></div>
        <div class="who">${esc(v.secretaria)} · ${esc(v.ticket)} · vídeo gerado pelo agente ${rel(v.gerado)}</div>
        <div class="mockwrap">${mockHTML(v, true)}</div>
        <div class="caption"><span class="k">ALTERAÇÃO 1/${v.alteracoes.length}</span><span class="t">${esc(v.alteracoes[0])}</span></div>
      </div>
      <div class="actions">
        <button class="act ok" data-act="ok" title="Aprovar">${I.check}</button>
        <button class="act no" data-act="no" title="Pedir ajuste">${I.x}</button>
        <button class="act cal" data-act="cal" title="Agendar conversa">${I.cal}</button>
      </div>
      <div class="side">
        <h4>O que precisa mudar?</h4>
        <p class="sub">Fale com o ai.aprova sobre este vídeo</p>
        ${v.comentario ? `<div class="comment ${v.status === "aprovado" ? "ok" : ""}">${esc(v.comentario)}</div>` : ""}
        <div class="ai-slot"></div>
      </div>
    </section>`;
  }
  function openPlayer(id) {
    const reel = $("#reel");
    reel.innerHTML = S.validacoes.map(slideHTML).join("") ;
    reel.querySelectorAll(".slide").forEach((sl) => {
      const box = aiBox({ placeholder: "Ex.: o prazo é 30 dias", chips: ["Está tudo certo", "Falta um campo", "Mudar a etapa de análise"], ctx: sl.dataset.id });
      $(".ai-slot", sl).replaceWith(box);
      box.querySelectorAll(".chip").forEach((c) => {
        if (c.textContent === "Está tudo certo") {
          const clone = c.cloneNode(true);
          c.replaceWith(clone);
          clone.addEventListener("click", () => decide(sl.dataset.id, "aprovado"));
        }
      });
    });
    $("#player").hidden = false;
    document.body.style.overflow = "hidden";
    const target = reel.querySelector(`[data-id="${id}"]`);
    reel.scrollTop = target ? target.offsetTop : 0;
    startCaptions();
  }
  function closePlayer() {
    $("#player").hidden = true;
    document.body.style.overflow = "";
    clearInterval(capTimer);
  }
  function startCaptions() {
    clearInterval(capTimer);
    const idx = {};
    capTimer = setInterval(() => {
      const reel = $("#reel");
      const i = Math.round(reel.scrollTop / reel.clientHeight);
      const sl = reel.children[i];
      if (!sl) return;
      const v = S.validacoes.find((x) => x.id === sl.dataset.id);
      idx[v.id] = ((idx[v.id] || 0) + 1) % v.alteracoes.length;
      $(".caption", sl).innerHTML = `<span class="k">ALTERAÇÃO ${idx[v.id] + 1}/${v.alteracoes.length}</span><span class="t">${esc(v.alteracoes[idx[v.id]])}</span>`;
    }, 2600);
  }
  function decide(id, status) {
    const v = S.validacoes.find((x) => x.id === id);
    v.status = status;
    if (status === "aprovado") {
      v.comentario = `Aprovado pela prefeitura em ${dia(isoNow())}`;
      log("painel", `Prefeitura aprovou o vídeo do ${v.processo}. O agente fechou o ${v.ticket} e marcou o processo como pronto pro go-live`);
      toast(`✅ ${v.processo} aprovado. Ticket ${v.ticket} fechado.`);
    }
    save(); afterChange(id);
    if (status === "aprovado") setTimeout(() => nextSlide(id), 700);
  }
  function afterChange(id) {
    renderKpis(); renderChecklist(); renderFeed(); renderValidacoes();
    const sl = $(`#reel [data-id="${id}"]`);
    if (!sl) return;
    const v = S.validacoes.find((x) => x.id === id);
    const st = $(".vstatus", sl);
    st.className = `vstatus ${v.status}`;
    st.textContent = VST[v.status];
    let cm = $(".comment", sl);
    if (v.comentario) {
      if (!cm) { cm = document.createElement("div"); $(".side h4", sl).nextElementSibling.after(cm); }
      cm.className = `comment ${v.status === "aprovado" ? "ok" : ""}`;
      cm.textContent = v.comentario;
    }
  }
  function nextSlide(id) {
    const sl = $(`#reel [data-id="${id}"]`);
    const nx = sl && sl.nextElementSibling;
    if (nx) $("#reel").scrollTo({ top: nx.offsetTop, behavior: "smooth" });
  }
  function showSlots(sl) {
    const old = $(".slots", sl);
    if (old) { old.remove(); return; }
    const base = now();
    const opts = [1, 2, 3].map((k) => {
      const x = new Date(base); x.setDate(x.getDate() + k + (x.getDay() === 5 ? 2 : 0)); x.setHours([10, 14, 16][k - 1], 0, 0, 0);
      return x;
    });
    const box = document.createElement("div");
    box.className = "slots";
    box.innerHTML = `<h5>Conversar 15 min com a implantadora</h5>${opts.map((o) => `<button data-iso="${o.toISOString()}">${o.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })} · ${o.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</button>`).join("")}`;
    sl.appendChild(box);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const v = S.validacoes.find((x) => x.id === sl.dataset.id);
      const when = new Date(b.dataset.iso);
      const p = (x) => String(x).padStart(2, "0");
      const iso = `${when.getFullYear()}-${p(when.getMonth() + 1)}-${p(when.getDate())}T${p(when.getHours())}:00`;
      S.reunioes.push({ id: "r" + Date.now(), titulo: `Conversa rápida · ${v.processo}`, data: iso, secretaria: v.secretaria, status: "agendada", confirmacao: "Agente confirma no WhatsApp um dia antes", pauta: [`Dúvidas sobre o vídeo do ${v.processo}`, ...v.alteracoes] });
      log("agenda", `Conversa de 15 min sobre o ${v.processo} agendada para ${dia(iso)} às ${hora(iso)}. Pauta montada com as alterações do vídeo`);
      save(); renderReunioes(); renderFeed();
      box.remove();
      toast(`📅 Agendado: ${dia(iso)} às ${hora(iso)}. Convite enviado no WhatsApp.`);
    });
  }

  // ---------- toast ----------
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("on"), 3200);
  }

  // ---------- eventos ----------
  document.addEventListener("click", (e) => {
    const cb = e.target.closest("[data-task]");
    if (cb) {
      const t = allTasks().find((x) => x.id === cb.dataset.task);
      const real = t.fase.tasks.find((x) => x.id === t.id);
      real.feito = !real.feito;
      if (real.feito) {
        log("painel", `Prefeitura concluiu "${real.titulo}". O agente liberou o próximo passo`);
        toast("Feito! O agente já seguiu com o próximo passo.");
      }
      save(); renderKpis(); renderFases(); renderChecklist(); renderFeed();
      return;
    }
    const op = e.target.closest("[data-open]");
    if (op) { openPlayer(op.dataset.open); return; }
    const f = e.target.closest("[data-f]");
    if (f) { filtro = f.dataset.f; renderValidacoes(); return; }
    const act = e.target.closest("[data-act]");
    if (act) {
      const sl = act.closest(".slide");
      if (act.dataset.act === "ok") decide(sl.dataset.id, "aprovado");
      if (act.dataset.act === "no") {
        const v = S.validacoes.find((x) => x.id === sl.dataset.id);
        const inp = $(".side input[type=text]", sl);
        inp.placeholder = "O que precisa mudar?";
        inp.focus();
        if (v.status !== "reprovado") { v.status = "reprovado"; save(); afterChange(v.id); }
      }
      if (act.dataset.act === "cal") showSlots(sl);
    }
  });
  $("#closePlayer").addEventListener("click", closePlayer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#player").hidden) closePlayer(); });
  $("#convidar").addEventListener("click", () => {
    const pend = S.usuarios.filter((u) => u.status === "link-enviado").map((u) => u.nome.split(" ")[0]);
    log("whatsapp", `Link de cadastro enviado no WhatsApp${pend.length ? ` (lembrete para ${pend.join(", ")})` : ""}`);
    save(); renderFeed();
    toast("Link de cadastro enviado no WhatsApp.");
  });
  $("#reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = JSON.parse(JSON.stringify(window.DATA));
    renderAll();
    toast("Demo reiniciada.");
  });

  // ---------- início ----------
  $("#helpAi").appendChild(aiBox({ placeholder: "Escreva, grave um áudio ou anexe", chips: ["Validar processos", "Alteração de Formulário", "Cadastro de Usuários"] }));
  renderAll();
  tickClock(); tickSync();
  setInterval(tickClock, 15000);
  setInterval(tickSync, 1000);
  setInterval(renderFeed, 60000);
})();
