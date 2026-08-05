import AstroEmbed from '../components/AstroEmbed';

export default function Numerology() {
  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Pythagorean system</p>
      <h1 style={styles.h1}>Numerology</h1>
      <p style={styles.sub}>Your life path, destiny, and soul urge numbers — from your name and birth date.</p>

      <div style={styles.embedCard}>
        <AstroEmbed tool="numerology-report" height={560} frameTitle="Numerology report" />
      </div>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  sub: { color: 'var(--ivory-dim)', maxWidth: 560, lineHeight: 1.6, marginBottom: 36 },
  embedCard: {
    background: 'var(--ivory)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 20, overflow: 'hidden',
  },
};
