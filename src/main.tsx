import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import { buildStartingState, BUILDINGS, calculateIncome, getBuildingUpgradeCost, nextDayState, playFriendly, trainPlayers, upgradeBuilding } from './data';
import { loadGame, saveGame } from './storage';
import type { GameState } from './types';

const DEFAULT_SCREEN = 'club';
const STORAGE_KEY = 'football-academy-manager-save';

function App() {
  const [game, setGame] = useState<GameState | null>(() => {
    const saved = loadGame();
    return saved ?? null;
  });
  const [screen, setScreen] = useState<string>(DEFAULT_SCREEN);
  const [clubName, setClubName] = useState('Academia del Norte');

  useEffect(() => {
    if (game) {
      saveGame(game);
    }
  }, [game]);

  const createNewClub = () => {
    const finalName = clubName.trim() || 'Academia del Norte';
    const state = buildStartingState(finalName);
    setGame(state);
    setScreen('club');
  };

  const handleTrain = (mode: 'individual' | 'collective') => {
    if (!game) return;
    setGame((prev) => (prev ? trainPlayers(prev, mode) : prev));
  };

  const handleFriendly = (opponent: string) => {
    if (!game) return;
    setGame((prev) => (prev ? playFriendly(prev, opponent) : prev));
  };

  const handleUpgrade = (key: string) => {
    if (!game) return;
    setGame((prev) => (prev ? upgradeBuilding(prev, key) : prev));
  };

  const handleNextDay = () => {
    if (!game) return;
    setGame((prev) => (prev ? nextDayState(prev) : prev));
  };

  const averageRating = useMemo(() => {
    if (!game || !game.players.length) return 0;
    return Math.round(game.players.reduce((sum, player) => sum + player.rating, 0) / game.players.length);
  }, [game]);

  const income = useMemo(() => {
    if (!game) return 0;
    return calculateIncome(game);
  }, [game]);

  if (!game) {
    return (
      <div className="app-shell intro-shell">
        <div className="intro-card">
          <div className="badge">MVP</div>
          <h1>Football Academy Manager</h1>
          <p>Construye tu academia, forma talento, gestiona el club y domina la progresión desde cero.</p>

          <label className="input-label">Nombre del club</label>
          <input
            className="text-input"
            value={clubName}
            onChange={(event) => setClubName(event.target.value)}
            placeholder="Academia del Norte"
          />

          <button className="primary-button" onClick={createNewClub}>Crear mi academia</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Club</div>
          <h2>{game.clubName}</h2>
        </div>
        <div className="stat-stack">
          <div className="mini-stat">
            <span>Día</span>
            <strong>{game.day}</strong>
          </div>
          <div className="mini-stat">
            <span>Dinero</span>
            <strong>{game.money}€</strong>
          </div>
        </div>
      </header>

      <main className="content">
        {screen === 'club' && (
          <section className="panel-grid">
            <div className="panel highlight">
              <div className="panel-header">
                <h3>Resumen del club</h3>
              </div>
              <div className="cards-grid">
                <div className="detail-card">
                  <span>Reputación</span>
                  <strong>{game.reputation}</strong>
                </div>
                <div className="detail-card">
                  <span>Media del equipo</span>
                  <strong>{averageRating}</strong>
                </div>
                <div className="detail-card">
                  <span>Ingreso neto</span>
                  <strong>{income}€</strong>
                </div>
                <div className="detail-card">
                  <span>Estadio</span>
                  <strong>{game.stadiumCapacity}</strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Plantilla</h3>
              </div>
              <div className="players-stack">
                {game.players.map((player) => (
                  <div className="player-card" key={player.id}>
                    <div className="player-topline">
                      <div>
                        <b>{player.name}</b>
                        <small>{player.position}</small>
                      </div>
                      <span className="rating-pill">{player.rating}</span>
                    </div>
                    <div className="stats-row">
                      <span>Edad {player.age}</span>
                      <span>Potencia {player.potential}</span>
                    </div>
                    <div className="stats-row">
                      <span>Pase {player.passing}</span>
                      <span>Vel {player.pace}</span>
                    </div>
                    <div className="stats-row">
                      <span>Fit {player.fitness}</span>
                      <span>Mor {player.morale}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {screen === 'academy' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Academia y entrenamiento</h3>
              <div className="inline-actions">
                <button className="secondary-button" onClick={() => handleTrain('individual')}>Entrenamiento individual</button>
                <button className="secondary-button" onClick={() => handleTrain('collective')}>Entrenamiento colectivo</button>
              </div>
            </div>

            <div className="players-stack">
              {game.players.map((player) => (
                <div className="player-card" key={player.id}>
                  <div className="player-topline">
                    <div>
                      <b>{player.name}</b>
                      <small>{player.position}</small>
                    </div>
                    <span className="rating-pill">{player.rating}</span>
                  </div>
                  <div className="stats-row">
                    <span>Físico {player.fitness}</span>
                    <span>Morale {player.morale}</span>
                  </div>
                  <div className="stats-row">
                    <span>Pase {player.passing}</span>
                    <span>Tiro {player.shooting}</span>
                  </div>
                  <div className="stats-row">
                    <span>Valor {player.marketValue}€</span>
                    <span>Salario {player.salary}€</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'fixtures' && (
          <section className="panel-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Amistosos</h3>
              </div>
              <div className="players-stack">
                {game.rivals.map((rival) => (
                  <div className="simple-card" key={rival.id}>
                    <div>
                      <b>{rival.name}</b>
                      <small>{rival.style}</small>
                    </div>
                    <button className="primary-button compact" onClick={() => handleFriendly(rival.name)}>Jugar</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Historial</h3>
              </div>
              <div className="history-list">
                {game.matchHistory.length === 0 && <p>Aún no se ha jugado ningún amistoso.</p>}
                {game.matchHistory.map((match) => (
                  <div className="history-item" key={match.id}>
                    <span>{match.day}</span>
                    <strong>{match.opponent}</strong>
                    <em>{match.score}</em>
                    <b>{match.result}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {screen === 'buildings' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Instalaciones</h3>
              <button className="secondary-button" onClick={handleNextDay}>Avanzar día</button>
            </div>
            <div className="buildings-grid">
              {Object.entries(BUILDINGS).map(([key, info]) => (
                <div className="building-card" key={key}>
                  <div className="building-topline">
                    <div>
                      <h4>{info.name}</h4>
                      <small>Nivel {game.buildings[key] ?? 1}</small>
                    </div>
                    <span className="badge-soft">{info.baseCost}€</span>
                  </div>
                  <p>{info.description}</p>
                  <button className="primary-button compact" onClick={() => handleUpgrade(key)}>
                    Mejorar · {getBuildingUpgradeCost(key, (game.buildings[key] ?? 1) + 1)}€
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'economy' && (
          <section className="panel-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Economía</h3>
              </div>
              <div className="cards-grid">
                <div className="detail-card">
                  <span>Caja</span>
                  <strong>{game.money}€</strong>
                </div>
                <div className="detail-card">
                  <span>Ingreso diario</span>
                  <strong>{income}€</strong>
                </div>
                <div className="detail-card">
                  <span>Coste plantilla</span>
                  <strong>{game.players.reduce((sum, player) => sum + player.salary, 0)}€</strong>
                </div>
                <div className="detail-card">
                  <span>Estadio</span>
                  <strong>{game.stadiumCapacity}</strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Registro</h3>
              </div>
              <div className="logs-list">
                {game.logs.map((log, index) => (
                  <div key={`${log}-${index}`} className="log-item">{log}</div>
                ))}
              </div>
            </div>
          </section>
        )}

        {screen === 'missions' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Retos y objetivos</h3>
            </div>
            <div className="missions-list">
              {game.missions.map((mission) => (
                <div className={`mission-card ${mission.completed ? 'is-complete' : ''}`} key={mission.id}>
                  <div>
                    <h4>{mission.title}</h4>
                    <p>{mission.description}</p>
                  </div>
                  <div className="mission-meta">
                    <span>{mission.progress}/{mission.goal}</span>
                    <strong>{mission.reward}€</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        {[
          ['club', 'Club'],
          ['academy', 'Academia'],
          ['fixtures', 'Partidos'],
          ['buildings', 'Instal.'],
          ['economy', 'Economía'],
          ['missions', 'Retos']
        ].map(([key, label]) => (
          <button
            key={key}
            className={screen === key ? 'nav-button active' : 'nav-button'}
            onClick={() => setScreen(key)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
