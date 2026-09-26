/**
 * Descarga datos de logros desde el endpoint público de la tienda de Steam
 * y los guarda en `src/data/steamAchievements.json`.
 *
 * Por qué en tiempo de compilación y no desde el navegador:
 *   1. `store.steampowered.com/api/appdetails` NO envía cabecera
 *      `Access-Control-Allow-Origin`, así que una petición desde la web
 *      sería bloqueada por CORS. Desde Node no hay problema.
 *   2. Evita depender de un proxy de terceros en producción.
 *
 * Uso:  npm run steam:achievements
 *
 * El endpoint no es parte del contrato oficial de la Steam Web API (la API
 * oficial no expone logros de juegos ajenos), así que puede cambiar. El JSON
 * generado se versiona en el repo para que la web no dependa de la red.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'steamAchievements.json');
const PROJECTS_PATH = path.join(__dirname, '..', 'src', 'data', 'projects.tsx');

const ENDPOINT = 'https://store.steampowered.com/api/appdetails';
const LOCALE = 'spanish';
const REQUEST_DELAY_MS = 500;

/** Extrae los `steamAppId` declarados en projects.tsx.
 *  Se trocea por proyecto (cada bloque va de un `slug:` al siguiente) porque
 *  un regex libre cruzaría de un proyecto al siguiente y asignaría el appid
 *  de Baldur's Gate 3 al proyecto que lo precede en el fichero. */
function readProjectAppIds() {
  const source = fs.readFileSync(PROJECTS_PATH, 'utf8');

  // Nos quedamos con lo que hay entre el inicio del array de proyectos y su
  // cierre, para no pillar appids de tipos o interfaces.
  const start = source.indexOf('export const projects');
  if (start === -1) return [];
  const body = source.slice(start);

  const blocks = body.split(/\n\s*slug:\s*'/).slice(1);

  return blocks
    .map((block) => {
      const slug = block.slice(0, block.indexOf("'"));
      const appId = block.match(/steamAppId:\s*(\d+)/);
      return appId ? { slug, appId: Number(appId[1]) } : null;
    })
    .filter(Boolean);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchGame(appId) {
  const url = `${ENDPOINT}?appids=${appId}&l=${LOCALE}`;
  const response = await fetch(url, {
    headers: {
      // Steam responde con un HTML vacío si cree que es un bot.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} para appid ${appId}`);
  }

  const payload = await response.json();

  // La respuesta es un mapa por appid e incluye DLC y juegos relacionados,
  // así que hay que quedarse con la entrada cuyo steam_appid es el pedido.
  const entry = Object.values(payload).find(
    (value) => value?.success && value.data?.steam_appid === appId,
  );

  if (!entry) return null;

  const { data } = entry;
  const achievements = data.achievements ?? {};

  return {
    appId,
    name: data.name,
    total: achievements.total ?? 0,
    // La tienda solo expone los 10 logros "destacados" (no los 53 completos)
    // y sin descripción. El listado íntegro vive en
    // steamcommunity.com/stats/<appid>, que es un endpoint no documentado y
    // sin CORS: queda fuera a propósito.
    achievements: (achievements.highlighted ?? []).map((item) => ({
      name: item.localized_name || item.name,
      icon: item.path,
      hidden: Boolean(item.hidden),
    })),
  };
}

async function main() {
  const projects = readProjectAppIds();

  if (projects.length === 0) {
    console.error(
      'No se ha encontrado ningún steamAppId en src/data/projects.tsx. ' +
        'Añade el campo a los proyectos que correspondan a un juego real de Steam.',
    );
    process.exitCode = 1;
    return;
  }

  const result = {};
  const failed = [];

  for (const { slug, appId } of projects) {
    try {
      const game = await fetchGame(appId);
      if (!game) {
        failed.push(`${slug} (${appId}): sin datos`);
        continue;
      }
      result[slug] = game;
      console.log(
        `OK   ${slug.padEnd(22)} ${String(game.total).padStart(3)} logros · ` +
          `${game.achievements.length} destacados · ${game.name}`,
      );
    } catch (error) {
      failed.push(`${slug} (${appId}): ${error.message}`);
      console.error(`FAIL ${slug}: ${error.message}`);
    }
    await wait(REQUEST_DELAY_MS);
  }

  if (Object.keys(result).length === 0) {
    console.error('\nNo se pudo descargar ningún juego. Se conserva el archivo anterior.');
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`\nEscrito ${path.relative(process.cwd(), OUTPUT_PATH)}`);

  if (failed.length > 0) {
    console.warn(`\nSin datos para:\n  ${failed.join('\n  ')}`);
  }
}

main();
