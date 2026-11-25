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

/* ---------- Dado de 20 faces ---------- */
const dado = $('#dado'), numero = $('#dado-num'), msg = $('#dado-msg');
dado.addEventListener('click', () => {
  const valor = Math.floor(Math.random() * 20) + 1;
  numero.textContent = valor;
  dado.classList.remove('rolando'); void dado.offsetWidth; dado.classList.add('rolando'); // reinicia a animação
  msg.textContent = valor === 20 ? 'Sucesso crítico! A Insurgência vence.'
                  : valor === 1  ? 'Falha crítica! O sistema caiu.'
                  : valor >= 11  ? 'Sucesso. Você passou no teste.'
                  : 'Falha. Role de novo.';
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
