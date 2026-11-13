export type Position = 'POR' | 'DEF' | 'MED' | 'DEL';

export type TrainingMode = 'individual' | 'collective';

export type BuildingKey =
  | 'trainingGround'
  | 'stadium'
  | 'gym'
  | 'medical'
  | 'youthAcademy'
  | 'residence'
  | 'admin'
  | 'tacticalCenter'
  | 'shop'
  | 'commercial';

export interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  rating: number;
  potential: number;
  pace: number;
  stamina: number;
  strength: number;
  passing: number;
  dribbling: number;
  shooting: number;
  defense: number;
  tactics: number;
  morale: number;
  fitness: number;
  experience: number;
  marketValue: number;
  salary: number;
  injured: number;
  focus: string;
}

export interface BuildingInfo {
  key: BuildingKey;
  name: string;
  description: string;
  baseCost: number;
  income: number;
  bonus: number;
}

export interface Rival {
  id: number;
  name: string;
  strength: number;
  style: string;
}

export interface MatchRecord {
  id: number;
  opponent: string;
  score: string;
  result: 'W' | 'D' | 'L';
  day: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  reward: number;
  type: 'wins' | 'money' | 'rating' | 'build' | 'training';
  completed: boolean;
}

export interface BuildingsState {
  [key: string]: number;
}

export interface GameState {
  clubName: string;
  day: number;
  money: number;
  reputation: number;
  stadiumCapacity: number;
  matchHistory: MatchRecord[];
  players: Player[];
  rivals: Rival[];
  buildings: BuildingsState;
  missions: Mission[];
  logs: string[];
}
