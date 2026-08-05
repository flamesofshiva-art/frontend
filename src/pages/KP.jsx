import { useState } from 'react';
import BirthFormFull from '../components/BirthFormFull';
import { computeKP } from '../lib/api';

const RP_LABELS = {
  asc_sign_lord: 'Asc Sign Lord', asc_star_lord: 'Asc Star Lord', asc_sub_lord: 'Asc Sub Lord',
  moon_sign_lord: 'Moon Sign Lord', moon_star_lord: 'Moon Star Lord', moon_sub_lord: 'Moon Sub Lord',
  day_lord: 'Day Lord',
};

export default function KP() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeKP(data);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Krishnamurti Paddhati</p>
      <h1 style={styles.h1}>KP Astrology</h1>
      <p style={styles.sub}>
        Ruling Planets, cuspal sub lords, and planetary sub lords — Placidus houses,
        sidereal Lahiri. Validated against AstroSage.
      </p>

      <div style={styles.notice}>
        Requires the backend running (see /backend/README.md).
      </div>

      <BirthFormFull onSubmit={handleSubmit} submitLabel="Generate KP chart" loading={loading} />

      {error && <div style={styles.errorBox}>{error}</div>}

      {result && (
        <div style={{ marginTop: 40 }}>
          <h2 style={styles.h2}>Ruling Planets</h2>
          <div style={styles.rpGrid}>
            {Object.entries(RP_LABELS).map(([key, label]) => (
              <div key={key} style={styles.rpCard}>
                <p style={styles.rpLabel}>{label}</p>
                <p style={styles.rpValue}>{result.ruling_planets[key]}</p>
              </div>
            ))}
          </div>

          <h2 style={{ ...styles.h2, marginTop: 44 }}>KP Cusps</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Cusp', 'Degree', 'Sign', 'Sign Lord', 'Star', 'Star Lord', 'Sub Lord'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.cusps.map((c) => (
                  <tr key={c.cusp}>
                    <td style={styles.td}>{c.cusp}</td>
                    <td style={styles.td}>{c.longitude.toFixed(2)}°</td>
                    <td style={styles.td}>{c.sign}</td>
                    <td style={styles.td}>{c.sign_lord}</td>
                    <td style={styles.td}>{c.star}</td>
                    <td style={styles.td}>{c.star_lord}</td>
                    <td style={styles.td}>{c.sub_lord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ ...styles.h2, marginTop: 44 }}>KP Planets</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Planet', 'Cusp', 'Sign', 'Sign Lord', 'Star', 'Star Lord', 'Sub Lord'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.planets.map((p) => (
                  <tr key={p.planet}>
                    <td style={styles.td}>{p.planet}</td>
                    <td style={styles.td}>{p.cusp}</td>
                    <td style={styles.td}>{p.sign}</td>
                    <td style={styles.td}>{p.sign_lord}</td>
                    <td style={styles.td}>{p.star}</td>
                    <td style={styles.td}>{p.star_lord}</td>
                    <td style={styles.td}>{p.sub_lord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  h2: { fontSize: '1.4rem', marginBottom: 18 },
  sub: { color: 'var(--ivory-dim)', maxWidth: 620, lineHeight: 1.6, marginBottom: 20 },
  notice: {
    background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.3)',
    borderRadius: 6, padding: '12px 16px', fontSize: '0.82rem', color: 'var(--gold-soft)',
    marginBottom: 32, lineHeight: 1.6,
  },
  errorBox: {
    background: 'rgba(201,67,42,0.12)', border: '1px solid rgba(201,67,42,0.4)',
    borderRadius: 6, padding: '14px 16px', fontSize: '0.88rem', color: 'var(--vermillion)', marginTop: 20,
  },
  rpGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 },
  rpCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: '16px 18px',
  },
  rpLabel: { fontSize: '0.72rem', color: 'var(--gold-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
  rpValue: { fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '6px 0 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 600 },
  th: { textAlign: 'left', padding: '10px 8px', color: 'var(--gold-soft)', fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(247,240,227,0.15)' },
  td: { padding: '10px 8px', borderBottom: '1px solid rgba(247,240,227,0.06)' },
};
