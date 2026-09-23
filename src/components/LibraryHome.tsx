import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project } from '../data/projects.tsx';
import { ProjectCapsule } from './ProjectCapsule';
import { ChevronDownIcon } from './Icons';
import './LibraryHome.css';

type SortOption = 'name' | 'devTime' | 'lastUpdate';

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
      const monthIndex = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].findIndex(
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

interface LibraryHomeProps {
  onSelectProject: (project: Project) => void;
}

export const LibraryHome: React.FC<LibraryHomeProps> = ({ onSelectProject }) => {
  const [sortOption, setSortOption] = useState<SortOption>('name');

  const portfolioProjects = useMemo(
    () => projects.filter((p) => p.category === 'portfolio'),
    [],
  );

  const juegoProjects = useMemo(
    () => projects.filter((p) => p.category === 'juego'),
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
  const sortedJuegos = sortProjects(juegoProjects, sortOption);

  return (
    <main className="library-home" role="main" aria-label="Página principal de la biblioteca">
      <section className="library-section projects-section" aria-labelledby="portfolio-heading">
        <header className="section-header">
          <div className="section-title-group">
            <h2 id="portfolio-heading" className="section-title-secondary">Portfolios ({portfolioProjects.length})</h2>
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
              <ProjectCapsule
                key={project.slug}
                project={project}
                onClick={() => onSelectProject(project)}
                label={project.name}
              />
            );
          })}
        </div>
      </section>

      <section className="library-section projects-section" aria-labelledby="juegos-heading">
        <header className="section-header">
          <div className="section-title-group">
            <h2 id="juegos-heading" className="section-title-secondary">Juegos ({juegoProjects.length})</h2>
            <button className="section-chevron" type="button" aria-label="Expandir sección">
              <ChevronDownIcon className="section-chevron-icon" />
            </button>
          </div>
        </header>
        <div className="projects-grid" role="list" aria-label="Juegos">
          {sortedJuegos.map((project) => {
            if (!project) return null;
            return (
              <ProjectCapsule
                key={project.slug}
                project={project}
                onClick={() => onSelectProject(project)}
                label={project.name}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
};