import type { SectionId } from './NavBar';
import { GridIcon, StoreIcon, TrophyIcon, UserIcon } from './Icons';
import './MobileTabBar.css';

interface MobileTabBarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
}

const TABS: { id: SectionId; label: string; Icon: typeof GridIcon }[] = [
  { id: 'store', label: 'Tienda', Icon: StoreIcon },
  { id: 'library', label: 'Biblioteca', Icon: GridIcon },
  { id: 'community', label: 'Comunidad', Icon: TrophyIcon },
  { id: 'profile', label: 'Perfil', Icon: UserIcon },
];

/**
 * Barra de pestañas fija abajo, solo visible en móvil (en escritorio la
 * navegación vive en la barra superior y esta se oculta por CSS).
 * Es el patrón habitual de app: la navegación principal siempre a la vista
 * en lugar de escondida tras un menú.
 */
export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeSection, onSelectSection }) => (
  <nav className="mobile-tabs" aria-label="Navegación principal">
    {TABS.map(({ id, label, Icon }) => {
      const active = activeSection === id;
      return (
        <button
          key={id}
          className={`mobile-tab${active ? ' active' : ''}`}
          onClick={() => onSelectSection(id)}
          aria-current={active ? 'page' : undefined}
        >
          <Icon className="mobile-tab-icon" />
          <span className="mobile-tab-label">{label}</span>
        </button>
      );
    })}
  </nav>
);
