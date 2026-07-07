// backend ka base URL ek jagah rakho (baad mein badalna ho to sirf yahin badlo)
const API_URL = 'http://localhost:4000';

// login/signup ke baad token bachao
export function saveToken(token) {
  localStorage.setItem('token', token);
}

// user ki info bhi bachao (naam navbar mein "Hello, naam" ke liye chahiye)
// localStorage sirf text rakhta hai, isliye object ko JSON text banao
export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// bachaya hua user object wapas do (nahi hai to null)
export function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

// logout par dono phenk do — token bhi, user info bhi
export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// token hai ya nahi? (ProtectedRoute ke liye)
export function isLoggedIn() {
  return localStorage.getItem('token') != null;
}

// chhota helper — fetch karo, response theek na ho to error phenko, warna JSON do
// (har function mein same 3 line likhne se accha ek jagah likho)
async function request(path, options={}) {
  //login time ka token bachaya hua
  const token= localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers:{
      ...options.headers,
      //token pe authorization header lagao
      ...(token&&{Authorization:`Bearer ${token}`}),
    },
  });
  // 401 = token galat/expire (login/signup ke alawa) — token phenko, login par bhejo
  // path check isliye: login par galat password bhi 401 deta hai, wahan redirect nahi chahiye
  if (res.status === 401 && !path.startsWith('/auth')) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Session expired, please log in again');
  }
  if (!res.ok) {
    // backend ne error message nikalo
    const body=await res.json().catch(()=>({}));
    throw new Error(body.error||`API error: ${res.status}`);
  }
  return res.json();
}

// saare monitors backend se laao
export async function getMonitors() {
  return request('/monitors');
}

// naya monitor banao — data = { name, url, intervalSeconds, alertEmail }
export async function addMonitor(data) {
  return request('/monitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // batao ki body JSON hai
    body: JSON.stringify(data),                      // object ko JSON text banao
  });
}

// monitor delete karo (uske checks/incidents bhi backend saaf kar deta hai)
export async function deleteMonitor(id) {
  return request(`/monitors/${id}`, { method: 'DELETE' });
}

// ek monitor ka uptime laao — { uptime24h, uptime7d, uptime30d } (number ya null)
export async function getUptime(id) {
  return request(`/monitors/${id}/uptime`);
}

// ek monitor ke last 50 checks laao — [{ statusCode, responseMs, isUp, checkedAt }]
export async function getChecks(id) {
  return request(`/monitors/${id}/checks`);
}

// ek monitor ke incidents laao — [{ startedAt, resolvedAt, durationMs, cause }]
export async function getIncidents(id) {
  return request(`/monitors/${id}/incidents`);
}

// naya account — backend token wapas deta hai
export async function signup(name, email, password) {
  return request('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
}

// login — backend token wapas deta hai
export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}
