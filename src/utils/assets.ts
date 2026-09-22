const base = import.meta.env.BASE_URL;
const normalizedBase = base.endsWith('/') ? base : `${base}/`;
const isDev = import.meta.env.DEV;

/**
 * Resuelve una ruta de /public (ej. `/projects/persona5/icon.ico`)
 * ante el `base` de Vite (`/Repository-Library/` en despliegue).
 * En desarrollo NO se antepone el base, porque Vite sirve /public en la raíz.
 */
export const assetUrl = (path: string): string => {
  const cleanPath = path.replace(/^\//, '');
  return isDev ? `/${cleanPath}` : `${normalizedBase}${cleanPath}`;
};

/**
 * Tipos de asset soportados por `resolveAssetSrc` / `SmartImage`.
 * Las extensiones por tipo pueden cambiar sin aviso, por eso nunca
 * se hardcodean en las rutas: se resuelven en runtime probando en orden.
 */
export type AssetKind =
  | 'icon'
  | 'capsule'
  | 'header'
  | 'hero'
  | 'banner'
  | 'logo'
  | 'avatar'
  | 'screenshots';

/**
 * Extensiones candidatas por tipo de asset, en orden de prioridad.
 * El primer formato que exista en disco es el que se muestra.
 */
export const ASSET_EXTENSIONS: Readonly<Record<AssetKind, readonly string[]>> = {
  icon: ['ico', 'png', 'svg', 'jpg', 'webp'],
  capsule: ['jpg', 'png', 'webp'],
  header: ['jpg', 'png', 'webp'],
  hero: ['jpg', 'png', 'webp'],
  banner: ['jpg', 'png', 'webp'],
  logo: ['png', 'svg', 'webp'],
  avatar: ['jpg', 'png', 'webp'],
  screenshots: ['jpg', 'png', 'webp'],
};

/**
 * Devuelve la lista ordenada de URLs candidatas para un asset definido por su
 * ruta base SIN extensión (ej. `/projects/persona5/icon`) y las extensiones
 * a probar. El primer elemento es el intento preferente.
 */
export const resolveAssetSrc = (basePath: string, extensions: readonly string[]): string[] =>
  extensions.map((extension) => assetUrl(`${basePath}.${extension}`));