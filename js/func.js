// ---------- SUPABASE ----------
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- MISTRAL ----------
const MISTRAL_API_KEY = "PASTE_YOUR_MISTRAL_KEY_HERE";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

// ---------- AUTH UI ----------
let authMode = "login";

function openModal(mode) {
  authMode = mode;
  document.getElementById("modalTitle").textContent = mode === "login" ? "Log In" : "Register";
  document.getElementById("authBtn").textContent = mode === "login" ? "Log In" : "Register";
  document.getElementById("modalSwitch").innerHTML = mode === "login"
    ? 'No account? <a onclick="toggleModal()">Register</a>'
    : 'Have an account? <a onclick="toggleModal()">Log In</a>';
  document.getElementById("modal").classList.add("active");
}

function toggleModal() {
  openModal(authMode === "login" ? "register" : "login");
}

async function submitAuth() {
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;
  const btn = document.getElementById("authBtn");
  if (!email || !password) return alert("Fill email and password");

  btn.disabled = true;
  btn.textContent = "Please wait...";

  const { data, error } = authMode === "login"
    ? await supabase.auth.signInWithPassword({ email, password })
    : await supabase.auth.signUp({ email, password });

  btn.disabled = false;
  btn.textContent = authMode === "login" ? "Log In" : "Register";

  if (error) return alert(error.message);
  document.getElementById("modal").classList.remove("active");
  updateAuthUI();
}

async function logout() {
  await supabase.auth.signOut();
  updateAuthUI();
}

async function updateAuthUI() {
  const { data: { user } } = await supabase.auth.getUser();
  const authArea = document.getElementById("authArea");
  const userBar = document.getElementById("userBar");

  if (user) {
    authArea.classList.add("hidden");
    userBar.classList.remove("hidden");
    document.getElementById("userEmail").textContent = user.email;
  } else {
    authArea.classList.remove("hidden");
    userBar.classList.add("hidden");
  }
}

// ---------- ANALYZE ----------
async function analyze() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Please log in first.");

  const name = document.getElementById("name").value || "Student";
  const skills = document.getElementById("skills").value;
  const target = document.getElementById("target").value;
  const out = document.getElementById("output");
  const btn = document.getElementById("btn");

  if (!skills || !target) { out.textContent = "⚠️ Fill skills and target role."; return; }

  btn.disabled = true;
  btn.textContent = "Thinking...";
  out.textContent = "⏳ Mistral AI is analyzing...";

  const prompt = `You are a career advisor. User: ${name}.
Current skills: ${skills}
Target role: ${target}

Respond in this exact format:

## Skill Gap Analysis
- bullet list of missing skills

## Personalized Learning Path
1. step
2. step

## Recommended Resources
- resource links

## Estimated Time to Job-Ready
X months

Keep it concise and actionable.`;

  try {
    const res = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + MISTRAL_API_KEY
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "No response.";
    out.textContent = result;

    // Save to Supabase
    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      skills,
      target_role: target,
      ai_result: result
    });
  } catch (e) {
    out.textContent = "❌ Request failed: " + e.message;
  }

  btn.disabled = false;
  btn.textContent = "Analyze Skill Gap";
}

// ---------- INIT ----------
updateAuthUI();
