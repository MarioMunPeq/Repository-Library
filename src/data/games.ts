/** Juegos a los que pueden estar jugando los amigos del panel.
 *
 *  A diferencia de los proyectos del portfolio (que son juegos usados como
 *  metáfora de un trabajo), estos son títulos reales de la tienda: por eso
 *  llevan `appId`, con el que `npm run steam:games` descarga el icono que la
 *  tienda muestra junto al nombre del juego.
 *
 *  La `id` es también el nombre de la carpeta en `public/games/<id>/`, donde
 *  queda el icono. */
export interface FriendGame {
  id: string;
  /** Appid de la tienda de Steam. */
  appId: number;
  /** Nombre como lo escribe la tienda; es lo que se ve en el panel. */
  name: string;
  storeUrl: string;
}

export const friendGames: Record<string, FriendGame> = {
  'magia-exedra': {
    id: 'magia-exedra',
    appId: 2987800,
    name: 'Madoka Magica: Magia Exedra',
    storeUrl: 'https://store.steampowered.com/app/2987800/Madoka_Magica_Magia_Exedra/',
  },
  'hollow-knight': {
    id: 'hollow-knight',
    appId: 367520,
    name: 'Hollow Knight',
    storeUrl: 'https://store.steampowered.com/app/367520/Hollow_Knight/',
  },
  satisfactory: {
    id: 'satisfactory',
    appId: 526870,
    name: 'Satisfactory',
    storeUrl: 'https://store.steampowered.com/app/526870/Satisfactory/',
  },
};

/** Juego de un amigo, o `undefined` si está en línea pero no jugando nada. */
export const gameOf = (gameId: string | undefined): FriendGame | undefined =>
  gameId ? friendGames[gameId] : undefined;
