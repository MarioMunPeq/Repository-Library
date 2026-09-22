import { useState } from 'react';
import type { ReactNode } from 'react';

export interface ProjectTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ProjectTabsProps {
  tabs: ProjectTab[];
  initialTabId?: string;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({ tabs, initialTabId }) => {
  const [activeId, setActiveId] = useState(initialTabId ?? tabs[0]?.id ?? '');

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className="project-tabs">
      <div className="tab-bar" role="tablist" aria-label="Secciones del juego">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`tab ${activeTab?.id === tab.id ? 'active' : ''}`}
            aria-selected={activeTab?.id === tab.id}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-panel" role="tabpanel" aria-label={activeTab?.label}>
        {activeTab?.content}
      </div>
    </div>
  );
};