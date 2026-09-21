import { useState } from 'react';
import { SteamLogo, SearchIcon, MenuIcon, LibraryIcon, StoreIcon, ProfileIcon, CloseIcon, MinimizeIcon, MaximizeIcon } from './Icons';

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, isSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'store', label: 'TIENDA', icon: StoreIcon, active: false },
    { id: 'library', label: 'BIBLIOTECA', icon: LibraryIcon, active: true },
    { id: 'profile', label: 'PERFIL', icon: ProfileIcon, active: false },
  ];

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="menu-toggle" onClick={onMenuClick} aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <MenuIcon className="menu-icon" />
        </button>
        <SteamLogo className="steam-logo" />
        <span className="app-title">PORTFOLIO LIBRARY</span>
      </div>

      <nav className="top-bar-nav" role="navigation" aria-label="Navegación principal">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${item.active ? 'active' : ''}`}
            disabled={item.id !== 'library'}
            aria-current={item.active ? 'page' : undefined}
          >
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="top-bar-right">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="search"
            placeholder="Buscar en la biblioteca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Buscar proyectos"
          />
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