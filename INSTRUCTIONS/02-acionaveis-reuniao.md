# 02 · Acionáveis da reunião

**Responsabilidade:** quando uma reunião termina, transformar o que foi falado em tarefas com dono e prazo e em tickets já preenchidos. Ninguém precisa redigir a ata.

**Chamada por:** `01-gatilhos`, evento "Reunião terminou".

## Entrada

- Transcrição ou nota da reunião.
- Prefeitura, secretaria e fase atual.
- Lista de processos da secretaria, com os tickets abertos.

## Passos

1. **Extraia as decisões e as regras** citadas para cada processo: campos, anexos obrigatórios, etapas, prazos, taxas e quem analisa.
2. **Extraia os acionáveis.** Para cada um, defina:
   - `texto`: o que fazer, começando com um verbo;
   - `dono`: `prefeitura`, `aprova` ou `agente`;
   - `prazo`: a data citada. Se não houver, use +2 dias úteis para a prefeitura e +1 para o agente.
3. **Preencha os tickets.** No chamado de cada processo, escreva as regras extraídas num bloco "Regras levantadas em reunião (data)", com o trecho da fala como evidência.
4. **Crie as tarefas** na fase ativa (`fases[].tasks`) e os acionáveis na reunião (`reunioes[].acionaveis`).
5. **Execute na hora os acionáveis do agente** que não dependem de ninguém, como preencher ticket ou criar cadastro.
6. **Mande o resumo no grupo do WhatsApp**: até 3 linhas e o link do painel.

## Regras

- Se a regra ficou ambígua na reunião, não preencha. Crie um acionável para a prefeitura com a pergunta exata.
- Um acionável de prefeitura sempre tem um nome de pessoa, não "a secretaria".

## Saída

- Tickets preenchidos.
- Tarefas e acionáveis no Pylon.
- Linha no feed: `reuniao` · "Fim da reunião da Fase 1: 4 acionáveis criados e ticket #18310 preenchido".

## Exemplo de mensagem

> Oi, pessoal! Resumo da reunião de hoje: 4 próximos passos, 2 com vocês (lei do Alvará com a Ana, até 22/10). Tudo no painel: prefeitura.aprova.com.br/implantacao
