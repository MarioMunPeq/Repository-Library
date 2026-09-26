import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { username } from './data/projects.tsx';
import { projects } from './data/projects.tsx';
import type { Project } from './data/projects.tsx';
import { MenuBar } from './components/MenuBar';
import { NavBar } from './components/NavBar';
import type { SectionId } from './components/NavBar';
import { MobileTabBar } from './components/MobileTabBar';
import { Sidebar } from './components/Sidebar';
import { ProjectStorePage } from './components/ProjectStorePage';
import { LibraryHome } from './components/LibraryHome';
import { StorePage } from './components/StorePage';
import { ComunidadPage } from './components/ComunidadPage';
import { ProfilePage } from './components/ProfilePage';
import { Footer } from './components/Footer';
import { FriendsPanel } from './components/FriendsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

/** Sección de la biblioteca a la que apunta una ruta. */
function sectionFromPath(pathname: string): SectionId {
  if (pathname.startsWith('/tienda')) return 'store';
  if (pathname.startsWith('/perfil')) return 'profile';
  if (pathname.startsWith('/comunidad')) return 'community';
  return 'library';
}

/** Página de un proyecto: el proyecto sale de la URL, no de un estado. */
const ProjectRoute: React.FC = () => {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug) ?? null;
  return <ProjectStorePage project={project} />;
};

function AppContent() {
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const activeSection = sectionFromPath(pathname);
  const isLibraryRoute = !pathname.startsWith('/tienda') && !pathname.startsWith('/perfil');

  // El cajón lateral se cierra solo al cambiar de página: si no, en móvil
  // taparía la pantalla nada más navegar. Se ajusta durante el render en vez
  // de en un efecto para no provocar un render extra.
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    if (sidebarOpen) setSidebarOpen(false);
  }

  const handleSelectSection = (section: SectionId) => {
    if (section === 'profile') navigate('/perfil');
    else if (section === 'store') navigate('/tienda');
    else if (section === 'community') navigate('/comunidad');
    else navigate('/');
  };

  const handleOpenProject = (project: Project) => navigate(`/juego/${project.slug}`);

  return (
    <div className={`app${sidebarOpen ? ' sidebar-open' : ''}`}>
      <MenuBar />

      <NavBar
        username={username}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onBack={() => navigate(-1)}
        onForward={() => navigate(1)}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        sidebarOpen={sidebarOpen}
        onToggleFriends={() => setFriendsOpen((open) => !open)}
        friendsOpen={friendsOpen}
      />

      <div className="app-body">
        {isLibraryRoute && (
          <Sidebar
            selectedSlug={activeSlugFromPath(pathname)}
            onSelectProject={handleOpenProject}
            onDeselectProject={() => navigate('/')}
          />
        )}

        {/* Velo del cajón lateral (solo móvil) */}
        <button
          className="app-scrim"
          type="button"
          tabIndex={sidebarOpen ? 0 : -1}
          aria-hidden={!sidebarOpen}
          aria-label="Cerrar el menú lateral"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/tienda" element={<StorePage onOpenProject={handleOpenProject} />} />
              <Route path="/comunidad" element={<ComunidadPage />} />
              <Route path="/juego/:slug" element={<ProjectRoute />} />
              <Route path="/" element={<LibraryHome onSelectProject={handleOpenProject} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>

      <Footer friendsOpen={friendsOpen} onToggleFriends={() => setFriendsOpen((v) => !v)} />

      <MobileTabBar activeSection={activeSection} onSelectSection={handleSelectSection} />

      <FriendsPanel open={friendsOpen} onOpenChange={setFriendsOpen} />
    </div>
  );
}

/** Slug del proyecto de la ruta actual, para marcarlo en el sidebar. */
function activeSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/juego\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
