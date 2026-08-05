// Points to your FastAPI backend (see /backend folder).
// Change this to your deployed backend URL before going live.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function computeKundali(birth) {
  return post('/kundali/compute', birth);
}

export function computeKP(birth) {
  return post('/kundali/kp', birth);
}

export function computeMatching(personA, personB) {
  return post('/matching/ashtakoot', { person_a: personA, person_b: personB });
}

export function computeDivisionalCharts(birth) {
  return post('/kundali/divisional-charts', birth);
}

export function computeDoshasYogas(birth) {
  return post('/kundali/doshas-yogas', birth);
}

export function computeSummary(birth) {
  return post('/kundali/summary', birth);
}
