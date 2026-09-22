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

const FEATURED_COUNT = 5;
const AUTOPLAY_MS = 7000;

const STORE_NAV_TABS = [
  { id: 'store', label: 'TIENDA' },
  { id: 'home', label: 'INICIO' },
  { id: 'explore', label: 'EXPLORAR' },
  { id: 'wishlist', label: 'LISTA DE DESEOS' },
  { id: 'news', label: 'NOTICIAS' },
  { id: 'stats', label: 'ESTADÍSTICAS' },
];

export const StorePage: React.FC<StorePageProps> = ({ onOpenProject }) => {
  const visibleProjects = useMemo(() => [...projects], []);
  const featured = useMemo(
    () => visibleProjects.slice(0, Math.min(FEATURED_COUNT, visibleProjects.length)),
    [visibleProjects],
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  useEffect(() => {
    if (featured.length < 2 || autoPlayPaused) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % featured.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [featured.length, autoPlayPaused]);

  const goTo = (direction: -1 | 1) => {
    setFeaturedIndex((index) => (index + direction + featured.length) % featured.length);
  };

  const currentFeatured = featured[featuredIndex];

  return (
    <main className="store-page" role="main" aria-label="Tienda">
      <nav className="store-navbar" role="navigation" aria-label="Navegación de la tienda">
        <div className="store-navbar-inner">
          {STORE_NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`store-nav-tab ${tab.id === 'store' ? 'active' : ''}`}
              aria-current={tab.id === 'store' ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
          <div className="store-nav-search" role="search" aria-label="Buscar en la tienda">
            <svg className="store-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Buscar en la tienda..."
              className="store-search-input"
              aria-label="Buscar en la tienda"
            />
          </div>
          <div className="store-nav-user">
            <span className="store-nav-avatar" aria-hidden="true">MM</span>
            <span className="store-nav-username">MarioMunPeq</span>
          </div>
        </div>
      </nav>

      <section className="store-hero" aria-labelledby="hero-title">
        <div className="store-hero-bg" style={{ background: currentFeatured?.fallbackGradient }}>
          <SmartImage
            basePath={currentFeatured?.heroPath}
            kind="hero"
            className="store-hero-img"
            alt=""
            fallback={<span className="gradient-fallback" />}
          />
          <div className="store-hero-vignette" />
        </div>
        <div className="store-hero-content">
          <div className="store-hero-main">
            <span className="store-hero-badge">PROYECTO DESTACADO</span>
            <h1 id="hero-title" className="store-hero-title">
              <span className="store-hero-logo">
                <ProjectLogo project={currentFeatured!} />
              </span>
              {currentFeatured?.name}
            </h1>
            <p className="store-hero-description">{currentFeatured?.description}</p>
            <div className="store-hero-tags">
              {currentFeatured?.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="store-hero-tag">{tag}</span>
              ))}
            </div>
            <div className="store-hero-actions">
              <button
                className="store-btn store-btn-primary"
                onClick={() => currentFeatured && onOpenProject(currentFeatured)}
                aria-label={`Ver ${currentFeatured?.name}`}
              >
                <svg className="store-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                VER PROYECTO
              </button>
              <button className="store-btn store-btn-secondary" aria-label="Añadir a lista de deseos">
                <svg className="store-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                AÑADIR A LISTA DE DESEOS
              </button>
              {currentFeatured?.githubUrl && (
                <a
                  href={currentFeatured.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-btn store-btn-tertiary"
                  aria-label="Ver en GitHub"
                >
                  <svg className="store-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" />
                  </svg>
                  GITHUB
                </a>
              )}
            </div>
          </div>
          <div className="store-hero-sidebar">
            <div className="store-hero-stats">
              <div className="store-stat">
                <span className="store-stat-label">ESTADO</span>
                <span className={`store-stat-value ${currentFeatured?.status === 'completado' ? 'completed' : currentFeatured?.status === 'en desarrollo' ? 'in-progress' : 'upcoming'}`}>
                  {currentFeatured?.status === 'completado' ? 'COMPLETADO' : currentFeatured?.status === 'en desarrollo' ? 'EN DESARROLLO' : 'PRÓXIMAMENTE'}
                </span>
              </div>
              <div className="store-stat">
                <span className="store-stat-label">CATEGORÍA</span>
                <span className="store-stat-value">{currentFeatured?.category === 'portfolio' ? 'PORTFOLIO' : 'OTRO'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="store-hero-indicators" role="tablist" aria-label="Seleccionar proyecto destacado">
          {featured.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              className={`store-hero-indicator ${index === featuredIndex ? 'active' : ''}`}
              onClick={() => setFeaturedIndex(index)}
              onMouseEnter={() => setAutoPlayPaused(true)}
              onMouseLeave={() => setAutoPlayPaused(false)}
              aria-label={project.name}
              aria-selected={index === featuredIndex}
              role="tab"
            >
              <span className="store-hero-indicator-bar" />
              <span className="store-hero-indicator-label">{project.name}</span>
            </button>
          ))}
        </div>

        <button
          className="store-hero-arrow store-hero-arrow-left"
          type="button"
          aria-label="Proyecto anterior"
          onClick={() => goTo(-1)}
          onMouseEnter={() => setAutoPlayPaused(true)}
          onMouseLeave={() => setAutoPlayPaused(false)}
        >
          <ChevronLeftIcon className="store-hero-arrow-svg" />
        </button>
        <button
          className="store-hero-arrow store-hero-arrow-right"
          type="button"
          aria-label="Siguiente proyecto"
          onClick={() => goTo(1)}
          onMouseEnter={() => setAutoPlayPaused(true)}
          onMouseLeave={() => setAutoPlayPaused(false)}
        >
          <ChevronRightIcon className="store-hero-arrow-svg" />
        </button>
      </section>

      <section className="store-featured-section" aria-labelledby="featured-title">
        <header className="store-section-header">
          <h2 id="featured-title" className="store-section-title">PROYECTOS DESTACADOS</h2>
          <button className="store-section-view-all" type="button" aria-label="Ver todos los proyectos">
            Ver todos
            <ChevronRightIcon className="store-section-chevron" />
          </button>
        </header>
        <div className="store-capsules-carousel" role="list" aria-label="Lista de proyectos destacados">
          {visibleProjects.map((project) => (
            <article
              key={project.slug}
              className="store-capsule"
              role="listitem"
              onClick={() => onOpenProject(project)}
              style={{ background: project.fallbackGradient }}
            >
              <div className="store-capsule-frame">
                <SmartImage
                  basePath={project.headerPath}
                  kind="header"
                  className="store-capsule-img"
                  alt=""
                  fallback={<span className="gradient-fallback" />}
                />
                <div className="store-capsule-gradient" />
              </div>
              <div className="store-capsule-info">
                <span className="store-capsule-name">{project.name}</span>
                <span className="store-capsule-category">{project.category === 'portfolio' ? 'Portfolio' : 'Otro'}</span>
                <span className={`store-capsule-status ${project.status === 'completado' ? 'completed' : project.status === 'en desarrollo' ? 'in-progress' : 'upcoming'}`}>
                  {project.status === 'completado' ? 'Completado' : project.status === 'en desarrollo' ? 'En desarrollo' : 'Próximamente'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="store-categories-section" aria-labelledby="categories-title">
        <header className="store-section-header">
          <h2 id="categories-title" className="store-section-title">EXPLORAR POR CATEGORÍA</h2>
        </header>
        <div className="store-categories-grid" role="list" aria-label="Categorías de proyectos">
          <article className="store-category" role="listitem">
            <div className="store-category-bg" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%)' }} />
            <div className="store-category-content">
              <span className="store-category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
              <h3 className="store-category-name">Portfolio</h3>
              <span className="store-category-count">{projects.filter(p => p.category === 'portfolio').length} proyectos</span>
            </div>
          </article>
          <article className="store-category" role="listitem">
            <div className="store-category-bg" style={{ background: 'linear-gradient(135deg, #3a2a1a 0%, #1f140d 100%)' }} />
            <div className="store-category-content">
              <span className="store-category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <h3 className="store-category-name">Otros Proyectos</h3>
              <span className="store-category-count">{projects.filter(p => p.category === 'otro').length} proyectos</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};