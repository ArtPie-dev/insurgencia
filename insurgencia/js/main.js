/* Insurgência | main.js */
const GITHUB_USER = 'ArtPie-dev';
const EMAIL = 'pinherrepeixe@gmail.com';
const $ = (seletor, base = document) => base.querySelector(seletor);
const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema claro/escuro (lembra a escolha) ---------- */
const html = document.documentElement;
const temaBtn = $('.tema-btn');
function aplicarTema(tema){
  html.dataset.theme = tema;
  temaBtn.textContent = tema === 'dark' ? 'Tema claro' : 'Tema escuro';
  try { localStorage.setItem('tema', tema); } catch (e) {}
}
let salvo = null;
try { salvo = localStorage.getItem('tema'); } catch (e) {}
aplicarTema(salvo || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
temaBtn.addEventListener('click', () => aplicarTema(html.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ---------- Menu hambúrguer (mobile) ---------- */
const menuBtn = $('.menu-btn');
const nav = $('#nav');
menuBtn.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});
nav.addEventListener('click', e => {            // fecha o menu ao escolher uma seção
  if (e.target.matches('a')) { nav.classList.remove('aberto'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

/* ---------- Item do menu acompanha a seção visível ---------- */
const links = [...document.querySelectorAll('.nav a')];
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    links.forEach(a => a.getAttribute('href') === '#' + entrada.target.id
      ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach(s => observador.observe(s));

/* ---------- Efeito de digitação na apresentação ---------- */
const papeis = ['Estudante de Ciência da Computação', 'Formado em Perícia Forense Computacional',
                'Formado em Animação Digital', 'Pesquisador em robótica cirúrgica', 'Entusiasta de RPG'];
const alvo = $('#digitando');
function digitar(i = 0, letras = 0, apagando = false){
  const texto = papeis[i];
  alvo.textContent = texto.slice(0, letras);
  let espera = apagando ? 35 : 70;
  if (!apagando && letras === texto.length){ apagando = true; espera = 1800; }
  else if (apagando && letras === 0){ apagando = false; i = (i + 1) % papeis.length; espera = 400; }
  setTimeout(() => digitar(i, letras + (apagando ? -1 : 1), apagando), espera);
}
if (!reduzir) digitar();   // com "reduzir movimento", o texto fica fixo

/* ---------- Dado d20: cada resultado dispara um evento ---------- */
const dado = $('#dado'), numero = $('#dado-num'), msg = $('#dado-msg');
const area = $('main'), ficha = $('.ficha'), inventarioEl = $('#inventario');
const ITENS = ['Chip de memória', 'Óculos de realidade aumentada', 'Cabo USB-C lendário', 'Mapa da Cidade Neon',
               'Energético experimental', 'Drone mensageiro', 'Chave mestra', 'Dado viciado'];
let xp = 0, inventario = [], tFalha;

// aplica uma classe de animação por um tempo (ignorado com "reduzir movimento")
function animar(alvo, classe, ms){
  if (reduzir) return;
  alvo.classList.remove(classe); void alvo.offsetWidth; alvo.classList.add(classe);
  setTimeout(() => alvo.classList.remove(classe), ms);
}
function saque(){
  const item = ITENS[Math.floor(Math.random() * ITENS.length)];
  inventario.push(item);
  inventarioEl.textContent = '';
  inventario.forEach(nome => { const t = document.createElement('span'); t.className = 'tag'; t.textContent = nome; inventarioEl.append(t); });
  return `Item: ${item}.`;
}
function confete(){
  if (reduzir) return;
  const caixa = document.createElement('div'); caixa.className = 'confete'; caixa.setAttribute('aria-hidden', 'true');
  const cores = ['#ff3d8b', '#3df2ff', '#ffd23d', '#a37bff'];
  for (let i = 0; i < 60; i++){
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%'; p.style.background = cores[i % 4]; p.style.animationDelay = Math.random() * .6 + 's';
    caixa.append(p);
  }
  document.body.append(caixa); setTimeout(() => caixa.remove(), 3200);
}
function falhaCritica(){       // dado = 1: o "sistema" do site cai e reinicia
  const caixa = $('#falha'), log = $('#falha-log');
  clearTimeout(tFalha); log.textContent = ''; caixa.hidden = false; $('#falha-ok').focus();
  document.body.classList.add('glitch');
  ['> sinal perdido', '> módulos corrompidos', '> rastreando intruso...', '> reiniciando a Insurgência', '> 100% sistema restaurado']
    .forEach((linha, i) => setTimeout(() => { log.textContent += linha + '\n'; }, reduzir ? 0 : i * 700));
  const fechar = () => { clearTimeout(tFalha); caixa.hidden = true; document.body.classList.remove('glitch'); dado.focus(); };
  $('#falha-ok').onclick = fechar;
  tFalha = setTimeout(fechar, 5500);
}

// faixas de resultado: nome do evento, textos possíveis e efeito no site
const FAIXAS = [
  { ate: 1,  nome: 'Falha crítica', efeito: falhaCritica,
    textos: ['O sistema caiu! Você foi rastreado e o site precisa reiniciar.'] },
  { ate: 5,  nome: 'Emboscada', efeito: () => animar(area, 'tremor', 500),
    textos: ['Um drone de segurança achou você. Corra pelo beco!', 'A corporação rastreou seu sinal. Hora de sumir da rede.', 'Chuva ácida! O dia só piora.'] },
  { ate: 10, nome: 'Obstáculo', efeito: () => animar(area, 'piscar', 1200),
    textos: ['Firewall pesado. Você demora para contorná-lo.', 'O elevador parou no 13º andar. Tente a escada.', 'Seu café neon acabou. Foco em 50%.'] },
  { ate: 15, nome: 'Sucesso', efeito: () => animar(ficha, 'brilho', 1500),
    textos: ['Você hackeou a porta e entrou sem alarme.', 'Um informante passou o código certo.', 'A mesa inteira riu da sua jogada. Missão cumprida.'] },
  { ate: 19, nome: 'Saque', efeito: saque,
    textos: ['Você achou algo útil no mercado negro.', 'Um baú escondido atrás do servidor!', 'O mestre sorriu e entregou um item.'] },
  { ate: 20, nome: 'Sucesso crítico', efeito: confete,
    textos: ['A Insurgência vence! Chuva de neon.'] }
];

dado.addEventListener('click', () => {
  const valor = Math.floor(Math.random() * 20) + 1;
  numero.textContent = valor;
  animar(dado, 'rolando', 600);
  const faixa = FAIXAS.find(f => valor <= f.ate);
  const texto = faixa.textos[Math.floor(Math.random() * faixa.textos.length)];
  const extra = faixa.efeito() || '';

  const nivelAntes = 1 + Math.floor(xp / 50);
  xp += valor;
  const nivel = 1 + Math.floor(xp / 50);
  $('#nivel').textContent = nivel;
  $('#xp-barra').style.width = (xp % 50) * 2 + '%';
  $('#xp').setAttribute('aria-valuenow', xp % 50);

  msg.textContent = `Você tirou ${valor}.`;
  $('#evento-titulo').textContent = faixa.nome;
  $('#evento-texto').textContent = `${texto} ${extra} +${valor} XP.${nivel > nivelAntes ? ` Você subiu para o nível ${nivel}!` : ''}`;
  $('#evento').hidden = false;
  animar($('#evento'), 'surgir', 400);
});

/* ---------- Missões: repositórios vindos da API do GitHub ---------- */
async function carregarRepos(){
  const lista = $('#repos');
  try {
    const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
    if (!r.ok) throw new Error(r.status);
    const repos = (await r.json()).filter(repo => !repo.fork);
    if (!repos.length){ lista.textContent = 'Nenhum repositório público ainda.'; return; }
    lista.textContent = '';
    repos.forEach(repo => {
      const cartao = document.createElement('a');
      cartao.className = 'painel cartao';
      cartao.href = repo.html_url; cartao.target = '_blank'; cartao.rel = 'noopener';
      const titulo = document.createElement('h3'); titulo.textContent = repo.name;
      const texto = document.createElement('p'); texto.textContent = repo.description || 'Sem descrição ainda.';
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = repo.language || 'Código';
      cartao.append(titulo, texto, tag);
      lista.append(cartao);
    });
  } catch (erro) {
    lista.textContent = 'Não foi possível carregar os repositórios agora. Veja direto no GitHub.';
  }
}
carregarRepos();

/* ---------- Contato: validação do formulário ---------- */
const form = $('#form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valido = true;
  [...form.elements].filter(c => c.name).forEach(campo => {
    let erro = '';
    if (!campo.value.trim()) erro = 'Preencha este campo.';
    else if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)) erro = 'Digite um e-mail válido.';
    else if (campo.name === 'mensagem' && campo.value.trim().length < 10) erro = 'Escreva pelo menos 10 caracteres.';
    $('#erro-' + campo.name).textContent = erro;
    campo.setAttribute('aria-invalid', Boolean(erro));
    if (erro) valido = false;
  });
  if (!valido) return;

  // Sem servidor próprio: abre o app de e-mail com a mensagem pronta
  const d = new FormData(form);
  const corpo = `${d.get('mensagem')}\n\nDe: ${d.get('nome')} (${d.get('email')})`;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Contato pelo portfólio')}&body=${encodeURIComponent(corpo)}`;
  $('#form-ok').textContent = 'Abrindo seu aplicativo de e-mail…';
});

/* ---------- Rádio Insurgência: música de fundo com a API oficial do Spotify ----------
   As faixas vêm dos links da seção "Ouvindo". O navegador só libera o som depois de um clique. */
const faixas = [...document.querySelectorAll('.musica a')].map(a => ({ id: a.href.split('/track/')[1], nome: a.textContent }));
const radio = $('#radio'), rNome = $('#radio-nome'), rPlay = $('#r-play');
let atual = 0, ctrl = null, tocando = false;

rNome.textContent = faixas[0].nome;
$('#radio-toggle').addEventListener('click', e => {
  const aberto = radio.classList.toggle('aberto');
  e.currentTarget.setAttribute('aria-expanded', aberto);
});
function botaoPlay(){
  rPlay.innerHTML = `<span class="ico ico-${tocando ? 'pause' : 'play'}"></span>`;
  rPlay.setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar');
}
function trocarFaixa(passo){
  atual = (atual + passo + faixas.length) % faixas.length;
  rNome.textContent = faixas[atual].nome;
  if (!ctrl) return;
  ctrl.loadUri(`spotify:track:${faixas[atual].id}`);
  setTimeout(() => ctrl.play(), 700);
}
$('#r-ant').addEventListener('click', () => trocarFaixa(-1));
$('#r-prox').addEventListener('click', () => trocarFaixa(1));
rPlay.addEventListener('click', () => { if (ctrl) ctrl.togglePlay(); else rNome.textContent = 'Carregando o Spotify…'; });

// a API do Spotify chama esta função quando termina de carregar
window.onSpotifyIframeApiReady = IFrameAPI => {
  IFrameAPI.createController($('#radio-iframe'), { uri: `spotify:track:${faixas[0].id}`, width: '100%', height: 80 }, controlador => {
    ctrl = controlador;
    ctrl.addListener('playback_update', e => { tocando = !e.data.isPaused; botaoPlay(); });
  });
};
