/**
 * SkillBridge AI - Functional & Auth Logic (js/func.js)
 * TECHNEXA 2026 Hackathon
 */

// 1. Supabase Initialization
const SUPABASE_URL = 'https://bvnwaicdzfshnmrwxguw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ctl7qUMdyhyCEXZKRbXoeg_8sd4uAuH';

let supabaseClient = null;
if (window.supabase && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase JS library not loaded.');
}

// 2. DOM Elements Cache
const elements = {
  tabSwitcher: document.getElementById('tab-switcher'),
  tabIndicator: document.getElementById('tab-indicator'),
  tabLogin: document.getElementById('tab-login'),
  tabRegister: document.getElementById('tab-register'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),
  views: {
    login: document.getElementById('view-login'),
    register: document.getElementById('view-register'),
    forgot: document.getElementById('view-forgot'),
    reset: document.getElementById('view-reset')
  },
  forms: {
    login: document.getElementById('form-login'),
    register: document.getElementById('form-register'),
    forgot: document.getElementById('form-forgot'),
    reset: document.getElementById('form-reset')
  }
};

let toastTimeout = null;

// 3. Toast Notifications Engine
function showToast(message, type = 'info') {
  if (!elements.toast || !elements.toastMessage) return;

  clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;

  // Background colors: info (#0f172a), success (#059669), error (#dc2626)
  elements.toast.className =
    'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg pointer-events-none transition-all duration-300';

  if (type === 'success') {
    elements.toast.style.backgroundColor = '#059669';
  } else if (type === 'error') {
    elements.toast.style.backgroundColor = '#dc2626';
  } else {
    elements.toast.style.backgroundColor = '#0f172a';
  }

  // Animate in
  requestAnimationFrame(() => {
    elements.toast.classList.remove('opacity-0', 'translate-y-8');
    elements.toast.classList.add('opacity-100', 'translate-y-0');
  });

  // Auto hide after 3.2s
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove('opacity-100', 'translate-y-0');
    elements.toast.classList.add('opacity-0', 'translate-y-8');
  }, 3200);
}

// 4. View Switcher with Forced Reflow & Auto-focus
function switchView(viewName) {
  Object.entries(elements.views).forEach(([name, el]) => {
    if (!el) return;
    if (name === viewName) {
      el.classList.remove('hidden');
      // Trigger reflow to restart fadeUp CSS animation
      void el.offsetWidth;
      el.classList.add('is-active');

      // Auto-focus first input after 60ms
      setTimeout(() => {
        const firstInput = el.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
      }, 60);
    } else {
      el.classList.add('hidden');
      el.classList.remove('is-active');
    }
  });

  // Update tab switcher visibility and position
  if (elements.tabSwitcher) {
    if (viewName === 'login' || viewName === 'register') {
      elements.tabSwitcher.classList.remove('hidden');
      updateTabPill(viewName);
    } else {
      elements.tabSwitcher.classList.add('hidden');
    }
  }
}

// 5. Sliding Tab Pill Controller
function updateTabPill(activeTab) {
  if (!elements.tabIndicator || !elements.tabLogin || !elements.tabRegister) return;

  if (activeTab === 'login') {
    elements.tabIndicator.style.transform = 'translateX(0%)';
    elements.tabLogin.classList.add('text-brand-700');
    elements.tabLogin.classList.remove('text-slate-500');
    elements.tabRegister.classList.remove('text-brand-700');
    elements.tabRegister.classList.add('text-slate-500');
  } else if (activeTab === 'register') {
    elements.tabIndicator.style.transform = 'translateX(100%)';
    elements.tabRegister.classList.add('text-brand-700');
    elements.tabRegister.classList.remove('text-slate-500');
    elements.tabLogin.classList.remove('text-brand-700');
    elements.tabLogin.classList.add('text-slate-500');
  }
}

// 6. Floating Label State Controller
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

// 7. Button Loading State Helper
function setButtonLoading(button, isLoading, defaultText = '') {
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
    if (original) {
      button.innerHTML = original;
    } else if (defaultText) {
      button.textContent = defaultText;
    }
  }
}

// 8. Anime.js Logo Vector Animation
function runLogoAnimation() {
  if (typeof anime === 'undefined') return;

  const stem = document.querySelectorAll('.logo-stem');
  const leaves = document.querySelectorAll('.logo-leaf');

  if (!stem.length && !leaves.length) return;

  const timeline = anime.timeline({
    easing: 'easeOutExpo'
  });

  timeline
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

// 9. Auth Actions via Supabase
async function handleLogin(e) {
  e.preventDefault();
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
  } catch (err) {
    showToast(err.message || 'Failed to log in. Please check your credentials.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const fullName = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  setButtonLoading(submitBtn, true);

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    showToast('Account created! Check your email to confirm registration.', 'success');
    form.reset();
    initFloatingLabels();
    setTimeout(() => switchView('login'), 1500);
  } catch (err) {
    showToast(err.message || 'Failed to create account.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
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

    showToast('Password updated successfully! Please log in.', 'success');
    form.reset();
    initFloatingLabels();
    setTimeout(() => switchView('login'), 1200);
  } catch (err) {
    showToast(err.message || 'Failed to update password.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// 10. Initialization & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initFloatingLabels();
  runLogoAnimation();

  // Tab switcher click handlers
  if (elements.tabLogin) {
    elements.tabLogin.addEventListener('click', () => switchView('login'));
  }
  if (elements.tabRegister) {
    elements.tabRegister.addEventListener('click', () => switchView('register'));
  }

  // Navigation triggers
  const toForgotBtn = document.getElementById('to-forgot');
  if (toForgotBtn) {
    toForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot');
    });
  }

  const backToLoginButtons = document.querySelectorAll('.back-to-login');
  backToLoginButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('login');
    });
  });

  // Form submission bindings
  if (elements.forms.login) elements.forms.login.addEventListener('submit', handleLogin);
  if (elements.forms.register) elements.forms.register.addEventListener('submit', handleRegister);
  if (elements.forms.forgot) elements.forms.forgot.addEventListener('submit', handleForgotPassword);
  if (elements.forms.reset) elements.forms.reset.addEventListener('submit', handleResetPassword);

  // Supabase Auth State Change Listener (Catches PASSWORD_RECOVERY email links)
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        switchView('reset');
        showToast('Please enter your new password.', 'info');
      }
    });
  }
});
