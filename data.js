// Estado da implantação. Em produção o agente escreve aqui (via Pylon);
// na demo é um retrato fixo de uma prefeitura fictícia.
window.DATA = {
  cliente: {
    nome: "Prefeitura de Vale Verde",
    uf: "SP",
    contrato: "Prefeitura toda",
    implantador: "Marcieli Dupuy",
    champion: "Ana Ribeiro (Sec. de Obras)",
    inicio: "2026-10-01",
    meta: "2026-11-30",
    secretarias: 12,
    processos: 98,
    pylon: "PYL-4821",
    horasReuniaoEvitadas: 31,
    contato: "Ana",
    saude: "risco"
  },

  // Escopo do contrato: o que a Aprova entrega em cada fase (12 secretarias, 98 processos).
  // status: entregue | andamento | previsto. Passou do prazo sem entregar, a tela mostra como atrasada.
  escopo: {
    f1: [
      { t: "Kickoff e plano de implantação", d: "cronograma, responsáveis e cidade modelo", prazo: "2026-10-09", status: "entregue" },
      { t: "Champions das 12 secretarias", d: "um responsável por secretaria", prazo: "2026-10-14", status: "entregue" },
      { t: "Usuários da Secretaria de Obras", d: "14 analistas com acesso ao prefeitura.aprova", prazo: "2026-10-25", status: "andamento" },
      { t: "Processos da Secretaria de Obras no ar", d: "18 processos: Alvará, Habite-se, Certidão de Uso do Solo…", prazo: "2026-10-30", status: "andamento" },
      { t: "Treinamento da Secretaria de Obras", d: "analistas usando os novos processos", prazo: "2026-10-30", status: "previsto" }
    ],
    f2: [
      { t: "Processos da Fazenda no ar", d: "22 processos: ITBI, Certidão Negativa, Revisão de IPTU…", prazo: "2026-11-10", status: "previsto" },
      { t: "Processos da Saúde e da Educação no ar", d: "24 processos", prazo: "2026-11-14", status: "previsto" },
      { t: "Formulários clonados validados", d: "24 formulários da cidade modelo ajustados e aprovados", prazo: "2026-11-14", status: "previsto" }
    ],
    f3: [
      { t: "Processos das demais secretarias no ar", d: "34 processos em 8 secretarias", prazo: "2026-11-24", status: "previsto" },
      { t: "Treinamento dos analistas", d: "todas as secretarias", prazo: "2026-11-24", status: "previsto" },
      { t: "Go-live da prefeitura toda", d: "98 processos no ar", prazo: "2026-11-30", status: "previsto" }
    ]
  },

  // De onde vêm as horasReuniaoEvitadas (a soma tem que bater).
  evitadas: [
    { t: "Validação por vídeo", d: "6 formulários validados sem call", h: 12 },
    { t: "Regras pelo WhatsApp", d: "leis, fotos e planilhas lidas pelo agente", h: 8 },
    { t: "Champions sem reunião", d: "12 secretarias apresentadas no WhatsApp", h: 6 },
    { t: "Cadastro de usuários por link", d: "sem reunião de levantamento", h: 3 },
    { t: "Pautas e confirmações automáticas", d: "as reuniões que sobraram ficaram mais curtas", h: 2 }
  ],

  // Outras implantações da mesma implantadora (só o resumo, para a carteira).
  carteira: [
    { nome: "Serra Azul", uf: "SP", fase: "Fase 2 · Fazenda e Saúde", pct: 64, atrasadas: 0, videos: 2, ajustes: 0, proxima: "2026-10-27T14:00", saude: "ok" },
    { nome: "Porto Claro", uf: "PR", fase: "Fase 1 · Obras", pct: 38, atrasadas: 3, videos: 5, ajustes: 2, proxima: "2026-10-29T09:30", saude: "risco" },
    { nome: "Rio Fundo", uf: "MG", fase: "Kickoff", pct: 12, atrasadas: 1, videos: 0, ajustes: 0, proxima: "2026-10-25T10:00", saude: "atencao" }
  ],

  fases: [
    {
      id: "f1",
      nome: "Fase 1",
      descricao: "Kickoff, champions e processos da Secretaria de Obras",
      status: "ativa",
      tasks: [
        { id: "t1", titulo: "Reunião de Implantação · Fase 1", data: "2026-10-09T09:00", dono: "aprova", feito: true },
        { id: "t2", titulo: "Identificar champions das 12 secretarias", data: "2026-10-14T17:00", dono: "agente", feito: true },
        { id: "t3", titulo: "Enviar lei municipal do Alvará (PDF)", data: "2026-10-22T14:00", dono: "prefeitura", feito: false, ticket: "#18342" },
        { id: "t4", titulo: "Validar vídeo do Habite-se", data: "2026-10-23T17:00", dono: "prefeitura", feito: true, ticket: "#18310" },
        { id: "t5", titulo: "Devolver planilha de usuários da Sec. de Obras", data: "2026-10-25T12:00", dono: "prefeitura", feito: false },
        { id: "t6", titulo: "Ajustar formulário de Protocolo Geral", data: "2026-10-26T18:00", dono: "agente", feito: false, ticket: "#18355" },
        { id: "t12", titulo: "Preencher ticket da Certidão de Uso do Solo com as regras da reunião", data: "2026-10-25T10:00", dono: "agente", feito: false, ticket: "#18361" },
        { id: "t13", titulo: "Cadastrar 14 analistas de Obras no prefeitura.aprova", data: "2026-10-25T16:00", dono: "agente", feito: false },
        { id: "t14", titulo: "Montar pauta da reunião com a Fazenda", data: "2026-10-26T12:00", dono: "agente", feito: false },
        { id: "t15", titulo: "Confirmar reunião com a Fazenda no WhatsApp", data: "2026-10-27T09:00", dono: "agente", feito: false },
        { id: "t16", titulo: "Ajustar formulário de Poda de Árvore com a foto obrigatória", data: "2026-10-27T15:00", dono: "agente", feito: false, ticket: "#18366" },
        { id: "t17", titulo: "Revisar com a Ana as regras do Alvará antes do go-live", data: "2026-10-28T11:00", dono: "aprova", feito: false, ticket: "#18342" },
        { id: "t18", titulo: "Treinar analistas de Obras no novo Habite-se", data: "2026-10-30T14:00", dono: "aprova", feito: false }
      ]
    },
    {
      id: "f2",
      nome: "Fase 2",
      descricao: "Fazenda, Saúde e Educação",
      status: "futura",
      tasks: [
        { id: "t7", titulo: "Reunião de Alinhamento · Fase 2", data: "2026-11-04T11:00", dono: "aprova", feito: false },
        { id: "t8", titulo: "Coletar regras da Secretaria da Fazenda", data: "2026-11-10T16:30", dono: "agente", feito: false },
        { id: "t9", titulo: "Validar 24 formulários clonados", data: "2026-11-14T17:00", dono: "prefeitura", feito: false }
      ]
    },
    {
      id: "f3",
      nome: "Fase 3",
      descricao: "Demais secretarias e treinamento",
      status: "futura",
      tasks: [
        { id: "t10", titulo: "Treinamento dos analistas", data: "2026-11-24T09:00", dono: "aprova", feito: false },
        { id: "t11", titulo: "Go-live da prefeitura toda", data: "2026-11-30T09:00", dono: "aprova", feito: false }
      ]
    }
  ],

  reunioes: [
    {
      id: "r1",
      titulo: "Reunião de Implantação · Fase 1",
      data: "2026-10-09T09:00",
      secretaria: "Obras e Urbanismo",
      status: "realizada",
      duracao: 45,
      acionaveis: [
        { texto: "Preencher ticket #18310 com as regras do Habite-se", dono: "agente", status: "feito" },
        { texto: "Enviar lei municipal do Alvará", dono: "prefeitura", status: "atrasado", fup: "FUP enviado no WhatsApp em 24/10" },
        { texto: "Gerar vídeo de validação do Habite-se", dono: "agente", status: "feito" },
        { texto: "Cadastrar 14 analistas de Obras", dono: "agente", status: "andamento" }
      ]
    },
    {
      id: "r2",
      titulo: "Primeiro contato · Secretaria da Fazenda",
      data: "2026-10-28T10:00",
      secretaria: "Fazenda",
      status: "agendada",
      confirmacao: "Agente confirma no WhatsApp em 27/10",
      pauta: [
        "Quem é quem: champion e analistas da Fazenda",
        "Processos prioritários: ITBI, Certidão Negativa, Revisão de IPTU",
        "Documentos que já existem (leis, formulários, planilhas)",
        "Como vai funcionar a validação por vídeo"
      ]
    }
  ],

  validacoes: [
    {
      id: "v1",
      processo: "Habite-se",
      secretaria: "Obras",
      status: "aprovado",
      ticket: "#18310",
      gerado: "2026-10-22T16:10",
      alteracoes: [
        "Campo novo: matrícula do imóvel",
        "Anexo obrigatório: ART do responsável técnico",
        "Taxa calculada pela área construída"
      ],
      comentario: "Aprovado pela Ana Ribeiro em 23/10"
    },
    {
      id: "v2",
      processo: "Alvará de Construção",
      secretaria: "Obras",
      status: "reprovado",
      ticket: "#18342",
      gerado: "2026-10-23T11:40",
      alteracoes: [
        "Etapa de análise por engenheiro",
        "Prazo de resposta: 15 dias úteis",
        "Campo novo: uso do imóvel"
      ],
      comentario: "Falta a etapa de vistoria antes da emissão"
    },
    {
      id: "v3",
      processo: "Protocolo Geral",
      secretaria: "Administração",
      status: "reprovado",
      ticket: "#18355",
      gerado: "2026-10-23T15:05",
      alteracoes: [
        "Assunto vira lista fechada",
        "Encaminhamento automático por assunto",
        "CPF validado na abertura"
      ],
      comentario: "Incluir assunto 'Ouvidoria'"
    },
    {
      id: "v4",
      processo: "Certidão de Uso do Solo",
      secretaria: "Obras",
      status: "pendente",
      ticket: "#18361",
      gerado: "2026-10-24T09:20",
      alteracoes: [
        "Consulta automática ao zoneamento",
        "Certidão emitida com QR code",
        "Campo novo: inscrição imobiliária"
      ]
    },
    {
      id: "v5",
      processo: "Poda de Árvore",
      secretaria: "Meio Ambiente",
      status: "pendente",
      ticket: "#18366",
      gerado: "2026-10-24T10:45",
      alteracoes: [
        "Foto da árvore obrigatória",
        "Localização pelo mapa",
        "Vistoria agendada pelo fiscal"
      ]
    },
    {
      id: "v6",
      processo: "Licença Ambiental Simplificada",
      secretaria: "Meio Ambiente",
      status: "pendente",
      ticket: "#18370",
      gerado: "2026-10-24T11:30",
      alteracoes: [
        "Checklist por tipo de atividade",
        "Parecer técnico em duas etapas",
        "Taxa por porte do empreendimento"
      ]
    }
  ],

  usuarios: [
    { nome: "Ana Ribeiro", cargo: "Secretária de Obras", secretaria: "Obras", status: "cadastrado" },
    { nome: "Carlos Menezes", cargo: "Diretor de Licenciamento", secretaria: "Obras", status: "cadastrado" },
    { nome: "Juliana Prado", cargo: "Analista", secretaria: "Obras", status: "preenchido" },
    { nome: "Rafael Souza", cargo: "Engenheiro", secretaria: "Obras", status: "link-enviado" },
    { nome: "Beatriz Lima", cargo: "Secretária da Fazenda", secretaria: "Fazenda", status: "link-enviado" },
    { nome: "Marcos Tavares", cargo: "Fiscal Ambiental", secretaria: "Meio Ambiente", status: "preenchido" }
  ],

  atividade: [
    { hora: "2026-10-24T11:58", gatilho: "prazo", texto: "FUP no WhatsApp para Ana Ribeiro: a lei do Alvará está 2 dias atrasada" },
    { hora: "2026-10-24T11:30", gatilho: "ticket", texto: "Vídeo de validação da Licença Ambiental gerado e enviado no grupo da prefeitura" },
    { hora: "2026-10-24T10:02", gatilho: "whatsapp", texto: "Beatriz (Fazenda) perguntou do prazo: respondido com o cronograma da Fase 2" },
    { hora: "2026-10-23T18:15", gatilho: "ticket", texto: "Comentário no #18342 virou ajuste: etapa de vistoria no Alvará" },
    { hora: "2026-10-23T09:00", gatilho: "agenda", texto: "Primeiro contato com a Fazenda: champion identificado e reunião agendada para 28/10" },
    { hora: "2026-10-09T10:00", gatilho: "reuniao", texto: "Fim da reunião da Fase 1: 4 acionáveis criados e ticket #18310 preenchido" }
  ]
};
