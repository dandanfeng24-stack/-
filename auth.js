
const AUTH_KEYS = {
  USERS: "mp_users",
  CURRENT: "mp_current_user",
  ACTIONS: "mp_user_actions",
  FAVORITES: "mp_favorites",
  DOWNLOADS: "mp_downloads"
};

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function nowISO() { return new Date().toISOString(); }
function uid(prefix="id") { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }

function getUsers() { return readStore(AUTH_KEYS.USERS, []); }
function saveUsers(users) { writeStore(AUTH_KEYS.USERS, users); }
function getCurrentUser() { return readStore(AUTH_KEYS.CURRENT, null); }
function setCurrentUser(user) { writeStore(AUTH_KEYS.CURRENT, user); }
function logout() { localStorage.removeItem(AUTH_KEYS.CURRENT); location.href = "app.html"; }

function trackAction(action_type, target_id="", meta={}) {
  const user = getCurrentUser();
  const actions = readStore(AUTH_KEYS.ACTIONS, []);
  actions.push({
    id: uid("act"),
    user_id: user ? user.id : "guest",
    user_email: user ? user.email : "",
    action_type,
    target_id,
    meta,
    created_at: nowISO()
  });
  writeStore(AUTH_KEYS.ACTIONS, actions);
}

function requireLogin(redirect="login.html") {
  const user = getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
    location.href = `${redirect}?next=${next}`;
    return null;
  }
  return user;
}

function updateNavAuth() {
  const user = getCurrentUser();
  const el = document.querySelector("[data-auth-area]");
  if (!el) return;
  if (user) {
    el.innerHTML = `
      <a class="nav-link" href="profile.html">用户中心</a>
      <a class="nav-link" href="resources.html">资料领取</a>
      <button class="small-btn" onclick="logout()">退出</button>
    `;
  } else {
    el.innerHTML = `
      <a class="nav-link" href="login.html">登录</a>
      <a class="primary-btn" href="register.html">注册</a>
    `;
  }
}

function registerUser(formData) {
  const users = getUsers();
  const email = formData.email.trim().toLowerCase();
  if (users.some(u => u.email === email)) throw new Error("该邮箱已注册。");
  const user = {
    id: uid("user"),
    nickname: formData.nickname.trim() || "未命名用户",
    email,
    password: formData.password,
    city: formData.city || "",
    occupation: formData.occupation || "",
    time_budget: formData.time_budget || "",
    money_budget: formData.money_budget || "",
    skill_tags: formData.skill_tags || "",
    created_at: nowISO(),
    last_login_at: nowISO()
  };
  users.push(user);
  saveUsers(users);
  const safeUser = {...user};
  delete safeUser.password;
  setCurrentUser(safeUser);
  trackAction("register", user.id);
  return safeUser;
}

function loginUser(email, password) {
  const users = getUsers();
  const found = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (!found) throw new Error("邮箱或密码不正确。");
  found.last_login_at = nowISO();
  saveUsers(users);
  const safeUser = {...found};
  delete safeUser.password;
  setCurrentUser(safeUser);
  trackAction("login", found.id);
  return safeUser;
}

function getFavorites() { return readStore(AUTH_KEYS.FAVORITES, []); }
function saveFavorites(favs) { writeStore(AUTH_KEYS.FAVORITES, favs); }

function isFavorite(solutionId) {
  const user = getCurrentUser();
  if (!user) return false;
  return getFavorites().some(f => f.user_id === user.id && f.solution_id === solutionId);
}

function toggleFavorite(solution) {
  const user = getCurrentUser();
  if (!user) {
    alert("请先登录后再收藏。");
    location.href = "login.html?next=index.html";
    return false;
  }
  let favs = getFavorites();
  const exists = favs.find(f => f.user_id === user.id && f.solution_id === solution.id);
  if (exists) {
    favs = favs.filter(f => !(f.user_id === user.id && f.solution_id === solution.id));
    saveFavorites(favs);
    trackAction("unfavorite_solution", solution.id);
    return false;
  } else {
    favs.push({
      id: uid("fav"),
      user_id: user.id,
      solution_id: solution.id,
      solution_title: solution.title,
      created_at: nowISO()
    });
    saveFavorites(favs);
    trackAction("favorite_solution", solution.id, { title: solution.title });
    return true;
  }
}

function recordDownload(resource) {
  const user = requireLogin();
  if (!user) return;
  const downloads = readStore(AUTH_KEYS.DOWNLOADS, []);
  downloads.push({
    id: uid("down"),
    user_id: user.id,
    user_email: user.email,
    resource_id: resource.id,
    resource_title: resource.title,
    created_at: nowISO()
  });
  writeStore(AUTH_KEYS.DOWNLOADS, downloads);
  trackAction("download_resource", resource.id, { title: resource.title });
}
document.addEventListener("DOMContentLoaded", updateNavAuth);
