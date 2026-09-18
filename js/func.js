/**
 * SkillBridge AI - Functional & Auth Logic (js/func.js)
 * TECHNEXA 2026 Hackathon
 */

let supabaseClient = null;
const DASHBOARD_URL = '/dashboard.html';

function redirectToDashboard() {
  window.location.href = DASHBOARD_URL;
}

let toastTimeout = null;

// 1. Toast Notifications Engine
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  clearTimeout(toastTimeout);
  toastMessage.textContent = message;

  toast.className =
    'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg pointer-events-none transition-all duration-300';

  if (type === 'success') {
    toast.style.backgroundColor = '#059669';
  } else if (type === 'error') {
    toast.style.backgroundColor = '#dc2626';
  } else {
    toast.style.backgroundColor = '#0f172a';
  }

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-8');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-8');
  }, 3200);
}

// 2. Sliding Tab Pill Controller
function updateTabPill(activeTab) {
  const tabIndicator = document.getElementById('tab-indicator');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (!tabIndicator) return;

  if (activeTab === 'login') {
    tabIndicator.style.transform = 'translateX(0%)';
    if (tabLogin) {
      tabLogin.classList.add('text-brand-700');
      tabLogin.classList.remove('text-slate-500');
    }
    if (tabRegister) {
      tabRegister.classList.remove('text-brand-700');
      tabRegister.classList.add('text-slate-500');
    }
  } else if (activeTab === 'register') {
    tabIndicator.style.transform = 'translateX(100%)';
    if (tabRegister) {
      tabRegister.classList.add('text-brand-700');
      tabRegister.classList.remove('text-slate-500');
    }
    if (tabLogin) {
      tabLogin.classList.remove('text-brand-700');
      tabLogin.classList.add('text-slate-500');
    }
  }
}

// 3. View Switcher
function switchView(viewName) {
  const views = {
    login: document.getElementById('view-login'),
    register: document.getElementById('view-register'),
    forgot: document.getElementById('view-forgot'),
    reset: document.getElementById('view-reset')
  };

  const tabSwitcher = document.getElementById('tab-switcher');

  Object.entries(views).forEach(([name, el]) => {
    if (!el) return;
    if (name === viewName) {
      el.classList.remove('hidden');
      void el.offsetWidth; // Force reflow
      el.classList.add('is-active');

      setTimeout(() => {
        const firstInput = el.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
      }, 60);
    } else {
      el.classList.add('hidden');
      el.classList.remove('is-active');
    }
  });

  if (tabSwitcher) {
    if (viewName === 'login' || viewName === 'register') {
      tabSwitcher.classList.remove('hidden');
      updateTabPill(viewName);
    } else {
      tabSwitcher.classList.add('hidden');
    }
  }
}

// 4. Floating Label State Controller
function initFloatingLabels() {
  const inputs = document.querySelectorAll('.field input');
  inputs.forEach((input) => {
    const checkValue = () => {
      if (input.value && input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    };

    input.addEventListener('input', checkValue);
    input.addEventListener('blur', checkValue);
    input.addEventListener('change', checkValue);
    checkValue();
  });
}

// 5. Button Loading Helper
function setButtonLoading(button, isLoading) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.setAttribute('data-original-html', button.innerHTML);
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Please wait…</span>
    `;
  } else {
    button.disabled = false;
    const original = button.getAttribute('data-original-html');
    if (original) button.innerHTML = original;
  }
}

// 6. Logo Vector Animation (Anime.js)
function runLogoAnimation() {
  if (typeof anime === 'undefined') return;

  const stem = document.querySelectorAll('.logo-stem');
  const leaves = document.querySelectorAll('.logo-leaf');
  if (!stem.length && !leaves.length) return;

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.logo-stem',
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 900,
      easing: 'easeOutExpo'
    })
    .add(
      {
        targets: '.logo-leaf',
        scale: [0, 1],
        opacity: [0, 1],
        transformOrigin: 'bottom center',
        duration: 800,
        easing: 'easeOutBack'
      },
      '-=450'
    );
}

// 7. Auth Handlers
async function handleLogin(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showToast('Initializing connection. Please retry in a moment.', 'info');
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = form.email.value.trim();
  const password = form.password.value;

  setButtonLoading(submitBtn, true);

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    showToast('Signed in successfully! Redirecting…', 'success');
    setTimeout(redirectToDashboard, 800);
  } catch (err) {
    showToast(err.message || 'Failed to log in. Please check your credentials.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showToast('Initializing connection. Please retry in a moment.', 'info');
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const fullName = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  setButtonLoading(submitBtn, true);

  try {
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (authError) throw authError;

    if (authData?.user) {
      await supabaseClient
        .from('profiles')
        .insert([{ id: authData.user.id, full_name: fullName, email: email }])
        .catch(() => {});
    }

    if (authData?.session) {
      showToast('Registration complete! Redirecting…', 'success');
      setTimeout(redirectToDashboard, 800);
    } else {
      showToast('Account created! Please check your email to confirm.', 'success');
      form.reset();
      initFloatingLabels();
      setTimeout(() => switchView('login'), 1500);
    }
  } catch (err) {
    showToast(err.message || 'Failed to create account.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  if (!supabaseClient) return;

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = form.email.value.trim();

  setButtonLoading(submitBtn, true);

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });

    if (error) throw error;
    showToast('Password reset link sent! Check your inbox.', 'success');
  } catch (err) {
    showToast(err.message || 'Unable to send reset email.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleResetPassword(e) {
  e.preventDefault();
  if (!supabaseClient) return;

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const newPassword = form['new-password'].value;
  const confirmPassword = form['confirm-password'].value;

  if (newPassword !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return;
  }

  setButtonLoading(submitBtn, true);

  try {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    showToast('Password updated! Redirecting…', 'success');
    setTimeout(redirectToDashboard, 1000);
  } catch (err) {
    showToast(err.message || 'Failed to update password.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// 8. Dynamic Supabase Init via Netlify Function
async function initSupabaseFromNetlify() {
  try {
    const res = await fetch('/.netlify/functions/config');
    if (res.ok) {
      const cfg = await res.json();
      if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase) {
        supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          redirectToDashboard();
        }

        supabaseClient.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            switchView('reset');
            showToast('Please enter your new password.', 'info');
          } else if (event === 'SIGNED_IN' && session) {
            redirectToDashboard();
          }
        });
      }
    }
  } catch (err) {
    console.warn('Config fetch notice:', err.message);
  }
}

// 9. DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initFloatingLabels();
  runLogoAnimation();
  initSupabaseFromNetlify();

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  if (tabLogin) tabLogin.addEventListener('click', () => switchView('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchView('register'));

  const toForgotBtn = document.getElementById('to-forgot');
  if (toForgotBtn) {
    toForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot');
    });
  }

  document.querySelectorAll('.back-to-login').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('login');
    });
  });

  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formForgot = document.getElementById('form-forgot');
  const formReset = document.getElementById('form-reset');

  if (formLogin) formLogin.addEventListener('submit', handleLogin);
  if (formRegister) formRegister.addEventListener('submit', handleRegister);
  if (formForgot) formForgot.addEventListener('submit', handleForgotPassword);
  if (formReset) formReset.addEventListener('submit', handleResetPassword);
});
