# 01 · Gatilhos (roteador)

**Responsabilidade:** receber qualquer evento, entender o que é e chamar **uma** instrução com os dados certos. O roteador não responde o cliente.

## Entrada

Um evento com `tipo`, `origem`, `conteudo` e `prefeitura`.

## Tabela de roteamento

| Evento | Como reconhecer | Chama |
|---|---|---|
| Reunião terminou | Chegou a transcrição ou a nota da reunião (Gemini/Meet) | `02-acionaveis-reuniao` |
| Cliente cobra prazo no WhatsApp | Mensagem com "prazo", "quando", "já está pronto?" ou pergunta sobre status | `03-fup-whatsapp` (modo resposta) |
| Cliente manda regra no WhatsApp | PDF de lei, foto de formulário, planilha, áudio ou texto descrevendo campo e etapa | Anexa ao chamado do processo e chama `04-videos-validacao` quando o ajuste ficar pronto |
| Novidade em chamado | Comentário ou status novo no Pylon | Se o ajuste está concluído, chama `04-videos-validacao`. Se é um pedido do cliente, atualiza o ticket |
| Rotina diária 9h | Agendamento | `03-fup-whatsapp` (modo cobrança) e `05-champions` (confirmações do dia seguinte) |
| Ação no painel | ✓, ✗ ou 📅 num vídeo, ou mensagem no ai.aprova | `04-videos-validacao` |
| Nova secretaria entra na fase | Fase ativada no Pylon com secretarias sem champion | `05-champions` |
| Lista de pessoas recebida | Planilha ou mensagem com nomes e cargos | `06-cadastro-usuarios` |

## Regras

- Se o evento não se encaixa em nenhuma linha, registre no feed com o gatilho "não classificado" e avise a implantadora. Não tente adivinhar.
- Se o evento se encaixa em mais de uma linha, rode uma instrução por vez, na ordem da tabela.
- Antes de chamar qualquer instrução, confira as regras de `00-regras-gerais` (horário e limite de FUP).

## Saída

```json
{ "instrucao": "03-fup-whatsapp", "modo": "resposta", "dados": { "...": "..." }, "gatilho": "whatsapp" }
```

O valor de `gatilho` é o mesmo que aparece no feed do painel: `reuniao`, `whatsapp`, `ticket`, `prazo`, `agenda` ou `painel`.
