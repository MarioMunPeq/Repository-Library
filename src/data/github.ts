import { useEffect, useState } from 'react';
import snapshot from './githubSnapshot.json';

/**
 * Datos públicos de GitHub para el panel de enlaces del perfil.
 *
 * Fuente primaria: `api.github.com` en vivo desde el navegador (manda
 * cabeceras CORS y no necesita clave). Si eso falla —sin conexión, error de
 * red o el límite de 60 peticiones/hora por IP— se usa la copia guardada en
 * el repo con `npm run github:snapshot`, para que la página nunca se quede
 * en blanco. Cuando se usa la copia, `stale` va a `true` y se avisa.
 */

const API = 'https://api.github.com';
const TIMEOUT_MS = 7000;
const REPO_COUNT = 6;

export interface GithubUser {
  name: string;
  login: string;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  htmlUrl: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  pushedAt: string;
}

export interface GithubData {
  user: GithubUser;
  totalStars: number;
  repos: GithubRepo[];
  /** `true` si los datos vienen de la copia local y no de la API. */
  stale: boolean;
  /** Fecha de la petición (o de la copia), para "actualizado hace X". */
  fetchedAt: string;
}

type ApiProfile = {
  name: string | null;
  login: string;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
};

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
};

/** La copia local, tal cual la dejó `npm run github:snapshot`. */
const fallbackData: GithubData = {
  user: snapshot.user as GithubUser,
  totalStars: snapshot.totalStars,
  repos: snapshot.repos as GithubRepo[],
  stale: true,
  fetchedAt: snapshot.fetchedAt,
};

const getJson = async <T,>(url: string, signal: AbortSignal): Promise<T> => {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) {
    throw new Error(`GitHub respondió ${response.status}`);
  }
  return (await response.json()) as T;
};

/** Year para "miembro desde 2022". */
export const memberSince = (createdAt: string): string =>
  String(new Date(createdAt).getFullYear());

/** "actualizado hace 5 min" a partir de la fecha de la petición. */
export const timeSince = (iso: string): string => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'ahora mismo';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} días`;
};

export const useGithubData = (user: string): GithubData | null => {
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // Si la API tarda demasiado, se enseña la copia local antes que nada.
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    (async () => {
      try {
        const [profile, repos] = await Promise.all([
          getJson<ApiProfile>(`${API}/users/${user}`, controller.signal),
          getJson<ApiRepo[]>(
            `${API}/users/${user}/repos?per_page=100&sort=pushed`,
            controller.signal,
          ),
        ]);

        const own = repos.filter((repo) => !repo.fork);
        setData({
          user: {
            name: profile.name ?? profile.login,
            login: profile.login,
            bio: profile.bio,
            avatarUrl: profile.avatar_url,
            location: profile.location,
            blog: profile.blog || null,
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
            homepage: repo.homepage || null,
            pushedAt: repo.pushed_at,
          })),
          stale: false,
          fetchedAt: new Date().toISOString(),
        });
      } catch {
        // Sin conexión, error de la API o límite de peticiones: copia local.
        setData(fallbackData);
      } finally {
        window.clearTimeout(timeout);
      }
    })();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [user]);

  return data;
};
