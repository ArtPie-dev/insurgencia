/* Insurgência | main.js */
const ROTAS = { inicio:'Início', sobre:'Sobre', rpg:'A mesa', projetos:'Missões', contato:'Contato' };
const GITHUB_USER = 'ArtPie-dev';
const EMAIL = 'pinherrepeixe@gmail.com';
const $ = (seletor, base = document) => base.querySelector(seletor);

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

/* ---------- Navegação: várias páginas HTML, comportamento de página única ----------
   O endereço (#sobre, #rpg...) escolhe o arquivo em /pages, que é inserido no <main>. */
const main = $('#conteudo');
async function carregar(){
  let pagina = location.hash.slice(1);
  if (!ROTAS[pagina]) pagina = 'inicio';

  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + pagina) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  try {
    const resposta = await fetch(`pages/${pagina}.html`);
    if (!resposta.ok) throw new Error(resposta.status);
    main.innerHTML = await resposta.text();
  } catch (erro) {
    main.innerHTML = '<h2>Sinal perdido</h2><p>Não foi possível carregar esta seção. Abra o site por um servidor (Live Server no VS Code ou GitHub Pages), não direto pelo arquivo.</p>';
    return;
  }

  document.title = `${ROTAS[pagina]} | Insurgência`;
  nav.classList.remove('aberto');
  menuBtn.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });

  // Cada página liga o seu próprio JavaScript
  const iniciar = { inicio: iniciarDado, projetos: carregarRepos, contato: iniciarForm }[pagina];
  if (iniciar) iniciar();
}
addEventListener('hashchange', carregar);
carregar();

/* ---------- Início: dado de 20 faces ---------- */
function iniciarDado(){
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
}

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

/* ---------- Contato: validação do formulário ---------- */
function iniciarForm(){
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
}
