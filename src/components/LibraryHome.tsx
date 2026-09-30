import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project } from '../data/projects.tsx';
import { ProjectCapsule } from './ProjectCapsule';
import { ChevronDownIcon, PlayIcon } from './Icons';
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
  const [collapsed, setCollapsed] = useState<Record<'portfolio' | 'juego', boolean>>({
    portfolio: false,
    juego: false,
  });

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

  const toggle = (key: 'portfolio' | 'juego') =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    { key: 'portfolio' as const, title: 'Portfolios', list: portfolioProjects },
    { key: 'juego' as const, title: 'Juegos', list: juegoProjects },
  ];

  const sortControls = (id: string) => (
    <div className="section-sort">
      <span className="sort-label">ORDENAR POR</span>
      <select
        className="sort-dropdown"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        aria-label={`Ordenar ${id}`}
      >
        <option value="name">Nombre</option>
        <option value="devTime">Tiempo invertido</option>
        <option value="lastUpdate">Última actualización</option>
      </select>
    </div>
  );

  return (
    <main className="library-home" role="main" aria-label="Página principal de la biblioteca">
      {sections.map((section) => {
        const isCollapsed = collapsed[section.key];
        return (
          <section
            className="library-section projects-section"
            key={section.key}
            aria-labelledby={`${section.key}-heading`}
          >
            <header className="section-header">
              <div className="section-title-group">
                <h2 id={`${section.key}-heading`} className="section-title-secondary">
                  {section.title} ({section.list.length})
                </h2>

                <button
                  className={`section-round-btn ${isCollapsed ? 'collapsed' : ''}`}
                  type="button"
                  aria-label={isCollapsed ? `Expandir ${section.title}` : `Contraer ${section.title}`}
                  aria-expanded={!isCollapsed}
                  onClick={() => toggle(section.key)}
                >
                  <ChevronDownIcon className="section-round-btn-svg" />
                </button>

                <button
                  className="section-round-btn"
                  type="button"
                  aria-label={`Opciones de ${section.title}`}
                >
                  <PlayIcon className="section-round-btn-svg" />
                </button>
              </div>

              {sortControls(section.title)}

              <button
                className="section-round-btn section-collapse"
                type="button"
                aria-label="Contraer todo"
                onClick={() => setCollapsed({ portfolio: true, juego: true })}
              >
                <ChevronDownIcon className="section-round-btn-svg" />
              </button>
            </header>

            {!isCollapsed && (
              <div className="projects-grid" role="list" aria-label={section.title}>
                {sortProjects(section.list, sortOption).map((project) => {
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
            )}
          </section>
        );
      })}
    </main>
  );
};