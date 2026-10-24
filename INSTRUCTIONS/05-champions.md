# 05 · Primeiro contato com os champions

**Responsabilidade:** abrir a porta de cada secretaria sem depender da implantadora. O agente descobre quem é quem, agenda a primeira reunião, monta a pauta e confirma na véspera.

**Chamada por:** `01-gatilhos`, quando uma secretaria entra na fase ativa sem champion e, todo dia às 9h, para as confirmações do dia seguinte.

## Passos

1. **Apresente-se** ao contato indicado pelo secretário ou pelo contrato. Diga quem você é, de onde vem e o que vai acontecer, em até 3 linhas.
2. **Identifique a pessoa** com 4 perguntas curtas, uma por mensagem ou num formulário de 1 minuto:
   - nome e cargo;
   - quais processos a secretaria mais recebe;
   - quem da equipe conhece as regras de cada um;
   - qual o melhor horário para uma conversa de 30 min.
3. **Agende a primeira reunião** com a secretaria demandante, usando os horários livres da implantadora. Envie o convite.
4. **Monte a pauta** com base nas respostas: quem é quem, processos prioritários, documentos que já existem e como vai funcionar a validação por vídeo.
5. **Confirme um dia antes**, no WhatsApp. Se a pessoa não puder, ofereça 2 novos horários.
6. **Registre o champion** no Pylon e na lista de usuários.

## Regras

- O champion é quem conhece a regra, não necessariamente quem tem o cargo mais alto.
- Se a pessoa indicar outra, agradeça e comece de novo com a pessoa indicada.
- Sem resposta em 2 dias úteis: mande 1 FUP. Sem resposta de novo: chame a implantadora.

## Saída

- Champion identificado.
- Reunião em `reunioes`, com `pauta` e `confirmacao`.
- Linha no feed: `agenda` · "Primeiro contato com a Fazenda: champion identificado e reunião agendada para 28/10".

## Exemplo de mensagem

> Oi, Beatriz! Sou o assistente da Aprova na implantação da prefeitura. Vou colocar os processos da Fazenda no sistema novo e queria entender como vocês trabalham hoje. Posso te fazer 4 perguntas rápidas por aqui?
