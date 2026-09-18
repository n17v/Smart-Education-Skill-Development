// ===== SUPABASE CLIENT =====
const SUPABASE_URL = 'https://bvnwaicdzfshnmrwxguw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ctl7qUMdyhyCEXZKRbXoeg_8sd4uAuH'; // <-- from Supabase Settings → API
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== LOADING HELPER =====
function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn._html = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span><span>Please wait…</span>';
  } else if (btn._html) {
    btn.innerHTML = btn._html;
  }
}

// ===== LOGIN =====
async function handleLogin(btn) {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) return toast('Please fill in all fields', 'error');

  setLoading(btn, true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setLoading(btn, false);

  if (error) return toast(error.message, 'error');
  toast('Welcome back!', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 700);
}

// ===== REGISTER =====
async function handleRegister(btn) {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  if (!name || !email || !password) return toast('Please fill in all fields', 'error');
  if (password.length < 6) return toast('Password must be at least 6 characters', 'error');

  setLoading(btn, true);
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  });
  setLoading(btn, false);

  if (error) return toast(error.message, 'error');
  toast('Account created — check your email to verify.', 'success');
}

// ===== FORGOT PASSWORD =====
async function handleForgot(btn) {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) return toast('Enter your email', 'error');

  setLoading(btn, true);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  setLoading(btn, false);

  if (error) return toast(error.message, 'error');
  toast('Reset link sent — check your inbox.', 'success');
  setTimeout(() => showView('login'), 1400);
}

// ===== RESET PASSWORD (after clicking recovery link) =====
async function handleReset(btn) {
  const p1 = document.getElementById('newPassword').value;
  const p2 = document.getElementById('confirmPassword').value;
  if (p1.length < 6) return toast('Password must be at least 6 characters', 'error');
  if (p1 !== p2) return toast('Passwords do not match', 'error');

  setLoading(btn, true);
  const { error } = await supabase.auth.updateUser({ password: p1 });
  setLoading(btn, false);

  if (error) return toast(error.message, 'error');
  toast('Password updated!', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 900);
}

// ===== HANDLE RECOVERY LINK =====
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') showView('reset');
});
