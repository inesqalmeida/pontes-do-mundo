# Catálogo Central de Assets — Pontes do Mundo v19

Gerado em: 2026-05-28 16:00:19

## Objectivo

Criar uma camada única para resolver imagens e sons a partir da pasta `assets/`, evitando caminhos dinâmicos partidos como `assets/materiais/tentativa1/pregos.png` quando o ficheiro real está em `assets/pregos.png`.

## Alterações aplicadas

- Criado `js/assets-catalogo.js`.
- Adicionado o carregamento de `js/assets-catalogo.js` antes de `js/script.js` e `js/mini-jogos.js`.
- Criadas as funções globais `caminhoAsset(nomeFicheiro)` e `normalizarCaminhoAsset(caminho)`.
- Actualizados os caminhos dinâmicos dos mini-jogos para usar o catálogo central.
- Corrigidas referências com subpastas antigas: materiais, materiais-barcos, ponte1, ponte2, ponte3, oficina-ponte3 e transportes.

## Validação

- Assets no catálogo: 93
- Referências estáticas analisadas: 246
- Referências estáticas em falta: 0
- Referências antigas com subpastas removidas ainda detectadas: 0
- Expressões dinâmicas suspeitas remanescentes: 0

## Validação de sintaxe JavaScript

- `js/assets-catalogo.js`: OK
- `js/script.js`: OK
- `js/mini-jogos.js`: OK

## Referências estáticas em falta

Nenhuma referência estática em falta.

## Referências antigas com subpastas

Nenhuma referência antiga com subpastas de assets detectada.

## Expressões dinâmicas suspeitas remanescentes

Nenhuma expressão dinâmica suspeita detectada.

## Nota honesta

Esta versão corrige a origem mais provável das imagens partidas: caminhos dinâmicos que ainda apontavam para subpastas antigas. O teste visual no browser continua necessário para confirmar posicionamento, escala e se cada imagem aparece no local visualmente correcto.
