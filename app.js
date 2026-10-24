(() => {
  const KEY = "timao-state-v3";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- estado (DATA + o que mudou na demo) ----------
  // O painel da prefeitura é separado do painel do implantador: só mostra o que a implantadora publicou.
  const PAINEL_PADRAO = {
    blocos: { indicadores: true, parafazer: true, ai: true, reuniao: true, andamento: true, validacoes: true, reunioes: true, equipe: true },
    avisos: [{ id: "a1", titulo: "Go-live da Secretaria de Obras", texto: "Os processos de Obras entram no ar em 04/11. Até lá, os analistas usam o sistema em homologação." }],
    links: [{ id: "l1", titulo: "Manual do analista (PDF)", url: "https://aprova.com.br" }],
    ocultas: []
  };
  const BLOCOS = [
    ["indicadores", "Indicadores", "Entrega, o que está com a prefeitura, go-live e agenda"],
    ["ai", "ai.aprova", "Campo de conversa e atalhos do agente no Início"],
    ["validacoes", "Validações", "Vídeos para aprovar"],
    ["reunioes", "Agenda", "Calendário com entregas, reuniões e prazos"],
    ["equipe", "Minha equipe", "Usuários e convite pelo WhatsApp"]
  ];
  let S = load();
  const PAINEL_URL = "https://marcielidupuy-lang.github.io/timao/";
  function abrirWhats(msg) {
    const n = String(window.WHATSAPP || "").replace(/\D/g, "");
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }
  // Botão que manda um texto pronto: o texto vai no próprio atributo.
  const botaoWhats = (msg, rotulo = "Mandar no WhatsApp") => `<button type="button" class="btn sm wa" data-wa="${esc(msg)}">${I.whatsapp}${rotulo}</button>`;
  const PN = () => S.painel || (S.painel = JSON.parse(JSON.stringify(PAINEL_PADRAO)));
  const visivel = (t) => !PN().ocultas.includes(t.id);
  let EDIT = false;
  const preview = () => { try { return sessionStorage.getItem("timao-prev") === "1"; } catch (e) { return false; } };
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
    eye: sv('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeoff: sv('<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.1M6.6 6.6A17 17 0 002 12s3.5 7 10 7a9.8 9.8 0 005.4-1.6"/>'),
    pencil: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    ext: sv('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>'),
    trash: sv('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    megaphone: sv('<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M18 9a4 4 0 010 6"/>'),
    link: sv('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
    clip: sv('<path d="M20.5 11.5l-8.2 8.2a5 5 0 01-7-7l8.6-8.6a3.4 3.4 0 014.8 4.8l-8.4 8.4a1.8 1.8 0 01-2.6-2.6l7.8-7.8"/>'),
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
      { id: "agenda", nome: "Agenda", ic: "cal" },
      { id: "validacoes", nome: "Validações", ic: "video", badge: () => ajustes().length },
      { id: "usuarios", nome: "Usuários", ic: "users" },
      { id: "agente", nome: "Agente", ic: "bolt" }
    ],
    c: [
      { id: "inicio", nome: "Início", ic: "home", badge: () => doCliente().filter(visivel).length + (PN().blocos.validacoes ? vidsPend().length : 0) },
      { id: "validacoes", nome: "Validações", ic: "video", badge: () => vidsPend().length, bloco: "validacoes" },
      { id: "agenda", nome: "Agenda", ic: "cal", bloco: "reunioes" },
      { id: "equipe", nome: "Minha equipe", ic: "users", bloco: "equipe" }
    ]
  };
  const rotas = (role) => ROUTES[role].filter((r) => !r.bloco || PN().blocos[r.bloco]);
  let ROLE = "i", PAGE = "carteira";
  function parseHash() {
    const m = location.hash.match(/^#\/(i|c)\/([a-z]+)/);
    if (m && rotas(m[1]).some((r) => r.id === m[2])) { ROLE = m[1]; PAGE = m[2]; return; }
    // Tela que não existe mais ou que a implantadora desligou: fica na mesma visão, na primeira tela.
    if (m) { ROLE = m[1]; PAGE = rotas(m[1])[0].id; return; }
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
    $(".role").innerHTML = ROLE === "i"
      ? `<button class="btn sm ghost" data-preview="edit">${I.pencil}Editar painel do cliente</button><button class="btn sm" data-preview="1">${I.ext}Abrir painel do cliente</button>`
      : preview() ? `<span class="prev-tag">${I.eye}Você está vendo o painel da prefeitura</span>${EDIT ? "" : `<button class="btn sm ghost" data-edit="1">${I.pencil}Editar painel</button>`}<button class="btn sm ghost" data-back="1">Voltar ao implantador</button>` : "";
    $("#avatar").textContent = ROLE === "i" ? "MD" : "AR";
    const c = S.cliente;
    $("#who").innerHTML = ROLE === "i"
      ? `<span class="who-k">Implantadora</span><b>${esc(c.implantador)}</b>`
      : `<span class="who-k">${esc(c.nome)}</span><b>${esc(c.champion)}</b>`;
    const items = rotas(ROLE);
    const link = (r) => {
      const n = r.badge ? r.badge() : 0;
      return `<a class="nav2-item ${r.id === PAGE ? "on" : ""}" href="#/${ROLE}/${r.id}"><span class="ni">${I[r.ic]}</span>${r.nome}${n ? `<span class="badge">${n}</span>` : ""}</a>`;
    };
    if (ROLE === "i") {
      $("#nav").innerHTML = link(items[0]) + `<div class="nav2-label">${esc(c.nome.replace("Prefeitura de ", ""))} · ${c.uf}</div>` + items.slice(1).map(link).join("");
      $("#nav2Extra").innerHTML = `<div class="nav2-label">Instruções do agente</div><a class="nav2-item small" href="${REPO}" target="_blank" rel="noopener"><span class="ni">${I.bolt}</span>Abrir pasta INSTRUCTIONS</a>`;
    } else {
      $("#nav").innerHTML = items.map(link).join("");
      $("#nav2Extra").innerHTML = `<div class="help-card"><b>Precisa de ajuda?</b><span>Fale com a Aprova pelo WhatsApp ou pelo ai.aprova no Início.</span>${PN().blocos.ai ? `<button class="btn sm" data-ajuda="1">${I.chat}Sim</button>` : ""}</div>`;
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
  const hero = (eyebrow, h1, sub, meta) =>
    `<section class="phead ${ENTRADA.includes(PAGE) ? "entry" : ""}"><h1>${h1}<span>${sub}</span></h1>${meta ? `<p>${meta}</p>` : ""}</section>`;
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
      const tasks = [...f.tasks].filter((t) => ROLE !== "c" || visivel(t)).sort((a, b) => (isLate(b) - isLate(a)) || (a.feito - b.feito) || (d(a.data) - d(b.data)));
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
    const pend = lado === "c" ? doCliente().filter(visivel).length + (PN().blocos.validacoes ? vidsPend().length : 0) : doCliente().length + vidsPend().length;
    if (lado === "c") {
      // Na prefeitura não mostramos "reunião evitada"; no lugar entra a agenda.
      const prox = proxReunioes()[0];
      return `<section class="kpis">
        ${kpi("Entrega", pct + "%", "", "", pct, "entrega")}
        ${kpi("Com você", pend, "tarefas e vídeos", pend ? "alert" : "good", undefined, "pend")}
        ${kpi("Go-live", daysUntil(c.meta + "T09:00") + " dias", "meta " + dia(c.meta + "T09:00"), "", undefined, "golive")}
        ${kpi("Agenda de reunião", prox ? dia(prox.data) : "–", prox ? `${hora(prox.data)} · ${esc(prox.secretaria)}` : "nenhuma marcada", "", undefined, "agenda")}
      </section>`;
    }
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

  // Os 2 meses da implantação numa barra, uma faixa por fase e a marca de hoje.
  function ganttHTML() {
    const c = S.cliente;
    const ini = d(c.inicio + "T00:00"), fim = d(c.meta + "T23:59");
    const pos = (x) => Math.min(100, Math.max(0, ((x - ini) / (fim - ini)) * 100));
    let de = ini;
    const segs = S.fases.map((f) => {
      const ate = d(fimFase(f));
      const s = `<span class="gantt-seg ${f.status}" style="left:${pos(de)}%;width:${pos(ate) - pos(de)}%" title="${esc(f.nome)} · até ${dia(fimFase(f))}">${esc(f.nome)}</span>`;
      de = ate;
      return s;
    }).join("");
    return `<div class="gantt"><div class="gantt-track">${segs}<span class="gantt-now" style="left:${pos(now())}%"><span>Hoje</span></span></div>
        <div class="gantt-axis"><span>${dia(c.inicio + "T09:00")} · início</span><span>${dia(c.meta + "T09:00")} · go-live</span></div></div>`;
  }

  // Prefeitura: o que o contrato prevê entregar em cada fase (o escopo), com prazo e situação.
  function escopoHTML() {
    const c = S.cliente, ESC = window.DATA.escopo || {};
    const st = (x) => x.status === "entregue" ? "done" : d(x.prazo + "T23:59") < now() ? "late" : x.status === "andamento" ? "doing" : "";
    const itens = S.fases.flatMap((f) => ESC[f.id] || []);
    const n = (k) => itens.filter((x) => st(x) === k).length;
    let hoje = false;
    const fases = S.fases.map((f) => {
      const lista = [...(ESC[f.id] || [])].sort((a, b) => d(a.prazo) - d(b.prazo));
      const lis = lista.map((x) => {
        let pre = "";
        if (!hoje && d(x.prazo + "T23:59") > now()) { hoje = true; pre = `<li class="today"><span>Hoje · ${dia(isoNow())}</span></li>`; }
        const s = st(x);
        return pre + `<li class="${s}"><span class="dt">${s === "done" ? I.check : s === "late" ? I.clock : ""}</span><span class="tx"><b>${esc(x.t)}</b><small>${esc(x.d)}</small></span><span class="wd">${s === "late" ? "atrasada · " : ""}${dia(x.prazo + "T09:00")}</span></li>`;
      }).join("");
      return `<section class="tl-fase"><div class="tl-fh"><b>${esc(f.nome)}</b><span>${esc(f.descricao)}</span></div>
        <div class="tl-fm">entrega até ${dia(fimFase(f))} · ${lista.filter((x) => x.status === "entregue").length} de ${lista.length} entregues</div><ol class="tl">${lis}</ol></section>`;
    }).join("");
    return `<h3>Linha do tempo</h3>
      <p class="dr-instr">Escopo do contrato · ${c.secretarias} secretarias e ${c.processos} processos até ${dia(c.meta + "T09:00")}</p>
      <div class="tl-sum"><span class="ok">${n("done")} entregues</span>${n("doing") ? `<span class="doing">${n("doing")} em andamento</span>` : ""}<span>${n("")} previstas</span>${n("late") ? `<span class="late">${n("late")} atrasada${n("late") > 1 ? "s" : ""}</span>` : ""}</div>
      ${ganttHTML()}${fases}`;
  }

  // Implantador: cada tarefa da implantação na linha do tempo.
  function linhaTempoHTML() {
    if (ROLE === "c") return escopoHTML();
    const c = S.cliente;
    const todas = allTasks(), feitas = todas.filter((t) => t.feito).length, late = todas.filter(isLate).length;
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
      ${ganttHTML()}${fases}`;
  }

  // O que depende da prefeitura agora: vídeos para validar e tarefas da equipe.
  function todoItems() {
    return [
      ...vidsPend().map((v) => `<div class="todo"><span class="qi cyan">${I.video}</span><div class="qt"><b>Validar o vídeo do ${esc(v.processo)}</b><span>${v.alteracoes.length} mudanças · ${Math.round((steps(v) * STEP_MS) / 1000)} segundos</span></div><button class="btn sm" data-open="${v.id}">Assistir</button></div>`),
      ...doCliente().map((t) => `<div class="todo ${isLate(t) ? "late" : ""}"><span class="qi ${isLate(t) ? "red" : "amber"}">${I.clipboard}</span><div class="qt"><b>${esc(t.titulo)}</b><span>${isLate(t) ? `Atrasada desde ${dia(t.data)}` : `Até ${dia(t.data)} às ${hora(t.data)}`}</span></div><div class="qa">${/enviar|devolver/i.test(t.titulo) ? `<label class="btn sm">${I.upload}Enviar<input type="file" hidden data-upload="${t.id}"></label>` : ""}<button class="btn sm ghost" data-task="${t.id}">Feito</button></div></div>`)
    ];
  }
  function paraFazerHTML() {
    return `<h3>Para fazer</h3>
      <p class="dr-instr">O que depende de você. O resto a Aprova resolve.</p>
      <div class="queue dr-q">${todoItems().join("") || `<p class="empty">Tudo em dia 🎉</p>`}</div>`;
  }
  function agendaHTML() {
    // Das reuniões já feitas, só as dos últimos 30 dias: o resto está na Agenda.
    const corte = now() - 30 * 86400000;
    const ag = proxReunioes(), re = S.reunioes.filter((r) => r.status === "realizada" && d(r.data) >= corte).sort((a, b) => d(b.data) - d(a.data));
    return `<h3>Agenda de reunião</h3>
      <p class="dr-instr">A pauta chega antes e o combinado fica por escrito.</p>
      <div class="dr-sec">Próximas</div><div class="dr-reus">${ag.map((r) => reuniaoHTML(r)).join("") || `<p class="empty">Nenhuma reunião marcada.</p>`}</div>
      ${re.length ? `<div class="dr-sec">Já aconteceram · últimos 30 dias</div><div class="dr-reus">${re.map((r) => reuniaoHTML(r)).join("")}</div>` : ""}
      ${ROLE === "c" && PN().blocos.reunioes ? `<div class="dr-out"><a class="btn sm ghost" href="#/c/agenda" data-drclose="1">${I.cal}Abrir a agenda completa</a></div>` : ""}`;
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
      ${ROLE === "i" ? `<div class="dr-alert ${sd}"><span class="saude ${sd}">${SAUDE[sd]}</span><p>${motivo}</p></div>` : ""}
      <div class="dr-sec">Marcos até lá</div>
      <ul class="dr-list">${S.fases.map((f) => `<li><span>${esc(f.nome)} · ${esc(f.descricao)}<small>${f.tasks.filter((t) => t.feito).length} de ${f.tasks.length} feitas</small></span><b>${dia(fimFase(f))}</b></li>`).join("")}</ul>
      <div class="dr-sec">O que falta</div>
      <ul class="dr-list">
        <li><span>${DONO[ROLE].prefeitura}<small>${agora} agora${daEquipe > agora ? `, ${daEquipe - agora} nas próximas fases` : ""} · tarefas e vídeos</small></span><b>${daEquipe}</b></li>
        <li><span>${ROLE === "c" ? "Aprova" : "Aprova e agente"}<small>configuração, ajustes e treinamento</small></span><b>${falta.length - falta.filter((t) => t.dono === "prefeitura").length}</b></li>
      </ul>
      ${atras.length ? `<div class="dr-sec">Atrasado</div><ul class="dr-list">${atras.map((t) => `<li class="late"><span>${esc(t.titulo)}<small>${DONO[ROLE][t.dono]}</small></span><b>${dia(t.data)}</b></li>`).join("")}</ul>` : ""}`;
  }

  // INFO guarda qual detalhe está aberto: ele fecha clicando fora e se atualiza quando algo muda.
  let INFO = null;
  function renderInfo() {
    const n = doCliente().length + vidsPend().length;
    const H = {
      entrega: [`Entrega · ${entrega()}%`, linhaTempoHTML],
      pend: [`Com você · ${n}`, paraFazerHTML],
      reuniao: ["Reunião evitada", evitadaHTML],
      golive: ["Go-live", goliveHTML],
      agenda: ["Reuniões", agendaHTML]
    }[INFO];
    const dr = $("#drawer"), y = dr.scrollTop;
    dr.innerHTML = `<div class="dr-h"><span class="dr-k">${I.chart}${H[0]}</span><button class="dr-x" data-drclose="1" aria-label="Fechar">${I.x}</button></div>` + H[1]();
    dr.scrollTop = y;
  }
  function openInfo(kind) {
    if (AUTO) { toast("Espere o Automode terminar."); return; }
    const dr = $("#drawer");
    clearTimeout(runT);
    INFO = kind;
    dr.scrollTop = 0;
    renderInfo();
    dr.hidden = false;
    $("#scrim").hidden = false;
    requestAnimationFrame(() => { dr.classList.add("on"); $("#scrim").classList.add("on"); });
  }

  VIEWS["i/visao"] = () => {
    const c = S.cliente;
    const fila = filaItems().slice(0, 4);
    const prox = proxReunioes();
    return hero(`${ativa() ? ativa().nome + " em andamento" : "Implantação"}`, `${esc(c.nome)}.`, "Implantação da prefeitura toda.", `${c.secretarias} secretarias · ${c.processos} processos · champion ${esc(c.champion)} · Pylon ${esc(c.pylon)}`) +
      `<div class="split">
        <div class="split-l">
          ${kpisHTML("i")}
          <div class="block-sm">${secTitle("Sua fila", `${filaItems().length} itens`, `<a class="more" href="#/i/fila">Ver tudo ${I.right}</a>`)}
          <div class="queue">${fila.map(filaItemHTML).join("") || `<p class="empty">Nada na sua fila 🎉</p>`}</div></div>
          <div class="block-sm">${secTitle("Próximas reuniões", "", `<a class="more" href="#/i/agenda">Agenda ${I.right}</a>`)}<div class="reu-grid">${prox.slice(0, 2).map((r) => reuniaoHTML(r, false)).join("")}</div></div>
          <div class="block-sm"><section class="card"><div class="card-h"><h3>Agente em ação</h3><span class="live"><span class="dot"></span>ao vivo</span></div>${feedHTML(5)}<a class="more" href="#/i/agente">Execuções do agente ${I.right}</a></section></div>
        </div>
        <aside class="split-r"><section class="chat-card"><h2 class="ask-h">O que o agente faz por você agora?</h2><div data-ai="i"></div></section></aside>
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
      `<div class="block-sm">${secTitle("Tarefas da Aprova e do agente", "", `<a class="more" href="#/i/agente">Automode ${I.right}</a>`)}<div class="queue">${m.map((t) => filaItemHTML({ tipo: "tarefa", t })).join("") || `<p class="empty">Nada aqui.</p>`}</div></div>`;
  };

  VIEWS["i/fases"] = () => hero("Fases e tarefas", "Fases da implantação.", "Tudo que está previsto.", "Você conclui o que é da Aprova. O que é da prefeitura, ela marca no painel dela.") + `<div class="sec-title"><span class="hint">Clique na seta → de uma tarefa do agente pra ele executar. Pra várias de uma vez, use o Automode em <a href="#/i/agente">Agente</a>.</span></div>` + fasesHTML();

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
    const pend = pendAgente();
    // Por padrão vêm marcadas as da fase ativa; as das próximas fases ficam desmarcadas.
    if (!SEL) SEL = new Set(pend.filter((t) => t.fase.status === "ativa").map((t) => t.id));
    const nSel = pend.filter((t) => SEL.has(t.id)).length;
    return hero("Agente", "Execuções do agente.", "Selecione e ligue o Automode.", "O agente executa as marcadas, uma atrás da outra, seguindo as instruções da pasta INSTRUCTIONS.") +
      `<div class="grid"><div class="col-main">
        <section class="card exec">
          <div class="card-h"><h3>Para o agente executar</h3><span class="hint">${nSel} de ${pend.length} selecionada${nSel === 1 ? "" : "s"}</span></div>
          <div class="exec-bar"><button class="link" data-selall="${nSel === pend.length ? "0" : "1"}">${nSel === pend.length ? "Desmarcar todas" : "Marcar todas"}</button>${autoBtn()}</div>
          <ul class="exec-list">${pend.map((t) => `<li class="${t.id === CUR ? "running" : ""}">
            <label class="ck"><input type="checkbox" data-sel="${t.id}" ${SEL.has(t.id) ? "checked" : ""} ${AUTO ? "disabled" : ""}><span></span></label>
            <div class="qt"><b>${esc(t.titulo)}</b><span>${esc(t.fase.nome)} · ${dia(t.data)} ${hora(t.data)}${t.ticket ? " · " + esc(t.ticket) : ""} · ${plano(t).instr}</span></div>
            ${t.id === CUR ? `<span class="exec-st"><span class="pulse"></span>executando</span>` : `<button class="run" data-run="${t.id}" title="Executar só esta" aria-label="Executar só esta">${I.right}</button>`}
          </li>`).join("") || `<li class="empty">Nenhuma execução pendente 🎉</li>`}</ul>
        </section>
        <div class="block-sm"><section class="card"><div class="card-h"><h3>O que o agente já fez</h3></div>${feedHTML(30)}</section></div>
      </div>
        <aside class="col-side"><section class="card"><div class="card-h"><h3>Instruções</h3><span class="hint">ações nesta implantação</span></div>
          <ul class="instr">${INSTR.map(([k, desc]) => `<li><a href="${REPO}${k}.md" target="_blank" rel="noopener"><b>${k}</b><span>${desc}</span></a><span class="n">${cont[k] || "–"}</span></li>`).join("")}</ul>
        </section></aside></div>`;
  };


  // ---------- telas da prefeitura ----------
  // Início da prefeitura: saudação curta, os 4 cards (cada um abre o detalhe) e os atalhos do ai.aprova.
  VIEWS["c/inicio"] = () => {
    const c = S.cliente;
    const B = PN().blocos;
    const n = doCliente().filter(visivel).length + (B.validacoes ? vidsPend().length : 0);
    const avisos = PN().avisos.map((a) => `<div class="aviso"><span class="qi cyan">${I.megaphone}</span><div class="qt"><b>${esc(a.titulo)}</b><span>${esc(a.texto)}</span></div></div>`).join("");
    // O título "Por onde começamos?" fica em cima do chat, dentro do aiBox.
    return `<section class="phead hello"><h1>Olá, ${esc(c.contato)}.<span>${n ? `${n} coisa${n > 1 ? "s" : ""} depende${n > 1 ? "m" : ""} de você.` : "Nada depende de você hoje."}</span></h1></section>` +
      (avisos ? `<div class="avisos">${avisos}</div>` : "") +
      (B.indicadores ? kpisHTML("c") : "") +
      (B.ai ? `<section class="ask left"><div data-ai="c"></div></section>` : "");
  };

  function editorHTML() {
    const p = PN();
    const sw = (on) => `<span class="sw ${on ? "on" : ""}"><i></i></span>`;
    const tarefas = S.fases.flatMap((f) => f.tasks.map((t) => ({ t, f })));
    return `<div class="ed-h"><div><span class="who-k">Painel da prefeitura</span><h3>Editar o que aparece</h3></div><button class="dr-x" data-edclose="1" aria-label="Fechar edição" title="Fechar">${I.x}</button></div>
      <p class="hint">Cada mudança aparece na hora, aqui do lado.</p>
      <section class="ed-sec"><h4>Blocos e telas</h4>
        <ul class="ed-list">${BLOCOS.map(([k, nome, desc]) => `<li><div class="qt"><b>${nome}</b><span>${desc}</span></div><button class="sw-btn" data-bloco="${k}" aria-pressed="${!!p.blocos[k]}" aria-label="${p.blocos[k] ? "Esconder" : "Mostrar"} ${nome}">${sw(p.blocos[k])}</button></li>`).join("")}</ul></section>
      <section class="ed-sec"><h4>Avisos</h4>
        <ul class="ed-items">${p.avisos.map((a) => `<li><div class="qt"><b>${esc(a.titulo)}</b><span>${esc(a.texto)}</span></div><button class="dr-x" data-delaviso="${a.id}" aria-label="Remover aviso">${I.trash}</button></li>`).join("") || `<li class="empty">Nenhum aviso.</li>`}</ul>
        <form class="ed-form" data-add="aviso"><input name="titulo" placeholder="Título do aviso" required><textarea name="texto" rows="2" placeholder="Texto curto pra prefeitura" required></textarea><button class="btn sm" type="submit">${I.plus}Adicionar aviso</button></form></section>
      <section class="ed-sec"><h4>Tarefas que a prefeitura vê</h4>
        <ul class="ed-list">${tarefas.map(({ t, f }) => { const on = visivel(t); return `<li class="${on ? "" : "off"}"><div class="qt"><b>${esc(t.titulo)}</b><span>${esc(f.nome)} · ${DONO.i[t.dono]}</span></div><button class="btn sm ghost eye" data-ocultar="${t.id}">${on ? I.eye + "Visível" : I.eyeoff + "Escondida"}</button></li>`; }).join("")}</ul></section>`;
  }



  VIEWS["c/validacoes"] = () => `<section class="big-h"><p class="eyebrow"><span class="dot-c"></span>Validações</p><h2>Assista, aprove, pronto.<span>Sem precisar de reunião.</span></h2><p class="lead">Cada vídeo mostra só o que mudou no formulário. Se algo estiver errado, fale com o ai.aprova ali mesmo.</p></section>` + validacoesHTML();

  // ---------- agenda da prefeitura (calendário) ----------
  // Tudo que tem data no sistema: entregas do contrato, reuniões, prazos da equipe e o go-live.
  const TIPOS = { late: "Atrasado", tarefa: "Sua equipe", aprova: "Aprova e agente", reuniao: "Reunião", entrega: "Entrega do contrato", golive: "Go-live" };
  // Pro implantador as tarefas da prefeitura se chamam "Prefeitura" e entram também as da Aprova e do agente.
  const tipoNome = (k) => (ROLE === "i" && k === "tarefa" ? "Prefeitura" : TIPOS[k]);
  const ymd = (x) => { const p = (n) => String(n).padStart(2, "0"); return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`; };
  let CAL = null;
  function eventosAgenda() {
    const ev = [];
    S.reunioes.forEach((r) => ev.push({ iso: r.data, tipo: "reuniao", t: r.titulo, s: `${hora(r.data)} · ${r.secretaria}${r.status === "realizada" ? " · realizada" : r.presenca ? " · presença confirmada" : ""}`, feito: r.status === "realizada", reu: r }));
    Object.values(window.DATA.escopo || {}).flat().forEach((x) => {
      const late = x.status !== "entregue" && d(x.prazo + "T23:59") < now();
      ev.push({ iso: x.prazo + "T09:00", tipo: /^go-live/i.test(x.t) ? "golive" : "entrega", t: x.t, s: x.status === "entregue" ? "entregue" : late ? "atrasada" : x.d, feito: x.status === "entregue", late });
    });
    allTasks().filter((t) => ROLE === "i" || (t.dono === "prefeitura" && visivel(t))).forEach((t) =>
      ev.push({ iso: t.data, tipo: t.dono === "prefeitura" ? "tarefa" : "aprova", t: t.titulo, s: t.feito ? "feito" : isLate(t) ? `atrasada desde ${dia(t.data)}` : `até ${hora(t.data)}`, feito: t.feito, late: isLate(t), task: t }));
    return ev.sort((a, b) => d(a.iso) - d(b.iso));
  }
  const evClasse = (e) => `${e.late ? "late" : e.tipo}${e.feito ? " feito" : ""}`;
  const evLinha = (e, comDia) => `<li><span class="ag-dot ${evClasse(e)}"></span><span class="ag-t"><b>${esc(e.t)}</b><small>${comDia ? `${diaSem(e.iso)} · ` : ""}${esc(e.s)}</small></span><span class="ag-k ${evClasse(e)}">${e.late ? "atrasado" : e.feito ? "feito" : tipoNome(e.tipo)}</span></li>`;

  VIEWS["c/agenda"] = () => {
    if (!CAL) { const n = now(); CAL = { y: n.getFullYear(), m: n.getMonth(), sel: ymd(n) }; }
    const ev = eventosAgenda(), porDia = {};
    ev.forEach((e) => (porDia[e.iso.slice(0, 10)] = porDia[e.iso.slice(0, 10)] || []).push(e));
    const first = new Date(CAL.y, CAL.m, 1), fimMes = new Date(CAL.y, CAL.m + 1, 0).getDate();
    const semanas = Math.ceil((first.getDay() + fimMes) / 7), hoje = ymd(now());
    const cel = Array.from({ length: semanas * 7 }, (_, i) => {
      const x = new Date(CAL.y, CAL.m, 1 - first.getDay() + i), k = ymd(x), lista = porDia[k] || [];
      return `<button type="button" class="cal-d ${x.getMonth() !== CAL.m ? "out" : ""} ${k === hoje ? "today" : ""} ${k === CAL.sel ? "sel" : ""}" data-caldia="${k}" aria-label="${diaSem(k + "T12:00")}${lista.length ? `, ${lista.length} evento${lista.length > 1 ? "s" : ""}` : ""}">
        <span class="n">${x.getDate()}</span><span class="cal-evs">${lista.slice(0, 4).map((e) => `<i class="ev ${evClasse(e)}">${e.tipo === "reuniao" ? `<em>${hora(e.iso)}</em>` : ""}${esc(e.t)}</i>`).join("")}${lista.length > 4 ? `<i class="mais">+${lista.length - 4} mais</i>` : ""}</span></button>`;
    }).join("");
    // Só o calendário, grande; o que tem em cada dia abre num modal no meio da tela.
    return hero("Agenda", "Agenda.", "Entregas, reuniões e prazos.", "Tudo que tem data na implantação, num lugar só. Clique num dia para ver o que tem nele.") +
      `<div class="ag-full">
        <div class="cal-h"><h2>${first.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).replace(/^./, (l) => l.toUpperCase())}</h2>
          <button class="btn sm ghost" data-calmes="-1" aria-label="Mês anterior">‹</button><button class="btn sm ghost" data-calhoje="1">Hoje</button><button class="btn sm ghost" data-calmes="1" aria-label="Próximo mês">›</button></div>
        <div class="cal"><div class="cal-w">${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w) => `<span>${w}</span>`).join("")}</div><div class="cal-g">${cel}</div></div>
        <div class="cal-leg">${Object.keys(TIPOS).filter((k) => ROLE === "i" || k !== "aprova").map((k) => `<span class="${k}">${tipoNome(k)}</span>`).join("")}</div>
      </div>`;
  };

  // Modal do dia: reuniões com pauta e botões, tarefas com Enviar/Feito, entregas com a situação.
  function diaHTML(k) {
    const ev = eventosAgenda().filter((e) => e.iso.slice(0, 10) === k);
    const titulo = diaSem(k + "T12:00").replace(/^./, (l) => l.toUpperCase());
    const item = (e) => {
      if (e.reu) return `<div class="md-reu"><span class="ag-k reuniao">${tipoNome("reuniao")}</span>${reuniaoHTML(e.reu)}</div>`;
      const t = e.task, pode = t && !t.feito && (ROLE === "i" ? t.dono !== "prefeitura" : t.dono === "prefeitura");
      const acoes = pode ? `<div class="qa">${/enviar|devolver/i.test(t.titulo) ? `<label class="btn sm">${I.upload}Enviar<input type="file" hidden data-upload="${t.id}"></label>` : ""}<button class="btn sm ghost" data-task="${t.id}">Feito</button></div>`
        : e.feito ? `<span class="ok-note">${I.check}${e.tipo === "entrega" || e.tipo === "golive" ? "Entregue" : "Feito"}</span>` : "";
      return `<div class="md-item ${e.late ? "late" : ""}"><span class="ag-dot ${evClasse(e)}"></span><div class="ag-t"><span class="ag-k ${evClasse(e)}">${e.late ? "Atrasado" : tipoNome(e.tipo)}</span><b>${esc(e.t)}</b><small>${esc(e.s)}</small></div>${acoes}</div>`;
    };
    return `<div class="md-h"><div><h3>${titulo}</h3><p>${ev.length ? `${ev.length} ${ev.length > 1 ? "coisas" : "coisa"} neste dia` : "Nada marcado neste dia."}</p></div><button class="dr-x" data-mdclose="1" aria-label="Fechar">${I.x}</button></div>
      <div class="md-list">${ev.map(item).join("") || `<p class="empty">Escolha outro dia no calendário.</p>`}</div>`;
  }
  function openDia(k) {
    CAL.open = k;
    $("#modal .modal-card").innerHTML = diaHTML(k);
    $("#modal").hidden = false;
    requestAnimationFrame(() => $("#modal").classList.add("on"));
  }
  function closeModal() {
    if (CAL) CAL.open = null;
    const m = $("#modal");
    m.classList.remove("on");
    setTimeout(() => { if (!CAL || !CAL.open) m.hidden = true; }, 200);
  }

  VIEWS["i/agenda"] = () => VIEWS["c/agenda"]();

  VIEWS["c/equipe"] = () => hero("Minha equipe", "Quem usa o sistema.", "Convide pelo WhatsApp.", "Mande o link, a pessoa preenche os dados e a Aprova libera o acesso.") +
    `<div class="sec-title"><span></span><button class="btn sm" data-convidar="1">${I.whatsapp}Convidar alguém</button></div>` + usuariosHTML();

  // ---------- render ----------
  function render() {
    renderShell();
    $("#view").innerHTML = VIEWS[`${ROLE}/${PAGE}`]();
    // Implantador dentro do painel da prefeitura: o editor fica numa lateral à direita.
    let ed = $("#edside");
    const editando = ROLE === "c" && preview() && EDIT;
    document.body.classList.toggle("editing", editando);
    if (editando) {
      if (!ed) { ed = document.createElement("aside"); ed.id = "edside"; ed.className = "edside"; ed.setAttribute("aria-label", "Editar painel do cliente"); document.body.appendChild(ed); }
      const y = ed.scrollTop;
      ed.innerHTML = editorHTML();
      ed.scrollTop = y;
    } else if (ed) ed.remove();
    document.querySelectorAll("[data-ai]").forEach((el) => el.appendChild(aiBox(el.dataset.ai === "i" ? {
      placeholder: "Peça ao agente: resumo pro secretário, cobrar pendências, montar pauta…",
      sugs: [
        { ic: "form", t: "Resumo para o secretário", d: "Status da implantação em 3 linhas, pronto pro WhatsApp." },
        { ic: "whatsapp", t: "Cobrar pendências", d: "FUP de tudo que está atrasado na prefeitura." },
        { ic: "cal", t: "Montar pauta da próxima reunião", d: "Com o que falta decidir em cada processo." }
      ]
    } : atalhosPrefeitura())));
    // "Precisa de ajuda? Sim" na lateral: o chat do Início recebe o pedido.
    if (AJUDA) {
      const box = $('[data-ai="c"] .ai');
      AJUDA = false;
      if (box) { box.scrollIntoView({ behavior: "smooth", block: "center" }); box.send("Preciso de ajuda"); }
    }
  }
  let AJUDA = false;
  // Atalhos da prefeitura: cada botão manda o pedido pro chat ao lado. O que está atrasado vem primeiro.
  function atalhosPrefeitura() {
    const vids = vidsPend().length;
    const envio = (t) => /enviar|devolver/i.test(t.titulo);
    const nomeEnvio = (t) => "Enviar: " + t.titulo.replace(/^(enviar|devolver)\s+(.)/i, (m, v, l) => l.toUpperCase());
    const minhas = doCliente().filter(visivel).sort((a, b) => d(a.data) - d(b.data));
    // sub é a linha curta embaixo do título; tone é a cor do ícone.
    const atrasadas = minhas.filter(isLate).map((t) => envio(t)
      ? { ic: "upload", tone: "red", t: nomeEnvio(t), sub: `Atrasado desde ${dia(t.data)}`, d: "A Aprova identifica a pendência e dá baixa.", acao: "anexar", hot: true }
      : { ic: "clock", tone: "red", t: t.titulo, sub: `Atrasada desde ${dia(t.data)}`, d: "Fale com a Aprova sobre esta pendência.", msg: `Quero resolver: ${t.titulo}`, hot: true });
    const doc = minhas.find((t) => envio(t) && !isLate(t));
    return {
      compacto: true,
      titulo: "Por onde começamos?",
      placeholder: "Escreva para a Aprova: texto, áudio ou anexo…",
      sugs: [
        ...atrasadas,
        ...(PN().blocos.validacoes && vids ? [{ ic: "video", tone: "cyan", t: "Validar processos", sub: `${vids} vídeo${vids > 1 ? "s esperam" : " espera"} você`, d: "Abre os vídeos que esperam a sua aprovação.", msg: "Validar processos" }] : []),
        doc ? { ic: "upload", tone: "amber", t: nomeEnvio(doc), sub: `Até ${dia(doc.data)}`, d: "A Aprova identifica a pendência e dá baixa.", acao: "anexar" }
          : { ic: "upload", tone: "amber", t: "Enviar um documento", sub: "Lei, foto ou planilha", d: "A Aprova identifica a pendência e dá baixa.", acao: "anexar" },
        { ic: "form", tone: "ink", t: "Alterar um formulário", sub: "Diga o que muda", d: "Pode mandar PDF, foto ou áudio.", msg: "Quero alterar um formulário" },
        { ic: "users", tone: "green", t: "Cadastrar minha equipe", sub: "Link no WhatsApp", d: "Envia o link de cadastro no WhatsApp.", msg: "Cadastro de usuários" },
        { ic: "cal", tone: "cyan", t: "Próximo passo e prazos", sub: `Go-live em ${dia(S.cliente.meta + "T09:00")}`, d: "O que vem agora e quando é o go-live.", msg: "Qual o próximo passo e o prazo?" }
      ]
    };
  }
  function refresh() {
    // Re-renderiza a tela sem perder a rolagem; um detalhe aberto na lateral acompanha.
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (INFO) renderInfo();
    if (CAL && CAL.open) $("#modal .modal-card").innerHTML = diaHTML(CAL.open);
  }

  // ---------- ai.aprova (simulado na demo; em produção é o agente) ----------
  function aiBox({ placeholder, sugs = [], ctx = null, compacto = false, saudacao = "", titulo = "" }) {
    const box = document.createElement("div");
    box.className = compacto ? "ai compacto" : "ai";
    // Compacto: atalhos pequenos (ícone, título, linha curta e seta pro chat) numa coluna, o chat ao lado.
    const sugHTML = (s) => compacto
      ? `<button type="button" class="sug tone-${s.tone || "ink"} ${s.hot ? "hot" : ""}" data-msg="${esc(s.msg || s.t)}"${s.acao ? ` data-acao="${s.acao}"` : ""} title="${esc(s.d)}"><span class="sg-ic">${I[s.ic]}</span><span class="sg-t"><b>${esc(s.t)}</b>${s.sub ? `<small>${esc(s.sub)}</small>` : ""}</span><span class="arr">${I.right}</span></button>`
      : `<button type="button" class="sug" data-msg="${esc(s.msg || s.t)}">${I[s.ic]}<b>${esc(s.t)}</b><span>${esc(s.d)}</span></button>`;
    const sugsHTML = sugs.length ? `<ul class="sugs">${sugs.map((s) => `<li>${sugHTML(s)}</li>`).join("")}</ul>` : "";
    box.innerHTML = (compacto ? `${sugsHTML}<div class="ai-chat">${titulo ? `<h2 class="ask-h">${esc(titulo)}</h2>` : ""}` : "") + `<div class="ai-log"></div>
      <form class="box">
        <textarea rows="2" placeholder="${esc(placeholder)}" aria-label="Mensagem para o ai.aprova"></textarea>
        <div class="box-row">
          <label class="ib" title="Anexar PDF, foto ou planilha">${ctx ? I.clip : I.plus}<input type="file" hidden></label>
          <button type="button" class="ib mic" title="Gravar áudio">${I.mic}</button>
          <span class="model">${I.sparkle}ai.aprova · implantação ${I.chev}</span>
          <span class="grow"></span>
          <span class="pill-ok">Conectado</span>
          <button type="submit" class="send" title="Enviar">${I.up}</button>
        </div>
      </form>
      ${compacto ? "</div>" : sugsHTML}`;
    const logBox = $(".ai-log", box);
    const input = $("textarea", box);
    const fileIn = $("input[type=file]", box);
    const say = (who, html, cls = "") => {
      const m = document.createElement("div");
      m.className = `msg ${who} ${cls}`;
      m.innerHTML = who === "bot" ? `<b class="who">ai.aprova</b>${html}` : html;
      logBox.appendChild(m);
      logBox.scrollTop = logBox.scrollHeight;
      return m;
    };
    if (saudacao) say("bot", saudacao);
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
      if (b.dataset.acao === "anexar") {
        say("bot", "Pode mandar a lei, a foto do formulário ou a planilha. Eu vejo a que pendência ela se refere e já dou baixa.");
        fileIn.click();
        return;
      }
      send(b.dataset.msg);
    }));
    fileIn.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const chip = document.createElement("div");
      chip.className = "file-chip";
      chip.textContent = "📎 " + f.name;
      logBox.appendChild(chip);
      const t = say("bot", "lendo o arquivo…", "typing");
      setTimeout(() => {
        t.remove();
        const alvo = ROLE === "c" && casaPendencia(f.name);
        if (alvo) {
          alvo.feito = true;
          log("ticket", `${S.cliente.contato} enviou "${f.name}": o agente identificou a pendência "${alvo.titulo}" e deu baixa${alvo.ticket ? ` no ${alvo.ticket}` : ""}`);
          save();
          // Só os cards e o menu mudam; re-renderizar a tela apagaria a conversa.
          const k = $(".kpis");
          if (k) k.outerHTML = kpisHTML(ROLE);
          renderShell();
          say("bot", `Recebi <b>${esc(f.name)}</b>. É o que faltava em <b>${esc(alvo.titulo)}</b>: já marquei como feito e anexei ao chamado. Obrigado!`);
          return;
        }
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
    box.send = send;
    return box;
  }

  // Qual pendência de envio o arquivo resolve: a que tiver mais palavras do título no nome do arquivo.
  const semAcento = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function casaPendencia(nome) {
    const n = semAcento(nome);
    let best = null, nota = 0;
    doCliente().filter((t) => /enviar|devolver/i.test(t.titulo)).forEach((t) => {
      const pts = semAcento(t.titulo).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !/^(enviar|devolver)$/.test(w) && n.includes(w)).length;
      if (pts > nota) { best = t; nota = pts; }
    });
    return best ? findTask(best.id) : null;
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
    if (ROLE === "c" && t.includes("ajuda")) {
      return `Claro, ${esc(S.cliente.contato)}! Eu consigo:\n• <b>Receber documentos</b> (lei, foto do formulário, planilha) e dar baixa na pendência certa\n• <b>Mostrar os vídeos de validação</b> pra você aprovar ou pedir ajuste\n• <b>Alterar um formulário</b>: é só dizer o que muda, por texto ou áudio\n• <b>Cadastrar sua equipe</b> mandando o link no WhatsApp\n• <b>Contar o próximo passo</b>, os prazos e a data do go-live\n• <b>Confirmar ou remarcar</b> uma reunião\n• <b>Abrir um chamado</b> com qualquer dúvida\n\nClique num atalho ao lado ou me escreva aqui.`;
    }
    if (ROLE === "i") {
      if (t.includes("resumo")) {
        const c = S.cliente;
        const txt = `${c.contato}, a implantação está ${entrega()}% entregue. ${(() => { const n = S.validacoes.filter((v) => v.status === "aprovado").length; return n === 1 ? "1 formulário já aprovado" : `${n} formulários já aprovados`; })()}, ${vidsPend().length === 1 ? "1 vídeo esperando vocês" : `${vidsPend().length} vídeos esperando vocês`} e ${semResposta().length === 1 ? "1 pendência atrasada" : `${semResposta().length} pendências atrasadas`} (${semResposta()[0] ? semResposta()[0].titulo.toLowerCase() : "nenhuma"}). Go-live em ${dia(c.meta + "T09:00")}. Painel: ${PAINEL_URL}#/c/inicio`;
        return `Pronto pra mandar no WhatsApp:\n\n“${esc(txt)}”\n\n${botaoWhats(txt)}`;
      }
      if (t.includes("cobr") || t.includes("penden")) {
        const s = semResposta();
        s.forEach((x) => { findTask(x.id).fupEm = isoNow(); log("prazo", `FUP no WhatsApp: "${x.titulo}" está atrasada desde ${dia(x.data)}`); });
        save();
        const fup = `Oi, ${S.cliente.contato}! Aqui é o assistente da Aprova. Estão em aberto: ${s.map((x) => `${x.titulo} (desde ${dia(x.data)})`).join("; ")}. Pode mandar aqui mesmo, foto ou áudio servem 🙂`;
        return s.length ? `Preparei o FUP de <b>${s.length}</b> pendência${s.length > 1 ? "s" : ""}. Se não responderem em 48h, te aviso.\n\n${botaoWhats(fup)}` : "Nada atrasado na prefeitura agora.";
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
  // Botões do vídeo. No computador ficam numa linha acima do chat; no celular viram círculos na lateral
  // direita, com o nome embaixo (o .ac é o círculo, o span é o nome). As cores são as mesmas nos dois.
  function slideActs(v) {
    const b = (cls, attr, ic, nome, curto = nome) => `<button class="act ${cls}" ${attr} aria-label="${nome}"><i class="ac">${I[ic]}</i><span class="lbl" data-m="${curto}">${nome}</span></button>`;
    return ROLE === "c"
      ? b("ok", 'data-act="ok"', "check", "Aprovar") + b("no", 'data-act="no"', "x", "Ajustar") + b("cal", 'data-act="cal" title="Agendar conversa"', "cal", "Agendar conversa", "Agendar")
      : b("cal wide", 'data-act="zap"', "whatsapp", "Reenviar no WhatsApp", "Reenviar") +
        (v.status === "reprovado" || v.status === "ajuste" ? b("ok", `data-revisar="${v.id}"`, "bolt", "Verificar alteração", "Verificar") : "");
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
        placeholder: "O que precisa mudar?",
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
  // A pessoa escolhe o dia e o horário da reunião (não há mais horários sugeridos).
  function showSlots(sl, onPick, { titulo = "Agendar conversa", botao = "Solicitar reunião" } = {}) {
    const old = $(".slots", sl);
    if (old) { old.remove(); return; }
    const amanha = new Date(now()); amanha.setDate(amanha.getDate() + 1);
    const box = document.createElement("div");
    box.className = "slots";
    box.innerHTML = `<form class="slot-f"><h5>${titulo}</h5>
      <label><span>Dia</span><input type="date" name="dia" min="${ymd(now())}" value="${ymd(amanha)}" required></label>
      <label><span>Horário</span><input type="time" name="hora" value="10:00" step="900" required></label>
      <p class="slot-err" hidden>Escolha um dia e horário a partir de agora.</p>
      <div class="slot-b"><button type="button" class="btn sm ghost" data-slotx="1">Cancelar</button><button type="submit" class="btn sm">${botao}</button></div></form>`;
    sl.appendChild(box);
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest("[data-slotx]")) box.remove();
    });
    $("form", box).addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.target, iso = `${f.dia.value}T${f.hora.value}`;
      if (!f.dia.value || !f.hora.value || d(iso) < now()) { $(".slot-err", box).hidden = false; return; }
      box.remove();
      onPick(iso);
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
    semInfo();
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
    semInfo();
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
      <form class="dr-redo" hidden><textarea rows="3" placeholder="Explique pro agente o que mudar e aperte Enter. Ex.: a vistoria é do engenheiro, não do fiscal"></textarea><span class="hint">Enter refaz a alteração · Shift+Enter quebra a linha</span><button class="btn sm" type="submit">Refazer alteração</button></form>
      <ol class="steps"></ol><div class="dr-out"></div>`;
    // Enter refaz a alteração; Shift+Enter quebra a linha.
    $(".dr-redo textarea", dr).addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $(".dr-redo", dr).requestSubmit(); }
    });
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
      $(".dr-out", dr).innerHTML = `<p>Vídeo novo do ${esc(v.processo)} no Painel das Validações. Avise a prefeitura no WhatsApp com a mensagem pronta.</p>${botaoWhats(`Oi, ${S.cliente.contato}! Ajustei o ${v.processo} do jeito que vocês pediram. O vídeo novo está aqui pra você conferir e aprovar 👉 ${PAINEL_URL}#/c/validacoes`, "Avisar no WhatsApp")} <button class="btn sm ghost" data-open="${v.id}">Ver o vídeo</button> <button class="btn sm ghost" data-drclose="1">Fechar</button>`;
      refresh();
    };
    step();
  }
  // Automode: o agente executa sozinho, em sequência, todas as tarefas dele na fase ativa.
  let AUTO = false, SEL = null, CUR = null;
  const pendAgente = () => allTasks().filter((t) => t.dono === "agente" && !t.feito).sort((a, b) => d(a.data) - d(b.data));
  function startAuto() {
    const marcadas = SEL ? pendAgente().filter((t) => SEL.has(t.id)) : minhas().filter((t) => t.dono === "agente");
    const fila = marcadas.sort((a, b) => d(a.data) - d(b.data)).map((t) => t.id);
    if (!fila.length) { toast(SEL ? "Selecione pelo menos uma execução." : "Nenhuma tarefa do agente pendente."); return; }
    AUTO = true;
    log("manual", `Automode ligado: o agente vai executar ${fila.length} tarefas sozinho`);
    save(); refresh();
    let i = 0;
    const next = () => {
      if (!AUTO) return;
      if (i >= fila.length) {
        AUTO = false; CUR = null;
        log("manual", `Automode concluiu ${fila.length} tarefas`);
        save(); refresh();
        toast(`Automode: o agente concluiu ${fila.length} tarefas.`);
        return;
      }
      const id = fila[i++];
      CUR = id;
      refresh();
      runAgent(id, next, { i, n: fila.length });
    };
    next();
  }
  function stopAuto() {
    AUTO = false; CUR = null;
    clearTimeout(runT);
    refresh();
    toast("Automode desligado. O agente parou.");
  }
  const autoBtn = () => `<button class="auto ${AUTO ? "on" : ""}" data-auto="1" aria-pressed="${AUTO}"><span class="sw"></span><b>Automode</b><small>${AUTO ? "executando…" : "o agente faz sozinho"}</small></button>`;
  // A lateral passa a mostrar outra coisa (execução do agente): deixa de ser um detalhe de indicador.
  function semInfo() {
    INFO = null;
    const sc = $("#scrim");
    sc.classList.remove("on");
    sc.hidden = true;
  }
  function closeDrawer() {
    semInfo();
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
    const wa = el("[data-wa]");
    if (wa) { abrirWhats(wa.dataset.wa); return; }
    let x;
    if ((x = el("[data-preview]"))) {
      try { sessionStorage.setItem("timao-prev", "1"); } catch (er) {}
      EDIT = x.dataset.preview === "edit";
      if (location.hash === "#/c/inicio") render(); else go("c", "inicio");
      return;
    }
    if (el("[data-edit]")) { EDIT = true; render(); return; }
    if (el("[data-edclose]")) { EDIT = false; render(); return; }
    if (el("[data-back]")) { EDIT = false; try { sessionStorage.removeItem("timao-prev"); } catch (er) {} go("i", "visao"); return; }
    const editou = (msg) => { log("painel", msg); save(); toast("Painel do cliente atualizado."); refresh(); };
    if ((x = el("[data-bloco]"))) {
      const k = x.dataset.bloco, nome = BLOCOS.find((b) => b[0] === k)[1];
      PN().blocos[k] = !PN().blocos[k];
      editou(`Implantadora ${PN().blocos[k] ? "mostrou" : "escondeu"} "${nome}" no painel da prefeitura`);
      return;
    }
    if ((x = el("[data-ocultar]"))) {
      const id = x.dataset.ocultar, t = findTask(id), o = PN().ocultas;
      PN().ocultas = o.includes(id) ? o.filter((y) => y !== id) : [...o, id];
      editou(`Tarefa "${t.titulo}" ${PN().ocultas.includes(id) ? "escondida do" : "visível no"} painel da prefeitura`);
      return;
    }
    if ((x = el("[data-delaviso]"))) {
      const a = PN().avisos.find((y) => y.id === x.dataset.delaviso);
      PN().avisos = PN().avisos.filter((y) => y !== a);
      editou(`Aviso "${a.titulo}" removido do painel da prefeitura`);
      return;
    }
    if ((x = el("[data-dellink]"))) {
      const l = PN().links.find((y) => y.id === x.dataset.dellink);
      PN().links = PN().links.filter((y) => y !== l);
      editou(`Link "${l.titulo}" removido do painel da prefeitura`);
      return;
    }
    // Player: a caixa de agendar fecha com qualquer clique fora dela (o botão do calendário já
    // abre e fecha sozinho). Clicar fora do vídeo (no fundo, fora dos botões e do chat) fecha o
    // player; com a caixa aberta, esse primeiro clique fecha só a caixa.
    if (!$("#player").hidden) {
      const caixa = $("#player .slots");
      const fundo = e.target.id === "player" || e.target.matches("#reel, .slide, .stage, .vidwrap, .stage .who");
      if (caixa && !e.target.closest('[data-act="cal"]')) { caixa.remove(); if (fundo) return; }
      else if (fundo) { closePlayer(); return; }
    }
    if (e.target.id === "scrim") { closeDrawer(); return; }
    if (el("[data-ajuda]")) {
      AJUDA = true;
      if (PAGE === "inicio") refresh(); else go("c", "inicio");
      return;
    }
    if ((x = el("[data-calmes]"))) {
      const n = new Date(CAL.y, CAL.m + Number(x.dataset.calmes), 1);
      CAL.y = n.getFullYear(); CAL.m = n.getMonth();
      refresh();
      return;
    }
    if (el("[data-calhoje]")) { CAL = null; refresh(); return; }
    if ((x = el("[data-caldia]"))) {
      // Dia de outro mês na grade: o calendário vai pra esse mês. O dia abre no modal.
      const s = d(x.dataset.caldia + "T12:00");
      CAL = { y: s.getFullYear(), m: s.getMonth(), sel: x.dataset.caldia };
      refresh();
      openDia(x.dataset.caldia);
      return;
    }
    if (e.target.id === "modal" || el("[data-mdclose]")) { closeModal(); return; }
    // A aba Validações da prefeitura sempre abre no que está "Aguardando você".
    if (el('a[href="#/c/validacoes"]')) { filtro = "pendente"; if (location.hash === "#/c/validacoes") refresh(); }
    if ((x = el("[data-kpi]"))) {
      // No implantador, "Com a prefeitura" leva à fila; o resto abre o detalhe na lateral.
      if (x.dataset.kpi === "pend" && ROLE === "i") { go("i", "fila"); return; }
      openInfo(x.dataset.kpi);
      return;
    }
    if ((x = el("[data-run]"))) { runAgent(x.dataset.run); return; }
    if ((x = el("[data-sel]"))) {
      SEL[x.checked ? "add" : "delete"](x.dataset.sel);
      refresh();
      return;
    }
    if ((x = el("[data-selall]"))) {
      SEL = new Set(x.dataset.selall === "1" ? pendAgente().map((t) => t.id) : []);
      refresh();
      return;
    }
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
      abrirWhats(`Oi, ${S.cliente.contato}! Aqui é o assistente da Aprova. Ainda falta "${t.titulo}" (o prazo era ${dia(t.data)}). Sem isso a implantação trava nesse ponto. Pode mandar aqui mesmo, foto ou áudio servem 🙂`);
      save(); toast("FUP aberto no seu WhatsApp."); refresh();
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
      }, { titulo: "Remarcar reunião", botao: "Remarcar" });
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
      abrirWhats(`Oi! Aqui é o assistente da Aprova. Pra você ter acesso ao sistema novo de processos de ${S.cliente.nome.replace("Prefeitura de ", "")}, preenche esse cadastro rapidinho (1 min): ${PAINEL_URL}#/c/equipe`);
      save(); toast("Convite aberto no seu WhatsApp.");
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
      if (x.dataset.act === "zap") {
        log("whatsapp", `Link do vídeo do ${v.processo} reenviado no WhatsApp da prefeitura`);
        abrirWhats(`Oi, ${S.cliente.contato}! O formulário de ${v.processo} está pronto pra você conferir: ${v.alteracoes.length} mudanças, menos de 20 segundos. Se estiver ok, é só tocar em Aprovar 👉 ${PAINEL_URL}#/c/validacoes`);
        save(); toast("Mensagem aberta no seu WhatsApp.");
      }
      if (x.dataset.act === "cal") showSlots(sl, (iso) => {
        S.reunioes.push({ id: "r" + Date.now(), titulo: `Conversa rápida · ${v.processo}`, data: iso, secretaria: v.secretaria, status: "agendada", confirmacao: "Agente confirma no WhatsApp um dia antes", pauta: [`Dúvidas sobre o vídeo do ${v.processo}`, ...v.alteracoes] });
        log("agenda", `Conversa de 15 min sobre o ${v.processo} agendada para ${dia(iso)} às ${hora(iso)}. Pauta montada com as alterações do vídeo`);
        save(); toast(`Reunião solicitada para ${dia(iso)} às ${hora(iso)}. Convite enviado no WhatsApp.`);
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
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-add]");
    if (!f) return;
    e.preventDefault();
    const v = Object.fromEntries(new FormData(f));
    if (f.dataset.add === "aviso") PN().avisos.push({ id: "a" + Date.now(), titulo: v.titulo.trim(), texto: v.texto.trim() });
    else PN().links.push({ id: "l" + Date.now(), titulo: v.titulo.trim(), url: v.url.trim() });
    log("painel", `${f.dataset.add === "aviso" ? "Aviso" : "Link"} "${v.titulo.trim()}" publicado no painel da prefeitura`);
    save(); toast("Publicado no painel do cliente."); refresh();
  });
  $("#closePlayer").addEventListener("click", closePlayer);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (EDIT && $("#player").hidden && $("#drawer").hidden) { EDIT = false; render(); return; }
    if (!$("#modal").hidden) closeModal();
    else if (!$("#player").hidden) closePlayer();
    else if (!$("#drawer").hidden) closeDrawer();
  });
  $("#reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = JSON.parse(JSON.stringify(window.DATA));
    render();
    toast("Demo reiniciada.");
  });
  window.addEventListener("hashchange", () => {
    parseHash();
    if (ROLE === "c" && PAGE === "validacoes") filtro = "pendente";
    if (CAL && CAL.open) closeModal();
    render();
    window.scrollTo(0, 0);
  });

  // ---------- início ----------
  document.body.insertAdjacentHTML("beforeend", '<div class="scrim" id="scrim" hidden></div><div class="modal" id="modal" hidden><div class="modal-card" role="dialog" aria-modal="true" aria-label="O que tem neste dia"></div></div>');
  parseHash();
  if (ROLE === "c" && PAGE === "validacoes") filtro = "pendente";
  if (!location.hash) history.replaceState(null, "", `#/${ROLE}/${PAGE}`);
  render();
  tickSync();
  setInterval(tickSync, 1000);
})();
