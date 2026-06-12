# Pontes do Mundo — versão 12 — base de arquitectura

Esta versão reorganiza a estrutura base do projecto sem alterar intencionalmente a lógica de jogo.

## O que mudou

- Os ficheiros CSS passaram para `css/`.
- Os ficheiros JavaScript passaram para `js/`.
- Os assets mantêm-se em `assets/` para evitar alterações profundas de caminhos internos.
- A pasta `.git` foi removida do ZIP entregue para reduzir peso e evitar duplicação desnecessária.
- Foram adicionados documentos técnicos na pasta `docs/`.
- Foi adicionada uma ferramenta local de auditoria em `ferramentas/auditoria-referencias.js`.

## Ficheiros principais

- `index.html` — estrutura dos ecrãs, HUD, modal global e carregamento de CSS/JS.
- `css/style.css` — estilos globais, ecrãs, mapa, HUD, modais e responsividade geral.
- `css/mini-jogos.css` — estilos específicos dos mini-jogos.
- `js/script.js` — fluxo principal do jogo, estado, mapa, progressão, perguntas, HUD e interacções.
- `js/mini-jogos.js` — lógica dos mini-jogos.
- `assets/` — imagens, sons e recursos visuais.

## Como testar

Abrir `index.html` localmente ou publicar no GitHub Pages. Depois seguir a checklist em:

`docs/04_checklist_testes.md`

