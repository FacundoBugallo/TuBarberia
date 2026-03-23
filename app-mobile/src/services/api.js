const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function unwrapResponse(res) {
  const payload = await res.json();

  if (!res.ok) {
    const errorMessage =
      typeof payload?.detail === "string"
        ? payload.detail
        : payload?.detail?.message || `API error ${res.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}

export async function searchBusiness(q) {
  const res = await fetch(`${API_BASE}/business/search?q=${encodeURIComponent(q)}`);
  return unwrapResponse(res);
}

export async function getBusinessBySlug(slug) {
  const res = await fetch(`${API_BASE}/business/${slug}`);
  return unwrapResponse(res);
}

export async function createAppointment(payload) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapResponse(res);
}
