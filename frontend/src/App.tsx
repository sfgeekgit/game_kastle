import { useState, useEffect, useRef } from 'react';
import { GameView } from './components/GameView.js';
import { CombatViewPixi } from './components/CombatViewPixi.js';
import { Overworld } from './components/Overworld.js';
import { api } from './api.js';
import { combatApi } from './combatApi.js';
import type { CombatSessionResult } from './combatApi.js';

interface AuthStatus {
  authenticated: boolean;
  userId?: string;
  isRegistered?: boolean;
  discordAvatarUrl?: string | null;
  discordLoginAvailable?: boolean;
  discordLoginRequired?: boolean;
  discordLoginUrl?: string | null;
}

type Screen = 'welcome' | 'frontend-game' | 'backend-game' | 'combat-pixi' | 'combat-server' | 'pvp-waiting' | 'overworld';

function App() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [screen, setScreen] = useState<Screen>('welcome');
  const discordError = new URLSearchParams(window.location.search).get('discord_error');
  const [loading, setLoading] = useState(true);
  const [networkedCombat, setNetworkedCombat] = useState<CombatSessionResult | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api
      .get<AuthStatus>('/auth/status')
      .then(setAuth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Cleanup PVP poll on unmount
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (screen === 'frontend-game') {
    return <GameView mode="frontend" onExit={() => setScreen('welcome')} myAvatarUrl={auth?.discordAvatarUrl} />;
  }

  if (screen === 'backend-game') {
    return <GameView mode="backend" onExit={() => setScreen('welcome')} myAvatarUrl={auth?.discordAvatarUrl} />;
  }

  if (screen === 'overworld') {
    return <Overworld onExit={() => setScreen('welcome')} />;
  }

  if (screen === 'combat-pixi') {
    return <CombatViewPixi onExit={() => setScreen('welcome')} />;
  }

  if (screen === 'combat-server' && networkedCombat) {
    return (
      <CombatViewPixi
        mode="networked"
        sessionId={networkedCombat.sessionId}
        side={networkedCombat.side}
        initialState={networkedCombat.state}
        onExit={() => { combatApi.leave(networkedCombat.sessionId).catch(console.error); setNetworkedCombat(null); setScreen('welcome'); }}
      />
    );
  }

  if (screen === 'pvp-waiting' && networkedCombat) {
    return (
      <div style={{ backgroundColor: '#1a1a2e', color: '#eee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', monospace" }}>
        <h2>Waiting for Player 2...</h2>
        <p style={{ color: '#888' }}>Session: {networkedCombat.sessionId}</p>
        <p style={{ color: '#aaa' }}>Open another browser (incognito) and click "PVP Combat Player 2"</p>
        <button onClick={() => {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          combatApi.leave(networkedCombat.sessionId).catch(console.error);
          setNetworkedCombat(null);
          setScreen('welcome');
        }} style={{ marginTop: 16, padding: '8px 24px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Haunted Hostačov</h1>
	<h3> Murder Mystery Part 2!</h3>
	<h4>Never mind... </h4><h4>Nick is not going to finish this before the seminar ends :( </h4>



	<br />
        {auth?.discordAvatarUrl ? (
          <div className="auth-status" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <img src={auth.discordAvatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #666' }} />
            <span>Welcome back</span>
            <button onClick={() => api.post('/auth/logout').then(() => { setAuth(null); setScreen('welcome'); window.location.reload(); })}
              style={{ background: 'none', border: '1px solid #666', color: '#aaa', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
              Log out
            </button>
          </div>
        ) : auth?.discordLoginAvailable ? (
          <div style={{ marginTop: 8 }}>
            <a href={`${import.meta.env.BASE_URL}api/auth/discord`} style={{ display: 'inline-block', backgroundColor: '#3a3f8a', color: '#c8c0b0', padding: '9px 22px', border: '1px solid #5865F2', borderRadius: 3, textDecoration: 'none', fontWeight: 'bold', fontFamily: "'Cinzel', Georgia, serif", letterSpacing: '0.05em', fontSize: '0.85rem' }}>
              Login with Discord
            </a>
            {auth.discordLoginRequired && (
              <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 6 }}>Login required to play.</p>
            )}
            {discordError && (
              <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: 6 }}>Login failed. You may not be a member of the required Discord server.</p>
            )}
          </div>
        ) : null}
	Discord login required <br/>You <b>must</b> be part of the AFFINE discord to play.
      </header>

      <main className="welcome-screen">
        <p className="welcome-intro">
        </p>

        <div className="play-buttons">
          <button className="play-btn play-btn-frontend" onClick={() => setScreen('backend-game')}>
            <span className="play-btn-title">Enter Castle</span>
          </button>
          <button className="play-btn play-btn-frontend" onClick={() => setScreen('overworld')} style={{ marginTop: '8px' }}>
            <span className="play-btn-title">View Castle</span>
          </button>
{/*


<button className="play-btn play-btn-frontend" onClick={() => setScreen('combat-pixi')} style={{ marginTop: '12px', backgroundColor: '#6b21a8' }}>
            <span className="play-btn-title">Combat (Pixi)</span>
          </button>
          <button className="play-btn play-btn-frontend" onClick={() =>
            combatApi.create('pve').then(result => {
              setNetworkedCombat(result);
              setScreen('combat-server');
            }).catch(err => alert(`Failed to create combat session: ${err.message}`))
          } style={{ marginTop: '8px', backgroundColor: '#1e6b3a' }}>
            <span className="play-btn-title">Combat (Server)</span>
          </button>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="play-btn play-btn-frontend" onClick={() => {
              combatApi.create('pvp').then(result => {
                setNetworkedCombat(result);
                setScreen('pvp-waiting');
                // Poll for game start (when player 2 joins, status changes to 'active')
                pollRef.current = setInterval(() => {
                  combatApi.getState(result.sessionId).then(stateResult => {
                    if (stateResult.status === 'active') {
                      if (pollRef.current) clearInterval(pollRef.current);
                      pollRef.current = null;
                      setNetworkedCombat({ sessionId: result.sessionId, side: result.side, state: stateResult.state });
                      setScreen('combat-server');
                    }
                  }).catch(() => {});
                }, 1000);
              }).catch(err => alert(`Failed: ${err.message}`));
            }} style={{ flex: 1, backgroundColor: '#8b4513', fontSize: 12, padding: '6px 10px' }}>
              <span className="play-btn-title" style={{ fontSize: 13 }}>PVP Combat Player 1</span>
            </button>
            <button className="play-btn play-btn-frontend" onClick={() => {
              combatApi.findPvp().then(result => {
                setNetworkedCombat(result);
                setScreen('combat-server');
              }).catch(() => alert('No PVP session waiting. Player 1 must create first.'));
            }} style={{ flex: 1, backgroundColor: '#8b4513', fontSize: 12, padding: '6px 10px' }}>
              <span className="play-btn-title" style={{ fontSize: 13 }}>PVP Combat Player 2</span>
            </button>
          </div>


*/}
        </div>
	<p>Dialog by Claude, based on "Names and Faces" info</p>
	<p>NPCs are whoever had an icon on the Poker site last week</p>
	<p>If you would like "your" NPC to be added/removed/changed <br/>just ask Nick!</p>


        <p className="controls-hint">
	The plan for this game was going to be so cool. A multi-player shared online sequel to the excellent Murder Mystery. You walk around the castle, talk to Fellows and Mentors, and build up points in valuable skills like "mech interp" and "decision theory" then, in real time, an un-aligned AI invades the castle and players must work together to fight it off.<br/> But instead, I switched my time to more  "real" alignment projects such as <a href="https://github.com/sfgeekgit/agentspace" target="_blank">agentspace</a>. Still occasionaly hacking on this a bit for fun...
	</p>
      </main>
    </div>
  );
}

export default App;
