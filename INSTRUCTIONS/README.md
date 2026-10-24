# INSTRUCTIONS · Agente de Implantação

O agente trabalha nos bastidores da implantação. Cada arquivo desta pasta é **uma instrução com uma responsabilidade só**. Um roteador decide qual instrução chamar a partir do evento que chegou.

## Como as instruções são chamadas

```
 EVENTO                                ROTEADOR                 INSTRUÇÃO
 ─────────────────────────────────     ─────────────────        ─────────────────────────────
 Reunião terminou (transcrição)   ──┐                      ┌──▶ 02-acionaveis-reuniao
 Mensagem no WhatsApp do cliente  ──┤                      ├──▶ 03-fup-whatsapp (cobrança de prazo)
 Novidade em chamado (Pylon)      ──┼──▶ 01-gatilhos  ─────┼──▶ 04-videos-validacao
 Rotina diária 9h                 ──┤                      ├──▶ 05-champions
 Ação no painel (✓ ✗ 📅, ai.aprova) ┘                      └──▶ 06-cadastro-usuarios

 Todas seguem 00-regras-gerais (tom, canais, limites e quando chamar um humano).
 Toda mensagem de WhatsApp sai por 07-envio-whatsapp (o bot da pasta bot/).
```

## Mapa de responsabilidades

| Arquivo | Responsabilidade | Disparada por | O que entrega |
|---|---|---|---|
| [00-regras-gerais](00-regras-gerais.md) | Tom, canais, limites e passagem para humano | Sempre carregada | Restrições para todas as outras |
| [01-gatilhos](01-gatilhos.md) | Classificar o evento e chamar a instrução certa | Qualquer evento | Qual instrução rodar e com quais dados |
| [02-acionaveis-reuniao](02-acionaveis-reuniao.md) | Transformar reunião em tarefas e tickets preenchidos | Fim de reunião | Acionáveis com dono e prazo, tickets preenchidos |
| [03-fup-whatsapp](03-fup-whatsapp.md) | Cobrar o que depende da prefeitura e responder sobre prazos | Rotina diária e mensagem cobrando prazo | Mensagem no WhatsApp e registro no Pylon |
| [04-videos-validacao](04-videos-validacao.md) | Gerar o vídeo de cada ajuste e tratar ✓ ✗ 📅 | Ajuste concluído em chamado e ação no painel | Vídeo no painel, link no WhatsApp, ticket atualizado |
| [05-champions](05-champions.md) | Primeiro contato com a secretaria: quem é quem, agenda, pauta e confirmação | Nova secretaria na fase | Champion identificado e reunião agendada com pauta |
| [06-cadastro-usuarios](06-cadastro-usuarios.md) | Enviar o link de cadastro e cadastrar no prefeitura.aprova | Lista de usuários e formulário preenchido | Usuários cadastrados e status no painel |
| [07-envio-whatsapp](07-envio-whatsapp.md) | Entregar no WhatsApp a mensagem que as outras escreveram, com limites | 03, 04, 06 e botões de WhatsApp do painel | Mensagem enviada pelo bot (ou aviso na demo) e linha no feed |

## Onde cada instrução escreve

Tudo vai para o **Pylon**, a fonte da verdade. O painel lê de lá. Na demo, o estado é o `data.js`:

| Campo em `data.js` | Quem escreve |
|---|---|
| `fases[].tasks` | 02, 03 e 05 |
| `reunioes` | 02 e 05 |
| `validacoes` | 04 |
| `usuarios` | 06 |
| `atividade` (feed "Agente em ação") | Todas: cada ação deixa uma linha com o gatilho |

## Por que separar assim

- **Uma responsabilidade por arquivo:** dá para ler, testar e trocar cada parte sem mexer nas outras.
- **Roteador explícito:** o jurado e o implantador conseguem ver por que o agente fez o que fez, porque o gatilho aparece no feed.
- **Código clássico onde não precisa de IA:** horário, contagem de dias, agenda e cadastro são regras fixas. O agente decide o texto e interpreta o que o cliente mandou.
