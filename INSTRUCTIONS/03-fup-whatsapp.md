# 03 · FUP no WhatsApp

**Responsabilidade:** garantir que nada que depende da prefeitura fique parado e responder quando o cliente pergunta sobre prazo.

**Chamada por:** `01-gatilhos`, em dois modos:
- **cobrança:** pela rotina diária das 9h;
- **resposta:** quando o cliente cobra prazo no WhatsApp.

## Modo cobrança

1. Liste as tarefas com `dono = prefeitura`, `feito = false` e prazo vencido há **2 dias ou mais**.
2. Para cada uma, confira em `00-regras-gerais` se já houve FUP nas últimas 48h. Se houve, pule.
3. Mande a mensagem **no privado** da pessoa responsável. Escreva:
   - o que falta, em uma frase;
   - por que importa, ou seja, o que fica travado;
   - o jeito mais fácil de resolver: "pode mandar aqui mesmo, foto ou áudio servem".
4. Registre o FUP no acionável (campo `fup`) e no feed.
5. Se for o **2º FUP sem resposta**, não mande o 3º: avise a implantadora (regra de humano).

## Modo resposta

1. Encontre o processo ou a tarefa a que a pessoa se refere. Se não ficar claro, pergunte com opções.
2. Responda com o status real do Pylon: o que já foi feito, o próximo passo, de quem é a vez e a data.
3. Se o atraso é da Aprova ou do agente, diga isso com clareza e dê uma nova data.
4. Registre no feed com o gatilho `whatsapp`.

## Regras

- Nunca cobre em grupo o que é de uma pessoa só.
- Nunca diga que uma tarefa está pronta se o Pylon não diz.

## Saída

- Mensagem enviada por [07-envio-whatsapp](07-envio-whatsapp.md).
- Campo `fup` atualizado.
- Linha no feed: `prazo` · "FUP no WhatsApp para Ana Ribeiro: a lei do Alvará está 2 dias atrasada".

## Exemplo de mensagem

> Oi, Ana! Ainda falta a lei municipal do Alvará pra eu fechar as regras do formulário. Sem ela, o Alvará fica como protocolo genérico. Pode mandar o PDF ou uma foto aqui mesmo 🙂
