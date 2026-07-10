const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (username, password) => request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  activate: (code) => request("/api/auth/activate", { method: "POST", body: JSON.stringify({ code }) }),

  listCustomers: () => request("/api/customers"),
  addCustomer: (data) => request("/api/customers", { method: "POST", body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/api/customers/${id}`, { method: "DELETE" }),

  listDevices: () => request("/api/devices"),
  addDevice: (data) => request("/api/devices", { method: "POST", body: JSON.stringify(data) }),
  updateDevice: (id, data) => request(`/api/devices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDevice: (id) => request(`/api/devices/${id}`, { method: "DELETE" }),

  listActivationCodes: () => request("/api/activation-codes"),
  addActivationCode: (data) => request("/api/activation-codes", { method: "POST", body: JSON.stringify(data) }),

  getSettings: () => request("/api/settings"),
  updateSettings: (data) => request("/api/settings", { method: "PUT", body: JSON.stringify(data) }),
};

// Generic CRUD for simple list-based resources (countries, regions, categories,
// languages, admin-users, banners, popups, tickers, channel-profiles, channels).
// `idField` must match the key used to identify a row (see backend server.js mountCollection calls).
export function resource(path, idField = "id") {
  return {
    list: () => request(`/api/${path}`),
    add: (data) => request(`/api/${path}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/${path}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/api/${path}/${encodeURIComponent(id)}`, { method: "DELETE" }),
    idField,
  };
}
