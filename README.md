# Flames of Shiva

## Two parts

1. **frontend/** (this folder) — React + Vite site
2. **backend/** — Python FastAPI serving real chart calculations

## Run both

Terminal 1 (backend):
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Terminal 2 (frontend):
```
npm install
npm run dev
```
Opens at http://localhost:5173

## Pages

- Home
- Kundali — real chart via backend (planets, houses, Mahadasha/Antardasha)
- KP — Ruling Planets, Cusps, Planets (real, validated against AstroSage)
- Matching — still uses Shastra Life embed (partner arrangement)
- Tarot — still uses Shastra Life embed
- Numerology — still uses Shastra Life embed
- Chat — placeholder, needs Claude API backend wiring (not built yet)

## What's real vs. still placeholder

REAL: Kundali page, KP page — genuine Swiss Ephemeris calculation,
cross-validated against real provider data AND an independent third
party (AstroSage). See backend/README.md for validation details.

SHASTRA LIFE EMBEDS: Matching, Tarot, Numerology — live via your
partner arrangement, calculating in-browser, no backend needed.

STILL PLACEHOLDER: Chat page — canned replies, needs your Claude API
backend wired in per the system prompt design from earlier planning.

Ashtakoot matching in the backend (/matching/ashtakoot) only returns
Moon nakshatra/rashi right now — the full 8-koota scoring tables
still need to be built (noted in backend/main.py).
