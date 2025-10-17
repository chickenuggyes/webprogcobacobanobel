// ==== Helper ====
async function postJSONSafe(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // coba parse JSON; kalau gagal ambil text mentah
  let data = null, text = "";
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch {}
  } else {
    try { text = await res.text(); } catch {}
  }

  if (!res.ok) {
    const msg = (data && data.message) || text || `Request gagal (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data || {};
}

// ==== Toggle login/signup form ====
document.getElementById('showSignup').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.querySelector('.signup-link').style.display = 'none';
  document.getElementById('error').style.display = 'none';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.querySelector('.signup-link').style.display = 'block';
  document.getElementById('error').style.display = 'none';
});

// ==== Login ====
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'none';

  if (!username || !password) {
    errorDiv.textContent = 'Username dan password wajib diisi.';
    errorDiv.style.display = 'block';
    return;
  }

  try {
    // gunakan relative URL → same-origin (Railway)
    const data = await postJSONSafe('/login', { username, password });
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dist/dashboard.html'; // absolute path
  } catch (err) {
    errorDiv.textContent = err.message || 'Login gagal!';
    errorDiv.style.display = 'block';
  }
});

// ==== Register + auto-login ====
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'none';

  if (!username || !password) {
    errorDiv.textContent = 'Username dan password wajib diisi.';
    errorDiv.style.display = 'block';
    return;
  }

  try {
    await postJSONSafe('/login/register', { username, password });
    const loginData = await postJSONSafe('/login', { username, password });
    localStorage.setItem('user', JSON.stringify(loginData.user));
    window.location.href = '/dist/dashboard.html';
  } catch (err) {
    errorDiv.textContent = err.message || 'Registrasi/Login gagal.';
    errorDiv.style.display = 'block';
  }
});
