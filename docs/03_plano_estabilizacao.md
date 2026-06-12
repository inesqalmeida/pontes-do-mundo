# Plano técnico de estabilização

## Fase 1 — Estado e saves

Prioridade máxima.

Criar uma camada mais segura para:

- estado inicial;
- normalização de saves;
- migração de versões antigas;
- validação de estados impossíveis;
- reset completo;
- recuperação perante dados corrompidos.

Objectivo: impedir que um jogador fique preso por causa de progresso incoerente ou save inválido.

## Fase 2 — Sistema de modal único

Garantir que:

- só existe um modal activo de cada vez;
- fechar modal limpa correctamente botões, conteúdo e callbacks;
- mini-jogos não deixam overlays presos;
- o teclado não fica bloqueado por estados antigos.

## Fase 3 — Temporizadores e listeners

Auditar:

- `setTimeout`;
- listeners globais em `document` e `window`;
- eventos de drag/drop;
- eventos de teclado;
- eventos activos após abandonar mini-jogos.

Objectivo: evitar duplicações e efeitos laterais após repetir mini-jogos ou voltar ao mapa.

## Fase 4 — Mini-jogos como módulos lógicos

Sem necessidade imediata de usar módulos ES6. Primeiro basta criar contratos claros:

- função de entrada;
- função de saída;
- função de vitória;
- função de derrota;
- limpeza obrigatória.

## Fase 5 — Responsividade e colisões

Só deve avançar depois de o estado estar mais seguro.

Motivo: mexer em colisões e responsividade com estado frágil torna os bugs mais difíceis de diagnosticar.

## Fase 6 — Optimização de assets

O projecto continua pesado. Recomenda-se uma fase própria para:

- comprimir PNGs;
- converter alguns assets para WebP, se for compatível com a publicação;
- remover duplicados;
- separar assets activos de assets de arquivo.
