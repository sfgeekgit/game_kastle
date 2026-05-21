export function LoginRequired({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(70, 45, 10, 0.45) 0%, transparent 65%)',
      color: '#c8c0b0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Cinzel', Georgia, serif",
      gap: 28,
      padding: 32,
      textAlign: 'center',
    }}>
      <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600, color: '#c9a357', letterSpacing: '0.06em', textShadow: '0 0 40px rgba(201,163,87,0.3)' }}>
        Entry Denied
      </h2>
      <p style={{ margin: 0, maxWidth: 360, lineHeight: 1.7, fontSize: '0.9rem', color: '#8a7a60', fontFamily: 'inherit', letterSpacing: '0.03em' }}>
        This game is only available to members of the AFFINE discord, please log in.
      </p>
      <a
        href={`${import.meta.env.BASE_URL}api/auth/discord`}
        style={{
          display: 'inline-block',
          backgroundColor: '#3a3f8a',
          color: '#c8c0b0',
          padding: '9px 28px',
          border: '1px solid #5865F2',
          borderRadius: 3,
          textDecoration: 'none',
          fontWeight: 'bold',
          fontFamily: "'Cinzel', Georgia, serif",
          letterSpacing: '0.05em',
          fontSize: '0.85rem',
        }}
      >
        Login with Discord
      </a>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: '1px solid #3a2e18',
          color: '#5a4e38',
          borderRadius: 3,
          padding: '6px 20px',
          cursor: 'pointer',
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '0.78rem',
          letterSpacing: '0.05em',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
