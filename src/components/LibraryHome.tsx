import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project, ProjectUpdate } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GearIcon,
} from './Icons';
import './LibraryHome.css';

interface FeedEntry {
  project: Project;
  update: ProjectUpdate;
  daysAgo: number;
}

const MONTH_ABBREVIATIONS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function daysAgo(date: string, now: Date = new Date()): number {
  try {
    const text = date?.trim?.().toLowerCase?.() ?? '';
    if (!text) return Number.MAX_SAFE_INTEGER;
    if (text === 'ahora' || text === 'hoy') return 0;
    if (text === 'ayer') return 1;

    const relative = text.match(/^hace\s+(\d+)\s+([a-zA-Z]+)/);
    if (relative) {
      const amount = Number(relative[1]);
      const unit = relative[2];
      if (unit.startsWith('min') || unit.startsWith('h')) return 0;
      if (unit.startsWith('d')) return amount;
      if (unit.startsWith('sem') || unit.startsWith('s')) return amount * 7;
      if (unit.startsWith('mes') || unit.startsWith('m')) return amount * 30;
      if (unit.startsWith('a')) return amount * 365;
      return amount;
    }

    const absolute = text.match(/^(\d{1,2})\s+([a-z]+)/);
    if (absolute) {
      const day = Number(absolute[1]);
      const monthName = absolute[2];
      const monthIndex = MONTH_ABBREVIATIONS.findIndex(
        (month) => month.startsWith(monthName) || monthName.startsWith(month),
      );
      if (monthIndex >= 0) {
        const currentYear = now.getFullYear();
        let year = currentYear;
        if (new Date(year, monthIndex, day).getTime() > now.getTime()) {
          year -= 1;
        }
        const diffMs = now.getTime() - new Date(year, monthIndex, day).getTime();
        return Math.max(0, Math.floor(diffMs / 86_400_000));
      }
    }

    return Number.MAX_SAFE_INTEGER;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

function getRelativeLabel(days: number): string {
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return 'Esta semana';
  if (days < 30) return `Hace ${days} días`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} años`;
}

type SortOption = 'name' | 'devTime' | 'lastUpdate';

interface LibraryHomeProps {
  onSelectProject: (project: Project) => void;
}

export const LibraryHome: React.FC<LibraryHomeProps> = ({ onSelectProject }) => {
  const [sortOption, setSortOption] = useState<SortOption>('name');

  const feed = useMemo((): FeedEntry[] => {
    const entries: FeedEntry[] = [];
    for (const project of projects) {
      if (project.status === 'proximamente') continue;
      for (const update of project.updates) {
        const days = daysAgo(update.date);
        if (days !== Number.MAX_SAFE_INTEGER) {
          entries.push({ project, update, daysAgo: days });
        }
      }
    }
    return entries.sort((a, b) => a.daysAgo - b.daysAgo);
  }, []);

  const portfolioProjects = useMemo(
    () => projects.filter((p) => p.category === 'portfolio'),
    [],
  );

  const otherProjects = useMemo(
    () => projects.filter((p) => p.category === 'otro'),
    [],
  );

  const sortProjects = (projectList: Project[], sortBy: SortOption): Project[] => {
    return [...projectList].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name ?? '').localeCompare(b.name ?? '');
        case 'devTime': {
          const timeA = a.devTime === '—' || !a.devTime ? 0 : Number(a.devTime.replace(/[^0-9.]/g, '')) || 0;
          const timeB = b.devTime === '—' || !b.devTime ? 0 : Number(b.devTime.replace(/[^0-9.]/g, '')) || 0;
          return timeB - timeA;
        }
        case 'lastUpdate': {
          const dateA = a.lastUpdate === '—' || !a.lastUpdate ? 0 : daysAgo(a.lastUpdate);
          const dateB = b.lastUpdate === '—' || !b.lastUpdate ? 0 : daysAgo(b.lastUpdate);
          return dateA - dateB;
        }
      }
    });
  };

  const sortedPortfolio = sortProjects(portfolioProjects, sortOption);
  const sortedOther = sortProjects(otherProjects, sortOption);

  return (
    <main className="library-home" role="main" aria-label="Página principal de la biblioteca">
      <section className="library-section news-section" aria-labelledby="news-heading">
        <header className="section-header">
          <div className="section-title-group">
            <h2 id="news-heading" className="section-title">Novedades</h2>
            <button className="section-gear" type="button" aria-label="Ajustes de novedades">
              <GearIcon className="section-gear-icon" />
            </button>
          </div>
          <div className="section-nav">
            <button className="nav-arrow left" type="button" aria-label="Anterior">
              <ChevronLeftIcon className="nav-arrow-icon" />
            </button>
            <button className="nav-arrow right" type="button" aria-label="Siguiente">
              <ChevronRightIcon className="nav-arrow-icon" />
            </button>
          </div>
        </header>
        <div className="news-carousel" role="list" aria-label="Tarjetas de novedades">
          {feed.length > 0 ? (
            feed.map((entry) => {
              const project = entry.project;
              if (!project) return null;
              return (
                <article
                  key={`${project.slug}-${entry.update.date}-${entry.update.title}`}
                  className="news-card"
                  role="listitem"
                >
                  <div
                    className="news-card-image"
                    style={{
                      background: project.fallbackGradient ?? '#1b2838',
                    }}
                  >
                    <SmartImage
                      basePath={project.heroPath || project.headerPath}
                      kind={project.heroPath ? 'hero' : 'header'}
                      className="news-card-img"
                      alt=""
                      fallback={<span className="gradient-fallback" />}
                    />
                    <span className="news-card-badge">{getRelativeLabel(entry.daysAgo)}</span>
                  </div>
                  <div className="news-card-content">
                    <h3 className="news-card-title">{entry.update.title}</h3>
                    <div className="news-card-meta">
                      <span className="news-card-project-icon" style={{ background: project.fallbackGradient ?? '#1b2838' }} aria-hidden="true">
                        <SmartImage
                          basePath={project.iconPath}
                          kind="icon"
                          className="news-project-img"
                          alt=""
                          fallback={<span className="gradient-fallback" />}
                        />
                      </span>
                      <span className="news-card-project-name">{project.name}</span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="news-empty" role="status">
              <p>No hay novedades recientes</p>
            </div>
          )}
        </div>
      </section>

      <section className="library-section projects-section" aria-labelledby="portfolio-heading">
        <header className="section-header">
          <div className="section-title-group">
            <h2 id="portfolio-heading" className="section-title-secondary">Mis Proyectos ({portfolioProjects.length})</h2>
            <button className="section-chevron" type="button" aria-label="Expandir sección">
              <ChevronDownIcon className="section-chevron-icon" />
            </button>
          </div>
          <div className="section-sort">
            <span className="sort-label">ORDENAR POR</span>
            <select
              className="sort-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              aria-label="Ordenar proyectos"
            >
              <option value="name">Nombre</option>
              <option value="devTime">Tiempo invertido</option>
              <option value="lastUpdate">Última actualización</option>
            </select>
          </div>
        </header>
        <div className="projects-grid" role="list" aria-label="Proyectos de portfolio">
          {sortedPortfolio.map((project) => {
            if (!project) return null;
            return (
              <button
                key={project.slug}
                className="project-capsule"
                onClick={() => onSelectProject(project)}
                role="listitem"
                aria-label={project.name}
              >
                <div
                  className="project-capsule-frame"
                  style={{ background: project.fallbackGradient ?? '#1b2838' }}
                  aria-hidden="true"
                >
                  <SmartImage
                    basePath={project.capsulePath}
                    kind="capsule"
                    className="project-capsule-img"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                </div>
                <div className="project-capsule-overlay">
                  <span className="project-capsule-name">{project.name}</span>
                  {project.devTime !== '—' && project.devTime !== 'próximamente' && project.devTime && (
                    <span className="project-capsule-badge">
                      {Math.round(Number(project.devTime.replace(/[^0-9.]/g, '')) || 0)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="library-section projects-section" aria-labelledby="other-heading">
        <header className="section-header">
          <div className="section-title-group">
            <h2 id="other-heading" className="section-title-secondary">Otros Proyectos ({otherProjects.length})</h2>
            <button className="section-chevron" type="button" aria-label="Expandir sección">
              <ChevronDownIcon className="section-chevron-icon" />
            </button>
          </div>
        </header>
        <div className="projects-grid" role="list" aria-label="Otros proyectos">
          {sortedOther.map((project) => {
            if (!project) return null;
            return (
              <button
                key={project.slug}
                className="project-capsule"
                onClick={() => onSelectProject(project)}
                role="listitem"
                aria-label={project.name}
              >
                <div
                  className="project-capsule-frame"
                  style={{ background: project.fallbackGradient ?? '#1b2838' }}
                  aria-hidden="true"
                >
                  <SmartImage
                    basePath={project.capsulePath}
                    kind="capsule"
                    className="project-capsule-img"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                </div>
                <div className="project-capsule-overlay">
                  <span className="project-capsule-name">{project.name}</span>
                  {project.devTime !== '—' && project.devTime !== 'próximamente' && project.devTime && (
                    <span className="project-capsule-badge">
                      {Math.round(Number(project.devTime.replace(/[^0-9.]/g, '')) || 0)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};