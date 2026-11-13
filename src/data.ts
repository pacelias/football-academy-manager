import type { GameState, Mission, Player, Rival } from './types';

export const BUILDINGS = {
  trainingGround: { name: 'Campo de entrenamiento', icon: '⚽', description: 'Mejora los resultados del entrenamiento.', baseCost: 500, income: 20 },
  stadium: { name: 'Estadio', icon: '🏟️', description: 'Aumenta la capacidad y los ingresos de los amistosos.', baseCost: 800, income: 35 },
  gym: { name: 'Gimnasio', icon: '🏋️', description: 'Ayuda a recuperar la forma física.', baseCost: 450, income: 15 },
  medical: { name: 'Centro médico', icon: '🩺', description: 'Reduce el tiempo de recuperación.', baseCost: 550, income: 15 },
  youthAcademy: { name: 'Academia juvenil', icon: '🌱', description: 'Forma a la próxima generación.', baseCost: 700, income: 20 },
  shop: { name: 'Tienda oficial', icon: '👕', description: 'Genera ingresos de merchandising.', baseCost: 400, income: 30 }
} as const;

export type BuildingKey = keyof typeof BUILDINGS;

const player = (id: number, name: string, age: number, position: Player['position'], rating: number, potential: number): Player => ({
  id, name, age, nationality: ['España', 'Argentina', 'Uruguay', 'Brasil', 'Portugal', 'España'][id - 1], position,
  rating, potential, pace: rating + 3, stamina: rating, strength: rating - 2, passing: rating + 1,
  dribbling: rating + 2, shooting: rating - 1, defense: rating, tactics: rating - 2,
  morale: 70, fitness: 90, experience: 1, marketValue: rating * 3500, salary: 80 + rating * 3, injured: 0, focus: 'Equilibrado'
});

export const defaultMissions = (): Mission[] => [
  { id: 'win', title: 'Primera victoria', description: 'Gana un partido amistoso.', goal: 1, progress: 0, reward: 350, type: 'wins', completed: false },
  { id: 'train', title: 'Trabajo de equipo', description: 'Completa un entrenamiento colectivo.', goal: 1, progress: 0, reward: 250, type: 'training', completed: false },
  { id: 'upgrade', title: 'Un paso adelante', description: 'Mejora una instalación.', goal: 1, progress: 0, reward: 300, type: 'build', completed: false },
  { id: 'savings', title: 'Fondo de reserva', description: 'Alcanza 2.500 € en caja.', goal: 2500, progress: 0, reward: 500, type: 'money', completed: false }
];

export function buildStartingState(clubName: string): GameState {
  const rivals: Rival[] = [
    { id: 1, name: 'Atlético del Barrio', strength: 59, style: 'Presión alta' },
    { id: 2, name: 'Unión Costera', strength: 62, style: 'Juego por bandas' },
    { id: 3, name: 'Deportivo Valle', strength: 65, style: 'Contraataque' },
    { id: 4, name: 'Real Montaña', strength: 68, style: 'Posesión' }
  ];
  return {
    clubName, day: 1, money: 1800, reputation: 1, stadiumCapacity: 300, matchHistory: [],
    players: [player(1, 'Mateo Ruiz', 18, 'DEF', 57, 78), player(2, 'Daniel Costa', 19, 'MED', 60, 82), player(3, 'Iker Silva', 17, 'DEL', 58, 85), player(4, 'Sergio Lima', 20, 'MED', 62, 79), player(5, 'Adrián Vega', 18, 'DEL', 59, 83), player(6, 'Lucas Ríos', 21, 'POR', 63, 77)],
    rivals, buildings: { trainingGround: 1, stadium: 1, gym: 1, medical: 1, youthAcademy: 1, shop: 1 },
    missions: defaultMissions(), logs: ['¡Bienvenido! Tu academia ya está en marcha.']
  };
}

export function getBuildingUpgradeCost(key: BuildingKey, currentLevel: number): number {
  return Math.round(BUILDINGS[key].baseCost * Math.pow(1.65, currentLevel - 1));
}

export function calculateIncome(game: GameState): number {
  const facilities = (Object.keys(BUILDINGS) as BuildingKey[]).reduce((sum, key) => sum + BUILDINGS[key].income * (game.buildings[key] ?? 1), 0);
  const wages = game.players.reduce((sum, p) => sum + p.salary, 0);
  return Math.max(50, 180 + facilities + game.reputation * 15 - Math.round(wages * 0.18));
}

function checkMissions(state: GameState): GameState {
  const next = structuredClone(state);
  next.missions = next.missions.map((mission) => {
    if (mission.completed) return mission;
    const progress = mission.type === 'wins' ? next.matchHistory.filter((m) => m.result === 'W').length
      : mission.type === 'training' ? (next.logs.some((entry) => entry.includes('Entrenamiento colectivo')) ? 1 : 0)
      : mission.type === 'build' ? (next.logs.some((entry) => entry.includes('mejorada')) ? 1 : 0)
      : next.money;
    if (progress >= mission.goal) {
      next.money += mission.reward;
      next.logs.unshift(`Misión completada: ${mission.title} (+${mission.reward} €).`);
      return { ...mission, progress: mission.goal, completed: true };
    }
    return { ...mission, progress };
  });
  next.logs = next.logs.slice(0, 8);
  return next;
}

export function trainPlayers(state: GameState, mode: 'individual' | 'collective'): GameState {
  const next = structuredClone(state);
  const cost = mode === 'individual' ? 100 : 160;
  if (next.money < cost) {
    next.logs.unshift('No hay dinero suficiente para entrenar.');
    return next;
  }
  next.money -= cost;
  const count = mode === 'individual' ? 1 : next.players.length;
  const selected = mode === 'individual' ? [next.players[Math.floor(Math.random() * next.players.length)]] : next.players;
  selected.slice(0, count).forEach((p) => {
    if (p.rating < p.potential) {
      const bonus = Math.random() < 0.25 ? 2 : 1;
      p.rating = Math.min(p.potential, p.rating + bonus + Math.floor((next.buildings.trainingGround - 1) / 2));
      p.experience += 2;
      p.marketValue = p.rating * 3500;
    }
    p.morale = Math.min(100, p.morale + 5);
    p.fitness = Math.max(40, p.fitness - (mode === 'individual' ? 2 : 5));
  });
  next.logs.unshift(mode === 'individual' ? 'Entrenamiento individual completado.' : 'Entrenamiento colectivo completado.');
  return checkMissions(next);
}

export function upgradeBuilding(state: GameState, key: BuildingKey): GameState {
  const next = structuredClone(state);
  const level = next.buildings[key] ?? 1;
  const cost = getBuildingUpgradeCost(key, level);
  if (next.money < cost) {
    next.logs.unshift(`Faltan fondos: la mejora cuesta ${cost} €.`);
    return next;
  }
  next.money -= cost;
  next.buildings[key] = level + 1;
  next.reputation += 1;
  if (key === 'stadium') next.stadiumCapacity += 150;
  next.logs.unshift(`${BUILDINGS[key].name} mejorado al nivel ${level + 1}.`);
  return checkMissions(next);
}

export function playFriendly(state: GameState, opponentName: string): GameState {
  const next = structuredClone(state);
  const rival = next.rivals.find((item) => item.name === opponentName) ?? next.rivals[0];
  const avg = next.players.reduce((sum, p) => sum + p.rating, 0) / next.players.length;
  const teamStrength = avg + (next.buildings.trainingGround - 1) * 2 + (next.buildings.stadium - 1);
  const edge = (teamStrength - rival.strength) / 13;
  const ourGoals = Math.max(0, Math.round(1.1 + edge + Math.random() * 2));
  const theirGoals = Math.max(0, Math.round(1.1 - edge + Math.random() * 2));
  const result = ourGoals > theirGoals ? 'W' : ourGoals < theirGoals ? 'L' : 'D';
  next.matchHistory.unshift({ id: Date.now(), opponent: rival.name, score: `${ourGoals} - ${theirGoals}`, result, day: next.day });
  next.matchHistory = next.matchHistory.slice(0, 20);
  next.money += result === 'W' ? 450 : result === 'D' ? 280 : 180;
  next.reputation += result === 'W' ? 1 : 0;
  next.players.forEach((p) => {
    p.experience += 3;
    p.fitness = Math.max(45, p.fitness - 8);
    p.morale = Math.min(100, p.morale + (result === 'W' ? 6 : result === 'L' ? -3 : 2));
  });
  next.logs.unshift(`${result === 'W' ? '¡Victoria' : result === 'D' ? 'Empate' : 'Derrota'} ante ${rival.name}: ${ourGoals} - ${theirGoals}. Ingresos: ${result === 'W' ? 450 : result === 'D' ? 280 : 180} €.`);
  return checkMissions(next);
}

export function nextDayState(state: GameState): GameState {
  const next = structuredClone(state);
  next.day += 1;
  const income = calculateIncome(next);
  next.money += income;
  next.players.forEach((p) => { p.fitness = Math.min(100, p.fitness + 12); });
  next.logs.unshift(`Día ${next.day}: ingresos diarios +${income} €; plantilla recuperada.`);
  return checkMissions(next);
}
