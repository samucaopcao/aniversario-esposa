/* ============================================================
   SCRIPT.JS — lógica do jogo. Normalmente não precisa editar aqui,
   só o config.js. Se quiser mexer no funcionamento, comentários
   abaixo explicam cada parte.
   ============================================================ */

(function () {
  "use strict";

  // ---------- estado do jogo ----------
  let etapas = [];         // lista final de "passos" (perguntas + minigames)
  let indiceAtual = 0;
  let pontuacao = 0;
  let respondendoBloqueado = false;

  // ---------- elementos ----------
  const telaCapa = document.getElementById("tela-capa");
  const telaJogo = document.getElementById("tela-jogo");
  const telaFinal = document.getElementById("tela-final");
  const areaPergunta = document.getElementById("area-pergunta");
  const areaFeedback = document.getElementById("area-feedback");
  const barraProgresso = document.getElementById("barra-progresso");
  const progressoTexto = document.getElementById("progresso-texto");
  const pontuacaoValor = document.getElementById("pontuacao-valor");
  const nomeEsposaCapa = document.getElementById("nome-esposa-capa");
  const btnComecar = document.getElementById("btn-comecar");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  function mostrarTela(tela) {
    [telaCapa, telaJogo, telaFinal].forEach(t => t.classList.remove("ativa"));
    tela.classList.add("ativa");
  }

  // ---------- preparação inicial ----------
  function montarEtapas() {
    etapas = [];
    (CONFIG.perguntas || []).forEach(p => etapas.push(Object.assign({ categoria: "pergunta" }, p)));
    (CONFIG.fotosZoom || []).forEach(p => etapas.push(Object.assign({ categoria: "pergunta", tipo: "foto", zoom: true }, p)));
    if (CONFIG.quebraCabeca) etapas.push(Object.assign({ categoria: "puzzle" }, CONFIG.quebraCabeca));
    if (CONFIG.jogoDaMemoria) etapas.push(Object.assign({ categoria: "memoria" }, CONFIG.jogoDaMemoria));
    if (CONFIG.fotoProgressiva) etapas.push(Object.assign({ categoria: "progressiva" }, CONFIG.fotoProgressiva));
    if (CONFIG.raspadinha) etapas.push(Object.assign({ categoria: "raspadinha" }, CONFIG.raspadinha));
    if (CONFIG.coracaoEscondido) etapas.push(Object.assign({ categoria: "coracao" }, CONFIG.coracaoEscondido));
    if (CONFIG.linhaDoTempo) etapas.push(Object.assign({ categoria: "timeline" }, CONFIG.linhaDoTempo));
  }

  function iniciarJogo() {
    montarEtapas();
    indiceAtual = 0;
    pontuacao = 0;
    pontuacaoValor.textContent = "0";
    mostrarTela(telaJogo);
    renderizarEtapaAtual();
  }

  function atualizarProgresso() {
    const total = etapas.length;
    const percent = Math.round((indiceAtual / total) * 100);
    barraProgresso.style.width = percent + "%";
    progressoTexto.textContent = `Etapa ${indiceAtual + 1} de ${total}`;
  }

  function avancarEtapa() {
    indiceAtual++;
    areaFeedback.textContent = "";
    if (indiceAtual >= etapas.length) {
      mostrarFinal();
    } else {
      renderizarEtapaAtual();
    }
  }

  function renderizarEtapaAtual() {
    respondendoBloqueado = false;
    atualizarProgresso();
    areaPergunta.innerHTML = "";
    areaFeedback.textContent = "";
    const etapa = etapas[indiceAtual];

    if (etapa.categoria === "pergunta" && etapa.tipo === "multipla") {
      renderizarMultiplaEscolha(etapa);
    } else if (etapa.categoria === "pergunta" && etapa.tipo === "foto") {
      renderizarPerguntaFoto(etapa);
    } else if (etapa.categoria === "puzzle") {
      renderizarQuebraCabeca(etapa);
    } else if (etapa.categoria === "memoria") {
      renderizarMemoria(etapa);
    } else if (etapa.categoria === "progressiva") {
      renderizarFotoProgressiva(etapa);
    } else if (etapa.categoria === "raspadinha") {
      renderizarRaspadinha(etapa);
    } else if (etapa.categoria === "coracao") {
      renderizarCoracaoEscondido(etapa);
    } else if (etapa.categoria === "timeline") {
      renderizarLinhaDoTempo(etapa);
    }
  }

  // ---------- util: botão continuar ----------
  function criarBotaoContinuar(textoExtra) {
    const btn = document.createElement("button");
    btn.className = "botao-principal botao-continuar";
    btn.textContent = "Continuar →";
    btn.addEventListener("click", avancarEtapa);
    if (textoExtra) areaFeedback.textContent = textoExtra;
    areaPergunta.appendChild(btn);
  }

  // ---------- placeholder genérico de foto ----------
  function criarAvisoFotoFaltando(caminhoImagem, emoji) {
    const aviso = document.createElement("div");
    aviso.className = "foto-placeholder-texto";
    aviso.innerHTML = `${emoji || "📷"} Coloque a foto aqui:<br><strong>${caminhoImagem}</strong>`;
    return aviso;
  }

  // ---------- polaroid (foto com moldura) ----------
  function criarPolaroid(caminhoImagem, legenda, comZoom) {
    const wrap = document.createElement("div");
    wrap.className = "polaroid";

    const molduraFoto = document.createElement("div");
    molduraFoto.className = "polaroid-foto" + (comZoom ? " foto-zoom-moldura" : "");

    const img = document.createElement("img");
    if (comZoom) img.className = "foto-zoom-img";
    img.alt = legenda || "foto";
    img.src = caminhoImagem;
    img.onerror = function () {
      molduraFoto.innerHTML = "";
      molduraFoto.appendChild(criarAvisoFotoFaltando(caminhoImagem));
    };
    molduraFoto.appendChild(img);
    wrap.appendChild(molduraFoto);

    if (legenda) {
      const cap = document.createElement("div");
      cap.className = "polaroid-legenda";
      cap.textContent = legenda;
      wrap.appendChild(cap);
    }
    return wrap;
  }

  // ---------- pergunta múltipla escolha ----------
  function renderizarMultiplaEscolha(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.pergunta;
    areaPergunta.appendChild(titulo);

    montarOpcoes(etapa);
  }

  // ---------- pergunta com foto (com ou sem zoom) ----------
  function renderizarPerguntaFoto(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.pergunta;
    areaPergunta.appendChild(titulo);

    areaPergunta.appendChild(criarPolaroid(etapa.imagem, etapa.legenda, !!etapa.zoom));
    montarOpcoes(etapa);
  }

  function montarOpcoes(etapa, aoClicar) {
    const opcoesWrap = document.createElement("div");
    opcoesWrap.className = "opcoes";

    etapa.opcoes.forEach((texto, i) => {
      const btn = document.createElement("button");
      btn.className = "opcao-btn";
      btn.textContent = texto;
      btn.addEventListener("click", () => {
        if (aoClicar) {
          aoClicar(i, btn, opcoesWrap);
        } else {
          responderOpcao(i, etapa, opcoesWrap);
        }
      });
      opcoesWrap.appendChild(btn);
    });

    areaPergunta.appendChild(opcoesWrap);
    return opcoesWrap;
  }

  function responderOpcao(indiceEscolhido, etapa, opcoesWrap) {
    if (respondendoBloqueado) return;
    respondendoBloqueado = true;

    const botoes = opcoesWrap.querySelectorAll(".opcao-btn");
    botoes.forEach((b, i) => {
      b.disabled = true;
      if (i === etapa.correta) b.classList.add("correta");
      if (i === indiceEscolhido && i !== etapa.correta) b.classList.add("errada");
    });

    let mensagem;
    if (indiceEscolhido === etapa.correta) {
      pontuacao++;
      pontuacaoValor.textContent = pontuacao;
      mensagem = escolherAleatorio(["Isso aí! 💛", "Acertou em cheio!", "Como sempre, na régua."]);
    } else {
      mensagem = escolherAleatorio(["Quase! A certa tá em verde.", "Essa foi difícil, hein?"]);
    }
    criarBotaoContinuar(mensagem);
  }

  function escolherAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ============================================================
  // 🧩 QUEBRA-CABEÇA — arraste uma peça sobre outra OU toque em
  // duas peças seguidas pra trocá-las de lugar.
  // ============================================================
  function renderizarQuebraCabeca(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.titulo || "Remonte a foto";
    areaPergunta.appendChild(titulo);

    const testeImg = new Image();
    testeImg.onload = () => montarPuzzleReal(etapa);
    testeImg.onerror = () => montarPuzzlePlaceholder(etapa);
    testeImg.src = etapa.imagem;
  }

  function montarPuzzlePlaceholder(etapa) {
    const aviso = document.createElement("div");
    aviso.className = "polaroid";
    aviso.innerHTML = `<div class="polaroid-foto"><div class="foto-placeholder-texto">🧩 Coloque a foto do quebra-cabeça aqui:<br><strong>${etapa.imagem}</strong></div></div>`;
    areaPergunta.appendChild(aviso);
    criarBotaoContinuar("Assim que a foto estiver na pasta, o quebra-cabeça aparece de verdade aqui!");
  }

  function montarPuzzleReal(etapa) {
    const tamanho = etapa.tamanho || 3;
    const totalPecas = tamanho * tamanho;

    const instrucao = document.createElement("p");
    instrucao.className = "puzzle-instrucao";
    instrucao.textContent = etapa.instrucao || "Arraste uma peça sobre outra (ou toque em duas peças seguidas) para trocá-las.";
    areaPergunta.appendChild(instrucao);

    const grid = document.createElement("div");
    grid.className = "puzzle-grid";
    grid.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
    areaPergunta.appendChild(grid);

    // arranjo[posicaoNaTela] = indiceCorretoDaPeca
    let arranjo = Array.from({ length: totalPecas }, (_, i) => i);
    embaralharGarantindoEmbaralhado(arranjo);

    let selecionado = null;
    let arrastando = null;

    function posicaoFundo(indiceCorreto) {
      const col = indiceCorreto % tamanho;
      const row = Math.floor(indiceCorreto / tamanho);
      const passo = tamanho === 1 ? 0 : 100 / (tamanho - 1);
      return `${col * passo}% ${row * passo}%`;
    }

    function desenharGrid() {
      grid.innerHTML = "";
      arranjo.forEach((indiceCorreto, pos) => {
        const peca = document.createElement("div");
        peca.className = "puzzle-peca";
        peca.style.backgroundImage = `url('${etapa.imagem}')`;
        peca.style.backgroundSize = `${tamanho * 100}% ${tamanho * 100}%`;
        peca.style.backgroundPosition = posicaoFundo(indiceCorreto);
        peca.dataset.pos = pos;
        peca.draggable = true;

        const numero = document.createElement("span");
        numero.className = "num-peca";
        numero.textContent = indiceCorreto + 1;
        peca.appendChild(numero);

        if (selecionado === pos) peca.classList.add("selecionada");

        peca.addEventListener("click", () => cliqueNaPeca(pos));

        // suporte a arrastar (desktop e touch em navegadores compatíveis)
        peca.addEventListener("dragstart", (ev) => {
          arrastando = pos;
          ev.dataTransfer.effectAllowed = "move";
          try { ev.dataTransfer.setData("text/plain", String(pos)); } catch (e) { /* ignora */ }
        });
        peca.addEventListener("dragover", (ev) => ev.preventDefault());
        peca.addEventListener("drop", (ev) => {
          ev.preventDefault();
          if (arrastando !== null && arrastando !== pos) {
            trocarPecas(arrastando, pos);
          }
          arrastando = null;
        });

        grid.appendChild(peca);
      });
    }

    function cliqueNaPeca(pos) {
      if (selecionado === null) {
        selecionado = pos;
        desenharGrid();
        return;
      }
      if (selecionado === pos) {
        selecionado = null;
        desenharGrid();
        return;
      }
      trocarPecas(selecionado, pos);
      selecionado = null;
    }

    function trocarPecas(posA, posB) {
      const tmp = arranjo[posA];
      arranjo[posA] = arranjo[posB];
      arranjo[posB] = tmp;
      selecionado = null;
      desenharGrid();
      verificarVitoria();
    }

    function verificarVitoria() {
      const resolvido = arranjo.every((valor, i) => valor === i);
      if (resolvido) {
        pontuacao++;
        pontuacaoValor.textContent = pontuacao;
        areaPergunta.querySelectorAll(".puzzle-peca").forEach(p => {
          p.style.cursor = "default";
          p.draggable = false;
        });
        grid.style.pointerEvents = "none";
        criarBotaoContinuar("Isso aí, remontado! 🧩💛");
      }
    }

    desenharGrid();
  }

  function embaralharGarantindoEmbaralhado(array) {
    embaralhar(array);
    if (array.every((v, i) => v === i)) {
      [array[0], array[1]] = [array[1], array[0]];
    }
    return array;
  }

  // ============================================================
  // 🧠 JOGO DA MEMÓRIA 5×5
  // ============================================================
  function renderizarMemoria(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.titulo || "Jogo da memória";
    areaPergunta.appendChild(titulo);

    const instrucao = document.createElement("p");
    instrucao.className = "puzzle-instrucao";
    instrucao.textContent = etapa.instrucao || "Vire duas cartas por vez e encontre os pares.";
    areaPergunta.appendChild(instrucao);

    const fotos = (etapa.fotos || []).filter(Boolean);
    const numPares = 12; // 12 pares (24 cartas) + 1 carta coringa = 25 (grade 5x5)

    let cartas = [];
    for (let i = 0; i < numPares; i++) {
      const src = fotos.length ? fotos[i % fotos.length] : null;
      cartas.push({ id: "p" + i + "a", pairId: i, src, tipo: "foto" });
      cartas.push({ id: "p" + i + "b", pairId: i, src, tipo: "foto" });
    }
    cartas.push({ id: "coringa", pairId: "coringa", src: null, tipo: "coringa" });
    embaralhar(cartas);

    const grid = document.createElement("div");
    grid.className = "memoria-grid";
    areaPergunta.appendChild(grid);

    let viradas = [];       // posições viradas no momento (máx 2, exceto coringa)
    let encontrados = new Set(); // pairIds já resolvidos
    let bloqueado = false;
    let paresParaGanhar = numPares;

    function criarCartaEl(carta, pos) {
      const el = document.createElement("div");
      el.className = "memoria-carta";
      el.dataset.pos = pos;

      const inner = document.createElement("div");
      inner.className = "memoria-carta-inner";

      const verso = document.createElement("div");
      verso.className = "memoria-face memoria-verso";
      verso.textContent = "💛";

      const frente = document.createElement("div");
      frente.className = "memoria-face memoria-frente";

      if (carta.tipo === "coringa") {
        frente.classList.add("memoria-coringa");
        frente.textContent = "💍";
      } else if (carta.src) {
        const img = document.createElement("img");
        img.src = carta.src;
        img.alt = "foto";
        img.onerror = () => {
          frente.innerHTML = "";
          frente.appendChild(criarAvisoFotoFaltando(carta.src, "🧠"));
        };
        frente.appendChild(img);
      } else {
        frente.appendChild(criarAvisoFotoFaltando("fotos/mem*.jpg", "🧠"));
      }

      inner.appendChild(verso);
      inner.appendChild(frente);
      el.appendChild(inner);

      el.addEventListener("click", () => virarCarta(pos));
      return el;
    }

    function renderizarGrid() {
      grid.innerHTML = "";
      cartas.forEach((carta, pos) => {
        const el = criarCartaEl(carta, pos);
        if (viradas.includes(pos) || encontrados.has(carta.pairId)) {
          el.classList.add("virada");
        }
        if (encontrados.has(carta.pairId)) {
          el.classList.add("encontrada");
        }
        grid.appendChild(el);
      });
    }

    function virarCarta(pos) {
      if (bloqueado) return;
      const carta = cartas[pos];
      if (encontrados.has(carta.pairId)) return;
      if (viradas.includes(pos)) return;

      // carta coringa: vira e já fica resolvida sozinha
      if (carta.tipo === "coringa") {
        encontrados.add(carta.pairId);
        renderizarGrid();
        return;
      }

      viradas.push(pos);
      renderizarGrid();

      if (viradas.length === 2) {
        const [posA, posB] = viradas;
       if (cartas[posA].pairId === cartas[posB].pairId) {
          encontrados.add(cartas[posA].pairId);
          viradas = [];
          renderizarGrid();
          checarVitoriaMemoria();
        } else {
          bloqueado = true;
          setTimeout(() => {
            viradas = [];
            bloqueado = false;
            renderizarGrid();
          }, 800);
        }
      }
    }

    function checarVitoriaMemoria() {
      const paresFeitos = [...encontrados].filter(id => id !== "coringa").length;
      if (paresFeitos >= paresParaGanhar) {
        pontuacao++;
        pontuacaoValor.textContent = pontuacao;
        criarBotaoContinuar("Você lembra de tudo! 🧠💛");
      }
    }

    renderizarGrid();
  }

  // ============================================================
  // 🖼️ FOTO PROGRESSIVA — vai ficando nítida a cada tentativa errada
  // ============================================================
  function renderizarFotoProgressiva(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.pergunta || "Onde estávamos nessa foto?";
    areaPergunta.appendChild(titulo);

    const wrap = document.createElement("div");
    wrap.className = "polaroid progressiva-wrap";
    const moldura = document.createElement("div");
    moldura.className = "polaroid-foto";

    const nivelInicial = 20; // px de blur
    const passos = [20, 14, 9, 4, 0];
    let passoAtual = 0;

    const img = document.createElement("img");
    img.alt = "foto embaçada";
    img.src = etapa.imagem;
    img.style.filter = `blur(${nivelInicial}px)`;
    img.style.transition = "filter 0.5s ease";
    img.onerror = () => {
      moldura.innerHTML = "";
      moldura.appendChild(criarAvisoFotoFaltando(etapa.imagem, "🖼️"));
    };
    moldura.appendChild(img);
    wrap.appendChild(moldura);
    areaPergunta.appendChild(wrap);

    montarOpcoes(etapa, (indiceEscolhido, btn, opcoesWrap) => {
      if (respondendoBloqueado) return;

      if (indiceEscolhido === etapa.correta) {
        respondendoBloqueado = true;
        img.style.filter = "blur(0px)";
        const botoes = opcoesWrap.querySelectorAll(".opcao-btn");
        botoes.forEach((b, i) => { b.disabled = true; if (i === etapa.correta) b.classList.add("correta"); });
        pontuacao++;
        pontuacaoValor.textContent = pontuacao;
        criarBotaoContinuar("Agora ficou nítida! Acertou 🖼️💛");
      } else {
        btn.disabled = true;
        btn.classList.add("errada");
        passoAtual = Math.min(passoAtual + 1, passos.length - 1);
        img.style.filter = `blur(${passos[passoAtual]}px)`;
        areaFeedback.textContent = escolherAleatorio(["Ficou um pouco mais nítida... tenta de novo!", "Quase lá, olha com atenção!"]);

        const restantes = opcoesWrap.querySelectorAll(".opcao-btn:not(:disabled)");
        if (restantes.length === 1) {
          // só sobrou uma opção — revela tudo
          respondendoBloqueado = true;
          img.style.filter = "blur(0px)";
          restantes[0].disabled = true;
          restantes[0].classList.add("correta");
          pontuacao++;
          pontuacaoValor.textContent = pontuacao;
          criarBotaoContinuar("Era essa! Já ficou nítida 🖼️💛");
        }
      }
    });
  }

  // ============================================================
  // 🪄 RASPADINHA
  // ============================================================
  function renderizarRaspadinha(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.titulo || "Raspadinha";
    areaPergunta.appendChild(titulo);

    const instrucao = document.createElement("p");
    instrucao.className = "puzzle-instrucao";
    instrucao.textContent = etapa.instrucao || "Passe o dedo (ou o mouse) pra raspar e revelar a surpresa.";
    areaPergunta.appendChild(instrucao);

    const testeImg = new Image();
    testeImg.onload = () => montarRaspadinhaReal(etapa);
    testeImg.onerror = () => montarRaspadinhaPlaceholder(etapa);
    testeImg.src = etapa.imagem;
  }

  function montarRaspadinhaPlaceholder(etapa) {
    const aviso = document.createElement("div");
    aviso.className = "polaroid";
    aviso.innerHTML = `<div class="polaroid-foto"><div class="foto-placeholder-texto">🪄 Coloque a foto da raspadinha aqui:<br><strong>${etapa.imagem}</strong></div></div>`;
    areaPergunta.appendChild(aviso);
    criarBotaoContinuar("Assim que a foto estiver na pasta, a raspadinha aparece de verdade aqui!");
  }

  function montarRaspadinhaReal(etapa) {
    const wrap = document.createElement("div");
    wrap.className = "raspadinha-wrap";

    const img = document.createElement("img");
    img.className = "raspadinha-img";
    img.src = etapa.imagem;
    img.alt = "surpresa";

    const canvas = document.createElement("canvas");
    canvas.className = "raspadinha-canvas";
    canvas.width = 400;
    canvas.height = 300;

    wrap.appendChild(img);
    wrap.appendChild(canvas);
    areaPergunta.appendChild(wrap);

    const ctx = canvas.getContext("2d");
    // camada dourada de "raspar"
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, "#C9A15A");
    gradiente.addColorStop(1, "#A47F3C");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(251,241,225,0.85)";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🪄 Raspe aqui ✨", canvas.width / 2, canvas.height / 2);

    let raspando = false;
    let concluido = false;
    let contadorChecagem = 0;

    function coordenadas(ev) {
      const rect = canvas.getBoundingClientRect();
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function raspar(ev) {
      if (concluido) return;
      ev.preventDefault();
      const { x, y } = coordenadas(ev);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      contadorChecagem++;
      if (contadorChecagem % 6 === 0) checarProgresso();
    }

    function checarProgresso() {
      if (concluido) return;
      const dados = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparentes = 0;
      let amostras = 0;
      for (let i = 3; i < dados.length; i += 4 * 37) { // amostragem esparsa por desempenho
        amostras++;
        if (dados[i] < 40) transparentes++;
      }
      if (amostras > 0 && transparentes / amostras > 0.5) {
        finalizarRaspadinha();
      }
    }

    function finalizarRaspadinha() {
      if (concluido) return;
      concluido = true;
      canvas.style.transition = "opacity 0.6s ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      pontuacao++;
      pontuacaoValor.textContent = pontuacao;
      criarBotaoContinuar("Momento revelado! 🪄💛");
    }

    canvas.addEventListener("pointerdown", (ev) => { raspando = true; raspar(ev); });
    canvas.addEventListener("pointermove", (ev) => { if (raspando) raspar(ev); });
    window.addEventListener("pointerup", () => { raspando = false; if (!concluido) checarProgresso(); });
    canvas.addEventListener("touchstart", (ev) => { raspando = true; raspar(ev); }, { passive: false });
    canvas.addEventListener("touchmove", (ev) => { if (raspando) raspar(ev); }, { passive: false });
    canvas.addEventListener("touchend", () => { raspando = false; if (!concluido) checarProgresso(); });
  }

  // ============================================================
  // ❤️ CORAÇÃO ESCONDIDO
  // ============================================================
  function renderizarCoracaoEscondido(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.titulo || "Encontre o coração escondido";
    areaPergunta.appendChild(titulo);

    const instrucao = document.createElement("p");
    instrucao.className = "puzzle-instrucao";
    instrucao.textContent = etapa.instrucao || "Toque na foto onde você acha que tem um coração escondido.";
    areaPergunta.appendChild(instrucao);

    const wrap = document.createElement("div");
    wrap.className = "coracao-wrap";

    const img = document.createElement("img");
    img.className = "coracao-imagem";
    img.alt = "encontre o coração";
    img.src = etapa.imagem;
    img.onerror = () => {
      wrap.innerHTML = "";
      wrap.appendChild(criarAvisoFotoFaltando(etapa.imagem, "❤️"));
    };
    wrap.appendChild(img);
    areaPergunta.appendChild(wrap);

    const posicao = etapa.posicao || { x: 50, y: 50, raio: 10 };
    let encontrado = false;

    wrap.addEventListener("click", (ev) => {
      if (encontrado) return;
      const rect = wrap.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * 100;
      const py = ((ev.clientY - rect.top) / rect.height) * 100;
      const distancia = Math.hypot(px - posicao.x, py - posicao.y);

      if (distancia <= (posicao.raio || 10)) {
        encontrado = true;
        const marca = document.createElement("div");
        marca.className = "marca-coracao";
        marca.style.left = posicao.x + "%";
        marca.style.top = posicao.y + "%";
        marca.textContent = "❤️";
        wrap.appendChild(marca);

        pontuacao++;
        pontuacaoValor.textContent = pontuacao;
        criarBotaoContinuar("Encontrou o coração escondido! ❤️");
      } else {
        const marcaErro = document.createElement("div");
        marcaErro.className = "marca-erro";
        marcaErro.style.left = px + "%";
        marcaErro.style.top = py + "%";
        marcaErro.textContent = "✗";
        wrap.appendChild(marcaErro);
        setTimeout(() => marcaErro.remove(), 500);
        areaFeedback.textContent = escolherAleatorio(["Ainda não é aí... tenta de novo!", "Esquenta, mas ainda não achou."]);
      }
    });
  }

  // ============================================================
  // LINHA DO TEMPO (ordenar)
  // ============================================================
  function renderizarLinhaDoTempo(etapa) {
    const titulo = document.createElement("h2");
    titulo.className = "pergunta-titulo";
    titulo.textContent = etapa.titulo || "Coloque em ordem";
    areaPergunta.appendChild(titulo);

    const instrucao = document.createElement("p");
    instrucao.className = "puzzle-instrucao";
    instrucao.textContent = etapa.instrucao || "Toque em dois itens para trocá-los de posição.";
    areaPergunta.appendChild(instrucao);

    const lista = document.createElement("div");
    lista.className = "timeline-lista";
    areaPergunta.appendChild(lista);

    let itens = etapa.itens.slice();
    embaralhar(itens);
    let selecionado = null;

    function desenharLista() {
      lista.innerHTML = "";
      itens.forEach((item, pos) => {
        const linha = document.createElement("div");
        linha.className = "timeline-item";
        if (selecionado === pos) linha.classList.add("selecionado");

        const numero = document.createElement("span");
        numero.className = "timeline-numero";
        numero.textContent = (pos + 1) + ".";

        const texto = document.createElement("span");
        texto.className = "timeline-texto";
        texto.textContent = item.texto;

        linha.appendChild(numero);
        linha.appendChild(texto);
        linha.addEventListener("click", () => cliqueNoItem(pos));
        lista.appendChild(linha);
      });
    }

    function cliqueNoItem(pos) {
      if (selecionado === null) {
        selecionado = pos;
        desenharLista();
        return;
      }
      if (selecionado === pos) {
        selecionado = null;
        desenharLista();
        return;
      }
      const tmp = itens[selecionado];
      itens[selecionado] = itens[pos];
      itens[pos] = tmp;
      selecionado = null;
      desenharLista();
    }

    const btnConferir = document.createElement("button");
    btnConferir.className = "botao-principal";
    btnConferir.style.marginTop = "10px";
    btnConferir.textContent = "Conferir ordem";
    btnConferir.addEventListener("click", () => {
      const correto = itens.every((item, i) => item.ordem === i + 1);
      if (correto) {
        pontuacao++;
        pontuacaoValor.textContent = pontuacao;
        lista.querySelectorAll(".timeline-item").forEach(el => el.style.pointerEvents = "none");
        btnConferir.remove();
        criarBotaoContinuar("Perfeito, essa é a nossa história! 📖💛");
      } else {
        areaFeedback.textContent = "Ainda não é essa a ordem... tenta de novo!";
      }
    });
    areaPergunta.appendChild(btnConferir);

    desenharLista();
  }

  // ============================================================
  // 🎬 GRAND FINALE — vídeo automático → carta com efeito de máquina
  // de escrever → botão que revela a última pista
  // ============================================================
  const videoFinalWrap = document.getElementById("video-final-wrap");
  const videoFinal = document.getElementById("video-final");
  const btnPularVideo = document.getElementById("btn-pular-video");
  const cartaTextoEl = document.getElementById("texto-carta-final");
  const assinaturaEl = document.getElementById("assinatura-carta");
  const cursorMaquina = document.getElementById("cursor-maquina");
  const btnRevelarPista = document.getElementById("btn-revelar-pista");
  const pistaFinalEl = document.getElementById("pista-final");
  const pistaTextoEl = document.getElementById("pista-texto");

  let timeoutDigitacao = null;

  function mostrarFinal() {
    mostrarTela(telaFinal);
    document.getElementById("placar-final-valor").textContent = pontuacao;
    document.getElementById("placar-final-total").textContent = etapas.length;
    dispararConfete();
    iniciarCoracoesFlutuantes();
    prepararSequenciaFinal();
  }

  function prepararSequenciaFinal() {
    if (timeoutDigitacao) clearTimeout(timeoutDigitacao);
    cartaTextoEl.textContent = "";
    assinaturaEl.textContent = "";
    assinaturaEl.style.opacity = "0";
    if (btnRevelarPista) btnRevelarPista.style.display = "none";
    if (pistaFinalEl) {
      pistaFinalEl.style.display = "none";
      pistaFinalEl.classList.remove("revelado");
    }

    const cfg = (CONFIG.finalEspecial) || {};

    if (cfg.video && videoFinalWrap && videoFinal) {
      videoFinalWrap.style.display = "block";
      videoFinal.src = cfg.video;
      btnPularVideo.textContent = "Pular vídeo →";
      videoFinal.onended = seguirParaCarta;
      videoFinal.onerror = seguirParaCarta;
      btnPularVideo.onclick = () => { videoFinal.pause(); seguirParaCarta(); };

      videoFinal.currentTime = 0;
      const promessa = videoFinal.play();
      if (promessa && promessa.catch) {
        promessa.catch(() => {
          // autoplay bloqueado pelo navegador — mostra botão pra tocar manualmente
          btnPularVideo.textContent = "▶️ Tocar vídeo";
          btnPularVideo.onclick = () => {
            videoFinal.play().catch(() => seguirParaCarta());
          };
        });
      }
    } else {
      if (videoFinalWrap) videoFinalWrap.style.display = "none";
      seguirParaCarta();
    }
  }

  function seguirParaCarta() {
    if (videoFinalWrap) videoFinalWrap.style.display = "none";
    iniciarCartaAnimada();
  }

  function iniciarCartaAnimada() {
    const cfg = CONFIG.finalEspecial || {};
    const texto = cfg.cartaAnimada || (CONFIG.cartaFinal && CONFIG.cartaFinal.texto) || "";
    const assinaturaTexto = cfg.assinaturaAnimada || (CONFIG.cartaFinal && CONFIG.cartaFinal.assinatura) || "";

    cartaTextoEl.textContent = "";
    if (cursorMaquina) cursorMaquina.style.display = "inline-block";

    let i = 0;
    function digitar() {
      if (i <= texto.length) {
        cartaTextoEl.textContent = texto.slice(0, i);
        i++;
        timeoutDigitacao = setTimeout(digitar, 26);
      } else {
        if (cursorMaquina) cursorMaquina.style.display = "none";
        assinaturaEl.textContent = assinaturaTexto;
        assinaturaEl.style.transition = "opacity 1s ease";
        assinaturaEl.style.opacity = "1";
        if (cfg.pistaFinal && btnRevelarPista) {
          btnRevelarPista.style.display = "inline-block";
        }
      }
    }
    digitar();
  }

  if (btnRevelarPista) {
    btnRevelarPista.addEventListener("click", () => {
      const cfg = CONFIG.finalEspecial || {};
      pistaTextoEl.textContent = cfg.pistaFinal || "";
      pistaFinalEl.style.display = "block";
      requestAnimationFrame(() => pistaFinalEl.classList.add("revelado"));
      btnRevelarPista.style.display = "none";
      dispararConfete();
    });
  }

  // ---------- corações flutuantes ----------
  let intervaloCoracoes = null;
  function iniciarCoracoesFlutuantes() {
    const container = document.getElementById("coracoes-flutuantes");
    if (intervaloCoracoes) clearInterval(intervaloCoracoes);
    const emojis = ["💛", "💕", "✨", "🌹"];
    intervaloCoracoes = setInterval(() => {
      if (!telaFinal.classList.contains("ativa")) return;
      const el = document.createElement("span");
      el.className = "coracao-item";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + "%";
      const duracao = 4 + Math.random() * 3;
      el.style.animationDuration = duracao + "s";
      container.appendChild(el);
      setTimeout(() => el.remove(), duracao * 1000 + 200);
    }, 450);
  }

  // ---------- confete simples em canvas ----------
  function dispararConfete() {
    const canvas = document.getElementById("confete-canvas");
    const ctx = canvas.getContext("2d");
    function ajustarTamanho() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    ajustarTamanho();
    window.addEventListener("resize", ajustarTamanho);

    const cores = ["#C9A15A", "#E7B7B8", "#3B1226", "#FBF1E1"];
    const particulas = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      tamanho: 4 + Math.random() * 5,
      cor: cores[Math.floor(Math.random() * cores.length)],
      velY: 2 + Math.random() * 3,
      velX: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      velRot: -6 + Math.random() * 12
    }));

    let quadros = 0;
    const maxQuadros = 260;

    function animar() {
      quadros++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particulas.forEach(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.rot += p.velRot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.cor;
        ctx.fillRect(-p.tamanho / 2, -p.tamanho / 2, p.tamanho, p.tamanho * 0.6);
        ctx.restore();
      });
      if (quadros < maxQuadros) {
        requestAnimationFrame(animar);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animar();
  }

  // ---------- inicialização ----------
  function aplicarConfigNaCapa() {
    nomeEsposaCapa.textContent = CONFIG.nomeEsposa || "Amor";
    if (CONFIG.fraseCapa) {
      document.querySelector(".descricao-capa").textContent = CONFIG.fraseCapa;
    }
  }

  btnComecar.addEventListener("click", iniciarJogo);
  btnReiniciar.addEventListener("click", () => {
    mostrarTela(telaCapa);
  });

  aplicarConfigNaCapa();
})();
