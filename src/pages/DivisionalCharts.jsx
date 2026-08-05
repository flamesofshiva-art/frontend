import { useState } from 'react';
import BirthFormFull from '../components/BirthFormFull';
import NorthIndianChart from '../components/NorthIndianChart';
import { computeDivisionalCharts } from '../lib/api';

const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const VARGA_ORDER = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];

export default function DivisionalCharts() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVarga, setSelectedVarga] = useState('D9');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeDivisionalCharts(data);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.vargas?.[selectedVarga];

  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Shodashvarga</p>
      <h1 style={styles.h1}>Divisional Charts</h1>
      <p style={styles.sub}>
        All 16 classical vargas — from D1 (the birth chart itself) through D60
        (past-life karma). Each has its own Lagna and whole-sign houses, not
        just D1's. Validated: all 9 planets matched exactly on D60 against
        real chart data.
      </p>

      <div style={styles.notice}>
        Requires the backend running (see /backend/README.md).
      </div>

      <BirthFormFull onSubmit={handleSubmit} submitLabel="Generate divisional charts" loading={loading} />

      {error && <div style={styles.errorBox}>{error}</div>}

      {result && (
        <div style={{ marginTop: 40 }}>
          <div style={styles.tabs}>
            {VARGA_ORDER.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVarga(v)}
                style={{
                  ...styles.tab,
                  background: selectedVarga === v ? 'var(--vermillion)' : 'transparent',
                  color: selectedVarga === v ? 'var(--ivory)' : 'var(--ivory-dim)',
                  borderColor: selectedVarga === v ? 'var(--vermillion)' : 'rgba(247,240,227,0.15)',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <div style={styles.layout}>
            <div style={styles.chartVisualCard}>
              <div style={styles.chartHeader}>
                <h2 style={styles.chartTitle}>{selectedVarga}</h2>
                <p style={styles.chartSignificance}>{result.significance[selectedVarga]}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <NorthIndianChart chartData={chartData} title={selectedVarga} size={320} />
              </div>
              <p style={styles.lagnaNote}>
                Lagna: {chartData?.Lagna?.rashi} (this varga's own ascendant — houses below are relative to it)
              </p>
            </div>

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Planet</th>
                    <th style={styles.th}>Sign</th>
                    <th style={styles.th}>House</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Lagna</td>
                    <td style={styles.td}>{chartData?.Lagna?.rashi}</td>
                    <td style={styles.td}>1</td>
                  </tr>
                  {PLANET_ORDER.map((planet) => (
                    <tr key={planet}>
                      <td style={styles.td}>{planet}</td>
                      <td style={styles.td}>{chartData?.[planet]?.rashi}</td>
                      <td style={styles.td}>{chartData?.[planet]?.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  sub: { color: 'var(--ivory-dim)', maxWidth: 640, lineHeight: 1.6, marginBottom: 20 },
  notice: {
    background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.3)',
    borderRadius: 6, padding: '12px 16px', fontSize: '0.82rem', color: 'var(--gold-soft)',
    marginBottom: 32, lineHeight: 1.6,
  },
  errorBox: {
    background: 'rgba(201,67,42,0.12)', border: '1px solid rgba(201,67,42,0.4)',
    borderRadius: 6, padding: '14px 16px', fontSize: '0.88rem', color: 'var(--vermillion)', marginTop: 20,
  },
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tab: {
    border: '1px solid', borderRadius: 20, padding: '7px 16px',
    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
  },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  chartVisualCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 28,
  },
  tableCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 28, height: 'fit-content',
  },
  chartHeader: { marginBottom: 8, borderBottom: '1px solid rgba(247,240,227,0.1)', paddingBottom: 16 },
  chartTitle: { fontSize: '1.8rem', margin: 0 },
  chartSignificance: { fontSize: '0.9rem', color: 'var(--gold-soft)', margin: '6px 0 0' },
  lagnaNote: { fontSize: '0.78rem', color: 'var(--ivory-dim)', textAlign: 'center', marginTop: 14 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' },
  th: { textAlign: 'left', padding: '8px 6px', color: 'var(--gold-soft)', fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(247,240,227,0.15)' },
  td: { padding: '10px 6px', borderBottom: '1px solid rgba(247,240,227,0.06)' },
};
