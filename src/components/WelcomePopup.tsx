import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects.tsx';
import type { Project } from '../data/projects.tsx';
import { devProfile } from '../data/devProfile';
import { SmartImage } from './SmartImage';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons';
import './WelcomePopup.css';

/** Se guarda en la sesión: al recargar dentro de la misma pestaña no vuelve a salir. */
const STORAGE_KEY = 'portfolio-library:bienvenida-vista';

/** Cuántas capturas se ven bajo la imagen grande, como en el aviso de Steam. */
const SHOT_COUNT = 3;

interface Slide {
  project: Project;
  /** Las tres capturas que se ven bajo la imagen grande. */
  shots: string[];
}

export const WelcomePopup: React.FC = () => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });
  const [index, setIndex] = useState(0);

  const slides = useMemo<Slide[]>(
    () => projects.map((project) => ({ project, shots: project.screenshots.slice(0, SHOT_COUNT) })),
    [],
  );

  const close = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Modo privado sin sessionStorage: simplemente no se recuerda.
    }
    setOpen(false);
  }, []);

  const goTo = useCallback((next: number) => {
    const total = projects.length;
    setIndex(((next % total) + total) % total);
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      close();
      navigate(`/juego/${slug}`);
    },
    [close, navigate],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      // Las flechas cambian de proyecto, como el carrusel del cliente.
      if (event.key === 'ArrowLeft') {
        setIndex((current) => (current - 1 + slides.length) % slides.length);
        return;
      }
      if (event.key === 'ArrowRight') {
        setIndex((current) => (current + 1) % slides.length);
        return;
      }
      // Trampa de foco: la ventana es modal.
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close, slides.length]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const { project, shots } = slides[index];
  const { price } = project;
  // Con `key` la imagen se remonta al cambiar de proyecto: si no, el <img>
  // aguantaría el intento de extensión anterior y buscaría un archivo que no
  // existe en la nueva carpeta.
  const slideKey = project.slug;

  // Portal a document.body: se sitúa por encima de la app en cualquier vista.
  return createPortal(
    <div className="welcome-overlay" role="presentation">
      <div
        className="welcome-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        tabIndex={-1}
      >
        <button className="welcome-close" type="button" onClick={close} aria-label="Cerrar">
          <CloseIcon />
        </button>

        {/* Fondo: la ilustración del juego, ampliada y difuminada. */}
        <div className="welcome-art" aria-hidden="true">
          <span className="welcome-art-fallback" style={{ background: project.fallbackGradient }} />
          <SmartImage
            key={`${slideKey}-art`}
            basePath={project.heroPath}
            kind="hero"
            className="welcome-art-img"
            alt=""
          />
        </div>

        <div className="welcome-body">
          <p className="welcome-kicker">Portfolio Library</p>
          <h1 className="welcome-title" id="welcome-title">
            {project.name}
          </h1>

          {/* Imagen grande: la cabecera del juego; si no hay, la cápsula. */}
          <button
            className="welcome-media"
            type="button"
            onClick={() => openProject(project.slug)}
            aria-label={`Ver la ficha de ${project.name}`}
          >
            <span className="welcome-media-fallback" style={{ background: project.fallbackGradient }} />
            <SmartImage
              key={`${slideKey}-media`}
              basePath={project.headerPath}
              kind="header"
              className="welcome-media-img"
              alt=""
              fallback={
                <SmartImage
                  key={`${slideKey}-media-capsule`}
                  basePath={project.capsulePath}
                  kind="capsule"
                  className="welcome-media-img"
                  alt=""
                />
              }
            />
          </button>

          {/* Tira de capturas, como las miniaturas del aviso de Steam. */}
          {shots.length > 0 && (
            <ul className="welcome-shots" aria-label={`Capturas de ${project.name}`}>
              {shots.map((shot) => (
                <li key={shot} className="welcome-shot">
                  <span
                    className="welcome-shot-fallback"
                    style={{ background: project.fallbackGradient }}
                    aria-hidden="true"
                  />
                  <SmartImage
                    key={`${slideKey}-${shot}`}
                    basePath={`/projects/${project.slug}/screenshots/${shot}`}
                    kind="screenshots"
                    className="welcome-shot-img"
                    alt=""
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="welcome-actions">
            <button className="welcome-cta" type="button" onClick={() => openProject(project.slug)}>
              Más información
            </button>

            {/* Descuento y precio, al modo de la tienda. */}
            <div className="welcome-price">
              {price.discount !== undefined && (
                <span className="welcome-discount">-{price.discount}%</span>
              )}
              <span className="welcome-price-values">
                {price.original && <s className="welcome-price-was">{price.original}</s>}
                <span className="welcome-price-now">{price.final}</span>
              </span>
            </div>
          </div>

          <p className="welcome-text">{project.description}</p>

          <div className="welcome-controls">
            <button
              className="welcome-arrow"
              type="button"
              aria-label="Proyecto anterior"
              onClick={() => goTo(index - 1)}
            >
              <ChevronLeftIcon />
            </button>

            <div className="welcome-dots">
              {slides.map((slide, dotIndex) => (
                <button
                  key={slide.project.slug}
                  className={`welcome-dot ${dotIndex === index ? 'active' : ''}`}
                  type="button"
                  aria-label={`Ir a ${slide.project.name}`}
                  aria-current={dotIndex === index}
                  onClick={() => goTo(dotIndex)}
                />
              ))}
            </div>

            <button
              className="welcome-arrow"
              type="button"
              aria-label="Proyecto siguiente"
              onClick={() => goTo(index + 1)}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <footer className="welcome-footer">
          <p className="welcome-legal">
            © 2026 {devProfile.realName}. Steam y sus juegos son propiedad de Valve Corporation.
          </p>
          <button className="welcome-dismiss" type="button" onClick={close}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};
