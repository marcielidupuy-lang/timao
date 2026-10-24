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
  const sv = (p, vb = "0 0 24 24") => `<svg viewBox="${vb}">${p}</svg>`;
  const I = {
    check: sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    x: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
    clock: sv('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
    clip: sv('<path d="M20 11.5l-8.3 8.3a5 5 0 01-7.1-7.1l8.8-8.8a3.3 3.3 0 014.7 4.7l-8.8 8.8a1.7 1.7 0 01-2.4-2.4l8.1-8.1"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'),
    mic: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'),
    up: sv('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    chev: sv('<path d="M7 10l5 5 5-5"/>'),
    cal: sv('<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16"/>'),
    play: sv('<path d="M7 4l13 8-13 8z"/>'),
    cursor: sv('<path d="M5 3l14 8-6 1.5L10 19z" fill="#18181b" stroke="#fff" stroke-width="1.4"/>'),
    whatsapp: sv('<path d="M4 20l1.3-3.8A8 8 0 1112 20a8 8 0 01-3.9-1z"/><path d="M9.5 9.5c0 2.8 2.2 5 5 5"/>'),
    ticket: sv('<path d="M4 7h16v3a2 2 0 000 4v3H4v-3a2 2 0 000-4z"/>'),
    meet: sv('<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19a5.5 5.5 0 0111 0M14.5 18a4 4 0 017 0"/>'),
    bolt: sv('<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>'),
    dot: sv('<circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none"/>'),
    spark: sv('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    home: sv('<path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z"/>'),
    video: sv('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>'),
    users: sv('<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2A5 5 0 0121 19"/>'),
    chat: sv('<path d="M5 18l-1.5 3 4-1.5A8 8 0 104 12a8 8 0 001 4z"/><circle cx="16" cy="16" r="3.5"/>'),
    docok: sv('<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h5"/><path d="M14 3l5 5v3M14 3v5h5"/><circle cx="17.5" cy="17.5" r="3.5"/><path d="M16 17.5l1 1 2-2"/>'),
    money: sv('<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>'),
    clipboard: sv('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>'),
    building: sv('<path d="M4 21V5l7-2v18M11 9h7v12M7 8h1M7 12h1M7 16h1M14 13h1M14 17h1M3 21h18"/>'),
    chart: sv('<path d="M4 4v16h16"/><path d="M7 15l4-5 3 3 5-7"/>'),
    bell: sv('<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/>'),
    form: sv('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    sparkle: sv('<path d="M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M7 17l2-2M15 9l2-2"/>'),
    logo: '<svg viewBox="0 0 40 40" class="sc-logo"><path d="M10 33L20 8l10 25" stroke="#111" stroke-width="3.4" fill="none"/><path d="M2 22h36" stroke="#14c3d6" stroke-width="3.2"/></svg>',
    logoSm: '<svg viewBox="0 0 40 40"><path d="M10 33L20 8l10 25" stroke="#111" stroke-width="3.4" fill="none"/><path d="M2 22h36" stroke="#14c3d6" stroke-width="3.2"/></svg>'
  };
  const GATILHO = {
    prazo: { ic: I.clock, nome: "Prazo vencido" },
    whatsapp: { ic: I.whatsapp, nome: "WhatsApp" },
    ticket: { ic: I.ticket, nome: "Chamado" },
    agenda: { ic: I.cal, nome: "Agenda" },
    reuniao: { ic: I.meet, nome: "Fim de reunião" },
    painel: { ic: I.spark, nome: "Painel" }
  };
  const DONO = { prefeitura: "Prefeitura", aprova: "Aprova", agente: "Agente" };
  const VST = { aprovado: "Aprovado", reprovado: "Ajuste pedido", pendente: "Aguardando você", ajuste: "Em ajuste pelo agente" };
  const OUTRAS = [
    { nome: "Serra Azul · SP", pct: 64 },
    { nome: "Porto Claro · PR", pct: 38 },
    { nome: "Rio Fundo · MG", pct: 12 }
  ];

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
  const entrega = () => { const t = allTasks(); return Math.round((t.filter((x) => x.feito).length / t.length) * 100); };
  function log(gatilho, texto) {
    S.atividade.unshift({ hora: isoNow(), gatilho, texto, novo: true });
  }
  let ticketSeq = 18380;
  const novoTicket = () => "#" + ticketSeq++;

  // ---------- casca ----------
  function renderShell() {
    const rail = ["chat", "docok", "users", "money", "form", "clipboard", "building", "chart"];
    $("#railIcons").innerHTML = rail.map((k) => `<span class="rail-btn ${k === "form" ? "on" : ""}">${I[k]}</span>`).join("");
    $("#railBell").innerHTML = I.bell;
    document.querySelectorAll(".ni[data-ic]").forEach((el) => (el.innerHTML = I[el.dataset.ic]));
  }
  function renderTop() {
    const c = S.cliente;
    const ativa = S.fases.find((f) => f.status === "ativa");
    $("#crumbName").textContent = c.nome;
    $("#eyebrow").textContent = `Implantação · ${ativa ? ativa.nome + " em andamento" : "concluída"}`;
    $("#heroTitle").innerHTML = `${esc(c.nome)}.<span>Implantação da prefeitura toda.</span>`;
    $("#heroMeta").textContent = `${c.secretarias} secretarias · ${c.processos} processos · implantadora ${c.implantador} · champion ${c.champion} · Pylon ${c.pylon}`;
    $("#implantacoes").innerHTML = [{ nome: `${c.nome.replace("Prefeitura de ", "")} · ${c.uf}`, pct: entrega(), on: true }, ...OUTRAS]
      .map((p) => `<button class="impl ${p.on ? "on" : ""}" ${p.on ? "" : 'data-outra="1"'}><span class="ni">${I.building}</span>${esc(p.nome)}<span class="pct">${p.pct}%</span></button>`).join("");
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

  // ---------- KPIs ----------
  function renderKpis() {
    const tasks = allTasks();
    const aguardando = tasks.filter((t) => t.dono === "prefeitura" && !t.feito).length + S.validacoes.filter((v) => v.status === "pendente").length;
    const pct = entrega();
    const aprovados = S.validacoes.filter((v) => v.status === "aprovado").length;
    const dias = daysUntil(S.cliente.meta + "T09:00");
    $("#kpis").innerHTML = `
      <div class="kpi ${aguardando ? "alert" : "good"}"><span class="k">Aguardando você</span><span class="v">${aguardando}</span><span class="s">tarefas e vídeos da prefeitura</span></div>
      <div class="kpi"><span class="k">Entrega</span><span class="v">${pct}%</span><div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="kpi good"><span class="k">Reunião evitada</span><span class="v">${S.cliente.horasReuniaoEvitadas}h</span><span class="s">validação por vídeo em vez de call</span></div>
      <div class="kpi"><span class="k">Go-live</span><span class="v">${dias} dias</span><span class="s">${aprovados} de ${S.validacoes.length} vídeos aprovados · meta ${dia(S.cliente.meta + "T09:00")}</span></div>`;
  }

  // ---------- fases ----------
  function renderFases() {
    const ST = { ativa: "Em andamento", futura: "Próxima", concluida: "Concluída" };
    const ativa = S.fases.find((f) => f.status === "ativa");
    $("#fasesHint").textContent = ativa ? `${ativa.nome}: ${ativa.tasks.filter((t) => t.feito).length} de ${ativa.tasks.length} tarefas feitas` : "";
    $("#fases").innerHTML = S.fases.map((f) => {
      const feitas = f.tasks.filter((t) => t.feito).length;
      const tasks = [...f.tasks].sort((a, b) => (isLate(b) - isLate(a)) || (a.feito - b.feito) || (d(a.data) - d(b.data)));
      return `<section class="fase ${f.status}">
        <div class="fase-h"><h3>${esc(f.nome)}</h3><span class="fase-st">${ST[f.status]}</span><span class="count">${feitas}/${f.tasks.length}</span><span class="desc">${esc(f.descricao)}</span></div>
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
        <div class="k">${esc(r.secretaria)}<span class="st ${r.status}">${r.status === "realizada" ? "Realizada" : "Agendada"}</span></div>
        <h3>${esc(r.titulo)}</h3>
        <div class="d">${dia(r.data)} · ${hora(r.data)}${r.duracao ? ` · ${r.duracao} min` : ""}</div>
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
      ...vids.map((v) => `<li><button class="rd" data-open="${v.id}" aria-label="Abrir vídeo"></button><span>Validar vídeo: ${esc(v.processo)}<small class="new">vídeo novo</small></span></li>`)
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

  // ---------- vídeo de validação ----------
  // Roteiro igual aos vídeos da Aprova: abertura, a tela com uma legenda por alteração e o fechamento.
  const STEP_MS = 2800;
  const steps = (v) => v.alteracoes.length + 2;
  function vidHTML(v) {
    const base = ["Nome do requerente", "CPF / CNPJ", "Endereço do imóvel"];
    const slug = v.processo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    const campos = base.map((l) => `<div class="ui-f"><label>${esc(l)}</label><div class="in"></div></div>`).join("") +
      v.alteracoes.map((l, i) => `<div class="ui-f novo" data-f="${i}"><label>${esc(l)}</label><div class="in"></div></div>`).join("");
    return `<div class="vid" aria-hidden="true">
      <div class="prog">${Array.from({ length: steps(v) }, () => "<i><b></b></i>").join("")}</div>
      <div class="scene intro on">
        <div class="sc-eyebrow">Validação · ${esc(v.secretaria)}</div>
        <div class="sc-title">${esc(v.processo)}.<span>O que mudou.</span></div>
        <div class="sc-cards">${v.alteracoes.map((a, i) => `${i ? '<span class="sc-arrow">→</span>' : ""}<div class="sc-card"><div class="l">Alteração ${i + 1}</div><div class="t">${esc(a)}</div></div>`).join("")}</div>
      </div>
      <div class="scene screen">
        <div class="ui-rail">${I.logoSm}<i></i><i></i><i></i><i></i></div>
        <div class="ui-main">
          <div class="ui-crumb">prefeitura.aprova.com.br / ${slug}</div>
          <div class="ui-h">${esc(v.processo)}</div>
          <div class="ui-fields">${campos}</div>
          <span class="ui-btn">Enviar solicitação</span>
        </div>
        <div class="cursor">${I.cursor}</div>
        <div class="cap"></div>
      </div>
      <div class="scene outro">
        ${I.logo}
        <div class="sc-title">${esc(v.processo)} ajustado.<span>Aprove com um toque.</span></div>
        <div class="sc-small">${esc(v.ticket)} · vídeo gerado pelo agente</div>
      </div>
    </div>`;
  }
  function showStep(vid, v, step) {
    const n = steps(v);
    const scene = step === 0 ? "intro" : step === n - 1 ? "outro" : "screen";
    vid.querySelectorAll(".scene").forEach((s) => s.classList.toggle("on", s.classList.contains(scene)));
    vid.querySelectorAll(".prog i").forEach((p, i) => { p.className = i < step ? "done" : i === step ? "cur" : ""; });
    vid.style.setProperty("--dur", STEP_MS + "ms");
    const cur = vid.querySelector(".prog i.cur");
    if (cur) { cur.className = ""; void cur.offsetWidth; cur.className = "cur"; }
    if (scene !== "screen") return;
    const k = step - 1;
    vid.querySelectorAll(".ui-f").forEach((f) => f.classList.toggle("hl", f.dataset.f === String(k)));
    $(".cap", vid).textContent = v.alteracoes[k];
    const f = vid.querySelector(`.ui-f[data-f="${k}"] .in`);
    const box = vid.getBoundingClientRect();
    const r = f.getBoundingClientRect();
    const c = $(".cursor", vid);
    c.style.left = ((r.left - box.left + r.width * 0.6) / box.width) * 100 + "%";
    c.style.top = ((r.top - box.top + r.height * 0.5) / box.height) * 100 + "%";
  }

  // ---------- validações ----------
  let filtro = "todos";
  function renderValidacoes() {
    const cont = { todos: S.validacoes.length };
    S.validacoes.forEach((v) => (cont[v.status] = (cont[v.status] || 0) + 1));
    const tabs = [["todos", "Todos"], ["pendente", "Aguardando você"], ["aprovado", "Aprovados"], ["reprovado", "Ajuste pedido"], ["ajuste", "Em ajuste"]].filter(([k]) => k === "todos" || cont[k]);
    if (!tabs.some(([k]) => k === filtro)) filtro = "todos";
    $("#filters").innerHTML = tabs.map(([k, l]) => `<button role="tab" data-f="${k}" aria-selected="${k === filtro}">${l} · ${cont[k]}</button>`).join("");
    const lista = S.validacoes.filter((v) => filtro === "todos" || v.status === filtro);
    $("#vgrid").innerHTML = lista.map((v) => `
      <button class="vcard" data-open="${v.id}">
        <div class="vthumb">${vidHTML(v)}<span class="dur">0:${String(Math.round((steps(v) * STEP_MS) / 1000)).padStart(2, "0")}</span><span class="play"><span>${I.play}</span></span></div>
        <div class="vlabel"><span class="st-ic ${v.status}">${v.status === "aprovado" ? I.check : v.status === "reprovado" ? I.x : v.status === "ajuste" ? I.bolt : I.clock}</span>${esc(v.processo)}</div>
        <div class="vsub">${esc(VST[v.status])} · ${esc(v.secretaria)} · ${esc(v.ticket)}</div>
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
  function aiBox({ placeholder, sugs = [], ctx = null }) {
    const box = document.createElement("div");
    box.className = "ai";
    box.innerHTML = `<div class="ai-log"></div>
      <form class="box">
        <textarea rows="2" placeholder="${esc(placeholder)}" aria-label="Mensagem para o ai.aprova"></textarea>
        <div class="box-row">
          <label class="ib" title="Anexar PDF, foto ou planilha">${I.plus}<input type="file" hidden></label>
          <button type="button" class="ib mic" title="Gravar áudio">${I.mic}</button>
          <span class="model">${I.sparkle}ai.aprova · implantação ${I.chev}</span>
          <span class="grow"></span>
          <span class="pill-ok">Conectado</span>
          <button type="submit" class="send" title="Enviar">${I.up}</button>
        </div>
      </form>
      ${sugs.length ? `<ul class="sugs">${sugs.map((s) => `<li><button type="button" class="sug" data-msg="${esc(s.msg || s.t)}">${I[s.ic]}<b>${esc(s.t)}</b><span>${esc(s.d)}</span></button></li>`).join("")}</ul>` : ""}`;
    const logBox = $(".ai-log", box);
    const input = $("textarea", box);
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
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } });
    box.querySelectorAll(".sug").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.msg === "__aprovar") return decide(ctx, "aprovado");
      send(b.dataset.msg);
    }));
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
        send(ctx ? "O prazo de resposta tem que ser 30 dias, não 15" : "Quero mudar o formulário do Alvará");
      } else {
        mic.classList.add("rec");
        input.placeholder = "Gravando… toque de novo para enviar";
      }
    });
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
  let playT = null, playId = null, playStep = 0;
  function slideHTML(v) {
    return `<section class="slide" data-id="${v.id}">
      <div class="stage">
        <div class="stage-h"><span class="pill">${esc(v.processo)}</span><span class="vstatus ${v.status}">${esc(VST[v.status])}</span></div>
        <div class="who">${esc(v.secretaria)} · ${esc(v.ticket)} · vídeo gerado pelo agente ${rel(v.gerado)}</div>
        <div class="vidwrap">${vidHTML(v)}</div>
      </div>
      <div class="actions">
        <button class="act ok" data-act="ok" title="Aprovar">${I.check}</button><span class="act-l">Aprovar</span>
        <button class="act no" data-act="no" title="Pedir ajuste">${I.x}</button><span class="act-l">Ajustar</span>
        <button class="act cal" data-act="cal" title="Agendar conversa">${I.cal}</button><span class="act-l">Agendar</span>
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
    reel.innerHTML = S.validacoes.map(slideHTML).join("");
    reel.querySelectorAll(".slide").forEach((sl) => {
      const box = aiBox({
        placeholder: "Ex.: o prazo é 30 dias, não 15",
        ctx: sl.dataset.id,
        sugs: [
          { ic: "check", t: "Está tudo certo", d: "aprova o vídeo", msg: "__aprovar" },
          { ic: "form", t: "Falta um campo", d: "diga qual" },
          { ic: "clock", t: "Mudar um prazo", d: "da análise ou da resposta" }
        ]
      });
      $(".ai-slot", sl).replaceWith(box);
    });
    $("#player").hidden = false;
    document.body.style.overflow = "hidden";
    const target = reel.querySelector(`[data-id="${id}"]`);
    reel.scrollTop = target ? target.offsetTop : 0;
    playId = null;
    clearInterval(playT);
    playT = setInterval(tick, STEP_MS);
    tick();
  }
  function tick() {
    const reel = $("#reel");
    const sl = reel.children[Math.round(reel.scrollTop / reel.clientHeight)];
    if (!sl) return;
    const v = S.validacoes.find((x) => x.id === sl.dataset.id);
    if (playId !== v.id) { playId = v.id; playStep = 0; } else playStep = (playStep + 1) % steps(v);
    showStep($(".vid", sl), v, playStep);
  }
  function closePlayer() {
    $("#player").hidden = true;
    document.body.style.overflow = "";
    clearInterval(playT);
  }
  function decide(id, status) {
    const v = S.validacoes.find((x) => x.id === id);
    v.status = status;
    if (status === "aprovado") {
      v.comentario = `Aprovado pela prefeitura em ${dia(isoNow())}`;
      log("painel", `Prefeitura aprovou o vídeo do ${v.processo}. O agente fechou o ${v.ticket} e marcou o processo como pronto pro go-live`);
      toast(`${v.processo} aprovado. Ticket ${v.ticket} fechado.`);
    }
    save(); afterChange(id);
    if (status === "aprovado") setTimeout(() => nextSlide(id), 700);
  }
  function afterChange(id) {
    renderTop(); renderKpis(); renderChecklist(); renderFeed(); renderValidacoes();
    const sl = $(`#reel [data-id="${id}"]`);
    if (!sl) return;
    const v = S.validacoes.find((x) => x.id === id);
    const st = $(".vstatus", sl);
    st.className = `vstatus ${v.status}`;
    st.textContent = VST[v.status];
    let cm = $(".comment", sl);
    if (v.comentario) {
      if (!cm) { cm = document.createElement("div"); $(".side .sub", sl).after(cm); }
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
      toast(`Agendado: ${dia(iso)} às ${hora(iso)}. Convite enviado no WhatsApp.`);
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
      save(); renderTop(); renderKpis(); renderFases(); renderChecklist(); renderFeed();
      return;
    }
    const op = e.target.closest("[data-open]");
    if (op) { openPlayer(op.dataset.open); return; }
    const f = e.target.closest("[data-f]");
    if (f && f.closest("#filters")) { filtro = f.dataset.f; renderValidacoes(); return; }
    if (e.target.closest("[data-outra]")) { toast("Na demo, só Vale Verde tem dados."); return; }
    const act = e.target.closest("[data-act]");
    if (act) {
      const sl = act.closest(".slide");
      if (act.dataset.act === "ok") decide(sl.dataset.id, "aprovado");
      if (act.dataset.act === "no") {
        const v = S.validacoes.find((x) => x.id === sl.dataset.id);
        const inp = $(".side textarea", sl);
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
  renderShell();
  $("#helpAi").appendChild(aiBox({
    placeholder: "Escreva uma mensagem, grave um áudio ou anexe a lei…",
    sugs: [
      { ic: "video", t: "Validar processos", d: "Abre os vídeos que estão esperando a sua aprovação." },
      { ic: "form", t: "Alteração de Formulário", d: "Diga o que muda. Pode mandar PDF, foto ou áudio." },
      { ic: "users", t: "Cadastro de Usuários", d: "Envia o link de cadastro para a sua equipe no WhatsApp." }
    ]
  }));
  renderAll();
  tickSync();
  setInterval(tickSync, 1000);
  setInterval(renderFeed, 60000);
})();
