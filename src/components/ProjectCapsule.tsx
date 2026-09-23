import type { Project } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import './ProjectCapsule.css';

interface ProjectCapsuleProps {
  project: Project;
  onClick: () => void;
  selected?: boolean;
  className?: string;
  label?: string;
}

const formatDevTime = (devTime: string | undefined): string => {
  if (!devTime || devTime === '—' || devTime === 'próximamente') return '—';
  const hours = Number(devTime.replace(/[^0-9.]/g, '')) || 0;
  return `${String(hours).replace('.', ',')} horas`;
};

/** Cápsula vertical de proyecto (estilo Steam): portada 2:3 + barra de horas al pie. */
export const ProjectCapsule: React.FC<ProjectCapsuleProps> = ({
  project,
  onClick,
  selected = false,
  className,
  label = project.name,
}) => (
  <button
    type="button"
    className={`project-capsule ${selected ? 'selected' : ''} ${className ?? ''}`.trim()}
    onClick={onClick}
    aria-label={label}
    aria-current={selected ? 'true' : undefined}
  >
    <span
      className="project-capsule-frame"
      style={{ background: project.fallbackGradient }}
      aria-hidden="true"
    >
      <SmartImage
        basePath={project.capsulePath}
        kind="capsule"
        className="project-capsule-img"
        alt=""
        fallback={<span className="gradient-fallback" />}
      />
    </span>
    <span className="project-capsule-time">{formatDevTime(project.devTime)}</span>
  </button>
);