export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>
          Flames of Shiva
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--ivory-dim)', opacity: 0.6 }}>
          Free forever. Lahiri ayanamsa, whole-sign houses.
        </span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: '1px solid rgba(247,240,227,0.1)',
    padding: '28px 0',
    marginTop: 80,
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
};
