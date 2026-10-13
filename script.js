/**
 * ================================================================
 * LAVille Lavanderia Blue – script.js (versão modernizada)
 * ----------------------------------------------------------------
 *  0. CONFIGURAÇÃO do envio do formulário (editar aqui)
 *  1. UTILITÁRIO   – observeElements (IntersectionObserver)
 *  2. HEADER       – sombra ao rolar + link ativo no menu
 *  3. MENU MOBILE  – hambúrguer, fechar ao clicar fora / Esc
 *  4. FAQ          – acordeão acessível
 *  5. FORMULÁRIO   – validação, máscara e ENVIO REAL de e-mail
 *  6. ANIMAÇÕES    – fade-in ao rolar
 *  7. VOLTAR AO TOPO
 *  8. ANO DO RODAPÉ
 *  9. ROLAGEM SUAVE para âncoras (compensa o header fixo)
 * ================================================================
 */


/* ================================================================
   0. CONFIGURAÇÃO DO ENVIO DO FORMULÁRIO
   ----------------------------------------------------------------
   O site é estático (HTML + CSS + JS), portanto o envio do e-mail
   é feito por um serviço de formulários. Nenhuma senha ou chave
   privada fica neste arquivo.

   Padrão: FormSubmit (https://formsubmit.co) – gratuito, sem cadastro.
     • Na 1ª mensagem enviada, o FormSubmit manda um e-mail de
       ATIVAÇÃO para o endereço abaixo. Clique em "Activate Form".
       Só depois disso as mensagens passam a ser entregues.
     • Após ativar, o FormSubmit informa um endereço "alias"
       (código aleatório). Você pode trocar o e-mail da URL por esse
       código para não deixar o e-mail visível no código.

   Alternativa: Formspree (https://formspree.io) – crie um formulário
   e cole aqui a URL do tipo 'https://formspree.io/f/xxxxxxx'.

   Veja o README.md para o passo a passo completo.
   ================================================================ */
const FORM_CONFIG = {
  // E-mail que receberá as mensagens (já divulgado no site).
  endpoint: 'https://formsubmit.co/ajax/lavanderialaville@gmail.com',

  // Prefixo do assunto do e-mail recebido pela lavanderia
  subjectPrefix: '[Site LAVille]',

  // Tempo máximo de espera pela resposta do serviço (ms)
  timeoutMs: 15000
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ================================================================
   1. UTILITÁRIO – observeElements
   Adiciona classe(s) a elementos quando entram no viewport.
   ================================================================ */
function observeElements(selector, className, options = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  // Sem suporte ao IntersectionObserver: mostra tudo imediatamente
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => className.split(' ').forEach(cls => el.classList.add(cls)));
    return;
  }

  const opts = Object.assign({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }, options);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        className.split(' ').forEach(cls => entry.target.classList.add(cls));
        obs.unobserve(entry.target); // anima apenas uma vez
      }
    });
  }, opts);

  elements.forEach(el => observer.observe(el));
}


/* ================================================================
   2. HEADER – sombra ao rolar + link ativo
   ================================================================ */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');
  let ticking = false;

  function updateActiveLink() {
    let current = '';
    const offset = header.offsetHeight + 24;

    sections.forEach(section => {
      if (window.scrollY + offset >= section.offsetTop) current = section.id;
    });

    links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
    updateActiveLink();
    toggleBackToTop();
    ticking = false;
  }

  // requestAnimationFrame evita executar a lógica várias vezes por quadro
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  onScroll();
})();


/* ================================================================
   3. MENU MOBILE (hambúrguer)
   ================================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  function setOpen(isOpen) {
    nav.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

  // Fecha ao escolher um link (inclusive o botão de pacotes do menu)
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      setOpen(false);
    }
  });

  // Fecha com a tecla Esc e devolve o foco ao botão
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      hamburger.focus();
    }
  });

  // Se a tela for ampliada para desktop com o menu aberto, restaura o estado
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
    if (e.matches) setOpen(false);
  });
})();


/* ================================================================
   4. FAQ – acordeão acessível (um item aberto por vez)
   ================================================================ */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        const otherBtn = other.querySelector('.faq-q');
        const otherAns = other.querySelector('.faq-a');
        if (otherBtn && otherAns && otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
    // Observação: <button> já responde a Enter e Espaço nativamente.
  });
})();


/* ================================================================
   5. FORMULÁRIO DE CONTATO – validação + envio real
   ================================================================ */
(function initForm() {
  const form = document.getElementById('contato-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');
  const btnLabel = submitBtn.querySelector('.btn-label');
  const btnIcon = submitBtn.querySelector('svg');
  const originalIcon = btnIcon ? btnIcon.outerHTML : '';

  const fields = {
    nome:     form.querySelector('#nome'),
    telefone: form.querySelector('#telefone'),
    email:    form.querySelector('#email'),
    assunto:  form.querySelector('#assunto'),
    mensagem: form.querySelector('#mensagem'),
    honey:    form.querySelector('#_honey')
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const WHATSAPP_URL = 'https://wa.me/5585998371212';

  let isSending = false;     // impede envios duplicados
  let attempted = false;     // após a 1ª tentativa, valida enquanto o usuário digita

  /* ── Máscara de telefone: (00) 00000-0000 ── */
  if (fields.telefone) {
    fields.telefone.addEventListener('input', () => {
      let v = fields.telefone.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10)      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      else if (v.length > 6)  v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
      else if (v.length > 2)  v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      else if (v.length > 0)  v = `(${v}`;
      fields.telefone.value = v;
    });
  }

  /* ── Regras de validação de cada campo ── */
  function validateField(name) {
    const field = fields[name];
    if (!field) return true;
    const value = field.value.trim();
    let message = '';

    if (name === 'nome' && !value) message = 'Informe seu nome completo.';
    if (name === 'nome' && value && value.length < 3) message = 'O nome deve ter pelo menos 3 caracteres.';

    if (name === 'email') {
      if (!value) message = 'Informe seu e-mail.';
      else if (!EMAIL_REGEX.test(value)) message = 'Informe um e-mail válido, por exemplo: nome@email.com.';
    }

    if (name === 'assunto' && !value) message = 'Informe o assunto da mensagem.';

    if (name === 'mensagem') {
      if (!value) message = 'Escreva a sua mensagem.';
      else if (value.length < 10) message = 'A mensagem deve ter pelo menos 10 caracteres.';
    }

    setFieldError(field, message);
    return !message;
  }

  function setFieldError(field, message) {
    const errorEl = document.getElementById(`${field.id}-erro`);
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = message;
  }

  const REQUIRED = ['nome', 'email', 'assunto', 'mensagem'];

  // Revalida em tempo real somente depois da primeira tentativa de envio
  REQUIRED.forEach(name => {
    const field = fields[name];
    if (!field) return;
    field.addEventListener('input', () => { if (attempted) validateField(name); });
    field.addEventListener('blur',  () => { if (attempted) validateField(name); });
  });

  /* ── Mensagem de status geral ── */
  function showStatus(type, html) {
    status.className = `form-status is-${type}`;
    status.innerHTML = html;
    status.hidden = false;
  }
  function hideStatus() { status.hidden = true; status.textContent = ''; }

  /* ── Estado de carregamento do botão ── */
  function setLoading(loading) {
    isSending = loading;
    submitBtn.disabled = loading;
    form.setAttribute('aria-busy', String(loading));
    btnLabel.textContent = loading ? 'Enviando...' : 'Enviar mensagem';
    const icon = submitBtn.querySelector('svg');
    if (icon) {
      icon.outerHTML = loading
        ? '<svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-dasharray="40" stroke-dashoffset="12" stroke-linecap="round"/></svg>'
        : originalIcon;
    }
  }

  /* ── Diagnóstico para o proprietário ──────────────────────────
     Só aparece quando o site é aberto localmente (arquivo, localhost
     ou 127.0.0.1). No site publicado, o visitante vê apenas a
     mensagem amigável; o motivo técnico fica no console (F12).     */
  function diagnostico(err, timedOut) {
    const local = location.protocol === 'file:' ||
                  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    const msg = String((err && err.message) || '');
    console.warn('[Formulário] Motivo da falha:', msg || err);
    if (!local) return '';

    let causa;
    if (location.protocol === 'file:') {
      causa = 'O site foi aberto direto do arquivo (endereço começando com <code>file://</code>). ' +
              'O serviço de e-mail recusa envios assim. Abra pelo <strong>Live Server</strong> do VS Code ' +
              '(endereço <code>http://127.0.0.1:5500</code>) ou teste no site publicado.';
    } else if (/activat/i.test(msg)) {
      causa = 'O formulário ainda <strong>não foi ativado</strong> no FormSubmit. Abra a caixa de entrada ' +
              '(e a pasta Spam) do e-mail configurado e clique em <strong>Activate Form</strong>; depois envie novamente.';
    } else if (/web server|html files|localhost/i.test(msg)) {
      causa = 'O FormSubmit não aceita envios a partir deste endereço local. Teste no site publicado (com http/https e domínio).';
    } else if (timedOut || /failed to fetch|networkerror|load failed/i.test(msg)) {
      causa = 'Não houve resposta do serviço. Verifique a internet e se algum bloqueador de anúncios/antivírus ' +
              'está bloqueando <code>formsubmit.co</code>.';
    } else {
      causa = `Resposta do serviço: <code>${msg.replace(/[<>&]/g, '')}</code>`;
    }
    return `<br><br><small><strong>Diagnóstico (visível só em teste local):</strong> ${causa}</small>`;
  }

  /* ── Envio ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSending) return;   // trava contra duplo clique / duplo Enter

    attempted = true;
    hideStatus();

    const results = REQUIRED.map(validateField);
    if (results.includes(false)) {
      const emailOnly = results.filter(r => !r).length === 1 && fields.email.getAttribute('aria-invalid') === 'true' && fields.email.value.trim();
      showStatus('error', emailOnly
        ? 'O e-mail informado é inválido. Corrija-o e tente novamente.'
        : 'Preencha os campos obrigatórios destacados antes de enviar.');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const payload = {
      nome:      fields.nome.value.trim(),
      email:     fields.email.value.trim(),
      telefone:  fields.telefone ? (fields.telefone.value.trim() || 'Não informado') : 'Não informado',
      assunto:   fields.assunto.value.trim(),
      mensagem:  fields.mensagem.value.trim(),
      // Campos de controle reconhecidos pelo FormSubmit/Formspree
      _subject:  `${FORM_CONFIG.subjectPrefix} ${fields.assunto.value.trim()}`,
      _replyto:  fields.email.value.trim(),
      _template: 'table',
      _captcha:  'false',
      _honey:    fields.honey ? fields.honey.value : ''
    };

    setLoading(true);
    showStatus('info', 'Enviando sua mensagem...');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FORM_CONFIG.timeoutMs);

    try {
      const response = await fetch(FORM_CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      let data = {};
      try { data = await response.json(); } catch (_) { /* resposta sem JSON */ }

      // Só considera sucesso quando o serviço CONFIRMA o recebimento
      const confirmed = response.ok && (
        data.success === true || data.success === 'true' ||  // FormSubmit
        data.ok === true                                      // Formspree
      );

      if (!confirmed) {
        // Ex.: formulário do FormSubmit ainda não ativado pelo proprietário
        console.warn('[Formulário] Envio não confirmado pelo serviço:', response.status, data);
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      form.reset();
      attempted = false;
      REQUIRED.forEach(name => fields[name] && setFieldError(fields[name], ''));
      showStatus('success', '<strong>Mensagem enviada com sucesso!</strong> Obrigado pelo contato. Responderemos pelo e-mail informado assim que possível.');

    } catch (err) {
      const timedOut = err && err.name === 'AbortError';
      showStatus('error',
        (timedOut
          ? '<strong>O envio demorou mais do que o esperado.</strong> '
          : '<strong>Não foi possível enviar sua mensagem.</strong> ') +
        'Seus dados foram mantidos no formulário. Verifique sua conexão e tente novamente em instantes ' +
        `ou fale conosco pelo <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.` +
        diagnostico(err, timedOut)
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  });
})();


/* ================================================================
   6. ANIMAÇÕES DE ENTRADA
   ================================================================ */
(function initScrollAnimations() {
  if (REDUCED_MOTION) return;
  const selector = '.service-card, .pacote-card, .step, .diff-list li, .faq-item, .ci-block';
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in');
    // Ao terminar a animação, remove as classes para devolver ao elemento
    // seus efeitos normais de hover (que também usam transform)
    el.addEventListener('transitionend', function done(ev) {
      if (ev.propertyName === 'opacity' && el.classList.contains('visible')) {
        el.classList.remove('fade-in', 'visible');
        el.removeEventListener('transitionend', done);
      }
    });
  });
  observeElements(selector, 'visible', { threshold: 0.1 });
})();


/* ================================================================
   7. BOTÃO VOLTAR AO TOPO
   (toggleBackToTop é chamada pelo handler de rolagem do header)
   ================================================================ */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const shouldShow = window.scrollY > 500;
  if (shouldShow && !btn.classList.contains('visible')) {
    btn.hidden = false;
    requestAnimationFrame(() => btn.classList.add('visible'));
  } else if (!shouldShow && btn.classList.contains('visible')) {
    btn.classList.remove('visible');
    setTimeout(() => { if (!btn.classList.contains('visible')) btn.hidden = true; }, 300);
  }
}

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });
})();


/* ================================================================
   8. ANO DO RODAPÉ
   ================================================================ */
(function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   9. ROLAGEM SUAVE para links âncora (compensa o header fixo)
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      history.replaceState(null, '', href);
    });
  });
})();
