import type { Project } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import './ProjectCapsule.css';

interface ProjectCapsuleProps {
  project: Project;
  onClick: () => void;
  selected?: boolean;
  className?: string;
  label?: string;
  /** Contador de la esquina inferior izquierda. Si se omite, no se pinta. */
  count?: number;
  /** El contador usa el verde de "jugando ahora" en lugar del gris. */
  countOnline?: boolean;
}

const formatDevTime = (devTime: string | undefined): string => {
  if (!devTime || devTime === '—' || devTime === 'próximamente') return '—';
  const hours = Number(devTime.replace(/[^0-9.]/g, '')) || 0;
  return `${String(hours).replace('.', ',')} horas`;
};

/** Cápsula vertical de proyecto (estilo Steam): portada 2:3 con la píldora de
 *  horas superpuesta y, si procede, un contador en la esquina inferior. */
export const ProjectCapsule: React.FC<ProjectCapsuleProps> = ({
  project,
  onClick,
  selected = false,
  className,
  label = project.name,
  count,
  countOnline = false,
}) => {
  const playtime = formatDevTime(project.devTime);

  return (
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
        {/* Sin dato de horas no se pinta píldora: un guion suelto parece un fallo. */}
        {playtime !== '—' && <span className="project-capsule-badge">{playtime}</span>}
      </span>
      {typeof count === 'number' && (
        <span className={`project-capsule-count${countOnline ? ' online' : ''}`} aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
};
