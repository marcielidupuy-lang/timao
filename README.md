# Timão · Painel de Implantação

**Desafio escolhido:** Implantação. Como coletar e validar as regras de negócio de cerca de 100 processos por prefeitura sem depender de reunião?

**Demo:** https://marcielidupuy-lang.github.io/timao/

## O problema

- Muitas reuniões, e muito tempo gasto em cada uma.
- Contratos de prefeitura toda não cabem no prazo de implantação.
- Cada implantador consegue tocar no máximo 4 implantações ao mesmo tempo.

## A solução

Um painel único da implantação, com um agente que trabalha nos bastidores e conversa pelo WhatsApp.

**O que o painel mostra**
- Dados do cliente e status da implantação, com indicadores: o que aguarda a prefeitura, % entregue, horas de reunião evitadas e dias para o go-live.
- Fases, com as tarefas previstas e pendentes. Tarefas atrasadas aparecem em vermelho.
- Reuniões e seus acionáveis. A pauta das próximas reuniões é montada pelo agente.
- **Painel das Validações:** cada ajuste feito pelo agente vira um vídeo curto. A prefeitura aprova (✓), pede ajuste (✗) ou agenda uma conversa (📅) ali mesmo. No celular, os vídeos aparecem em formato de reel.
- **ai.aprova:** o cliente pede mudanças por texto, áudio ou anexo (lei, foto de formulário, planilha), direto no vídeo.
- Usuários da prefeitura: o agente envia o link de cadastro e cadastra quem preencheu.
- Tudo é sincronizado com o Pylon.

**O que o agente faz** (gatilhos: fim de reunião, cobrança no WhatsApp, novidade em chamado)
- Executa os acionáveis da reunião e preenche os tickets.
- Faz FUP no WhatsApp quando uma tarefa da prefeitura passa 2 dias do prazo.
- Gera os vídeos de validação, vincula ao ticket e avisa o cliente.
- Faz o primeiro contato com os champions: identifica quem é quem, agenda a reunião, monta a pauta e confirma um dia antes.
- Cadastra os usuários no prefeitura.aprova.

## Instruções do agente

A pasta [INSTRUCTIONS](INSTRUCTIONS/) tem uma instrução por responsabilidade. O mapa de quem chama o quê está em [INSTRUCTIONS/README.md](INSTRUCTIONS/README.md).

| Instrução | Responsabilidade |
|---|---|
| 00-regras-gerais | Tom, canais, limites e quando chamar um humano |
| 01-gatilhos | Roteador: classifica o evento e chama a instrução certa |
| 02-acionaveis-reuniao | Reunião vira tarefas com dono e prazo e tickets preenchidos |
| 03-fup-whatsapp | Cobra o que está atrasado há 2 dias e responde sobre prazos |
| 04-videos-validacao | Gera o vídeo de cada ajuste e trata ✓ ✗ 📅 |
| 05-champions | Primeiro contato: quem é quem, agenda, pauta e confirmação |
| 06-cadastro-usuarios | Link de cadastro, conferência e cadastro no prefeitura.aprova |

## Indicadores que mexem

| Métrica do desafio | Como o Timão melhora |
|---|---|
| Horas de reunião por processo | Validação por vídeo assíncrono no lugar da call |
| Idas e vindas até a regra estar completa | O pedido de ajuste já vai com contexto para o ticket |
| Tempo para validar um formulário clonado | O vídeo mostra só o que mudou e é aprovado em 1 toque |
| Processos com regra (e não protocolo genérico) | Painel com o que falta e FUP automático |

## Como rodar

É uma página estática, sem build. Abra o `index.html` ou sirva a pasta:

```bash
npx serve .
```

- `data.js` guarda o estado da implantação (dados fictícios).
- `app.js` tem a interface. As respostas do ai.aprova são simuladas na demo.
- Em "Reiniciar demo", no rodapé, o painel volta ao estado inicial.
