# Pontes do Mundo — v13 Estado Estável

## Objectivo desta versão

Esta versão reforça a segurança do estado do jogo sem alterar intencionalmente as mecânicas principais, a arte, os mini-jogos ou o fluxo pedagógico.

A intervenção foi conservadora e focada em:
- validação do estado antes de guardar;
- recuperação de progresso quando o save principal falha;
- limpeza de estado temporário ao reabrir o jogo;
- reset mais completo;
- maior tolerância a `localStorage` e `sessionStorage` bloqueados ou corrompidos.

## Alterações aplicadas

### 1. Versão do save

A constante `SAVE_VERSION` passou de `4` para `5`.

Isto permite distinguir a versão actual, que tem validação reforçada.

### 2. Cópia de segurança do progresso

Foi criada a chave:

```js
pontes_do_mundo_v3_backup
```

Sempre que o progresso principal é gravado com sucesso, é também gravada uma cópia de segurança.

Ao iniciar o jogo:
1. tenta carregar o save principal;
2. se o save principal estiver corrompido, tenta carregar a cópia de segurança;
3. se também falhar, tenta migrar o save antigo v1;
4. se tudo falhar, inicia um estado limpo.

### 3. Acesso seguro ao armazenamento

Foram adicionadas funções de leitura, gravação e remoção seguras:

```js
lerStorageSeguro()
gravarStorageSeguro()
removerStorageSeguro()
armazenamentoDisponivel()
```

Assim, se o browser bloquear storage, ou se algum dado estiver corrompido, o jogo não deve parar completamente por erro de JavaScript.

### 4. Validação antes de guardar

A função `guardarEstado()` passou a normalizar o estado antes de gravar.

Isto reduz o risco de guardar:
- números inválidos;
- materiais negativos;
- pontes em ordem impossível;
- dados ausentes;
- estruturas incompletas;
- valores fora do intervalo esperado.

### 5. Estado temporário mais controlado

Os campos temporários continuam a existir durante a sessão, mas são limpos ao reabrir o jogo:

```js
modalAberto
zonaAtual
construcaoEmRisco
perguntaPendente
```

Isto é importante porque estes campos podem bloquear o jogo se forem restaurados depois de um refresh, fecho inesperado ou interrupção durante um mini-jogo.

### 6. Reset mais completo

O reset completo remove agora:
- save principal;
- cópia de segurança;
- save antigo v1;
- memória temporária dos mini-jogos em `sessionStorage`.

### 7. Pequena correcção de debug

A função `mostrarDebugCoordenadas()` referia `estado.posicao`, mas o estado actual usa `estado.personagem`.

Foi corrigido para:

```js
estado.personagem.x
estado.personagem.y
```

## O que esta versão não faz

Esta versão não elimina assets repetidos.

Motivo: antes de apagar assets, é necessário fazer uma auditoria de dependências real. Um asset duplicado visualmente pode ainda ser usado por um mini-jogo, por um estado antigo, por CSS, por HTML ou por uma sequência específica de progresso.

Também não reescreve os mini-jogos. A intervenção foi limitada para evitar regressões.

## Testes técnicos efectuados

Foram feitos testes de sintaxe com:

```bash
node --check js/script.js
node --check js/mini-jogos.js
```

Resultado: sem erros de sintaxe.

## Testes manuais recomendados

Antes de publicar esta versão no GitHub Pages, testar:

1. Criar perfil novo.
2. Actualizar a página no mapa.
3. Ganhar estrelas numa área.
4. Ir à oficina.
5. Ganhar materiais.
6. Iniciar construção de ponte.
7. Sair de um mini-jogo a meio.
8. Actualizar a página durante ou após modal aberto.
9. Usar o botão de voltar ao início/reset.
10. Confirmar que o jogo não fica preso em ecrã vazio, modal invisível ou personagem bloqueada.

## Próximo passo recomendado

Depois desta versão, o passo seguinte deve ser:

1. auditoria de assets usados/não usados;
2. identificação de duplicados reais;
3. remoção controlada dos ficheiros mortos;
4. eventual optimização de peso dos PNGs.
