import AstroEmbed from '../components/AstroEmbed';

export default function Tarot() {
  return (
    <div className="container" style={{ padding: '56px 24px 80px' }}>
      <p style={styles.eyebrow}>Free · Draw a spread</p>
      <h1 style={styles.h1}>Tarot</h1>
      <p style={styles.sub}>Choose a spread and draw. No account needed, no deck to shuffle yourself.</p>

      <div style={styles.embedCard}>
        <AstroEmbed tool="tarot-reading" height={620} frameTitle="Tarot reading" />
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
