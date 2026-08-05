import { useState } from 'react';
import BirthFormFull from '../components/BirthFormFull';
import { computeSummary } from '../lib/api';

const TABS = ['General', 'Remedies', 'Dosha', 'Ascendant', 'Planetary', 'Vimshottari', 'Yoga'];
const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export default function Summary() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('General');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await computeSummary(data);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Full report</p>
      <h1 style={styles.h1}>Summary</h1>
      <p style={styles.sub}>
        Everything in one place — general overview, remedies, dosha, ascendant,
        planetary positions, Vimshottari dasha, and yogas.
      </p>

      <div style={styles.notice}>
        Requires the backend running (see /backend/README.md).
      </div>

      <BirthFormFull onSubmit={handleSubmit} submitLabel="Generate summary" loading={loading} />

      {error && <div style={styles.errorBox}>{error}</div>}

      {result && (
        <div style={{ marginTop: 40 }}>
          <div style={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  ...styles.tab,
                  background: tab === t ? 'var(--vermillion)' : 'transparent',
                  color: tab === t ? 'var(--ivory)' : 'var(--ivory-dim)',
                  borderColor: tab === t ? 'var(--vermillion)' : 'rgba(247,240,227,0.15)',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={styles.panel}>
            {tab === 'General' && <GeneralTab data={result.general} />}
            {tab === 'Remedies' && <RemediesTab data={result.remedies} />}
            {tab === 'Dosha' && <DoshaTab data={result.dosha} />}
            {tab === 'Ascendant' && <AscendantTab data={result.ascendant} />}
            {tab === 'Planetary' && <PlanetaryTab data={result.planetary} />}
            {tab === 'Vimshottari' && <VimshottariTab data={result.vimshottari} />}
            {tab === 'Yoga' && <YogaTab present={result.yogas_present} all={result.yoga} />}
          </div>
        </div>
      )}
    </div>
  );
}

function GeneralTab({ data }) {
  return (
    <div style={styles.statGrid}>
      <Stat label="Lagna" value={data.lagna} />
      <Stat label="Moon Sign" value={data.moon_sign} />
      <Stat label="Moon Nakshatra" value={data.moon_nakshatra} />
      <Stat label="Sun Sign" value={data.sun_sign} />
      <Stat label="Current Mahadasha" value={data.current_mahadasha} />
      <Stat label="Manglik" value={data.is_manglik ? 'Yes' : 'No'} />
      <Stat label="Yogas Found" value={data.yogas_count} />
    </div>
  );
}

function RemediesTab({ data }) {
  return (
    <div>
      <p style={styles.disclaimer}>{data.general_note}</p>
      {data.remedies.length === 0 ? (
        <p style={{ color: 'var(--ivory-dim)' }}>No specific remedies flagged for this chart.</p>
      ) : (
        <div style={styles.cardGrid}>
          {data.remedies.map((r, i) => (
            <div key={i} style={styles.card}>
              <h3 style={styles.cardTitle}>{r.planet}</h3>
              <p style={styles.cardText}>{r.reason}</p>
              <div style={styles.remedyGrid}>
                <span><strong>Gemstone:</strong> {r.gemstone}</span>
                <span><strong>Metal:</strong> {r.metal}</span>
                <span><strong>Finger:</strong> {r.finger}</span>
                <span><strong>Wear day:</strong> {r.wear_day}</span>
                <span><strong>Mantra:</strong> {r.mantra}</span>
                <span><strong>Deity:</strong> {r.deity}</span>
              </div>
              <p style={styles.cardText}>{r.charity}</p>
              {r.specific_practice && <p style={styles.cardText}>{r.specific_practice}</p>}
              <p style={styles.gemNote}>{r.gemstone_note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoshaTab({ data }) {
  return (
    <div>
      <div style={styles.doshaHeader}>
        <span style={{ ...styles.badge, background: data.is_manglik ? 'var(--vermillion)' : 'var(--sage)' }}>
          {data.is_manglik ? 'Manglik' : 'Not Manglik'}
        </span>
        <span style={{ color: 'var(--ivory-dim)' }}>Mars in {data.mars_rashi}</span>
      </div>
      <div style={styles.statGrid}>
        <Stat label="From Lagna" value={`House ${data.house_from_lagna} — ${data.manglik_from_lagna ? 'afflicted' : 'clear'}`} />
        <Stat label="From Moon" value={`House ${data.house_from_moon} — ${data.manglik_from_moon ? 'afflicted' : 'clear'}`} />
        <Stat label="From Venus" value={`House ${data.house_from_venus} — ${data.manglik_from_venus ? 'afflicted' : 'clear'}`} />
      </div>
      {data.cancellation_note && <p style={styles.disclaimer}>{data.cancellation_note}</p>}
    </div>
  );
}

function AscendantTab({ data }) {
  return (
    <div style={styles.statGrid}>
      <Stat label="Longitude" value={`${data.longitude}°`} />
      <Stat label="Rashi" value={data.rashi} />
      <Stat label="Rashi Lord" value={data.rashi_lord} />
      <Stat label="Nakshatra" value={data.nakshatra} />
      <Stat label="Nakshatra Lord" value={data.nakshatra_lord} />
    </div>
  );
}

function PlanetaryTab({ data }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {['Planet', 'Rashi', 'House', 'Nakshatra', 'Nak. Lord'].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PLANET_ORDER.map((p) => (
          <tr key={p}>
            <td style={styles.td}>{p}</td>
            <td style={styles.td}>{data[p]?.rashi}</td>
            <td style={styles.td}>{data[p]?.house}</td>
            <td style={styles.td}>{data[p]?.nakshatra}</td>
            <td style={styles.td}>{data[p]?.nakshatra_lord}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VimshottariTab({ data }) {
  return (
    <div>
      <div style={styles.statGrid}>
        <Stat label="Nakshatra" value={data.nakshatra} />
        <Stat label="Current Mahadasha" value={data.current_mahadasha?.lord} />
        <Stat label="Current Antardasha" value={data.current_antardasha?.lord} />
      </div>
      <table style={{ ...styles.table, marginTop: 24 }}>
        <thead>
          <tr>{['Lord', 'From', 'To', 'Years'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.full_timeline.map((d, i) => (
            <tr key={i}>
              <td style={styles.td}>{d.lord}{d.partial ? ' (partial)' : ''}</td>
              <td style={styles.td}>{d.from}</td>
              <td style={styles.td}>{d.to}</td>
              <td style={styles.td}>{d.years}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YogaTab({ present, all }) {
  return (
    <div>
      <p style={{ color: 'var(--gold-soft)', marginBottom: 16 }}>{present.length} of {all.length} yogas present</p>
      <div style={styles.cardGrid}>
        {present.map((y) => (
          <div key={y.name} style={styles.card}>
            <h3 style={styles.cardTitle}>{y.name}</h3>
            <p style={styles.cardText}>{y.description}</p>
            <p style={styles.gemNote}>{y.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value ?? '—'}</p>
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
  tab: { border: '1px solid', borderRadius: 20, padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  panel: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 28,
  },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  stat: { background: 'rgba(247,240,227,0.04)', borderRadius: 4, padding: '12px 14px' },
  statLabel: { fontSize: '0.72rem', color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
  statValue: { fontSize: '1rem', fontWeight: 600, margin: '4px 0 0' },
  badge: { padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700, color: 'var(--ivory)' },
  doshaHeader: { display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 },
  disclaimer: { fontSize: '0.85rem', color: 'var(--gold-soft)', fontStyle: 'italic', marginTop: 16, lineHeight: 1.6 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  card: { background: 'rgba(247,240,227,0.04)', border: '1px solid rgba(247,240,227,0.08)', borderRadius: 6, padding: '18px 20px' },
  cardTitle: { fontSize: '1.05rem', margin: '0 0 8px' },
  cardText: { fontSize: '0.85rem', color: 'var(--ivory-dim)', lineHeight: 1.5, margin: '0 0 8px' },
  remedyGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '0.82rem', margin: '10px 0' },
  gemNote: { fontSize: '0.72rem', color: 'var(--gold-soft)', opacity: 0.8, marginTop: 8 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
  th: { textAlign: 'left', padding: '8px 6px', color: 'var(--gold-soft)', fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(247,240,227,0.15)' },
  td: { padding: '9px 6px', borderBottom: '1px solid rgba(247,240,227,0.06)' },
};
