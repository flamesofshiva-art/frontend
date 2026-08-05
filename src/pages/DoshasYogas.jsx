import { useState } from 'react';
import BirthFormFull from '../components/BirthFormFull';
import { computeDoshasYogas } from '../lib/api';

export default function DoshasYogas() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeDoshasYogas(data);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Doshas & Yogas</p>
      <h1 style={styles.h1}>Mangal Dosha & Yogas</h1>
      <p style={styles.sub}>
        Manglik status checked from Lagna, Moon, and Venus — plus a comprehensive
        yoga scan: Gaja Kesari, Chandra-Mangal, Budhaditya, Kemadruma, all five
        Pancha Mahapurusha yogas, Neechabhanga, Dhana Yogas, and Raja Yogas.
      </p>

      <div style={styles.notice}>
        Requires the backend running (see /backend/README.md).
      </div>

      <BirthFormFull onSubmit={handleSubmit} submitLabel="Check doshas & yogas" loading={loading} />

      {error && <div style={styles.errorBox}>{error}</div>}

      {result && (
        <div style={{ marginTop: 40 }}>
          <h2 style={styles.h2}>Mangal Dosha</h2>
          <div style={styles.doshaCard}>
            <div style={styles.doshaHeader}>
              <span style={{
                ...styles.doshaBadge,
                background: result.mangal_dosha.is_manglik ? 'var(--vermillion)' : 'var(--sage)',
              }}>
                {result.mangal_dosha.is_manglik ? 'Manglik' : 'Not Manglik'}
              </span>
              <span style={{ color: 'var(--ivory-dim)', fontSize: '0.88rem' }}>
                Mars in {result.mangal_dosha.mars_rashi}
              </span>
            </div>
            <div style={styles.doshaGrid}>
              <DoshaCheck label="From Lagna" house={result.mangal_dosha.house_from_lagna} present={result.mangal_dosha.manglik_from_lagna} />
              <DoshaCheck label="From Moon" house={result.mangal_dosha.house_from_moon} present={result.mangal_dosha.manglik_from_moon} />
              <DoshaCheck label="From Venus" house={result.mangal_dosha.house_from_venus} present={result.mangal_dosha.manglik_from_venus} />
            </div>
            {result.mangal_dosha.cancellation_note && (
              <p style={styles.cancellationNote}>{result.mangal_dosha.cancellation_note}</p>
            )}
          </div>

          <h2 style={{ ...styles.h2, marginTop: 44 }}>
            Yogas Present ({result.yogas_present.length} of {result.yogas.length} checked)
          </h2>
          {result.yogas_present.length === 0 ? (
            <p style={{ color: 'var(--ivory-dim)', fontSize: '0.92rem' }}>No yogas from this set were found in this chart.</p>
          ) : (
            <div style={styles.yogaGrid}>
              {result.yogas_present.map((y) => (
                <div key={y.name} style={styles.yogaCard}>
                  <h3 style={styles.yogaName}>{y.name}</h3>
                  <p style={styles.yogaDesc}>{y.description}</p>
                  <p style={styles.yogaDetail}>{y.detail}</p>
                </div>
              ))}
            </div>
          )}

          <details style={{ marginTop: 32 }}>
            <summary style={styles.summary}>Show all {result.yogas.length} yogas checked</summary>
            <div style={{ ...styles.yogaGrid, marginTop: 16 }}>
              {result.yogas.map((y) => (
                <div key={y.name} style={{ ...styles.yogaCard, opacity: y.present ? 1 : 0.5 }}>
                  <h3 style={styles.yogaName}>{y.name} {y.present ? '✓' : '—'}</h3>
                  <p style={styles.yogaDetail}>{y.detail}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

function DoshaCheck({ label, house, present }) {
  return (
    <div style={styles.doshaCheck}>
      <p style={styles.doshaCheckLabel}>{label}</p>
      <p style={{ ...styles.doshaCheckValue, color: present ? 'var(--vermillion)' : 'var(--sage-soft)' }}>
        House {house} {present ? '(afflicted)' : '(clear)'}
      </p>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  h2: { fontSize: '1.4rem', marginBottom: 18 },
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
  doshaCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 28,
  },
  doshaHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  doshaBadge: { padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700, color: 'var(--ivory)' },
  doshaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  doshaCheck: { background: 'rgba(247,240,227,0.04)', borderRadius: 4, padding: '12px 14px' },
  doshaCheckLabel: { fontSize: '0.72rem', color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
  doshaCheckValue: { fontSize: '0.95rem', fontWeight: 600, margin: '6px 0 0' },
  cancellationNote: { fontSize: '0.85rem', color: 'var(--gold-soft)', marginTop: 16, fontStyle: 'italic' },
  yogaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  yogaCard: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: '18px 20px',
  },
  yogaName: { fontSize: '1.05rem', margin: '0 0 8px' },
  yogaDesc: { fontSize: '0.85rem', color: 'var(--ivory-dim)', lineHeight: 1.5, margin: '0 0 8px' },
  yogaDetail: { fontSize: '0.78rem', color: 'var(--gold-soft)', margin: 0 },
  summary: { cursor: 'pointer', color: 'var(--gold-soft)', fontSize: '0.9rem', fontWeight: 600 },
};
