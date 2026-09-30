/**
 * Descarga el icono de cada juego de `src/data/games.ts` y lo deja en
 * `public/games/<id>/icon.jpg`, que es lo que pinta el panel de amigos.
 *
 * Por qué en tiempo de compilación y no desde el navegador:
 *   1. La ficha de la tienda (`store.steampowered.com/app/<appid>`) no manda
 *      cabeceras CORS, así que una petición desde la web quedaría bloqueada.
 *   2. Evita depender de un proxy de terceros en producción.
 *
 * Uso:  npm run steam:games
 *
 * De dónde sale la URL: el icono cuadrado que la tienda muestra junto al
 * nombre del juego es el `<img>` de `div.apphub_AppIcon`. El endpoint público
 * `api/appdetails` ya no lo expone y en el CDN solo se sirve a 32x32, que es
 * justo el tamaño que ocupa en el panel.
 *
 * El endpoint no es parte del contrato oficial de la Steam Web API, así que
 * puede cambiar. Los iconos se versionan en el repo para que la web no dependa
 * de la red: si el script falla, se conservan los que ya había.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GAMES_PATH = path.join(__dirname, '..', 'src', 'data', 'games.ts');
const ICONS_DIR = path.join(__dirname, '..', 'public', 'games');

const LOCALE = 'spanish';
const REQUEST_DELAY_MS = 500;

const HEADERS = {
  // Steam responde con un HTML vacío si cree que es un bot.
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
};

/** Extrae los `id` + `appId` declarados en games.ts.
 *  Se trocea por bloque (cada uno va de un `id:` al siguiente) porque un
 *  regex libre cruzaría de un juego al siguiente y asignaría el appid
 *  anterior al que lo precede. */
function readGames() {
  const source = fs.readFileSync(GAMES_PATH, 'utf8');

  const start = source.indexOf('export const friendGames');
  if (start === -1) return [];

  return source
    .slice(start)
    .split(/\n\s*id:\s*'/)
    .slice(1)
    .map((block) => {
      const id = block.slice(0, block.indexOf("'"));
      const appId = block.match(/appId:\s*(\d+)/);
      return appId ? { id, appId: Number(appId[1]) } : null;
    })
    .filter(Boolean);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** URL del icono cuadrado que la tienda pinta junto al nombre del juego. */
async function fetchIconUrl(appId) {
  const url = `https://store.steampowered.com/app/${appId}/?l=${LOCALE}`;
  const response = await fetch(url, { headers: HEADERS });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} en la ficha de ${appId}`);
  }

  const html = await response.text();
  const match = html.match(/class="apphub_AppIcon"><img src="([^"]+)"/);

  return match ? match[1] : null;
}

async function main() {
  const games = readGames();

  if (games.length === 0) {
    console.error(
      'No se ha encontrado ningún appId en src/data/games.ts. ' +
        'Añade el juego a `friendGames` antes de descargar sus iconos.',
    );
    process.exitCode = 1;
    return;
  }

  let downloaded = 0;
  const failed = [];

  for (const { id, appId } of games) {
    try {
      const iconUrl = await fetchIconUrl(appId);
      if (!iconUrl) {
        failed.push(`${id} (${appId}): la ficha no expone apphub_AppIcon`);
        console.error(`FAIL ${id}: la ficha no expone apphub_AppIcon`);
        continue;
      }

      const response = await fetch(iconUrl, { headers: HEADERS });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al descargar el icono`);
      }

      const dir = path.join(ICONS_DIR, id);
      fs.mkdirSync(dir, { recursive: true });
      const target = path.join(dir, 'icon.jpg');
      fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));

      downloaded += 1;
      console.log(
        `OK   ${id.padEnd(16)} appid ${String(appId).padStart(7)} · ` +
          `${(fs.statSync(target).size / 1024).toFixed(1)} kB · ${path.relative(process.cwd(), target)}`,
      );
    } catch (error) {
      failed.push(`${id} (${appId}): ${error.message}`);
      console.error(`FAIL ${id}: ${error.message}`);
    }
    await wait(REQUEST_DELAY_MS);
  }

  if (downloaded === 0) {
    console.error('\nNo se ha descargado ningún icono. Se conservan los anteriores.');
    process.exitCode = 1;
    return;
  }

  console.log(`\n${downloaded} iconos descargados a ${path.relative(process.cwd(), ICONS_DIR)}`);

  if (failed.length > 0) {
    console.warn(`\nSin icono para:\n  ${failed.join('\n  ')}`);
  }
}

main();
