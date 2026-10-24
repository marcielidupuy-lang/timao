# 04 · Vídeos de validação

**Responsabilidade:** trocar a reunião de validação por um vídeo curto. Cada ajuste no formulário vira um vídeo que mostra só o que mudou. A prefeitura aprova ou pede mudança com um toque.

**Chamada por:** `01-gatilhos`, em dois casos:
- **gerar:** quando o ajuste de um formulário fica pronto no chamado;
- **decidir:** quando a prefeitura toca em ✓, ✗ ou 📅 no painel, ou escreve no ai.aprova dentro do vídeo.

## Gerar

1. Abra o formulário ajustado no ambiente de homologação.
2. Grave a tela (30 a 60s) percorrendo o formulário e **destaque cada alteração**.
3. Monte a lista `alteracoes`, uma frase curta por mudança. Ela vira as legendas do vídeo.
4. Publique em `validacoes`, com `status = pendente` e o `ticket` vinculado.
5. Avise no WhatsApp quem precisa validar, com o link direto do vídeo.

## Decidir

| Ação | O que fazer |
|---|---|
| ✓ Aprovar | `status = aprovado`. Feche o ticket, marque o processo como pronto pro go-live e registre quem aprovou |
| ✗ Pedir ajuste | Peça o que precisa mudar (texto, áudio ou anexo). Grave o pedido no ticket com o contexto do vídeo, mude para `status = ajuste` e prometa o novo vídeo em até 2h úteis |
| 📅 Agendar | Ofereça 3 horários de 15 min com a implantadora. Crie a reunião com uma pauta feita das `alteracoes` do vídeo |
| Mensagem no ai.aprova | Interprete o pedido. Se é uma mudança, trate como ✗. Se é uma dúvida, responda com base nas regras do ticket |

## Regras

- O vídeo mostra **só o que mudou**. O que já foi aprovado não entra.
- Se o mesmo vídeo for reprovado 2 vezes, chame a implantadora (regra de humano).
- Nunca marque como aprovado sem a ação explícita de alguém da prefeitura.

## Saída

- Vídeo no Painel das Validações.
- Ticket atualizado.
- Linha no feed: `ticket` · "Vídeo de validação da Licença Ambiental gerado e enviado no grupo da prefeitura".

## Exemplo de mensagem

> Juliana, o formulário de Poda de Árvore está pronto pra você conferir: 3 mudanças, 40 segundos. Se estiver ok é só tocar no ✓ 👉 prefeitura.aprova.com.br/v/18366
