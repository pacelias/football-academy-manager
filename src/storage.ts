import type { GameState } from './types';
const STORAGE_KEY = 'football-academy-manager-save';
export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const game = JSON.parse(raw) as Partial<GameState>;
    if (!game.players || !game.clubName) return null;
    const players = game.players;
    const lineup = Array.isArray(game.lineup) ? game.lineup.filter((id) => players.some((p) => p.id === id)) : players.map((p) => p.id);
    for (const p of players) if (!lineup.includes(p.id)) lineup.push(p.id);
    return { ...game, players, lineup, formation: game.formation ?? '4-4-2' } as GameState;
  } catch { return null; }
}
export function saveGame(state: GameState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Keep the current session playable if storage is unavailable. */ }
}
