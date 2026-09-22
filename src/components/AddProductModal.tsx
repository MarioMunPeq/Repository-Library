import { projects } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  const upcoming = projects.filter((project) => project.status === 'proximamente');

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
            {upcoming.map((project) => (
              <li className="add-modal-item" key={project.slug}>
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
                <span className="add-modal-item-name">{project.name}</span>
                <span className="add-modal-item-badge">Próximamente</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="add-modal-empty">No hay proyectos en camino ahora mismo.</p>
        )}
      </div>
    </div>
  );
};