# Auditoria inicial de estrutura

## Objectivo desta versão

Criar uma base mais organizada e previsível antes de avançar para alterações profundas de estado, progressão, colisões, responsividade ou mini-jogos.

Esta versão é conservadora: reorganiza os ficheiros principais e documenta a arquitectura actual, sem tentar reescrever a lógica interna do jogo.

## Estrutura anterior

A versão recebida tinha os ficheiros principais directamente na raiz:

- `index.html`
- `style.css`
- `mini-jogos.css`
- `script.js`
- `mini-jogos.js`
- `assets/`
- `.git/`

## Estrutura desta versão

- `index.html`
- `css/style.css`
- `css/mini-jogos.css`
- `js/script.js`
- `js/mini-jogos.js`
- `assets/`
- `docs/`
- `ferramentas/`

## Decisões tomadas

### 1. A pasta `assets/` não foi reorganizada

Motivo: muitos caminhos estão referenciados directamente no JavaScript, no HTML e no CSS. Reorganizar os assets nesta fase aumentaria muito o risco de partir imagens, sons e mini-jogos.

### 2. A pasta `.git/` foi removida do ZIP

Motivo: a pasta `.git/` não é necessária para correr o jogo no browser e aumentava bastante o peso do ficheiro. O histórico Git deve existir no repositório original, não necessariamente dentro do ZIP de trabalho.

### 3. CSS e JavaScript foram separados por pasta

Motivo: é uma alteração de baixo risco, melhora a leitura da estrutura e prepara uma futura modularização.

## Riscos ainda existentes

A reorganização de ficheiros não resolve, por si só:

- estado corrompido;
- saves antigos incompatíveis;
- listeners duplicados;
- temporizadores activos após fechar mini-jogos;
- modais presos;
- progressão incoerente;
- colisões frágeis;
- dependências globais entre `script.js` e `mini-jogos.js`.

Esses pontos devem ser tratados numa fase seguinte, com alterações controladas ao código.
