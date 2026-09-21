import { statusConfig } from '../data/projects.tsx';
import type { Project } from '../data/projects.tsx';
import { PlayIcon, ArrowRightIcon, TagIcon, CodeIcon, GlobeIcon, ExternalLinkIcon } from './Icons';

interface MainPanelProps {
  project: Project | null;
}

export const MainPanel: React.FC<MainPanelProps> = ({ project }) => {
  if (!project) {
    return (
      <main className="main-panel empty">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h2>Selecciona un proyecto</h2>
          <p>Elige un proyecto de la biblioteca para ver sus detalles</p>
        </div>
      </main>
    );
  }

  const config = statusConfig[project.status];
  const isComingSoon = project.status === 'coming-soon';

  return (
    <main className="main-panel" role="main" aria-label={project.name}>
      <div className="project-header" style={{ backgroundColor: project.bannerColor }}>
        <div className="banner-gradient" />
        <div className="banner-content">
          <div className="project-meta">
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  <TagIcon className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-title-row">
              <h1 className="project-title">{project.name}</h1>
              <span
                className="status-badge large"
                style={{
                  backgroundColor: config.bgColor,
                  color: config.color,
                  borderColor: config.color,
                }}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="project-body">
        <section className="project-description" aria-labelledby="desc-heading">
          <h2 id="desc-heading" className="section-title">DESCRIPCIÓN</h2>
          <p className="description-text">{project.description}</p>
        </section>

        <section className="project-technologies" aria-labelledby="tech-heading">
          <h2 id="tech-heading" className="section-title">TECNOLOGÍAS</h2>
          <div className="tech-grid">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-item">
                <CodeIcon className="tech-icon" />
                {tech}
              </span>
            ))}
          </div>
        </section>

        <div className="project-actions">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`action-btn primary ${isComingSoon ? 'disabled' : ''}`}
            aria-disabled={isComingSoon}
            tabIndex={isComingSoon ? -1 : 0}
            onClick={(e) => isComingSoon && e.preventDefault()}
          >
            <PlayIcon className="btn-icon" />
            <span>{isComingSoon ? 'PRÓXIMAMENTE' : 'VER PROYECTO'}</span>
            {!isComingSoon && <ArrowRightIcon className="btn-icon" />}
          </a>

          {!isComingSoon && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary"
            >
              <GlobeIcon className="btn-icon" />
              <span>Visitar sitio</span>
              <ExternalLinkIcon className="btn-icon" />
            </a>
          )}
        </div>
      </div>
    </main>
  );
};