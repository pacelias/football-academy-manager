import { useEffect, useState } from 'react';
import { loadGame, saveGame } from './storage';
import type { GameState, Player } from './types';
import './training-picker.css';

const TRAINING_TIMER = 'fam-training-ready-at';
const TRAINING_COOLDOWN_MS = 2 * 60 * 60 * 1000;

function factors(player: Player) {
  const ageFactor = player.age <= 17 ? 1.35 : player.age <= 20 ? 1.2 : player.age <= 24 ? 1 : player.age <= 28 ? 0.8 : 0.6;
  const potentialFactor = Math.max(0.45, Math.min(1.35, (player.potential - player.rating) / 10));
  return { ageFactor, potentialFactor };
}

function predictedGain(game: GameState, player: Player): number {
  if (player.rating >= player.potential) return 0;
  const { ageFactor, potentialFactor } = factors(player);
  const facilityFactor = 1 + (Math.max(1, game.buildings.trainingGround ?? 1) - 1) * 0.25;
  const rawGain = Math.round(20 * ageFactor * potentialFactor * facilityFactor);
  const current = game.trainingProgress?.[player.id] ?? 0;
  return Math.min(rawGain, 100 - current);
}

export default function TrainingPicker() {
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [result, setResult] = useState<{ name: string; oldRating: number; newRating: number; oldProgress: number; newProgress: number } | null>(null);

  useEffect(() => {
    const onTrainingClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.disabled) return;
      const label = `${button.innerText || ''} ${button.getAttribute('aria-label') || ''}`.toLocaleLowerCase('es');
      if (!label.includes('individual') || !label.includes('entren')) return;
      const saved = loadGame();
      if (!saved) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setGame(saved);
      setPlayerId(saved.players.find((player) => player.rating < player.potential)?.id ?? saved.players[0]?.id ?? null);
      setResult(null);
    };
    window.addEventListener('click', onTrainingClick, true);
    return () => window.removeEventListener('click', onTrainingClick, true);
  }, []);

  if (!game || playerId === null) return null;
  const player = game.players.find((item) => item.id === playerId);
  if (!player) return null;
  const progress = game.trainingProgress?.[player.id] ?? 0;
  const gain = predictedGain(game, player);
  const accumulated = progress + gain;
  const willImprove = player.rating < player.potential && accumulated >= 100;
  const projectedProgress = willImprove ? accumulated - 100 : accumulated;
  const affordable = game.money >= 100;

  const train = () => {
    const current = loadGame();
    const selected = current?.players.find((item) => item.id === player.id);
    if (!current || !selected || current.money < 100) return;
    const oldRating = selected.rating;
    const oldProgress = current.trainingProgress?.[selected.id] ?? 0;
    const earned = predictedGain(current, selected);
    const total = oldProgress + earned;
    const newRating = selected.rating + (selected.rating < selected.potential && total >= 100 ? 1 : 0);
    const newProgress = newRating > oldRating ? total - 100 : total;
    current.trainingProgress = { ...(current.trainingProgress ?? {}), [selected.id]: newProgress };
    selected.rating = newRating;
    selected.experience += 2;
    selected.marketValue = selected.rating * 3500;
    selected.morale = Math.min(100, selected.morale + 5);
    selected.fitness = Math.max(40, selected.fitness - 2);
    current.money -= 100;
    current.logs.unshift(`Entrenamiento individual: ${selected.name}, progreso ${oldProgress}% → ${newProgress}%${newRating > oldRating ? ` y valoración ${oldRating} → ${newRating}` : ''}.`);
    current.logs = current.logs.slice(0, 8);
    saveGame(current);
    localStorage.setItem(TRAINING_TIMER, String(Date.now() + TRAINING_COOLDOWN_MS));
    setResult({ name: selected.name, oldRating, newRating, oldProgress, newProgress });
    window.setTimeout(() => window.location.reload(), 1600);
  };

  return <div className="training-picker-backdrop" role="presentation">
    <section className="training-picker" role="dialog" aria-modal="true" aria-labelledby="training-title">
      {result ? <>
        <div className="training-result-ball">⚽</div>
        <div className="kicker">SESIÓN COMPLETADA</div>
        <h2>{result.name}</h2>
        <p>Progreso: <b>{result.oldProgress}% → {result.newProgress}%</b></p>
        <p>Valoración: <b>{result.oldRating}{result.newRating > result.oldRating ? ` → ${result.newRating}` : ''}</b></p>
        <small>Actualizando tu partida…</small>
      </> : <>
        <div className="kicker">ENTRENAMIENTO INDIVIDUAL · 100 €</div>
        <h2 id="training-title">Elige a quién entrenar</h2>
        <label htmlFor="training-player">JUGADOR</label>
        <select id="training-player" value={player.id} onChange={(event) => setPlayerId(Number(event.target.value))}>
          {game.players.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.position} · {item.rating}/{item.potential}</option>)}
        </select>
        <div className="training-preview">
          <div className="training-preview-row"><span>Edad / potencial</span><b>{player.age} años · {player.rating}/{player.potential}</b></div>
          <div className="training-preview-row"><span>Campo de entrenamiento</span><b>Nivel {game.buildings.trainingGround ?? 1}</b></div>
          <div className="training-preview-row"><span>Progreso actual</span><b>{progress}% hacia el siguiente punto</b></div>
          <div className="training-meter"><i style={{ width: `${Math.min(100, player.rating >= player.potential ? 100 : progress)}%` }} /></div>
          <div className="training-preview-result">
            {player.rating >= player.potential ? 'Ya alcanzó su potencial máximo.' : `Previsión: +${gain}% → ${willImprove ? `sube a ${player.rating + 1} y queda en ${projectedProgress}%` : `${projectedProgress}% hacia ${player.rating + 1}`}`}
          </div>
          <small>La edad, el potencial y el nivel de la instalación determinan el avance.</small>
        </div>
        {!affordable && <p className="training-error">No tienes fondos suficientes para esta sesión.</p>}
        <div className="training-picker-actions">
          <button className="button" onClick={() => { setGame(null); setPlayerId(null); }}>Cancelar</button>
          <button className="button primary" disabled={!affordable || player.rating >= player.potential} onClick={train}>Entrenar</button>
        </div>
      </>}
    </section>
  </div>;
}
