# Insurgência

Portfólio pessoal de **Arthur Pierre de Aguiar**, feito como ficha de personagem de um RPG cyberpunk. Projeto final (A1) da disciplina **Desenvolvimento Front-End para Web**, do curso de Ciência da Computação da UDF.

**Site publicado:** https://artpie-dev.github.io/insurgencia/

## Sobre o projeto

O tema é o meu hobby, o RPG. O site é uma página única com nove seções: apresentação, sobre mim, hobbies, galeria, músicas, habilidades, projetos do GitHub, idiomas e contato. A apresentação é uma "ficha de personagem" com um dado d20 que dispara eventos.

## Requisitos do professor

| Requisito | Como foi atendido |
|---|---|
| Site portfólio (sobre mim, o que faço ou um hobby) | Portfólio sobre mim, minha formação e meu hobby (RPG) |
| Hospedagem no GitHub Pages | Publicado a partir da branch `main` |
| HTML, CSS e JavaScript | `index.html`, `css/style.css` e `js/main.js` |
| Design responsivo (mobile) | Layout pensado primeiro para celular, com `grid`, `flexbox` e menu hambúrguer |
| Arquitetura completa, com pastas separadas | `css/`, `js/` e `img/`, cada uma com seu conteúdo |

## Funcionalidades

- **Tema claro e escuro**, com botão de alternar. A escolha fica salva no navegador.
- **Dado d20 com eventos:** cada resultado muda algo no site (tremor, brilho, confete, itens de inventário) e dá XP para subir de nível. Tirar 1 derruba o "sistema".
- **Rádio Insurgência:** música de fundo que alterna entre as faixas da seção "Ouvindo", usando a API oficial do Spotify.
- **Projetos automáticos:** a seção "Missões" lista meus repositórios públicos pela API do GitHub.
- **Formulário de contato** com validação em JavaScript. Ao enviar, abre o app de e-mail com a mensagem pronta.
- **Efeito de digitação** na apresentação, menu que acompanha a seção visível e cursor do mouse personalizado.
- **Easter eggs** escondidos (veja abaixo).

## Tecnologias

HTML5, CSS3 (variáveis, `grid`, `flexbox`, `clip-path`, `mask`) e JavaScript puro, sem frameworks nem bibliotecas. Fontes: Chakra Petch e IBM Plex Sans, pelo Google Fonts.

## Estrutura de pastas

```
insurgencia/
├── index.html          página única, com todas as seções
├── README.md
├── css/
│   └── style.css       estilos, temas e animações
├── js/
│   └── main.js         tema, menu, dado, rádio, GitHub, formulário e segredos
└── img/
    ├── *.svg           ícones e cursores
    ├── foto-1.jpg      fotos pessoais
    ├── foto-2.jpg
    └── segredos/       imagens dos easter eggs
```

## Como rodar localmente

1. Clone o repositório ou baixe o zip:
   ```
   git clone https://github.com/ArtPie-dev/insurgencia.git
   ```
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha **Open with Live Server**. Também funciona abrindo o `index.html` direto no navegador.

É preciso ter internet para carregar as fontes, os players do Spotify e a lista de repositórios.

## Como publicar no GitHub Pages

1. Envie o projeto para um repositório público chamado `insurgencia`.
2. No GitHub, vá em **Settings > Pages**.
3. Em **Source**, escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Em cerca de 1 minuto, o site fica em `https://artpie-dev.github.io/insurgencia/`.

## Como personalizar

- **Textos e seções:** `index.html`. Procure os comentários `EDITE`.
- **Cores e fontes:** variáveis no topo do `css/style.css`.
- **Músicas:** cada música é um bloco `.musica` no `index.html`. Para trocar, mude o código entre `/track/` e o fim do link do Spotify, no `src` do player e no link logo abaixo. A rádio usa essas mesmas músicas.
- **Eventos do dado:** lista `FAIXAS` no `js/main.js`.

## Observações

- **Rádio:** sem login no Spotify, cada música toca só um trecho de 30 segundos. O navegador só libera o som depois de um clique.
- **Acessibilidade:** navegação por teclado, foco visível, textos alternativos nas imagens e respeito à opção "reduzir movimento" do sistema.

## Easter eggs (spoiler)

Existem 5 segredos escondidos. Se quiser descobrir sozinho, pare de ler aqui.

| Como ativar | O que acontece |
|---|---|
| Digitar o código Konami: ↑ ↑ ↓ ↓ ← → ← → B A (ou clicar 7 vezes no título "Insurgência") | Aparece a placa de boas-vindas |
| Clicar 5 vezes seguidas na marca do cabeçalho | Modo off, com tema escuro |
| Clicar 3 vezes na foto "Modo meditação" | Aparece o sapo zen |
| Rolar o dado 10 vezes | Aparece o gato da fábrica |
| Tirar 1 no dado (falha crítica) | Depois do reinício do sistema, aparece o boladão |

## Créditos

- Ícones do GitHub e do LinkedIn: [Simple Icons](https://simpleicons.org/) (domínio público, CC0). Demais ícones e cursores desenhados para este projeto.
- Músicas: players oficiais do Spotify. As músicas pertencem aos seus artistas.
- Memes dos easter eggs: imagens da internet, de autoria desconhecida, usadas em tom de brincadeira.

## Autor

**Arthur Pierre de Aguiar**
[GitHub](https://github.com/ArtPie-dev) · [LinkedIn](https://www.linkedin.com/in/arthur-pierre-de-aguiar-7b756030a) · pinherrepeixe@gmail.com
