/* =========================================================
   Injected minimal styles (floating labels + button + spinner)
   Only things Tailwind can't do cleanly. No external CSS file.
   ========================================================= */
(function injectStyles() {
  const css = `
    /* --- Floating label fields --- */
    .field { position: relative; }
    .field input {
      width: 100%;
      padding: 22px 16px 8px;
      font-size: 14px;
      line-height: 1.2;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      color: #0f172a;
      transition: border-color .2s, box-shadow .2s;
    }
    .field input:hover { border-color: #cbd5e1; }
    .field input:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 4px rgba(16,185,129,.12);
    }
    .field label {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #94a3b8;
      pointer-events: none;
      transition: top .18s ease, transform .18s ease, font-size .18s ease, color .18s ease;
    }
    .field input:focus + label,
    .field input:not(:placeholder-shown) + label {
      top: 11px;
      transform: translateY(0) scale(.85);
      transform-origin: left center;
      color: #059669;
    }
    .field input:not(:focus):not(:placeholder-shown) + label { color: #64748b; }

    /* --- Primary button (no shimmer, no black dot) --- */
    .btn-primary {
      position: relative;
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 6px 20px -6px rgba(16,185,129,.5);
      transition: transform .15s ease, box-shadow .25s ease, filter .2s ease, opacity .2s ease;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 28px -8px rgba(16,185,129,.6);
      filter: brightness(1.03);
    }
    .btn-primary:active:not(:disabled) { transform: translateY(0); }
    .btn-primary:disabled { opacity: .75; cursor: not-allowed; }

    /* --- SVG leaf animation origin --- */
    #leafL, #leafR { transform-box: fill-box; transform-origin: 50% 50%; }

    /* --- View fade in on switch --- */
    @keyframes viewFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .auth-view.is-active { animation: viewFadeIn .32s ease both; }
  `;
  const tag = document.createElement('style');
  tag.id = 'sb-injected-styles';
  tag.textContent = css;
  document.head.appendChild(tag);
})();

/* =========================================================
   Logo animation (anime.js)
   ========================================================= */
window.addEventListener('load', () => {
  if (typeof anime === 'undefined') return;
  const stem = document.getElementById('stem');
  const leafL = document.getElementById('leafL');
  const leafR = document.getElementById('leafR');
  if (!stem || !leafL || !leafR) return;

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: stem,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 900
    })
    .add({
      targets: [leafL, leafR],
      scale: [0, 1],
      opacity: [0, 1],
      duration: 700,
      easing: 'easeOutBack'
    }, '-=500');
});

/* =========================================================
   Tabs + view switching
   ========================================================= */
const _tabs = document.querySelectorAll('.tab-btn');
const _pill = document.getElementById('tabPill');
const _tabBar = document.getElementById('tabs');

function _setActiveTab(name) {
  _tabs.forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle('text-brand-700', active);
    t.classList.toggle('text-slate-500', !active);
  });
  _pill.style.transform = name === 'register' ? 'translateX(calc(100% + 8px))' : 'translateX(0)';
}

_tabs.forEach(t => t.addEventListener('click', () => showView(t.dataset.tab)));

function showView(name) {
  document.querySelectorAll('.auth-view').forEach(v => {
    v.classList.add('hidden');
    v.classList.remove('is-active');
  });

  const el = document.getElementById('view-' + name);
  if (!el) return;

  el.classList.remove('hidden');
  // retrigger animation
  void el.offsetWidth;
  el.classList.add('is-active');

  if (name === 'login' || name === 'register') {
    _tabBar.style.display = 'inline-flex';
    _setActiveTab(name);
  } else {
    _tabBar.style.display = 'none';
  }

  // focus first input for nicety
  const first = el.querySelector('input');
  if (first) setTimeout(() => first.focus(), 60);
}

/* =========================================================
   Toast
   ========================================================= */
function toast(msg, type = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;

  const colors = {
    info:    'background:#0f172a',
    success: 'background:#059669',
    error:   'background:#dc2626'
  };
  t.style.cssText = `
    position:fixed; left:50%; bottom:24px; z-index:50;
    padding:12px 20px; border-radius:9999px;
    font-size:13px; font-weight:500; color:#fff;
    box-shadow:0 12px 30px -8px rgba(0,0,0,.3);
    transition:transform .35s cubic-bezier(.2,.8,.2,1), opacity .25s ease;
    max-width:90vw; text-align:center; pointer-events:none;
    transform:translate(-50%, 200%); opacity:0;
    ${colors[type] || colors.info};
  `;

  void t.offsetWidth;
  t.style.transform = 'translate(-50%, 0)';
  t.style.opacity = '1';

  clearTimeout(t._tid);
  t._tid = setTimeout(() => {
    t.style.transform = 'translate(-50%, 200%)';
    t.style.opacity = '0';
  }, 3200);
}

/* =========================================================
   Init
   ========================================================= */
showView('login');
