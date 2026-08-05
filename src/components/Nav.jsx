import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/kundali', label: 'Kundali' },
  { to: '/matching', label: 'Matching' },
  { to: '/tarot', label: 'Tarot' },
  { to: '/numerology', label: 'Numerology' },
  { to: '/kp', label: 'KP' },
  { to: '/divisional-charts', label: 'Vargas' },
  { to: '/doshas-yogas', label: 'Doshas' },
  { to: '/summary', label: 'Summary' },
  { to: '/chat', label: 'Ask' },
];

export default function Nav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <NavLink to="/" style={styles.brand}>
          <span className="flame" aria-hidden="true" style={{ marginRight: 10 }} />
          Flames of Shiva
        </NavLink>
        <nav style={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                ...styles.link,
                color: isActive ? 'var(--gold-soft)' : 'var(--ivory-dim)',
                borderBottomColor: isActive ? 'var(--vermillion)' : 'transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div style={styles.authArea}>
              <span style={styles.userEmail}>{user.email}</span>
              <button onClick={handleSignOut} style={styles.authBtn}>Sign out</button>
            </div>
          ) : (
            <NavLink to="/login" style={styles.authBtn}>Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    borderBottom: '1px solid rgba(247,240,227,0.1)',
    position: 'sticky',
    top: 0,
    background: 'rgba(26,20,16,0.92)',
    backdropFilter: 'blur(8px)',
    zIndex: 10,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    color: 'var(--ivory)',
    letterSpacing: '0.01em',
  },
  nav: {
    display: 'flex',
    gap: 28,
    alignItems: 'center',
  },
  link: {
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '22px 0',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s ease, border-color 0.2s ease',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userEmail: {
    fontSize: '0.82rem',
    color: 'var(--ivory-dim)',
  },
  authBtn: {
    background: 'var(--vermillion)',
    color: 'var(--ivory)',
    border: 'none',
    borderRadius: 20,
    padding: '8px 18px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
