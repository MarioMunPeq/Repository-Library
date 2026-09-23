import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { username } from './data/projects.tsx';
import type { Project } from './data/projects.tsx';
import { MenuBar } from './components/MenuBar';
import { NavBar } from './components/NavBar';
import type { SectionId } from './components/NavBar';
import { Sidebar } from './components/Sidebar';
import { ProjectStorePage } from './components/ProjectStorePage';
import { LibraryHome } from './components/LibraryHome';
import { StorePage } from './components/StorePage';
import { ProfilePage } from './components/ProfilePage';
import { Footer } from './components/Footer';
import { FriendsPanel } from './components/FriendsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function AppContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [librarySection, setLibrarySection] = useState<SectionId>('library');
  const [friendsOpen, setFriendsOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const isProfile = pathname === '/perfil';
  const isStore = pathname === '/tienda';
  const activeSection: SectionId = isProfile ? 'profile' : isStore ? 'store' : librarySection;

  const handleSelectSection = (section: SectionId) => {
    if (section === 'profile') {
      navigate('/perfil');
    } else if (section === 'store') {
      navigate('/tienda');
    } else if (section === 'library') {
      if (activeSection !== 'library') {
        navigate('/');
        setLibrarySection('library');
      }
    } else {
      setLibrarySection(section);
      navigate('/');
    }
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    navigate('/');
  };

  const handleDeselectProject = () => {
    setSelectedProject(null);
  };

  const shouldShowHome = selectedProject === null;
  const currentProject = shouldShowHome ? null : selectedProject;

  return (
    <div className="app">
      <MenuBar />

      <NavBar
        username={username}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      <div className="app-body">
        {!isProfile && !isStore && (
          <Sidebar
            selectedProject={selectedProject}
            onSelectProject={handleOpenProject}
            onDeselectProject={handleDeselectProject}
          />
        )}
        <div className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/tienda" element={<StorePage onOpenProject={handleOpenProject} />} />
              <Route
                path="/"
                element={
                  shouldShowHome ? (
                    <LibraryHome onSelectProject={handleOpenProject} />
                  ) : (
                    <ProjectStorePage project={currentProject} />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>

      <Footer friendsOpen={friendsOpen} onToggleFriends={() => setFriendsOpen((v) => !v)} />

      <FriendsPanel open={friendsOpen} onOpenChange={setFriendsOpen} />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;