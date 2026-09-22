import { useEffect, useMemo, useState } from 'react';
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
const FEATURED_COUNT = 4;

export const StorePage: React.FC<StorePageProps> = ({ onOpenProject }) => {
  const visibleProjects = useMemo(() => [...projects], []);
  const featured = useMemo(
    () => visibleProjects.slice(0, Math.min(FEATURED_COUNT, visibleProjects.length)),
    [visibleProjects],
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % featured.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  const goTo = (direction: -1 | 1) => {
    setFeaturedIndex((index) => (index + direction + featured.length) % featured.length);
  };

  return (
    <main className="store-page" role="main" aria-label="Tienda">
      <section className="store-featured" aria-label="Proyectos destacados">
        {featured.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            className="store-featured-slide"
            data-active={index === featuredIndex}
            style={{ background: project.fallbackGradient }}
            onClick={() => onOpenProject(project)}
            aria-label={`Abrir ${project.name}`}
          >
            <SmartImage
              basePath={project.heroPath}
              kind="hero"
              className="store-featured-img"
              alt=""
              fallback={<span className="gradient-fallback" />}
            />
            <span className="store-featured-logo">
              <ProjectLogo project={project} />
            </span>
            <span className="store-featured-tag">{project.name}</span>
          </button>
        ))}

        <div className="store-featured-dots" role="tablist" aria-label="Seleccionar destacado">
          {featured.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              className={`store-featured-dot ${index === featuredIndex ? 'active' : ''}`}
              onClick={() => setFeaturedIndex(index)}
              aria-label={project.name}
              aria-selected={index === featuredIndex}
              role="tab"
            />
          ))}
        </div>

        <button className="store-featured-arrow left" type="button" aria-label="Anterior" onClick={() => goTo(-1)}>
          <ChevronLeftIcon className="store-featured-arrow-svg" />
        </button>
        <button className="store-featured-arrow right" type="button" aria-label="Siguiente" onClick={() => goTo(1)}>
          <ChevronRightIcon className="store-featured-arrow-svg" />
        </button>
      </section>

      <section className="store-capsules-section" aria-label="Todos los proyectos">
        <h2 className="store-capsules-title">Todos los proyectos</h2>
        <div className="store-capsules">
          {visibleProjects.map((project) => (
            <button
              key={project.slug}
              type="button"
              className="store-capsule"
              style={{ background: project.fallbackGradient }}
              onClick={() => onOpenProject(project)}
              aria-label={`Abrir ${project.name}`}
            >
              <SmartImage
                basePath={project.headerPath}
                kind="header"
                className="store-capsule-img"
                alt=""
                fallback={<span className="gradient-fallback" />}
              />
              <span className="store-capsule-name">{project.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};