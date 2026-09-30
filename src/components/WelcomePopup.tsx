import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects.tsx';
import { devProfile } from '../data/devProfile';
import { SmartImage } from './SmartImage';
import { CloseIcon } from './Icons';
import './WelcomePopup.css';

/** Se guarda en la sesión: al recargar dentro de la misma pestaña no vuelve a salir. */
const STORAGE_KEY = 'portfolio-library:bienvenida-vista';

/** Suma de las horas de trabajo declaradas en cada proyecto (ej. '120h'). */
const totalDevHours = projects.reduce((sum, project) => {
  const hours = Number.parseInt(project.devTime, 10);
  return Number.isNaN(hours) ? sum : sum + hours;
}, 0);

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  target: string;
  image: React.ReactNode;
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
  const published = projects.filter((project) => project.status === 'completado').length;

  const slide = useMemo<Slide>(
    () => ({
      eyebrow: 'Cómo funciona',
      title: 'Cada juego es un proyecto',
      body:
        `De los ${projects.length} proyectos, ${published} están terminados y el resto sigue en camino. ` +
        'Para que la biblioteca tenga sentido, cada entrada está asociada a un juego real de Steam y los ' +
        'logros que ves en su ficha son los de ese juego. Si el proyecto tiene demo publicada, el botón ' +
        'Jugar te lleva a ella. El proyecto estrella es Persona 5 Royal: es mi portfolio principal, el más ' +
        'desarrollado y el mejor terminado, así que es el primero que deberías abrir.',
      cta: 'Ver todos los proyectos',
      target: '/',
      image: (
        <div className="welcome-slide-projects">
          {projects.map((project) => (
            <span
              key={project.slug}
              className="welcome-slide-project"
              style={{ background: project.fallbackGradient }}
              title={project.name}
            >
              <SmartImage
                basePath={project.iconPath}
                kind="icon"
                className="welcome-slide-project-img"
                alt=""
                fallback={<span className="gradient-fallback" />}
              />
              <span className="welcome-slide-project-name">{project.name}</span>
            </span>
          ))}
        </div>
      ),
    }),
    [published],
  );

  const close = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Modo privado sin sessionStorage: simplemente no se recuerda.
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
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
  }, [open, close]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

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

        <div className="welcome-head">
          <span
            className="welcome-capsule"
            style={{ background: projects[0].fallbackGradient }}
            aria-hidden="true"
          >
            <SmartImage
              basePath="/projects/persona5/capsule"
              kind="capsule"
              className="welcome-capsule-img"
              alt=""
              fallback={<span className="gradient-fallback" />}
            />
          </span>

          <div className="welcome-head-main">
            <h1 className="welcome-title" id="welcome-title">
              Portfolio Library
            </h1>

            <div className="welcome-head-row">
              <button
                className="welcome-library-btn"
                type="button"
                onClick={() => {
                  close();
                  navigate('/');
                }}
              >
                Ver en la biblioteca
              </button>

              <dl className="welcome-stats">
                <div className="welcome-stat">
                  <dt className="welcome-stat-label">Proyectos</dt>
                  <dd className="welcome-stat-value">{projects.length}</dd>
                </div>
                <div className="welcome-stat">
                  <dt className="welcome-stat-label">Horas registradas</dt>
                  <dd className="welcome-stat-value">{totalDevHours} horas</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="welcome-body">
          <p className="welcome-eyebrow">{slide.eyebrow}</p>
          <h2 className="welcome-slide-title">{slide.title}</h2>
          {slide.image}
          <p className="welcome-text">{slide.body}</p>
          <button
            className="welcome-cta"
            type="button"
            onClick={() => {
              close();
              navigate(slide.target);
            }}
          >
            {slide.cta}
          </button>
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
