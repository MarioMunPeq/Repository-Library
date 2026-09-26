import { projects } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { DownloadIcon } from './Icons';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  completado: 'Publicado',
  'en desarrollo': 'En desarrollo',
  proximamente: 'Próximamente',
};

export const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  // Todo lo que aún no está publicado es lo que se puede "añadir" a la
  // biblioteca: lo terminado ya está dentro.
  const upcoming = projects
    .filter((project) => project.status !== 'completado')
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return (
    <div className="add-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="add-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Próximos proyectos"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="add-modal-header">
          <h2 className="add-modal-title">Próximos proyectos</h2>
          <button className="add-modal-close" type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {upcoming.length > 0 ? (
          <ul className="add-modal-list">
            {upcoming.map((project) => {
              const content = (
                <>
                  <span
                    className="add-modal-item-icon"
                    style={{ background: project.fallbackGradient }}
                    aria-hidden="true"
                  >
                    <SmartImage
                      basePath={project.iconPath}
                      kind="icon"
                      className="sidebar-item-img"
                      alt=""
                      fallback={<span className="gradient-fallback" />}
                    />
                  </span>
                  <span className="add-modal-item-info">
                    <span className="add-modal-item-name">{project.name}</span>
                    <span className="add-modal-item-hint">
                      {project.githubUrl
                        ? 'Toca para abrir el proyecto en el navegador'
                        : 'Todavía no hay una demo pública'}
                    </span>
                  </span>
                  {project.githubUrl && <DownloadIcon className="add-modal-item-go" />}
                </>
              );

              return (
                <li key={project.slug} className="add-modal-item">
                  {project.githubUrl ? (
                    <a
                      className="add-modal-item-link"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="add-modal-item-link is-disabled">{content}</span>
                  )}
                  <span className="add-modal-item-badge">{STATUS_LABEL[project.status]}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="add-modal-empty">No hay proyectos en camino ahora mismo.</p>
        )}
      </div>
    </div>
  );
};
