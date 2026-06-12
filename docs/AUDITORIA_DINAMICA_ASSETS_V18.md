# Auditoria Dinâmica de Assets — Pontes do Mundo v18

Gerado em: 2026-05-28 15:51:18

## Objectivo

Mapear os pontos onde o jogo constrói caminhos de imagens dinamicamente e comparar esses nomes esperados com os ficheiros reais existentes em `assets/`.

Esta auditoria foi feita porque os testes visuais mostraram imagens partidas em:
- Oficina da Ponte 1;
- resumo de materiais encontrados;
- mini-jogo dos barcos;
- conclusão de nível;
- Ponte 3 / construção final.

## Resumo

- Assets reais encontrados em `assets/`: 93
- Ficheiros HTML/CSS/JS analisados: 6
- Referências estáticas encontradas: 57
- Referências estáticas em falta: 0
- Construções dinâmicas detectadas: 90
- Propriedades prováveis de imagem detectadas: 85
- Nomes esperados analisados: 45
- Nomes esperados com discrepância: 0
- Grupos de variantes reais por nome normalizado: 0

---

## 1. Funções / expressões que constroem caminhos dinamicamente

- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/madeira.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/corda.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/pregos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/bola.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/maca.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/pena.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/troncos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/martelo.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/peixe.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/flores.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/vigas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/alicate.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/correntes.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/bolo.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/almofada.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png`
- `js/mini-jogos.js` [template_literal]: `
    <button
      type="button"
      class="caixa-mini-jogo ${animarCaixas ? "animada" : ""}"
      data-id="${objeto.id}"
      aria-label="Abrir caixa"
    >
      <img
        class="caixa-imagem"
        src="assets/caixa-fechada.png"
        alt=""
        aria-hidden="true"
      >

      <img
        class="objeto-caixa"
        src="${objeto.imagem}"
        alt="${objeto.nome}"
      >

      <span class="nome-objeto-caixa">${objeto.nome}</span>
    </button>
  `
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/caixas/caixa-aberta.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/materiais/madeira.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/materiais/corda.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/materiais/pregos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/peixe.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/maca.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/bota.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/vigas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/correntes.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/martelo.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/guarda_chuva.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/vaso-flor.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/bola.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/candeeiro.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/caixa-ferramentas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/cimento.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/frigideira.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/almofada.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS_BARCOS}/chapeu.png`
- `js/mini-jogos.js` [template_literal]: `
      <div class="mini-jogo-barcos" data-nivel="${nivel.numero}">
        <header class="barcos-cabecalho barcos-cabecalho-limpo">
          <div class="barcos-info-principal">
            <div class="barcos-titulo-linha">
              <h3 class="mini-jogo-titulo">Barcos no Rio</h3>
              <span class="barcos-nivel-chip">${nivel.nome}</span>
            </div>
            <p class="barcos-instrucao-principal">Escolhe barcos com materiais úteis para a ${nomePonte(ponte)}.</p>
            <p class="barcos-regra-curta">3 materiais diferentes. Repetidos contam como erro.</p>
          </div>

          <div class="barcos-hud-direita barcos-hud-limpo">
            <div class="barcos-chip">Tentativas: <span id="barcos-tentativas">${criarEstrelasErrosBarcosRio(0)}</span></div>
            <div class="barcos-chip">Materiais da ponte: <span id="barcos-total-materiais">${estado.materiais[ponte] || 0}</span>/9</div>
            <div class="barcos-chip">Encontrados: <span id="barcos-contador">0</span>/3</div>
          </div>
        </header>

        <section class="barcos-area-rio" id="barcos-area-rio" aria-label="Rio com barcos em movimento">
          <img class="barcos-fundo" src="assets/fundo-rio.png" alt="" aria-hidden="true">
          <div class="barcos-camada" id="barcos-camada"></div>
          <div class="barcos-efeitos" id="barcos-efeitos"></div>
          <div class="barcos-mira" id="barcos-mira" aria-hidden="true"></div>
        </section>

        <footer class="barcos-rodape">
          <p class="mini-jogo-mensagem" id="barcos-mensagem">${nivel.mensagemInicial}</p>
        </footer>
      </div>
    `
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/vigas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/correntes.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/martelo.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/peixe.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/maca.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/almofada.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/pregos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/alicate.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/flores.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/bolo.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa2/troncos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/corda.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/madeira.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/bola.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa1/pena.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png`
- `js/mini-jogos.js` [template_literal]: `
      <div class="mini-cargas" data-nivel="${nivel.numero}">
        <header class="mini-cargas-cabecalho">
          <div class="mini-cargas-info">
            <div class="mini-cargas-titulo-linha">
              <h3 class="mini-jogo-titulo">Cargas Perdidas</h3>
              <span class="mini-cargas-nivel">${nivel.nome}</span>
            </div>
            <p class="mini-cargas-instrucao">Triagem final de materiais para a ${nomePonte(ponte)}.</p>
            <p class="mini-cargas-regra">Quando a vagoneta passar, arrasta apenas a carga para Construção ou Descarte.</p>
          </div>

          <div class="mini-cargas-hud">
            <div class="mini-cargas-chip">Tentativas: <span id="mini-cargas-tentativas">${criarEstrelasErrosCargasPerdidas(0)}</span></div>
            <div class="mini-cargas-chip">Materiais da ponte: <span id="mini-cargas-total">${estado.materiais[ponte] || 0}</span>/9</div>
            <div class="mini-cargas-chip">Recolhidos: <span id="mini-cargas-contador">0</span>/3</div>
          </div>
        </header>

        <section class="mini-cargas-area" id="mini-cargas-area" aria-label="Oficina de triagem de cargas">
          <img class="mini-cargas-fundo" src="assets/fundo-oficina3.png" alt="" aria-hidden="true">
          <img class="mini-cargas-carril mini-cargas-carril-baixo" src="assets/carril.png" alt="" aria-hidden="true">
          <img class="mini-cargas-cabo" src="assets/cabo-supenso.png" alt="" aria-hidden="true">

          <div class="mini-cargas-zona mini-cargas-zona-construcao" data-zona="construcao">
            <strong>Construção</strong>
            <span>materiais úteis</span>
          </div>

          <div class="mini-cargas-zona mini-cargas-zona-descarte" data-zona="descarte">
            <strong>Descarte</strong>
            <span>objectos inúteis</span>
          </div>


          <div class="mini-cargas-camada" id="mini-cargas-camada"></div>
          <div class="mini-cargas-efeitos" id="mini-cargas-efeitos"></div>
        </section>

        <footer class="mini-cargas-rodape">
          <p class="mini-jogo-mensagem" id="mini-cargas-mensagem">${nivel.mensagemInicial}</p>
        </footer>
      </div>
    `
- `js/mini-jogos.js` [template_literal]: `<img class="fluxo2-asset fluxo2-lanterna" src="${CAMINHO_PONTE2}/${acesa ? "lanterna-ativa" : "lanterna-inativa"}.png" alt="">`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE2}/${lanternaAcesa ? "lanterna-ativa" : "lanterna-inativa"}.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE2}/efeito-sucesso.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/ponte3_estado_0.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/ponte3_estado_1.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/ponte3_estado_2.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/ponte3_estado_final.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/corda.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/correntes.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/cabo-supenso.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/plataforma.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/suporte_pesado.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/pregos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/parafusos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/alicate.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/caixa-ferramentas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/candeeiro.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/troncos.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/madeira.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/vigas.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/estrutura_reforcada.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/runa-magica.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/cristal-pequeno.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/cristal-central.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/mecanismo-magico.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/nucleo_magico.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/secao_ponte.png`
- `js/mini-jogos.js` [template_literal]: `${CAMINHO_PONTE3}/energia_ativa.png`
- `js/mini-jogos.js` [template_literal]: `
        <section class="ponte3-mini-jogo ponte3-merge-board ${animacaoFinal ? "ponte3-com-animacao-final" : ""}" aria-labelledby="ponte3-titulo">
          <div class="ponte3-cenario">
            <img src="${imagemPalco}" alt="" class="ponte3-cenario-img" draggable="false">
            <span class="ponte3-cenario-sombra"></span>
            <img src="assets/energia_ativa.png" alt="" class="ponte3-energia-travessia" draggable="false">

            <header class="ponte3-cabecalho-board">
              <p class="ponte3-etiqueta">A Última Travessia</p>
              <h2 id="ponte3-titulo">Constrói a ponte final</h2>
              <p>Produz, organiza, junta e evolui os materiais até completares a ponte.</p>
            </header>

            <div class="ponte3-painel-jogo">
              <div class="ponte3-info-lateral">
                <span class="ponte3-progresso-texto">${etapaTexto}</span>
                <span class="ponte3-progresso-barras" aria-hidden="true">
                  <span class="ponte3-progresso-barra ${estadoMerge.etapaVisual >= 1 ? "ativa" : ""}"></span>
                  <span class="ponte3-progresso-barra ${estadoMerge.etapaVisual >= 2 ? "ativa" : ""}"></span>
                  <span class="ponte3-progresso-barra ${estadoMerge.etapaVisual >= 3 ? "ativa" : ""}"></span>
                </span>
                <p class="ponte3-dica">Dica: quando uma linha fica completa, a caixa deixa de gerar essa base.</p>
              </div>

              <div class="ponte3-tabuleiro" role="grid" aria-label="Tabuleiro de merge da Ponte 3">
                ${estadoMerge.slots.map(criarCelula).join("")}
              </div>
            </div>

            <p id="ponte3-feedback" class="ponte3-feedback-board" aria-live="polite">${estadoMerge.mensagem}</p>
          </div>
        </section>
      `
- `js/mini-jogos.js` [src_assignment]: ``${CAMINHO_MATERIAIS}/caixas/caixa-aberta.png``
- `js/mini-jogos.js` [src_assignment]: ``${CAMINHO_PONTE2}/${lanternaAcesa ? "lanterna-ativa" : "lanterna-inativa"}.png``
- `js/mini-jogos.js` [src_assignment]: ``${CAMINHO_PONTE2}/efeito-sucesso.png``

---
## 2. Propriedades prováveis de imagem detectadas no código

- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/madeira.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/corda.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/pregos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/bola.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/maca.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/pena.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/troncos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/martelo.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/parafusos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/chapeu.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/peixe.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/flores.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/vigas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/alicate.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/correntes.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/bolo.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/almofada.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png`
- `js/mini-jogos.js` → `imagem: assets/peca1.png`
- `js/mini-jogos.js` → `imagem: assets/peca2.png`
- `js/mini-jogos.js` → `imagem: assets/peca3.png`
- `js/mini-jogos.js` → `imagem: assets/peca4.png`
- `js/mini-jogos.js` → `imagem: assets/peca5.png`
- `js/mini-jogos.js` → `imagem: assets/peca6.png`
- `js/mini-jogos.js` → `imagem: assets/peca7.png`
- `js/mini-jogos.js` → `imagem: assets/peca8.png`
- `js/mini-jogos.js` → `imagem: assets/peca9.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/materiais/madeira.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/materiais/corda.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/materiais/pregos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/peixe.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/maca.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/bota.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/vigas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/correntes.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/martelo.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/guarda_chuva.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/vaso-flor.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/bola.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/candeeiro.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/caixa-ferramentas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/cimento.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/frigideira.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/almofada.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS_BARCOS}/chapeu.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/vigas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/correntes.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/martelo.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/peixe.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/maca.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/almofada.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/pregos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/parafusos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/alicate.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/chapeu.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/flores.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/bolo.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa2/troncos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/corda.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/madeira.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/bola.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa1/pena.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png`
- `js/mini-jogos.js` → `imagem: assets/caixa-fechada.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/corda.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/correntes.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/cabo-supenso.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/plataforma.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/suporte_pesado.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/pregos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/parafusos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/alicate.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/caixa-ferramentas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/candeeiro.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/troncos.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/madeira.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/vigas.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/estrutura_reforcada.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/runa-magica.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/cristal-pequeno.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/cristal-central.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/mecanismo-magico.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/nucleo_magico.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/secao_ponte.png`
- `js/mini-jogos.js` → `imagem: ${CAMINHO_PONTE3}/energia_ativa.png`

---
## 3. Nomes esperados vs ficheiros reais

Nenhuma discrepância detectada nos nomes esperados extraídos de propriedades de imagem.

---
## 4. Variantes reais existentes em assets/

Nenhum grupo de variantes detectado.

---
## 5. Referências estáticas em falta

Nenhuma referência estática em falta.

---
## 6. Sistemas que usam imagens, por concentração de termos


### oficina_ponte1_caixas
- `js/script.js` — score 100
- `js/mini-jogos.js` — score 86
- `css/mini-jogos.css` — score 50
- `css/style.css` — score 4

### mini_jogo_barcos
- `js/mini-jogos.js` — score 1177
- `css/mini-jogos.css` — score 651
- `js/script.js` — score 116
- `css/style.css` — score 25

### ponte2
- `js/mini-jogos.js` — score 91
- `js/script.js` — score 64
- `css/mini-jogos.css` — score 3
- `css/style.css` — score 3

### ponte3_merge
- `js/mini-jogos.js` — score 144
- `css/mini-jogos.css` — score 18
- `js/script.js` — score 18
- `css/style.css` — score 1

### mapa
- `js/script.js` — score 480
- `js/mini-jogos.js` — score 370
- `css/mini-jogos.css` — score 299
- `css/style.css` — score 47
- `index.html` — score 9

### avatares
- `css/style.css` — score 246
- `js/script.js` — score 65
- `index.html` — score 39
- `ferramentas/auditoria-referencias.js` — score 1


---

## Conclusão técnica

O problema principal não é apenas “caminho errado”.
É a ausência de uma camada única de resolução de assets.

Neste momento, partes do jogo continuam a depender de strings, nomes de materiais e templates que precisam de coincidir exactamente com nomes reais de ficheiros.

A correcção recomendada para a próxima fase é criar um catálogo central de assets no JavaScript, por exemplo:

`ASSETS = { materiais: { pregos: "assets/pregos.png", ... } }`

Depois, todos os mini-jogos devem pedir imagens a esse catálogo, em vez de construírem caminhos manualmente.
