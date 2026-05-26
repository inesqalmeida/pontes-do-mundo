const STORAGE_KEY_V3 = "pontes_do_mundo_v3";
const STORAGE_KEY_V1 = "pontes_do_mundo_v1";

const ecras = {
  inicial: document.getElementById("ecra-inicial"),
  perfil: document.getElementById("ecra-perfil"),
  mapa: document.getElementById("ecra-mapa")
};

const elementos = {
  botaoJogar: document.getElementById("botao-jogar"),
  botaoComecar: document.getElementById("botao-comecar"),
  botaoEditarPerfil: document.getElementById("botao-editar-perfil"),
  inputNome: document.getElementById("nome-jogador"),
  mensagemErro: document.getElementById("mensagem-erro"),
  saudacaoJogador: document.getElementById("saudacao-jogador"),
  pontuacaoJogador: document.getElementById("pontuacao-jogador"),
  materiaisJogador: document.getElementById("materiais-jogador"),
  avatares: document.querySelectorAll(".avatar"),
  mapaJogavel: document.getElementById("mapa-jogavel"),
  personagem: document.getElementById("personagem"),
  avatarMapa: document.getElementById("avatar-mapa"),
  pergaminhoInteracao: document.getElementById("pergaminho-interacao"),
  pergaminhoTexto: document.getElementById("pergaminho-texto"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalFechar: document.getElementById("modal-fechar"),
  modalEtiqueta: document.getElementById("modal-etiqueta"),
  modalTitulo: document.getElementById("modal-titulo"),
  modalConteudo: document.getElementById("modal-conteudo"),
  modalAcoes: document.getElementById("modal-acoes"),
  indicadorInteracao: document.getElementById("indicador-interacao"),
  painelDefinicoes: document.getElementById("painel-definicoes"),
  botaoFecharDefinicoes: document.getElementById("botao-fechar-definicoes"),
  botaoSom: document.getElementById("botao-som"),
  botaoVoltarPerfil: document.getElementById("botao-voltar-perfil"),
  botaoVoltarInicio: document.getElementById("botao-voltar-inicio")
};

const zonas = [
  {
    tipo: "sabores",
    minX: 10,
    maxX: 28,
    minY: 64,
    maxY: 86
  },

  {
    tipo: "oficina",
    minX: 40,
    maxX: 58,
    minY: 66,
    maxY: 84
  },

  {
    tipo: "vozes",
    minX: 16,
    maxX: 38,
    minY: 8,
    maxY: 30
  },

  {
    tipo: "coragem",
    minX: 78,
    maxX: 94,
    minY: 18,
    maxY: 30
  },

  {
    tipo: "ponte1",
    minX: 34,
    maxX: 44,
    minY: 36,
    maxY: 58
  },

  {
    tipo: "ponte2",
    minX: 56,
    maxX: 74,
    minY: 20,
    maxY: 34
  },

  {
    tipo: "ponte3",
    minX: 80,
    maxX: 86,
    minY: 34,
    maxY: 58
  }
];

const ponteMeta = {
  ponte1: { nome: "Ponte 1", zonaOrigem: "sabores", materiaisNecessarios: 9, tipoMiniJogo: "reconstrucao-visual" },
  ponte2: { nome: "Ponte 2", zonaOrigem: "vozes", materiaisNecessarios: 9, tipoMiniJogo: "associacao" },
  ponte3: { nome: "Ponte 3", zonaOrigem: "coragem", materiaisNecessarios: 9, tipoMiniJogo: "escolha-final" }
};

function criarEstadoInicial() {
  return {
    nomeJogador: "",
    avatarSelecionado: "",
    estrelas: 0,
    materiais: { ponte1: 0, ponte2: 0, ponte3: 0 },
    pontes: { ponte1: false, ponte2: false, ponte3: false },
    ponte1Construcao: { emConstrucao: false, materiaisInvestidos: false },
    personagem: { x: 82, y: 86 },
    zonaAtual: null,
    modalAberto: false,
    somLigado: true,
    perguntasRecentes: { sabores: [], vozes: [], coragem: [] },
    perguntaPendente: { sabores: null, vozes: null, coragem: null },
    estatisticas: { perguntasCertas: { sabores: 0, vozes: 0, coragem: 0 } },
    tutorialInicialVisto: false,
    tutorialInicialVersao: "",
    guiaSaboresAtivo: false,
    guiaOficinaAtivo: false,
    construcaoEmRisco: null,
    avisosOficinaMostrados: { ponte1: false, ponte2: false, ponte3: false },
    avisosOficinaMostradosV2: { ponte1: false, ponte2: false, ponte3: false }
  };
}

let estado = criarEstadoInicial();

/* =========================
   SISTEMA DE SOM
========================= */

const sons = {
  click: new Audio("assets/sons/click.ogg"),
  hover: new Audio("assets/sons/hover.ogg"),

  sucesso: new Audio("assets/sons/sucesso.mp3"),
  erro: new Audio("assets/sons/erro.mp3"),
  erroForte: new Audio("assets/sons/erro_forte.mp3"),

  ponte: new Audio("assets/sons/ponte.mp3"),
  inicio: new Audio("assets/sons/inicio.mp3"),

  musicaFundo: new Audio("assets/sons/musica_fundo.mp3")
};

const DEBUG = false;

const volumesSom = {
  click: 0.14,
  hover: 0.04,

  sucesso: 0.42,

  erro: 0.42,
  erroForte: 0.52,

  ponte: 0.50,
  inicio: 0.45,

  musicaFundo: 0.05
};

let audioAtivado = false;

function configurarSons() {
  Object.entries(sons).forEach(([nome, audio]) => {
    audio.volume = volumesSom[nome] ?? 0.3;
    audio.preload = "auto";
  });

  sons.musicaFundo.loop = true;
}

function ativarAudio() {
  if (audioAtivado) return;
  audioAtivado = true;

  Object.values(sons).forEach((audio) => {
    const volumeOriginal = audio.volume;

    audio.volume = 0;

    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = volumeOriginal;
      })
      .catch(() => {
        audio.volume = volumeOriginal;
      });
  });
}

function tocarSom(nome, opcoes = {}) {
  if (!opcoes.forcar && estado.somLigado === false) return;

  const audio = sons[nome];
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function iniciarMusicaFundo() {
  if (estado.somLigado === false) return;

  const musica = sons.musicaFundo;
  if (!musica) return;

  musica.volume = volumesSom.musicaFundo ?? 0.16;

  musica.play().catch(() => {});
}

document.addEventListener("pointerdown", () => {
  ativarAudio();
  iniciarMusicaFundo();
}, { once: true });


function embaralharArray(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarEcra(nome) {
  Object.values(ecras).forEach((ecra) => ecra.classList.remove("ativo"));
  ecras[nome].classList.add("ativo");
}

function guardarEstado() {
  localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(estado));
}

function migrarEstadoV1(dadosV1) {
  const novo = criarEstadoInicial();
  novo.nomeJogador = dadosV1.nomeJogador || "";
  novo.avatarSelecionado = dadosV1.avatarSelecionado || "";
  novo.estrelas = Number(dadosV1.estrelas) || 0;
  novo.personagem = dadosV1.personagem || { x: 82, y: 86 };
  novo.pontes.ponte1 = Boolean(dadosV1.pontes?.ponte1);
  novo.pontes.ponte2 = Boolean(dadosV1.pontes?.ponte2);
  novo.pontes.ponte3 = Boolean(dadosV1.pontes?.ponte3);
  novo.ponte1Construcao.materiaisInvestidos = novo.pontes.ponte1;
  novo.ponte1Construcao.emConstrucao = false;
  novo.materiais.ponte1 = Number(dadosV1.materiais?.ponte1) || 0;
  novo.materiais.ponte2 = Number(dadosV1.materiais?.ponte2) || 0;
  novo.materiais.ponte3 = Number(dadosV1.materiais?.ponte3) || 0;
  novo.estatisticas.perguntasCertas.sabores = Array.isArray(dadosV1.desafios?.sabores) ? dadosV1.desafios.sabores.filter(Boolean).length : 0;
  novo.estatisticas.perguntasCertas.vozes = Array.isArray(dadosV1.desafios?.vozes) ? dadosV1.desafios.vozes.filter(Boolean).length : 0;
  novo.estatisticas.perguntasCertas.coragem = Array.isArray(dadosV1.desafios?.coragem) ? dadosV1.desafios.coragem.filter(Boolean).length : 0;
  return novo;
}

function carregarEstado() {
  const guardadoV3 = localStorage.getItem(STORAGE_KEY_V3);
  if (guardadoV3) {
    try {
      const dados = JSON.parse(guardadoV3);
      estado = { ...criarEstadoInicial(), ...dados };
      estado.materiais = { ...criarEstadoInicial().materiais, ...(dados.materiais || {}) };
      estado.pontes = { ...criarEstadoInicial().pontes, ...(dados.pontes || {}) };
      estado.ponte1Construcao = { ...criarEstadoInicial().ponte1Construcao, ...(dados.ponte1Construcao || {}) };
      if (estado.pontes.ponte1) {
        estado.ponte1Construcao.materiaisInvestidos = true;
        estado.ponte1Construcao.emConstrucao = false;
      }
      estado.personagem = { ...criarEstadoInicial().personagem, ...(dados.personagem || {}) };
      estado.perguntasRecentes = { ...criarEstadoInicial().perguntasRecentes, ...(dados.perguntasRecentes || {}) };
      estado.perguntaPendente = { ...criarEstadoInicial().perguntaPendente, ...(dados.perguntaPendente || {}) };
      estado.estatisticas = { perguntasCertas: { ...criarEstadoInicial().estatisticas.perguntasCertas, ...(dados.estatisticas?.perguntasCertas || {}) } };
      estado.tutorialInicialVisto = Boolean(dados.tutorialInicialVisto);
      estado.tutorialInicialVersao = dados.tutorialInicialVersao || "";
      estado.guiaSaboresAtivo = Boolean(dados.guiaSaboresAtivo);
      estado.guiaOficinaAtivo = Boolean(dados.guiaOficinaAtivo);
      estado.construcaoEmRisco = dados.construcaoEmRisco || null;
      estado.avisosOficinaMostrados = { ...criarEstadoInicial().avisosOficinaMostrados, ...(dados.avisosOficinaMostrados || {}) };
      estado.avisosOficinaMostradosV2 = { ...criarEstadoInicial().avisosOficinaMostradosV2, ...(dados.avisosOficinaMostradosV2 || {}) };

      // Estes valores são temporários da sessão e não devem bloquear o jogo ao reabrir.
      estado.modalAberto = false;
      estado.zonaAtual = null;

      return true;
    } catch (erro) {
      console.error("Não foi possível carregar o progresso v3:", erro);
    }
  }

  const guardadoV1 = localStorage.getItem(STORAGE_KEY_V1);
  if (guardadoV1) {
    try {
      estado = migrarEstadoV1(JSON.parse(guardadoV1));

      // Estes valores são temporários da sessão e não devem bloquear o jogo ao reabrir.
      estado.modalAberto = false;
      estado.zonaAtual = null;

      guardarEstado();
      return true;
    } catch (erro) {
      console.error("Não foi possível migrar o progresso v1:", erro);
    }
  }

  return false;
}

function reiniciarJogoCompleto() {
  sons.musicaFundo.pause();
  sons.musicaFundo.currentTime = 0;

  estado = criarEstadoInicial();
  estado.somLigado = true;

  localStorage.removeItem(STORAGE_KEY_V3);
  localStorage.removeItem(STORAGE_KEY_V1);

  elementos.inputNome.value = "";
  elementos.mensagemErro.textContent = "";

  elementos.avatares.forEach((avatar) => {
    avatar.classList.remove("selecionado");
  });

  fecharPainelDefinicoes();
  atualizarHUD();
  atualizarEstadoVisualMapa();
  atualizarPosicaoPersonagem();
  verificarZonaAtual();

  mostrarEcra("inicial");
  atualizarBotaoSom();
  iniciarMusicaFundo();
}

function atualizarHUD() {

  elementos.saudacaoJogador.textContent = `Olá, ${estado.nomeJogador || "explorador"}!`;

  elementos.pontuacaoJogador.textContent = `⭐ Estrelas: ${estado.estrelas}`;

  const totalMateriais =
    estado.materiais.ponte1 +
    estado.materiais.ponte2 +
    estado.materiais.ponte3;

  elementos.materiaisJogador.textContent = `🧱 Materiais: ${totalMateriais}`;

  if (estado.avatarSelecionado) {
    elementos.avatarMapa.src = estado.avatarSelecionado;
    elementos.avatarMapa.alt = "Avatar do jogador";
  }
}

function animarElementoHUD(elemento) {
  if (!elemento) return;

  elemento.classList.remove("hud-pulso-estrela");

  void elemento.offsetWidth;

  elemento.classList.add("hud-pulso-estrela");
}

const mensagensAcerto = [
  "Boa descoberta!",
  "Muito bem!",
  "Acertaste!",
  "Excelente escolha!",
  "Boa!"
];

const mensagensErro = [
  "Quase!",
  "Boa tentativa!",
  "Vamos tentar outra vez.",
  "Ainda não é essa.",
  "Pensa mais um pouco."
];

function escolherMensagem(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function atualizarPerfil() {
  elementos.inputNome.value = estado.nomeJogador;
  elementos.avatares.forEach((avatar) => {
    avatar.classList.toggle("selecionado", avatar.dataset.avatar === estado.avatarSelecionado);
  });
}

function atualizarEstadoVisualMapa() {
  elementos.mapaJogavel.classList.remove("estado-base", "estado-ponte1", "estado-ponte1-ponte2", "estado-completo");
  if (estado.pontes.ponte1 && estado.pontes.ponte2 && estado.pontes.ponte3) {
    elementos.mapaJogavel.classList.add("estado-completo");
    return;
  }
  if (estado.pontes.ponte1 && estado.pontes.ponte2) {
    elementos.mapaJogavel.classList.add("estado-ponte1-ponte2");
    return;
  }
  if (estado.pontes.ponte1) {
    elementos.mapaJogavel.classList.add("estado-ponte1");
    return;
  }
  elementos.mapaJogavel.classList.add("estado-base");
}

function atualizarPosicaoPersonagem() {
  elementos.personagem.style.left = `${estado.personagem.x}%`;
  elementos.personagem.style.top = `${estado.personagem.y}%`;
}

function abrirModal({ etiqueta = "", titulo = "", conteudo = "", acoes = [], mostrarFechar = true }) {
  const conteudoTexto = String(conteudo || "");
  const deveUsarPergaminhoNarrativo =
    !conteudoTexto.includes("pergaminho-narrativo") &&
    !conteudoTexto.includes("mini-jogo-") &&
    !conteudoTexto.includes("ponte1-fluxo") &&
    (titulo || etiqueta);

  if (deveUsarPergaminhoNarrativo) {
    conteudo = criarPergaminhoNarrativoHTML({
      titulo: titulo || etiqueta,
      conteudo,
      classe: "pergaminho-mensagem-simples"
    });
    etiqueta = "";
    titulo = "";
  }

  estado.modalAberto = true;
  elementos.modalEtiqueta.textContent = etiqueta;
  elementos.modalTitulo.textContent = titulo;
  elementos.modalConteudo.innerHTML = conteudo;
  elementos.modalAcoes.innerHTML = "";
  elementos.modalFechar.style.display = mostrarFechar ? "flex" : "none";

  const pergaminho = elementos.modalConteudo.querySelector(".pergaminho-narrativo");
  let alvoAcoes = elementos.modalAcoes;

  if (pergaminho && acoes.length > 0) {
    const corpoPergaminho = pergaminho.querySelector(".pergaminho-corpo") || pergaminho;
    const acoesPergaminho = document.createElement("div");
    acoesPergaminho.className = "pergaminho-acoes";
    corpoPergaminho.appendChild(acoesPergaminho);
    alvoAcoes = acoesPergaminho;
  }

  acoes.forEach((acao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = acao.texto;
    if (acao.classe) botao.classList.add(...String(acao.classe).split(" ").filter(Boolean));
    if (acao.secundario) botao.classList.add("botao-secundario");
    botao.addEventListener("click", acao.onClick);
    alvoAcoes.appendChild(botao);
  });

  elementos.modalOverlay.classList.remove("oculto");
  elementos.modalOverlay.setAttribute("aria-hidden", "false");

  setTimeout(focarPrimeiroBotaoModal, 0);
}

function obterBotoesModalNavegaveis() {
  if (!elementos.modalOverlay || elementos.modalOverlay.classList.contains("oculto")) {
    return [];
  }

  const seletores = [
    ".modal-opcao:not(:disabled)",
    ".pergaminho-acoes button:not(:disabled)",
    ".modal-acoes button:not(:disabled)",
    ".mini-jogo-caixas button:not(:disabled)",
    ".mini-jogo-barcos button:not(:disabled)"
  ];

  const botoes = [];

  seletores.forEach((seletor) => {
    elementos.modalOverlay.querySelectorAll(seletor).forEach((botao) => {
      if (!botoes.includes(botao)) botoes.push(botao);
    });
  });

  return botoes;
}

function focarPrimeiroBotaoModal() {
  if (!elementos.modalOverlay || elementos.modalOverlay.classList.contains("oculto")) {
    return;
  }

  /*
    Não focamos automaticamente a primeira resposta.
    Visualmente parecia que uma resposta já estava selecionada, mesmo sem ação do jogador.
    A navegação por teclado continua disponível através do Tab.
  */

  if (elementos.modalFechar && elementos.modalFechar.style.display !== "none") {
    elementos.modalFechar.focus({ preventScroll: true });
  }
}

function moverFocoModal(direcao) {
  const botoes = obterBotoesModalNavegaveis();
  if (botoes.length === 0) return;

  const indiceAtual = botoes.indexOf(document.activeElement);
  const proximoIndice =
    indiceAtual === -1
      ? 0
      : (indiceAtual + direcao + botoes.length) % botoes.length;

  botoes[proximoIndice].focus();
}

function existeMiniJogoConstrucaoEmRiscoAberto() {
  if (!estado.construcaoEmRisco?.ativo || !estado.modalAberto || !elementos.modalOverlay) {
    return false;
  }

  return Boolean(
    elementos.modalOverlay.querySelector(
      ".fluxo2-mini-jogo, .ponte1-fluxo, .modal-opcoes, .ponte3-mini-jogo"
    )
  );
}

function iniciarTentativaConstrucaoComRisco(ponte) {
  estado.construcaoEmRisco = {
    ponte,
    ativo: true
  };
  guardarEstado();
}

function terminarTentativaConstrucaoComRisco() {
  estado.construcaoEmRisco = null;
  removerConfirmacaoSaidaConstrucao();
  guardarEstado();
}

function removerConfirmacaoSaidaConstrucao() {
  const existente = document.getElementById("confirmacao-saida-construcao");
  if (existente) existente.remove();
}

function mostrarConfirmacaoSaidaConstrucao() {
  if (!existeMiniJogoConstrucaoEmRiscoAberto()) return false;
  if (document.getElementById("confirmacao-saida-construcao")) return true;

  const ponte = estado.construcaoEmRisco?.ponte;
  const nome = nomePonte(ponte);

  const confirmacao = document.createElement("div");
  confirmacao.id = "confirmacao-saida-construcao";
  confirmacao.className = "confirmacao-saida-construcao";
  confirmacao.setAttribute("role", "dialog");
  confirmacao.setAttribute("aria-modal", "true");
  confirmacao.setAttribute("aria-label", "Confirmar saída do desafio");

  confirmacao.innerHTML = `
    <div class="confirmacao-saida-caixa">
      <h3>Queres mesmo sair?</h3>
      <p>Se saíres agora, vais perder os materiais investidos na construção da ${nome}.</p>
      <div class="confirmacao-saida-acoes">
        <button type="button" class="confirmacao-continuar">Continuar o desafio</button>
        <button type="button" class="confirmacao-sair">Sair e perder materiais</button>
      </div>
    </div>
  `;

  const continuar = confirmacao.querySelector(".confirmacao-continuar");
  const sair = confirmacao.querySelector(".confirmacao-sair");

  continuar.addEventListener("click", () => {
    removerConfirmacaoSaidaConstrucao();
  });

  sair.addEventListener("click", () => {
    terminarTentativaConstrucaoComRisco();
    fecharModal({ forcar: true });
    verificarZonaAtual();
  });

  confirmacao.addEventListener("click", (evento) => {
    if (evento.target === confirmacao) {
      removerConfirmacaoSaidaConstrucao();
    }
  });

  document.body.appendChild(confirmacao);

  setTimeout(() => continuar.focus({ preventScroll: true }), 0);

  return true;
}

function fecharModal(opcoes = {}) {
  const forcar = Boolean(opcoes.forcar);

  if (!forcar && existeMiniJogoConstrucaoEmRiscoAberto()) {
    mostrarConfirmacaoSaidaConstrucao();
    return false;
  }

  removerConfirmacaoSaidaConstrucao();

  if (typeof limparMiniJogoBarcosRio === "function") limparMiniJogoBarcosRio();
  if (typeof limparMiniJogoCargasPerdidas === "function") limparMiniJogoCargasPerdidas();

  estado.modalAberto = false;

  elementos.modalOverlay.classList.add("oculto");
  elementos.modalOverlay.setAttribute("aria-hidden", "true");

  if (document.activeElement && elementos.modalOverlay.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  return true;
}

function mundoConcluido(chave) {
  return estado.estatisticas.perguntasCertas[chave] >= 3;
}

function nomePonte(chave) {
  return ponteMeta[chave]?.nome || chave;
}

function nomeZonaBonita(chave) {
  return {
    sabores: "Praça dos Sabores",
    vozes: "Jardim das Vozes",
    coragem: "Acampamento da Coragem"
  }[chave] || chave;
}

function criarPergaminhoNarrativoHTML({ titulo = "", conteudo = "", classe = "" } = {}) {
  return `
    <div class="pergaminho-narrativo ${classe}" role="document">
      <div class="pergaminho-corpo">
        ${titulo ? `<h2>${titulo}</h2>` : ""}
        <div class="pergaminho-conteudo">${conteudo}</div>
      </div>
    </div>
  `;
}

function abrirMensagem(titulo, mensagem) {
  abrirModal({
    etiqueta: "",
    titulo: "",
    conteudo: criarPergaminhoNarrativoHTML({
      titulo,
      conteudo: `<p>${mensagem}</p>`,
      classe: "pergaminho-mensagem-simples"
    }),
    acoes: [
      {
        texto: "Fechar",
        onClick: fecharModal,
        secundario: true
      }
    ]
  });
}


function mostrarTutorialInicialDoMapa() {
  const VERSAO_TUTORIAL_INICIAL = "objetivo-jogo-v2";

  if (!ecras.mapa.classList.contains("ativo")) return;
  if (estado.tutorialInicialVersao === VERSAO_TUTORIAL_INICIAL) return;

  estado.tutorialInicialVisto = true;
  estado.tutorialInicialVersao = VERSAO_TUTORIAL_INICIAL;
  guardarEstado();

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: criarPergaminhoNarrativoHTML({
      titulo: "Antes de começares",
      classe: "pergaminho-mensagem-simples pergaminho-tutorial-inicial",
      conteudo: `
        <p>As pontes do mundo estão bloqueadas e não há passagem.</p>
        <p>Responde aos desafios das áreas, recolhe materiais na oficina e constrói as pontes.</p>
        <p><strong>Boa sorte!</strong></p>
      `
    }),
    acoes: [
      {
        texto: "Começar aventura",
        onClick: () => {
          fecharModal();
          if (deveMostrarGuiaSaboresInicial()) {
            mostrarGuiaSabores();
          }
          atualizarGuiasMapa();
          verificarZonaAtual();
        }
      }
    ]
  });
}

function ponteDaArea(area) {
  return Object.keys(ponteMeta).find((ponte) => ponteMeta[ponte]?.zonaOrigem === area) || null;
}

function mostrarGuiaOficina() {
  estado.guiaOficinaAtivo = true;
  guardarEstado();
  atualizarGuiaOficina();
}

function esconderGuiaOficina() {
  estado.guiaOficinaAtivo = false;
  guardarEstado();
  atualizarGuiaOficina();
}

function atualizarGuiaOficina() {
  if (!elementos.mapaJogavel) return;

  let seta = document.getElementById("seta-guia-oficina");

  if (!estado.guiaOficinaAtivo) {
    if (seta) seta.remove();
    return;
  }

  if (!seta) {
    seta = document.createElement("div");
    seta.id = "seta-guia-oficina";
    seta.className = "seta-guia-mapa seta-guia-oficina";
    seta.setAttribute("aria-hidden", "true");
    seta.innerHTML = `<span class="seta-guia-label">Oficina</span><span class="seta-guia-forma">↓</span>`;
    elementos.mapaJogavel.appendChild(seta);
  }

  const zonaOficina = zonas.find((item) => item.tipo === "oficina");

  if (!zonaOficina) return;

  const centroX = (zonaOficina.minX + zonaOficina.maxX) / 2;
  const topoY = zonaOficina.minY - 5;

  seta.style.left = `${centroX}%`;
  seta.style.top = `${topoY}%`;
}

function deveMostrarGuiaSaboresInicial() {
  return (
    !estado.pontes.ponte1 &&
    (estado.estatisticas?.perguntasCertas?.sabores || 0) === 0 &&
    (estado.materiais?.ponte1 || 0) === 0
  );
}

function mostrarGuiaSabores() {
  if (!deveMostrarGuiaSaboresInicial()) return;

  estado.guiaSaboresAtivo = true;
  guardarEstado();
  atualizarGuiaSabores();
}

function esconderGuiaSabores() {
  estado.guiaSaboresAtivo = false;
  guardarEstado();
  atualizarGuiaSabores();
}

function atualizarGuiaSabores() {
  if (!elementos.mapaJogavel) return;

  let seta = document.getElementById("seta-guia-sabores");

  if (!estado.guiaSaboresAtivo || !deveMostrarGuiaSaboresInicial()) {
    if (seta) seta.remove();
    return;
  }

  if (!seta) {
    seta = document.createElement("div");
    seta.id = "seta-guia-sabores";
    seta.className = "seta-guia-mapa seta-guia-sabores";
    seta.setAttribute("aria-hidden", "true");
    seta.innerHTML = `<span class="seta-guia-label">Começa aqui</span><span class="seta-guia-forma">↓</span>`;
    elementos.mapaJogavel.appendChild(seta);
  }

  const zonaSabores = zonas.find((item) => item.tipo === "sabores");
  if (!zonaSabores) return;

  const centroX = (zonaSabores.minX + zonaSabores.maxX) / 2;
  const topoY = zonaSabores.minY - 5;

  seta.style.left = `${centroX}%`;
  seta.style.top = `${topoY}%`;
}

function atualizarGuiasMapa() {
  atualizarGuiaOficina();
  atualizarGuiaSabores();
}


function mostrarAvisoOficinaDisponivel(area) {
  const ponte = ponteDaArea(area);
  if (!ponte) return false;
  if (estado.pontes[ponte]) return false;
  if ((estado.materiais[ponte] || 0) >= (ponteMeta[ponte]?.materiaisNecessarios || 9)) return false;
  if ((estado.estrelas || 0) < 3) return false;

  const respostasCertasArea = estado.estatisticas?.perguntasCertas?.[area] || 0;

  // A mensagem deve voltar a aparecer sempre que a criança atinge mais um bloco
  // de 3 respostas certas. Assim, as perguntas continuam sem bloquear a área,
  // mas a ida à Oficina é sugerida no momento certo.
  if (respostasCertasArea <= 0 || respostasCertasArea % 3 !== 0) return false;

  abrirModal({
    etiqueta: "",
    titulo: "",
    mostrarFechar: false,
    conteudo: criarPergaminhoNarrativoHTML({
      titulo: "Já tens estrelas suficientes!",
      classe: "pergaminho-mensagem-simples pergaminho-oficina-disponivel",
      conteudo: `
        <p>Já tens estrelas suficientes para trocar por materiais de construção da ${nomePonte(ponte)}.</p>
        <p>Podes ir à Oficina agora ou continuar a responder a novos desafios desta área.</p>
      `
    }),
    acoes: [
      {
        texto: "Ir à Oficina buscar materiais",
        onClick: () => {
          fecharModal();
          mostrarGuiaOficina();
        }
      },
      {
        texto: "Continuar a responder",
        secundario: true,
        onClick: () => {
          fecharModal();
          abrirPerguntaArea(area);
        }
      }
    ]
  });

  return true;
}

function finalizarPerguntaCorreta(area) {
  if (mostrarAvisoOficinaDisponivel(area)) return;

  // Enquanto a criança não escolher ir à Oficina, a área continua a gerar
  // perguntas novas. Isto evita que o desafio pare ao fim de 3 respostas.
  abrirPerguntaArea(area);
}

function mostrarIndicadorInteracao(tipo) {
  if (!elementos.indicadorInteracao) return;

  const zona = zonas.find((item) => item.tipo === tipo);
  if (!zona) return;

  const nomes = {
    sabores: "Praça dos Sabores",
    oficina: "Oficina",
    vozes: "Jardim das Vozes",
    coragem: "Acampamento da Coragem",
    ponte1: "Ponte 1",
    ponte2: "Ponte 2",
    ponte3: "Ponte 3"
  };

  const centroX = (zona.minX + zona.maxX) / 2;
  const centroY = zona.minY + 2;

  elementos.indicadorInteracao.style.left = `${centroX}%`;
  elementos.indicadorInteracao.style.top = `${centroY}%`;

  const texto = elementos.indicadorInteracao.querySelector(".indicador-texto");
  if (texto) {
    texto.textContent = nomes[tipo] || "Interagir";
  }

  elementos.indicadorInteracao.classList.remove("oculto");
}

function esconderIndicadorInteracao() {
  if (!elementos.indicadorInteracao) return;
  elementos.indicadorInteracao.classList.add("oculto");
}

function proximaPonteEmProgresso() {
  if (!estado.pontes.ponte1) return "ponte1";
  if (!estado.pontes.ponte2) return "ponte2";
  if (!estado.pontes.ponte3) return "ponte3";
  return null;
}

function textoPergaminhoZona(tipo) {
  if (tipo === "sabores") return `Praça dos Sabores\nEstrelas conquistadas: ${estado.estatisticas.perguntasCertas.sabores}/3\nCarrega em ⏎`;
  if (tipo === "oficina") {
    const ponteAtual = proximaPonteEmProgresso();
    if (!ponteAtual) return "Oficina\nTodas as pontes já foram tratadas.\nCarrega em ⏎";
    return `Oficina\nTroca 1 estrela por 3 materiais\nDestino: ${nomePonte(ponteAtual)}\nCarrega em ⏎`;
  }
  if (tipo === "vozes") {
    if (!estado.pontes.ponte1) return "Jardim das Vozes\nConstrói a Ponte 1 primeiro";
    return `Jardim das Vozes\nEstrelas conquistadas: ${estado.estatisticas.perguntasCertas.vozes}/3\nCarrega em ⏎`;
  }
  if (tipo === "coragem") {
    if (!estado.pontes.ponte2) return "Acampamento da Coragem\nConstrói a Ponte 2 primeiro";
    return `Acampamento da Coragem\nEstrelas conquistadas: ${estado.estatisticas.perguntasCertas.coragem}/3\nCarrega em ⏎`;
  }
  if (["ponte1", "ponte2", "ponte3"].includes(tipo)) {
    if (estado.pontes[tipo]) return `${nomePonte(tipo)}\nConstruída ✅`;
    return `${nomePonte(tipo)}\nMateriais: ${estado.materiais[tipo]}/${ponteMeta[tipo].materiaisNecessarios}\nCarrega em ⏎`;
  }
  return "";
}

function esconderPergaminhoInteracao() {
  if (!elementos.pergaminhoInteracao) return;

  elementos.pergaminhoInteracao.classList.remove("aberto");

  setTimeout(() => {
    if (!estado.zonaAtual) {
      elementos.pergaminhoInteracao.classList.add("oculto");
      elementos.pergaminhoTexto.textContent = "";
    }
  }, 260);
}

function mostrarPergaminhoInteracao(tipo) {
  if (!elementos.pergaminhoInteracao || !elementos.pergaminhoTexto) return;

  elementos.pergaminhoTexto.textContent = textoPergaminhoZona(tipo);
  elementos.pergaminhoInteracao.classList.remove("oculto");

  requestAnimationFrame(() => {
    elementos.pergaminhoInteracao.classList.add("aberto");
  });
}

function detetarZonaAtual() {
  return zonas.find((zona) =>
    estado.personagem.x >= zona.minX &&
    estado.personagem.x <= zona.maxX &&
    estado.personagem.y >= zona.minY &&
    estado.personagem.y <= zona.maxY
  ) || null;
}

function verificarZonaAtual() {
  const zona = detetarZonaAtual();
  const novaZona = zona ? zona.tipo : null;

  if (estado.zonaAtual === novaZona) {
    return;
  }

  estado.zonaAtual = novaZona;

  if (estado.zonaAtual) {
    if (estado.zonaAtual === "oficina") esconderGuiaOficina();
    else atualizarGuiaOficina();
    mostrarPergaminhoInteracao(estado.zonaAtual);
    mostrarIndicadorInteracao(estado.zonaAtual);
  } else {
    atualizarGuiaOficina();
    esconderPergaminhoInteracao();
    esconderIndicadorInteracao();
  }

  guardarEstado();
}

function obterCentroPersonagemEmPixeis(novoX, novoY) {
  const largura = elementos.mapaJogavel.clientWidth;
  const altura = elementos.mapaJogavel.clientHeight;
  const diametro = elementos.personagem.offsetWidth || 62;
  return { x: (novoX / 100) * largura + diametro / 2, y: (novoY / 100) * altura + diametro / 2, raio: diametro / 2 };
}

function circuloTocaRetangulo(circulo, rect) {
  const px = Math.max(rect.left, Math.min(circulo.x, rect.right));
  const py = Math.max(rect.top, Math.min(circulo.y, rect.bottom));
  const dx = circulo.x - px;
  const dy = circulo.y - py;
  return (dx * dx + dy * dy) <= (circulo.raio * circulo.raio);
}

function centroDentroRetangulo(circulo, rect) {
  return (
    circulo.x >= rect.left &&
    circulo.x <= rect.right &&
    circulo.y >= rect.top &&
    circulo.y <= rect.bottom
  );
}

function podeMoverPara(novoX, novoY) {
  const largura = elementos.mapaJogavel.clientWidth;
  const altura = elementos.mapaJogavel.clientHeight;

  const novo = obterCentroPersonagemEmPixeis(novoX, novoY);

  const rios = [
    { left: 0, right: largura * 0.98, top: altura * 0.46, bottom: altura * 0.54 },
    { left: largura * 0.62, right: largura * 0.705, top: 0, bottom: altura * 0.445 }
  ];

  const percentX = Math.round(novoX);
  const percentY = Math.round(novoY);

  /* =========================
     PONTE 2
  ========================= */

  const zonaPonte2 =
    percentX >= 54 &&
    percentX <= 80 &&
    percentY >= 4 &&
    percentY <= 38;

  if (estado.pontes.ponte2 && zonaPonte2) {
    const corredorEsquerdo =
      percentX >= 54 &&
      percentX <= 58 &&
      percentY >= 4 &&
      percentY <= 38;

    const corredorCentro =
      percentX >= 60 &&
      percentX <= 70 &&
      percentY >= 24 &&
      percentY <= 28;

    const corredorDireito =
      percentX >= 72 &&
      percentX <= 80 &&
      percentY >= 4 &&
      percentY <= 38;

    return corredorEsquerdo || corredorCentro || corredorDireito;
  }

  /* =========================
     CHÃO NORMAL
  ========================= */

  const tocaAguaNovo = rios.some((rio) => circuloTocaRetangulo(novo, rio));

  if (!tocaAguaNovo) return true;

  /* =========================
     PONTE 1
     Apenas x:38 e x:40 atravessam.
     x:32, x:34 e x:36 ficam bloqueados no rio,
     tal como x:30.
  ========================= */

  const podeUsarPonte1 =
    estado.pontes.ponte1 &&
    (percentX === 38 || percentX === 40) &&
    percentY >= 40 &&
    percentY <= 74;

  /* =========================
     PONTE 3
  ========================= */

  const podeUsarPonte3 =
    estado.pontes.ponte3 &&
    (percentX === 82 || percentX === 84) &&
    percentY >= 28 &&
    percentY <= 76;

  return podeUsarPonte1 || podeUsarPonte3;
}

function moverPersonagem(tecla) {
  if (!ecras.mapa.classList.contains("ativo") || estado.modalAberto) return;
  let novoX = estado.personagem.x;
  let novoY = estado.personagem.y;

  switch (tecla) {
    case "ArrowLeft": novoX -= 2; break;
    case "ArrowRight": novoX += 2; break;
    case "ArrowUp": novoY -= 2; break;
    case "ArrowDown": novoY += 2; break;
    default: return;
    animarPersonagem(tecla);
  }

  novoX = Math.max(2, Math.min(94, novoX));
  novoY = Math.max(4, Math.min(88, novoY));

  if (!podeMoverPara(novoX, novoY)) return;
  estado.personagem.x = novoX;
  estado.personagem.y = novoY;
  animarPersonagem(tecla);
  atualizarPosicaoPersonagem();
  verificarZonaAtual();
  mostrarDebugCoordenadas();
}

let temporizadorAnimacaoPersonagem = null;

function animarPersonagem(tecla) {
  elementos.personagem.classList.add("andar");

  if (tecla === "ArrowLeft") {
    elementos.personagem.classList.add("olhar-esquerda");
    elementos.personagem.classList.remove("olhar-direita");
  }

  if (tecla === "ArrowRight") {
    elementos.personagem.classList.add("olhar-direita");
    elementos.personagem.classList.remove("olhar-esquerda");
  }

  if (tecla === "ArrowUp") {
  elementos.personagem.classList.add("olhar-cima");
}

if (tecla === "ArrowDown") {
  elementos.personagem.classList.add("olhar-baixo");
}

  clearTimeout(temporizadorAnimacaoPersonagem);

  temporizadorAnimacaoPersonagem = setTimeout(() => {
    elementos.personagem.classList.remove("andar");
  }, 350);
}

const bancoPerguntas = {
  sabores: [
    {
      id: "sabores_01",
      pergunta: "Muitos muçulmanos não comem carne de porco, porque…",
      opcoesBase: [
        { texto: "A religião islâmica proíbe esse alimento", correta: true, feedback: "" },
        { texto: "É muito cara", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Não gostam do sabor", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Não costumam cozinhar esse tipo de carne", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_02",
      pergunta: "O que significa “halal” na alimentação?",
      opcoesBase: [
        { texto: "Comida permitida segundo o Islão", correta: true, feedback: "" },
        { texto: "Comida muito doce", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Comida proibida", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Comida fria", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_03",
      pergunta: "O que evitam muitos hindus na Índia?",
      opcoesBase: [
        { texto: "Carne de vaca", correta: true, feedback: "" },
        { texto: "Peixe", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Arroz", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fruta", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_04",
      pergunta: "Qual a razão de algumas pessoas não beberem álcool?",
      opcoesBase: [
        { texto: "A sua religião não permite", correta: true, feedback: "" },
        { texto: "É muito caro", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Não gostam do sabor", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pode fazer mal à saúde", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_05",
      pergunta: "Durante o Ramadão, o que fazem muitos muçulmanos durante o dia?",
      opcoesBase: [
        { texto: "Não comem nem bebem até ao pôr do sol", correta: true, feedback: "" },
        { texto: "Comem mais do que o normal", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Só comem doces", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Só bebem água", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_06",
      pergunta: "O que significa comer “kosher” na religião judaica?",
      opcoesBase: [
        { texto: "Comer segundo regras religiosas", correta: true, feedback: "" },
        { texto: "Comer apenas frutas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Comer só pão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Comer alimentos crus", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_07",
      pergunta: "Porque é que algumas pessoas não comem carne às sextas-feiras, em certas tradições cristãs?",
      opcoesBase: [
        { texto: "Porque é tradição religiosa", correta: true, feedback: "" },
        { texto: "Porque não gostam", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque não há carne", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque faz mal à saúde", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_08",
      pergunta: "No Nepal e na Índia, porque muitas pessoas seguem dietas vegetarianas?",
      opcoesBase: [
        { texto: "Por causa da religião e dos costumes", correta: true, feedback: "" },
        { texto: "Porque não há animais", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque é mais barato", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque não sabem cozinhar carne", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_09",
      pergunta: "O que é proibido na alimentação islâmica além da carne de porco?",
      opcoesBase: [
        { texto: "Álcool", correta: true, feedback: "" },
        { texto: "Água", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Arroz", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Legumes", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_10",
      pergunta: "Em muitos países muçulmanos, como começa a refeição depois do pôr do sol no Ramadão?",
      opcoesBase: [
        { texto: "Com água e tâmaras", correta: true, feedback: "" },
        { texto: "Com sopa fria", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Com muita carne", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Com iogurtes, fruta e pão", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_11",
      pergunta: "Qual é o alimento mais comum no Bangladesh?",
      opcoesBase: [
        { texto: "Arroz", correta: true, feedback: "" },
        { texto: "Batata", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Massa", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_12",
      pergunta: "Que prato típico do Bangladesh mistura arroz e lentilhas?",
      opcoesBase: [
        { texto: "Khichuri", correta: true, feedback: "" },
        { texto: "Sushi", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pizza", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Tacos", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_13",
      pergunta: "Na Ucrânia, qual é a sopa tradicional feita com beterraba?",
      opcoesBase: [
        { texto: "Borscht", correta: true, feedback: "" },
        { texto: "Gazpacho", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Caldo verde", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Sopa de peixe", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_14",
      pergunta: "No México, qual destes é um prato típico?",
      opcoesBase: [
        { texto: "Tacos", correta: true, feedback: "" },
        { texto: "Sushi", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Croissants", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Lasanha", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_15",
      pergunta: "No Brasil, que prato é muito conhecido?",
      opcoesBase: [
        { texto: "Feijoada", correta: true, feedback: "" },
        { texto: "Sushi", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Curry", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Couscous", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_16",
      pergunta: "Em Cabo Verde, que prato tradicional é feito com milho e feijão?",
      opcoesBase: [
        { texto: "Cachupa", correta: true, feedback: "" },
        { texto: "Paella", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pizza", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Risoto", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_17",
      pergunta: "Em Moçambique, qual o ingrediente que é muito usado na comida?",
      opcoesBase: [
        { texto: "Coco", correta: true, feedback: "" },
        { texto: "Chocolate", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Queijo azul", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Maçã", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_18",
      pergunta: "No Uzbequistão, o que é “plov”?",
      opcoesBase: [
        { texto: "Um prato de arroz com carne e legumes", correta: true, feedback: "" },
        { texto: "Uma sopa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uma sobremesa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uma bebida", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_19",
      pergunta: "Na Índia, o que é o “curry”?",
      opcoesBase: [
        { texto: "Um prato com molho de especiarias", correta: true, feedback: "" },
        { texto: "Um tipo de fruta", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Um doce tipo pudim", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Um tipo de pão com alho e queijo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_20",
      pergunta: "No Paquistão, que prato é feito com arroz e carne e é muito temperado?",
      opcoesBase: [
        { texto: "Biryani", correta: true, feedback: "" },
        { texto: "Bolonhesa de arroz", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Almôndegas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Crepes de carne", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_21",
      pergunta: "Na Venezuela, qual é o nome típico do pão recheado?",
      opcoesBase: [
        { texto: "Arepas", correta: true, feedback: "" },
        { texto: "Baguete", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Croissant", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Tortilha", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_22",
      pergunta: "No Nepal, que alimentos básicos acompanham muitos pratos?",
      opcoesBase: [
        { texto: "Arroz e lentilhas", correta: true, feedback: "" },
        { texto: "Chocolate e fruta", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Batatas fritas e maionese", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Batata e cenoura assadas", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_23",
      pergunta: "No México, o que é o guacamole?",
      opcoesBase: [
        { texto: "Molho de abacate", correta: true, feedback: "" },
        { texto: "Sopa quente de natas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Bebida com álcool", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Sobremesa à base de fruta", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_24",
      pergunta: "No Brasil, qual a fruta que é muito usada para fazer sumos e sobremesas?",
      opcoesBase: [
        { texto: "Açaí", correta: true, feedback: "" },
        { texto: "Banana", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Toranja", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pêra", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_25",
      pergunta: "No Bangladesh, que acompanhamento é muito comum com peixe?",
      opcoesBase: [
        { texto: "Arroz", correta: true, feedback: "" },
        { texto: "Batata frita", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pão de forma", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Massa", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_26",
      pergunta: "Em Moçambique, qual destes pratos é típico?",
      opcoesBase: [
        { texto: "Matapa", correta: true, feedback: "" },
        { texto: "Arroz de marisco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Khichuri", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Hambúrguer de peixe", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_27",
      pergunta: "Na Ucrânia, que alimento é mais comum como acompanhamento?",
      opcoesBase: [
        { texto: "Batata", correta: true, feedback: "" },
        { texto: "Arroz", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Legumes cozidos", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Salada", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_28",
      pergunta: "Em Cabo Verde, qual o peixe mais consumido?",
      opcoesBase: [
        { texto: "Atum", correta: true, feedback: "" },
        { texto: "Salmão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Bacalhau fresco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Sardinha", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_29",
      pergunta: "No Uzbequistão, como são muitas das refeições em grupo?",
      opcoesBase: [
        { texto: "Todos partilham o mesmo prato", correta: true, feedback: "" },
        { texto: "Cada um come sozinho", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Só as crianças comem", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Só se come com talheres especiais", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "sabores_30",
      pergunta: "Na Índia, que pão achatado é muito popular?",
      opcoesBase: [
        { texto: "Naan", correta: true, feedback: "" },
        { texto: "Croissant", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Baklava", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Panqueca", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    }
  ],
  vozes: [
    {
      id: "vozes_01",
      pergunta: "No Nepal, como se diz “feliz ano novo”?",
      opcoesBase: [
        { texto: "Naya Barsa Ko Subhakamana", correta: true, feedback: "" },
        { texto: "Nha dizu-u bon anu", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "¡Feliz Año Nuevo!", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "З Новим Роком!", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_02",
      pergunta: "Qual a língua falada no Nepal?",
      opcoesBase: [
        { texto: "Nepalês", correta: true, feedback: "" },
        { texto: "Chinês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Japonês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_03",
      pergunta: "No Uzbequistão, quais as línguas mais faladas?",
      opcoesBase: [
        { texto: "Uzbeque e Russo", correta: true, feedback: "" },
        { texto: "Uzbeque e Inglês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uzbeque e Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uzbeque e Hindi", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_04",
      pergunta: "No Uzbequistão, que festa tradicional celebra a chegada da primavera?",
      opcoesBase: [
        { texto: "Navruz", correta: true, feedback: "" },
        { texto: "Carnaval", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Halloween", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Páscoa", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_05",
      pergunta: "Na Ucrânia, qual é a língua oficial?",
      opcoesBase: [
        { texto: "Ucraniano", correta: true, feedback: "" },
        { texto: "Polaco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Turco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_06",
      pergunta: "Na Páscoa, o que muitas famílias ucranianas gostam de fazer?",
      opcoesBase: [
        { texto: "Decorar ovos coloridos", correta: true, feedback: "" },
        { texto: "Apanhar flores na floresta", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Pintar as paredes de casa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fazer uma caça aos ovos", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_07",
      pergunta: "No Paquistão, além do Inglês, que outra língua é oficial?",
      opcoesBase: [
        { texto: "Urdu", correta: true, feedback: "" },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Turco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Coreano", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_08",
      pergunta: "Que festa religiosa é muito importante no Paquistão?",
      opcoesBase: [
        { texto: "Eid", correta: true, feedback: "" },
        { texto: "Carnaval", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Natal", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Hanami", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_09",
      pergunta: "Na Índia, porque é comum ouvir muitas línguas diferentes?",
      opcoesBase: [
        { texto: "Porque o país tem muitas culturas e regiões", correta: true, feedback: "" },
        { texto: "Porque ninguém aprende a mesma língua", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque cada escola tem a sua língua", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Porque as pessoas são obrigadas a aprender uma nova língua a cada 5 anos", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_10",
      pergunta: "Na Índia, qual destas línguas é oficial?",
      opcoesBase: [
        { texto: "Hindi", correta: true, feedback: "" },
        { texto: "Sueco", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Coreano", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Grego", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_11",
      pergunta: "Na Venezuela, qual é a língua oficial?",
      opcoesBase: [
        { texto: "Espanhol", correta: true, feedback: "" },
        { texto: "Árabe", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Hindi", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_12",
      pergunta: "Como se diz “sol” em mandarim?",
      opcoesBase: [
        { texto: "Taiyang", correta: true, feedback: "" },
        { texto: "Soleil", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Suno", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Helios", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_13",
      pergunta: "No Bangladesh, qual é a língua oficial?",
      opcoesBase: [
        { texto: "Bengali", correta: true, feedback: "" },
        { texto: "Hindu", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Inglês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Urdu", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_14",
      pergunta: "No Bangladesh, qual é a festa que celebra a cultura e a língua bengali?",
      opcoesBase: [
        { texto: "Pohela Boishakh", correta: true, feedback: "" },
        { texto: "Natal", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Hanami", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Eid", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_15",
      pergunta: "No México, qual é a língua mais falada?",
      opcoesBase: [
        { texto: "Espanhol", correta: true, feedback: "" },
        { texto: "Inglês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Alemão", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_16",
      pergunta: "Como se diz “obrigado” em alemão?",
      opcoesBase: [
        { texto: "Danke", correta: true, feedback: "" },
        { texto: "Gracias", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Merci", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Thanks", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_17",
      pergunta: "Em Moçambique, qual é a língua oficial?",
      opcoesBase: [
        { texto: "Português", correta: true, feedback: "" },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Alemão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Espanhol", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_18",
      pergunta: "Como se diz “pai” em urdu?",
      opcoesBase: [
        { texto: "Baba", correta: true, feedback: "" },
        { texto: "Papa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Vater", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Père", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_19",
      pergunta: "Como se diz “mãe” em nepalês?",
      opcoesBase: [
        { texto: "Ama", correta: true, feedback: "" },
        { texto: "Madre", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Mutter", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Maman", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_20",
      pergunta: "O português falado no Brasil é…",
      opcoesBase: [
        { texto: "Tem algumas diferenças do de Portugal", correta: true, feedback: "" },
        { texto: "Igual ao de Portugal", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uma mistura de francês e espanhol", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Igual ao falado na Rússia", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_21",
      pergunta: "Em Cabo Verde, que língua é muito usada no dia a dia?",
      opcoesBase: [
        { texto: "Crioulo cabo-verdiano", correta: true, feedback: "" },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Chinês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_22",
      pergunta: "O crioulo cabo-verdiano nasceu da mistura de…",
      opcoesBase: [
        { texto: "Português e línguas africanas", correta: true, feedback: "" },
        { texto: "Alemão e russo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Chinês e japonês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Grego e latim", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_23",
      pergunta: "Como se diz “casa” em árabe?",
      opcoesBase: [
        { texto: "Bayt", correta: true, feedback: "" },
        { texto: "Casa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "House", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Maison", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_24",
      pergunta: "Como se diz “sim” em russo?",
      opcoesBase: [
        { texto: "Da", correta: true, feedback: "" },
        { texto: "Nyet", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Oui", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Danke", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_25",
      pergunta: "Na Austrália, qual é a língua mais usada?",
      opcoesBase: [
        { texto: "Inglês", correta: true, feedback: "" },
        { texto: "Alemão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_26",
      pergunta: "No Egipto, qual é a língua oficial?",
      opcoesBase: [
        { texto: "Árabe", correta: true, feedback: "" },
        { texto: "Francês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Italiano", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Russo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_27",
      pergunta: "Como se diz “água” em bengali?",
      opcoesBase: [
        { texto: "Pani", correta: true, feedback: "" },
        { texto: "Water", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Eau", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Aqua", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_28",
      pergunta: "Na China, qual é a língua mais falada?",
      opcoesBase: [
        { texto: "Mandarim", correta: true, feedback: "" },
        { texto: "Japonês", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Coreano", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Tailandês", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_29",
      pergunta: "Como se diz “obrigado” em hindi?",
      opcoesBase: [
        { texto: "Dhanyavaad", correta: true, feedback: "" },
        { texto: "Gracias", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Danke", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Merci", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "vozes_30",
      pergunta: "Como se diz “Bom dia” em francês?",
      opcoesBase: [
        { texto: "Bonjour", correta: true, feedback: "" },
        { texto: "Ciao", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Buenos días", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Good morning", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    }
  ],
  coragem: [
    {
      id: "coragem_01",
      pergunta: "O João vê um colega novo de outro país sozinho no recreio. O que deve fazer?",
      opcoesBase: [
        { texto: "Convidá-lo para brincar", correta: true, feedback: "" },
        { texto: "Ignorá-lo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir-se dele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer que não pode brincar ali", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_02",
      pergunta: "A Ana ouve alguém dizer “não gosto de pessoas daquele país”. O que pode fazer?",
      opcoesBase: [
        { texto: "Dizer que todas as pessoas merecem respeito", correta: true, feedback: "" },
        { texto: "Concordar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fingir que não ouviu", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir muito", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_03",
      pergunta: "Um colega fala uma língua diferente. O que podes fazer?",
      opcoesBase: [
        { texto: "Tentar aprender algumas palavras", correta: true, feedback: "" },
        { texto: "Gozar com ele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Afastar-te", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer para ele não falar", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_04",
      pergunta: "O Miguel vê alguém excluído por ser estrangeiro. O que mostra coragem?",
      opcoesBase: [
        { texto: "Defender a pessoa", correta: true, feedback: "" },
        { texto: "Fingir que não viu", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Juntar-se à exclusão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ir embora", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_05",
      pergunta: "Uma nova colega traz comida diferente. O que fazer?",
      opcoesBase: [
        { texto: "Mostrar curiosidade e respeito", correta: true, feedback: "" },
        { texto: "Criticar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Recusar olhar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir e gozar", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_06",
      pergunta: "Um grupo não deixa entrar um colega por causa da nacionalidade. O que é correto?",
      opcoesBase: [
        { texto: "Convidá-lo a participar", correta: true, feedback: "" },
        { texto: "Ajudar a excluir", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fingir que não se passa nada", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ficar quieto por medo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_07",
      pergunta: "Um colega da tua turma usa roupas tradicionais do seu país. O que podes fazer?",
      opcoesBase: [
        { texto: "Perguntar com respeito sobre a roupa", correta: true, feedback: "" },
        { texto: "Rir das roupas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer que são estranhas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer para vestir outra coisa", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_08",
      pergunta: "Se alguém diz que só crianças do mesmo país podem brincar juntas, devo:",
      opcoesBase: [
        { texto: "Discordar com respeito", correta: true, feedback: "" },
        { texto: "Concordar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Repetir a frase", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Afastar-me sem dizer nada", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_09",
      pergunta: "Um colega tem um sotaque diferente. O que é correto?",
      opcoesBase: [
        { texto: "Respeitar", correta: true, feedback: "" },
        { texto: "Imitar para gozar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Evitar falar com ele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_10",
      pergunta: "A coragem significa:",
      opcoesBase: [
        { texto: "Fazer o que está certo, mesmo sendo difícil", correta: true, feedback: "" },
        { texto: "Fazer o que todos fazem, é mais fácil", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Nunca dizer o que se pensa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir dos outros para não ser gozado", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_11",
      pergunta: "O Amir ainda está a aprender português e não percebeu o jogo. O que podes fazer?",
      opcoesBase: [
        { texto: "Explicar com calma", correta: true, feedback: "" },
        { texto: "Gozar com ele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorá-lo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Mandá-lo embora", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_12",
      pergunta: "O que fazer quando alguém é tratado de forma injusta?",
      opcoesBase: [
        { texto: "Ajudar", correta: true, feedback: "" },
        { texto: "Ignorar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ir embora", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_13",
      pergunta: "Uma colega nova ficou sozinha na sala. O que mostra inclusão?",
      opcoesBase: [
        { texto: "Convidá-la para se juntar ao grupo", correta: true, feedback: "" },
        { texto: "Ignorá-la", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer que não há espaço", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fingir que não viste", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_14",
      pergunta: "Um colega novo não entende tudo. O que fazer?",
      opcoesBase: [
        { texto: "Ajudar com paciência", correta: true, feedback: "" },
        { texto: "Ignorar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Gozar com ele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Mandá-lo embora", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_15",
      pergunta: "O que mostra empatia?",
      opcoesBase: [
        { texto: "Tentar compreender os outros", correta: true, feedback: "" },
        { texto: "Pensar só em si", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorar sentimentos", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir dos outros", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_16",
      pergunta: "Se alguém é excluído por ser de outro país:",
      opcoesBase: [
        { texto: "É errado", correta: true, feedback: "" },
        { texto: "É correto", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Não importa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "É divertido", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_17",
      pergunta: "O que podes fazer para conhecer outras culturas?",
      opcoesBase: [
        { texto: "Fazer perguntas com respeito", correta: true, feedback: "" },
        { texto: "Evitar pessoas diferentes", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir dos costumes", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer que só a tua cultura é importante", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_18",
      pergunta: "Um colega sente-se triste por estar sozinho. O que podes fazer?",
      opcoesBase: [
        { texto: "Convidá-lo para brincar", correta: true, feedback: "" },
        { texto: "Ignorá-lo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Dizer que não é problema teu", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_19",
      pergunta: "O respeito significa:",
      opcoesBase: [
        { texto: "Tratar bem todos", correta: true, feedback: "" },
        { texto: "Tratar mal quem é diferente", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorar as pessoas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ser simpático só com amigos", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_20",
      pergunta: "O que fazer quando alguém goza com outra cultura?",
      opcoesBase: [
        { texto: "Dizer que não está certo", correta: true, feedback: "" },
        { texto: "Rir muito", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Concordar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fingir que não ouviste", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_21",
      pergunta: "Um novo colega não conhece as regras. O que fazer?",
      opcoesBase: [
        { texto: "Explicar as regras com calma", correta: true, feedback: "" },
        { texto: "Gozar com ele", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorá-lo", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Criticá-lo", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_22",
      pergunta: "O que é diversidade?",
      opcoesBase: [
        { texto: "Pessoas que vivem e pensam de formas diferentes", correta: true, feedback: "" },
        { texto: "Sermos todos iguais e divertidos", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Uma regra da escola", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Um jogo de recreio", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_23",
      pergunta: "O que fazer se um amigo exclui outro colega?",
      opcoesBase: [
        { texto: "Dizer que não está certo", correta: true, feedback: "" },
        { texto: "Ajudar a excluir", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ficar calado", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ir embora", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_24",
      pergunta: "O que significa aceitar os outros?",
      opcoesBase: [
        { texto: "Respeitar", correta: true, feedback: "" },
        { texto: "Ignorar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Criticar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Rir", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_25",
      pergunta: "O que fazer ao ouvir uma língua diferente?",
      opcoesBase: [
        { texto: "Ter curiosidade", correta: true, feedback: "" },
        { texto: "Gozar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Mandar calar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Fingir que não ouviste", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_26",
      pergunta: "O que é uma atitude corajosa?",
      opcoesBase: [
        { texto: "Defender quem precisa", correta: true, feedback: "" },
        { texto: "Excluir quem é diferente", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorar uma injustiça", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Gozar com a situação", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_27",
      pergunta: "Um colega estrangeiro quer brincar contigo. O que fazer?",
      opcoesBase: [
        { texto: "Aceitar", correta: true, feedback: "" },
        { texto: "Recusar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Gozar", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Ignorar", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_28",
      pergunta: "O que fazer quando não entendes alguém?",
      opcoesBase: [
        { texto: "Pedir ajuda ou tentar compreender", correta: true, feedback: "" },
        { texto: "Rir da pessoa", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Virar costas", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Criticar", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_29",
      pergunta: "O que ajuda a criar amizade?",
      opcoesBase: [
        { texto: "Respeito", correta: true, feedback: "" },
        { texto: "Exclusão", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Mentiras", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Falar mal dos outros", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    },
    {
      id: "coragem_30",
      pergunta: "O que é mais importante?",
      opcoesBase: [
        { texto: "Respeitar-nos e respeitar os outros", correta: true, feedback: "" },
        { texto: "Ser igual aos outros", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Falar mal dos colegas e não pensar nos sentimentos deles", correta: false, feedback: "Essa não é a resposta correta." },
        { texto: "Respeitarmo-nos a nós próprios e ignorar os outros", correta: false, feedback: "Essa não é a resposta correta." }
      ]
    }
  ]
};


function obterPerguntaAleatoria(area) {
  const banco = bancoPerguntas[area];
  const recentes = estado.perguntasRecentes[area] || [];
  const candidatas = banco.filter((pergunta) => !recentes.includes(pergunta.id));
  const lista = candidatas.length ? candidatas : banco;
  const base = lista[Math.floor(Math.random() * lista.length)];

  estado.perguntasRecentes[area].push(base.id);

  if (estado.perguntasRecentes[area].length > 8) {
    estado.perguntasRecentes[area].shift();
  }

  return {
    ...base,
    opcoesApresentadas: embaralharArray(base.opcoesBase)
  };
}


function obterPerguntaPorId(area, id) {
  const banco = bancoPerguntas[area] || [];
  return banco.find((pergunta) => pergunta.id === id) || null;
}

function criarPerguntaApresentavel(base, ordemTextos = null) {
  let opcoesApresentadas = embaralharArray(base.opcoesBase);

  if (Array.isArray(ordemTextos) && ordemTextos.length > 0) {
    const porTexto = new Map(base.opcoesBase.map((opcao) => [opcao.texto, opcao]));
    const reconstruidas = ordemTextos
      .map((texto) => porTexto.get(texto))
      .filter(Boolean);

    if (reconstruidas.length === base.opcoesBase.length) {
      opcoesApresentadas = reconstruidas;
    }
  }

  return {
    ...base,
    opcoesApresentadas
  };
}

function obterPerguntaParaArea(area) {
  const pendente = estado.perguntaPendente?.[area];

  if (pendente?.id) {
    const basePendente = obterPerguntaPorId(area, pendente.id);
    if (basePendente) {
      return criarPerguntaApresentavel(basePendente, pendente.opcoesTextos);
    }
  }

  const pergunta = obterPerguntaAleatoria(area);

  estado.perguntaPendente[area] = {
    id: pergunta.id,
    opcoesTextos: pergunta.opcoesApresentadas.map((opcao) => opcao.texto)
  };

  guardarEstado();
  return pergunta;
}

function limparPerguntaPendente(area) {
  if (!estado.perguntaPendente) return;
  estado.perguntaPendente[area] = null;
}

function abrirPerguntaArea(area) {
  if (area === "vozes" && !estado.pontes.ponte1) {
    abrirMensagem(
      "Jardim das Vozes",
      "Primeiro tens de construir a Ponte 1 para chegares a esta área."
    );
    return;
  }

  if (area === "coragem" && !estado.pontes.ponte2) {
    abrirMensagem(
      "Acampamento da Coragem",
      "Primeiro tens de construir a Ponte 2 para chegares a esta área."
    );
    return;
  }

  const pergunta = obterPerguntaParaArea(area);

  const icones = {
    sabores: "🍲",
    vozes: "🗣️",
    coragem: "💛"
  };

  const nomes = {
    sabores: "Praça dos Sabores",
    vozes: "Jardim das Vozes",
    coragem: "Acampamento da Coragem"
  };

  abrirModal({
    etiqueta: "",
    titulo: "",
    conteudo: criarPergaminhoNarrativoHTML({
      titulo: nomes[area],
      classe: `pergaminho-pergunta-area pergaminho-area-${area}`,
      conteudo: `
        <p class="pergaminho-pergunta-texto">${pergunta.pergunta}</p>
        <div class="modal-opcoes pergaminho-opcoes">
          ${pergunta.opcoesApresentadas.map((opcao, indice) =>
            `<button type="button" class="modal-opcao" data-opcao="${indice}">${opcao.texto}</button>`
          ).join("")}
        </div>
        <p id="modal-feedback" class="modal-feedback"></p>
      `
    }),
    acoes: [
      { texto: "Fechar", onClick: fecharModal, secundario: true }
    ]
  });

  document.querySelectorAll(".modal-opcao").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((opcao) => {
  opcao.disabled = true;
});
      const resposta = pergunta.opcoesApresentadas[Number(botao.dataset.opcao)];
      limparPerguntaPendente(area);
      const feedback = document.getElementById("modal-feedback");

      feedback.classList.remove("certo", "errado");

      if (resposta.correta) {
  tocarSom("sucesso");

  botao.classList.add("resposta-certa");

  document.querySelectorAll(".modal-opcao").forEach((opcao) => {
    if (opcao !== botao) {
      opcao.classList.add("resposta-bloqueada");
    }
  });

  estado.estrelas += 1;
  estado.estatisticas.perguntasCertas[area] += 1;

  atualizarHUD();
  animarElementoHUD(elementos.pontuacaoJogador);
  guardarEstado();

  feedback.textContent = `${escolherMensagem(mensagensAcerto)} Ganhaste 1 estrela.`;
  feedback.classList.add("certo");

  setTimeout(() => {
    finalizarPerguntaCorreta(area);
  }, 1300);

} else {
  tocarSom("erro");

  botao.classList.add("resposta-errada");

  feedback.textContent = `${escolherMensagem(mensagensErro)} ${resposta.feedback || "Essa não é a resposta certa."}`;
  feedback.classList.add("errado");

  setTimeout(() => abrirPerguntaArea(area), 1900);
}
    });
  });
}

function construirMiniJogoOficina(ponte) {
  return {
    ponte1: {
      titulo: "Oficina — Escolhe o material certo",
      descricao: "Qual destes materiais é mais resistente para preparar a ponte?",
      opcoes: [
        { texto: "Madeira tratada", correta: true },
        { texto: "Balões coloridos", correta: false },
        { texto: "Cubos de gelo", correta: false }
      ]
    },
    ponte2: {
      titulo: "Oficina — Faz o par certo",
      descricao: "Escolhe a ferramenta que combina melhor com a construção segura da ponte.",
      opcoes: [
        { texto: "Peças de ligação", correta: true },
        { texto: "Confetes", correta: false },
        { texto: "Sabão", correta: false }
      ]
    },
    ponte3: {
      titulo: "Oficina — Escolha visual",
      descricao: "Qual destes elementos ajuda mais a reforçar a ponte final?",
      opcoes: [
        { texto: "Suportes resistentes", correta: true },
        { texto: "Folhas secas", correta: false },
        { texto: "Espuma leve", correta: false }
      ]
    }
  }[ponte];
}

function iniciarMiniJogoOficina(ponte) {
  const jogo = construirMiniJogoOficina(ponte);
  const opcoes = embaralharArray(jogo.opcoes);

  abrirModal({
    etiqueta: "🏠",
    titulo: jogo.titulo,
    conteudo: `
      <p>${jogo.descricao}</p>
      <div class="modal-opcoes">
        ${opcoes.map((opcao, indice) =>
          `<button type="button" class="modal-opcao" data-opcao="${indice}">${opcao.texto}</button>`
        ).join("")}
      </div>
      <p id="modal-feedback" class="modal-feedback"></p>
    `,
    acoes: [
      { texto: "Fechar", onClick: fecharModal, secundario: true }
    ]
  });

  document.querySelectorAll(".modal-opcao").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((opcao) => {
  opcao.disabled = true;
});
      const resposta = opcoes[Number(botao.dataset.opcao)];
      const feedback = document.getElementById("modal-feedback");

      feedback.classList.remove("certo", "errado");

      if (resposta.correta) {
        tocarSom("sucesso");

        estado.materiais[ponte] += 3;

        atualizarHUD();
        animarElementoHUD(elementos.materiaisJogador);
        guardarEstado();

        feedback.textContent = `Conseguiste! Ganhaste 3 materiais para a ${nomePonte(ponte)}.`;
        feedback.classList.add("certo");

        setTimeout(() => {
          fecharModal();
          verificarZonaAtual();
        }, 1300);

      } else {
        tocarSom("erroForte");

        feedback.textContent = "Não conseguiste o material desta vez. A estrela investida já foi gasta.";
        feedback.classList.add("errado");
      }
    });
  });
}

function abrirOficina() {
  const ponte = proximaPonteEmProgresso();

  if (!ponte) {
    abrirModal({
      etiqueta: "🏠",
      titulo: "Oficina",
      conteudo: "<p>Todas as pontes já foram construídas. A Oficina está em descanso.</p>",
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  const materiaisAtuais = estado.materiais[ponte] || 0;
  const materiaisNecessarios = ponteMeta[ponte].materiaisNecessarios || 3;

  if (materiaisAtuais >= materiaisNecessarios) {
    abrirModal({
      etiqueta: "🏠",
      titulo: "Oficina",
      conteudo: `
        <p>Já tens os materiais necessários para a ${nomePonte(ponte)}.</p>
        <p>Vai até à ponte para tentares construí-la.</p>
      `,
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  if (estado.estrelas < 1) {
    abrirModal({
      etiqueta: "🏠",
      titulo: "Oficina",
      conteudo: `
        <p>Precisas de pelo menos 1 estrela para tentar juntar 3 materiais para a ${nomePonte(ponte)}.</p>
      `,
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  abrirModal({
    etiqueta: "🏠",
    titulo: "Oficina",
    conteudo: `
      <p>Tens ${estado.estrelas} estrela${estado.estrelas === 1 ? "" : "s"} ${estado.estrelas === 1 ? "disponível" : "disponíveis"}.</p>
      <p>Para tentares juntar 3 materiais para a ${nomePonte(ponte)}, vais gastar 1 estrela.</p>
    `,
    acoes: [
      {
        texto: "Aceitar desafio",
        classe: "botao-aceitar-oficina",
        onClick: () => {
          estado.estrelas -= 1;

          atualizarHUD();
          animarElementoHUD(elementos.pontuacaoJogador);
          guardarEstado();

          fecharModal();

          setTimeout(() => {
            if (ponte === "ponte1" && typeof iniciarMiniJogoCaixasPerdidas === "function") {
              iniciarMiniJogoCaixasPerdidas(ponte);
              return;
            }

            if (ponte === "ponte2" && typeof iniciarMiniJogoBarcosRio === "function") {
              iniciarMiniJogoBarcosRio({ ponte: "ponte2" });
              return;
            }

            if (ponte === "ponte3" && typeof iniciarMiniJogoCargasPerdidas === "function") {
              iniciarMiniJogoCargasPerdidas({ ponte: "ponte3" });
              return;
            }

            iniciarMiniJogoOficina(ponte);
          }, 120);
        }
      },
      {
        texto: "Voltar depois",
        onClick: fecharModal,
        secundario: true
      }
    ]
  });
}

function concluirConstrucaoPonte(ponte, feedbackEl) {
  tocarSom("ponte");

  terminarTentativaConstrucaoComRisco();

  estado.pontes[ponte] = true;

  atualizarEstadoVisualMapa();
  guardarEstado();
  verificarZonaAtual();

  feedbackEl.textContent = `${nomePonte(ponte)} construída com sucesso!`;
  feedbackEl.classList.remove("errado");
  feedbackEl.classList.add("certo");

  setTimeout(() => {
    fecharModal();

    if (ponte === "ponte1") {
      abrirModal({
        etiqueta: "✨",
        titulo: "Ponte 1 construída!",
        conteudo: "<p>Conseguiste! Agora já podes seguir para o Jardim das Vozes.</p>",
        acoes: [{ texto: "Continuar", onClick: fecharModal }]
      });
      return;
    }

    if (ponte === "ponte2") {
      abrirModal({
        etiqueta: "✨",
        titulo: "Ponte 2 construída!",
        conteudo: "<p>Conseguiste! A ponte horizontal está pronta e o acesso à Área 3 ficou desbloqueado.</p>",
        acoes: [{ texto: "Continuar", onClick: fecharModal }]
      });
      return;
    }

    abrirModal({
      etiqueta: "🎉",
      titulo: "Todas as pontes estão ligadas!",
      conteudo: "<p>Terminaste a reconstrução das pontes e ajudaste Mosaico a ficar mais unido.</p>",
      acoes: [
        {
          texto: "Jogar novamente",
          onClick: () => {
            localStorage.removeItem(STORAGE_KEY_V3);
            localStorage.removeItem(STORAGE_KEY_V1);

            estado = criarEstadoInicial();

            atualizarHUD();
            atualizarPerfil();
            atualizarEstadoVisualMapa();
            atualizarPosicaoPersonagem();

            fecharModal();
            mostrarEcra("inicial");
          }
        },
        {
          texto: "Explorar mapa",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
  }, 1300);
}

function miniJogoPonteSequencia(ponte) {
  const sequenciaCorreta = ["Base", "Apoios", "Tábuas"];
  const ordemApresentada = embaralharArray([
    ["Apoios", "Base", "Tábuas"],
    ["Base", "Tábuas", "Apoios"],
    ["Base", "Apoios", "Tábuas"]
  ]);

  abrirModal({
    etiqueta: "🌉",
    titulo: `Construção da ${nomePonte(ponte)}`,
    conteudo: `<p>Escolhe a sequência mais segura para montar a ponte.</p><div class="modal-opcoes">${ordemApresentada.map((linha, indice) => `<button type="button" class="modal-opcao" data-opcao="${indice}">${linha.join(" → ")}</button>`).join("")}</div><p id="modal-feedback" class="modal-feedback"></p>`,
    acoes: [{ texto: "Fechar", onClick: fecharModal, secundario: true }]
  });

  document.querySelectorAll(".modal-opcao").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((opcao) => {
  opcao.disabled = true;
});
      const feedback = document.getElementById("modal-feedback");
      const escolha = ordemApresentada[Number(botao.dataset.opcao)];
      feedback.classList.remove("certo", "errado");
      if (JSON.stringify(escolha) === JSON.stringify(sequenciaCorreta)) {
        concluirConstrucaoPonte(ponte, feedback);
      } else {
        tocarSom("erroForte");
        feedback.textContent = "A construção falhou. Os 3 materiais já foram usados nesta tentativa.";
        feedback.classList.add("errado");
      }
    });
  });
}

function miniJogoPonteAssociacao(ponte) {
  const opcoes = embaralharArray([
    { texto: "Peças de ligação + encaixe firme", correta: true },
    { texto: "Confetes + decoração principal", correta: false },
    { texto: "Sabão + piso seguro", correta: false }
  ]);
  abrirModal({
    etiqueta: "🌉",
    titulo: `Construção da ${nomePonte(ponte)}`,
    conteudo: `<p>Escolhe a associação que ajuda melhor a estabilizar a ponte.</p><div class="modal-opcoes">${opcoes.map((opcao, indice) => `<button type="button" class="modal-opcao" data-opcao="${indice}">${opcao.texto}</button>`).join("")}</div><p id="modal-feedback" class="modal-feedback"></p>`,
    acoes: [{ texto: "Fechar", onClick: fecharModal, secundario: true }]
  });
  document.querySelectorAll(".modal-opcao").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((opcao) => {
  opcao.disabled = true;
});
      const feedback = document.getElementById("modal-feedback");
      const escolha = opcoes[Number(botao.dataset.opcao)];
      feedback.classList.remove("certo", "errado");
      if (escolha.correta) concluirConstrucaoPonte(ponte, feedback);
      else {
        tocarSom("erroForte");
        feedback.textContent = "A tentativa falhou. Os 3 materiais já foram gastos.";
        feedback.classList.add("errado");
      }
    });
  });
}

function miniJogoPonteEscolhaFinal(ponte) {
  const opcoes = embaralharArray([
    { texto: "Colocar suportes antes da travessia final", correta: true },
    { texto: "Decorar primeiro e fixar depois", correta: false },
    { texto: "Passar já por cima sem verificar", correta: false }
  ]);
  abrirModal({
    etiqueta: "🌉",
    titulo: `Construção da ${nomePonte(ponte)}`,
    conteudo: `<p>Escolhe a decisão mais segura para terminar a ponte final.</p><div class="modal-opcoes">${opcoes.map((opcao, indice) => `<button type="button" class="modal-opcao" data-opcao="${indice}">${opcao.texto}</button>`).join("")}</div><p id="modal-feedback" class="modal-feedback"></p>`,
    acoes: [{ texto: "Fechar", onClick: fecharModal, secundario: true }]
  });
  document.querySelectorAll(".modal-opcao").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((opcao) => {
  opcao.disabled = true;
});
      const feedback = document.getElementById("modal-feedback");
      const escolha = opcoes[Number(botao.dataset.opcao)];
      feedback.classList.remove("certo", "errado");
      if (escolha.correta) concluirConstrucaoPonte(ponte, feedback);
      else {
        tocarSom("erroForte");
        terminarTentativaConstrucaoComRisco();
        feedback.textContent = "A ponte não ficou estável. Perdeste os materiais desta tentativa.";
        feedback.classList.add("errado");
      }
    });
  });
}

function iniciarMiniJogoPonte(ponte) {
  if (ponte === "ponte2" && typeof iniciarMiniJogoLigacoesLuminosas === "function") {
    return iniciarMiniJogoLigacoesLuminosas({ ponte: "ponte2" });
  }

  if (ponte === "ponte3" && typeof iniciarMiniJogoUltimaTravessia === "function") {
    return iniciarMiniJogoUltimaTravessia({ ponte: "ponte3" });
  }

  if (ponteMeta[ponte].tipoMiniJogo === "reconstrucao-visual" && typeof iniciarFluxoReconstrucaoPonte1 === "function") {
    return iniciarFluxoReconstrucaoPonte1();
  }

  if (ponteMeta[ponte].tipoMiniJogo === "sequencia") return miniJogoPonteSequencia(ponte);
  if (ponteMeta[ponte].tipoMiniJogo === "associacao") return miniJogoPonteAssociacao(ponte);
  return miniJogoPonteEscolhaFinal(ponte);
}

function abrirConstrucaoPonte(ponte) {
  const materiaisNecessarios = ponteMeta[ponte]?.materiaisNecessarios || 3;

  if (estado.pontes[ponte]) {
    abrirModal({
      etiqueta: "🌉",
      titulo: nomePonte(ponte),
      conteudo: "<p>Esta ponte já foi construída.</p>",
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  /* ORDEM DAS PONTES */

  if (ponte === "ponte2" && !estado.pontes.ponte1) {
    abrirModal({
      etiqueta: "🌉",
      titulo: "Ponte 2",
      conteudo: "<p>Primeiro tens de construir a Ponte 1.</p>",
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  if (ponte === "ponte3" && !estado.pontes.ponte2) {
    abrirModal({
      etiqueta: "🌉",
      titulo: "Ponte 3",
      conteudo: "<p>Primeiro tens de construir a Ponte 2.</p>",
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  /* CONCLUSÃO DA ÁREA CERTA */

  const mundo = ponteMeta[ponte].zonaOrigem;

  if (!mundoConcluido(mundo)) {
    abrirModal({
      etiqueta: "🌉",
      titulo: nomePonte(ponte),
      conteudo: `<p>Primeiro tens de ganhar 3 estrelas na área ${nomeZonaBonita(mundo)}.</p>`,
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  /* MATERIAIS E ESTADO DA CONSTRUÇÃO */

  if (ponte === "ponte1" && estado.ponte1Construcao?.emConstrucao) {
    iniciarMiniJogoPonte("ponte1");
    return;
  }

  if (estado.materiais[ponte] < materiaisNecessarios) {
    abrirModal({
      etiqueta: "🌉",
      titulo: nomePonte(ponte),
      conteudo: `
        <p>Ainda não tens materiais suficientes.</p>
        <p><strong>Materiais: ${estado.materiais[ponte]}/${materiaisNecessarios}</strong></p>
      `,
      acoes: [
        {
          texto: "Fechar",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  if (ponte === "ponte1") {
    abrirModal({
      etiqueta: "🌉",
      titulo: "Construir Ponte 1",
      conteudo: `
        <p>Ótimo! Já tens os ${materiaisNecessarios} materiais para começar a construir esta ponte.</p>
        <p>Vais usar esses materiais na construção. Depois, monta todas as peças até a ponte ficar completa.</p>
        <p><strong>Nesta primeira ponte não perdes por tentar:</strong> podes continuar até conseguires.</p>
      `,
      acoes: [
        {
          texto: "Usar materiais",
          classe: "botao-usar-materiais",
          onClick: () => {
            estado.materiais.ponte1 = 0;
            estado.ponte1Construcao = {
              emConstrucao: true,
              materiaisInvestidos: true
            };
            atualizarHUD();
            guardarEstado();
            iniciarMiniJogoPonte("ponte1");
          }
        },
        {
          texto: "Voltar depois",
          onClick: fecharModal,
          secundario: true
        }
      ]
    });
    return;
  }

  /* TENTATIVA DE CONSTRUÇÃO DAS RESTANTES PONTES */

  abrirModal({
    etiqueta: "🌉",
    titulo: `Construir ${nomePonte(ponte)}`,
    conteudo: `
      <p>Ótimo! Já tens os materiais necessários para construir esta ponte.</p>
      <p>Para isso, vais gastar esses materiais e tentar passar o desafio!</p>
      <p>Se venceres, a ponte fica construída.</p>
      <p>Se não conseguires, ficas sem os materiais e tens de voltar a reuni-los.</p>
    `,
    acoes: [
      {
        texto: "Aceitar desafio",
        onClick: () => {
          estado.materiais[ponte] = 0;
          iniciarTentativaConstrucaoComRisco(ponte);
          atualizarHUD();
          guardarEstado();
          iniciarMiniJogoPonte(ponte);
        }
      },
      {
        texto: "Voltar depois",
        onClick: fecharModal,
        secundario: true
      }
    ]
  });
}

function abrirZona(tipo) {
  if (tipo === "sabores") {
    esconderGuiaSabores();
    return abrirPerguntaArea("sabores");
  }

  if (tipo === "oficina") {
    esconderGuiaOficina();
    return abrirOficina();
  }

  if (tipo === "vozes") {
    if (!estado.pontes.ponte1) {
      return abrirMensagem(
        "Jardim das Vozes",
        "Primeiro tens de construir a Ponte 1 para chegares a esta zona."
      );
    }

    return abrirPerguntaArea("vozes");
  }

  if (tipo === "coragem") {
    if (!estado.pontes.ponte2) {
      return abrirMensagem(
        "Área 3",
        "Primeiro tens de construir a Ponte 2 para chegares a esta zona."
      );
    }

    return abrirPerguntaArea("coragem");
  }

  if (tipo === "ponte1") return abrirConstrucaoPonte("ponte1");
  if (tipo === "ponte2") return abrirConstrucaoPonte("ponte2");
  if (tipo === "ponte3") return abrirConstrucaoPonte("ponte3");
}

function configurarAvatar() {
  elementos.avatares.forEach((avatar) => {
    avatar.addEventListener("click", () => {
      elementos.avatares.forEach((item) => {
        item.classList.remove("selecionado");
      });

      avatar.classList.add("selecionado");
      estado.avatarSelecionado = avatar.dataset.avatar;

      if (elementos.avatarMapa) {
        elementos.avatarMapa.src = estado.avatarSelecionado;
      }
    });
  });
}

function configurarInterface() {
  configurarSons();

  elementos.botaoJogar.addEventListener("click", () => {
    tocarSom("click");
    iniciarMusicaFundo();
    atualizarPerfil();
    mostrarEcra("perfil");
  });

  elementos.botaoComecar.addEventListener("click", () => {
    tocarSom("click");

    const nome = elementos.inputNome.value.trim();

    if (!nome) {
      elementos.mensagemErro.textContent = "Escreve o teu nome para continuar.";
      return;
    }

    if (!estado.avatarSelecionado) {
      elementos.mensagemErro.textContent = "Escolhe um avatar para continuar.";
      return;
    }

    estado.nomeJogador = nome;
    elementos.mensagemErro.textContent = "";

    atualizarHUD();
    atualizarEstadoVisualMapa();
    atualizarPosicaoPersonagem();
    guardarEstado();

    tocarSom("inicio");
    iniciarMusicaFundo();

    mostrarEcra("mapa");
    atualizarGuiasMapa();
    verificarZonaAtual();
    setTimeout(mostrarTutorialInicialDoMapa, 350);
  });

  elementos.botaoEditarPerfil.addEventListener("click", () => {
    tocarSom("click");
    atualizarBotaoSom();
    abrirPainelDefinicoes();
  });

  elementos.botaoFecharDefinicoes.addEventListener("click", () => {
    tocarSom("click");
    fecharPainelDefinicoes();
  });

  elementos.botaoSom.addEventListener("click", alternarSom);

  elementos.botaoVoltarPerfil.addEventListener("click", () => {
    tocarSom("click");
    fecharPainelDefinicoes();
    atualizarPerfil();
    mostrarEcra("perfil");
  });

  elementos.botaoVoltarInicio.addEventListener("click", () => {
    tocarSom("click");
    reiniciarJogoCompleto();
  });

  elementos.modalFechar.addEventListener("click", () => {
    tocarSom("click");
    fecharModal();
  });

  elementos.modalOverlay.addEventListener("click", (evento) => {
    if (evento.target === elementos.modalOverlay) fecharModal();
  });

  let ultimoHover = 0;

  document.addEventListener("pointerover", (evento) => {
    const botao = evento.target.closest("button");
    if (!botao) return;

    const agora = Date.now();
    if (agora - ultimoHover < 120) return;

    ultimoHover = agora;

    tocarSom("hover");
  });
}

function abrirPainelDefinicoes() {
  if (!elementos.painelDefinicoes) return;

  elementos.painelDefinicoes.classList.remove("oculto");

  requestAnimationFrame(() => {
    elementos.painelDefinicoes.classList.add("aberto");
  });

  elementos.painelDefinicoes.setAttribute("aria-hidden", "false");
}

function fecharPainelDefinicoes() {
  if (!elementos.painelDefinicoes) return;

  elementos.painelDefinicoes.classList.remove("aberto");
  elementos.painelDefinicoes.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    elementos.painelDefinicoes.classList.add("oculto");
  }, 220);
}

function atualizarBotaoSom() {
  if (!elementos.botaoSom) return;

  const somLigado = estado.somLigado !== false;
  elementos.botaoSom.textContent = somLigado
    ? "🔊 Som: ligado"
    : "🔇 Som: desligado";
}

function alternarSom() {
  const somVaiFicarLigado = estado.somLigado === false;

  estado.somLigado = somVaiFicarLigado;
  atualizarBotaoSom();
  guardarEstado();

  if (somVaiFicarLigado) {
    tocarSom("click", { forcar: true });
    iniciarMusicaFundo();
  } else {
    sons.musicaFundo.pause();
  }
}

function moverFocoCaixasPerdidas(direcao) {
  const caixas = Array.from(
    elementos.modalOverlay.querySelectorAll(".caixa-mini-jogo:not(:disabled)")
  );

  if (caixas.length === 0) return;

  const caixaAtual = document.activeElement;

  if (!caixas.includes(caixaAtual)) {
    caixas[0].focus();
    return;
  }

  const rectAtual = caixaAtual.getBoundingClientRect();

  const centroAtual = {
    x: rectAtual.left + rectAtual.width / 2,
    y: rectAtual.top + rectAtual.height / 2
  };

  let melhorCaixa = null;
  let melhorPontuacao = Infinity;

  caixas.forEach((caixa) => {
    if (caixa === caixaAtual) return;

    const rect = caixa.getBoundingClientRect();

    const centro = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const dx = centro.x - centroAtual.x;
    const dy = centro.y - centroAtual.y;

    let direcaoValida = false;
    let pontuacao = Infinity;

    if (direcao === "esquerda" && dx < -10) {
      direcaoValida = true;
      pontuacao = Math.abs(dx) + Math.abs(dy) * 1.8;
    }

    if (direcao === "direita" && dx > 10) {
      direcaoValida = true;
      pontuacao = Math.abs(dx) + Math.abs(dy) * 1.8;
    }

    if (direcao === "cima" && dy < -10) {
      direcaoValida = true;
      pontuacao = Math.abs(dy) + Math.abs(dx) * 1.8;
    }

    if (direcao === "baixo" && dy > 10) {
      direcaoValida = true;
      pontuacao = Math.abs(dy) + Math.abs(dx) * 1.8;
    }

    if (direcaoValida && pontuacao < melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhorCaixa = caixa;
    }
  });

  if (melhorCaixa) {
    melhorCaixa.focus();
  }
}

/* =========================================================
   TECLADO — ARQUITETURA MODULAR
   =========================================================
   Regra:
   - cada função trata apenas um contexto;
   - devolve true quando consumiu a tecla;
   - devolve false quando não fez nada;
   - configurarTeclado() fica apenas como ponto de ligação global.
   ========================================================= */

function configurarTeclado() {
  document.addEventListener("keydown", gerirTecladoGlobal);

  window.addEventListener("blur", () => {
    atualizarPosicaoPersonagem();
  });

  window.addEventListener("focus", () => {
    atualizarPosicaoPersonagem();
  });
}

function gerirTecladoGlobal(evento) {
  if (estado.modalAberto) {
    gerirTecladoModal(evento);
    return;
  }

  gerirTecladoMapa(evento);
}

function gerirTecladoModal(evento) {
  if (tecladoConfirmacaoSaidaConstrucao(evento)) return true;
  if (tecladoCargasPerdidas(evento)) return true;
  if (tecladoBarcosRio(evento)) return true;
  if (tecladoCaixasPerdidas(evento)) return true;
  if (tecladoPonte1(evento)) return true;
  if (tecladoPonte2(evento)) return true;
  if (tecladoPonte3(evento)) return true;

  return tecladoModalNormal(evento);
}

function tecladoConfirmacaoSaidaConstrucao(evento) {
  const confirmacao = document.getElementById("confirmacao-saida-construcao");
  if (!confirmacao) return false;

  if (evento.key === "Escape") {
    evento.preventDefault();
    removerConfirmacaoSaidaConstrucao();
    return true;
  }

  if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
    evento.preventDefault();
    moverFocoDentroDe(confirmacao, 1);
    return true;
  }

  if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
    evento.preventDefault();
    moverFocoDentroDe(confirmacao, -1);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();

    const ativo = document.activeElement;
    if (ativo && ativo.tagName === "BUTTON" && confirmacao.contains(ativo)) {
      ativo.click();
      return true;
    }

    const botao = confirmacao.querySelector("button");
    if (botao) botao.click();

    return true;
  }

  return false;
}

function tecladoCargasPerdidas(evento) {
  const miniJogoCargasAberto = elementos.modalOverlay.querySelector(".mini-cargas");
  if (!miniJogoCargasAberto) return false;

  const ecraFinalCargas = elementos.modalOverlay.querySelector(".mini-cargas-final");

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  if (ecraFinalCargas) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
      evento.preventDefault();
      moverFocoModal(1);
      return true;
    }

    if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
      evento.preventDefault();
      moverFocoModal(-1);
      return true;
    }

    if (evento.key === "Enter") {
      evento.preventDefault();
      clicarBotaoAtivoOuPrimeiroDoModal();
      return true;
    }
  }

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(evento.key)) {
    evento.preventDefault();
    return true;
  }

  return true;
}

function tecladoBarcosRio(evento) {
  const miniJogoBarcosAberto = elementos.modalOverlay.querySelector(".mini-jogo-barcos");
  if (!miniJogoBarcosAberto) return false;

  const ecraFinalBarcos = elementos.modalOverlay.querySelector(".barcos-final");

  if (ecraFinalBarcos) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
      evento.preventDefault();
      moverFocoModal(1);
      return true;
    }

    if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
      evento.preventDefault();
      moverFocoModal(-1);
      return true;
    }

    if (evento.key === "Enter") {
      evento.preventDefault();
      clicarBotaoAtivoOuPrimeiroDoModal();
      return true;
    }

    if (evento.key === "Escape") {
      evento.preventDefault();
      fecharModal();
      return true;
    }

    return true;
  }

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(evento.key)) {
    evento.preventDefault();
    if (typeof moverMiraBarcosRio === "function") moverMiraBarcosRio(evento.key);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();
    if (typeof capturarComMiraBarcosRio === "function") capturarComMiraBarcosRio();
    return true;
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  return true;
}

function tecladoCaixasPerdidas(evento) {
  const miniJogoCaixasAberto = elementos.modalOverlay.querySelector(".mini-jogo-caixas");
  if (!miniJogoCaixasAberto) return false;

  const mapaDirecoes = {
    ArrowLeft: "esquerda",
    ArrowRight: "direita",
    ArrowUp: "cima",
    ArrowDown: "baixo"
  };

  if (mapaDirecoes[evento.key]) {
    evento.preventDefault();
    moverFocoCaixasPerdidas(mapaDirecoes[evento.key]);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();
    clicarBotaoAtivoOuPrimeiroDoModal();
    return true;
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  return true;
}

function tecladoPonte1(evento) {
  const ponte1Aberta = elementos.modalOverlay.querySelector(".ponte1-fluxo");
  if (!ponte1Aberta) return false;

  if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
    evento.preventDefault();
    moverFocoModal(1);
    return true;
  }

  if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
    evento.preventDefault();
    moverFocoModal(-1);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();
    clicarBotaoAtivoOuPrimeiroDoModal();
    return true;
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  return true;
}


function tecladoPonte3(evento) {
  const miniJogoPonte3Aberto = elementos.modalOverlay.querySelector(".ponte3-mini-jogo");
  if (!miniJogoPonte3Aberto) return false;

  const ecraVitoria = miniJogoPonte3Aberto.classList.contains("ponte3-final-vitoria");

  if (evento.key === "Escape") {
    evento.preventDefault();
    if (!ecraVitoria) {
      const feedbackPonte3 = miniJogoPonte3Aberto.querySelector("#ponte3-feedback");
      if (feedbackPonte3) {
        feedbackPonte3.textContent = "Termina a construção da ponte antes de sair. Os materiais já foram usados nesta tentativa.";
      }
    }
    return true;
  }

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(evento.key)) {
    evento.preventDefault();

    const opcoes = Array.from(miniJogoPonte3Aberto.querySelectorAll(".ponte3-opcao:not(:disabled)"));
    if (opcoes.length === 0) {
      moverFocoModal(evento.key === "ArrowLeft" || evento.key === "ArrowUp" ? -1 : 1);
      return true;
    }

    const indiceAtual = opcoes.indexOf(document.activeElement);
    const direcao = (evento.key === "ArrowLeft" || evento.key === "ArrowUp") ? -1 : 1;
    const proximoIndice = indiceAtual === -1
      ? 0
      : (indiceAtual + direcao + opcoes.length) % opcoes.length;

    opcoes[proximoIndice].focus({ preventScroll: true });
    return true;
  }

  if (evento.key === "Enter" || evento.key === " ") {
    const ativo = document.activeElement;
    if (ativo && miniJogoPonte3Aberto.contains(ativo) && ativo.tagName === "BUTTON") {
      evento.preventDefault();
      ativo.click();
      return true;
    }
  }

  return true;
}

function tecladoPonte2(evento) {
  const ponte2Aberta = elementos.modalOverlay.querySelector(".fluxo2-mini-jogo");
  if (!ponte2Aberta) return false;

  if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
    evento.preventDefault();
    moverFocoModal(1);
    return true;
  }

  if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
    evento.preventDefault();
    moverFocoModal(-1);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();
    clicarBotaoAtivoOuPrimeiroDoModal();
    return true;
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  return true;
}

/*
  Espaços reservados para a próxima fase:
  - tecladoOficina3(evento)
  - tecladoPonte3(evento)

  Quando esses mini-jogos forem criados, devem seguir o mesmo contrato:
  devolver true se consumirem a tecla; devolver false se não forem o contexto ativo.
*/

function tecladoModalNormal(evento) {
  if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
    evento.preventDefault();
    moverFocoModal(1);
    return true;
  }

  if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
    evento.preventDefault();
    moverFocoModal(-1);
    return true;
  }

  if (evento.key === "Enter") {
    evento.preventDefault();
    clicarBotaoAtivoOuPrimeiroDoModal();
    return true;
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return true;
  }

  return false;
}

function gerirTecladoMapa(evento) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(evento.key)) {
    evento.preventDefault();
    moverPersonagem(evento.key);
    return true;
  }

  if (evento.key === "Enter") {
    if (!ecras.mapa.classList.contains("ativo") || !estado.zonaAtual) return false;

    evento.preventDefault();
    abrirZona(estado.zonaAtual);
    return true;
  }

  return false;
}

function clicarBotaoAtivoOuPrimeiroDoModal() {
  const ativo = document.activeElement;

  if (
    ativo &&
    ativo.tagName === "BUTTON" &&
    elementos.modalOverlay.contains(ativo)
  ) {
    ativo.click();
    return;
  }

  const botoes = obterBotoesModalNavegaveis();

  if (botoes.length > 0) {
    botoes[0].click();
  }
}

function moverFocoDentroDe(contentor, direcao) {
  if (!contentor) return;

  const botoes = Array.from(contentor.querySelectorAll("button:not(:disabled)"));
  if (botoes.length === 0) return;

  const indiceAtual = botoes.indexOf(document.activeElement);
  const proximoIndice =
    indiceAtual === -1
      ? 0
      : (indiceAtual + direcao + botoes.length) % botoes.length;

  botoes[proximoIndice].focus();
}


function mostrarDebugCoordenadas() {
  if (!DEBUG) {
    const debugBox = document.getElementById("debug-box");
    if (debugBox) debugBox.remove();
    return;
  }

  let debugBox = document.getElementById("debug-box");

  if (!debugBox) {
    debugBox = document.createElement("div");
    debugBox.id = "debug-box";
    debugBox.style.position = "fixed";
    debugBox.style.bottom = "10px";
    debugBox.style.left = "10px";
    debugBox.style.background = "rgba(0,0,0,0.7)";
    debugBox.style.color = "white";
    debugBox.style.padding = "8px";
    debugBox.style.borderRadius = "6px";
    debugBox.style.fontSize = "12px";
    debugBox.style.zIndex = "9999";
    document.body.appendChild(debugBox);
  }

  debugBox.textContent = `x: ${estado.posicao.x.toFixed(1)} | y: ${estado.posicao.y.toFixed(1)} | zona: ${estado.zonaAtual}`;
}

function iniciar() {
  configurarAvatar();
  configurarInterface();
  configurarTeclado();
  const temProgresso = carregarEstado();
  if (temProgresso && estado.nomeJogador) {
    atualizarPerfil();
    atualizarHUD();
    atualizarEstadoVisualMapa();
    atualizarPosicaoPersonagem();
    mostrarEcra("mapa");
    atualizarGuiaOficina();
    verificarZonaAtual();
    setTimeout(mostrarTutorialInicialDoMapa, 350);
    mostrarDebugCoordenadas();
  } else {
    mostrarEcra("inicial");
  }
}

iniciar();


window.addEventListener("focus", () => {
  atualizarPosicaoPersonagem();
});
