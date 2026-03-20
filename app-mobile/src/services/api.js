const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function searchBusiness(q) {
  const res = await fetch(`${API_BASE}/business/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function getBusinessBySlug(slug) {
  const res = await fetch(`${API_BASE}/business/${slug}`);
  return res.json();
}

export async function createAppointment(payload) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
