import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project, ProjectCategory } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ChevronDownIcon, ClockIcon, DiceIcon, FilterIcon, GridIcon, SearchIcon } from './Icons';

interface SidebarProps {
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onDeselectProject: () => void;
}

interface CategorySection {
  key: ProjectCategory;
  label: string;
}

type SidebarView = 'list' | 'grid';

const CATEGORY_SECTIONS: CategorySection[] = [
  { key: 'portfolio', label: 'Portfolios' },
  { key: 'otro', label: 'Otros proyectos' },
];

const renderListItems = (
  sectionProjects: Project[],
  selectedProject: Project | null,
  onSelectProject: (project: Project) => void,
) =>
  sectionProjects.map((project) => {
    const selected = selectedProject?.slug === project.slug;
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

const renderGridItems = (
  sectionProjects: Project[],
  selectedProject: Project | null,
  onSelectProject: (project: Project) => void,
) => (
  <div className="sidebar-grid">
    {sectionProjects.map((project) => {
      const selected = selectedProject?.slug === project.slug;
      return (
        <button
          key={project.slug}
          className={`sidebar-grid-item ${selected ? 'selected' : ''}`}
          onClick={() => onSelectProject(project)}
          aria-current={selected ? 'true' : 'false'}
        >
          <span className="sidebar-grid-frame" style={{ background: project.fallbackGradient }} aria-hidden="true">
            <SmartImage
              basePath={project.capsulePath}
              kind="capsule"
              className="sidebar-grid-img"
              alt=""
              fallback={<span className="gradient-fallback" />}
            />
          </span>
          <span className="sidebar-grid-name">{project.name}</span>
        </button>
      );
    })}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ selectedProject, onSelectProject, onDeselectProject }) => {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<SidebarView>('list');
  const [collapsedSections, setCollapsedSections] = useState<Record<ProjectCategory, boolean>>({
    portfolio: false,
    otro: false,
  });

  const normalized = query.trim().toLowerCase();
  const filteredProjects = useMemo(() => {
    return normalized ? projects.filter((p) => p.name.toLowerCase().includes(normalized)) : projects;
  }, [normalized]);

  const toggleSection = (key: ProjectCategory) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const gridView = view === 'grid';

  return (
    <aside className="sidebar" role="complementary" aria-label="Biblioteca">
      <div className="sidebar-home" role="button" tabIndex={0} onClick={onDeselectProject} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDeselectProject(); } }}>
        <button
          className="sidebar-view-toggle"
          type="button"
          onClick={(e) => { e.stopPropagation(); setView((prev) => (prev === 'list' ? 'grid' : 'list')); }}
          aria-pressed={gridView}
          aria-label="Cambiar vista lista/cuadrícula"
          title={gridView ? 'Vista cuadrícula' : 'Vista lista'}
        >
          <GridIcon className="sidebar-home-icon" />
        </button>
        <span className="sidebar-home-label">Página principal</span>
        <ChevronDownIcon className="sidebar-home-caret" />
      </div>

      <div className="sidebar-projects">
        <button className="sidebar-projects-toggle" onClick={() => setCollapsed((v) => !v)} aria-expanded={!collapsed}>
          <span className="sidebar-projects-label">Mis Proyectos</span>
          <span className="sidebar-projects-icons" aria-hidden="true">
            <ClockIcon className="sidebar-projects-btn" />
            <DiceIcon className="sidebar-projects-btn" />
          </span>
        </button>
      </div>

      <div className="sidebar-search">
        <SearchIcon className="sidebar-search-icon" />
        <input
          type="search"
          className="sidebar-search-input"
          placeholder="Buscar"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar proyectos"
        />
        <FilterIcon className="sidebar-filter-icon" />
      </div>

      {!collapsed && (
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
                    — {section.label} ({sectionProjects.length})
                  </span>
                  <ChevronDownIcon
                    className={`sidebar-category-chevron ${isCollapsed ? 'collapsed' : ''}`}
                  />
                </button>
                {!isCollapsed &&
                  (gridView
                    ? renderGridItems(sectionProjects, selectedProject, onSelectProject)
                    : renderListItems(sectionProjects, selectedProject, onSelectProject))}
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
};