import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { projects, username } from './data/projects.tsx';
import type { Project } from './data/projects.tsx';
import { MenuBar } from './components/MenuBar';
import { NavBar } from './components/NavBar';
import type { SectionId } from './components/NavBar';
import { Sidebar } from './components/Sidebar';
import { ProjectStorePage } from './components/ProjectStorePage';
import { ProfilePage } from './components/ProfilePage';
import { Footer } from './components/Footer';
import { FriendsPanel } from './components/FriendsPanel';
import './App.css';

function AppContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] ?? null);
  const [librarySection, setLibrarySection] = useState<SectionId>('library');
  const [friendsOpen, setFriendsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isProfile = location.pathname === '/perfil';
  const activeSection = isProfile ? 'profile' : librarySection;

  const handleSelectSection = (section: SectionId) => {
    if (section === 'profile') {
      navigate('/perfil');
    } else {
      setLibrarySection(section);
      navigate('/');
    }
  };

  return (
    <div className="app">
      <MenuBar />

      <NavBar
        username={username}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      <div className="app-body">
        {!isProfile && (
          <Sidebar selectedProject={selectedProject} onSelectProject={setSelectedProject} />
        )}
        <div className="main-content">
          <Routes>
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/" element={<ProjectStorePage project={selectedProject} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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