import { useState, useEffect } from 'react';
import { SteamLogo, MenuIcon, BellIcon, FriendsIcon, ChevronDownIcon, CloseIcon, MinimizeIcon, MaximizeIcon } from './Icons';

type SectionId = 'store' | 'library' | 'community' | 'profile';

interface TopBarProps {
  username: string;
  activeSection: SectionId;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  onSelectSection?: (section: SectionId) => void;
}

const NAV_LABELS: { id: SectionId; label: string }[] = [
  { id: 'store', label: 'TIENDA' },
  { id: 'library', label: 'BIBLIOTECA' },
  { id: 'community', label: 'COMUNIDAD' },
];

export const TopBar: React.FC<TopBarProps> = ({
  username,
  activeSection,
  onMenuClick,
  isSidebarOpen,
  onSelectSection,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo/logo.svg', { method: 'HEAD' });
        if (response.ok) {
          setCustomLogo('/logo/logo.svg');
        }
      } catch {
        // Logo not found, keep the default Steam mark
      }
    };
    checkLogo();
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="menu-toggle" onClick={onMenuClick} aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <MenuIcon className="menu-icon" />
        </button>

        <div className="top-bar-brand">
          {customLogo ? (
            <img src={customLogo} alt={`${username} — Portfolio Library`} className="custom-logo" />
          ) : (
            <SteamLogo className="steam-logo" />
          )}
          <span className="brand-name">PORTFOLIO</span>
        </div>

        <nav className="top-bar-nav" role="navigation" aria-label="Navegación principal">
          {NAV_LABELS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSelectSection?.(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          <button
            className={`nav-item nav-user ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => onSelectSection?.('profile')}
            aria-current={activeSection === 'profile' ? 'page' : undefined}
          >
            <span className="nav-avatar" aria-hidden="true">{initials}</span>
            <span className="nav-username">{username}</span>
            <ChevronDownIcon className="nav-chevron" />
          </button>
        </nav>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-actions">
          <button className="icon-button" aria-label="Amigos">
            <FriendsIcon className="icon-button-svg" />
          </button>
          <button className="icon-button" aria-label="Notificaciones">
            <BellIcon className="icon-button-svg" />
            <span className="notification-dot" aria-hidden="true" />
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