import { useMemo, useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { ASSET_EXTENSIONS, resolveAssetSrc } from '../utils/assets';
import type { AssetKind } from '../utils/assets';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError' | 'onLoad'> {
  /** Ruta del asset SIN extensión (ej. `/projects/persona5/icon`). */
  basePath: string;
  /** Tipo de asset: determina la lista de extensiones a probar. */
  kind: AssetKind;
  /** Lista de extensiones alternativa (por defecto, las del `kind`). */
  extensions?: readonly string[];
  /** Contenido a renderizar si ninguna extensión existe (ej. gradiente). */
  fallback?: ReactNode;
}

/**
 * Imagen que resuelve la extensión real en runtime: recibe una ruta sin
 * extensión y una lista ordenada de candidatas; prueba la primera y, si el
 * `<img>` dispara `onError`, avanza a la siguiente. Si todas fallan renderiza
 * `fallback`. La imagen permanece oculta hasta que carga, así nunca se ve el
 * icono de error del navegador ni parpadeos.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  basePath,
  kind,
  extensions,
  fallback,
  className,
  style,
  alt = '',
  ...rest
}) => {
  const candidates = useMemo(
    () => resolveAssetSrc(basePath, extensions ?? ASSET_EXTENSIONS[kind]),
    [basePath, extensions, kind],
  );
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setLoaded(false);
    setAttempt((current) => current + 1);
  };

  if (attempt >= candidates.length) {
    return fallback ?? null;
  }

  return (
    <img
      key={attempt}
      className={className}
      src={candidates[attempt]}
      alt={alt}
      {...rest}
      onLoad={() => setLoaded(true)}
      onError={handleError}
      style={{ visibility: loaded ? 'visible' : 'hidden', ...style }}
    />
  );
};