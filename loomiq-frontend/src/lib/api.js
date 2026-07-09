const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
  }
  return response.json();
}

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
  return handleResponse(response);
}

export async function postNlQuery(question) {
  const response = await fetch(`${API_BASE_URL}/api/nl-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return handleResponse(response);
}

export async function searchFinishedGoods(filters = {}) {
  const params = new URLSearchParams();
  
  // Cleanly map incoming query filters into safe URL arguments
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/finished-goods/search?${params.toString()}`);
  return handleResponse(response);
}