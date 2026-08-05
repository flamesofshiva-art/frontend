import { useState } from 'react';
import BirthFormFull from '../components/BirthFormFull';
import NorthIndianChart from '../components/NorthIndianChart';
import { computeKundali } from '../lib/api';

export default function Kundali() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeKundali(data);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · No sign-up</p>
      <h1 style={styles.h1}>Kundali Calculator</h1>
      <p style={styles.sub}>
        North Indian chart, Lahiri ayanamsa, whole-sign houses — real Swiss Ephemeris calculation,
        validated against known-correct chart data.
      </p>

      <div style={styles.notice}>
        Requires the backend running (see /backend/README.md — <code>uvicorn main:app --port 8000</code>).
        Set <code>VITE_API_BASE</code> if deploying somewhere other than localhost:8000.
      </div>

      <div style={styles.grid}>
        <BirthFormFull onSubmit={handleSubmit} submitLabel="Generate my kundali" loading={loading} />

        <div>
          {error && <div style={styles.errorBox}>{error}</div>}
          {!result && !error ? (
            <div style={styles.placeholder}>
              <span className="flame" aria-hidden="true" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--ivory-dim)', fontSize: '0.95rem' }}>
                Your chart will appear here once you submit your birth details.
              </p>
            </div>
          ) : result && (
            <div style={styles.resultCard}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <NorthIndianChart
                  chartData={{
                    Lagna: { rashi: result.lagna.rashi, house: 1 },
                    ...result.planets,
                  }}
                  title="D1 Rashi Chart"
                  size={320}
                />
              </div>
              <div style={styles.statGrid}>
                <Stat label="Lagna" value={result.lagna.rashi} />
                <Stat label="Moon Rashi" value={result.planets.Moon.rashi} />
                <Stat label="Nakshatra" value={`${result.dasha.nakshatra}`} />
                <Stat label="Sun Sign" value={result.planets.Sun.rashi} />
              </div>
              {result.dasha.current_mahadasha && (
                <div style={styles.dashaCard}>
                  <p style={styles.formLabel}>Current Mahadasha</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: '4px 0' }}>
                    {result.dasha.current_mahadasha.lord}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ivory-dim)' }}>
                    {result.dasha.current_mahadasha.from} → {result.dasha.current_mahadasha.to}
                  </p>
                  {result.dasha.current_antardasha && (
                    <>
                      <p style={{ ...styles.formLabel, marginTop: 14 }}>Current Antardasha</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: '4px 0' }}>
                        {result.dasha.current_antardasha.lord}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--ivory-dim)' }}>
                        {result.dasha.current_antardasha.from} → {result.dasha.current_antardasha.to}
                      </p>
                    </>
                  )}
                </div>
              )}

              <div style={{ marginTop: 20, borderTop: '1px solid rgba(247,240,227,0.1)', paddingTop: 20 }}>
                <p style={styles.formLabel}>All Planets</p>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Planet</th>
                      <th style={styles.th}>Sign</th>
                      <th style={styles.th}>House</th>
                      <th style={styles.th}>Nakshatra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.planets).map(([name, p]) => (
                      <tr key={name}>
                        <td style={styles.td}>{name}</td>
                        <td style={styles.td}>{p.rashi}</td>
                        <td style={styles.td}>{p.house}</td>
                        <td style={styles.td}>{p.nakshatra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  sub: { color: 'var(--ivory-dim)', maxWidth: 620, lineHeight: 1.6, marginBottom: 20 },
  notice: {
    background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.3)',
    borderRadius: 6, padding: '12px 16px', fontSize: '0.82rem', color: 'var(--gold-soft)',
    marginBottom: 36, lineHeight: 1.6,
  },
  errorBox: {
    background: 'rgba(201,67,42,0.12)', border: '1px solid rgba(201,67,42,0.4)',
    borderRadius: 6, padding: '14px 16px', fontSize: '0.88rem', color: 'var(--vermillion)', marginBottom: 20,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 28 },
  placeholder: {
    background: 'rgba(247,240,227,0.02)', border: '1px dashed rgba(247,240,227,0.15)',
    borderRadius: 'var(--radius)', height: '100%', minHeight: 340,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32,
  },
  resultCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 28,
  },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 },
  stat: { background: 'rgba(247,240,227,0.04)', borderRadius: 4, padding: '12px 14px' },
  statLabel: { fontSize: '0.72rem', color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
  statValue: { fontSize: '1rem', fontWeight: 600, margin: '4px 0 0' },
  dashaCard: { marginTop: 20, borderTop: '1px solid rgba(247,240,227,0.1)', paddingTop: 20 },
  formLabel: { fontSize: '0.78rem', color: 'var(--gold-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '8px 6px', color: 'var(--gold-soft)', fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(247,240,227,0.15)' },
  td: { padding: '8px 6px', borderBottom: '1px solid rgba(247,240,227,0.06)' },
};
