import { useState, useEffect } from 'react';
import type { Project } from './data/projects.tsx';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { MainPanel } from './components/MainPanel';
import './App.css';

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const handleResize = () => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    if (!mobile) setIsSidebarOpen(false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app">
      <TopBar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="app-layout">
        <Sidebar
          selectedProject={selectedProject}
          onSelectProject={(project) => {
            setSelectedProject(project);
            if (isMobile) closeSidebar();
          }}
          isOpen={!isMobile || isSidebarOpen}
          onClose={closeSidebar}
        />

        <div className="main-wrapper">
          <MainPanel project={selectedProject} />
        </div>
      </div>

      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}
    </div>
  );
}

export default App;