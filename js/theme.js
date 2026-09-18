// ---- Logo draw animation (anime.js) ----
window.addEventListener('load', () => {
  if (typeof anime === 'undefined') return;
  anime.timeline({ easing: 'easeOutExpo' })
    .add({ targets: '#stem', strokeDashoffset: [anime.setDashoffset, 0], duration: 900 })
    .add({
      targets: '#leafL, #leafR',
      scale: [0, 1], opacity: [0, 1],
      transformOrigin: '50% 50%',
      duration: 700, easing: 'easeOutBack'
    }, '-=500');
});

// ---- Tabs + view switching ----
const tabs = document.querySelectorAll('.tab-btn');
const pill = document.getElementById('tabPill');
const tabBar = document.getElementById('tabs');

function setActiveTab(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  pill.style.transform = name === 'login' ? 'translateX(0)' : 'translateX(100%)';
}

tabs.forEach(t => t.addEventListener('click', () => showView(t.dataset.tab)));

function showView(name) {
  document.querySelectorAll('.auth-view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-' + name);
  if (!el) return;
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = '';

  if (name === 'login' || name === 'register') {
    tabBar.style.display = 'inline-flex';
    setActiveTab(name);
  } else {
    tabBar.style.display = 'none';
  }
}

// ---- Toast helper ----
function toast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3200);
}
