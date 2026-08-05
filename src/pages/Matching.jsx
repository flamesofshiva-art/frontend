import AstroEmbed from '../components/AstroEmbed';

export default function Matching() {
  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Ashtakoot Guna Milan</p>
      <h1 style={styles.h1}>Kundali Matching</h1>
      <p style={styles.sub}>Enter both birth details for the 36-point Ashtakoot compatibility score.</p>

      <div style={styles.embedCard}>
        <AstroEmbed tool="kundli-matching" height={640} frameTitle="Kundali matching calculator" />
      </div>

      <div style={styles.secondary}>
        <h2 style={styles.h2}>Mangal Dosha</h2>
        <div style={styles.embedCard}>
          <AstroEmbed tool="mangal-dosha-calculator" height={420} frameTitle="Mangal Dosha calculator" />
        </div>
      </div>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  h2: { fontSize: '1.5rem', marginBottom: 16 },
  sub: { color: 'var(--ivory-dim)', maxWidth: 560, lineHeight: 1.6, marginBottom: 36 },
  embedCard: {
    background: 'var(--ivory)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', padding: 20, overflow: 'hidden',
  },
  secondary: { marginTop: 48 },
};
