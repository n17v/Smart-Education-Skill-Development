function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
