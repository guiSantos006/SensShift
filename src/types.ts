export type GameId = 'cs2' | 'valorant' | 'apex' | 'overwatch2' | 'cod' | 'r6';

export interface Game {
  id: GameId;
  name: string;
  yaw: number;
  icon: string;
  placeholderSens: number;
  dpiPlaceholder: number;
  description: string;
}

export interface ConversionProfile {
  id: string;
  title: string;
  sourceGameId: GameId;
  targetGameId: GameId;
  sourceSens: number;
  sourceDpi: number;
  targetDpi: number;
  convertedSens: number;
  createdAt: string;
}
