import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // v3 is invisible — token is generated per-action, right before submit,
      // scored server-side by Supabase against your reCAPTCHA secret key.
      let captchaToken = null;
      if (executeRecaptcha) {
        captchaToken = await executeRecaptcha(mode === 'signup' ? 'signup' : 'signin');
      }

      const { error: authError } =
        mode === 'signup'
          ? await signUpWithEmail(email, password, captchaToken)
          : await signInWithEmail(email, password, captchaToken);

      if (authError) throw authError;

      if (mode === 'signup') {
        alert('Check your email to confirm your account.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error: authError } = await signInWithGoogle();
    if (authError) setError(authError.message);
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: 440 }}>
      <p style={styles.eyebrow}>{mode === 'signin' ? 'Welcome back' : 'Create an account'}</p>
      <h1 style={styles.h1}>{mode === 'signin' ? 'Sign in' : 'Sign up'}</h1>

      <button onClick={handleGoogle} style={styles.googleBtn}>
        Continue with Google
      </button>

      <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>

        <p style={styles.recaptchaNote}>
          Protected by reCAPTCHA — this site's use of reCAPTCHA is subject to
          Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={styles.link}>Privacy Policy</a> and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={styles.link}>Terms of Service</a>.
        </p>
      </form>

      <p style={styles.switchText}>
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
          style={styles.switchBtn}
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 },
  h1: { fontSize: '2.2rem', marginBottom: 28 },
  googleBtn: {
    width: '100%', background: 'var(--ivory)', color: 'var(--ink)', border: 'none',
    borderRadius: 6, padding: '13px 20px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
  },
  divider: { textAlign: 'center', margin: '24px 0', position: 'relative', borderTop: '1px solid rgba(247,240,227,0.15)' },
  dividerText: {
    background: 'var(--ink)', padding: '0 12px', position: 'relative', top: -10,
    color: 'var(--ivory-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  form: { display: 'flex', flexDirection: 'column' },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: '0.78rem', color: 'var(--ivory-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    width: '100%', background: 'rgba(247,240,227,0.05)', border: '1px solid rgba(247,240,227,0.15)',
    borderRadius: 4, padding: '10px 12px', color: 'var(--ivory)', fontSize: '0.95rem', fontFamily: 'var(--font-body)',
  },
  error: { color: 'var(--vermillion)', fontSize: '0.85rem', marginBottom: 14 },
  button: {
    background: 'var(--vermillion)', color: 'var(--ivory)', border: 'none',
    borderRadius: 4, padding: '13px 20px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
  },
  recaptchaNote: { fontSize: '0.72rem', color: 'var(--ivory-dim)', opacity: 0.6, lineHeight: 1.5, marginTop: 14 },
  link: { color: 'var(--gold-soft)' },
  switchText: { textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--ivory-dim)' },
  switchBtn: { background: 'none', border: 'none', color: 'var(--gold-soft)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.88rem' },
};
