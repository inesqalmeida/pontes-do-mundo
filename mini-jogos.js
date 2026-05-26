/* =========================
   MINI-JOGOS — PONTES DO MUNDO
========================= */

const CAMINHO_MATERIAIS = "assets/materiais";
const MAX_ERROS_CAIXAS_PERDIDAS = 3;
const memoriaCaixasPerdidas = {};
const CHAVE_MEMORIA_CAIXAS = "pontes_oficina1_memoria_sessao";

const dadosCaixasPerdidas = {
  ponte1: [
    {
      tentativa: 1,
      animarCaixas: false,
      mensagemInicial: "Abre as caixas e procura os materiais certos.",
      objetos: [
        { id: "madeira", nome: "Madeira", imagem: `${CAMINHO_MATERIAIS}/tentativa1/madeira.png`, correta: true },
        { id: "corda", nome: "Corda", imagem: `${CAMINHO_MATERIAIS}/tentativa1/corda.png`, correta: true },
        { id: "pregos", nome: "Pregos", imagem: `${CAMINHO_MATERIAIS}/tentativa1/pregos.png`, correta: true },
        { id: "bola", nome: "Bola", imagem: `${CAMINHO_MATERIAIS}/tentativa1/bola.png`, correta: false },
        { id: "maca", nome: "Maçã", imagem: `${CAMINHO_MATERIAIS}/tentativa1/maca.png`, correta: false },
        { id: "pena", nome: "Pena", imagem: `${CAMINHO_MATERIAIS}/tentativa1/pena.png`, correta: false }
      ]
    },
    {
      tentativa: 2,
      animarCaixas: false,
      mensagemInicial: "Agora os materiais mudaram. Observa bem!",
      objetos: [
        { id: "troncos", nome: "Troncos", imagem: `${CAMINHO_MATERIAIS}/tentativa2/troncos.png`, correta: true },
        { id: "martelo", nome: "Martelo", imagem: `${CAMINHO_MATERIAIS}/tentativa2/martelo.png`, correta: true },
        { id: "parafusos", nome: "Parafusos", imagem: `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png`, correta: true },
        { id: "chapeu", nome: "Chapéu", imagem: `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png`, correta: false },
        { id: "peixe", nome: "Peixe", imagem: `${CAMINHO_MATERIAIS}/tentativa2/peixe.png`, correta: false },
        { id: "flores", nome: "Flores", imagem: `${CAMINHO_MATERIAIS}/tentativa2/flores.png`, correta: false }
      ]
    },
    {
      tentativa: 3,
      animarCaixas: true,
      mensagemInicial: "Última ronda: todas as caixas estão mais irrequietas.",
      objetos: [
        { id: "vigas", nome: "Vigas", imagem: `${CAMINHO_MATERIAIS}/tentativa3/vigas.png`, correta: true },
        { id: "alicate", nome: "Alicate", imagem: `${CAMINHO_MATERIAIS}/tentativa3/alicate.png`, correta: true },
        { id: "correntes", nome: "Correntes", imagem: `${CAMINHO_MATERIAIS}/tentativa3/correntes.png`, correta: true },
        { id: "bolo", nome: "Bolo", imagem: `${CAMINHO_MATERIAIS}/tentativa3/bolo.png`, correta: false },
        { id: "almofada", nome: "Almofada", imagem: `${CAMINHO_MATERIAIS}/tentativa3/almofada.png`, correta: false },
        { id: "guarda_chuva", nome: "Guarda-chuva", imagem: `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png`, correta: false }
      ]
    }
  ]
};

function obterTentativaCaixasPerdidas(ponte) {
  const materiaisAtuais = estado.materiais[ponte] || 0;
  const indiceTentativa = Math.min(Math.floor(materiaisAtuais / 3), 2);

  return dadosCaixasPerdidas[ponte][indiceTentativa];
}


function chaveMemoriaCaixasPerdidas(ponte, tentativa) {
  return `${ponte}-tentativa-${tentativa.tentativa}`;
}

function lerMemoriaCaixasSessao() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_MEMORIA_CAIXAS) || "{}");
  } catch (erro) {
    return {};
  }
}

function guardarMemoriaCaixasSessao(memoria) {
  try {
    sessionStorage.setItem(CHAVE_MEMORIA_CAIXAS, JSON.stringify(memoria));
  } catch (erro) {
    // Se o browser bloquear sessionStorage, mantemos a memória em runtime.
  }
}

function obterObjetosCaixasComMemoria(ponte, tentativa) {
  const chave = chaveMemoriaCaixasPerdidas(ponte, tentativa);
  const memoriaSessao = lerMemoriaCaixasSessao();

  if (!memoriaCaixasPerdidas[chave] && Array.isArray(memoriaSessao[chave])) {
    memoriaCaixasPerdidas[chave] = memoriaSessao[chave];
  }

  if (!memoriaCaixasPerdidas[chave]) {
    memoriaCaixasPerdidas[chave] = embaralharArray(tentativa.objetos).map((objeto) => objeto.id);
    memoriaSessao[chave] = memoriaCaixasPerdidas[chave];
    guardarMemoriaCaixasSessao(memoriaSessao);
  }

  const porId = new Map(tentativa.objetos.map((objeto) => [objeto.id, objeto]));
  return memoriaCaixasPerdidas[chave]
    .map((id) => porId.get(id))
    .filter(Boolean);
}

function limparMemoriaCaixasPerdidas(ponte, tentativa) {
  if (!tentativa) return;
  const chave = chaveMemoriaCaixasPerdidas(ponte, tentativa);
  delete memoriaCaixasPerdidas[chave];
  const memoriaSessao = lerMemoriaCaixasSessao();
  delete memoriaSessao[chave];
  guardarMemoriaCaixasSessao(memoriaSessao);
}

function criarEstrelasErros(erros) {
  return Array.from({ length: MAX_ERROS_CAIXAS_PERDIDAS })
    .map((_, indice) => {
      const classe = indice < erros ? "apagada" : "";
      return `<span class="estrela-erro ${classe}">⭐</span>`;
    })
    .join("");
}

function criarHTMLCaixa(objeto, animarCaixas) {
  return `
    <button
      type="button"
      class="caixa-mini-jogo ${animarCaixas ? "animada" : ""}"
      data-id="${objeto.id}"
      aria-label="Abrir caixa"
    >
      <img
        class="caixa-imagem"
        src="${CAMINHO_MATERIAIS}/caixas/caixa-fechada.png"
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
  `;
}

function iniciarMiniJogoCaixasPerdidas(ponte) {
  if (ponte !== "ponte1") {
    iniciarMiniJogoOficina(ponte);
    return;
  }

  const tentativa = obterTentativaCaixasPerdidas(ponte);
  const objetosBaralhados = obterObjetosCaixasComMemoria(ponte, tentativa);

  const estadoMiniJogo = {
    ponte,
    tentativa,
    objetos: objetosBaralhados,
    encontrados: 0,
    erros: 0,
    terminado: false
  };

  const caixasHTML = objetosBaralhados
    .map((objeto) => criarHTMLCaixa(objeto, tentativa.animarCaixas))
    .join("");

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: `
      <div class="mini-jogo-caixas">
        <div class="mini-jogo-cabecalho">
          <div class="mini-jogo-titulo-area">
            <h3 class="mini-jogo-titulo">Caixas Perdidas</h3>
            <p class="mini-jogo-subtitulo">
              Encontra os materiais certos para ajudar a construir a ${nomePonte(ponte)}.
            </p>
          </div>

          <div class="mini-jogo-hud">
            <div class="mini-jogo-contador">
              Materiais encontrados:
              <span id="mini-contador-materiais">0</span>/3
            </div>

            <div class="mini-jogo-tentativas" id="mini-tentativas-erros">
              Tentativas: ${criarEstrelasErros(0)}
            </div>
          </div>
        </div>

        <div class="caixas-grid" id="caixas-grid">
          ${caixasHTML}
        </div>

        <div class="mini-jogo-rodape">
          <p class="mini-jogo-mensagem" id="mini-jogo-mensagem">
            ${tentativa.mensagemInicial}
          </p>
        </div>
      </div>
    `,
    acoes: []
  });

  ligarEventosCaixasPerdidas(estadoMiniJogo);

  setTimeout(() => {
    const primeiraCaixa = document.querySelector(".caixa-mini-jogo:not(:disabled)");
    if (primeiraCaixa) primeiraCaixa.focus();
  }, 0);
}

function ligarEventosCaixasPerdidas(estadoMiniJogo) {
  const botoes = Array.from(document.querySelectorAll(".caixa-mini-jogo"));

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      abrirCaixaMiniJogo(botao, estadoMiniJogo);
    });
  });
}

function abrirCaixaMiniJogo(botao, estadoMiniJogo) {
  if (estadoMiniJogo.terminado) return;
  if (!botao || botao.disabled) return;
  if (botao.classList.contains("aberta")) return;

  const objeto = estadoMiniJogo.objetos.find((item) => item.id === botao.dataset.id);
  if (!objeto) return;

  botao.disabled = true;
  botao.classList.remove("animada");
  botao.classList.add("aberta");

  const imagemCaixa = botao.querySelector(".caixa-imagem");
  if (imagemCaixa) {
    imagemCaixa.src = `${CAMINHO_MATERIAIS}/caixas/caixa-aberta.png`;
  }

  if (objeto.correta) {
    tratarAcertoCaixa(botao, estadoMiniJogo);
  } else {
    tratarErroCaixa(botao, estadoMiniJogo);
  }

  focarProximaCaixaDisponivel();
}

function tratarAcertoCaixa(botao, estadoMiniJogo) {
  tocarSom("sucesso");

  botao.classList.add("correta");

  estadoMiniJogo.encontrados += 1;

  atualizarHUDCaixasPerdidas({
    encontrados: estadoMiniJogo.encontrados,
    erros: estadoMiniJogo.erros,
    mensagem:
      estadoMiniJogo.encontrados >= 3
        ? "Boa! Encontraste todos os materiais."
        : `Boa escolha! Já encontraste ${estadoMiniJogo.encontrados}/3 materiais.`
  });

  if (estadoMiniJogo.encontrados >= 3) {
    estadoMiniJogo.terminado = true;

    bloquearTodasAsCaixas();

    setTimeout(() => {
      mostrarVitoriaCaixasPerdidas(estadoMiniJogo);
    }, 900);
  }
}

function tratarErroCaixa(botao, estadoMiniJogo) {
  tocarSom("erro");

  botao.classList.add("errada");

  estadoMiniJogo.erros += 1;

  atualizarHUDCaixasPerdidas({
    encontrados: estadoMiniJogo.encontrados,
    erros: estadoMiniJogo.erros,
    mensagem:
      estadoMiniJogo.erros >= MAX_ERROS_CAIXAS_PERDIDAS
        ? "Oh não... faltavam alguns materiais."
        : "Isso não parece útil para a ponte..."
  });

  if (estadoMiniJogo.erros >= MAX_ERROS_CAIXAS_PERDIDAS) {
    estadoMiniJogo.terminado = true;

    bloquearTodasAsCaixas();

    setTimeout(() => {
      mostrarDerrotaCaixasPerdidas();
    }, 900);
  }
}

function atualizarHUDCaixasPerdidas({ encontrados, erros, mensagem }) {
  const contador = document.getElementById("mini-contador-materiais");
  const tentativas = document.getElementById("mini-tentativas-erros");
  const mensagemEl = document.getElementById("mini-jogo-mensagem");

  if (contador) {
    contador.textContent = encontrados;
  }

  if (tentativas) {
    tentativas.innerHTML = `Tentativas: ${criarEstrelasErros(erros)}`;
  }

  if (mensagemEl) {
    mensagemEl.textContent = mensagem;
  }
}

function focarProximaCaixaDisponivel() {
  const proximaCaixa = document.querySelector(".caixa-mini-jogo:not(:disabled)");

  if (proximaCaixa) {
    proximaCaixa.focus();
  }
}

function bloquearTodasAsCaixas() {
  document.querySelectorAll(".caixa-mini-jogo").forEach((caixa) => {
    caixa.disabled = true;
    caixa.classList.remove("animada");
  });
}

function mostrarVitoriaCaixasPerdidas(estadoMiniJogo) {
  const conteudo = document.querySelector(".mini-jogo-caixas");
  const acoes = elementos.modalAcoes;

  if (!conteudo || !acoes) return;

  const { ponte, tentativa } = estadoMiniJogo;

  limparMemoriaCaixasPerdidas(ponte, tentativa);
  estado.materiais[ponte] += 3;

  atualizarHUD();
  animarElementoHUD(elementos.materiaisJogador);
  guardarEstado();

  const materiaisCorretos = tentativa.objetos
    .filter((objeto) => objeto.correta)
    .map((objeto) => `
      <img src="${objeto.imagem}" alt="${objeto.nome}">
    `)
    .join("");

  conteudo.innerHTML = `
    <div class="mini-jogo-final">
      <h4>Materiais encontrados!</h4>
      <p>Conseguiste reunir 3 materiais para a ${nomePonte(ponte)}.</p>

      <div class="materiais-final">
        ${materiaisCorretos}
      </div>
    </div>
  `;

  tocarSom("sucesso");

  acoes.innerHTML = "";

  const botaoContinuar = document.createElement("button");
  botaoContinuar.type = "button";
  botaoContinuar.textContent = "Continuar";
  botaoContinuar.classList.add("botao-mini-jogo");

  botaoContinuar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });

  acoes.appendChild(botaoContinuar);
  botaoContinuar.focus();
}

function mostrarDerrotaCaixasPerdidas() {
  const conteudo = document.querySelector(".mini-jogo-caixas");
  const acoes = elementos.modalAcoes;

  if (!conteudo || !acoes) return;

  conteudo.innerHTML = `
    <div class="mini-jogo-final">
      <h4>Quase!</h4>
      <p>Não conseguiste o material desta vez. A estrela investida já foi gasta.</p>
      <p>Tenta novamente quando tiveres outra estrela.</p>
    </div>
  `;

  tocarSom("erroForte");
  acoes.innerHTML = "";

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo");

  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });

  acoes.appendChild(botaoVoltar);
  botaoVoltar.focus();
}
/* =========================
   MINI-JOGO — RECONSTRUÇÃO DA PONTE 1
========================= */

const CAMINHO_PONTE1 = "assets/ponte1";

const pecasReconstrucaoPonte1 = [
  // As posições iniciais ficam distribuídas pelas margens do cenário para
  // reduzir ruído visual sobre a ponte destruída. Os alvos mantêm-se iguais.
  { id: "peca1", imagem: "peca1.png", alvoX: 0, alvoY: 35.22, largura: 24.7, inicioX: -2, inicioY: 8 },
  { id: "peca2", imagem: "peca2.png", alvoX: 26.56, alvoY: 70.58, largura: 32.45, inicioX: -4, inicioY: 74 },
  { id: "peca3", imagem: "peca3.png", alvoX: 30.6, alvoY: 41.16, largura: 15.17, inicioX: 88, inicioY: 6 },
  { id: "peca4", imagem: "peca4.png", alvoX: 37.48, alvoY: 14.09, largura: 21.59, inicioX: 38, inicioY: -3 },
  { id: "peca5", imagem: "peca5.png", alvoX: 54.9, alvoY: 40.88, largura: 16.82, inicioX: 88, inicioY: 42 },
  { id: "peca6", imagem: "peca6.png", alvoX: 60.73, alvoY: 2.9, largura: 6.42, inicioX: 12, inicioY: -2 },
  { id: "peca7", imagem: "peca7.png", alvoX: 70.79, alvoY: 0, largura: 8.01, inicioX: 80, inicioY: -2 },
  { id: "peca8", imagem: "peca8.png", alvoX: 75.63, alvoY: 21.82, largura: 8.21, inicioX: 12, inicioY: 84 },
  { id: "peca9", imagem: "peca9.png", alvoX: 87.68, alvoY: 15.19, largura: 12.32, inicioX: 82, inicioY: 82 }
];

function iniciarFluxoReconstrucaoPonte1() {
  mostrarIntroducaoReconstrucaoPonte1();
}

function mostrarIntroducaoReconstrucaoPonte1() {
  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: `
      <div class="ponte1-fluxo ponte1-introducao">
        <h3 class="mini-jogo-titulo">Reconstruir a Ponte 1</h3>
        <p class="mini-jogo-subtitulo">Carrega na zona da ponte em falta para começar a reconstrução.</p>

        <div class="ponte1-imagem-wrap ponte1-imagem-original">
          <img src="${CAMINHO_PONTE1}/original-sem-ponte.png" alt="Mapa com a Ponte 1 em falta">
          <button type="button" class="ponte1-zona-cinzenta" aria-label="Começar reconstrução da Ponte 1"></button>
        </div>
      </div>
    `,
    acoes: []
  });

  const zonaCinzenta = document.querySelector(".ponte1-zona-cinzenta");
  if (zonaCinzenta) {
    zonaCinzenta.addEventListener("click", mostrarReconstrucaoPonte1);
    zonaCinzenta.focus();
  }
}

function mostrarReconstrucaoPonte1() {
  const pecasHTML = pecasReconstrucaoPonte1
    .map((peca) => `
      <button
        type="button"
        class="ponte1-peca"
        data-id="${peca.id}"
        style="left:${peca.inicioX}%; top:${peca.inicioY}%; width:${peca.largura}%;"
        aria-label="Peça da ponte"
      >
        <img src="${CAMINHO_PONTE1}/${peca.imagem}" alt="">
      </button>
    `)
    .join("");

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: `
      <div class="ponte1-fluxo ponte1-reconstrucao">
        <h3 class="mini-jogo-titulo">Monta a Ponte 1</h3>
        <p class="mini-jogo-subtitulo">Arrasta as peças para o sítio certo. Quando estiverem perto, encaixam sozinhas.</p>

        <div class="ponte1-tabuleiro" id="ponte1-tabuleiro">
          <img class="ponte1-fundo" src="${CAMINHO_PONTE1}/fundo-ponte1.png" alt="Zona de reconstrução da Ponte 1">
          <div class="ponte1-pecas-camada">
            ${pecasHTML}
          </div>
          <div class="ponte1-particulas" aria-hidden="true"></div>
        </div>

        <p id="ponte1-feedback" class="mini-jogo-mensagem">Coloca as 9 peças para reconstruir a ponte.</p>
      </div>
    `,
    acoes: []
  });

  ligarEventosReconstrucaoPonte1();
}

function ligarEventosReconstrucaoPonte1() {
  const tabuleiro = document.getElementById("ponte1-tabuleiro");
  const pecas = Array.from(document.querySelectorAll(".ponte1-peca"));

  if (!tabuleiro || pecas.length === 0) return;

  const estadoArrasto = {
    tabuleiro,
    pecaAtual: null,
    offsetX: 0,
    offsetY: 0,
    encaixadas: 0
  };

  pecas.forEach((peca) => {
    peca.addEventListener("pointerdown", (evento) => iniciarArrastoPonte1(evento, estadoArrasto));
    peca.addEventListener("keydown", (evento) => tratarTecladoPecaPonte1(evento, estadoArrasto));
  });

  document.addEventListener("pointermove", (evento) => moverPecaPonte1(evento, estadoArrasto));
  document.addEventListener("pointerup", (evento) => terminarArrastoPonte1(evento, estadoArrasto));
}

function iniciarArrastoPonte1(evento, estadoArrasto) {
  const peca = evento.currentTarget;

  if (!peca || peca.classList.contains("encaixada")) return;

  evento.preventDefault();

  const rectPeca = peca.getBoundingClientRect();

  estadoArrasto.pecaAtual = peca;
  estadoArrasto.offsetX = evento.clientX - rectPeca.left;
  estadoArrasto.offsetY = evento.clientY - rectPeca.top;

  peca.classList.add("a-arrastar");
  peca.setPointerCapture(evento.pointerId);
}

function moverPecaPonte1(evento, estadoArrasto) {
  const peca = estadoArrasto.pecaAtual;
  if (!peca) return;

  const rectTabuleiro = estadoArrasto.tabuleiro.getBoundingClientRect();
  const rectPeca = peca.getBoundingClientRect();

  const novoX = ((evento.clientX - rectTabuleiro.left - estadoArrasto.offsetX) / rectTabuleiro.width) * 100;
  const novoY = ((evento.clientY - rectTabuleiro.top - estadoArrasto.offsetY) / rectTabuleiro.height) * 100;

  const larguraPercentagem = (rectPeca.width / rectTabuleiro.width) * 100;
  const alturaPercentagem = (rectPeca.height / rectTabuleiro.height) * 100;

  peca.style.left = `${Math.max(0, Math.min(100 - larguraPercentagem, novoX))}%`;
  peca.style.top = `${Math.max(0, Math.min(100 - alturaPercentagem, novoY))}%`;
}

function terminarArrastoPonte1(evento, estadoArrasto) {
  const peca = estadoArrasto.pecaAtual;
  if (!peca) return;

  peca.classList.remove("a-arrastar");
  verificarEncaixePecaPonte1(peca, estadoArrasto);

  try {
    peca.releasePointerCapture(evento.pointerId);
  } catch (erro) {
    // Evita erro se o browser já tiver libertado o ponteiro.
  }

  estadoArrasto.pecaAtual = null;
}

function tratarTecladoPecaPonte1(evento, estadoArrasto) {
  const peca = evento.currentTarget;

  if (!peca || peca.classList.contains("encaixada")) return;
  if (evento.key !== "Enter" && evento.key !== " ") return;

  evento.preventDefault();
  encaixarPecaPonte1(peca, estadoArrasto);
}

function verificarEncaixePecaPonte1(peca, estadoArrasto) {
  const dadosPeca = pecasReconstrucaoPonte1.find((item) => item.id === peca.dataset.id);
  if (!dadosPeca) return;

  const atualX = parseFloat(peca.style.left) || 0;
  const atualY = parseFloat(peca.style.top) || 0;
  const distancia = Math.hypot(atualX - dadosPeca.alvoX, atualY - dadosPeca.alvoY);

  if (distancia <= 8) {
    encaixarPecaPonte1(peca, estadoArrasto);
    return;
  }

  const feedback = document.getElementById("ponte1-feedback");
  if (feedback) feedback.textContent = "Quase! Aproxima melhor essa peça da zona certa.";
}

function encaixarPecaPonte1(peca, estadoArrasto) {
  const dadosPeca = pecasReconstrucaoPonte1.find((item) => item.id === peca.dataset.id);
  if (!dadosPeca || peca.classList.contains("encaixada")) return;

  peca.style.left = `${dadosPeca.alvoX}%`;
  peca.style.top = `${dadosPeca.alvoY}%`;
  peca.classList.add("encaixada");
  peca.disabled = true;

  estadoArrasto.encaixadas += 1;

  tocarSom("sucesso");

  const feedback = document.getElementById("ponte1-feedback");
  if (feedback) {
    feedback.textContent = estadoArrasto.encaixadas >= pecasReconstrucaoPonte1.length
      ? "A ponte está completa!"
      : `Boa! Já colocaste ${estadoArrasto.encaixadas}/9 peças.`;
  }

  if (estadoArrasto.encaixadas >= pecasReconstrucaoPonte1.length) {
    setTimeout(mostrarPonte1Construida, 900);
  }
}

function mostrarPonte1Construida() {
  tocarSom("ponte");

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: `
      <div class="ponte1-fluxo ponte1-concluida">
        <h3 class="mini-jogo-titulo">Ponte construída!</h3>
        <p class="mini-jogo-subtitulo">As peças ficaram todas no lugar certo.</p>

        <div class="ponte1-imagem-wrap">
          <img src="${CAMINHO_PONTE1}/ponte-construida.png" alt="Ponte 1 construída">
          <div class="ponte1-brilho-final" aria-hidden="true"></div>
        </div>
      </div>
    `,
    acoes: [
      {
        texto: "Continuar",
        onClick: mostrarConfirmacaoFinalPonte1
      }
    ]
  });
}

function mostrarConfirmacaoFinalPonte1() {
  estado.pontes.ponte1 = true;
  estado.ponte1Construcao = {
    emConstrucao: false,
    materiaisInvestidos: true
  };

  atualizarEstadoVisualMapa();
  atualizarHUD();
  guardarEstado();
  verificarZonaAtual();

  abrirModal({
    etiqueta: "✨",
    titulo: "Agora já podes passar!",
    mostrarFechar: false,
    conteudo: `
      <div class="ponte1-fluxo ponte1-confirmacao">
        <div class="ponte1-imagem-wrap ponte1-imagem-original">
          <img src="${CAMINHO_PONTE1}/original.png" alt="Mapa com a Ponte 1 construída">
        </div>
        <p class="ponte1-mensagem-final">Agora já podes passar para a outra margem!</p>
      </div>
    `,
    acoes: [
      {
        texto: "Voltar ao mapa",
        onClick: () => {
          fecharModal();
          verificarZonaAtual();
        }
      }
    ]
  });
}


/* =========================
   MINI-JOGO — BARCOS NO RIO
========================= */

const CAMINHO_BARCOS_RIO = "assets/barcos-rio";
const CAMINHO_MATERIAIS_BARCOS = "assets/materiais-barcos";

const CONFIG_BARCOS_RIO = {
  ponte: "ponte2",
  materiaisNecessarios: 9,
  materiaisPorNivel: 3,
  maxErros: 3,
  faixasY: [30, 48, 66],
  niveis: [
    {
      numero: 1,
      nome: "Nível I",
      mensagemInicial: "Clica nos barcos que trazem materiais úteis para a Ponte 2.",
      mensagemVitoria: "Boa! Conseguiste juntar os três primeiros materiais.",
      maxBarcosEmEcra: 1,
      intervaloSpawn: 1650,
      velocidadeMin: 18,
      velocidadeMax: 26,
      corretos: [
        { id: "tabuas", nome: "Tábuas", imagem: `${CAMINHO_MATERIAIS_BARCOS}/materiais/madeira.png` },
        { id: "corda", nome: "Corda", imagem: `${CAMINHO_MATERIAIS_BARCOS}/materiais/corda.png` },
        { id: "pregos", nome: "Pregos", imagem: `${CAMINHO_MATERIAIS_BARCOS}/materiais/pregos.png` }
      ],
      errados: [
        { id: "peixe", nome: "Peixe", imagem: `${CAMINHO_MATERIAIS_BARCOS}/peixe.png` },
        { id: "maca", nome: "Maçã", imagem: `${CAMINHO_MATERIAIS_BARCOS}/maca.png` },
        { id: "bota", nome: "Bota", imagem: `${CAMINHO_MATERIAIS_BARCOS}/bota.png` }
      ]
    },
    {
      numero: 2,
      nome: "Nível II",
      mensagemInicial: "Agora passam mais barcos. Observa bem o objeto que cada um transporta.",
      mensagemVitoria: "Boa! Conseguiste juntar mais três materiais.",
      maxBarcosEmEcra: 2,
      intervaloSpawn: 1250,
      velocidadeMin: 22,
      velocidadeMax: 34,
      corretos: [
        { id: "vigas-madeira", nome: "Vigas de madeira", imagem: `${CAMINHO_MATERIAIS_BARCOS}/vigas-madeira.png` },
        { id: "correntes", nome: "Correntes metálicas", imagem: `${CAMINHO_MATERIAIS_BARCOS}/correntes.png` },
        { id: "martelo", nome: "Martelo", imagem: `${CAMINHO_MATERIAIS_BARCOS}/martelo.png` }
      ],
      errados: [
        { id: "guarda-chuva", nome: "Guarda-chuva", imagem: `${CAMINHO_MATERIAIS_BARCOS}/guarda_chuva.png` },
        { id: "vaso-flor", nome: "Vaso com flor", imagem: `${CAMINHO_MATERIAIS_BARCOS}/vaso-flor.png` },
        { id: "bola", nome: "Bola", imagem: `${CAMINHO_MATERIAIS_BARCOS}/bola.png` }
      ]
    },
    {
      numero: 3,
      nome: "Nível III",
      mensagemInicial: "Dica: mantém a atenção aos materiais repetidos.",
      mensagemVitoria: "Boa! Agora já tens todos os materiais necessários.",
      maxBarcosEmEcra: 3,
      intervaloSpawn: 1100,
      velocidadeMin: 22,
      velocidadeMax: 34,
      aceleracao: true,
      corretos: [
        { id: "candeeiro", nome: "Candeeiro", imagem: `${CAMINHO_MATERIAIS_BARCOS}/candeeiro.png` },
        { id: "caixa-ferramentas", nome: "Caixa de ferramentas", imagem: `${CAMINHO_MATERIAIS_BARCOS}/caixa-ferramentas.png` },
        { id: "cimento", nome: "Cimento", imagem: `${CAMINHO_MATERIAIS_BARCOS}/cimento.png` }
      ],
      errados: [
        { id: "frigideira", nome: "Frigideira", imagem: `${CAMINHO_MATERIAIS_BARCOS}/frigideira.png` },
        { id: "almofada", nome: "Almofada", imagem: `${CAMINHO_MATERIAIS_BARCOS}/almofada.png` },
        { id: "chapeu", nome: "Chapéu", imagem: `${CAMINHO_MATERIAIS_BARCOS}/chapeu.png` }
      ]
    }
  ]
};

let estadoBarcosRio = null;

function criarPergaminhoBarcosRioHTML({ titulo = "", conteudo = "", classe = "" } = {}) {
  if (typeof criarPergaminhoNarrativoHTML === "function") {
    return criarPergaminhoNarrativoHTML({ titulo, conteudo, classe });
  }

  return `
    <div class="pergaminho-narrativo ${classe}" role="document">
      <div class="pergaminho-corpo">
        ${titulo ? `<h2>${titulo}</h2>` : ""}
        <div class="pergaminho-conteudo">${conteudo}</div>
      </div>
    </div>
  `;
}

function criarAcoesDentroDoPergaminhoBarcos(container) {
  const pergaminho = container?.querySelector?.(".pergaminho-narrativo");
  if (!pergaminho) return null;

  const corpo = pergaminho.querySelector(".pergaminho-corpo") || pergaminho;
  let acoes = corpo.querySelector(".pergaminho-acoes");

  if (!acoes) {
    acoes = document.createElement("div");
    acoes.className = "pergaminho-acoes";
    corpo.appendChild(acoes);
  }

  acoes.innerHTML = "";
  return acoes;
}

function obterNivelBarcosRio(ponte = "ponte2") {
  const materiais = estado.materiais?.[ponte] || 0;
  if (materiais >= 6) return 3;
  if (materiais >= 3) return 2;
  return 1;
}

function criarEstrelasErrosBarcosRio(erros) {
  return Array.from({ length: CONFIG_BARCOS_RIO.maxErros })
    .map((_, indice) => `<span class="estrela-erro ${indice < erros ? "apagada" : ""}">⭐</span>`)
    .join("");
}

function iniciarMiniJogoBarcosRio({ ponte = "ponte2" } = {}) {
  const nivelNumero = obterNivelBarcosRio(ponte);
  const nivel = CONFIG_BARCOS_RIO.niveis.find((item) => item.numero === nivelNumero);

  if (!nivel) return;

  limparMiniJogoBarcosRio();

  estadoBarcosRio = {
    ponte,
    nivel,
    ativo: true,
    terminado: false,
    erros: 0,
    encontrados: [],
    barcos: [],
    ultimoFrame: null,
    ultimoSpawn: 0,
    proximoId: 1,
    animacaoId: null,
    mira: { x: 50, y: 50 }
  };

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: true,
    conteudo: `
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
          <img class="barcos-fundo" src="${CAMINHO_BARCOS_RIO}/fundo-rio.png" alt="" aria-hidden="true">
          <div class="barcos-camada" id="barcos-camada"></div>
          <div class="barcos-efeitos" id="barcos-efeitos"></div>
          <div class="barcos-mira" id="barcos-mira" aria-hidden="true"></div>
        </section>

        <footer class="barcos-rodape">
          <p class="mini-jogo-mensagem" id="barcos-mensagem">${nivel.mensagemInicial}</p>
        </footer>
      </div>
    `,
    acoes: []
  });

  atualizarMiraBarcosRio();
  estadoBarcosRio.animacaoId = requestAnimationFrame(atualizarLoopBarcosRio);
}

function atualizarLoopBarcosRio(timestamp) {
  if (!estadoBarcosRio || !estadoBarcosRio.ativo) return;

  if (estadoBarcosRio.ultimoFrame === null) {
    estadoBarcosRio.ultimoFrame = timestamp;
    estadoBarcosRio.ultimoSpawn = timestamp;
  }

  const delta = Math.min((timestamp - estadoBarcosRio.ultimoFrame) / 1000, 0.05);
  estadoBarcosRio.ultimoFrame = timestamp;

  const vivos = estadoBarcosRio.barcos.filter((barco) => !barco.remover);
  estadoBarcosRio.barcos = vivos;

  const tempoDesdeSpawn = timestamp - estadoBarcosRio.ultimoSpawn;
  if (
    vivos.length < estadoBarcosRio.nivel.maxBarcosEmEcra &&
    tempoDesdeSpawn >= estadoBarcosRio.nivel.intervaloSpawn
  ) {
    criarBarcoRio();
    estadoBarcosRio.ultimoSpawn = timestamp;
  }

  moverBarcosRio(delta);
  estadoBarcosRio.animacaoId = requestAnimationFrame(atualizarLoopBarcosRio);
}

function criarBarcoRio() {
  if (!estadoBarcosRio || estadoBarcosRio.terminado) return;

  const camada = document.getElementById("barcos-camada");
  if (!camada) return;

  const nivel = estadoBarcosRio.nivel;
  const corretosPorEncontrar = nivel.corretos.filter(
    (item) => !estadoBarcosRio.encontrados.includes(item.id)
  );

  const deveSerCorreto = corretosPorEncontrar.length > 0 && Math.random() < 0.58;
  const lista = deveSerCorreto ? corretosPorEncontrar : nivel.errados;
  const item = lista[Math.floor(Math.random() * lista.length)];
  const direcao = Math.random() < 0.5 ? "direita" : "esquerda";
  const faixa = CONFIG_BARCOS_RIO.faixasY[Math.floor(Math.random() * CONFIG_BARCOS_RIO.faixasY.length)];
  const velocidadeBase = nivel.velocidadeMin + Math.random() * (nivel.velocidadeMax - nivel.velocidadeMin);

  const barco = {
    id: `barco-rio-${estadoBarcosRio.proximoId++}`,
    tipo: deveSerCorreto ? "correto" : "errado",
    item,
    x: direcao === "direita" ? -18 : 118,
    y: faixa,
    direcao,
    velocidade: velocidadeBase,
    clicado: false,
    remover: false,
    aceleracao: nivel.aceleracao ? 1 + Math.random() * 0.12 : 1
  };

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `barco-rio barco-${barco.tipo} direcao-${direcao}`;
  botao.dataset.id = barco.id;
  botao.setAttribute("aria-label", `${item.nome}`);
  botao.innerHTML = `
    <img class="barco-rio-img" src="${CAMINHO_BARCOS_RIO}/barco.png" alt="" aria-hidden="true">
    <img class="barco-rio-item" src="${item.imagem}" alt="${item.nome}">
  `;

  botao.addEventListener("click", () => selecionarBarcoRio(barco.id));
  camada.appendChild(botao);
  barco.elemento = botao;

  estadoBarcosRio.barcos.push(barco);
  posicionarBarcoRio(barco);
}

function moverBarcosRio(delta) {
  if (!estadoBarcosRio) return;

  estadoBarcosRio.barcos.forEach((barco) => {
    if (barco.clicado || barco.remover) return;

    const incremento = barco.velocidade * barco.aceleracao * delta;
    barco.x += barco.direcao === "direita" ? incremento : -incremento;

    if (barco.x > 122 || barco.x < -22) {
      barco.remover = true;
      if (barco.elemento) barco.elemento.remove();
      return;
    }

    posicionarBarcoRio(barco);
  });
}

function posicionarBarcoRio(barco) {
  if (!barco.elemento) return;
  barco.elemento.style.left = `${barco.x}%`;
  barco.elemento.style.top = `${barco.y}%`;
}

function selecionarBarcoRio(id) {
  if (!estadoBarcosRio || estadoBarcosRio.terminado) return;

  const barco = estadoBarcosRio.barcos.find((item) => item.id === id);
  if (!barco || barco.clicado) return;

  barco.clicado = true;

  if (barco.tipo === "correto" && estadoBarcosRio.encontrados.includes(barco.item.id)) {
    processarMaterialDuplicadoBarcosRio(barco);
    return;
  }

  if (barco.tipo === "correto") {
    processarAcertoBarcosRio(barco);
  } else {
    processarErroBarcosRio(barco);
  }
}

function processarAcertoBarcosRio(barco) {
  tocarSom("sucesso");

  barco.elemento?.classList.add("apanhado");
  estadoBarcosRio.encontrados.push(barco.item.id);

  escreverMensagemBarcosRio(`Boa! Encontraste ${barco.item.nome}.`);

  setTimeout(() => {
    if (barco.elemento) barco.elemento.remove();
    barco.remover = true;
  }, 360);

  atualizarHUDBarcosRio();

  if (estadoBarcosRio.encontrados.length >= CONFIG_BARCOS_RIO.materiaisPorNivel) {
    estadoBarcosRio.terminado = true;
    setTimeout(mostrarVitoriaBarcosRio, 650);
  }
}

function processarMaterialDuplicadoBarcosRio(barco) {
  tocarSom("erro");

  barco.elemento?.classList.add("erro");
  estadoBarcosRio.erros += 1;

  escreverMensagemBarcosRio(`Já encontraste ${barco.item.nome}. Agora procura um material diferente.`);
  criarOndaErroBarcosRio(barco);
  atualizarHUDBarcosRio();

  setTimeout(() => {
    if (barco.elemento) barco.elemento.remove();
    barco.remover = true;
  }, 420);

  if (estadoBarcosRio.erros >= CONFIG_BARCOS_RIO.maxErros) {
    estadoBarcosRio.terminado = true;
    setTimeout(mostrarDerrotaBarcosRio, 650);
  }
}

function processarErroBarcosRio(barco) {
  tocarSom("erro");

  barco.elemento?.classList.add("erro");
  estadoBarcosRio.erros += 1;

  escreverMensagemBarcosRio("Esse objeto não ajuda a construir a ponte.");
  criarOndaErroBarcosRio(barco);
  atualizarHUDBarcosRio();

  setTimeout(() => {
    if (barco.elemento) barco.elemento.remove();
    barco.remover = true;
  }, 420);

  if (estadoBarcosRio.erros >= CONFIG_BARCOS_RIO.maxErros) {
    estadoBarcosRio.terminado = true;
    setTimeout(mostrarDerrotaBarcosRio, 650);
  }
}

function atualizarHUDBarcosRio() {
  if (!estadoBarcosRio) return;

  const contador = document.getElementById("barcos-contador");
  const tentativas = document.getElementById("barcos-tentativas");
  const totalMateriais = document.getElementById("barcos-total-materiais");

  if (contador) contador.textContent = estadoBarcosRio.encontrados.length;
  if (tentativas) tentativas.innerHTML = criarEstrelasErrosBarcosRio(estadoBarcosRio.erros);
  if (totalMateriais) totalMateriais.textContent = estado.materiais[estadoBarcosRio.ponte] || 0;
}

function escreverMensagemBarcosRio(texto) {
  const mensagem = document.getElementById("barcos-mensagem");
  if (mensagem) mensagem.textContent = texto;
}

function criarOndaErroBarcosRio(barco) {
  const efeitos = document.getElementById("barcos-efeitos");
  if (!efeitos) return;

  const onda = document.createElement("span");
  onda.className = "barcos-onda-erro";
  onda.style.left = `${barco.x}%`;
  onda.style.top = `${barco.y}%`;
  efeitos.appendChild(onda);

  setTimeout(() => onda.remove(), 620);
}

function pararBarcosRio() {
  if (!estadoBarcosRio) return;
  estadoBarcosRio.ativo = false;
  if (estadoBarcosRio.animacaoId) cancelAnimationFrame(estadoBarcosRio.animacaoId);
  estadoBarcosRio.animacaoId = null;
}

function mostrarVitoriaBarcosRio() {
  if (!estadoBarcosRio) return;

  pararBarcosRio();

  const { ponte, nivel } = estadoBarcosRio;
  const conteudo = document.querySelector(".mini-jogo-barcos");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  estado.materiais[ponte] = Math.min(
    CONFIG_BARCOS_RIO.materiaisNecessarios,
    (estado.materiais[ponte] || 0) + CONFIG_BARCOS_RIO.materiaisPorNivel
  );

  atualizarHUD();
  animarElementoHUD(elementos.materiaisJogador);
  guardarEstado();

  const itensHTML = nivel.corretos
    .map((item) => `<img src="${item.imagem}" alt="${item.nome}">`)
    .join("");

  const terminouTudo = estado.materiais[ponte] >= CONFIG_BARCOS_RIO.materiaisNecessarios;

  const proximoNivelNumero = nivel.numero + 1;
  const perguntaContinuar = terminouTudo
    ? ""
    : `<p class="barcos-pergunta-continuar">Queres gastar mais uma estrela para o Nível ${proximoNivelNumero === 2 ? "II" : "III"} deste desafio ou voltar ao mapa?</p>`;

  conteudo.innerHTML = criarPergaminhoBarcosRioHTML({
    titulo: terminouTudo ? "Materiais completos!" : "Nível concluído!",
    classe: "barcos-final pergaminho-barcos-final",
    conteudo: `
      <p>${nivel.mensagemVitoria}</p>
      <div class="pergaminho-materiais barcos-materiais-final">${itensHTML}</div>
      <p><strong>Materiais da ${nomePonte(ponte)}: ${estado.materiais[ponte]}/9</strong></p>
      ${perguntaContinuar}
    `
  });

  tocarSom("sucesso");
  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoBarcos(conteudo);
  if (!acoes) return;

  let botaoPrincipal = null;

  if (!terminouTudo) {
    const botaoContinuar = document.createElement("button");
    botaoContinuar.type = "button";
    botaoContinuar.textContent = "Aceitar o próximo desafio";
    botaoContinuar.classList.add("botao-mini-jogo");
    botaoContinuar.addEventListener("click", () => continuarBarcosRioComNovaEstrela(ponte));
    acoes.appendChild(botaoContinuar);
    botaoPrincipal = botaoContinuar;
  }

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo", "botao-secundario");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });

  acoes.appendChild(botaoVoltar);

  (botaoPrincipal || botaoVoltar).focus();
}

function continuarBarcosRioComNovaEstrela(ponte) {
  if (estado.estrelas < 1) {
    mostrarSemEstrelasBarcosRio();
    return;
  }

  estado.estrelas -= 1;
  atualizarHUD();
  animarElementoHUD(elementos.pontuacaoJogador);
  guardarEstado();

  iniciarMiniJogoBarcosRio({ ponte });
}

function mostrarSemEstrelasBarcosRio() {
  pararBarcosRio();

  const conteudo = document.querySelector(".mini-jogo-barcos, .mini-jogo-final");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  conteudo.innerHTML = criarPergaminhoBarcosRioHTML({
    titulo: "Faltam estrelas",
    classe: "barcos-final pergaminho-barcos-final",
    conteudo: `<p>Ainda não tens estrelas suficientes para continuar. Volta ao mapa e completa mais desafios.</p>`
  });

  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoBarcos(conteudo);
  if (!acoes) return;

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });

  acoes.appendChild(botaoVoltar);
  botaoVoltar.focus();
}

function mostrarDerrotaBarcosRio() {
  if (!estadoBarcosRio) return;

  pararBarcosRio();

  const conteudo = document.querySelector(".mini-jogo-barcos");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  conteudo.innerHTML = criarPergaminhoBarcosRioHTML({
    titulo: "Quase!",
    classe: "barcos-final pergaminho-barcos-final",
    conteudo: `
      <p>Perdeste as três tentativas deste nível.</p>
      <p>Não recebeste materiais desta vez. Para tentar novamente, tens de gastar outra estrela.</p>
    `
  });

  tocarSom("erroForte");
  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoBarcos(conteudo);
  if (!acoes) return;

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });

  acoes.appendChild(botaoVoltar);
  botaoVoltar.focus();
}

function moverMiraBarcosRio(tecla) {
  if (!estadoBarcosRio || estadoBarcosRio.terminado) return;

  const passo = 5;
  if (tecla === "ArrowLeft") estadoBarcosRio.mira.x -= passo;
  if (tecla === "ArrowRight") estadoBarcosRio.mira.x += passo;
  if (tecla === "ArrowUp") estadoBarcosRio.mira.y -= passo;
  if (tecla === "ArrowDown") estadoBarcosRio.mira.y += passo;

  estadoBarcosRio.mira.x = Math.max(8, Math.min(92, estadoBarcosRio.mira.x));
  estadoBarcosRio.mira.y = Math.max(18, Math.min(82, estadoBarcosRio.mira.y));
  atualizarMiraBarcosRio();
}

function atualizarMiraBarcosRio() {
  const mira = document.getElementById("barcos-mira");
  if (!mira || !estadoBarcosRio) return;

  mira.style.left = `${estadoBarcosRio.mira.x}%`;
  mira.style.top = `${estadoBarcosRio.mira.y}%`;
}

function capturarComMiraBarcosRio() {
  if (!estadoBarcosRio || estadoBarcosRio.terminado) return;

  const mira = document.getElementById("barcos-mira");
  if (!mira) return;

  const rectMira = mira.getBoundingClientRect();
  const centroMira = {
    x: rectMira.left + rectMira.width / 2,
    y: rectMira.top + rectMira.height / 2
  };

  let melhorBarco = null;
  let melhorDistancia = Infinity;

  estadoBarcosRio.barcos.forEach((barco) => {
    if (barco.clicado || barco.remover || !barco.elemento) return;
    const rect = barco.elemento.getBoundingClientRect();
    const dentro =
      centroMira.x >= rect.left - 12 &&
      centroMira.x <= rect.right + 12 &&
      centroMira.y >= rect.top - 12 &&
      centroMira.y <= rect.bottom + 12;

    if (!dentro) return;

    const centroBarco = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const distancia = Math.hypot(centroMira.x - centroBarco.x, centroMira.y - centroBarco.y);

    if (distancia < melhorDistancia) {
      melhorDistancia = distancia;
      melhorBarco = barco;
    }
  });

  if (melhorBarco) {
    selecionarBarcoRio(melhorBarco.id);
  } else {
    escreverMensagemBarcosRio("A mira não está sobre nenhum barco.");
  }
}

function limparMiniJogoBarcosRio() {
  if (!estadoBarcosRio) return;

  estadoBarcosRio.ativo = false;
  if (estadoBarcosRio.animacaoId) cancelAnimationFrame(estadoBarcosRio.animacaoId);
  estadoBarcosRio.animacaoId = null;
  estadoBarcosRio = null;
}


/* =========================
   MINI-JOGO — CARGAS PERDIDAS
========================= */

const CAMINHO_CARGAS_PERDIDAS = "assets/oficina-ponte3";
const CAMINHO_TRANSPORTES_CARGAS = `${CAMINHO_CARGAS_PERDIDAS}/transportes`;

const CONFIG_CARGAS_PERDIDAS = {
  ponte: "ponte3",
  materiaisNecessarios: 9,
  materiaisPorNivel: 3,
  maxErros: 3,
  niveis: [
    {
      numero: 1,
      nome: "Carga I",
      mensagemInicial: "Arrasta a carga que vem na vagoneta para a zona certa.",
      mensagemVitoria: "Boa! A primeira carga chegou em segurança.",
      maxObjetosEmEcra: 2,
      intervaloSpawn: 1450,
      velocidadeMin: 16,
      velocidadeMax: 20,
      faixas: [
        { y: 70, transporte: "vagoneta", direcao: "direita" }
      ],
      corretos: [
        { id: "vigas", nome: "Vigas", imagem: `${CAMINHO_MATERIAIS}/tentativa3/vigas.png` },
        { id: "correntes", nome: "Correntes", imagem: `${CAMINHO_MATERIAIS}/tentativa3/correntes.png` },
        { id: "martelo", nome: "Martelo", imagem: `${CAMINHO_MATERIAIS}/tentativa2/martelo.png` }
      ],
      errados: [
        { id: "peixe", nome: "Peixe", imagem: `${CAMINHO_MATERIAIS}/tentativa2/peixe.png` },
        { id: "maca", nome: "Maçã", imagem: `${CAMINHO_MATERIAIS}/tentativa1/maca.png` },
        { id: "almofada", nome: "Almofada", imagem: `${CAMINHO_MATERIAIS}/tentativa3/almofada.png` }
      ]
    },
    {
      numero: 2,
      nome: "Carga II",
      mensagemInicial: "As vagonetas passam nos carris. Arrasta só a carga.",
      mensagemVitoria: "Boa! A segunda carga reforçou a oficina.",
      maxObjetosEmEcra: 3,
      intervaloSpawn: 1180,
      velocidadeMin: 18,
      velocidadeMax: 22,
      faixas: [
        { y: 70, transporte: "vagoneta", direcao: "esquerda" },
        { y: 70, transporte: "vagoneta", direcao: "direita" }
      ],
      corretos: [
        { id: "pregos", nome: "Pregos", imagem: `${CAMINHO_MATERIAIS}/tentativa1/pregos.png` },
        { id: "parafusos", nome: "Parafusos", imagem: `${CAMINHO_MATERIAIS}/tentativa2/parafusos.png` },
        { id: "alicate", nome: "Alicate", imagem: `${CAMINHO_MATERIAIS}/tentativa3/alicate.png` }
      ],
      errados: [
        { id: "chapeu", nome: "Chapéu", imagem: `${CAMINHO_MATERIAIS}/tentativa2/chapeu.png` },
        { id: "flores", nome: "Flores", imagem: `${CAMINHO_MATERIAIS}/tentativa2/flores.png` },
        { id: "bolo", nome: "Bolo", imagem: `${CAMINHO_MATERIAIS}/tentativa3/bolo.png` }
      ]
    },
    {
      numero: 3,
      nome: "Carga III",
      mensagemInicial: "Última carga: observa bem antes de separar os materiais.",
      mensagemVitoria: "Boa! A carga final ficou pronta para a Ponte 3.",
      maxObjetosEmEcra: 4,
      intervaloSpawn: 980,
      velocidadeMin: 20,
      velocidadeMax: 24,
      faixas: [
        { y: 70, transporte: "vagoneta", direcao: "direita" },
        { y: 70, transporte: "vagoneta", direcao: "esquerda" },
        { y: 70, transporte: "vagoneta", direcao: "direita" }
      ],
      corretos: [
        { id: "troncos", nome: "Troncos", imagem: `${CAMINHO_MATERIAIS}/tentativa2/troncos.png` },
        { id: "corda", nome: "Corda", imagem: `${CAMINHO_MATERIAIS}/tentativa1/corda.png` },
        { id: "madeira", nome: "Madeira", imagem: `${CAMINHO_MATERIAIS}/tentativa1/madeira.png` }
      ],
      errados: [
        { id: "bola", nome: "Bola", imagem: `${CAMINHO_MATERIAIS}/tentativa1/bola.png` },
        { id: "pena", nome: "Pena", imagem: `${CAMINHO_MATERIAIS}/tentativa1/pena.png` },
        { id: "guarda_chuva", nome: "Guarda-chuva", imagem: `${CAMINHO_MATERIAIS}/tentativa3/guarda_chuva.png` }
      ]
    }
  ]
};

let estadoCargasPerdidas = null;

function obterNivelCargasPerdidas(ponte = "ponte3") {
  const materiais = estado.materiais?.[ponte] || 0;
  if (materiais >= 6) return 3;
  if (materiais >= 3) return 2;
  return 1;
}

function criarEstrelasErrosCargasPerdidas(erros) {
  return Array.from({ length: CONFIG_CARGAS_PERDIDAS.maxErros })
    .map((_, indice) => `<span class="estrela-erro ${indice < erros ? "apagada" : ""}">⭐</span>`)
    .join("");
}

function baralharCargasPerdidas(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function criarFilaCargasPerdidas(nivel) {
  const corretos = baralharCargasPerdidas(nivel.corretos).map((item) => ({
    item,
    tipo: "correto",
    destino: "construcao"
  }));

  const errados = baralharCargasPerdidas(nivel.errados).map((item) => ({
    item,
    tipo: "errado",
    destino: "descarte"
  }));

  return baralharCargasPerdidas([...corretos, ...errados]);
}

function iniciarMiniJogoCargasPerdidas({ ponte = "ponte3" } = {}) {
  const nivelNumero = obterNivelCargasPerdidas(ponte);
  const nivel = CONFIG_CARGAS_PERDIDAS.niveis.find((item) => item.numero === nivelNumero);
  if (!nivel) return;

  limparMiniJogoCargasPerdidas();

  estadoCargasPerdidas = {
    ponte,
    nivel,
    ativo: true,
    terminado: false,
    erros: 0,
    encontrados: [],
    fila: criarFilaCargasPerdidas(nivel),
    indiceAtual: 0,
    cargaAtual: null,
    aArrastar: false,
    deslocamento: { x: 0, y: 0 },
    timeouts: [],
    animacaoId: null,
    ultimoTempoAnimacao: 0
  };

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: true,
    conteudo: `
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
          <img class="mini-cargas-fundo" src="${CAMINHO_CARGAS_PERDIDAS}/fundo-oficina3.png" alt="" aria-hidden="true">
          <img class="mini-cargas-carril mini-cargas-carril-baixo" src="${CAMINHO_TRANSPORTES_CARGAS}/carril.png" alt="" aria-hidden="true">
          <img class="mini-cargas-cabo" src="${CAMINHO_TRANSPORTES_CARGAS}/cabo-supenso.png" alt="" aria-hidden="true">

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
    `,
    acoes: []
  });

  agendarTimeoutCargasPerdidas(mostrarProximaCargaCargasPerdidas, 280);
}

function mostrarProximaCargaCargasPerdidas() {
  if (!estadoCargasPerdidas || estadoCargasPerdidas.terminado) return;

  if (estadoCargasPerdidas.encontrados.length >= CONFIG_CARGAS_PERDIDAS.materiaisPorNivel) {
    estadoCargasPerdidas.terminado = true;
    agendarTimeoutCargasPerdidas(mostrarVitoriaCargasPerdidas, 420);
    return;
  }

  if (estadoCargasPerdidas.indiceAtual >= estadoCargasPerdidas.fila.length) {
    estadoCargasPerdidas.fila.push(...criarFilaCargasPerdidas(estadoCargasPerdidas.nivel));
  }

  const camada = document.getElementById("mini-cargas-camada");
  if (!camada) return;

  camada.innerHTML = "";
  cancelarAnimacaoCargaCargasPerdidas();

  const carga = estadoCargasPerdidas.fila[estadoCargasPerdidas.indiceAtual];
  const faixa = estadoCargasPerdidas.nivel.faixas[
    estadoCargasPerdidas.indiceAtual % estadoCargasPerdidas.nivel.faixas.length
  ] || { y: 70, direcao: "direita" };

  estadoCargasPerdidas.indiceAtual += 1;
  estadoCargasPerdidas.cargaAtual = {
    ...carga,
    id: `carga-triagem-${Date.now()}`,
    elemento: null,
    veiculo: null,
    resolvida: false,
    emTransito: true,
    arrastadaLivre: false,
    direcao: faixa.direcao || "direita",
    x: (faixa.direcao || "direita") === "direita" ? -12 : 112,
    y: faixa.y || 70,
    velocidade: gerarVelocidadeCargasPerdidas(estadoCargasPerdidas.nivel),
  };

  const veiculo = document.createElement("div");
  veiculo.className = "mini-cargas-veiculo";
  veiculo.innerHTML = `<img class="mini-cargas-transporte" src="${CAMINHO_TRANSPORTES_CARGAS}/vagoneta.png" alt="" aria-hidden="true">`;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `mini-cargas-carga-item mini-cargas-${carga.tipo}`;
  botao.dataset.id = estadoCargasPerdidas.cargaAtual.id;
  botao.setAttribute("aria-label", `${carga.item.nome}. Arrasta a carga para a zona correcta.`);
  botao.innerHTML = `<img src="${carga.item.imagem}" alt="${carga.item.nome}">`;
  botao.addEventListener("pointerdown", iniciarArrastoCargasPerdidas);
  botao.addEventListener("keydown", tecladoCargaCargasPerdidas);

  veiculo.appendChild(botao);
  camada.appendChild(veiculo);

  estadoCargasPerdidas.cargaAtual.elemento = botao;
  estadoCargasPerdidas.cargaAtual.veiculo = veiculo;

  posicionarVeiculoCargasPerdidas();
  iniciarMovimentoCargaAtualCargasPerdidas();
}

function gerarVelocidadeCargasPerdidas(nivel) {
  const min = nivel.velocidadeMin || 6;
  const max = nivel.velocidadeMax || 9;
  return min + Math.random() * (max - min);
}

function cancelarAnimacaoCargaCargasPerdidas() {
  if (estadoCargasPerdidas?.animacaoId) {
    cancelAnimationFrame(estadoCargasPerdidas.animacaoId);
    estadoCargasPerdidas.animacaoId = null;
  }
  if (estadoCargasPerdidas) estadoCargasPerdidas.ultimoTempoAnimacao = 0;
}

function posicionarVeiculoCargasPerdidas() {
  const carga = estadoCargasPerdidas?.cargaAtual;
  if (!carga?.veiculo) return;
  carga.veiculo.style.left = `${carga.x}%`;
  carga.veiculo.style.top = `${carga.y}%`;
  carga.veiculo.classList.toggle("sentido-esquerda", carga.direcao === "esquerda");
}

function iniciarMovimentoCargaAtualCargasPerdidas() {
  if (!estadoCargasPerdidas?.cargaAtual || estadoCargasPerdidas.terminado) return;

  const animar = (tempo) => {
    if (!estadoCargasPerdidas || estadoCargasPerdidas.terminado) return;
    const carga = estadoCargasPerdidas.cargaAtual;
    if (!carga || carga.resolvida || !carga.veiculo) return;

    if (!estadoCargasPerdidas.ultimoTempoAnimacao) estadoCargasPerdidas.ultimoTempoAnimacao = tempo;
    const delta = Math.min((tempo - estadoCargasPerdidas.ultimoTempoAnimacao) / 1000, 0.05);
    estadoCargasPerdidas.ultimoTempoAnimacao = tempo;

    const sinal = carga.direcao === "direita" ? 1 : -1;
    carga.x += sinal * carga.velocidade * delta;
    posicionarVeiculoCargasPerdidas();

    const saiu = carga.direcao === "direita" ? carga.x > 112 : carga.x < -12;
    if (saiu && !carga.arrastadaLivre) {
      processarCargaPerdidaPorTempoCargasPerdidas(carga);
      return;
    }

    estadoCargasPerdidas.animacaoId = requestAnimationFrame(animar);
  };

  cancelarAnimacaoCargaCargasPerdidas();
  estadoCargasPerdidas.animacaoId = requestAnimationFrame(animar);
}

function processarCargaPerdidaPorTempoCargasPerdidas(carga) {
  if (!estadoCargasPerdidas || carga.resolvida) return;
  carga.resolvida = true;
  estadoCargasPerdidas.erros += 1;
  escreverMensagemCargasPerdidas(`${carga.item.nome} passou sem ser separado.`);
  atualizarHUDCargasPerdidas();
  carga.veiculo?.remove();

  if (estadoCargasPerdidas.erros >= CONFIG_CARGAS_PERDIDAS.maxErros) {
    estadoCargasPerdidas.terminado = true;
    agendarTimeoutCargasPerdidas(mostrarDerrotaCargasPerdidas, 720);
    return;
  }

  agendarTimeoutCargasPerdidas(mostrarProximaCargaCargasPerdidas, 520);
}

function posicionarCargaAtualCargasPerdidas(x, y) {
  const carga = estadoCargasPerdidas?.cargaAtual;
  if (!carga?.elemento) return;
  carga.elemento.style.left = `${x}%`;
  carga.elemento.style.top = `${y}%`;
}

function obterCentroElementoNaAreaCargasPerdidas(elemento) {
  const area = document.getElementById("mini-cargas-area");
  if (!area || !elemento) return { x: 50, y: 50 };
  const areaRect = area.getBoundingClientRect();
  const rect = elemento.getBoundingClientRect();
  return {
    x: ((rect.left + rect.width / 2 - areaRect.left) / areaRect.width) * 100,
    y: ((rect.top + rect.height / 2 - areaRect.top) / areaRect.height) * 100
  };
}

function iniciarArrastoCargasPerdidas(evento) {
  if (!estadoCargasPerdidas || estadoCargasPerdidas.terminado) return;

  const carga = estadoCargasPerdidas.cargaAtual;
  if (!carga?.elemento || carga.resolvida) return;

  evento.preventDefault();
  carga.elemento.setPointerCapture?.(evento.pointerId);

  const camada = document.getElementById("mini-cargas-camada");
  const centro = obterCentroElementoNaAreaCargasPerdidas(carga.elemento);
  const rect = carga.elemento.getBoundingClientRect();

  estadoCargasPerdidas.aArrastar = true;
  estadoCargasPerdidas.deslocamento = {
    x: evento.clientX - rect.left,
    y: evento.clientY - rect.top
  };

  carga.arrastadaLivre = true;
  cancelarAnimacaoCargaCargasPerdidas();
  if (camada && carga.elemento.parentElement !== camada) {
    camada.appendChild(carga.elemento);
  }
  carga.elemento.classList.add("a-arrastar", "livre");
  posicionarCargaAtualCargasPerdidas(centro.x, centro.y);
  carga.elemento.addEventListener("pointermove", moverArrastoCargasPerdidas);
  carga.elemento.addEventListener("pointerup", terminarArrastoCargasPerdidas, { once: true });
  carga.elemento.addEventListener("pointercancel", cancelarArrastoCargasPerdidas, { once: true });
}

function moverArrastoCargasPerdidas(evento) {
  if (!estadoCargasPerdidas?.aArrastar) return;

  const area = document.getElementById("mini-cargas-area");
  const carga = estadoCargasPerdidas.cargaAtual;
  if (!area || !carga?.elemento) return;

  const areaRect = area.getBoundingClientRect();
  const x = ((evento.clientX - estadoCargasPerdidas.deslocamento.x - areaRect.left + carga.elemento.offsetWidth / 2) / areaRect.width) * 100;
  const y = ((evento.clientY - estadoCargasPerdidas.deslocamento.y - areaRect.top + carga.elemento.offsetHeight / 2) / areaRect.height) * 100;

  posicionarCargaAtualCargasPerdidas(
    Math.max(4, Math.min(96, x)),
    Math.max(8, Math.min(92, y))
  );

  destacarZonaCargasPerdidas(evento.clientX, evento.clientY);
}

function terminarArrastoCargasPerdidas(evento) {
  if (!estadoCargasPerdidas) return;

  const carga = estadoCargasPerdidas.cargaAtual;
  if (carga?.elemento) {
    carga.elemento.classList.remove("a-arrastar");
    carga.elemento.removeEventListener("pointermove", moverArrastoCargasPerdidas);
  }

  estadoCargasPerdidas.aArrastar = false;
  limparDestaqueZonasCargasPerdidas();

  const zona = obterZonaNoPontoCargasPerdidas(evento.clientX, evento.clientY);
  if (!zona) {
    escreverMensagemCargasPerdidas("Larga a carga numa das zonas: Construção ou Descarte.");
    devolverCargaAVagonetaCargasPerdidas();
    return;
  }

  avaliarTriagemCargasPerdidas(zona);
}

function devolverCargaAVagonetaCargasPerdidas() {
  const carga = estadoCargasPerdidas?.cargaAtual;
  if (!carga?.elemento || !carga?.veiculo || carga.resolvida) return;
  carga.arrastadaLivre = false;
  carga.elemento.classList.remove("livre", "a-arrastar");
  carga.elemento.removeAttribute("style");
  carga.veiculo.appendChild(carga.elemento);
  iniciarMovimentoCargaAtualCargasPerdidas();
}

function cancelarArrastoCargasPerdidas() {
  if (!estadoCargasPerdidas) return;
  estadoCargasPerdidas.aArrastar = false;
  limparDestaqueZonasCargasPerdidas();
  devolverCargaAVagonetaCargasPerdidas();
}

function tecladoCargaCargasPerdidas(evento) {
  if (!estadoCargasPerdidas || estadoCargasPerdidas.terminado) return;

  if (evento.key === "ArrowLeft") {
    evento.preventDefault();
    avaliarTriagemCargasPerdidas("construcao");
  }

  if (evento.key === "ArrowRight") {
    evento.preventDefault();
    avaliarTriagemCargasPerdidas("descarte");
  }
}

function obterZonaNoPontoCargasPerdidas(clientX, clientY) {
  const zonas = document.querySelectorAll(".mini-cargas-zona");

  for (const zona of zonas) {
    const rect = zona.getBoundingClientRect();
    const dentro = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    if (dentro) return zona.dataset.zona;
  }

  return null;
}

function destacarZonaCargasPerdidas(clientX, clientY) {
  const zonaAtual = obterZonaNoPontoCargasPerdidas(clientX, clientY);
  document.querySelectorAll(".mini-cargas-zona").forEach((zona) => {
    zona.classList.toggle("ativa", zona.dataset.zona === zonaAtual);
  });
}

function limparDestaqueZonasCargasPerdidas() {
  document.querySelectorAll(".mini-cargas-zona").forEach((zona) => zona.classList.remove("ativa"));
}

function avaliarTriagemCargasPerdidas(zonaEscolhida) {
  if (!estadoCargasPerdidas || estadoCargasPerdidas.terminado) return;

  const carga = estadoCargasPerdidas.cargaAtual;
  if (!carga || carga.resolvida) return;

  carga.resolvida = true;

  if (zonaEscolhida === carga.destino) {
    if (carga.tipo === "correto") {
      processarAcertoCargasPerdidas(carga);
    } else {
      processarDescarteCorretoCargasPerdidas(carga);
    }
  } else {
    processarErroCargasPerdidas(carga);
  }
}

function processarAcertoCargasPerdidas(carga) {
  tocarSom("sucesso");
  carga.elemento?.classList.add("apanhado");
  estadoCargasPerdidas.encontrados.push(carga.item.id);

  escreverMensagemCargasPerdidas(`Boa! ${carga.item.nome} foi para a Construção.`);
  criarEfeitoCargasPerdidas(carga, "acerto");
  atualizarHUDCargasPerdidas();

  agendarTimeoutCargasPerdidas(() => {
    carga.elemento?.remove();
    carga.veiculo?.remove();
    mostrarProximaCargaCargasPerdidas();
  }, 520);
}

function processarDescarteCorretoCargasPerdidas(carga) {
  tocarSom("sucesso");
  carga.elemento?.classList.add("descartado");

  escreverMensagemCargasPerdidas(`Certo. ${carga.item.nome} não ajuda a ponte e foi para Descarte.`);
  criarEfeitoCargasPerdidas(carga, "acerto");

  agendarTimeoutCargasPerdidas(() => {
    carga.elemento?.remove();
    carga.veiculo?.remove();
    mostrarProximaCargaCargasPerdidas();
  }, 520);
}

function processarErroCargasPerdidas(carga) {
  tocarSom("erro");
  carga.elemento?.classList.add("erro");
  estadoCargasPerdidas.erros += 1;

  const mensagem = carga.destino === "construcao"
    ? `${carga.item.nome} era material útil. Devia ir para Construção.`
    : `${carga.item.nome} não serve para a ponte. Devia ir para Descarte.`;

  escreverMensagemCargasPerdidas(mensagem);
  criarEfeitoCargasPerdidas(carga, "erro");
  atualizarHUDCargasPerdidas();

  if (estadoCargasPerdidas.erros >= CONFIG_CARGAS_PERDIDAS.maxErros) {
    estadoCargasPerdidas.terminado = true;
    agendarTimeoutCargasPerdidas(mostrarDerrotaCargasPerdidas, 720);
    return;
  }

  agendarTimeoutCargasPerdidas(() => {
    carga.elemento?.remove();
    carga.veiculo?.remove();
    mostrarProximaCargaCargasPerdidas();
  }, 760);
}

function atualizarHUDCargasPerdidas() {
  if (!estadoCargasPerdidas) return;

  const contador = document.getElementById("mini-cargas-contador");
  const tentativas = document.getElementById("mini-cargas-tentativas");
  const total = document.getElementById("mini-cargas-total");

  if (contador) contador.textContent = estadoCargasPerdidas.encontrados.length;
  if (tentativas) tentativas.innerHTML = criarEstrelasErrosCargasPerdidas(estadoCargasPerdidas.erros);
  if (total) total.textContent = estado.materiais[estadoCargasPerdidas.ponte] || 0;
}

function escreverMensagemCargasPerdidas(texto) {
  const mensagem = document.getElementById("mini-cargas-mensagem");
  if (mensagem) mensagem.textContent = texto;
}

function criarEfeitoCargasPerdidas(carga, tipo) {
  const efeitos = document.getElementById("mini-cargas-efeitos");
  if (!efeitos || !carga?.elemento) return;

  const area = document.getElementById("mini-cargas-area");
  const areaRect = area?.getBoundingClientRect();
  const cargaRect = carga.elemento.getBoundingClientRect();

  const x = areaRect ? ((cargaRect.left + cargaRect.width / 2 - areaRect.left) / areaRect.width) * 100 : 50;
  const y = areaRect ? ((cargaRect.top + cargaRect.height / 2 - areaRect.top) / areaRect.height) * 100 : 50;

  const efeito = document.createElement("span");
  efeito.className = `mini-cargas-efeito mini-cargas-efeito-${tipo}`;
  efeito.style.left = `${x}%`;
  efeito.style.top = `${y}%`;
  efeitos.appendChild(efeito);

  agendarTimeoutCargasPerdidas(() => efeito.remove(), 640);
}

function pararCargasPerdidas() {
  if (!estadoCargasPerdidas) return;
  estadoCargasPerdidas.ativo = false;
  cancelarAnimacaoCargaCargasPerdidas();
  estadoCargasPerdidas.timeouts.forEach((id) => clearTimeout(id));
  estadoCargasPerdidas.timeouts = [];
}

function mostrarVitoriaCargasPerdidas() {
  if (!estadoCargasPerdidas) return;

  pararCargasPerdidas();

  const { ponte, nivel } = estadoCargasPerdidas;
  const conteudo = document.querySelector(".mini-cargas");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  estado.materiais[ponte] = Math.min(
    CONFIG_CARGAS_PERDIDAS.materiaisNecessarios,
    (estado.materiais[ponte] || 0) + CONFIG_CARGAS_PERDIDAS.materiaisPorNivel
  );

  atualizarHUD();
  animarElementoHUD(elementos.materiaisJogador);
  guardarEstado();

  const terminouTudo = estado.materiais[ponte] >= CONFIG_CARGAS_PERDIDAS.materiaisNecessarios;
  const itensHTML = nivel.corretos
    .map((item) => `<img src="${item.imagem}" alt="${item.nome}">`)
    .join("");

  const perguntaContinuar = terminouTudo
    ? ""
    : `<p class="mini-cargas-pergunta">Queres gastar mais uma estrela para separar a próxima carga?</p>`;

  conteudo.innerHTML = criarPergaminhoCargasPerdidasHTML({
    titulo: terminouTudo ? "Cargas completas!" : "Carga separada!",
    classe: "mini-cargas-final",
    conteudo: `
      <p>${nivel.mensagemVitoria}</p>
      <div class="mini-cargas-materiais-final">${itensHTML}</div>
      <p><strong>Materiais da ${nomePonte(ponte)}: ${estado.materiais[ponte]}/9</strong></p>
      ${perguntaContinuar}
    `
  });

  tocarSom("sucesso");
  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoCargas(conteudo);
  if (!acoes) return;

  let botaoPrincipal = null;

  if (!terminouTudo) {
    const botaoContinuar = document.createElement("button");
    botaoContinuar.type = "button";
    botaoContinuar.textContent = "Separar a próxima carga";
    botaoContinuar.classList.add("botao-mini-jogo");
    botaoContinuar.addEventListener("click", () => continuarCargasPerdidasComNovaEstrela(ponte));
    acoes.appendChild(botaoContinuar);
    botaoPrincipal = botaoContinuar;
  }

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo", "botao-secundario");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });
  acoes.appendChild(botaoVoltar);

  (botaoPrincipal || botaoVoltar).focus();
}

function continuarCargasPerdidasComNovaEstrela(ponte) {
  if (estado.estrelas < 1) {
    mostrarSemEstrelasCargasPerdidas();
    return;
  }

  estado.estrelas -= 1;
  atualizarHUD();
  animarElementoHUD(elementos.pontuacaoJogador);
  guardarEstado();

  iniciarMiniJogoCargasPerdidas({ ponte });
}

function mostrarSemEstrelasCargasPerdidas() {
  pararCargasPerdidas();

  const conteudo = document.querySelector(".mini-cargas, .mini-cargas-final");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  conteudo.innerHTML = criarPergaminhoCargasPerdidasHTML({
    titulo: "Faltam estrelas",
    classe: "mini-cargas-final",
    conteudo: `<p>Ainda não tens estrelas suficientes para continuar. Volta ao mapa e completa mais desafios.</p>`
  });

  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoCargas(conteudo);
  if (!acoes) return;

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });
  acoes.appendChild(botaoVoltar);
  botaoVoltar.focus();
}

function mostrarDerrotaCargasPerdidas() {
  if (!estadoCargasPerdidas) return;

  pararCargasPerdidas();

  const conteudo = document.querySelector(".mini-cargas");
  const acoesExternas = elementos.modalAcoes;
  if (!conteudo) return;

  conteudo.innerHTML = criarPergaminhoCargasPerdidasHTML({
    titulo: "Quase!",
    classe: "mini-cargas-final",
    conteudo: `
      <p>Erraste três vezes na triagem desta carga.</p>
      <p>Não recebeste materiais desta vez. Para tentar novamente, tens de gastar outra estrela.</p>
    `
  });

  tocarSom("erroForte");
  if (acoesExternas) acoesExternas.innerHTML = "";
  const acoes = criarAcoesDentroDoPergaminhoCargas(conteudo);
  if (!acoes) return;

  const botaoVoltar = document.createElement("button");
  botaoVoltar.type = "button";
  botaoVoltar.textContent = "Voltar ao mapa";
  botaoVoltar.classList.add("botao-mini-jogo");
  botaoVoltar.addEventListener("click", () => {
    fecharModal();
    verificarZonaAtual();
  });
  acoes.appendChild(botaoVoltar);
  botaoVoltar.focus();
}

function criarPergaminhoCargasPerdidasHTML({ titulo = "", conteudo = "", classe = "" } = {}) {
  if (typeof criarPergaminhoNarrativoHTML === "function") {
    return criarPergaminhoNarrativoHTML({ titulo, conteudo, classe });
  }

  return `
    <div class="pergaminho-narrativo ${classe}" role="document">
      <div class="pergaminho-corpo">
        ${titulo ? `<h2>${titulo}</h2>` : ""}
        <div class="pergaminho-conteudo">${conteudo}</div>
      </div>
    </div>
  `;
}

function criarAcoesDentroDoPergaminhoCargas(container) {
  const pergaminho = container?.querySelector?.(".pergaminho-narrativo");
  if (!pergaminho) return null;

  const corpo = pergaminho.querySelector(".pergaminho-corpo") || pergaminho;
  let acoes = corpo.querySelector(".pergaminho-acoes");

  if (!acoes) {
    acoes = document.createElement("div");
    acoes.className = "pergaminho-acoes";
    corpo.appendChild(acoes);
  }

  acoes.innerHTML = "";
  return acoes;
}

function agendarTimeoutCargasPerdidas(callback, tempo) {
  if (!estadoCargasPerdidas) return null;
  const id = setTimeout(callback, tempo);
  estadoCargasPerdidas.timeouts.push(id);
  return id;
}

function limparMiniJogoCargasPerdidas() {
  if (!estadoCargasPerdidas) return;

  estadoCargasPerdidas.ativo = false;
  cancelarAnimacaoCargaCargasPerdidas();
  estadoCargasPerdidas.timeouts.forEach((id) => clearTimeout(id));
  estadoCargasPerdidas.timeouts = [];

  const carga = estadoCargasPerdidas.cargaAtual;
  if (carga?.elemento) {
    carga.elemento.removeEventListener("pointermove", moverArrastoCargasPerdidas);
    carga.elemento.remove();
  }

  estadoCargasPerdidas = null;
}



/* =========================================================
   MINI-JOGO — PONTE 2: RECONSTRUIR O FLUXO
   Mecânica nova:
   - puzzle visual de rotação de canais;
   - dificuldade média;
   - 3 lanternas para acender;
   - sem sequência guiada por texto.
   ========================================================= */

const CAMINHO_PONTE2 = "assets/ponte2";

const DIRECOES_FLUXO2 = {
  N: { dx: 0, dy: -1, oposta: "S" },
  E: { dx: 1, dy: 0, oposta: "W" },
  S: { dx: 0, dy: 1, oposta: "N" },
  W: { dx: -1, dy: 0, oposta: "E" }
};

const CONECTORES_BASE_FLUXO2 = {
  fonte: ["E"],
  lanterna: ["W"],
  linha: ["E", "W"],
  curva: ["N", "E"],
  t: ["N", "E", "S"],
  cruz: ["N", "E", "S", "W"],
  vazio: []
};

const ROTACAO_DIRECOES_FLUXO2 = {
  0: { N: "N", E: "E", S: "S", W: "W" },
  90: { N: "E", E: "S", S: "W", W: "N" },
  180: { N: "S", E: "W", S: "N", W: "E" },
  270: { N: "W", E: "N", S: "E", W: "S" }
};

const CONFIG_FLUXO_PONTE2 = {
  colunas: 5,
  linhas: 5,
  lanternasNecessarias: 3,
  pecas: [
    { id: "0-0", tipo: "vazio", x: 0, y: 0, fixa: true },
    { id: "1-0", tipo: "curva", x: 1, y: 0, rotacao: 180, decorativa: true },
    { id: "2-0", tipo: "curva", x: 2, y: 0, rotacao: 180, solucao: 90 },
    { id: "3-0", tipo: "linha", x: 3, y: 0, rotacao: 90, solucao: 0 },
    { id: "4-0", tipo: "lanterna", x: 4, y: 0, rotacao: 0, fixa: true, nome: "Lanterna superior" },

    { id: "0-1", tipo: "vazio", x: 0, y: 1, fixa: true },
    { id: "1-1", tipo: "curva", x: 1, y: 1, rotacao: 90, decorativa: true },
    { id: "2-1", tipo: "linha", x: 2, y: 1, rotacao: 0, solucao: 90 },
    { id: "3-1", tipo: "t", x: 3, y: 1, rotacao: 180, decorativa: true },
    { id: "4-1", tipo: "vazio", x: 4, y: 1, fixa: true },

    { id: "0-2", tipo: "fonte", x: 0, y: 2, rotacao: 0, fixa: true, nome: "Cristal principal" },
    { id: "1-2", tipo: "linha", x: 1, y: 2, rotacao: 90, solucao: 0 },
    { id: "2-2", tipo: "cruz", x: 2, y: 2, rotacao: 0, fixa: true },
    { id: "3-2", tipo: "linha", x: 3, y: 2, rotacao: 90, solucao: 0 },
    { id: "4-2", tipo: "lanterna", x: 4, y: 2, rotacao: 0, fixa: true, nome: "Lanterna central" },

    { id: "0-3", tipo: "curva", x: 0, y: 3, rotacao: 270, decorativa: true },
    { id: "1-3", tipo: "t", x: 1, y: 3, rotacao: 0, decorativa: true },
    { id: "2-3", tipo: "linha", x: 2, y: 3, rotacao: 0, solucao: 90 },
    { id: "3-3", tipo: "t", x: 3, y: 3, rotacao: 270, decorativa: true },
    { id: "4-3", tipo: "vazio", x: 4, y: 3, fixa: true },

    { id: "0-4", tipo: "vazio", x: 0, y: 4, fixa: true },
    { id: "1-4", tipo: "curva", x: 1, y: 4, rotacao: 90, decorativa: true },
    { id: "2-4", tipo: "curva", x: 2, y: 4, rotacao: 270, solucao: 0 },
    { id: "3-4", tipo: "linha", x: 3, y: 4, rotacao: 90, solucao: 0 },
    { id: "4-4", tipo: "lanterna", x: 4, y: 4, rotacao: 0, fixa: true, nome: "Lanterna inferior" }
  ]
};

let estadoFluxoPonte2 = null;

function criarEstadoInicialFluxoPonte2() {
  const pecas = {};

  CONFIG_FLUXO_PONTE2.pecas.forEach((peca) => {
    pecas[peca.id] = {
      ...peca,
      rotacao: normalizarRotacaoFluxo2(peca.rotacao || 0)
    };
  });

  return {
    ponte: "ponte2",
    pecas,
    lanternasAcesas: [],
    pecasAtivas: [],
    concluido: false
  };
}

function normalizarRotacaoFluxo2(rotacao) {
  return ((rotacao % 360) + 360) % 360;
}

function rodarDirecaoFluxo2(direcao, rotacao) {
  const mapa = ROTACAO_DIRECOES_FLUXO2[normalizarRotacaoFluxo2(rotacao)] || ROTACAO_DIRECOES_FLUXO2[0];
  return mapa[direcao];
}

function obterConectoresFluxo2(peca) {
  const base = CONECTORES_BASE_FLUXO2[peca.tipo] || [];
  return base.map((direcao) => rodarDirecaoFluxo2(direcao, peca.rotacao || 0));
}

function obterPecaFluxo2(x, y) {
  if (!estadoFluxoPonte2) return null;
  return estadoFluxoPonte2.pecas[`${x}-${y}`] || null;
}

function pecaLigaFluxo2(origem, destino, direcao) {
  if (!origem || !destino) return false;

  const conectoresOrigem = obterConectoresFluxo2(origem);
  const conectoresDestino = obterConectoresFluxo2(destino);
  const oposta = DIRECOES_FLUXO2[direcao]?.oposta;

  return conectoresOrigem.includes(direcao) && conectoresDestino.includes(oposta);
}

function calcularFluxoAtivoPonte2() {
  if (!estadoFluxoPonte2) {
    return { ativas: [], lanternas: [] };
  }

  const origem = Object.values(estadoFluxoPonte2.pecas).find((peca) => peca.tipo === "fonte");
  if (!origem) return { ativas: [], lanternas: [] };

  const visitadas = new Set([origem.id]);
  const fila = [origem];

  while (fila.length > 0) {
    const atual = fila.shift();

    Object.entries(DIRECOES_FLUXO2).forEach(([direcao, delta]) => {
      const vizinha = obterPecaFluxo2(atual.x + delta.dx, atual.y + delta.dy);

      if (!vizinha || vizinha.tipo === "vazio" || visitadas.has(vizinha.id)) {
        return;
      }

      if (pecaLigaFluxo2(atual, vizinha, direcao)) {
        visitadas.add(vizinha.id);
        fila.push(vizinha);
      }
    });
  }

  const lanternas = Object.values(estadoFluxoPonte2.pecas)
    .filter((peca) => peca.tipo === "lanterna" && visitadas.has(peca.id))
    .map((peca) => peca.id);

  return {
    ativas: Array.from(visitadas),
    lanternas
  };
}

function iniciarMiniJogoLigacoesLuminosas({ ponte = "ponte2" } = {}) {
  estadoFluxoPonte2 = criarEstadoInicialFluxoPonte2();
  estadoFluxoPonte2.ponte = ponte;

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: `
      <div class="fluxo2-mini-jogo" aria-label="Mini-jogo Reconstruir o Fluxo">
        <div class="fluxo2-cenario">
          <img class="fluxo2-fundo" src="${CAMINHO_PONTE2}/ponte-inativa.png" alt="Ponte 2 adormecida">
          <img class="fluxo2-fundo fluxo2-fundo-ativa" src="${CAMINHO_PONTE2}/ponte-ativa.png" alt="" aria-hidden="true">

          <header class="fluxo2-cabecalho">
            <div>
              <h3 class="mini-jogo-titulo">Reconstruir o Fluxo</h3>
              <p class="mini-jogo-subtitulo">
                Roda os canais mágicos para levar a energia do cristal até às 3 lanternas.
              </p>
            </div>

            <div class="fluxo2-hud" aria-label="Progresso">
              <span>Lanternas <strong id="fluxo2-contador">0/3</strong></span>
            </div>
          </header>

          <div class="fluxo2-tabuleiro" id="fluxo2-tabuleiro"></div>

          <p class="fluxo2-feedback" id="fluxo2-feedback">
            Clica nos canais para os rodar. A energia só passa quando os caminhos ficam ligados.
          </p>
        </div>
      </div>
    `,
    acoes: []
  });

  renderizarFluxoPonte2();
  atualizarFluxoPonte2();
}

function criarHTMLPecaFluxo2(peca) {
  if (peca.tipo === "vazio") {
    return `<div class="fluxo2-peca fluxo2-vazia" data-id="${peca.id}" aria-hidden="true"></div>`;
  }

  const conectores = obterConectoresFluxo2(peca);
  const canaisHTML = conectores
    .map((direcao) => `<span class="fluxo2-canal fluxo2-canal-${direcao.toLowerCase()}"></span>`)
    .join("");

  const fixa = peca.fixa ? "fluxo2-fixa" : "";
  const decorativa = peca.decorativa ? "fluxo2-decorativa" : "";
  const rotavel = !peca.fixa && peca.tipo !== "vazio";

  let interior = "";

  if (peca.tipo === "fonte") {
    interior = `<img class="fluxo2-asset fluxo2-fonte" src="${CAMINHO_PONTE2}/cristal-central.png" alt="">`;
  } else if (peca.tipo === "lanterna") {
    const acesa = estadoFluxoPonte2?.lanternasAcesas?.includes(peca.id);
    interior = `<img class="fluxo2-asset fluxo2-lanterna" src="${CAMINHO_PONTE2}/${acesa ? "lanterna-ativa" : "lanterna-inativa"}.png" alt="">`;
  } else {
    interior = `
      <img class="fluxo2-base-runa" src="${CAMINHO_PONTE2}/runa-magica.png" alt="">
      <span class="fluxo2-canais">${canaisHTML}<span class="fluxo2-nucleo"></span></span>
    `;
  }

  if (rotavel) {
    return `
      <button
        type="button"
        class="fluxo2-peca fluxo2-tipo-${peca.tipo} ${fixa} ${decorativa}"
        data-id="${peca.id}"
        aria-label="Rodar canal mágico"
      >
        ${interior}
      </button>
    `;
  }

  return `
    <div
      class="fluxo2-peca fluxo2-tipo-${peca.tipo} ${fixa}"
      data-id="${peca.id}"
      aria-label="${peca.nome || "Peça fixa"}"
    >
      ${interior}
    </div>
  `;
}

function renderizarFluxoPonte2() {
  const tabuleiro = document.getElementById("fluxo2-tabuleiro");
  if (!tabuleiro || !estadoFluxoPonte2) return;

  const pecasOrdenadas = [];

  for (let y = 0; y < CONFIG_FLUXO_PONTE2.linhas; y += 1) {
    for (let x = 0; x < CONFIG_FLUXO_PONTE2.colunas; x += 1) {
      pecasOrdenadas.push(estadoFluxoPonte2.pecas[`${x}-${y}`]);
    }
  }

  tabuleiro.style.setProperty("--fluxo2-colunas", CONFIG_FLUXO_PONTE2.colunas);
  tabuleiro.innerHTML = pecasOrdenadas.map(criarHTMLPecaFluxo2).join("");

  tabuleiro.querySelectorAll("button.fluxo2-peca").forEach((botao) => {
    botao.addEventListener("click", () => rodarPecaFluxo2(botao.dataset.id));
  });

  aplicarEstadoVisualFluxo2();
}

function rodarPecaFluxo2(id) {
  if (!estadoFluxoPonte2 || estadoFluxoPonte2.concluido) return;

  const peca = estadoFluxoPonte2.pecas[id];
  if (!peca || peca.fixa || peca.tipo === "vazio") return;

  peca.rotacao = normalizarRotacaoFluxo2((peca.rotacao || 0) + 90);
  tocarSom("click");

  renderizarFluxoPonte2();
  atualizarFluxoPonte2();
}

function aplicarEstadoVisualFluxo2() {
  if (!estadoFluxoPonte2) return;

  const ativas = new Set(estadoFluxoPonte2.pecasAtivas || []);
  const lanternas = new Set(estadoFluxoPonte2.lanternasAcesas || []);

  document.querySelectorAll(".fluxo2-peca").forEach((elemento) => {
    const id = elemento.dataset.id;
    const peca = estadoFluxoPonte2.pecas[id];

    const lanternaAcesa = lanternas.has(id);

    elemento.classList.toggle("fluxo2-ativa", ativas.has(id));
    elemento.classList.toggle("fluxo2-lanterna-acesa", lanternaAcesa);

    if (peca && peca.tipo === "lanterna") {
      const imagemLanterna = elemento.querySelector(".fluxo2-lanterna");
      if (imagemLanterna) {
        imagemLanterna.src = `${CAMINHO_PONTE2}/${lanternaAcesa ? "lanterna-ativa" : "lanterna-inativa"}.png`;
      }
    }

    if (peca && peca.tipo !== "vazio") {
      elemento.style.setProperty("--rotacao-peca", `${peca.rotacao || 0}deg`);
    }
  });

  const fundoAtivo = document.querySelector(".fluxo2-fundo-ativa");
  if (fundoAtivo) {
    fundoAtivo.classList.toggle("visivel", lanternas.size === CONFIG_FLUXO_PONTE2.lanternasNecessarias);
  }
}

function atualizarFluxoPonte2() {
  if (!estadoFluxoPonte2) return;

  const resultado = calcularFluxoAtivoPonte2();

  estadoFluxoPonte2.pecasAtivas = resultado.ativas;
  estadoFluxoPonte2.lanternasAcesas = resultado.lanternas;

  aplicarEstadoVisualFluxo2();

  const contador = document.getElementById("fluxo2-contador");
  const feedback = document.getElementById("fluxo2-feedback");

  if (contador) {
    contador.textContent = `${resultado.lanternas.length}/${CONFIG_FLUXO_PONTE2.lanternasNecessarias}`;
  }

  if (feedback) {
    if (resultado.lanternas.length === 0) {
      feedback.textContent = "A energia ainda não chegou às lanternas. Procura onde o caminho está partido.";
    } else if (resultado.lanternas.length < CONFIG_FLUXO_PONTE2.lanternasNecessarias) {
      feedback.textContent = `Boa! Já acendeste ${resultado.lanternas.length}/3 lanternas. Continua a reconstruir o fluxo.`;
    } else {
      feedback.textContent = "Conseguiste! A energia chegou às 3 lanternas.";
      feedback.classList.add("certo");
    }
  }

  if (
    resultado.lanternas.length === CONFIG_FLUXO_PONTE2.lanternasNecessarias &&
    !estadoFluxoPonte2.concluido
  ) {
    terminarFluxoPonte2ComSucesso();
  }
}

function terminarFluxoPonte2ComSucesso() {
  if (!estadoFluxoPonte2 || estadoFluxoPonte2.concluido) return;

  estadoFluxoPonte2.concluido = true;
  tocarSom("sucesso");

  const cenario = document.querySelector(".fluxo2-cenario");

  if (cenario) {
    const efeito = document.createElement("img");
    efeito.className = "fluxo2-efeito-sucesso";
    efeito.src = `${CAMINHO_PONTE2}/efeito-sucesso.png`;
    efeito.alt = "";
    efeito.setAttribute("aria-hidden", "true");
    cenario.appendChild(efeito);
  }

  const feedback = document.getElementById("fluxo2-feedback");

  setTimeout(() => {
    if (feedback) {
      concluirConstrucaoPonte(estadoFluxoPonte2.ponte, feedback);
    }
    estadoFluxoPonte2 = null;
  }, 1300);
}


/* =========================================================
   PONTE 3 — FORJAR A ÚLTIMA PONTE
   Mini-jogo final por fusões controladas.
   ========================================================= */

function iniciarMiniJogoUltimaTravessia({ ponte = "ponte3" } = {}) {
  const CAMINHO_PONTE3 = "assets/ponte3";

  const imagensPonte = {
    0: `${CAMINHO_PONTE3}/ponte3_estado_0.png`,
    1: `${CAMINHO_PONTE3}/ponte3_estado_1.png`,
    2: `${CAMINHO_PONTE3}/ponte3_estado_2.png`,
    final: `${CAMINHO_PONTE3}/ponte3_estado_final.png`
  };

  const DEFINICOES_ITENS = {
    caixa_materiais: {
      tipo: "caixa_materiais",
      nome: "Caixa de materiais",
      imagem: "assets/materiais/caixas/caixa-fechada.png",
      gerador: true
    },

    corda: { tipo: "corda", nome: "Corda", imagem: `${CAMINHO_PONTE3}/corda.png` },
    corrente_pesada: { tipo: "corrente_pesada", nome: "Correntes", imagem: `${CAMINHO_PONTE3}/correntes.png` },
    cabo_suspensao: { tipo: "cabo_suspensao", nome: "Cabo de suspensão", imagem: `${CAMINHO_PONTE3}/cabo-supenso.png` },
    plataforma: { tipo: "plataforma", nome: "Plataforma", imagem: `${CAMINHO_PONTE3}/plataforma.png` },
    suporte_pesado: { tipo: "suporte_pesado", nome: "Suporte pesado", imagem: `${CAMINHO_PONTE3}/suporte_pesado.png`, maximo: true },

    pregos: { tipo: "pregos", nome: "Pregos", imagem: `${CAMINHO_PONTE3}/pregos.png` },
    parafusos: { tipo: "parafusos", nome: "Parafusos", imagem: `${CAMINHO_PONTE3}/parafusos.png` },
    alicates: { tipo: "alicates", nome: "Alicates", imagem: `${CAMINHO_PONTE3}/alicate.png` },
    caixa_ferramentas: { tipo: "caixa_ferramentas", nome: "Caixa de ferramentas", imagem: `${CAMINHO_PONTE3}/caixa-ferramentas.png` },
    candeeiro: { tipo: "candeeiro", nome: "Candeeiro", imagem: `${CAMINHO_PONTE3}/candeeiro.png`, maximo: true },

    troncos: { tipo: "troncos", nome: "Troncos", imagem: `${CAMINHO_PONTE3}/troncos.png` },
    madeira: { tipo: "madeira", nome: "Madeira", imagem: `${CAMINHO_PONTE3}/madeira.png` },
    vigas: { tipo: "vigas", nome: "Vigas", imagem: `${CAMINHO_PONTE3}/vigas.png` },
    estrutura_reforcada: { tipo: "estrutura_reforcada", nome: "Estrutura reforçada", imagem: `${CAMINHO_PONTE3}/estrutura_reforcada.png`, maximo: true },

    runa_magica: { tipo: "runa_magica", nome: "Runa mágica", imagem: `${CAMINHO_PONTE3}/runa-magica.png` },
    cristal_pequeno: { tipo: "cristal_pequeno", nome: "Cristal pequeno", imagem: `${CAMINHO_PONTE3}/cristal-pequeno.png` },
    cristal_central: { tipo: "cristal_central", nome: "Cristal central", imagem: `${CAMINHO_PONTE3}/cristal-central.png` },
    mecanismo_magico: { tipo: "mecanismo_magico", nome: "Mecanismo mágico", imagem: `${CAMINHO_PONTE3}/mecanismo-magico.png` },
    nucleo_magico: { tipo: "nucleo_magico", nome: "Núcleo mágico", imagem: `${CAMINHO_PONTE3}/nucleo_magico.png`, maximo: true },

    secao_ponte: { tipo: "secao_ponte", nome: "Secção da ponte", imagem: `${CAMINHO_PONTE3}/secao_ponte.png`, especial: true },
    energia_ativa: { tipo: "energia_ativa", nome: "Energia ativa", imagem: `${CAMINHO_PONTE3}/energia_ativa.png`, especial: true }
  };

  const RECEITAS = {
    "corda+corda": { resultado: "corrente_pesada", mensagem: "As cordas uniram-se e criaram correntes resistentes." },
    "corrente_pesada+corrente_pesada": { resultado: "cabo_suspensao", mensagem: "As correntes criaram um cabo de suspensão." },
    "cabo_suspensao+cabo_suspensao": { resultado: "plataforma", mensagem: "Os cabos formaram uma plataforma segura." },
    "plataforma+plataforma": { resultado: "suporte_pesado", mensagem: "As plataformas criaram um suporte pesado.", etapaVisual: 1 },

    "pregos+pregos": { resultado: "parafusos", mensagem: "Os pregos evoluíram para parafusos." },
    "parafusos+parafusos": { resultado: "alicates", mensagem: "Os parafusos desbloquearam alicates de construção." },
    "alicates+alicates": { resultado: "caixa_ferramentas", mensagem: "Os alicates formaram uma caixa de ferramentas." },
    "caixa_ferramentas+caixa_ferramentas": { resultado: "candeeiro", mensagem: "As caixas de ferramentas prepararam um candeeiro para a ponte." },

    "troncos+troncos": { resultado: "madeira", mensagem: "Os troncos foram preparados em madeira." },
    "madeira+madeira": { resultado: "vigas", mensagem: "A madeira criou vigas resistentes." },
    "vigas+vigas": { resultado: "estrutura_reforcada", mensagem: "As vigas formaram uma estrutura reforçada.", etapaVisual: 1 },

    "runa_magica+runa_magica": { resultado: "cristal_pequeno", mensagem: "As runas acordaram um cristal pequeno." },
    "cristal_pequeno+cristal_pequeno": { resultado: "cristal_central", mensagem: "Os cristais pequenos criaram um cristal central." },
    "cristal_central+cristal_central": { resultado: "mecanismo_magico", mensagem: "Os cristais centrais ativaram um mecanismo mágico." },
    "mecanismo_magico+mecanismo_magico": { resultado: "nucleo_magico", mensagem: "Os mecanismos criaram o núcleo mágico da ponte." },

    "estrutura_reforcada+suporte_pesado": { resultado: "secao_ponte", mensagem: "A estrutura e o suporte criaram uma secção da ponte.", etapaVisual: 2 },
    "candeeiro+nucleo_magico": { resultado: "energia_ativa", mensagem: "O candeeiro e o núcleo criaram energia ativa." },
    "energia_ativa+secao_ponte": { resultado: "ponte_concluida", mensagem: "A energia percorreu a ponte. A última travessia está pronta.", etapaVisual: 3, final: true }
  };

  const CADEIAS_MATERIAIS = {
    corda: {
      nome: "linha das cordas",
      base: "corda",
      maximo: "suporte_pesado",
      tipos: ["corda", "corrente_pesada", "cabo_suspensao", "plataforma", "suporte_pesado"]
    },
    pregos: {
      nome: "linha das ferramentas",
      base: "pregos",
      maximo: "candeeiro",
      tipos: ["pregos", "parafusos", "alicates", "caixa_ferramentas", "candeeiro"]
    },
    troncos: {
      nome: "linha da madeira",
      base: "troncos",
      maximo: "estrutura_reforcada",
      tipos: ["troncos", "madeira", "vigas", "estrutura_reforcada"]
    },
    runa_magica: {
      nome: "linha mágica",
      base: "runa_magica",
      maximo: "nucleo_magico",
      tipos: ["runa_magica", "cristal_pequeno", "cristal_central", "mecanismo_magico", "nucleo_magico"]
    }
  };

  const BASES_GERADOR = Object.keys(CADEIAS_MATERIAIS);

  let contadorItens = 0;
  const estadoMerge = {
    slots: Array.from({ length: 16 }, (_, indice) => ({ id: indice, item: null })),
    selecionado: null,
    arrastado: null,
    bloqueado: false,
    cadeiasConcluidas: new Set(),
    etapaVisual: 0,
    ultimoResultadoSlot: null,
    slotsComErro: [],
    mensagem: "Usa a caixa para produzir materiais. Junta dois iguais até criares peças avançadas."
  };

  function criarItem(tipo) {
    const base = DEFINICOES_ITENS[tipo];
    if (!base) return null;
    contadorItens += 1;
    return { ...base, id: `${tipo}_${Date.now()}_${contadorItens}` };
  }

  function prepararTabuleiroInicial() {
    estadoMerge.slots[0].item = criarItem("caixa_materiais");
    estadoMerge.slots[1].item = criarItem("corda");
    estadoMerge.slots[2].item = criarItem("corda");
    estadoMerge.slots[3].item = criarItem("pregos");
    estadoMerge.slots[4].item = criarItem("pregos");
    estadoMerge.slots[5].item = criarItem("troncos");
    estadoMerge.slots[6].item = criarItem("troncos");
    estadoMerge.slots[7].item = criarItem("runa_magica");
    estadoMerge.slots[8].item = criarItem("runa_magica");
  }

  function assinaturaTipos(tipoA, tipoB) {
    return [tipoA, tipoB].sort().join("+");
  }

  function obterReceita(itemA, itemB) {
    if (!itemA || !itemB || itemA.gerador || itemB.gerador) return null;
    return RECEITAS[assinaturaTipos(itemA.tipo, itemB.tipo)] || null;
  }

  function obterImagemPalco() {
    if (estadoMerge.etapaVisual >= 3) return imagensPonte.final;
    if (estadoMerge.etapaVisual >= 2) return imagensPonte[2];
    if (estadoMerge.etapaVisual >= 1) return imagensPonte[1];
    return imagensPonte[0];
  }

  function obterBasesAtivasGerador() {
    return BASES_GERADOR.filter((tipoBase) => !estadoMerge.cadeiasConcluidas.has(tipoBase));
  }

  function obterCadeiaPorResultado(tipoResultado) {
    return Object.values(CADEIAS_MATERIAIS).find((cadeia) => cadeia.maximo === tipoResultado) || null;
  }

  function concluirCadeiaSeNecessario(tipoResultado, slotResultadoId) {
    const cadeia = obterCadeiaPorResultado(tipoResultado);
    if (!cadeia || estadoMerge.cadeiasConcluidas.has(cadeia.base)) return;

    estadoMerge.cadeiasConcluidas.add(cadeia.base);

    estadoMerge.slots.forEach((slot) => {
      if (!slot.item || slot.id === slotResultadoId || slot.item.gerador) return;
      if (cadeia.tipos.includes(slot.item.tipo)) {
        slot.item = null;
      }
    });
  }

  function obterProximoMaterialBase() {
    const basesAtivas = obterBasesAtivasGerador();
    if (basesAtivas.length === 0) return null;

    const contagem = basesAtivas.reduce((acc, tipo) => {
      acc[tipo] = estadoMerge.slots.filter((slot) => slot.item && slot.item.tipo === tipo).length;
      return acc;
    }, {});

    const minimo = Math.min(...basesAtivas.map((tipo) => contagem[tipo]));
    const candidatos = basesAtivas.filter((tipo) => contagem[tipo] === minimo);
    return candidatos[Math.floor(Math.random() * candidatos.length)];
  }

  function existeSlotVazio() {
    return estadoMerge.slots.some((slot) => !slot.item);
  }

  function atualizarMensagem(texto) {
    estadoMerge.mensagem = texto;
    const feedback = document.getElementById("ponte3-feedback");
    if (feedback) feedback.textContent = texto;
  }

  function produzirMaterial() {
    if (estadoMerge.bloqueado) return;
    const slotVazio = estadoMerge.slots.find((slot) => !slot.item);
    if (!slotVazio) {
      tocarSom("erro");
      estadoMerge.mensagem = "O tabuleiro está cheio. Junta primeiro dois materiais para abrir espaço.";
      estadoMerge.slotsComErro = [0];
      renderizarMiniJogo();
      return;
    }

    const tipo = obterProximoMaterialBase();
    if (!tipo) {
      estadoMerge.selecionado = null;
      estadoMerge.slotsComErro = [0];
      estadoMerge.mensagem = "As linhas principais já estão completas. Usa as peças especiais para terminar a ponte.";
      tocarSom("erro");
      renderizarMiniJogo();
      return;
    }

    slotVazio.item = criarItem(tipo);
    estadoMerge.ultimoResultadoSlot = slotVazio.id;
    estadoMerge.selecionado = null;
    estadoMerge.mensagem = `${DEFINICOES_ITENS[tipo].nome} entrou no tabuleiro.`;
    tocarSom("sucesso");
    renderizarMiniJogo();
  }

  function executarAcaoEntreSlots(origemId, destinoId) {
    if (estadoMerge.bloqueado) return;
    if (origemId === destinoId) return;

    const origem = estadoMerge.slots[origemId];
    const destino = estadoMerge.slots[destinoId];
    if (!origem || !destino || !origem.item) return;

    if (origem.item.gerador) return;

    if (!destino.item) {
      destino.item = origem.item;
      origem.item = null;
      estadoMerge.selecionado = destinoId;
      estadoMerge.ultimoResultadoSlot = null;
      estadoMerge.slotsComErro = [];
      estadoMerge.mensagem = `${destino.item.nome} foi movido.`;
      renderizarMiniJogo();
      return;
    }

    if (destino.item.gerador) {
      estadoMerge.slotsComErro = [origemId, destinoId];
      estadoMerge.mensagem = "A caixa só serve para produzir materiais.";
      tocarSom("erro");
      renderizarMiniJogo();
      return;
    }

    const receita = obterReceita(origem.item, destino.item);
    if (receita) {
      aplicarReceita(origemId, destinoId, receita);
      return;
    }

    if (origem.item.maximo && destino.item.maximo && origem.item.tipo === destino.item.tipo) {
      estadoMerge.slotsComErro = [origemId, destinoId];
      estadoMerge.mensagem = `${origem.item.nome} já está no nível máximo. Usa-o numa combinação final.`;
      tocarSom("erro");
      renderizarMiniJogo();
      return;
    }

    const temporario = destino.item;
    destino.item = origem.item;
    origem.item = temporario;
    estadoMerge.selecionado = destinoId;
    estadoMerge.ultimoResultadoSlot = null;
    estadoMerge.slotsComErro = [];
    estadoMerge.mensagem = "Materiais reorganizados no tabuleiro.";
    renderizarMiniJogo();
  }

  function aplicarReceita(origemId, destinoId, receita) {
    estadoMerge.bloqueado = true;
    tocarSom(receita.final ? "ponte" : "sucesso");

    if (receita.final) {
      estadoMerge.slots[origemId].item = null;
      estadoMerge.slots[destinoId].item = null;
      estadoMerge.selecionado = null;
      estadoMerge.etapaVisual = 3;
      estadoMerge.mensagem = receita.mensagem;
      renderizarMiniJogo({ animacaoFinal: true });
      setTimeout(renderizarVitoriaMerge, 1450);
      return;
    }

    const novoItem = criarItem(receita.resultado);
    estadoMerge.slots[origemId].item = null;
    estadoMerge.slots[destinoId].item = novoItem;
    concluirCadeiaSeNecessario(receita.resultado, destinoId);
    estadoMerge.selecionado = destinoId;
    estadoMerge.ultimoResultadoSlot = destinoId;
    estadoMerge.slotsComErro = [];
    estadoMerge.etapaVisual = Math.max(estadoMerge.etapaVisual, receita.etapaVisual || 0);
    estadoMerge.mensagem = receita.mensagem;

    renderizarMiniJogo();
    setTimeout(() => {
      estadoMerge.bloqueado = false;
      estadoMerge.ultimoResultadoSlot = null;
      renderizarMiniJogo();
    }, 520);
  }

  function selecionarSlot(slotId) {
    if (estadoMerge.bloqueado) return;
    const slot = estadoMerge.slots[slotId];
    if (!slot) return;

    if (slot.item && slot.item.gerador) {
      produzirMaterial();
      return;
    }

    if (estadoMerge.selecionado === null) {
      if (!slot.item) return;
      estadoMerge.selecionado = slotId;
      estadoMerge.slotsComErro = [];
      estadoMerge.mensagem = `${slot.item.nome} selecionado. Escolhe outro espaço para mover ou fundir.`;
      renderizarMiniJogo();
      return;
    }

    if (estadoMerge.selecionado === slotId) {
      estadoMerge.selecionado = null;
      estadoMerge.mensagem = "Seleção retirada.";
      renderizarMiniJogo();
      return;
    }

    const origemId = estadoMerge.selecionado;
    estadoMerge.selecionado = null;
    executarAcaoEntreSlots(origemId, slotId);
  }

  function classeSlot(slot) {
    const classes = ["ponte3-celula", "ponte3-opcao"];
    if (slot.item) classes.push("ocupada");
    if (slot.item?.gerador) classes.push("ponte3-gerador");
    if (slot.item?.maximo) classes.push("ponte3-item-maximo");
    if (slot.item?.especial) classes.push("ponte3-item-especial");
    if (estadoMerge.selecionado === slot.id) classes.push("selecionada");
    if (estadoMerge.ultimoResultadoSlot === slot.id) classes.push("novo");
    if (estadoMerge.slotsComErro.includes(slot.id)) classes.push("erro");
    return classes.join(" ");
  }

  function criarConteudoSlot(slot) {
    if (!slot.item) return `<span class="ponte3-celula-vazia"></span>`;

    const item = slot.item;
    return `
      <span class="ponte3-item-arte" aria-hidden="true">
        <img src="${item.imagem}" alt="" draggable="false">
      </span>
      <span class="ponte3-item-nome">${item.nome}</span>
      ${item.maximo ? `<span class="ponte3-estrela-maxima" aria-hidden="true">✦</span>` : ""}
    `;
  }

  function criarCelula(slot) {
    const aria = slot.item
      ? `${slot.item.nome}${slot.item.maximo ? ", nível máximo" : ""}`
      : "Espaço vazio";

    return `
      <button type="button"
              class="${classeSlot(slot)}"
              data-slot="${slot.id}"
              draggable="${slot.item && !slot.item.gerador ? "true" : "false"}"
              aria-label="${aria}">
        ${criarConteudoSlot(slot)}
      </button>
    `;
  }

  function renderizarMiniJogo({ animacaoFinal = false } = {}) {
    const imagemPalco = obterImagemPalco();
    const etapaTexto = estadoMerge.etapaVisual >= 3 ? "Ponte concluída" : `Construção ${estadoMerge.etapaVisual}/3`;

    abrirModal({
      etiqueta: "",
      titulo: "",
      mostrarFechar: true,
      conteudo: `
        <section class="ponte3-mini-jogo ponte3-merge-board ${animacaoFinal ? "ponte3-com-animacao-final" : ""}" aria-labelledby="ponte3-titulo">
          <div class="ponte3-cenario">
            <img src="${imagemPalco}" alt="" class="ponte3-cenario-img" draggable="false">
            <span class="ponte3-cenario-sombra"></span>
            <img src="${CAMINHO_PONTE3}/energia_ativa.png" alt="" class="ponte3-energia-travessia" draggable="false">

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
      `,
      acoes: []
    });

    ligarEventosTabuleiro();
  }

  function ligarEventosTabuleiro() {
    document.querySelectorAll(".ponte3-celula").forEach((celula) => {
      const slotId = Number(celula.dataset.slot);

      celula.addEventListener("click", () => selecionarSlot(slotId));

      celula.addEventListener("dragstart", (evento) => {
        const slot = estadoMerge.slots[slotId];
        if (!slot?.item || slot.item.gerador || estadoMerge.bloqueado) {
          evento.preventDefault();
          return;
        }
        estadoMerge.arrastado = slotId;
        evento.dataTransfer.effectAllowed = "move";
        evento.dataTransfer.setData("text/plain", String(slotId));
        celula.classList.add("a-arrastar");
      });

      celula.addEventListener("dragend", () => {
        estadoMerge.arrastado = null;
        celula.classList.remove("a-arrastar");
      });

      celula.addEventListener("dragover", (evento) => {
        evento.preventDefault();
        evento.dataTransfer.dropEffect = "move";
        celula.classList.add("destino-drag");
      });

      celula.addEventListener("dragleave", () => {
        celula.classList.remove("destino-drag");
      });

      celula.addEventListener("drop", (evento) => {
        evento.preventDefault();
        celula.classList.remove("destino-drag");
        const origemId = Number(evento.dataTransfer.getData("text/plain"));
        executarAcaoEntreSlots(origemId, slotId);
      });
    });

    setTimeout(() => {
      const foco = estadoMerge.selecionado !== null
        ? document.querySelector(`.ponte3-celula[data-slot="${estadoMerge.selecionado}"]`)
        : document.querySelector(".ponte3-celula");
      if (fofoExiste(foco)) foco.focus({ preventScroll: true });
    }, 40);
  }

  function fofoExiste(elemento) {
    return elemento && typeof elemento.focus === "function";
  }

  function renderizarVitoriaMerge() {
    estadoMerge.bloqueado = false;
    abrirModal({
      etiqueta: "",
      titulo: "",
      mostrarFechar: false,
      conteudo: `
        <section class="ponte3-mini-jogo ponte3-final-board ponte3-final-limpo ponte3-final-sem-ui" aria-labelledby="ponte3-vitoria-titulo">
          <div class="ponte3-final-palco-limpo" style="background-image: url('${imagensPonte.final}');" role="img" aria-label="Ponte final construída e iluminada">
            <div class="ponte3-mensagem-final" aria-live="polite">
              <h2 id="ponte3-vitoria-titulo">A última ponte está construída</h2>
              <p>Conseguiste organizar os materiais, criar peças melhores e ligar as regiões.</p>
              <button type="button" class="ponte3-botao" id="ponte3-concluir">Concluir a ponte</button>
            </div>
          </div>
        </section>
      `,
      acoes: []
    });

    const botaoConcluir = document.getElementById("ponte3-concluir");
    if (botaoConcluir) {
      botaoConcluir.addEventListener("click", () => {
        const feedbackVirtual = document.createElement("p");
        concluirConstrucaoPonte(ponte, feedbackVirtual);
      });

      setTimeout(() => {
        const finalBoard = document.querySelector(".ponte3-final-board");
        if (finalBoard) {
          finalBoard.classList.remove("ponte3-final-sem-ui");
          finalBoard.classList.add("ponte3-final-com-ui");
        }
        botaoConcluir.focus({ preventScroll: true });
      }, 2300);
    }
  }

  prepararTabuleiroInicial();
  renderizarMiniJogo();
}

