import steamAchievementsJson from './steamAchievements.json';

/** Un logro tal y como lo publica la tienda de Steam. */
export interface SteamAchievement {
  /** Nombre ya localizado (el script pide `l=spanish`). */
  name: string;
  /** URL del icono en el CDN de Steam (`shared.akamai.steamstatic.com`). */
  icon: string;
  /** El juego lo marca como secreto: el nombre no se muestra en el juego. */
  hidden: boolean;
}

export interface SteamGameAchievements {
  appId: number;
  name: string;
  /** Número TOTAL de logros del juego (no solo los que devuelve la API). */
  total: number;
  /**
   * Solo los 10 "destacados" que expone la tienda. El listado completo
   * requiere un endpoint no documentado, así que esta lista es más corta.
   */
  achievements: SteamAchievement[];
}

export type SteamAchievementsMap = Record<string, SteamGameAchievements>;

/**
 * Datos generados por `npm run steam:achievements` a partir del endpoint
 * público de la tienda de Steam. Se versionan en el repo para que la web no
 * dependa de la red ni de CORS en tiempo de ejecución.
 */
export const steamAchievements = steamAchievementsJson as SteamAchievementsMap;

/** Logros de Steam para un proyecto, o `null` si no tiene `steamAppId`. */
export const getSteamAchievements = (slug: string): SteamGameAchievements | null =>
  Object.prototype.hasOwnProperty.call(steamAchievements, slug) ? steamAchievements[slug] : null;
