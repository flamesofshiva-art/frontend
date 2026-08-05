import { Link } from 'react-router-dom';

const tools = [
  { to: '/kundali', title: 'Kundali', desc: 'Your birth chart — planets, houses, and current dasha, calculated from your exact time and place of birth.' },
  { to: '/matching', title: 'Matching', desc: 'Ashtakoot compatibility between two charts — the 36-point guna milan, plus mangal dosha.' },
  { to: '/tarot', title: 'Tarot', desc: 'Draw a spread and read what it says about where you stand today.' },
  { to: '/numerology', title: 'Numerology', desc: 'Life path, destiny, and soul urge numbers, drawn from your name and birth date.' },
  { to: '/chat', title: 'Ask', desc: 'Talk through your chart with an AI astrologer that reads directly from your kundali.' },
];

export default function Home() {
  return (
    <>
      <section style={styles.hero}>
        <div className="container">
          <p style={styles.eyebrow}>Vedic astrology, calculated precisely</p>
          <h1 style={styles.h1}>
            Every reading here starts<br />
            with your <em style={styles.em}>exact</em> chart.
          </h1>
          <p style={styles.sub}>
            Not a generic horoscope column. Enter your birth details once —
            date, time, place — and every tool on this site reads from the
            same real chart, calculated with Lahiri ayanamsa and whole-sign houses.
          </p>
          <Link to="/kundali" style={styles.cta}>
            Generate your kundali <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="container" style={{ marginTop: 64, paddingBottom: 40 }}>
        <div style={styles.grid}>
          {tools.map((t) => (
            <Link to={t.to} key={t.to} style={styles.card}>
              <h3 style={styles.cardTitle}>{t.title}</h3>
              <p style={styles.cardDesc}>{t.desc}</p>
              <span style={styles.cardArrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

const styles = {
  hero: {
    padding: '96px 0 56px',
    borderBottom: '1px solid rgba(247,240,227,0.08)',
    background: 'radial-gradient(circle at 15% 20%, rgba(201,67,42,0.08), transparent 55%)',
  },
  eyebrow: {
    color: 'var(--gold-soft)',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 600,
    marginBottom: 20,
  },
  h1: {
    fontSize: 'clamp(2.4rem, 5vw, 4rem)',
    maxWidth: 760,
    marginBottom: 24,
  },
  em: {
    color: 'var(--vermillion)',
    fontStyle: 'italic',
  },
  sub: {
    fontSize: '1.1rem',
    color: 'var(--ivory-dim)',
    maxWidth: 560,
    lineHeight: 1.6,
    marginBottom: 36,
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--vermillion)',
    color: 'var(--ivory)',
    padding: '14px 28px',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.98rem',
    transition: 'background 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 20,
  },
  card: {
    background: 'rgba(247,240,227,0.03)',
    border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)',
    padding: '28px 24px',
    position: 'relative',
    display: 'block',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: 10,
    color: 'var(--ivory)',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'var(--ivory-dim)',
    lineHeight: 1.55,
    margin: 0,
  },
  cardArrow: {
    position: 'absolute',
    top: 26,
    right: 24,
    color: 'var(--gold-soft)',
    opacity: 0.7,
  },
};
