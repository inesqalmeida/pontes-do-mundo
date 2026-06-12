# Mapa de dependências actual

## Carregamento principal

O `index.html` carrega, por esta ordem:

1. `css/style.css`
2. `css/mini-jogos.css`
3. `js/script.js`
4. `js/mini-jogos.js`

A ordem dos scripts foi mantida porque `mini-jogos.js` depende de funções e estado definidos em `script.js`.

## Dependências principais

### `index.html`

Contém a estrutura fixa dos ecrãs:

- ecrã inicial;
- ecrã de perfil;
- ecrã do mapa;
- HUD;
- painel de definições;
- mapa jogável;
- modal global.

### `js/script.js`

Responsável por:

- estado principal do jogo;
- carregamento e gravação em `localStorage`;
- parte da limpeza de `sessionStorage`;
- perfil do jogador;
- ecrãs;
- mapa;
- movimento;
- colisões;
- HUD;
- perguntas das áreas;
- progressão das pontes;
- abertura de mini-jogos;
- modais globais;
- sons;
- teclado global.

### `js/mini-jogos.js`

Responsável por:

- oficina inicial;
- mini-jogo da Ponte 1;
- mini-jogo dos barcos;
- mini-jogo das cargas perdidas;
- mini-jogo de fluxo/energia da Ponte 2;
- mini-jogo final da Ponte 3;
- alguns estados temporários em `sessionStorage`.

## Observação crítica

A fronteira entre o jogo principal e os mini-jogos ainda não está totalmente isolada. Esta é uma das principais fontes potenciais de instabilidade futura.

Antes de adicionar novas mecânicas, recomenda-se criar uma camada clara de comunicação entre:

- core do jogo;
- sistema de estado;
- sistema de saves;
- sistema de modais;
- mini-jogos.
