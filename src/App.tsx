import { useEffect, useMemo, useState } from 'react';
import './index.css';
import { BUILDINGS, buildStartingState, calculateIncome, FORMATIONS, getBuildingUpgradeCost, nextDayState, playFriendly, setFormation, setLineupPlayer, trainPlayers, upgradeBuilding, type BuildingKey } from './data';
import { loadGame, saveGame } from './storage';
import type { Formation, GameState } from './types';

const tabs = [
  { id: 'club', label: 'Club', icon: '🛡️' }, { id: 'academy', label: 'Academia', icon: '⚽' },
  { id: 'lineup', label: 'Once', icon: '📋' }, { id: 'matches', label: 'Partidos', icon: '🏆' },
  { id: 'buildings', label: 'Sede', icon: '🏟️' }, { id: 'missions', label: 'Retos', icon: '🎯' }
] as const;
type Tab = typeof tabs[number]['id'];
type Action = 'train' | 'match' | 'day' | null;
const money = (amount: number) => `${Math.round(amount).toLocaleString('es-ES')} €`;

export default function App() {
  const [game, setGame] = useState<GameState | null>(() => loadGame());
  const [tab, setTab] = useState<Tab>('club');
  const [clubName, setClubName] = useState('Academia del Norte');
  const [action, setAction] = useState<Action>(null);
  const [actionLabel, setActionLabel] = useState('');
  useEffect(() => { if (game) saveGame(game); }, [game]);
  const average = useMemo(() => game ? Math.round(game.players.reduce((sum, p) => sum + p.rating, 0) / game.players.length) : 0, [game]);
  const runAction = (kind: Exclude<Action, null>, label: string, update: (state: GameState) => GameState, duration = 1500) => {
    if (!game || action) return;
    setAction(kind); setActionLabel(label);
    window.setTimeout(() => { setGame((state) => state ? update(state) : state); setAction(null); }, duration);
  };
  const train = (mode: 'individual' | 'collective') => runAction('train', mode === 'individual' ? 'Sesión individual en curso' : 'Entrenamiento colectivo en curso', (s) => trainPlayers(s, mode), 1700);
  const match = (name: string) => runAction('match', `Preparando el partido contra ${name}`, (s) => playFriendly(s, name), 2800);
  const advanceDay = () => runAction('day', 'Cierre de jornada y recuperación', nextDayState, 1700);
  const reset = () => { if (window.confirm('¿Borrar la partida y crear un club nuevo?')) { localStorage.removeItem('football-academy-manager-save'); setGame(null); setTab('club'); } };

  if (!game) return <div className="welcome-screen"><div className="welcome-card">
    <div className="brand-mark">⚽</div><div className="kicker">TU HISTORIA EMPIEZA AQUÍ</div><h1>De academia<br /><span>a leyenda.</span></h1>
    <p>Construye tu club desde cero. Forma jóvenes talentos, compite y convierte cada decisión en progreso.</p>
    <label htmlFor="club-name">NOMBRE DE TU CLUB</label><input id="club-name" value={clubName} maxLength={26} onChange={(e) => setClubName(e.target.value)} placeholder="Ej. Academia del Norte" />
    <button className="button primary full" onClick={() => setGame(buildStartingState(clubName.trim() || 'Academia del Norte'))}>Crear mi academia <span>→</span></button>
    <small>Tu progreso se guarda automáticamente en este dispositivo.</small>
  </div></div>;

  const upgrade = (key: BuildingKey) => setGame((s) => s && upgradeBuilding(s, key));
  const slots = FORMATIONS[game.formation];
  const slotData = slots.flatMap((count, row) => Array.from({ length: count }, (_, index) => ({ row, index, number: slots.slice(0, row).reduce((a, b) => a + b, 0) + index })));
  const roleNames = ['Portero', 'Defensa', 'Mediocampo', 'Delantero'];
  const rowNames = slots.length === 5 ? ['Portero', 'Defensa', 'Mediocampo', 'Mediapunta', 'Delantero'] : roleNames;

  return <div className="app-shell">
    <header className="topbar"><div className="club-identity"><div className="crest">⚽</div><div><div className="kicker">ACADEMIA · DÍA {game.day}</div><h1>{game.clubName}</h1></div></div><div className="cash-pill"><span>💰</span>{money(game.money)}</div></header>
    <main className="main-content">
      {tab === 'club' && <>
        <section className="hero-banner"><div className="hero-copy"><span className="season-tag">TEMPORADA 1 · ACADEMIA</span><h2>El futuro<br />se entrena.</h2><p>Tu camino hacia la élite empieza en casa.</p><button className="button light" onClick={() => setTab('academy')}>Ir a entrenar <span>→</span></button></div><div className="hero-ball">⚽</div><div className="hero-stadium">✦ &nbsp; ✦ &nbsp; ✦</div></section>
        <section className="stats-grid"><Stat label="REPUTACIÓN" value={`${game.reputation}`} icon="⭐" /><Stat label="MEDIA PLANTILLA" value={`${average}`} icon="📈" /><Stat label="INGRESO / DÍA" value={money(calculateIncome(game))} icon="💸" /></section>
        <section className="section-heading"><div><div className="kicker">TU EQUIPO</div><h2>Plantilla principal</h2></div><button className="text-action" onClick={() => setTab('lineup')}>Ver alineación →</button></section>
        <div className="player-list">{game.players.map((p, index) => <PlayerCard key={p.id} player={p} index={index} />)}</div>
        <section className="daily-card"><div><div className="kicker">GESTIÓN DIARIA</div><strong>Avanza un día</strong><p>Recibe ingresos y recupera la forma del equipo.</p></div><button className="button primary" disabled={Boolean(action)} onClick={advanceDay}>Avanzar →</button></section>
      </>}
      {tab === 'academy' && <>
        <PageTitle eyebrow="DESARROLLO DE TALENTO" title="Centro de entrenamiento" description="Entrena a tus jugadores y ayúdales a alcanzar su potencial." />
        <div className="training-options"><article className="feature-card"><div className="feature-icon">🎯</div><h3>Sesión individual</h3><p>Mejora a un jugador al azar con atención personalizada.</p><button className="button primary full" disabled={Boolean(action) || game.money < 100} onClick={() => train('individual')}>Entrenar · 100 €</button></article><article className="feature-card"><div className="feature-icon">🤝</div><h3>Sesión colectiva</h3><p>Entrena a toda la plantilla; cuesta más y genera fatiga.</p><button className="button primary full" disabled={Boolean(action) || game.money < 160} onClick={() => train('collective')}>Entrenar · 160 €</button></article></div>
        <div className="notice">💡 Los jugadores jóvenes pueden crecer hasta su potencial máximo. Entrenar cuesta dinero y reduce su forma física.</div>
        <div className="section-heading"><div><div className="kicker">PROGRESO</div><h2>Jugadores</h2></div></div><div className="player-list">{game.players.map((p, i) => <PlayerCard key={p.id} player={p} index={i} detailed />)}</div>
      </>}
      {tab === 'lineup' && <>
        <PageTitle eyebrow="PLANTEAMIENTO DEL EQUIPO" title="Alineación" description="Elige una formación y asigna titulares. Tu once influye en la fuerza usada en los amistosos." />
        <label className="formation-select-label" htmlFor="formation">FORMACIÓN</label><select className="formation-select" id="formation" value={game.formation} onChange={(e) => setGame((s) => s && setFormation(s, e.target.value as Formation))}>{Object.keys(FORMATIONS).map((f) => <option key={f} value={f}>{f}</option>)}</select>
        <div className="pitch"><div className="pitch-lines"><span className="center-circle" /><span className="center-line" /></div>{slotData.map((slot) => { const playerId = game.lineup[slot.number] ?? game.players[slot.number % game.players.length].id; const chosen = game.players.find((p) => p.id === playerId)!; return <div className="pitch-row" key={slot.number}><label className="pitch-slot"><span className="shirt">👕</span><strong>{chosen.rating}</strong><select aria-label={`${rowNames[slot.row] ?? 'Jugador'} ${slot.index + 1}`} value={playerId} onChange={(e) => setGame((s) => s && setLineupPlayer(s, slot.number, Number(e.target.value)))}>{game.players.map((p) => <option key={p.id} value={p.id} disabled={game.lineup.includes(p.id) && p.id !== playerId}>{p.name} · {p.position}</option>)}</select></label></div>; })}</div>
        <div className="notice">Cada futbolista solo puede ocupar un puesto. Cambia las selecciones del campo para ajustar tu once titular.</div>
        <div className="player-list">{game.lineup.map((id, i) => { const p = game.players.find((item) => item.id === id); return p ? <div className="lineup-summary" key={id}><b>{i + 1}. {p.name}</b><span>{p.position} · media {p.rating} · forma {p.fitness}%</span></div> : null; })}</div>
      </>}
      {tab === 'matches' && <>
        <PageTitle eyebrow="COMPETICIÓN LOCAL" title="Partidos amistosos" description="Elige un rival. Cada partido paga ingresos y afecta a la moral y forma." />
        <div className="notice">Tu media es <b>{average}</b>. La alineación titular y el estado de forma influyen en la fuerza del equipo.</div>
        <div className="rival-list">{game.rivals.map((r) => <article className="rival-card" key={r.id}><div className="rival-crest">🛡️</div><div className="rival-info"><b>{r.name}</b><span>{r.style} · Fuerza {r.strength}</span></div><div className="rival-level">{r.strength}</div><button className="button primary" disabled={Boolean(action)} onClick={() => match(r.name)}>Jugar</button></article>)}</div>
        <div className="section-heading"><div><div className="kicker">RESULTADOS</div><h2>Historial</h2></div></div>
        {game.matchHistory.length === 0 ? <div className="empty-card">Aún no hay partidos. ¡Elige un rival para empezar!</div> : <div className="history-list">{game.matchHistory.map((m) => <div className="history-row" key={m.id}><span>DÍA {m.day}</span><b>{game.clubName}</b><strong>{m.score}</strong><b>{m.opponent}</b><em className={`result ${m.result}`}>{m.result === 'W' ? 'VICTORIA' : m.result === 'D' ? 'EMPATE' : 'DERROTA'}</em></div>)}</div>}
      </>}
      {tab === 'buildings' && <>
        <PageTitle eyebrow="TU COMPLEJO DEPORTIVO" title="Instalaciones" description="Invierte en tu sede para mejorar el club y aumentar los ingresos diarios." />
        <div className="wallet-line">Disponible <strong>{money(game.money)}</strong></div>
        <div className="building-list">{(Object.entries(BUILDINGS) as [BuildingKey, typeof BUILDINGS[BuildingKey]][]).map(([key, info]) => { const level = game.buildings[key] ?? 1; const cost = getBuildingUpgradeCost(key, level); return <article className="building-card" key={key}><div className="building-icon">{info.icon}</div><div className="building-info"><div className="building-title"><h3>{info.name}</h3><span>NIVEL {level}</span></div><p>{info.description}</p><small>+{info.income} € ingreso diario por nivel</small></div><button className="button upgrade" disabled={game.money < cost} onClick={() => upgrade(key)}>{money(cost)}<span>↑</span></button></article>; })}</div>
        <div className="daily-card"><div><div className="kicker">COBRAR INGRESOS</div><strong>Ingreso del día: {money(calculateIncome(game))}</strong><p>Avanza un día para cobrar y recuperar a tus jugadores.</p></div><button className="button primary" disabled={Boolean(action)} onClick={advanceDay}>Avanzar →</button></div>
      </>}
      {tab === 'missions' && <>
        <PageTitle eyebrow="OBJETIVOS DEL CLUB" title="Retos y recompensas" description="Completa objetivos para conseguir dinero y hacer crecer tu academia." />
        <div className="mission-list">{game.missions.map((m) => <article className={`mission-card ${m.completed ? 'done' : ''}`} key={m.id}><div className="mission-icon">{m.completed ? '✅' : '🎯'}</div><div className="mission-info"><h3>{m.title}</h3><p>{m.description}</p><div className="progress-track"><i style={{ width: `${Math.min(100, m.progress / m.goal * 100)}%` }} /></div><small>{Math.min(m.progress, m.goal)} / {m.goal}</small></div><strong className="reward">+{money(m.reward)}</strong></article>)}</div>
        <section className="section-heading"><div><div className="kicker">ACTIVIDAD RECIENTE</div><h2>Registro del club</h2></div></section><div className="log-list">{game.logs.map((log, i) => <div key={`${i}-${log}`} className="log-row"><span>◈</span>{log}</div>)}</div><button className="reset-button" onClick={reset}>Borrar partida y empezar de nuevo</button>
      </>}
    </main>
    <nav className="bottom-nav">{tabs.map((item) => <button key={item.id} className={tab === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(item.id)}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>
    {action && <div className={`action-overlay ${action}`} role="status" aria-live="polite"><div className="action-card"><div className="animation-scene">{action === 'match' ? <><div className="goal-net">🥅</div><div className="moving-ball">⚽</div><div className="stadium-lights">✦ ✦ ✦</div></> : action === 'train' ? <><div className="training-cone">🔶</div><div className="moving-ball">⚽</div><div className="training-cone second">🔶</div></> : <><div className="sunrise">🌤️</div><div className="day-rays">✦ ✦ ✦</div></>}</div><div className="action-title">{actionLabel}</div><div className="action-progress"><i /></div><small>{action === 'match' ? 'El equipo está en el campo…' : action === 'train' ? 'La sesión está en marcha…' : 'Calculando ingresos y recuperación…'}</small></div></div>}
  </div>;
}
function Stat({ label, value, icon }: { label: string; value: string; icon: string }) { return <article className="stat-card"><span>{icon}</span><small>{label}</small><strong>{value}</strong></article>; }
function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="page-title"><div className="kicker">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>; }
function PlayerCard({ player: p, index, detailed = false }: { player: GameState['players'][number]; index: number; detailed?: boolean }) { return <article className="player-card"><div className={`player-avatar avatar-${index % 5}`}>{p.position === 'POR' ? '��' : p.position === 'DEF' ? '🛡️' : p.position === 'MED' ? '⚡' : '🔥'}</div><div className="player-main"><div className="player-name">{p.name}<span>{p.nationality} · {p.age} años</span></div><div className="player-meta"><span className="position-chip">{p.position}</span><div className="potential">POT <b>{p.potential}</b></div></div><div className="meter"><i style={{ width: `${p.fitness}%` }} /></div><small className="fitness-label">Forma {p.fitness}% · Moral {p.morale}</small>{detailed && <div className="attribute-row"><span>VEL <b>{p.pace}</b></span><span>PAS <b>{p.passing}</b></span><span>REG <b>{p.dribbling}</b></span><span>TIR <b>{p.shooting}</b></span><span>DEF <b>{p.defense}</b></span><span>EXP <b>{p.experience}</b></span></div>}</div><div className="overall"><strong>{p.rating}</strong><small>MEDIA</small></div></article>; }
