/* ============================================================
   YSIS CLOSET — JavaScript
   Funcionalidades: Navbar, Scroll Animations, Favoritos,
                    Depoimentos, Newsletter, Back to Top
   ============================================================ */

'use strict';

// ===== UTILITIES =====
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===== NAVBAR: Scroll + Mobile Toggle + Theme + Progress =====
(function initNavbar() {
  const navbar      = qs('#navbar');
  const toggle      = qs('#menu-toggle');
  const navMenu     = qs('#nav-menu');
  const navLinks    = qsa('.navbar__link');
  const themeToggle = qs('#theme-toggle');
  const scrollBar   = qs('#scroll-bar');

  // Scroll effect & Progress Bar
  const onScroll = () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    qs('#back-to-top').classList.toggle('visible', scrollY > 400);

    // Progress Bar Logic
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollBar) scrollBar.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Theme Toggle Logic
  const setTheme = (theme) => {
    document.body.className = theme + '-theme';
    localStorage.setItem('ysis-theme', theme);
    const icon = qs('#theme-icon');
    if (icon) icon.src = theme === 'dark' ? 'img/icon-sun.png' : 'img/icon-moon.png';
  };

  const currentTheme = localStorage.getItem('ysis-theme') || 'light';
  setTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
  });
})();

// ===== BACK TO TOP =====
(function initBackToTop() {
  const btn = qs('#back-to-top');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== REVEAL ON SCROLL (Intersection Observer) =====
(function initReveal() {
  const items = qsa('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

// ===== FAVORITOS =====
(function initFavorites() {
  const favBtns = qsa('.prod-card__fav');
  favBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = btn.classList.toggle('active');
      btn.textContent = isActive ? '♥' : '♡';
      btn.setAttribute('aria-pressed', isActive);

      // Micro feedback animation
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });
})();

// ===== DETALHE DOS PRODUTOS MODAL =====
(function initProductButtons() {
  const products = [
    {
      id: 'btn-prod-1',
      name: 'Vestido Midi Encanto',
      price: 'R$ 329,90',
      desc: 'Vestido midi com caimento fluido, ideal para ocasiões especiais e encontros românticos. Disponível em preto e vinho.',
    },
    {
      id: 'btn-prod-2',
      name: 'Conjunto Rouge Luxo',
      price: 'R$ 549,90',
      desc: 'Conjunto de blazer e calça em vermelho vibrante. Elegância que se destaca em qualquer ambiente corporativo ou social.',
    },
    {
      id: 'btn-prod-3',
      name: 'Blusa Seda Premium',
      price: 'R$ 189,90',
      desc: 'Blusa em tecido acetinado com toque de seda. Confortável, sofisticada e versátil para qualquer composição.',
    },
    {
      id: 'btn-prod-4',
      name: 'Calça Alfaiataria Supreme',
      price: 'R$ 399,90',
      desc: 'Calça de alfaiataria com corte reto e cintura alta. Uma peça-chave para um guarda-roupa atemporal.',
    },
  ];

  products.forEach(({ id, name, price, desc }) => {
    const btn = qs(`#${id}`);
    if (!btn) return;
    btn.addEventListener('click', () => showModal({ name, price, desc }));
  });
})();

// ===== MODAL CUSTOMIZADO =====
function showModal({ name, price, desc }) {
  // Remove modal anterior se existir
  const existing = qs('#product-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'product-modal';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', `Detalhes: ${name}`);
  backdrop.innerHTML = `
    <div class="modal" id="modal-inner">
      <button class="modal__close" id="modal-close" aria-label="Fechar">✕</button>
      <div class="modal__tag">Ysis Closet</div>
      <h3 class="modal__title">${name}</h3>
      <p class="modal__price">${price}</p>
      <p class="modal__desc">${desc}</p>
      <div class="modal__sizes" aria-label="Tamanhos disponíveis">
        <span>P</span><span>M</span><span>G</span><span>GG</span>
      </div>
      <button class="btn btn--primary modal__cta" id="modal-cta-btn">Tenho Interesse</button>
    </div>
  `;

  // Estilos inline do modal
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
    padding: '1rem',
    animation: 'fadeIn 0.25s ease',
  });

  const modalEl = backdrop.querySelector('.modal');
  Object.assign(modalEl.style, {
    background: '#161616',
    border: '1px solid rgba(192,57,43,0.3)',
    borderRadius: '20px',
    padding: '2.5rem',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    animation: 'slideUp 0.3s cubic-bezier(0,0,0.2,1)',
  });

  // Injetar keyframes se não existir
  if (!qs('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
      .modal__close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%;
        background:rgba(255,255,255,0.08); color:#fff; font-size:0.9rem; display:flex; align-items:center;
        justify-content:center; cursor:pointer; border:none; transition:background 0.25s; }
      .modal__close:hover { background: var(--red,#c0392b); }
      .modal__tag { font-size:0.65rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase;
        color:#e74c3c; margin-bottom:0.5rem; }
      .modal__title { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:600;
        color:#fff; margin-bottom:0.4rem; }
      .modal__price { font-size:1.4rem; font-weight:600; color:#fff; margin-bottom:1rem; }
      .modal__desc { font-size:0.88rem; color:#9a9a9a; line-height:1.7; margin-bottom:1.5rem; }
      .modal__sizes { display:flex; gap:0.5rem; margin-bottom:1.5rem; }
      .modal__sizes span { width:40px; height:40px; display:flex; align-items:center; justify-content:center;
        border:1px solid rgba(255,255,255,0.15); border-radius:4px; font-size:0.78rem; font-weight:600;
        color:#fff; cursor:pointer; transition:all 0.25s; }
      .modal__sizes span:hover, .modal__sizes span.selected { background:#c0392b; border-color:#c0392b; }
      .modal__cta { width:100%; justify-content:center; margin-top:0; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  // Seleção de tamanho
  backdrop.querySelectorAll('.modal__sizes span').forEach(sz => {
    sz.addEventListener('click', () => {
      backdrop.querySelectorAll('.modal__sizes span').forEach(s => s.classList.remove('selected'));
      sz.classList.add('selected');
    });
  });

  // Fecha modal
  const closeModal = () => {
    backdrop.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => {
      backdrop.remove();
      document.body.style.overflow = '';
    }, 180);
  };

  qs('#modal-close', backdrop).addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onEsc); }
  });

  // CTA do modal redireciona para contato
  qs('#modal-cta-btn', backdrop).addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      qs('#contato').scrollIntoView({ behavior: 'smooth' });
    }, 250);
  });

  // Focus trap
  qs('#modal-close', backdrop).focus();
}

// ===== DEPOIMENTOS: Dots (mobile hint) =====
(function initTestimonialDots() {
  const dots = qsa('.dot');
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => { d.classList.remove('dot--active'); d.setAttribute('aria-selected', 'false'); });
      dot.classList.add('dot--active');
      dot.setAttribute('aria-selected', 'true');
    });
  });
})();

// ===== FORMULÁRIO NEWSLETTER =====
(function initNewsletterForm() {
  const form    = qs('#newsletter-form');
  const success = qs('#form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome  = qs('#input-nome').value.trim();
    const email = qs('#input-email').value.trim();

    if (!nome || !email) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(form);
      qs('#input-email').focus();
      return;
    }

    // Simula envio
    const btn = qs('#form-submit');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.hidden = false;
      success.style.animation = 'slideUp 0.4s ease';
    }, 900);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    // inject shake keyframe
    if (!qs('#shake-style')) {
      const s = document.createElement('style');
      s.id = 'shake-style';
      s.textContent = `@keyframes shake {
        0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)}
        60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }`;
      document.head.appendChild(s);
    }
  }
})();

// ===== SMOOTH ANCHOR SCROLL =====
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = qs(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

// ===== HERO BACKGROUND PARALLAX (sutil) =====
(function initParallax() {
  const hero = qs('.hero');
  if (!hero) return;

  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    // Movimentação sutil do background para profundidade
    hero.style.setProperty('--bg-x', `${dx * 15}px`);
    hero.style.setProperty('--bg-y', `${dy * 15}px`);
  });
})();

// ===== CONTADOR ANIMADO (Sobre) =====
(function initCounters() {
  const stats = qsa('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      if (!raw) return;
      const target = parseInt(raw, 10);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.ceil(target / 50);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(interval);
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();

// ===== INIT LOG =====
console.log('%c✦ Ysis Closet', 'color:#e74c3c;font-size:1.5rem;font-weight:bold;font-family:serif');
console.log('%cSite carregado com sucesso.', 'color:#9a9a9a;font-size:0.8rem');
