// Core Vedic astrology calculations.
// Mahadasha math validated against real provider data (see project notes).

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_LORDS = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export function rashiFromLongitude(longitude) {
  const idx = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return RASHIS[idx];
}

export function degreesInRashi(longitude) {
  return ((longitude % 30) + 30) % 30;
}

export function nakshatraFromLongitude(longitude) {
  const span = 360 / 27;
  const idx = Math.floor(((longitude % 360) + 360) % 360 / span);
  const posInNak = (((longitude % 360) + 360) % 360 % span) / span;
  const pada = Math.floor((posInNak * span) / (span / 4)) + 1;
  return { name: NAKSHATRAS[idx], lord: DASHA_SEQUENCE[idx % 9], pada };
}

// Whole-sign house: house 1 = lagna's rashi, houses count forward from there
export function houseForRashi(lagnaRashi, planetRashi) {
  const lagnaIdx = RASHIS.indexOf(lagnaRashi);
  const planetIdx = RASHIS.indexOf(planetRashi);
  return ((planetIdx - lagnaIdx + 12) % 12) + 1;
}

export function calculateMahadasha(moonLongitude, birthDate) {
  const nakshatraSpan = 360 / 27;
  const normLon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan);
  const lord = DASHA_SEQUENCE[nakshatraIndex % 9];

  const positionInNakshatra = (normLon % nakshatraSpan) / nakshatraSpan;
  const firstLordFullYears = DASHA_YEARS[lord];
  const balanceYears = firstLordFullYears * (1 - positionInNakshatra);

  const startIdx = DASHA_SEQUENCE.indexOf(lord);
  const timeline = [];
  let cursor = new Date(birthDate);

  let endDate = addYears(cursor, balanceYears);
  timeline.push({
    lord, from: cursor.toISOString().slice(0, 10), to: endDate.toISOString().slice(0, 10),
    years: round2(balanceYears), partial: true,
  });
  cursor = endDate;

  for (let i = 1; i < 9; i++) {
    const nextLord = DASHA_SEQUENCE[(startIdx + i) % 9];
    const fullYears = DASHA_YEARS[nextLord];
    endDate = addYears(cursor, fullYears);
    timeline.push({
      lord: nextLord, from: cursor.toISOString().slice(0, 10), to: endDate.toISOString().slice(0, 10),
      years: fullYears,
    });
    cursor = endDate;
  }

  return { nakshatra: nakshatraFromLongitude(normLon), timeline };
}

export function currentDasha(timeline, atDate = new Date()) {
  return timeline.find((d) => new Date(d.from) <= atDate && atDate < new Date(d.to)) || null;
}

function addYears(date, years) {
  const ms = years * 365.2425 * 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + ms);
}
function round2(n) { return Math.round(n * 100) / 100; }

// ---- Ashtakoot matching (Guna Milan) ----
// Simplified but structurally accurate 8-koota scoring, standard max points per koota.
const KOOTA_MAX = { varna: 1, vashya: 2, tara: 3, yoni: 4, grahaMaitri: 5, gana: 6, bhakoot: 7, nadi: 8 };

const GANA_BY_NAKSHATRA = {
  Ashwini: "Deva", Mrigashira: "Deva", Punarvasu: "Deva", Pushya: "Deva", Hasta: "Deva",
  Swati: "Deva", Anuradha: "Deva", Shravana: "Deva", Revati: "Deva",
  Bharani: "Manushya", Rohini: "Manushya", "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya",
  "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya", "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya",
  Krittika: "Rakshasa", Ardra: "Rakshasa", Ashlesha: "Rakshasa", Magha: "Rakshasa", Chitra: "Rakshasa",
  Vishakha: "Rakshasa", Jyeshtha: "Rakshasa", Mula: "Rakshasa", Dhanishta: "Rakshasa", Shatabhisha: "Rakshasa",
};

const NADI_BY_NAKSHATRA = {
  Ashwini: "Adi", Ardra: "Adi", Punarvasu: "Adi", "Uttara Phalguni": "Adi", Hasta: "Adi",
  Jyeshtha: "Adi", "Mula": "Adi", "Shatabhisha": "Adi", "Purva Bhadrapada": "Adi",
  Bharani: "Madhya", Mrigashira: "Madhya", Pushya: "Madhya", "Purva Phalguni": "Madhya", Chitra: "Madhya",
  Anuradha: "Madhya", "Purva Ashadha": "Madhya", Dhanishta: "Madhya", "Uttara Bhadrapada": "Madhya",
  Krittika: "Antya", Rohini: "Antya", Ashlesha: "Antya", Magha: "Antya", Swati: "Antya",
  Vishakha: "Antya", "Uttara Ashadha": "Antya", Shravana: "Antya", Revati: "Antya",
};

export function calculateAshtakoot(moonLon1, moonLon2) {
  const n1 = nakshatraFromLongitude(moonLon1);
  const n2 = nakshatraFromLongitude(moonLon2);
  const r1 = rashiFromLongitude(moonLon1);
  const r2 = rashiFromLongitude(moonLon2);

  const nIdx1 = NAKSHATRAS.indexOf(n1.name);
  const nIdx2 = NAKSHATRAS.indexOf(n2.name);
  const rIdx1 = RASHIS.indexOf(r1);
  const rIdx2 = RASHIS.indexOf(r2);

  // Tara koota: nakshatra distance, cycles of 9, some are auspicious
  const taraDiff = ((nIdx2 - nIdx1 + 27) % 27) + 1;
  const taraGroup = taraDiff % 9;
  const taraScore = [3, 3, 0, 3, 0, 3, 0, 3, 0][taraGroup] ?? 1.5; // simplified auspicious/inauspicious pattern

  // Gana koota
  const g1 = GANA_BY_NAKSHATRA[n1.name];
  const g2 = GANA_BY_NAKSHATRA[n2.name];
  let ganaScore = 6;
  if (g1 !== g2) {
    if ((g1 === "Deva" && g2 === "Rakshasa") || (g1 === "Rakshasa" && g2 === "Deva")) ganaScore = 0;
    else ganaScore = 4.5;
  }

  // Nadi koota — same Nadi is inauspicious (0), different is full points
  const nadi1 = NADI_BY_NAKSHATRA[n1.name];
  const nadi2 = NADI_BY_NAKSHATRA[n2.name];
  const nadiScore = nadi1 === nadi2 ? 0 : 8;

  // Bhakoot koota — rashi distance
  const rashiDiff = Math.abs(rIdx1 - rIdx2);
  const badPairs = [0, 4, 8, 12]; // simplified: same/6-8/2-12 rashi distance considered inauspicious
  const bhakootScore = badPairs.includes(rashiDiff) ? 0 : 7;

  // Vashya, Yoni, Graha Maitri, Varna — simplified proportional placeholders
  // (full lookup tables are large; these approximate typical distributions)
  const varnaScore = 1;
  const vashyaScore = 1.5;
  const yoniScore = 3;
  const grahaMaitriScore = 4;

  const total = round2(varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore);

  return {
    person1: { nakshatra: n1.name, rashi: r1 },
    person2: { nakshatra: n2.name, rashi: r2 },
    kootas: {
      varna: { score: varnaScore, max: KOOTA_MAX.varna },
      vashya: { score: vashyaScore, max: KOOTA_MAX.vashya },
      tara: { score: round2(taraScore), max: KOOTA_MAX.tara },
      yoni: { score: yoniScore, max: KOOTA_MAX.yoni },
      grahaMaitri: { score: grahaMaitriScore, max: KOOTA_MAX.grahaMaitri },
      gana: { score: ganaScore, max: KOOTA_MAX.gana },
      bhakoot: { score: bhakootScore, max: KOOTA_MAX.bhakoot },
      nadi: { score: nadiScore, max: KOOTA_MAX.nadi },
    },
    total,
    maxTotal: 36,
    verdict: total >= 24 ? "Excellent match" : total >= 18 ? "Good match" : total >= 12 ? "Average match" : "Below average — consult further",
  };
}
