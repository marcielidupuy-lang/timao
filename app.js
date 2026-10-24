(() => {
  const KEY = "timao-state-v3";
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
  const sv = (p) => `<svg viewBox="0 0 24 24">${p}</svg>`;
  const I = {
    check: sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    x: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
    clock: sv('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'),
    mic: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'),
    up: sv('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    chev: sv('<path d="M7 10l5 5 5-5"/>'),
    right: sv('<path d="M9 6l6 6-6 6"/>'),
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
    layers: sv('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    upload: sv('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>'),
    sparkle: sv('<path d="M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M7 17l2-2M15 9l2-2"/>'),
    logo: '<svg viewBox="0 0 40 40" class="sc-logo"><path d="M10 33L20 8l10 25" stroke="#111" stroke-width="3.4" fill="none"/><path d="M2 22h36" stroke="#14c3d6" stroke-width="3.2"/></svg>',
    logoSm: '<svg viewBox="0 0 40 40"><path d="M10 33L20 8l10 25" stroke="#111" stroke-width="3.4" fill="none"/><path d="M2 22h36" stroke="#14c3d6" stroke-width="3.2"/></svg>'
  };
  const GATILHO = {
    prazo: { ic: I.clock, nome: "Prazo vencido", instr: "03-fup-whatsapp" },
    whatsapp: { ic: I.whatsapp, nome: "WhatsApp", instr: "03-fup-whatsapp" },
    ticket: { ic: I.ticket, nome: "Chamado", instr: "04-videos-validacao" },
    agenda: { ic: I.cal, nome: "Agenda", instr: "05-champions" },
    reuniao: { ic: I.meet, nome: "Fim de reunião", instr: "02-acionaveis-reuniao" },
    painel: { ic: I.spark, nome: "Painel", instr: "04-videos-validacao" },
    manual: { ic: I.bolt, nome: "Execução pedida", instr: "01-gatilhos" }
  };
  const INSTR = [
    ["00-regras-gerais", "Tom, canais, limites e quando chamar você"],
    ["01-gatilhos", "Roteador: classifica o evento e chama a instrução certa"],
    ["02-acionaveis-reuniao", "Reunião vira tarefas e tickets preenchidos"],
    ["03-fup-whatsapp", "Cobra o que está 2 dias atrasado e responde sobre prazo"],
    ["04-videos-validacao", "Gera o vídeo de cada ajuste e trata ✓ ✗ 📅"],
    ["05-champions", "Primeiro contato, agenda, pauta e confirmação"],
    ["06-cadastro-usuarios", "Link de cadastro e cadastro no prefeitura.aprova"]
  ];
  const REPO = "https://github.com/marcielidupuy-lang/timao/blob/main/INSTRUCTIONS/";
  // Na visão da prefeitura o agente é "Aprova": o cliente não precisa saber quem executa.
  const DONO = { i: { prefeitura: "Prefeitura", aprova: "Aprova", agente: "Agente" }, c: { prefeitura: "Sua equipe", aprova: "Aprova", agente: "Aprova" } };
  const VST = {
    i: { aprovado: "Aprovado", reprovado: "Ajuste pedido", pendente: "Com a prefeitura", ajuste: "Em ajuste pelo agente" },
    c: { aprovado: "Aprovado", reprovado: "Ajuste pedido", pendente: "Aguardando você", ajuste: "A Aprova está ajustando" }
  };
  const SAUDE = { ok: "No prazo", atencao: "Atenção", risco: "Em risco" };

  // ---------- datas ----------
  const now = () => new Date();
  const d = (iso) => new Date(iso);
  const dia = (iso) => d(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const hora = (iso) => d(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const diaSem = (iso) => d(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
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
  const saudacao = () => { const h = now().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };

  // ---------- consultas ----------
  const allTasks = () => S.fases.flatMap((f) => f.tasks.map((t) => ({ ...t, fase: f })));
  const findTask = (id) => { for (const f of S.fases) { const t = f.tasks.find((x) => x.id === id); if (t) return t; } };
  const isLate = (t) => !t.feito && d(t.data) < now();
  const entrega = () => { const t = allTasks(); return Math.round((t.filter((x) => x.feito).length / t.length) * 100); };
  const ativa = () => S.fases.find((f) => f.status === "ativa");
  const vidsPend = () => S.validacoes.filter((v) => v.status === "pendente");
  const ajustes = () => S.validacoes.filter((v) => v.status === "reprovado" || v.status === "ajuste");
  const doCliente = () => allTasks().filter((t) => t.dono === "prefeitura" && !t.feito && t.fase.status === "ativa");
  const minhas = () => allTasks().filter((t) => t.dono !== "prefeitura" && !t.feito && t.fase.status === "ativa");
  const semResposta = () => allTasks().filter((t) => t.dono === "prefeitura" && isLate(t));
  const proxReunioes = () => S.reunioes.filter((r) => r.status === "agendada").sort((a, b) => d(a.data) - d(b.data));
  function log(gatilho, texto) { S.atividade.unshift({ hora: isoNow(), gatilho, texto, novo: true }); }
  let ticketSeq = 18380;
  const novoTicket = () => "#" + ticketSeq++;

  // ---------- rotas ----------
  const ROUTES = {
    i: [
      { id: "carteira", nome: "Minha carteira", ic: "layers", geral: true },
      { id: "visao", nome: "Visão geral", ic: "home" },
      { id: "fila", nome: "Minha fila", ic: "clipboard", badge: () => ajustes().length + minhas().length + semResposta().length },
      { id: "fases", nome: "Fases e tarefas", ic: "form" },
      { id: "reunioes", nome: "Reuniões", ic: "meet" },
      { id: "validacoes", nome: "Validações", ic: "video", badge: () => ajustes().length },
      { id: "usuarios", nome: "Usuários", ic: "users" },
      { id: "agente", nome: "Agente", ic: "bolt" }
    ],
    c: [
      { id: "inicio", nome: "Início", ic: "home", badge: () => doCliente().length + vidsPend().length },
      { id: "andamento", nome: "Andamento", ic: "chart" },
      { id: "validacoes", nome: "Validações", ic: "video", badge: () => vidsPend().length },
      { id: "reunioes", nome: "Reuniões", ic: "meet" },
      { id: "equipe", nome: "Minha equipe", ic: "users" }
    ]
  };
  let ROLE = "i", PAGE = "carteira";
  function parseHash() {
    const m = location.hash.match(/^#\/(i|c)\/([a-z]+)/);
    if (m && ROUTES[m[1]].some((r) => r.id === m[2])) { ROLE = m[1]; PAGE = m[2]; return; }
    let r = "i";
    try { r = localStorage.getItem("timao-role") || "i"; } catch (e) {}
    ROLE = r === "c" ? "c" : "i";
    PAGE = ROUTES[ROLE][0].id;
  }
  const go = (role, page) => { location.hash = `#/${role}/${page}`; };

  // ---------- casca ----------
  function renderShell() {
    const rail = ["chat", "docok", "users", "money", "form", "clipboard", "building", "chart"];
    $("#railIcons").innerHTML = rail.map((k) => `<span class="rail-btn ${k === "form" ? "on" : ""}">${I[k]}</span>`).join("");
    $("#railBell").innerHTML = I.bell;
    document.querySelectorAll(".role button").forEach((b) => b.setAttribute("aria-selected", b.dataset.role === ROLE));
    $("#avatar").textContent = ROLE === "i" ? "MD" : "AR";
    const c = S.cliente;
    $("#who").innerHTML = ROLE === "i"
      ? `<span class="who-k">Implantadora</span><b>${esc(c.implantador)}</b>`
      : `<span class="who-k">${esc(c.nome)}</span><b>${esc(c.champion)}</b>`;
    const items = ROUTES[ROLE];
    const link = (r) => {
      const n = r.badge ? r.badge() : 0;
      return `<a class="nav2-item ${r.id === PAGE ? "on" : ""}" href="#/${ROLE}/${r.id}"><span class="ni">${I[r.ic]}</span>${r.nome}${n ? `<span class="badge">${n}</span>` : ""}</a>`;
    };
    if (ROLE === "i") {
      $("#nav").innerHTML = link(items[0]) + `<div class="nav2-label">${esc(c.nome.replace("Prefeitura de ", ""))} · ${c.uf}</div>` + items.slice(1).map(link).join("");
      $("#nav2Extra").innerHTML = `<div class="nav2-label">Instruções do agente</div><a class="nav2-item small" href="${REPO}" target="_blank" rel="noopener"><span class="ni">${I.bolt}</span>Abrir pasta INSTRUCTIONS</a>`;
    } else {
      $("#nav").innerHTML = items.map(link).join("");
      $("#nav2Extra").innerHTML = `<div class="help-card"><b>Precisa de ajuda?</b><span>Fale com a Aprova pelo WhatsApp ou pelo ai.aprova no Início.</span></div>`;
    }
    $("#navM").innerHTML = items.map((r) => { const n = r.badge ? r.badge() : 0; return `<a class="${r.id === PAGE ? "on" : ""}" href="#/${ROLE}/${r.id}">${r.nome}${n ? ` <span class="badge">${n}</span>` : ""}</a>`; }).join("");
    const cur = items.find((r) => r.id === PAGE);
    $("#crumb").innerHTML = ROLE === "i"
      ? (PAGE === "carteira" ? `<b>Minha carteira</b>` : `<a href="#/i/carteira">Carteira</a><span class="sep">/</span><span>${esc(c.nome.replace("Prefeitura de ", ""))}</span><span class="sep">/</span><b>${cur.nome}</b>`)
      : `<span>${esc(c.nome)}</span><span class="sep">/</span><b>${cur.nome}</b>`;
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
    $("#syncTxt").textContent = s < 5 ? "Pylon sincronizado agora" : `Pylon há ${s < 60 ? s + "s" : Math.round(s / 60) + " min"}`;
  }

  // ---------- peças reaproveitadas ----------
  const ENTRADA = ["carteira", "visao", "inicio"];
  const hero = (eyebrow, h1, sub, meta) => !ENTRADA.includes(PAGE)
    ? `<section class="phead"><h1>${h1}<span>${sub}</span></h1>${meta ? `<p>${meta}</p>` : ""}</section>`
    : `<section class="hero"><p class="eyebrow"><span class="dot-c"></span>${eyebrow}</p><h1>${h1}<span>${sub}</span></h1>${meta ? `<p class="hero-meta">${meta}</p>` : ""}</section>`;
  const secTitle = (t, hint = "", extra = "") => `<div class="sec-title"><h2>${t}</h2>${hint ? `<span class="hint">${hint}</span>` : ""}${extra}</div>`;
  // Com `act`, o card vira botão e abre o detalhe do indicador (data-kpi).
  const kpi = (k, v, s, cls = "", bar, act) => {
    const body = `<span class="k">${k}</span><span class="v">${v}</span>${bar !== undefined ? `<div class="bar"><i style="width:${bar}%"></i></div>` : `<span class="s">${s}</span>`}`;
    return act
      ? `<button type="button" class="kpi click ${cls}" data-kpi="${act}" title="Ver detalhes"><span class="go">${I.right}</span>${body}</button>`
      : `<div class="kpi ${cls}">${body}</div>`;
  };

  function fasesHTML() {
    const ST = { ativa: "Em andamento", futura: "Próxima", concluida: "Concluída" };
    return S.fases.map((f) => {
      const feitas = f.tasks.filter((t) => t.feito).length;
      const tasks = [...f.tasks].sort((a, b) => (isLate(b) - isLate(a)) || (a.feito - b.feito) || (d(a.data) - d(b.data)));
      return `<section class="fase ${f.status}">
        <div class="fase-h"><h3>${esc(f.nome)}</h3><span class="fase-st">${ST[f.status]}</span><span class="count">${feitas}/${f.tasks.length}</span><span class="desc">${esc(f.descricao)}</span></div>
        <ul class="tasks">${tasks.map((t) => {
          const late = isLate(t);
          const pode = f.status === "ativa" && (ROLE === "i" ? t.dono !== "prefeitura" : t.dono === "prefeitura");
          const nota = late ? (ROLE === "i" ? "atrasada · agente já cobrou no WhatsApp" : "atrasada") : "";
          return `<li class="task ${t.feito ? "done" : ""} ${late ? "late" : ""}">
            <button class="cb" ${pode ? `data-task="${t.id}"` : "disabled"} aria-label="${t.feito ? "Feito" : "Marcar como feito"}">${t.feito ? I.check : ""}</button>
            <div class="t"><span class="tt">${esc(t.titulo)}</span>
              <span class="meta"><span class="tag ${ROLE === "c" && t.dono === "agente" ? "aprova" : t.dono}">${DONO[ROLE][t.dono]}</span>${ROLE === "i" && t.ticket ? `<span class="tag ticket">${esc(t.ticket)}</span>` : ""}${nota ? `<span class="late-tag">${nota}</span>` : ""}</span>
            </div>
            <span class="when">${dia(t.data)}<b>${hora(t.data)}</b></span>
            ${ROLE === "i" && t.dono === "agente" && !t.feito ? `<button class="run" data-run="${t.id}" title="Executar com o agente" aria-label="Executar com o agente">${I.right}</button>` : "<span></span>"}
          </li>`;
        }).join("")}</ul>
      </section>`;
    }).join("");
  }

  function reuniaoHTML(r, full = true) {
    const ico = { feito: I.check, atrasado: I.clock, andamento: I.bolt };
    const acoes = r.status === "agendada"
      ? (ROLE === "c"
        ? `<div class="row-btns">${r.presenca ? `<span class="ok-note">${I.check}Presença confirmada</span>` : `<button class="btn sm" data-presenca="${r.id}">Confirmar presença</button>`}<button class="btn sm ghost" data-remarcar="${r.id}">Remarcar</button></div>`
        : `<div class="row-btns"><span class="hint">${r.presenca ? "Prefeitura confirmou presença" : esc(r.confirmacao || "")}</span></div>`)
      : "";
    const titAc = ROLE === "c" ? "O que ficou combinado" : "Acionáveis";
    return `<div class="reu">
      <div class="k">${esc(r.secretaria)}<span class="st ${r.status}">${r.status === "realizada" ? "Realizada" : "Agendada"}</span></div>
      <h3>${esc(r.titulo)}</h3>
      <div class="d">${diaSem(r.data)} · ${hora(r.data)}${r.duracao ? ` · ${r.duracao} min` : ""}</div>
      ${full && r.acionaveis ? `<div class="pauta-l">${titAc}</div><ul>${r.acionaveis.map((a) => `<li><span class="ic s-${a.status}">${ico[a.status] || I.dot}</span><span>${esc(a.texto)} <span class="tag ${ROLE === "c" && a.dono === "agente" ? "aprova" : a.dono}">${DONO[ROLE][a.dono]}</span>${ROLE === "i" && a.fup ? `<span class="sub">${esc(a.fup)}</span>` : ""}</span></li>`).join("")}</ul>` : ""}
      ${full && r.pauta ? `<div class="pauta-l">${ROLE === "i" ? "Pauta montada pelo agente" : "Pauta"}</div><ul>${r.pauta.map((p) => `<li><span class="ic s-pauta">${I.dot}</span><span>${esc(p)}</span></li>`).join("")}</ul>` : ""}
      ${acoes}
    </div>`;
  }

  function feedHTML(n = 30) {
    const html = S.atividade.slice(0, n).map((a) => {
      const g = GATILHO[a.gatilho] || GATILHO.painel;
      return `<li class="${a.novo ? "new" : ""}"><span class="g">${g.ic}</span><span><span class="trg">${g.nome}</span> · ${esc(a.texto)}<span class="when">${rel(a.hora)} · <a href="${REPO}${g.instr}.md" target="_blank" rel="noopener">${g.instr}</a></span></span></li>`;
    }).join("");
    S.atividade.forEach((a) => delete a.novo);
    return `<ol class="feed">${html}</ol>`;
  }

  function usuariosHTML() {
    const L = { cadastrado: ROLE === "i" ? "Cadastrado pelo agente" : "Com acesso", preenchido: "Dados preenchidos", "link-enviado": "Link enviado" };
    return `<div class="card flush"><div class="tbl-wrap"><table><thead><tr><th>Nome</th><th>Cargo</th><th>Secretaria</th><th>Status</th></tr></thead><tbody>${S.usuarios.map((u) => `<tr><td><b>${esc(u.nome)}</b></td><td>${esc(u.cargo)}</td><td>${esc(u.secretaria)}</td><td><span class="ust ${u.status}">${L[u.status]}</span></td></tr>`).join("")}</tbody></table></div></div>`;
  }

  // ---------- vídeo de validação ----------
  // Roteiro igual aos vídeos da Aprova: abertura, a tela com uma legenda por alteração e o fechamento.
  const STEP_MS = 2800;
  const steps = (v) => v.alteracoes.length + 2;
  function vidHTML(v) {
    const base = ["Nome do requerente", "CPF / CNPJ", "Endereço do imóvel"];
    const slug = v.processo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    const campos = base.map((l) => `<div class="ui-f"><label>${esc(l)}</label><div class="in"></div></div>`).join("") +
      v.alteracoes.map((l, i) => `<div class="ui-f novo" data-fi="${i}"><label>${esc(l)}</label><div class="in"></div></div>`).join("");
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
    vid.style.setProperty("--dur", STEP_MS + "ms");
    vid.querySelectorAll(".prog i").forEach((p, i) => { p.className = i < step ? "done" : ""; });
    const cur = vid.querySelectorAll(".prog i")[step];
    if (cur) { void cur.offsetWidth; cur.className = "cur"; }
    if (scene !== "screen") return;
    const k = step - 1;
    vid.querySelectorAll(".ui-f").forEach((f) => f.classList.toggle("hl", f.dataset.fi === String(k)));
    $(".cap", vid).textContent = v.alteracoes[k];
    const f = vid.querySelector(`.ui-f[data-fi="${k}"] .in`);
    const box = vid.getBoundingClientRect();
    const r = f.getBoundingClientRect();
    const c = $(".cursor", vid);
    c.style.left = ((r.left - box.left + r.width * 0.6) / box.width) * 100 + "%";
    c.style.top = ((r.top - box.top + r.height * 0.5) / box.height) * 100 + "%";
  }

  let filtro = "todos";
  function validacoesHTML() {
    const cont = { todos: S.validacoes.length };
    S.validacoes.forEach((v) => (cont[v.status] = (cont[v.status] || 0) + 1));
    const tabs = [["todos", "Todos"], ["pendente", VST[ROLE].pendente], ["reprovado", "Ajuste pedido"], ["ajuste", "Em ajuste"], ["aprovado", "Aprovados"]].filter(([k]) => k === "todos" || cont[k]);
    if (!tabs.some(([k]) => k === filtro)) filtro = "todos";
    const lista = S.validacoes.filter((v) => filtro === "todos" || v.status === filtro);
    return `<div class="center"><div class="filters" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-filtro="${k}" aria-selected="${k === filtro}">${l} · ${cont[k]}</button>`).join("")}</div></div>
      <div class="vgrid">${lista.map((v) => `
        <div class="vcard">
          <button class="vthumb" data-open="${v.id}" aria-label="Assistir ${esc(v.processo)}">${vidHTML(v)}<span class="dur">0:${String(Math.round((steps(v) * STEP_MS) / 1000)).padStart(2, "0")}</span><span class="play"><span>${I.play}</span></span></button>
          <div class="vlabel"><span class="st-ic ${v.status}">${v.status === "aprovado" ? I.check : v.status === "reprovado" ? I.x : v.status === "ajuste" ? I.bolt : I.clock}</span>${esc(v.processo)}</div>
          <div class="vsub">${esc(VST[ROLE][v.status])} · ${esc(v.secretaria)}${ROLE === "i" ? ` · ${esc(v.ticket)}` : ""}</div>
          ${ROLE === "i" && (v.status === "reprovado" || v.status === "ajuste") ? `<div class="vact"><span class="quote">“${esc(v.comentario || "")}”</span><button class="btn sm" data-revisar="${v.id}">${I.bolt}Verificar alteração e criar vídeo</button></div>` : ""}
          ${ROLE === "c" && v.status === "pendente" ? `<div class="vact"><button class="btn sm" data-open="${v.id}">Assistir e validar</button></div>` : ""}
        </div>`).join("")}</div>`;
  }

  // ---------- telas do implantador ----------
  const VIEWS = {};
  VIEWS["i/carteira"] = () => {
    const c = S.cliente;
    const vv = { nome: c.nome.replace("Prefeitura de ", ""), uf: c.uf, fase: `${ativa() ? ativa().nome : ""} · Obras`, pct: entrega(), atrasadas: semResposta().length, videos: vidsPend().length, ajustes: ajustes().length, proxima: proxReunioes()[0] && proxReunioes()[0].data, saude: saudeVV(), aberta: true };
    const todas = [vv, ...S.carteira];
    const atencao = todas.filter((p) => p.saude !== "ok").length;
    const sum = (k) => todas.reduce((a, p) => a + p[k], 0);
    return hero("Minha carteira", `${saudacao()}, ${esc(c.implantador.split(" ")[0])}.`, `${todas.length} implantações, ${atencao} pedem atenção.`, "Prefeituras inteiras ao mesmo tempo: o agente cuida das cobranças, das pautas e dos vídeos.") +
      `<section class="kpis">
        ${kpi("Implantações", todas.length, "prefeitura toda")}
        ${kpi("Ajustes pra você", sum("ajustes"), "pedidos pelas prefeituras", sum("ajustes") ? "alert" : "good")}
        ${kpi("Vídeos com as prefeituras", sum("videos"), "aguardando validação")}
        ${kpi("Reunião evitada", "74h", "nas 4 implantações", "good")}
      </section>` +
      `<div class="block-sm">${secTitle("Implantações", "ordenadas por quem precisa de você")}<div class="pgrid">${todas.sort((a, b) => ({ risco: 0, atencao: 1, ok: 2 }[a.saude] - { risco: 0, atencao: 1, ok: 2 }[b.saude])).map((p) => `
        <div class="pcard">
          <div class="pc-h"><b>${esc(p.nome)} · ${p.uf}</b><span class="saude ${p.saude}">${SAUDE[p.saude]}</span></div>
          <div class="pc-f">${esc(p.fase)}</div>
          <div class="pc-bar"><div class="bar"><i style="width:${p.pct}%"></i></div><span>${p.pct}%</span></div>
          <div class="pc-chips">
            <span class="${p.ajustes ? "hot" : ""}">${p.ajustes} ajuste${p.ajustes === 1 ? "" : "s"} pra você</span>
            <span class="${p.atrasadas ? "warn" : ""}">${p.atrasadas} atrasada${p.atrasadas === 1 ? "" : "s"} na prefeitura</span>
            <span>${p.videos} vídeo${p.videos === 1 ? "" : "s"} em validação</span>
          </div>
          <div class="pc-foot"><span class="hint">${p.proxima ? `Próxima reunião ${dia(p.proxima)} · ${hora(p.proxima)}` : "Sem reunião marcada"}</span>${p.aberta ? `<a class="btn sm" href="#/i/visao">Abrir</a>` : `<button class="btn sm ghost" data-outra="1">Abrir</button>`}</div>
        </div>`).join("")}</div></div>`;
  };

  // Indicadores da implantação: os mesmos nas duas visões, só muda quem é "a prefeitura"
  function kpisHTML(lado) {
    const c = S.cliente;
    const pct = entrega();
    const pend = doCliente().length + vidsPend().length;
    return `<section class="kpis">
        ${kpi("Entrega", pct + "%", "", "", pct, "entrega")}
        ${kpi(lado === "c" ? "Com você" : "Com a prefeitura", pend, "tarefas e vídeos", pend ? "alert" : "good", undefined, "pend")}
        ${kpi("Reunião evitada", c.horasReuniaoEvitadas + "h", "validação por vídeo", "good", undefined, "reuniao")}
        ${kpi("Go-live", daysUntil(c.meta + "T09:00") + " dias", "meta " + dia(c.meta + "T09:00"), "", undefined, "golive")}
      </section>`;
  }

  // ---------- detalhe dos indicadores (lateral direita) ----------
  const saudeVV = () => window.DATA.cliente.saude || (semResposta().length ? "atencao" : "ok");
  const fimFase = (f) => f.tasks.map((t) => t.data).sort().pop();
  const tagDono = (t) => `<span class="tag ${ROLE === "c" && t.dono === "agente" ? "aprova" : t.dono}">${DONO[ROLE][t.dono]}</span>`;

  // Os 2 meses da implantação: uma barra por fase com o "hoje" e, embaixo, cada entrega com o prazo.
  function linhaTempoHTML() {
    const c = S.cliente;
    const ini = d(c.inicio + "T00:00"), fim = d(c.meta + "T23:59");
    const pos = (x) => Math.min(100, Math.max(0, ((x - ini) / (fim - ini)) * 100));
    const todas = allTasks(), feitas = todas.filter((t) => t.feito).length, late = todas.filter(isLate).length;
    let de = ini;
    const segs = S.fases.map((f) => {
      const ate = d(fimFase(f));
      const s = `<span class="gantt-seg ${f.status}" style="left:${pos(de)}%;width:${pos(ate) - pos(de)}%" title="${esc(f.nome)} · até ${dia(fimFase(f))}">${esc(f.nome)}</span>`;
      de = ate;
      return s;
    }).join("");
    let hoje = false;
    const fases = S.fases.map((f) => {
      const lis = [...f.tasks].sort((a, b) => d(a.data) - d(b.data)).map((t) => {
        let pre = "";
        if (!hoje && d(t.data) > now()) { hoje = true; pre = `<li class="today"><span>Hoje · ${dia(isoNow())}</span></li>`; }
        const late = isLate(t);
        return pre + `<li class="${t.feito ? "done" : late ? "late" : ""}"><span class="dt">${t.feito ? I.check : late ? I.clock : ""}</span><span class="tx"><b>${esc(t.titulo)}</b>${tagDono(t)}</span><span class="wd">${late ? "atrasada · " : ""}${dia(t.data)}</span></li>`;
      }).join("");
      return `<section class="tl-fase"><div class="tl-fh"><b>${esc(f.nome)}</b><span>${esc(f.descricao)}</span></div>
        <div class="tl-fm">entrega até ${dia(fimFase(f))} · ${f.tasks.filter((t) => t.feito).length} de ${f.tasks.length} feitas</div><ol class="tl">${lis}</ol></section>`;
    }).join("");
    return `<h3>Linha do tempo</h3>
      <p class="dr-instr">${dia(c.inicio + "T09:00")} a ${dia(c.meta + "T09:00")} · 2 meses de implantação</p>
      <div class="tl-sum"><span class="ok">${feitas} feitas</span><span>${todas.length - feitas} a fazer</span>${late ? `<span class="late">${late} atrasada${late > 1 ? "s" : ""}</span>` : ""}</div>
      <div class="gantt"><div class="gantt-track">${segs}<span class="gantt-now" style="left:${pos(now())}%"><span>Hoje</span></span></div>
        <div class="gantt-axis"><span>${dia(c.inicio + "T09:00")} · início</span><span>${dia(c.meta + "T09:00")} · go-live</span></div></div>
      ${fases}`;
  }

  function evitadaHTML() {
    const h = S.cliente.horasReuniaoEvitadas;
    return `<h3>De onde vêm as horas</h3>
      <p class="dr-instr">Horas de reunião que viraram vídeo, WhatsApp ou link.</p>
      <div class="dr-big">${h}h<small>≈ ${Math.round(h / 1.5)} reuniões de 1h30</small></div>
      <ul class="dr-list">${(window.DATA.evitadas || []).map((x) => `<li><span>${esc(x.t)}<small>${esc(x.d)}</small></span><b>${x.h}h</b></li>`).join("")}</ul>
      <div class="dr-out"><a class="btn sm ghost" href="#/${ROLE}/validacoes" data-drclose="1">${I.video}Ver os vídeos de validação</a></div>`;
  }

  function goliveHTML() {
    const c = S.cliente, sd = saudeVV();
    const falta = allTasks().filter((t) => !t.feito);
    const daEquipe = falta.filter((t) => t.dono === "prefeitura").length + vidsPend().length;
    const agora = doCliente().length + vidsPend().length;
    const atras = falta.filter(isLate);
    const motivo = sd === "ok"
      ? "No ritmo atual, o go-live sai na data."
      : `${atras.length ? `${atras.length} entrega${atras.length > 1 ? "s atrasadas seguram" : " atrasada segura"} o go-live.` : "O ritmo está abaixo do previsto."} Para manter ${dia(c.meta + "T09:00")}, ${ROLE === "c" ? "resolva o que está atrasado." : "cobre o que está atrasado."}`;
    return `<h3>O caminho até o go-live</h3>
      <p class="dr-instr">Meta: ${diaSem(c.meta + "T09:00")}</p>
      <div class="dr-big">${daysUntil(c.meta + "T09:00")}<small>dias para o go-live</small></div>
      <div class="dr-alert ${sd}"><span class="saude ${sd}">${SAUDE[sd]}</span><p>${motivo}</p></div>
      <div class="dr-sec">Marcos até lá</div>
      <ul class="dr-list">${S.fases.map((f) => `<li><span>${esc(f.nome)} · ${esc(f.descricao)}<small>${f.tasks.filter((t) => t.feito).length} de ${f.tasks.length} feitas</small></span><b>${dia(fimFase(f))}</b></li>`).join("")}</ul>
      <div class="dr-sec">O que falta</div>
      <ul class="dr-list">
        <li><span>${DONO[ROLE].prefeitura}<small>${agora} agora${daEquipe > agora ? `, ${daEquipe - agora} nas próximas fases` : ""} · tarefas e vídeos</small></span><b>${daEquipe}</b></li>
        <li><span>${ROLE === "c" ? "Aprova" : "Aprova e agente"}<small>configuração, ajustes e treinamento</small></span><b>${falta.length - falta.filter((t) => t.dono === "prefeitura").length}</b></li>
      </ul>
      ${atras.length ? `<div class="dr-sec">Atrasado</div><ul class="dr-list">${atras.map((t) => `<li class="late"><span>${esc(t.titulo)}<small>${DONO[ROLE][t.dono]}</small></span><b>${dia(t.data)}</b></li>`).join("")}</ul>` : ""}`;
  }

  function openInfo(kind) {
    if (AUTO) { toast("Espere o Automode terminar."); return; }
    const H = {
      entrega: [`Entrega · ${entrega()}%`, linhaTempoHTML],
      reuniao: ["Reunião evitada", evitadaHTML],
      golive: ["Go-live", goliveHTML]
    }[kind];
    const dr = $("#drawer");
    clearTimeout(runT);
    dr.innerHTML = `<div class="dr-h"><span class="dr-k">${I.chart}${H[0]}</span><button class="dr-x" data-drclose="1" aria-label="Fechar">${I.x}</button></div>` + H[1]();
    dr.hidden = false;
    dr.scrollTop = 0;
    requestAnimationFrame(() => dr.classList.add("on"));
  }

  VIEWS["i/visao"] = () => {
    const c = S.cliente;
    const fila = filaItems().slice(0, 4);
    const prox = proxReunioes();
    return hero(`${ativa() ? ativa().nome + " em andamento" : "Implantação"}`, `${esc(c.nome)}.`, "Implantação da prefeitura toda.", `${c.secretarias} secretarias · ${c.processos} processos · champion ${esc(c.champion)} · Pylon ${esc(c.pylon)}`) +
      kpisHTML("i") +
      `<section class="ask"><h2 class="ask-h">O que o agente faz por você agora?</h2><div data-ai="i"></div></section>
      <div class="grid">
        <div class="col-main">
          ${secTitle("Sua fila", `${filaItems().length} itens`, `<a class="more" href="#/i/fila">Ver tudo ${I.right}</a>`)}
          <div class="queue">${fila.map(filaItemHTML).join("") || `<p class="empty">Nada na sua fila 🎉</p>`}</div>
          <div class="block-sm">${secTitle("Próximas reuniões", "", `<a class="more" href="#/i/reunioes">Ver todas ${I.right}</a>`)}<div class="reu-grid">${prox.slice(0, 2).map((r) => reuniaoHTML(r, false)).join("")}</div></div>
        </div>
        <aside class="col-side"><section class="card"><div class="card-h"><h3>Agente em ação</h3><span class="live"><span class="dot"></span>ao vivo</span></div>${feedHTML(6)}<a class="more" href="#/i/agente">Ver o que o agente fez ${I.right}</a></section></aside>
      </div>`;
  };

  function filaItems() {
    return [
      ...ajustes().map((v) => ({ tipo: "ajuste", v })),
      ...semResposta().map((t) => ({ tipo: "cobrar", t })),
      ...minhas().map((t) => ({ tipo: "tarefa", t }))
    ];
  }
  function filaItemHTML(it) {
    if (it.tipo === "ajuste") {
      const v = it.v;
      return `<div class="qitem"><span class="qi red">${I.x}</span><div class="qt"><b>${esc(v.processo)}: ${v.status === "ajuste" ? "agente ajustando" : "ajuste pedido"}</b><span>“${esc(v.comentario || "")}” · ${esc(v.ticket)}</span></div><div class="qa"><button class="btn sm ghost" data-open="${v.id}">Ver vídeo</button><button class="btn sm" data-revisar="${v.id}">${I.bolt}Verificar alteração e criar vídeo</button></div></div>`;
    }
    const t = it.t;
    if (it.tipo === "cobrar") {
      const fup = t.fupEm ? `FUP enviado ${rel(t.fupEm)}` : "agente cobrou no WhatsApp";
      return `<div class="qitem"><span class="qi amber">${I.clock}</span><div class="qt"><b>Prefeitura atrasada: ${esc(t.titulo)}</b><span>prazo ${dia(t.data)} · ${fup}</span></div><div class="qa"><button class="btn sm ghost" data-cobrar="${t.id}">Cobrar de novo</button></div></div>`;
    }
    return `<div class="qitem"><span class="qi">${t.dono === "agente" ? I.bolt : I.clipboard}</span><div class="qt"><b>${esc(t.titulo)}</b><span>${DONO.i[t.dono]} · ${dia(t.data)} ${hora(t.data)}${t.ticket ? " · " + esc(t.ticket) : ""}</span></div><div class="qa">${t.dono === "agente" ? `<button class="btn sm" data-run="${t.id}">Executar ${I.right}</button>` : `<button class="btn sm ghost" data-task="${t.id}">Concluir</button>`}</div></div>`;
  }

  VIEWS["i/fila"] = () => {
    const a = ajustes(), s = semResposta(), m = minhas();
    const grp = (t, hint, list) => `<div class="block-sm">${secTitle(t, hint)}<div class="queue">${list.map(filaItemHTML).join("") || `<p class="empty">Nada aqui.</p>`}</div></div>`;
    return hero("Minha fila", "O que é seu.", "O resto o agente resolve.", "Ajustes pedidos pela prefeitura, cobranças que precisam de você e tarefas da Aprova.") +
      grp("Ajustes pedidos pela prefeitura", "viram vídeo novo para validar", a.map((v) => ({ tipo: "ajuste", v }))) +
      grp("Prefeitura atrasada", "o agente já mandou FUP; depois de 2 sem resposta, é com você", s.map((t) => ({ tipo: "cobrar", t }))) +
      `<div class="block-sm">${secTitle("Tarefas da Aprova e do agente", "", autoBtn())}<div class="queue">${m.map((t) => filaItemHTML({ tipo: "tarefa", t })).join("") || `<p class="empty">Nada aqui.</p>`}</div></div>`;
  };

  VIEWS["i/fases"] = () => hero("Fases e tarefas", "Fases da implantação.", "Tudo que está previsto.", "Você conclui o que é da Aprova. O que é da prefeitura, ela marca no painel dela.") + `<div class="sec-title"><span class="hint">Clique na seta → de uma tarefa do agente pra ele executar, ou ligue o Automode.</span>${autoBtn()}</div>` + fasesHTML();

  VIEWS["i/reunioes"] = () => {
    const ag = proxReunioes(), re = S.reunioes.filter((r) => r.status === "realizada").sort((a, b) => d(b.data) - d(a.data));
    return hero("Reuniões", "Menos reuniões.", "As que sobram rendem mais.", `O agente monta a pauta, confirma na véspera e transforma o que foi falado em acionáveis.`) +
      `<div class="block-sm">${secTitle("Agendadas", "", `<button class="btn sm" data-novareuniao="1">${I.plus}Nova reunião com pauta do agente</button>`)}<div class="reu-grid">${ag.map((r) => reuniaoHTML(r)).join("") || `<p class="empty">Nenhuma reunião marcada.</p>`}</div></div>
       <div class="block-sm">${secTitle("Realizadas", "acionáveis já criados pelo agente")}<div class="reu-grid">${re.map((r) => reuniaoHTML(r)).join("")}</div></div>`;
  };

  VIEWS["i/validacoes"] = () => `<section class="big-h"><p class="eyebrow"><span class="dot-c"></span>Validações</p><h2>Cada ajuste vira um vídeo.<span>A prefeitura aprova sem reunião.</span></h2><p class="lead">Quando pedem mudança, ela cai aqui com o comentário. Gere o vídeo novo e ele volta pra prefeitura.</p></section>` + validacoesHTML();

  VIEWS["i/usuarios"] = () => hero("Usuários", "Usuários da prefeitura.", "Cadastrados pelo agente.", "O agente manda o link, a pessoa preenche e ele cadastra no prefeitura.aprova.") +
    `<div class="sec-title"><span></span><button class="btn sm" data-convidar="1">Reenviar links pendentes</button></div>` + usuariosHTML();

  VIEWS["i/agente"] = () => {
    const cont = {};
    S.atividade.forEach((a) => { const g = (GATILHO[a.gatilho] || GATILHO.painel).instr; cont[g] = (cont[g] || 0) + 1; });
    return hero("Agente", "O que o agente fez.", "E qual instrução ele seguiu.", "Cada ação mostra o gatilho e a instrução da pasta INSTRUCTIONS.") +
      `<div class="grid"><div class="col-main"><section class="card">${feedHTML(50)}</section></div>
        <aside class="col-side"><section class="card"><div class="card-h"><h3>Instruções</h3><span class="hint">ações nesta implantação</span></div>
          <ul class="instr">${INSTR.map(([k, desc]) => `<li><a href="${REPO}${k}.md" target="_blank" rel="noopener"><b>${k}</b><span>${desc}</span></a><span class="n">${cont[k] || "–"}</span></li>`).join("")}</ul>
        </section></aside></div>`;
  };

  // ---------- telas da prefeitura ----------
  VIEWS["c/inicio"] = () => {
    const c = S.cliente;
    const tarefas = doCliente(), vids = vidsPend();
    const n = tarefas.length + vids.length;
    const prox = proxReunioes()[0];
    const todo = [
      ...vids.map((v) => `<div class="todo"><span class="qi cyan">${I.video}</span><div class="qt"><b>Validar o vídeo do ${esc(v.processo)}</b><span>${v.alteracoes.length} mudanças · ${Math.round((steps(v) * STEP_MS) / 1000)} segundos</span></div><button class="btn sm" data-open="${v.id}">Assistir</button></div>`),
      ...tarefas.map((t) => `<div class="todo ${isLate(t) ? "late" : ""}"><span class="qi ${isLate(t) ? "red" : "amber"}">${I.clipboard}</span><div class="qt"><b>${esc(t.titulo)}</b><span>${isLate(t) ? `Atrasada desde ${dia(t.data)}` : `Até ${dia(t.data)} às ${hora(t.data)}`}</span></div><div class="qa">${/enviar|devolver/i.test(t.titulo) ? `<label class="btn sm">${I.upload}Enviar<input type="file" hidden data-upload="${t.id}"></label>` : ""}<button class="btn sm ghost" data-task="${t.id}">Feito</button></div></div>`)
    ];
    return hero(c.nome, `Olá, ${esc(c.contato)}.`, n ? `${n} coisa${n > 1 ? "s" : ""} depende${n > 1 ? "m" : ""} de você.` : "Nada depende de você hoje.", "") +
      kpisHTML("c") +
      `<div class="grid"><div class="col-main">
          <div id="parafazer">${secTitle("Para fazer", "o resto a Aprova resolve")}
          <div class="queue">${todo.join("") || `<p class="empty">Tudo em dia 🎉</p>`}</div></div>
          <section class="ask left"><h2 class="ask-h">Por onde começamos?</h2><div data-ai="c"></div></section>
        </div>
        <aside class="col-side">
          ${prox ? `<section class="card"><div class="card-h"><h3>Próxima reunião</h3></div>${reuniaoHTML(prox)}</section>` : ""}
          <section class="card"><div class="card-h"><h3>Andamento</h3><a class="more" href="#/c/andamento">Ver ${I.right}</a></div>
            <div class="prog-big"><span class="v">${entrega()}%</span><span class="hint">da implantação entregue · go-live ${dia(c.meta + "T09:00")}</span></div>
            <div class="bar"><i style="width:${entrega()}%"></i></div>
            <ul class="mini-fases">${S.fases.map((f) => `<li class="${f.status}"><span></span>${esc(f.nome)} · ${esc(f.descricao)}</li>`).join("")}</ul>
          </section>
        </aside></div>`;
  };

  VIEWS["c/andamento"] = () => hero("Andamento", "Como está a implantação.", `${entrega()}% entregue.`, "Marque aqui o que a sua equipe já fez. O que é da Aprova, a gente atualiza.") + fasesHTML();

  VIEWS["c/validacoes"] = () => `<section class="big-h"><p class="eyebrow"><span class="dot-c"></span>Validações</p><h2>Assista, aprove, pronto.<span>Sem precisar de reunião.</span></h2><p class="lead">Cada vídeo mostra só o que mudou no formulário. Se algo estiver errado, fale com o ai.aprova ali mesmo.</p></section>` + validacoesHTML();

  VIEWS["c/reunioes"] = () => {
    const ag = proxReunioes(), re = S.reunioes.filter((r) => r.status === "realizada").sort((a, b) => d(b.data) - d(a.data));
    return hero("Reuniões", "Reuniões curtas.", "Com pauta e combinado por escrito.", "") +
      `<div class="block-sm">${secTitle("Próximas")}<div class="reu-grid">${ag.map((r) => reuniaoHTML(r)).join("") || `<p class="empty">Nenhuma reunião marcada.</p>`}</div></div>
       <div class="block-sm">${secTitle("Já aconteceram")}<div class="reu-grid">${re.map((r) => reuniaoHTML(r)).join("")}</div></div>`;
  };

  VIEWS["c/equipe"] = () => hero("Minha equipe", "Quem usa o sistema.", "Convide pelo WhatsApp.", "Mande o link, a pessoa preenche os dados e a Aprova libera o acesso.") +
    `<div class="sec-title"><span></span><button class="btn sm" data-convidar="1">${I.whatsapp}Convidar alguém</button></div>` + usuariosHTML();

  // ---------- render ----------
  function render() {
    renderShell();
    $("#view").innerHTML = VIEWS[`${ROLE}/${PAGE}`]();
    document.querySelectorAll("[data-ai]").forEach((el) => el.appendChild(aiBox(el.dataset.ai === "i" ? {
      placeholder: "Peça ao agente: resumo pro secretário, cobrar pendências, montar pauta…",
      sugs: [
        { ic: "form", t: "Resumo para o secretário", d: "Status da implantação em 3 linhas, pronto pro WhatsApp." },
        { ic: "whatsapp", t: "Cobrar pendências", d: "FUP de tudo que está atrasado na prefeitura." },
        { ic: "cal", t: "Montar pauta da próxima reunião", d: "Com o que falta decidir em cada processo." }
      ]
    } : {
      placeholder: "Escreva uma mensagem, grave um áudio ou anexe a lei…",
      sugs: [
        { ic: "video", t: "Validar processos", d: "Abre os vídeos que estão esperando a sua aprovação." },
        { ic: "form", t: "Alteração de Formulário", d: "Diga o que muda. Pode mandar PDF, foto ou áudio." },
        { ic: "users", t: "Cadastro de Usuários", d: "Envia o link de cadastro para a sua equipe no WhatsApp." }
      ]
    })));
  }
  function refresh() {
    // Re-renderiza a tela sem perder a rolagem.
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
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
      setTimeout(() => { t.remove(); say("bot", responder(text, ctx)); renderShell(); }, 800);
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
        save();
        say("bot", `Recebi <b>${esc(f.name)}</b>. Extraí as regras e anexei ao chamado ${tk}. Quando o formulário estiver ajustado, mando o vídeo de validação aqui e no WhatsApp.`);
      }, 1200);
      e.target.value = "";
    });
    const mic = $(".mic", box);
    mic.addEventListener("click", () => {
      if (mic.classList.contains("rec")) {
        mic.classList.remove("rec");
        input.placeholder = placeholder;
        send(ctx ? "O prazo de resposta tem que ser 30 dias, não 15" : ROLE === "i" ? "Resumo para o secretário" : "Quero mudar o formulário do Alvará");
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
      return `Anotado. Já estou ajustando o <b>${esc(v.processo)}</b> e te mando um vídeo novo em até 2h, aqui e no WhatsApp.`;
    }
    if (ROLE === "i") {
      if (t.includes("resumo")) {
        const c = S.cliente;
        return `Pronto pra mandar no WhatsApp:\n\n“${c.contato}, a implantação está ${entrega()}% entregue. ${S.validacoes.filter((v) => v.status === "aprovado").length} formulários já aprovados, ${vidsPend().length} vídeos esperando vocês e ${semResposta().length} pendência atrasada (${semResposta()[0] ? esc(semResposta()[0].titulo.toLowerCase()) : "nenhuma"}). Go-live em ${dia(c.meta + "T09:00")}.”`;
      }
      if (t.includes("cobr") || t.includes("penden")) {
        const s = semResposta();
        s.forEach((x) => { findTask(x.id).fupEm = isoNow(); log("prazo", `FUP no WhatsApp: "${x.titulo}" está atrasada desde ${dia(x.data)}`); });
        save();
        return s.length ? `Mandei FUP de <b>${s.length}</b> pendência${s.length > 1 ? "s" : ""} no privado de quem é responsável. Se não responderem em 48h, te aviso.` : "Nada atrasado na prefeitura agora.";
      }
      if (t.includes("pauta")) {
        const r = proxReunioes()[0];
        return r ? `Pauta da <b>${esc(r.titulo)}</b> (${dia(r.data)}):\n• ${(r.pauta || []).map(esc).join("\n• ")}\n\nAcrescentei: decidir o prazo do Alvará, que segue sem a lei.` : "Não há reunião marcada. Quer que eu agende?";
      }
    }
    if (t.includes("valid")) {
      const pend = vidsPend();
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
    save();
    return `Abri o chamado ${tk} com isso e já comecei. Te aviso aqui e no WhatsApp quando estiver pronto.`;
  }

  // ---------- player / reel ----------
  let playT = null, playId = null, playStep = 0;
  // Botões compactos, na parte de baixo, junto do campo do ai.aprova.
  function slideActs(v) {
    return ROLE === "c"
      ? `<button class="act ok" data-act="ok">${I.check}Aprovar</button>
         <button class="act no" data-act="no">${I.x}Ajustar</button>
         <button class="act cal" data-act="cal" title="Agendar conversa" aria-label="Agendar conversa">${I.cal}</button>`
      : `<button class="act cal wide" data-act="zap">${I.whatsapp}Reenviar no WhatsApp</button>
         ${v.status === "reprovado" || v.status === "ajuste" ? `<button class="act ok" data-revisar="${v.id}">${I.bolt}Verificar alteração</button>` : ""}`;
  }
  function slideHTML(v) {
    const acts = slideActs(v);
    const side = ROLE === "c"
      ? `<h4>O que precisa mudar?</h4><p class="sub">Fale com o ai.aprova sobre este vídeo</p>`
      : `<h4>Visão do implantador</h4><p class="sub">Só a prefeitura aprova. Aqui você vê o que ela disse e reenvia o link.</p>`;
    return `<section class="slide" data-id="${v.id}">
      <div class="stage">
        <div class="stage-h"><span class="pill">${esc(v.processo)}</span><span class="vstatus ${v.status}">${esc(VST[ROLE][v.status])}</span></div>
        <div class="who">${esc(v.secretaria)}${ROLE === "i" ? ` · ${esc(v.ticket)}` : ""} · vídeo gerado ${rel(v.gerado)}</div>
        <div class="vidwrap">${vidHTML(v)}</div>
      </div>
      <div class="side">
        ${side}
        ${v.comentario ? `<div class="comment ${v.status === "aprovado" ? "ok" : ""}">${esc(v.comentario)}</div>` : ""}
        ${ROLE === "c" ? `<div class="ai-slot"></div>` : `<ul class="alt-list">${v.alteracoes.map((a, i) => `<li><span>${i + 1}</span>${esc(a)}</li>`).join("")}</ul><div class="act-row">${acts}</div>`}
      </div>
    </section>`;
  }
  function openPlayer(id) {
    const reel = $("#reel");
    reel.innerHTML = S.validacoes.map(slideHTML).join("");
    reel.querySelectorAll(".ai-slot").forEach((slot) => {
      const sl = slot.closest(".slide");
      const v = S.validacoes.find((x) => x.id === sl.dataset.id);
      const box = aiBox({
        placeholder: "O que precisa mudar? Ex.: o prazo é 30 dias",
        ctx: sl.dataset.id,
        sugs: [
          { ic: "form", t: "Falta um campo", d: "diga qual" },
          { ic: "clock", t: "Mudar um prazo", d: "da análise ou da resposta" }
        ]
      });
      // A linha de botões fica logo acima do campo de conversa.
      const row = document.createElement("div");
      row.className = "act-row";
      row.innerHTML = slideActs(v);
      $("form", box).before(row);
      slot.replaceWith(box);
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
    refresh();
  }
  function decide(id, status) {
    const v = S.validacoes.find((x) => x.id === id);
    v.status = status;
    if (status === "aprovado") {
      v.comentario = `Aprovado pela prefeitura em ${dia(isoNow())}`;
      log("painel", `Prefeitura aprovou o vídeo do ${v.processo}. O agente fechou o ${v.ticket} e marcou o processo como pronto pro go-live`);
      toast(`${v.processo} aprovado.`);
    }
    save(); afterChange(id);
    if (status === "aprovado") setTimeout(() => nextSlide(id), 700);
  }
  function afterChange(id) {
    renderShell();
    const sl = $(`#reel [data-id="${id}"]`);
    if (!sl) return;
    const v = S.validacoes.find((x) => x.id === id);
    const st = $(".vstatus", sl);
    st.className = `vstatus ${v.status}`;
    st.textContent = VST[ROLE][v.status];
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
  function showSlots(sl, onPick) {
    const old = $(".slots", sl);
    if (old) { old.remove(); return; }
    const base = now();
    const opts = [1, 2, 3].map((k) => {
      const x = new Date(base); x.setDate(x.getDate() + k + (x.getDay() === 5 ? 2 : 0)); x.setHours([10, 14, 16][k - 1], 0, 0, 0);
      return x;
    });
    const box = document.createElement("div");
    box.className = "slots";
    box.innerHTML = `<h5>Escolha um horário</h5>${opts.map((o) => `<button data-iso="${o.toISOString()}">${o.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })} · ${o.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</button>`).join("")}`;
    sl.appendChild(box);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      e.stopPropagation();
      const w = new Date(b.dataset.iso);
      const p = (x) => String(x).padStart(2, "0");
      box.remove();
      onPick(`${w.getFullYear()}-${p(w.getMonth() + 1)}-${p(w.getDate())}T${p(w.getHours())}:00`);
    });
  }

  // ---------- execução do agente (lateral direita) ----------
  // Cada tarefa do agente vira um plano de passos ligado a uma instrução da pasta INSTRUCTIONS.
  function plano(t) {
    const tit = t.titulo.toLowerCase();
    if (tit.includes("formul")) return { instr: "04-videos-validacao", passos: [
      `Lendo o chamado ${t.ticket || ""} e os comentários da prefeitura`,
      "Aplicando as regras no formulário clonado da cidade modelo",
      "Testando o formulário em homologação",
      "Gravando o vídeo de validação, só com o que mudou",
      "Enviando o link do vídeo no WhatsApp da prefeitura"
    ], fim: "Formulário ajustado. O vídeo foi pro Painel das Validações e a prefeitura foi avisada no WhatsApp." };
    if (tit.includes("coletar") || tit.includes("regras")) return { instr: "05-champions", passos: [
      "Buscando o champion da secretaria no Pylon",
      "Mandando as 4 perguntas de apresentação no WhatsApp",
      "Lendo leis, formulários e planilhas que já chegaram",
      "Preenchendo os tickets de cada processo com as regras",
      "Criando as perguntas que faltam como tarefa da prefeitura"
    ], fim: "Regras coletadas e tickets preenchidos. O que ficou em aberto virou pergunta no WhatsApp do champion." };
    if (tit.includes("pauta")) return { instr: "05-champions", passos: [
      "Lendo as respostas do champion e os processos prioritários",
      "Listando o que falta decidir em cada processo",
      "Montando a pauta em 4 tópicos",
      "Anexando a pauta ao convite da reunião"
    ], fim: "Pauta pronta e anexada ao convite. A prefeitura vê a pauta na tela de Reuniões." };
    if (tit.includes("confirmar")) return { instr: "05-champions", passos: [
      "Conferindo a agenda da implantadora",
      "Mandando a confirmação no WhatsApp da champion",
      "Registrando a resposta no Pylon"
    ], fim: "Reunião confirmada no WhatsApp. Se alguém desmarcar, o agente oferece 2 novos horários." };
    if (tit.includes("preencher") || tit.includes("ticket")) return { instr: "02-acionaveis-reuniao", passos: [
      "Lendo a transcrição da última reunião",
      "Separando as regras citadas para o processo",
      `Preenchendo o ${t.ticket || "ticket"} com as regras e o trecho da fala`,
      "Criando pergunta pra prefeitura onde a regra ficou ambígua"
    ], fim: "Ticket preenchido com as regras da reunião. Uma dúvida virou tarefa da prefeitura." };
    if (tit.includes("champion")) return { instr: "05-champions", passos: [
      "Lendo o organograma e os contatos do contrato",
      "Mandando a apresentação no WhatsApp de cada secretaria",
      "Registrando quem é quem no Pylon",
      "Agendando a primeira reunião com quem respondeu"
    ], fim: "Champions identificados e primeiras reuniões agendadas." };
    if (tit.includes("cadastr") || tit.includes("usuár")) return { instr: "06-cadastro-usuarios", passos: [
      "Lendo a lista de pessoas", "Enviando o link de cadastro no WhatsApp", "Conferindo os dados preenchidos", "Cadastrando no prefeitura.aprova"
    ], fim: "Usuários cadastrados. Quem não preencheu recebe lembrete em 2 dias úteis." };
    return { instr: "01-gatilhos", passos: ["Lendo o contexto da tarefa no Pylon", "Executando a tarefa", "Registrando o resultado no Pylon"], fim: "Tarefa executada e registrada no Pylon." };
  }
  let runT = null;
  function runAgent(id, done, prog) {
    const t = findTask(id);
    if (!t || t.feito) { if (done) done(); return; }
    const p = plano(t);
    const dr = $("#drawer");
    clearTimeout(runT);
    dr.innerHTML = `<div class="dr-h"><span class="dr-k"><span class="pulse"></span>${prog ? `Automode · ${prog.i} de ${prog.n}` : "Agente executando"}</span><button class="dr-x" data-drclose="1" aria-label="Fechar">${I.x}</button></div>
      <h3>${esc(t.titulo)}</h3>
      <p class="dr-instr">Seguindo <a href="${REPO}${p.instr}.md" target="_blank" rel="noopener">${p.instr}</a>${t.ticket ? ` · ${esc(t.ticket)}` : ""}</p>
      <ol class="steps">${p.passos.map((s) => `<li><span class="sp"></span><span>${esc(s)}</span></li>`).join("")}</ol>
      <div class="dr-out"></div>`;
    dr.hidden = false;
    requestAnimationFrame(() => dr.classList.add("on"));
    const lis = dr.querySelectorAll(".steps li");
    let i = 0;
    const step = () => {
      if (i > 0) { lis[i - 1].className = "done"; lis[i - 1].querySelector(".sp").innerHTML = I.check; }
      if (i < lis.length) { lis[i].className = "doing"; i++; runT = setTimeout(step, 1100); return; }
      t.feito = true;
      log("manual", `Agente executou "${t.titulo}" a pedido da implantadora (${p.instr})`);
      save();
      $(".dr-k", dr).innerHTML = `${I.check}Concluído`;
      $(".dr-k", dr).classList.add("ok");
      $(".dr-out", dr).innerHTML = `<p>${esc(p.fim)}</p><button class="btn sm ghost" data-drclose="1">Fechar</button>`;
      refresh();
      if (done) runT = setTimeout(done, 1200);
    };
    step();
  }
  // O agente propõe a alteração a partir do comentário da prefeitura; a implantadora confere antes do vídeo sair.
  function proposta(v) {
    const c = (v.comentario || "").trim();
    const t = c.toLowerCase();
    if (t.includes("vistoria")) return "Etapa nova: vistoria do fiscal antes da emissão";
    if (t.includes("ouvidoria")) return "Assunto novo na lista: Ouvidoria";
    if (t.includes("prazo") && /\d+/.test(t)) return `Prazo de resposta: ${t.match(/\d+/)[0]} dias`;
    if (/^falta (o |a |um |uma )?/i.test(c)) return "Incluído: " + c.replace(/^falta (o |a |um |uma )?/i, "");
    return c ? "Ajuste: " + c.charAt(0).toLowerCase() + c.slice(1) : "Ajuste pedido pela prefeitura";
  }
  function revisarAjuste(id) {
    const v = S.validacoes.find((x) => x.id === id);
    if (!v) return;
    v.proposta = v.proposta || proposta(v);
    const dr = $("#drawer");
    clearTimeout(runT);
    dr.innerHTML = `<div class="dr-h"><span class="dr-k">${I.spark}Alteração do agente</span><button class="dr-x" data-drclose="1" aria-label="Fechar">${I.x}</button></div>
      <h3>${esc(v.processo)}</h3>
      <p class="dr-instr">Seguindo <a href="${REPO}04-videos-validacao.md" target="_blank" rel="noopener">04-videos-validacao</a> · ${esc(v.ticket)}</p>
      <div class="dr-ask"><span class="l">Pedido da prefeitura</span><p>“${esc(v.comentario || "sem comentário")}”</p></div>
      <div class="diff">
        <div class="col"><span class="l">Antes</span><ul>${v.alteracoes.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>
        <div class="col after"><span class="l">Depois</span><ul>${v.alteracoes.map((a) => `<li>${esc(a)}</li>`).join("")}<li class="new">${esc(v.proposta)}</li></ul></div>
      </div>
      <p class="hint">O agente já aplicou a alteração no formulário em homologação. Confira antes de o vídeo ir pra prefeitura.</p>
      <div class="dr-btns"><button class="btn" data-criarvideo="${v.id}">${I.video}Criar vídeo novo</button><button class="btn ghost" data-outraalt="1">Pedir outra alteração</button></div>
      <form class="dr-redo" hidden><textarea rows="3" placeholder="Explique pro agente o que mudar. Ex.: a vistoria é do engenheiro, não do fiscal"></textarea><button class="btn sm" type="submit">Refazer alteração</button></form>
      <ol class="steps"></ol><div class="dr-out"></div>`;
    $(".dr-redo", dr).addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = $(".dr-redo textarea", dr).value.trim();
      if (!txt) return;
      v.proposta = txt.charAt(0).toUpperCase() + txt.slice(1);
      log("manual", `Implantadora pediu outra alteração no ${v.processo}: "${txt}"`);
      save();
      revisarAjuste(v.id);
      toast("O agente refez a alteração.");
    });
    dr.hidden = false;
    requestAnimationFrame(() => dr.classList.add("on"));
  }
  function criarVideo(id) {
    const v = S.validacoes.find((x) => x.id === id);
    const dr = $("#drawer");
    dr.querySelectorAll(".dr-btns, .dr-redo").forEach((el) => el.remove());
    $(".dr-k", dr).innerHTML = `<span class="pulse"></span>Criando vídeo`;
    const passos = ["Gravando o formulário em homologação", "Destacando só o que mudou", `Vinculando o vídeo ao ${v.ticket}`, "Enviando o link no WhatsApp da prefeitura"];
    const ol = $(".steps", dr);
    ol.innerHTML = passos.map((p) => `<li><span class="sp"></span><span>${esc(p)}</span></li>`).join("");
    const lis = ol.querySelectorAll("li");
    let i = 0;
    const step = () => {
      if (i > 0) { lis[i - 1].className = "done"; lis[i - 1].querySelector(".sp").innerHTML = I.check; }
      if (i < lis.length) { lis[i].className = "doing"; i++; runT = setTimeout(step, 1000); return; }
      v.alteracoes = [...v.alteracoes, v.proposta].slice(-4);
      v.status = "pendente"; v.gerado = isoNow(); v.comentario = ""; delete v.proposta;
      log("ticket", `Implantadora conferiu a alteração do agente no ${v.processo}. Vídeo novo criado e enviado no WhatsApp da prefeitura`);
      save();
      $(".dr-k", dr).innerHTML = `${I.check}Vídeo enviado`;
      $(".dr-k", dr).classList.add("ok");
      $(".dr-out", dr).innerHTML = `<p>Vídeo novo do ${esc(v.processo)} no Painel das Validações. A prefeitura foi avisada no WhatsApp.</p><button class="btn sm ghost" data-open="${v.id}">Ver o vídeo</button> <button class="btn sm ghost" data-drclose="1">Fechar</button>`;
      refresh();
    };
    step();
  }
  // Automode: o agente executa sozinho, em sequência, todas as tarefas dele na fase ativa.
  let AUTO = false;
  function startAuto() {
    const fila = minhas().filter((t) => t.dono === "agente").sort((a, b) => d(a.data) - d(b.data)).map((t) => t.id);
    if (!fila.length) { toast("Nenhuma tarefa do agente pendente."); return; }
    AUTO = true;
    log("manual", `Automode ligado: o agente vai executar ${fila.length} tarefas sozinho`);
    save(); refresh();
    let i = 0;
    const next = () => {
      if (!AUTO) return;
      if (i >= fila.length) {
        AUTO = false;
        log("manual", `Automode concluiu ${fila.length} tarefas`);
        save(); refresh();
        toast(`Automode: o agente concluiu ${fila.length} tarefas.`);
        return;
      }
      const id = fila[i++];
      runAgent(id, next, { i, n: fila.length });
    };
    next();
  }
  function stopAuto() {
    AUTO = false;
    clearTimeout(runT);
    refresh();
    toast("Automode desligado. O agente parou.");
  }
  const autoBtn = () => `<button class="auto ${AUTO ? "on" : ""}" data-auto="1" aria-pressed="${AUTO}"><span class="sw"></span><b>Automode</b><small>${AUTO ? "executando…" : "o agente faz sozinho"}</small></button>`;
  function closeDrawer() {
    if (AUTO) { AUTO = false; refresh(); }
    const dr = $("#drawer");
    dr.classList.remove("on");
    clearTimeout(runT);
    setTimeout(() => (dr.hidden = true), 250);
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
    const el = (s) => e.target.closest(s);
    let x;
    if ((x = el(".role button"))) {
      try { localStorage.setItem("timao-role", x.dataset.role); } catch (er) {}
      go(x.dataset.role, ROUTES[x.dataset.role][x.dataset.role === "i" ? 1 : 0].id);
      return;
    }
    if ((x = el("[data-kpi]"))) {
      if (x.dataset.kpi !== "pend") { openInfo(x.dataset.kpi); return; }
      // "Com você" leva ao que falta fazer: a fila no implantador, a lista "Para fazer" na prefeitura.
      if (ROLE === "i") { go("i", "fila"); return; }
      const q = $("#parafazer");
      q.scrollIntoView({ behavior: "smooth", block: "start" });
      q.classList.remove("flash"); void q.offsetWidth; q.classList.add("flash");
      return;
    }
    if ((x = el("[data-run]"))) { runAgent(x.dataset.run); return; }
    if (el("[data-auto]")) { AUTO ? stopAuto() : startAuto(); return; }
    if (el("[data-drclose]")) { closeDrawer(); return; }
    if ((x = el("[data-task]"))) {
      const t = findTask(x.dataset.task);
      t.feito = !t.feito;
      if (t.feito) {
        log("painel", ROLE === "c" ? `Prefeitura concluiu "${t.titulo}". O agente liberou o próximo passo` : `Implantadora concluiu "${t.titulo}"`);
        toast(ROLE === "c" ? "Feito! A Aprova já seguiu com o próximo passo." : "Tarefa concluída.");
      }
      save(); refresh();
      return;
    }
    if ((x = el("[data-open]"))) { if (x.closest("#drawer")) closeDrawer(); openPlayer(x.dataset.open); return; }
    if ((x = el("[data-filtro]"))) { filtro = x.dataset.filtro; refresh(); return; }
    if (el("[data-outra]")) { toast("Na demo, só Vale Verde tem dados."); return; }
    if ((x = el("[data-revisar]"))) {
      if (!$("#player").hidden) closePlayer();
      revisarAjuste(x.dataset.revisar);
      return;
    }
    if ((x = el("[data-criarvideo]"))) { criarVideo(x.dataset.criarvideo); return; }
    if ((x = el("[data-outraalt]"))) {
      const f = $(".dr-redo", $("#drawer"));
      f.hidden = false;
      $("textarea", f).focus();
      return;
    }
    if ((x = el("[data-cobrar]"))) {
      const t = findTask(x.dataset.cobrar);
      t.fupEm = isoNow();
      log("prazo", `FUP no WhatsApp: "${t.titulo}" está atrasada desde ${dia(t.data)}`);
      save(); toast("FUP enviado no WhatsApp."); refresh();
      return;
    }
    if ((x = el("[data-presenca]"))) {
      const r = S.reunioes.find((y) => y.id === x.dataset.presenca);
      r.presenca = true;
      log("agenda", `${S.cliente.contato} confirmou presença na reunião "${r.titulo}"`);
      save(); toast("Presença confirmada."); refresh();
      return;
    }
    if ((x = el("[data-remarcar]"))) {
      const card = x.closest(".reu");
      const r = S.reunioes.find((y) => y.id === x.dataset.remarcar);
      card.style.position = "relative";
      showSlots(card, (iso) => {
        r.data = iso; r.presenca = true;
        log("agenda", `Reunião "${r.titulo}" remarcada para ${dia(iso)} às ${hora(iso)} a pedido da prefeitura`);
        save(); toast(`Remarcada para ${dia(iso)} às ${hora(iso)}.`); refresh();
      });
      return;
    }
    if (el("[data-novareuniao]")) {
      const nx = S.fases.find((f) => f.status === "futura");
      const quando = new Date(now()); quando.setDate(quando.getDate() + 3); quando.setHours(10, 0, 0, 0);
      const p = (n) => String(n).padStart(2, "0");
      const iso = `${quando.getFullYear()}-${p(quando.getMonth() + 1)}-${p(quando.getDate())}T10:00`;
      S.reunioes.push({ id: "r" + Date.now(), titulo: `Alinhamento · ${nx ? nx.descricao : "próximos processos"}`, data: iso, secretaria: "Várias", status: "agendada", confirmacao: "Agente confirma no WhatsApp um dia antes",
        pauta: ["O que ficou pendente da fase atual", ...ajustes().map((v) => `Ajuste do ${v.processo}`), "Champions das próximas secretarias"] });
      log("agenda", `Reunião de alinhamento agendada para ${dia(iso)} às 10:00, com pauta montada pelo agente`);
      save(); toast("Reunião agendada com pauta do agente."); refresh();
      return;
    }
    if (el("[data-convidar]")) {
      const pend = S.usuarios.filter((u) => u.status === "link-enviado").map((u) => u.nome.split(" ")[0]);
      log("whatsapp", `Link de cadastro enviado no WhatsApp${pend.length ? ` (lembrete para ${pend.join(", ")})` : ""}`);
      save(); toast("Link de cadastro enviado no WhatsApp.");
      return;
    }
    if ((x = el("[data-act]"))) {
      const sl = x.closest(".slide");
      const v = S.validacoes.find((y) => y.id === sl.dataset.id);
      if (x.dataset.act === "ok") decide(v.id, "aprovado");
      if (x.dataset.act === "no") {
        const inp = $(".side textarea", sl);
        inp.placeholder = "O que precisa mudar?";
        inp.focus();
        if (v.status !== "reprovado") { v.status = "reprovado"; save(); afterChange(v.id); }
      }
      if (x.dataset.act === "zap") { log("whatsapp", `Link do vídeo do ${v.processo} reenviado no WhatsApp da prefeitura`); save(); toast("Link reenviado no WhatsApp."); }
      if (x.dataset.act === "cal") showSlots(sl, (iso) => {
        S.reunioes.push({ id: "r" + Date.now(), titulo: `Conversa rápida · ${v.processo}`, data: iso, secretaria: v.secretaria, status: "agendada", confirmacao: "Agente confirma no WhatsApp um dia antes", pauta: [`Dúvidas sobre o vídeo do ${v.processo}`, ...v.alteracoes] });
        log("agenda", `Conversa de 15 min sobre o ${v.processo} agendada para ${dia(iso)} às ${hora(iso)}. Pauta montada com as alterações do vídeo`);
        save(); toast(`Agendado: ${dia(iso)} às ${hora(iso)}. Convite enviado no WhatsApp.`);
      });
    }
  });
  document.addEventListener("change", (e) => {
    const up = e.target.closest("[data-upload]");
    if (!up || !up.files[0]) return;
    const t = findTask(up.dataset.upload);
    t.feito = true;
    const tk = t.ticket || novoTicket();
    log("ticket", `${S.cliente.contato} enviou "${up.files[0].name}" pelo painel: anexado ao ${tk} e regras extraídas pelo agente`);
    save(); toast("Arquivo recebido. A Aprova já está usando."); refresh();
  });
  $("#closePlayer").addEventListener("click", closePlayer);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#player").hidden) closePlayer();
    else if (!$("#drawer").hidden) closeDrawer();
  });
  $("#reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = JSON.parse(JSON.stringify(window.DATA));
    render();
    toast("Demo reiniciada.");
  });
  window.addEventListener("hashchange", () => { parseHash(); render(); window.scrollTo(0, 0); });

  // ---------- início ----------
  parseHash();
  if (!location.hash) history.replaceState(null, "", `#/${ROLE}/${PAGE}`);
  render();
  tickSync();
  setInterval(tickSync, 1000);
})();
