# Bot de WhatsApp do Timão

Servidor pequeno que conecta um número de WhatsApp de teste pelo QR code (biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys)) e envia as mensagens prontas do painel. A regra de envio está em [INSTRUCTIONS/07-envio-whatsapp](../INSTRUCTIONS/07-envio-whatsapp.md).

**Estado:** pronto, ainda não conectado a um número.

## Rodar

```bash
npm install
npm start
```

1. Abra `http://localhost:3333/qr` e escaneie com o WhatsApp do número de teste.
2. Abra no navegador da demo o link de configuração que aparece no terminal (`...?bot=http%3A%2F%2Flocalhost%3A3333&token=...`).
3. Os botões de WhatsApp do painel passam a enviar de verdade. `?bot=off` desliga.

## Endpoints

| Método e caminho | O que faz |
|---|---|
| `GET /status` | `{ conectado, destino }` |
| `GET /qr` | Página com o QR para conectar o número |
| `POST /enviar` | Corpo `{ "texto": "..." }`, cabeçalho `x-token`. Envia para o número da demo |

## Variáveis

| Variável | Padrão | Para quê |
|---|---|---|
| `DESTINO` | `554599967324` | Único número que recebe as mensagens |
| `PORT` | `3333` | Porta do servidor |
| `TOKEN` | gerada em `auth/token.txt` | Senha que o painel manda no `x-token` |
| `PAINEL` | site publicado | Base do link de configuração |

## Cuidados

- Use um número de teste: a conexão por QR não é a API oficial e o WhatsApp pode bloquear o número.
- A pasta `auth/` guarda a sessão do WhatsApp e a senha. Ela está no `.gitignore` e nunca deve ir para o git.
- Para conectar outro número, apague `auth/` e rode de novo.
