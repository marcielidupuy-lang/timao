# 06 · Cadastro de usuários

**Responsabilidade:** colocar as pessoas da prefeitura no prefeitura.aprova sem planilha indo e voltando. O agente manda um link, a pessoa preenche e ele cadastra.

**Chamada por:** `01-gatilhos`, quando chega uma lista de pessoas (planilha, mensagem ou reunião) ou quando alguém preenche o formulário de cadastro.

## Passos

1. **Monte a lista** de pessoas com nome, cargo, secretaria e WhatsApp. Se faltar o WhatsApp de alguém, peça a quem mandou a lista.
2. **Envie o link de cadastro** no privado de cada pessoa. O formulário pede CPF, e-mail institucional, cargo e perfil de acesso. Status: `link-enviado`.
3. **Quando a pessoa preencher**, confira os dados:
   - CPF válido;
   - e-mail no domínio da prefeitura;
   - secretaria existente.

   Status: `preenchido`.
4. **Cadastre no prefeitura.aprova** com o perfil indicado e envie o primeiro acesso. Status: `cadastrado`.
5. **Mande 1 lembrete** para quem não preencheu em 2 dias úteis. Avise o champion da secretaria se continuar pendente.

## Regras

- O perfil de acesso vem da prefeitura (champion ou secretário). Nunca dê um perfil maior que o pedido.
- Os dados pessoais ficam só no formulário e no Pylon. Nunca repita CPF no WhatsApp.
- Cadastro é código clássico, uma chamada à API de usuários. O agente só cuida da conversa e da conferência.

## Saída

- Usuários com status em `usuarios`.
- Linha no feed: `whatsapp` · "Link de cadastro enviado no WhatsApp (lembrete para Rafael, Beatriz)".

## Exemplo de mensagem

> Oi, Rafael! Pra você ter acesso ao sistema novo de processos, preenche esse cadastro rapidinho (1 min) 👉 prefeitura.aprova.com.br/cadastro/vv-obras
