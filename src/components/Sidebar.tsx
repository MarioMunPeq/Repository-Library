import { useState } from 'react';
import { projects, statusConfig } from '../data/projects.tsx';
import type { Project, ProjectStatus } from '../data/projects.tsx';
import { CloseIcon, ChevronDownIcon } from './Icons';

interface SidebarProps {
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge: React.FC<{ status: ProjectStatus; small?: boolean }> = ({ status, small }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`status-badge ${small ? 'small' : ''}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.color,
      }}
    >
      {config.label}
    </span>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedProject,
  onSelectProject,
  isOpen,
  onClose,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (status: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.status]) acc[project.status] = [];
    acc[project.status].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const statusOrder: ProjectStatus[] = ['completed', 'in-development', 'paused', 'coming-soon'];
  const statusLabels: Record<ProjectStatus, string> = {
    completed: 'COMPLETADOS',
    'in-development': 'EN DESARROLLO',
    paused: 'PAUSADOS',
    'coming-soon': 'PRÓXIMAMENTE',
  };

  if (!isOpen) return null;

  return (
    <aside className="sidebar" role="complementary" aria-label="Biblioteca de proyectos">
      <div className="sidebar-header">
        <h2>BIBLIOTECA</h2>
        <button className="sidebar-close" onClick={onClose} aria-label="Cerrar biblioteca">
          <CloseIcon />
        </button>
      </div>

      <nav className="sidebar-nav" role="navigation" aria-label="Lista de proyectos">
        {statusOrder.map((status) => {
          const categoryProjects = groupedProjects[status];
          if (!categoryProjects || categoryProjects.length === 0) return null;

          const isCollapsed = collapsedCategories.has(status);

          return (
            <div key={status} className="project-category">
              <button
                className="category-header"
                onClick={() => toggleCategory(status)}
                aria-expanded={!isCollapsed}
              >
                <span className="category-label">{statusLabels[status]}</span>
                <span className="category-count">{categoryProjects.length}</span>
                <ChevronDownIcon className={`chevron ${isCollapsed ? 'collapsed' : ''}`} />
              </button>

              {!isCollapsed && (
                <ul className="project-list" role="list">
                  {categoryProjects.map((project) => (
                    <li key={project.id} role="listitem">
                      <button
                        className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                        onClick={() => onSelectProject(project)}
                        aria-current={selectedProject?.id === project.id ? 'true' : 'false'}
                      >
                        <span className="project-icon" style={{ color: project.bannerColor }}>
                          {project.icon}
                        </span>
                        <span className="project-name">{project.name}</span>
                        <StatusBadge status={project.status} small />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="project-count">
          {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
        </p>
      </div>
    </aside>
  );
};