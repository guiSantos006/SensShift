import { Game, GameId } from './types';

export const GAMES: Record<GameId, Game> = {
  cs2: {
    id: 'cs2',
    name: 'CS2',
    yaw: 0.022,
    icon: 'sports_esports',
    placeholderSens: 1.00,
    dpiPlaceholder: 800,
    description: 'Counter-Strike 2 (e CS:GO / Source Engine)'
  },
  valorant: {
    id: 'valorant',
    name: 'Valorant',
    yaw: 0.07,
    icon: 'videogame_asset',
    placeholderSens: 0.314,
    dpiPlaceholder: 800,
    description: 'Valorant'
  },
  apex: {
    id: 'apex',
    name: 'Apex Legends',
    yaw: 0.022,
    icon: 'mountain_flag',
    placeholderSens: 1.00,
    dpiPlaceholder: 800,
    description: 'Apex Legends'
  },
  overwatch2: {
    id: 'overwatch2',
    name: 'Overwatch 2',
    yaw: 0.0066,
    icon: 'bolt',
    placeholderSens: 3.33,
    dpiPlaceholder: 800,
    description: 'Overwatch 2'
  },
  cod: {
    id: 'cod',
    name: 'Call of Duty',
    yaw: 0.0066,
    icon: 'target',
    placeholderSens: 3.33,
    dpiPlaceholder: 800,
    description: 'Call of Duty (Modern Warfare / Warzone)'
  },
  r6: {
    id: 'r6',
    name: 'Rainbow Six',
    yaw: 0.00572957795,
    icon: 'shield',
    placeholderSens: 3.84,
    dpiPlaceholder: 800,
    description: 'Rainbow Six Siege'
  }
};

export const GAMES_LIST: Game[] = Object.values(GAMES);

/**
 * Converte sensibilidade entre dois jogos e DPIs diferentes
 */
export function convertSensitivity(
  sourceId: GameId,
  targetId: GameId,
  sensitivity: number,
  sourceDpi: number,
  targetDpi: number
): number {
  if (!sensitivity || sensitivity <= 0) return 0;
  if (!sourceDpi || sourceDpi <= 0) return 0;
  if (!targetDpi || targetDpi <= 0) return 0;

  const sourceYaw = GAMES[sourceId]?.yaw || 0.022;
  const targetYaw = GAMES[targetId]?.yaw || 0.022;

  // Formula: Sens B = Sens A * (Yaw A / Yaw B) * (Dpi A / Dpi B)
  const converted = sensitivity * (sourceYaw / targetYaw) * (sourceDpi / targetDpi);
  
  // Truncar para 3 casas decimais
  return parseFloat(converted.toFixed(3));
}

/**
 * Calcula a distância em cm e polegadas para um giro de 360 graus
 */
export function calculateDistance360(
  sensitivity: number,
  yaw: number,
  dpi: number
): { cm: number; inches: number } {
  if (!sensitivity || sensitivity <= 0 || !yaw || !dpi || dpi <= 0) {
    return { cm: 0, inches: 0 };
  }

  // Centímetros para 360: 914.4 / (sens * yaw * dpi)
  // Polegadas para 360: 360 / (sens * yaw * dpi)
  const denominator = sensitivity * yaw * dpi;
  if (denominator === 0) return { cm: 0, inches: 0 };

  const cm = 914.4 / denominator;
  const inches = 360 / denominator;

  return {
    cm: parseFloat(cm.toFixed(1)),
    inches: parseFloat(inches.toFixed(1))
  };
}
