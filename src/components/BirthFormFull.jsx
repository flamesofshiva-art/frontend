import { useState } from 'react';

export default function BirthFormFull({ onSubmit, submitLabel = 'Generate', label, loading }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [utcOffset, setUtcOffset] = useState('5.5');

  const canSubmit = date && time && lat && lon;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      name, date, time, place,
      lat: parseFloat(lat), lon: parseFloat(lon),
      utc_offset_hours: parseFloat(utcOffset),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {label && <p style={styles.formLabel}>{label}</p>}
      <div style={styles.field}>
        <label style={styles.label}>Name (optional)</label>
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goldi" />
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Date of birth</label>
          <input style={styles.input} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Time of birth</label>
          <input style={styles.input} type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Place of birth</label>
        <input
          style={styles.input}
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="City, State, Country"
        />
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Latitude</label>
          <input style={styles.input} required value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 23.5158" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Longitude</label>
          <input style={styles.input} required value={lon} onChange={(e) => setLon(e.target.value)} placeholder="e.g. 87.308" />
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label}>UTC offset (hours)</label>
        <input style={styles.input} value={utcOffset} onChange={(e) => setUtcOffset(e.target.value)} placeholder="5.5 for India" />
      </div>
      <button type="submit" disabled={!canSubmit || loading} style={{ ...styles.button, opacity: (canSubmit && !loading) ? 1 : 0.5 }}>
        {loading ? 'Calculating…' : submitLabel}
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: 'rgba(247,240,227,0.03)',
    border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)',
    padding: 28,
  },
  formLabel: {
    fontSize: '0.85rem', color: 'var(--gold-soft)', fontWeight: 600,
    marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  field: { marginBottom: 16, flex: 1 },
  row: { display: 'flex', gap: 14 },
  label: {
    display: 'block', fontSize: '0.78rem', color: 'var(--ivory-dim)',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  input: {
    width: '100%', background: 'rgba(247,240,227,0.05)', border: '1px solid rgba(247,240,227,0.15)',
    borderRadius: 4, padding: '10px 12px', color: 'var(--ivory)', fontSize: '0.95rem', fontFamily: 'var(--font-body)',
  },
  button: {
    width: '100%', background: 'var(--vermillion)', color: 'var(--ivory)', border: 'none',
    borderRadius: 4, padding: '13px 20px', fontWeight: 600, fontSize: '0.95rem', marginTop: 6,
  },
};
