const API = "http://localhost:8081/api"; // Backend API

// ------------------ Helpers ------------------
function getToken() {
  return localStorage.getItem("token");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function saveAuthData(data) {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  if (data.role) localStorage.setItem("role", data.role);
  if (data.name) localStorage.setItem("name", data.name);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
}

// ------------------ Auth Fetch with auto-refresh ------------------
async function authFetch(url, options = {}) {
  let token = getToken();
  if (!token) throw new Error("User not logged in");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let res = await fetch(url, options);

  // If token expired (403), try refresh
  if (res.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      logout();
      throw new Error("Session expired, please log in again.");
    }
    options.headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(url, options);
  }

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.message) errMsg = errData.message;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return res.json();
}

// ------------------ Auth ------------------
export async function register(name, email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Register failed: ${msg}`);
  }

  const data = await res.json();
  saveAuthData(data);
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Login failed: ${msg}`);
  }

  const data = await res.json();
  saveAuthData(data);
  return data;
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.token) localStorage.setItem("token", data.token);
    return data.token;
  } catch (err) {
    return null;
  }
}

// ------------------ Products ------------------
export async function getProducts() {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function searchProducts(query) {
  const res = await fetch(`${API}/products/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// ------------------ Products by category ------------------
export async function getProductsByCategory(category) {
  const res = await fetch(`${API}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Failed to fetch products by category");
  return res.json();
}


// ------------------ Cart ------------------
export async function getCart() {
  return authFetch(`${API}/cart`, { method: "GET" });
}

export async function addToCart(productId) {
  return authFetch(`${API}/cart/add/${productId}`, { method: "POST" });
}

export async function updateCart(cartItemId, quantity) {
  return authFetch(`${API}/cart/update/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(cartItemId) {
  return authFetch(`${API}/cart/remove/${cartItemId}`, { method: "DELETE" });
}

export async function incrementCart(cartItemId) {
  return authFetch(`${API}/cart/increment/${cartItemId}`, { method: "POST" });
}

export async function decrementCart(cartItemId) {
  return authFetch(`${API}/cart/decrement/${cartItemId}`, { method: "POST" });
}

export async function clearCart() {
  return authFetch(`${API}/cart/clear`, { method: "DELETE" });
}

// ------------------ Orders ------------------
export async function checkout() {
  // ✅ Automatically attaches JWT token and refreshes if expired
  return authFetch(`${API}/orders/checkout`, { method: "POST" });
}

export { logout };
