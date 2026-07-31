# Nossa História — jogo de aniversário 💛

## 1. Como editar

Abra o arquivo **`config.js`** — é o único arquivo que você provavelmente vai precisar
mexer. Lá dá pra trocar:

- o nome dela (`nomeEsposa`)
- as perguntas de múltipla escolha e de foto
- as 3 fotos com efeito de zoom (`fotosZoom`)
- o quebra-cabeça (imagem e tamanho da grade)
- o jogo da memória 5×5 (`jogoDaMemoria`)
- a foto que vai ficando nítida aos poucos (`fotoProgressiva`)
- a raspadinha (`raspadinha`)
- o coração escondido (`coracaoEscondido`)
- os itens da linha do tempo pra ordenar
- o vídeo final, a carta animada e a última pista (`finalEspecial`)

## 2. Como colocar as fotos e o vídeo

Coloque os arquivos dentro da pasta **`fotos/`** com exatamente estes nomes
(ou troque os nomes no `config.js` se preferir outros):

```
fotos/foto1.jpg          → pergunta 3 (foto)
fotos/foto2.jpg          → pergunta 4 (foto)
fotos/foto3.jpg          → pergunta 5 (foto)
fotos/foto4.jpg          → pergunta 6 (foto)

fotos/zoom1.jpg          → 📸 foto com zoom 1
fotos/zoom2.jpg          → 📸 foto com zoom 2
fotos/zoom3.jpg          → 📸 foto com zoom 3

fotos/puzzle.jpg         → 🧩 quebra-cabeça (ex: foto do casamento)

fotos/mem1.jpg … mem12.jpg → 🧠 jogo da memória (até 12 fotos; se
                              colocar menos, o jogo repete as que
                              existirem pra completar os pares)

fotos/progressiva.jpg    → 🖼️ foto que vai ficando nítida aos poucos

fotos/raspadinha.jpg     → 🪄 foto revelada na raspadinha

fotos/coracao.jpg        → ❤️ foto com o coração escondido

fotos/video-final.mp4    → 🎬 vídeo que toca automaticamente no final
                              (formato .mp4, recomendo até ~30-40MB
                              pra carregar rápido no celular dela)
```

Se uma foto (ou o vídeo) ainda não estiver na pasta, o jogo mostra um aviso
amarelo no lugar dela ("coloque a foto/vídeo aqui") em vez de quebrar — então
dá pra testar tudo antes mesmo de ter tudo pronto. Se `fotos/video-final.mp4`
não existir, o jogo simplesmente pula direto pra carta animada.

**Dica para o quebra-cabeça:** escolha uma foto bem quadrada/central (rosto
ou momento no meio da imagem), porque as bordas cortam um pouco em telas
estreitas.

**Dica para o coração escondido:** no `config.js`, o campo `posicao` usa
porcentagem da imagem (`x` e `y` de 0 a 100, sendo `x:0` a borda esquerda e
`y:0` o topo). Abra a foto escolhida, estime onde fica o coraçãozinho
(desenhado na areia, num reflexo, numa folha etc.) e ajuste `x`, `y` e o
`raio` (margem de tolerância do toque).

## 3. Os novos desafios, por dentro

- **📸 Fotos com zoom** — igual às perguntas de foto normais, mas a imagem
  tem um efeito de zoom lento (Ken Burns) enquanto ela escolhe a resposta.
- **🧩 Quebra-cabeça** — ela pode arrastar uma peça sobre outra pra trocá-las
  de lugar, ou simplesmente tocar em duas peças seguidas (funciona bem no
  celular também).
- **🧠 Jogo da memória 5×5** — 25 cartas: 12 pares das fotos de vocês + 1
  carta "coringa" 💍 que já vira sozinha, só de enfeite.
- **🖼️ Foto progressiva** — começa toda embaçada; a cada resposta errada
  fica um pouco mais nítida. Se ela acertar de primeira, já revela na hora.
- **🪄 Raspadinha** — ela passa o dedo (ou o mouse) numa camada dourada até
  raspar o suficiente pra revelar a foto surpresa por trás.
- **❤️ Coração escondido** — existe um coração escondido em algum ponto da
  foto; quando ela toca no lugar certo, um coraçãozinho pulsante aparece
  confirmando o acerto.
- **🎬 Grande final** — depois do último desafio: o vídeo toca
  automaticamente (com botão pra pular, caso o navegador bloqueie o
  autoplay), depois a carta é "digitada" na tela com efeito de máquina de
  escrever, e por fim um botão revela a última pista para o presente físico.

## 4. Como publicar de graça (pra abrir no celular dela)

### Opção A — Netlify Drop (a mais rápida, sem precisar criar conta)
1. Acesse **https://app.netlify.com/drop**
2. Arraste a pasta inteira `jogo-aniversario` (com o `index.html`, `style.css`,
   `script.js`, `config.js` e a pasta `fotos`) para a área indicada no site.
3. Em segundos o Netlify gera um link tipo `https://nome-aleatorio.netlify.app`.
4. Envie esse link pra ela (WhatsApp, mensagem, etc). Funciona perfeitamente
   no navegador do celular.

### Opção B — GitHub Pages (se você já usa GitHub)
1. Crie um repositório novo (pode ser privado).
2. Suba todos os arquivos deste projeto (mantendo a pasta `fotos`).
3. Vá em **Settings → Pages**, escolha a branch `main` e a pasta raiz `/`.
4. O GitHub gera um link tipo `https://seuusuario.github.io/repositorio`.

### Opção C — Vercel
1. Crie uma conta grátis em **https://vercel.com**
2. "Add New Project" → importe a pasta/repositório.
3. Deploy automático, gera um link `https://seuprojeto.vercel.app`.

### Opção D — Render (Static Site)
1. Suba os arquivos pra um repositório no GitHub.
2. Em **render.com** → "New" → "Static Site" → conecte o repositório.
3. Deixe o "Publish directory" como raiz (`.`) já que não há build.
4. Render gera um link público gratuito.

Qualquer uma dessas opções funciona bem no celular — é só mandar o link.
Se o arquivo de vídeo for grande, prefira Netlify, Vercel ou GitHub Pages
(todos aceitam arquivos de alguns MB sem problema).

## 5. Testar no seu computador antes de publicar

Se tiver Python instalado, dentro da pasta do projeto rode:

```
python3 -m http.server 8000
```

e abra `http://localhost:8000` no navegador. (Abrir o `index.html` direto
com duplo clique também funciona na maioria dos navegadores, exceto pra
testar o vídeo/raspadinha em alguns casos — se algo não carregar, use o
servidor local acima.)
