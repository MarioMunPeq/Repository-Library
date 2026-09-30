import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project, ProjectCategory } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ChevronDownIcon, ClockIcon, FilterIcon, GridIcon, InfoIcon, PlayIcon, SearchIcon } from './Icons';

interface SidebarProps {
  /** Slug del proyecto abierto, o null si estamos en la portada. */
  selectedSlug: string | null;
  onSelectProject: (project: Project) => void;
  onDeselectProject: () => void;
}

interface CategorySection {
  key: ProjectCategory;
  label: string;
}

const CATEGORY_SECTIONS: CategorySection[] = [
  { key: 'portfolio', label: 'PORTFOLIOS' },
  { key: 'juego', label: 'JUEGOS' },
];

const renderListItems = (
  sectionProjects: Project[],
  selectedSlug: string | null,
  onSelectProject: (project: Project) => void,
) =>
  sectionProjects.map((project) => {
    const selected = selectedSlug === project.slug;
    return (
      <button
        key={project.slug}
        className={`sidebar-item ${selected ? 'selected' : ''}`}
        onClick={() => onSelectProject(project)}
        aria-current={selected ? 'true' : 'false'}
      >
        <span className="sidebar-item-icon" style={{ background: project.fallbackGradient }} aria-hidden="true">
          <SmartImage
            basePath={project.iconPath}
            kind="icon"
            className="sidebar-item-img"
            alt=""
            fallback={<span className="gradient-fallback" />}
          />
        </span>
        <span className="sidebar-item-name">{project.name}</span>
      </button>
    );
  });

export const Sidebar: React.FC<SidebarProps> = ({ selectedSlug, onSelectProject, onDeselectProject }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<ProjectCategory, boolean>>({
    portfolio: false,
    juego: false,
  });
  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(term));
  }, [query]);

  const toggleSection = (key: ProjectCategory) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="sidebar" role="complementary" aria-label="Biblioteca">
      <div className="sidebar-top">
        <button
          className="sidebar-home"
          onClick={onDeselectProject}
          aria-current={selectedSlug ? undefined : 'page'}
        >
          <GridIcon className="sidebar-home-icon" />
          <span className="sidebar-home-label">Página principal</span>
        </button>

        <button className="sidebar-grid-btn" type="button" aria-label="Ver como cuadrícula">
          <span className="sidebar-grid-cell" aria-hidden="true" />
          <span className="sidebar-grid-cell" aria-hidden="true" />
          <span className="sidebar-grid-cell" aria-hidden="true" />
          <span className="sidebar-grid-cell" aria-hidden="true" />
        </button>
      </div>

      <div className="sidebar-search">
        <SearchIcon className="sidebar-search-icon" />
        <input
          className="sidebar-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar"
          aria-label="Buscar en la biblioteca"
        />
        <button className="sidebar-search-filter" type="button" aria-label="Filtrar">
          <FilterIcon className="sidebar-search-filter-icon" />
        </button>
      </div>

      <button className="sidebar-apps" type="button">
        <ClockIcon className="sidebar-apps-icon" />
        <span className="sidebar-apps-label">Juegos y Herramientas</span>
        <span className="sidebar-apps-actions">
          <span className="sidebar-apps-btn" role="button" aria-label="Información">
            <InfoIcon className="sidebar-apps-btn-icon" />
          </span>
          <span className="sidebar-apps-btn" role="button" aria-label="Jugar">
            <PlayIcon className="sidebar-apps-btn-icon" />
          </span>
        </span>
      </button>

      <nav className="sidebar-list" role="navigation" aria-label="Proyectos">
        {CATEGORY_SECTIONS.map((section) => {
          const sectionProjects = filteredProjects.filter((project) => project.category === section.key);
          const isCollapsed = collapsedSections[section.key];
          return (
            <div className="sidebar-category" key={section.key}>
              <button
                className="sidebar-category-header"
                onClick={() => toggleSection(section.key)}
                aria-expanded={!isCollapsed}
              >
                <span className="sidebar-category-title">
                  <span className="sidebar-category-name">— {section.label}</span>
                  <span className="sidebar-category-count">({sectionProjects.length})</span>
                </span>
                <ChevronDownIcon
                  className={`sidebar-category-chevron ${isCollapsed ? 'collapsed' : ''}`}
                />
              </button>
              {!isCollapsed && renderListItems(sectionProjects, selectedSlug, onSelectProject)}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};