import { useEffect, useRef, useState } from 'react';
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CodeIcon,
  DisplayIcon,
  MaximizeIcon,
  MinimizeIcon,
  TrophyIcon,
} from './Icons';

export type SectionId = 'store' | 'library' | 'community' | 'profile';

interface NavBarProps {
  username: string;
  activeSection: SectionId;
  onSelectSection?: (section: SectionId) => void;
  onTogglePresentation?: () => void;
  onBack?: () => void;
  onForward?: () => void;
}

const SECTIONS: { id: 'store' | 'library' | 'community'; label: string }[] = [
  { id: 'store', label: 'TIENDA' },
  { id: 'library', label: 'BIBLIOTECA' },
  { id: 'community', label: 'COMUNIDAD' },
];

const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: <CodeIcon className="notif-item-svg" />,
    text: 'Nuevo proyecto añadido: Vault Archive',
    date: 'hace 2 días',
  },
  {
    id: 'n2',
    icon: <TrophyIcon className="notif-item-svg" />,
    text: 'Has desbloqueado el logro «Leyenda del draft»',
    date: 'hace 5 h',
  },
];

export const NavBar: React.FC<NavBarProps> = ({
  username,
  activeSection,
  onSelectSection,
  onTogglePresentation,
  onBack,
  onForward,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const initials = username.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!notifOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [notifOpen]);

  return (
    <header className="nav-bar">
      <div className="nav-back">
        <button className="nav-back-btn" aria-label="Atrás" onClick={onBack}>
          <ChevronLeftIcon />
        </button>
        <button className="nav-back-btn" aria-label="Adelante" onClick={onForward}>
          <ChevronRightIcon />
        </button>
      </div>

      <nav className="nav-tabs" role="tablist" aria-label="Secciones de la barra de navegación">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            role="tab"
            className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
            aria-selected={activeSection === section.id}
            onClick={() => onSelectSection?.(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <button
        className={`nav-user ${activeSection === 'profile' ? 'active' : ''}`}
        onClick={() => onSelectSection?.('profile')}
        aria-current={activeSection === 'profile' ? 'page' : undefined}
      >
        <span className="nav-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="nav-username">{username}</span>
      </button>

      <div className="nav-right">
        <div className="nav-icons">
          <div className="nav-icon-wrap" ref={notifRef}>
            <button
              className="nav-icon-btn"
              aria-label="Notificaciones"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((value) => !value)}
            >
              <BellIcon className="nav-icon-svg" />
              <span className="nav-notif-dot" aria-hidden="true" />
            </button>

            {notifOpen && (
              <div className="notif-panel" role="dialog" aria-label="Notificaciones">
                <span className="notif-panel-arrow" aria-hidden="true" />
                <div className="notif-header">
                  <span className="notif-title">Notificaciones</span>
                  <button className="notif-view-all" type="button">
                    Ver todas
                  </button>
                </div>
                <ul className="notif-list">
                  {NOTIFICATIONS.map((notification) => (
                    <li className="notif-item" key={notification.id}>
                      <span className="notif-item-icon" aria-hidden="true">
                        {notification.icon}
                      </span>
                      <div className="notif-item-body">
                        <span className="notif-item-text">{notification.text}</span>
                        <span className="notif-item-date">{notification.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="nav-icon-btn" aria-label="Modo presentación" onClick={onTogglePresentation}>
            <DisplayIcon className="nav-icon-svg" />
          </button>
        </div>

        <div className="window-controls">
          <button className="window-control minimize" aria-label="Minimizar">
            <MinimizeIcon />
          </button>
          <button className="window-control maximize" aria-label="Maximizar">
            <MaximizeIcon />
          </button>
          <button className="window-control close" aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>
      </div>
    </header>
  );
};