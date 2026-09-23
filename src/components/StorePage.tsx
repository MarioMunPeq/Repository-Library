import { useEffect, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ProjectLogo } from './ProjectLogo';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import './StorePage.css';

interface StorePageProps {
  onOpenProject: (project: Project) => void;
}

const AUTOPLAY_MS = 5000;

export const StorePage: React.FC<StorePageProps> = ({ onOpenProject }) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  useEffect(() => {
    if (projects.length < 2 || autoPlayPaused) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % projects.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoPlayPaused]);

  const goTo = (direction: -1 | 1) => {
    setAutoPlayPaused(true);
    setFeaturedIndex((index) => (index + direction + projects.length) % projects.length);
  };

  const selectDot = (index: number) => {
    setAutoPlayPaused(true);
    setFeaturedIndex(index);
  };

  return (
    <main className="store-page" role="main" aria-label="Tienda">
      <section className="store-carousel" aria-label="Proyectos destacados">
        {projects.map((project, index) => {
          const active = index === featuredIndex;
          return (
            <div
              key={project.slug}
              id={`store-slide-${project.slug}`}
              className={`store-carousel-slide ${active ? 'active' : ''}`}
              role="button"
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-label={`Ver ${project.name} en la biblioteca`}
              onClick={() => onOpenProject(project)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenProject(project);
                }
              }}
              style={{ background: project.fallbackGradient }}
            >
              <SmartImage
                basePath={project.heroPath}
                kind="hero"
                className="store-carousel-img"
                alt=""
                fallback={<span className="gradient-fallback" />}
              />
              <div className="store-carousel-vignette" aria-hidden="true" />
              <div className="store-carousel-logo" aria-hidden="true">
                <ProjectLogo project={project} />
              </div>
            </div>
          );
        })}

        <button
          className="store-carousel-arrow store-carousel-arrow-left"
          type="button"
          aria-label="Proyecto anterior"
          onClick={() => goTo(-1)}
        >
          <ChevronLeftIcon className="store-carousel-arrow-svg" />
        </button>
        <button
          className="store-carousel-arrow store-carousel-arrow-right"
          type="button"
          aria-label="Siguiente proyecto"
          onClick={() => goTo(1)}
        >
          <ChevronRightIcon className="store-carousel-arrow-svg" />
        </button>

        <div className="store-carousel-dots" role="tablist" aria-label="Seleccionar proyecto destacado">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              className={`store-carousel-dot ${index === featuredIndex ? 'active' : ''}`}
              aria-selected={index === featuredIndex}
              aria-controls={`store-slide-${project.slug}`}
              aria-label={project.name}
              onClick={() => selectDot(index)}
            />
          ))}
        </div>
      </section>

      <section className="store-projects" aria-labelledby="store-projects-title">
        <h2 id="store-projects-title" className="store-projects-title">
          Todos los proyectos ({projects.length})
        </h2>
        <div className="store-projects-grid" role="list" aria-label="Todos los proyectos">
          {projects.map((project) => (
            <button
              key={project.slug}
              className="store-project-card"
              role="listitem"
              onClick={() => onOpenProject(project)}
              aria-label={`Ver ${project.name} en la biblioteca`}
            >
              <div
                className="store-project-frame"
                style={{ background: project.fallbackGradient ?? '#1b2838' }}
                aria-hidden="true"
              >
                <SmartImage
                  basePath={project.headerPath}
                  kind="header"
                  className="store-project-img"
                  alt=""
                  fallback={<span className="gradient-fallback" />}
                />
              </div>
              <span className="store-project-name">{project.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};