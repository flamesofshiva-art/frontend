import { useState, useRef, useEffect } from 'react';

const DAILY_LIMIT = 5; // matches the cost-control decision: capped messages/day/user

// PLACEHOLDER: replace with a real call to your backend, which calls the Claude API
// server-side with the system prompt + kundali JSON as context (never call Claude
// directly from the browser — the API key must stay server-side).
async function mockAskAstrologer(message) {
  await new Promise((r) => setTimeout(r, 900));
  return `(Demo reply — wire this to your backend's Claude API call.) You asked about "${message.slice(0, 40)}${message.length > 40 ? '…' : ''}" — a real response would reference your actual chart here.`;
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'astrologer', text: "Namaste. I've read your chart — ask me anything about your lagna, dasha, or what's ahead." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [count, setCount] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending || count >= DAILY_LIMIT) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setSending(true);
    setCount((c) => c + 1);
    const reply = await mockAskAstrologer(userMsg);
    setMessages((m) => [...m, { role: 'astrologer', text: reply }]);
    setSending(false);
  };

  const atLimit = count >= DAILY_LIMIT;

  return (
    <div className="container" style={{ padding: '56px 24px 80px', maxWidth: 760 }}>
      <p style={styles.eyebrow}>Free · AI astrologer</p>
      <h1 style={styles.h1}>Ask</h1>
      <p style={styles.sub}>
        Grounded in your kundali — {DAILY_LIMIT} messages a day, free.
        {' '}({count}/{DAILY_LIMIT} used today)
      </p>

      <div style={styles.chatWindow}>
        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} style={{ ...styles.bubbleRow, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ ...styles.bubble, ...(m.role === 'user' ? styles.userBubble : styles.astroBubble) }}>
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div style={styles.bubbleRow}>
              <div style={{ ...styles.bubble, ...styles.astroBubble, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="flame" aria-hidden="true" /> thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={atLimit ? "You've reached today's free limit" : 'Ask about your chart…'}
            disabled={atLimit || sending}
          />
          <button onClick={send} disabled={atLimit || sending || !input.trim()} style={styles.sendBtn}>
            Send
          </button>
        </div>
      </div>

      <div style={styles.notice}>
        Demo mode — replies are placeholders. Wire <code>mockAskAstrologer()</code> to a
        backend endpoint that calls the Claude API server-side with the kundali JSON as context.
      </div>
    </div>
  );
}

const styles = {
  eyebrow: { color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  h1: { fontSize: '2.6rem', marginBottom: 12 },
  sub: { color: 'var(--ivory-dim)', lineHeight: 1.6, marginBottom: 28, fontSize: '0.92rem' },
  chatWindow: {
    background: 'rgba(247,240,227,0.03)', border: '1px solid rgba(247,240,227,0.09)',
    borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', height: 480,
  },
  messages: { flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  bubbleRow: { display: 'flex' },
  bubble: { maxWidth: '75%', padding: '10px 15px', borderRadius: 14, fontSize: '0.92rem', lineHeight: 1.5 },
  userBubble: { background: 'var(--vermillion)', color: 'var(--ivory)', borderBottomRightRadius: 4 },
  astroBubble: { background: 'rgba(247,240,227,0.08)', color: 'var(--ivory)', borderBottomLeftRadius: 4 },
  inputRow: { display: 'flex', gap: 10, padding: 16, borderTop: '1px solid rgba(247,240,227,0.09)' },
  input: {
    flex: 1, background: 'rgba(247,240,227,0.05)', border: '1px solid rgba(247,240,227,0.15)',
    borderRadius: 20, padding: '10px 16px', color: 'var(--ivory)', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
  },
  sendBtn: {
    background: 'var(--vermillion)', color: 'var(--ivory)', border: 'none',
    borderRadius: 20, padding: '10px 22px', fontWeight: 600, fontSize: '0.88rem',
  },
  notice: {
    marginTop: 20, background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.3)',
    borderRadius: 6, padding: '12px 16px', fontSize: '0.8rem', color: 'var(--gold-soft)', lineHeight: 1.6,
  },
};
