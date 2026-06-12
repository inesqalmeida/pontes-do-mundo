# Checklist de testes obrigatórios

## Teste 1 — Arranque limpo

1. Abrir o jogo.
2. Entrar no ecrã inicial.
3. Ir para perfil.
4. Escrever nome.
5. Escolher avatar.
6. Começar jogo.

Resultado esperado: mapa abre, avatar aparece, HUD mostra nome, estrelas e materiais.

## Teste 2 — Refresh no mapa

1. Chegar ao mapa.
2. Actualizar a página.

Resultado esperado: o jogo não deve ficar bloqueado. Deve recuperar o estado guardado ou voltar de forma segura.

## Teste 3 — Definições

1. Abrir painel de definições.
2. Ligar/desligar som.
3. Fechar painel.
4. Voltar ao perfil.
5. Voltar ao início.

Resultado esperado: nenhum botão deve bloquear a navegação.

## Teste 4 — Área de perguntas

1. Entrar na Praça dos Sabores.
2. Responder correctamente.
3. Responder incorrectamente.
4. Confirmar se surgem novas perguntas.

Resultado esperado: perguntas e estrelas devem actualizar de forma coerente.

## Teste 5 — Oficina

1. Obter estrelas suficientes.
2. Ir à oficina.
3. Jogar mini-jogo.
4. Ganhar materiais.

Resultado esperado: materiais devem aparecer no HUD e persistir após refresh.

## Teste 6 — Ponte 1

1. Ter materiais suficientes.
2. Abrir construção da Ponte 1.
3. Confirmar gasto de materiais.
4. Testar vitória e derrota.

Resultado esperado: em caso de vitória, ponte desbloqueia; em caso de derrota, materiais são consumidos conforme regra actual.

## Teste 7 — Repetição de mini-jogos

1. Entrar num mini-jogo.
2. Sair.
3. Voltar a entrar.
4. Repetir duas vezes.

Resultado esperado: não deve haver botões duplicados, timers estranhos, peças presas ou modal bloqueado.

## Teste 8 — Publicação no GitHub Pages

1. Subir a versão para o repositório.
2. Esperar publicação.
3. Abrir em janela anónima.
4. Testar imagens, sons e scripts.

Resultado esperado: não deve haver erros 404 para CSS, JS, imagens ou sons.
