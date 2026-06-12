# Validação e Correcção de Caminhos de Imagens — Pontes do Mundo v17

Gerado em: 2026-05-28 15:03:22

## Objectivo

Corrigir a estrutura criada na v16 e confirmar que os caminhos estáticos para imagens/som apontam para ficheiros existentes.

## Correcção estrutural aplicada

A pasta `assets/` estava fora da raiz real do projecto.  
Foi movida para junto de:

- `index.html`
- `css/`
- `js/`

A estrutura correcta passou a ser:

- `index.html`
- `assets/`
- `css/`
- `js/`
- `docs/`

## Resumo da validação

- Ficheiros HTML/CSS/JS analisados: 6
- Assets existentes em `assets/`: 93
- Ficheiros de código actualizados: 2
- Referências estáticas a assets encontradas: 68
- Referências estáticas válidas: 68
- Referências estáticas em falta: 0
- Referências dinâmicas identificadas: 81
- Falsos positivos ignorados: 1

## Ficheiros actualizados

- `css/style.css`
- `css/mini-jogos.css`

## Referências estáticas em falta

Nenhuma referência estática em falta foi detectada.

## Referências dinâmicas

- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/madeira.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/corda.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/pregos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/bola.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/maca.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/pena.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/troncos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/martelo.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/peixe.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/flores.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/vigas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/alicate.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/correntes.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/bolo.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/almofada.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/caixas/caixa-aberta.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/materiais/madeira.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/materiais/corda.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/materiais/pregos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/peixe.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/maca.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/bota.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/vigas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/correntes.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/martelo.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/guarda_chuva.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/vaso-flor.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/bola.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/candeeiro.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/caixa-ferramentas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/cimento.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/frigideira.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/almofada.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS_BARCOS}/chapeu.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/vigas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/correntes.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/martelo.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/peixe.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/maca.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/almofada.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/pregos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/alicate.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/flores.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/bolo.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa2/troncos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/corda.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/madeira.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/bola.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa1/pena.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE2}/efeito-sucesso.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/ponte3_estado_0.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/ponte3_estado_1.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/ponte3_estado_2.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/ponte3_estado_final.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/corda.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/correntes.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/cabo-supenso.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/plataforma.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/suporte_pesado.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/pregos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/parafusos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/alicate.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/caixa-ferramentas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/candeeiro.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/troncos.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/madeira.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/vigas.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/estrutura_reforcada.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/runa-magica.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/cristal-pequeno.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/cristal-central.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/mecanismo-magico.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/nucleo_magico.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/secao_ponte.png` (referência dinâmica/template literal)
- `js/mini-jogos.js` → `${CAMINHO_PONTE3}/energia_ativa.png` (referência dinâmica/template literal)

## Falsos positivos ignorados

- `js/mini-jogos.js` → `}.png` (fragmento de template literal)


## Nota honesta

Esta validação confirma caminhos estáticos. As referências dinâmicas dependem dos valores gerados pelo JavaScript durante o jogo, por isso continuam a exigir teste visual no browser.

No entanto, a falha estrutural principal da v16 — assets fora da raiz real do projecto — foi corrigida.
