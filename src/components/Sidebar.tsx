import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project, ProjectCategory } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ChevronDownIcon, GridIcon } from './Icons';

interface SidebarProps {
  selectedProject: Project | null;
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

export const Sidebar: React.FC<SidebarProps> = ({ selectedProject, onSelectProject, onDeselectProject }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<ProjectCategory, boolean>>({
    portfolio: false,
    juego: false,
  });

  const filteredProjects = useMemo(() => projects, []);

  const toggleSection = (key: ProjectCategory) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="sidebar" role="complementary" aria-label="Biblioteca">
      <div className="sidebar-home" role="button" tabIndex={0} onClick={onDeselectProject} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDeselectProject(); } }}>
        <GridIcon className="sidebar-home-icon" />
        <span className="sidebar-home-label">Página principal</span>
      </div>

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
              {!isCollapsed && renderListItems(sectionProjects, selectedProject, onSelectProject)}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};