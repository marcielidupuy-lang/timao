# 07 · Envio no WhatsApp

**Responsabilidade:** levar até o WhatsApp da prefeitura a mensagem que as outras instruções escreveram. Esta instrução não decide o texto: ela só entrega, respeita os limites e registra.

**Chamada por:** qualquer instrução que precise mandar mensagem:
- `03-fup-whatsapp`: cobrança de pendência e resposta sobre prazo;
- `04-videos-validacao`: link do vídeo novo e reenvio do link;
- `06-cadastro-usuarios`: link de cadastro;
- a implantadora, pelo painel: resumo para o secretário e cobrança de pendências do ai.aprova.

## Como a mensagem sai

1. A instrução que chamou entrega o **texto pronto** e uma descrição curta do que ele é (ex.: "link do vídeo do Habite-se").
2. O painel manda o texto para o **bot** (pasta `bot/`), com a senha do bot.
3. O bot está conectado a um **número de teste** pelo QR code, como o WhatsApp Web, e envia a mensagem.
4. O painel mostra "Enviado no WhatsApp da prefeitura: …" e deixa uma linha no feed `atividade` com o gatilho `whatsapp`.

## Regras

- O bot só envia para o **número da demo**, fixo no servidor (`DESTINO`). Não existe envio para um número que venha de fora.
- Sem a senha certa, o bot recusa o envio.
- No máximo **1 mensagem a cada 3 segundos** e **40 por hora**. Isso vale além dos limites de horário e de FUP de `00-regras-gerais`.
- Use um **número de teste**, nunca o pessoal: a conexão por QR não é a API oficial e o WhatsApp pode bloquear o número.
- Se o bot estiver desligado ou recusar, o painel avisa "Não consegui enviar pelo bot" e **nada é marcado como enviado**.

## Estado atual

- O bot está pronto no repositório, mas **ainda não foi conectado** a um número.
- Enquanto não houver bot configurado, a demo **não envia nada**: cada botão de WhatsApp só mostra o aviso do que seria enviado.
- O texto de cada mensagem já é montado, então ligar o envio de verdade não muda nenhuma outra instrução.

## Saída

- Mensagem entregue no WhatsApp do número da demo (com o bot ligado) ou aviso na tela (sem o bot).
- Linha no feed: `whatsapp` · "Enviado no WhatsApp da prefeitura: link do vídeo do Habite-se".

## Próximo passo (produção)

Trocar o bot por QR pela **API oficial do WhatsApp (Cloud API da Meta)**: número verificado, modelos de mensagem aprovados para quem não falou com a Aprova nas últimas 24h e envio para o contato de cada pessoa da prefeitura, não só para o número da demo.
