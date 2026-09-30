/**
 * Guarda una foto de los datos públicos de GitHub en
 * `src/data/githubSnapshot.json`.
 *
 * La página de Comunidad los pide en vivo a `api.github.com` (que sí manda
 * cabeceras CORS), pero si el visitante no tiene conexión, la API falla o se
 * pasa de las 60 peticiones/hora por IP, se muestra esta copia. Así la web
 * nunca queda en blanco.
 *
 * Uso:  npm run github:snapshot
 *
 * No hace falta ninguna clave: solo datos públicos.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'githubSnapshot.json');
const PROFILE_PATH = path.join(__dirname, '..', 'src', 'data', 'devProfile.ts');

const API = 'https://api.github.com';
const REPO_COUNT = 6;

/** Lee el `githubUser` de devProfile.ts para no duplicar el identificador. */
function readGithubUser() {
  const source = fs.readFileSync(PROFILE_PATH, 'utf8');
  const match = source.match(/githubUser:\s*'([^']+)'/);
  return match ? match[1] : 'MarioMunPeq';
}

const getJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-library-snapshot',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} en ${url}`);
  }
  return response.json();
};

async function main() {
  const user = readGithubUser();
  console.log(`Consultando GitHub: ${user}`);

  const [profile, repos] = await Promise.all([
    getJson(`${API}/users/${user}`),
    getJson(`${API}/users/${user}/repos?per_page=100&sort=pushed`),
  ]);

  const own = repos.filter((repo) => !repo.fork);

  const snapshot = {
    // Se guarda para poder mostrar "actualizado hace X" sin pedir la API.
    fetchedAt: new Date().toISOString(),
    user: {
      name: profile.name,
      login: profile.login,
      bio: profile.bio,
      avatarUrl: profile.avatar_url,
      location: profile.location,
      blog: profile.blog,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      createdAt: profile.created_at,
      htmlUrl: profile.html_url,
    },
    totalStars: own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    repos: own.slice(0, REPO_COUNT).map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      homepage: repo.homepage,
      pushedAt: repo.pushed_at,
    })),
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  console.log(
    `OK  ${snapshot.user.publicRepos} repos · ${snapshot.user.followers} seguidores · ` +
      `${snapshot.totalStars} estrellas · ${snapshot.repos.length} repos guardados`,
  );
  console.log(`Escrito ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(`No se pudo generar la copia: ${error.message}`);
  console.error('Se conserva el archivo anterior.');
  process.exitCode = 1;
});
