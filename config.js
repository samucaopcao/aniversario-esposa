/* ============================================================
   CONFIG.JS — É AQUI QUE VOCÊ EDITA O JOGO
   Troque nomes, perguntas, fotos e a mensagem final à vontade.
   Não precisa mexer no script.js.
   ============================================================ */

const CONFIG = {

  // Nome dela, aparece na tela de capa
  nomeEsposa: "para o amor da minha vida",

  // Mensagem pequena abaixo do título (pode deixar assim)
  fraseCapa: "Preparei um joguinho com pedacinhos da nossa história. Cada acerto acende um marco na nossa linha do tempo.",

  // ------------------------------------------------------------------
  // FOTOS: coloque os arquivos dentro da pasta "fotos" com esses nomes
  // exatos. Se o arquivo não existir ainda, o jogo mostra um aviso
  // amarelo no lugar dela ("coloque a foto aqui") em vez de quebrar —
  // então dá pra testar tudo antes mesmo de ter as fotos prontas.
  // ------------------------------------------------------------------

  perguntas: [

    // 1) Pergunta de múltipla escolha simples (data de namoro)
    {
      tipo: "multipla",
      pergunta: "Nosso amor foi tão espontâneo e bonito , mas agora me diz que dia começou namorar comigo?",
      opcoes: ["Segunda-Feira", "Quarta-Feira", "Sábado", "Domingo"],
      correta: 1
    },

    // 2) Pergunta de múltipla escolha simples (data de casamento)
    {
      tipo: "multipla",
      pergunta: "Jamais esquecerei aquele dia , onde você tão linda me encontrou e pra lembrar me diga onde o primeiro encontro rolou?",
      opcoes: ["Shopping", "Parque", "Restaurante", "Pizzaria"],
      correta: 1
    },

    // 3) Pergunta de foto — TROQUE o texto das opções e a legenda
    {
      tipo: "foto",
      pergunta: "Onde foi tirada essa foto com você tão perfeita?",
      imagem: "fotos/foto1.jpg",
      legenda: "Dica: foi bem no comecinho da nossa história ✨",
      opcoes: ["Aniversário", "Passeio de Fim de Semana", "Casa da minha mãe", "Micareta"],
      correta: 0
    },

    // 4) Outra pergunta de foto
    {
      tipo: "foto",
      pergunta: "O que estávamos comemorando nessa foto meu amor?",
      imagem: "fotos/foto2.jpg",
      legenda: "Dica: um parque muito bonito",
      opcoes: ["1 ano de namoro", "4 anos de namoro", "2 anos de namoro", "3 anos de namoro"],
      correta: 2
    },

    // 5) Outra pergunta de foto
    {
      tipo: "foto",
      pergunta: "O sol estava no céu , mas quem me iluminava era você, onde estávamos?",
      imagem: "fotos/foto3.jpg",
      legenda: "Dica: um dia muito especial pra nós dois",
      opcoes: ["Natal em Peruibe", "Visita para a Nicole", "Passeio em Praia Grande", "Bate e volta em Santos"],
      correta: 3
    },

    // 6) Outra pergunta de foto (bônus / engraçada)
    {
      tipo: "foto",
      pergunta: "Não importa se está frio ou calor, você sempre está linda , mas onde estávamos?",
      imagem: "fotos/foto4.jpg",
      legenda: "Dica: uma das nossas primeiras viagens",
      opcoes: ["Santo Antônio do Pinhal", "Campos do Jordão", "Elias Fausto", "São Roque"],
      correta: 1
    }
  ],

  // ------------------------------------------------------------------
  // 📸 FOTOS COM ZOOM — mesma mecânica de "onde foi tirada essa foto",
  // mas a imagem fica com um efeito de zoom lento (tipo Ken Burns).
  // Coloque exatamente 3 fotos aqui (zoom1.jpg, zoom2.jpg, zoom3.jpg).
  // ------------------------------------------------------------------
  fotosZoom: [
    {
      pergunta: "Sempre com esse seu sorriso lindo no rosto, sabe me dizer onde estávamos?",
      imagem: "fotos/zoom1.jpg",
      legenda: "Dica: olha esse detalhe no fundo...",
      opcoes: ["Parque da Água Branca", "Parque do Ibirapuera", "Parque em Barueri", "Viagem de Avaliação Física"],
      correta: 2
    },
    {
      pergunta: "Um momento mais que especial para nós 2 , você se lembra onde era ?",
      imagem: "fotos/zoom2.jpg",
      legenda: "Dica: foi um fim de semana e tanto",
      opcoes: ["Era a busca da orquestra", "A visita ao salão com os pais", "Evento que ganhamos o barman", "Era uma balada"],
      correta: 2
    },
    {
      pergunta: "Com você ao meu lado sempre tudo fica melhor, esse é dificil,onde estávamos?",
      imagem: "fotos/zoom3.jpg",
      legenda: "Dica: Com você ao meu lado sempre sou mais forte ",
      opcoes: ["Campeonato em Elias Fausto", "Campeonato em São Roque", "Campeonato no Ibirapuera", "Campeonato em Monte Mor"],
      correta: 0
    }
  ],

  // ------------------------------------------------------------------
  // 🧩 QUEBRA-CABEÇA — dá pra jogar arrastando as peças (arraste uma
  // peça em cima da outra pra trocá-las) OU tocando em duas peças
  // seguidas pra trocá-las de lugar — funciona bem no celular.
  // Escolha uma foto marcante (ex: do casamento) e coloque em
  // fotos/puzzle.jpg — tamanho 3 = grade 3x3 (recomendado no celular)
  // ------------------------------------------------------------------
  quebraCabeca: {
    imagem: "fotos/puzzle.jpg",
    tamanho: 3,
    titulo: "Remonte esse momento",
    instrucao: "Arraste uma peça sobre outra (ou toque em duas peças seguidas) para trocá-las de lugar."
  },

  // ------------------------------------------------------------------
  // 🧠 JOGO DA MEMÓRIA 5×5 — coloque até 12 fotos de vocês. Se colocar
  // menos, o jogo repete as fotos disponíveis pra completar os pares.
  // A 25ª carta é um "coringa" 💛 que já vira sozinha, só de enfeite.
  // ------------------------------------------------------------------
  jogoDaMemoria: {
    titulo: "Jogo da memória",
    instrucao: "Vire duas cartas por vez e encontre todos os pares das nossas fotos e relembre um pouco a nossa história.",
    fotos: [
      "fotos/mem1.jpg", "fotos/mem2.jpg", "fotos/mem3.jpg", "fotos/mem4.jpg",
      "fotos/mem5.jpg", "fotos/mem6.jpg", "fotos/mem7.jpg", "fotos/mem8.jpg",
      "fotos/mem9.jpg", "fotos/mem10.jpg", "fotos/mem11.jpg", "fotos/mem12.jpg"
    ]
  },

  // ------------------------------------------------------------------
  // 🖼️ FOTO PROGRESSIVA — começa toda embaçada. A cada tentativa
  // errada ela fica um pouco mais nítida. Se acertar de primeira, já
  // aparece nítida na hora.
  // ------------------------------------------------------------------
  fotoProgressiva: {
    pergunta: "São tantos momentos ao seu lado inesquecíveis, mas se lembra desse ?",
    imagem: "fotos/progressiva.jpg",
    opcoes: ["Férias em Natal", "Férias em Porto Seguro", "Volta Redonda", "Em Minas Gerais"],
    correta: 2
  },

  // ------------------------------------------------------------------
  // 🪄 RASPADINHA — ela "raspa" a tela com o dedo (ou mouse) até
  // revelar a foto surpresa por trás.
  // ------------------------------------------------------------------
  raspadinha: {
    titulo: "Raspadinha surpresa",
    instrucao: "Passe o dedo (ou o mouse) na área dourada pra raspar e revelar mais um passo da nossa história.",
    imagem: "fotos/raspadinha.jpg"
  },

  // ------------------------------------------------------------------
  // ❤️ CORAÇÃO ESCONDIDO — existe um coração escondido em algum lugar
  // dessa foto. "posicao" é em PORCENTAGEM da imagem (x e y de 0 a
  // 100) e "raio" é a margem de tolerância do toque, também em %.
  // Dica pra achar a posição certa: abra a foto num editor/visualizador
  // e estime onde fica o coraçãozinho (ex: um coração desenhado na
  // areia, numa folha, num reflexo etc.)
  // ------------------------------------------------------------------
  coracaoEscondido: {
    titulo: "Encontre o coração escondido meu amor",
    instrucao: "Tem um coração escondido nessa foto. Toque onde você acha que ele está!",
    imagem: "fotos/coracao.jpg",
    posicao: { x: 62, y: 45, raio: 9 }
  },

  // ------------------------------------------------------------------
  // LINHA DO TEMPO — coloque os marcos da relação em qualquer ordem
  // aqui embaixo, com "ordem" indicando a posição CORRETA (1, 2, 3...)
  // ------------------------------------------------------------------
  linhaDoTempo: {
    titulo: "Coloque nossa história em ordem",
    instrucao: "Toque em dois itens para trocá-los de posição.",
    itens: [
      { texto: "Nosso primeiro encontro", ordem: 1 },
      { texto: "Pedido de namoro", ordem: 2 },
      { texto: "Primeira viagem juntos", ordem: 3 },
      { texto: "Pedido de casamento", ordem: 4 },
      { texto: "O dia do nosso casamento — 06/09/2015", ordem: 5 }
    ]
  },

  // ------------------------------------------------------------------
  // CARTA FINAL (texto simples, usado como reserva caso "finalEspecial"
  // não tenha cartaAnimada preenchida)
  // ------------------------------------------------------------------
  cartaFinal: {
    texto: "Desde 06/02/2008 até hoje, cada capítulo dessa história foi construído com você.\nObrigado por transformar dias comuns em memórias, e memórias em uma vida inteira.\nFeliz aniversário, meu amor. Que venham muitos e muitos anos 06/09 pela frente.",
    assinatura: "— com todo meu amor"
  },

  // ------------------------------------------------------------------
  // 🎬 GRAND FINALE — depois que ela termina todos os desafios:
  // 1) um vídeo toca automaticamente (coloque o arquivo em fotos/)
  // 2) uma carta é "digitada" na tela com efeito de máquina de escrever
  // 3) um botão revela a última pista pra encontrar o presente físico
  // Se não quiser vídeo, deixe "video: null" — o jogo pula direto pra carta.
  // Se não quiser pista final, deixe "pistaFinal: null".
  // ------------------------------------------------------------------
  finalEspecial: {
    video: "fotos/video-final.mp4",
    cartaAnimada: "Hoje é mais um dia para celebrar o momento em que você veio ao mundo, meu amor.\n\nUma data tão especial que, para mim, deveria ser comemorada por todos, pois foi nesse dia que nasceu o grande amor da minha vida.\n\nDepois de tantos anos juntos, tenho ainda mais certeza de que você é a pessoa que me completa.\n\nAo seu lado vivi alguns dos momentos mais felizes da minha vida, enfrentei desafios, realizei sonhos e construí uma história que me enche de orgulho.\n\nCada dia ao seu lado me faz admirar ainda mais a mulher incrível, forte, carinhosa e dedicada que você é.\n\nQuero agradecer a Deus por ter colocado você no meu caminho e por me permitir compartilhar a vida com alguém tão especial.\n\nVocê é minha companheira, minha melhor amiga, meu porto seguro e a pessoa com quem quero continuar escrevendo nossa história por muitos e muitos anos.",
    assinaturaAnimada: "— com todo meu amor",
    pistaFinal: "É seu aniversávio mas saiba que você sempre foi e será o meu melhor... 🎁"
  }
};
