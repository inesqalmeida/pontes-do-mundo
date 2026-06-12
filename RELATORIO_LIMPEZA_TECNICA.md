# Relatório de limpeza técnica — fase visual 1.39

Esta versão faz uma limpeza técnica controlada sem alterar a progressão, os saves, as colisões ou a mecânica dos mini-jogos.

## Alterações realizadas

### CSS

- Removido o bloco duplicado do sistema global de botões em `css/style.css`.
- Mantido o sistema global de botões apenas no final de `css/mini-jogos.css`, que é carregado depois de `style.css` e continua a servir como camada final de uniformização visual.
- Reduzidas ocorrências redundantes de `!important` ao eliminar a duplicação do bloco global de botões.

### JavaScript

- Corrigida a duplicação da função `limparMemoriaCaixasPerdidas` em `js/mini-jogos.js`.
- A limpeza global da memória das Caixas Perdidas passa a estar separada da limpeza de uma tentativa específica.

Funções resultantes:

- `limparTodaMemoriaCaixasPerdidas()` — limpa toda a memória de sessão do mini-jogo.
- `limparMemoriaTentativaCaixasPerdidas(ponte, tentativa)` — limpa apenas a tentativa concluída.

## O que não foi alterado

- Sistema de save.
- Local Storage.
- Colisões do mapa.
- Coordenadas do avatar.
- Perguntas e respostas.
- Desbloqueio das pontes.
- Mecânica dos mini-jogos.
- Assets/imagens.

## Validação recomendada

1. Criar novo perfil.
2. Entrar na Praça dos Sabores.
3. Ganhar estrelas.
4. Entrar na Oficina.
5. Jogar Caixas Perdidas.
6. Confirmar que a memória das caixas não fica presa entre perfis.
7. Confirmar que os botões mantêm o estilo visual uniforme.
8. Confirmar que o botão `Começar`, `Jogar`, `Continuar` e botões dos modais mantêm o mesmo sistema visual.
