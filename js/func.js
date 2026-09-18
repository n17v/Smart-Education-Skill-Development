/**
 * SkillBridge AI - Core Client Interactivity & Supabase Auth Manager
 * Handles Anime.js logo animation, floating inputs, tab pill transitions,
 * view switching, bottom toast notifications, and Supabase auth workflows.
 */

// Supabase Configuration
// Replace with your project variables for production
const SUPABASE_URL = window.ENV_SUPABASE_URL || 'https://bvnwaicdzfshnmrwxguw.supabase.co/rest/v1/profiles';
const SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || 'demo-anon-key-skillbridge';

let supabaseClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase initialization running in demonstrative offline mode.', e);
}

function animateSproutLogo(svgSelector) {
  const root = document.querySelector(svgSelector);
  if (!root || typeof anime === 'undefined') return;

  const stem = root.querySelector('#stem') || root.querySelector('.stem');
  const leafLeft = root.querySelector('#leaf-left') || root.querySelector('.leaf-left');
  const leafRight = root.querySelector('#leaf-right') || root.querySelector('.leaf-right');

  if (!stem || !leafLeft || !leafRight) return;

  // Prepare initial states
  const stemLength = stem.getTotalLength ? stem.getTotalLength() : 40;
  stem.style.strokeDasharray = stemLength;
  stem.style.strokeDashoffset = stemLength;
  leafLeft.style.transform = 'scale(0)';
  leafRight.style.transform = 'scale(0)';

  const tl = anime.timeline({
    easing: 'easeOutExpo',
  });

  // Step 1: Draw stem in 900ms
  tl.add({
    targets: stem,
    strokeDashoffset: [stemLength, 0],
    duration: 900,
    easing: 'easeOutExpo',
  })
  // Step 2: Pop out leaves with springy bounce (easeOutBack)
  .add({
    targets: [leafLeft, leafRight],
    scale: [0, 1],
    delay: anime.stagger(140),
    duration: 650,
    easing: 'easeOutBack(2)',
  }, '-=300');
}

function initFloatingLabels() {
  const fields = document.querySelectorAll('.field');

  fields.forEach((field) => {
    const input = field.querySelector('input');
    if (!input) return;

    const checkValue = () => {
      if (input.value && input.value.trim().length > 0) {
        field.classList.add('is-floating');
      } else {
        field.classList.remove('is-floating');
      }
    };

    input.addEventListener('focus', () => field.classList.add('is-floating'));
    input.addEventListener('blur', checkValue);
    input.addEventListener('input', checkValue);
    input.addEventListener('change', checkValue);

    // Initial check (for browser autofill)
    setTimeout(checkValue, 100);
  });
}

let toastTimeout = null;

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMessage || !toastIcon) return;

  clearTimeout(toastTimeout);

  // Background colors: info: #0f172a, success: #059669, error: #dc2626
  let bgClass = 'bg-[#0f172a]';
  let iconSvg = `
    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;

  if (type === 'success') {
    bgClass = 'bg-[#059669]';
    iconSvg = `
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>`;
  } else if (type === 'error') {
    bgClass = 'bg-[#dc2626]';
    iconSvg = `
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
  }

  // Set classes
  toast.className = `flex items-center gap-2.5 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-all duration-350 ease-[cubic-bezier(.2,.8,.2,1)] ${bgClass}`;
  toastIcon.innerHTML = iconSvg;
  toastMessage.textContent = message;

  // Slide up
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  toastContainer.classList.remove('pointer-events-none');

  // Dismiss after 3.2s
  toastTimeout = setTimeout(() => {
    toast.style.transform = 'translateY(12px)';
    toast.style.opacity = '0';
    toastContainer.classList.add('pointer-events-none');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 350);
  }, 3200);

  toast.classList.remove('hidden');
  toast.classList.add('flex');
}

const views = {
  login: document.getElementById('view-login'),
  register: document.getElementById('view-register'),
  forgot: document.getElementById('view-forgot'),
  reset: document.getElementById('view-reset'),
};

const tabSwitcher = document.getElementById('tab-switcher');
const pillIndicator = document.getElementById('pill-indicator');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

function switchView(targetViewKey) {
  Object.keys(views).forEach((key) => {
    const el = views[key];
    if (!el) return;
    el.classList.remove('is-active');
    el.classList.add('hidden');
  });

  const activeView = views[targetViewKey];
  if (!activeView) return;

  // Reflow to re-trigger smooth keyframe
  activeView.classList.remove('hidden');
  void activeView.offsetWidth;
  activeView.classList.add('is-active');

  // Pill tab appearance & indicator translation
  if (targetViewKey === 'login' || targetViewKey === 'register') {
    tabSwitcher.classList.remove('hidden');
    if (targetViewKey === 'login') {
      pillIndicator.style.transform = 'translateX(0%)';
      tabLogin.classList.add('text-brand-700');
      tabLogin.classList.remove('text-slate-500');
      tabRegister.classList.add('text-slate-500');
      tabRegister.classList.remove('text-brand-700');
    } else {
      pillIndicator.style.transform = 'translateX(100%)';
      tabRegister.classList.add('text-brand-700');
      tabRegister.classList.remove('text-slate-500');
      tabLogin.classList.add('text-slate-500');
      tabLogin.classList.remove('text-brand-700');
    }
  } else {
    // Hide tabs on forgot/reset screens
    tabSwitcher.classList.add('hidden');
  }

  // Auto-focus first input after 60ms
  setTimeout(() => {
    const firstInput = activeView.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 60);
}

function setButtonLoading(form, isLoading) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;

  const content = button.querySelector('.btn-content');
  const spinner = button.querySelector('.btn-spinner');

  button.disabled = isLoading;

  if (isLoading) {
    if (content) content.classList.add('hidden');
    if (spinner) {
      spinner.classList.remove('hidden');
      spinner.classList.add('inline-flex');
    }
  } else {
    if (content) content.classList.remove('hidden');
    if (spinner) {
      spinner.classList.add('hidden');
      spinner.classList.remove('inline-flex');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialise Logo Draw In
  animateSproutLogo('#desktop-logo');
  animateSproutLogo('#mobile-logo');

  // 2. Initialise Input Floats
  initFloatingLabels();

  // 3. Tab switch listeners
  tabLogin.addEventListener('click', () => switchView('login'));
  tabRegister.addEventListener('click', () => switchView('register'));

  // 4. "Forgot Password" link and Back buttons
  const btnToForgot = document.getElementById('btn-to-forgot');
  if (btnToForgot) {
    btnToForgot.addEventListener('click', () => switchView('forgot'));
  }

  document.querySelectorAll('.btn-back').forEach((btn) => {
    btn.addEventListener('click', () => switchView('login'));
  });

  // 5. Handle Login Form Submit
  const formLogin = document.getElementById('form-login');
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setButtonLoading(formLogin, true);

    try {
      if (supabaseClient && SUPABASE_URL.indexOf('demo-project') === -1) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        showToast('Signed in successfully! Redirecting...', 'success');
      } else {
        // High fidelity simulated authentication
        await new Promise((res) => setTimeout(res, 950));
        showToast('Welcome back! Signed in to SkillBridge AI.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to sign in. Please verify credentials.', 'error');
    } finally {
      setButtonLoading(formLogin, false);
    }
  });

  // 6. Handle Register Form Submit
  const formRegister = document.getElementById('form-register');
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
      showToast('Please complete all fields.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }

    setButtonLoading(formRegister, true);

    try {
      if (supabaseClient && SUPABASE_URL.indexOf('demo-project') === -1) {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        showToast('Account created! Please check your email to confirm.', 'success');
      } else {
        // High fidelity simulated registration
        await new Promise((res) => setTimeout(res, 1000));
        showToast('Account created! Check your email to verify.', 'success');
        setTimeout(() => switchView('login'), 1200);
      }
    } catch (err) {
      showToast(err.message || 'Unable to register account.', 'error');
    } finally {
      setButtonLoading(formRegister, false);
    }
  });

  // 7. Handle Forgot Password Form Submit
  const formForgot = document.getElementById('form-forgot');
  formForgot.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();

    if (!email) {
      showToast('Please provide your email address.', 'error');
      return;
    }

    setButtonLoading(formForgot, true);

    try {
      if (supabaseClient && SUPABASE_URL.indexOf('demo-project') === -1) {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
        showToast('Password reset link dispatched to your email!', 'success');
      } else {
        await new Promise((res) => setTimeout(res, 900));
        showToast('Password reset link sent! Check your inbox.', 'success');
        setTimeout(() => switchView('login'), 1600);
      }
    } catch (err) {
      showToast(err.message || 'Could not send recovery email.', 'error');
    } finally {
      setButtonLoading(formForgot, false);
    }
  });

  // 8. Handle Password Update / Reset Form Submit
  const formReset = document.getElementById('form-reset');
  formReset.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPass = document.getElementById('reset-password').value;
    const confirmPass = document.getElementById('reset-confirm').value;

    if (!newPass || !confirmPass) {
      showToast('Please enter and confirm your new password.', 'error');
      return;
    }
    if (newPass.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('Passwords do not match. Please re-check.', 'error');
      return;
    }

    setButtonLoading(formReset, true);

    try {
      if (supabaseClient && SUPABASE_URL.indexOf('demo-project') === -1) {
        const { error } = await supabaseClient.auth.updateUser({ password: newPass });
        if (error) throw error;
        showToast('Password updated successfully! Please log in.', 'success');
        setTimeout(() => switchView('login'), 1200);
      } else {
        await new Promise((res) => setTimeout(res, 950));
        showToast('Password updated successfully!', 'success');
        setTimeout(() => switchView('login'), 1200);
      }
    } catch (err) {
      showToast(err.message || 'Unable to update password.', 'error');
    } finally {
      setButtonLoading(formReset, false);
    }
  });

  // 9. Supabase Auth State Change Listener (Auto-switch to view-reset on recovery event)
  if (supabaseClient) {
    try {
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          switchView('reset');
          showToast('Please set your new password.', 'info');
        }
      });
    } catch (err) {
      console.warn('Supabase auth state listener skipped:', err);
    }
  }

  // Check URL hash for type=recovery (Direct Supabase recovery link fallback)
  if (window.location.hash && window.location.hash.includes('type=recovery')) {
    switchView('reset');
  }
});
