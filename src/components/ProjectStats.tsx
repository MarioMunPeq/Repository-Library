import type { ReactNode } from 'react';
import type { ProjectStats as ProjectStatsData } from '../data/projects.tsx';
import { CalendarIcon, ClockIcon, CloudIcon, TrophyIcon } from './Icons';

interface ProjectStatsProps {
  stats: ProjectStatsData;
}

const TILE_ORDER = ['cloud', 'lastSession', 'playtime', 'achievements'] as const;

export const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  const achievementsPct =
    stats.achievements.total > 0
      ? Math.round((stats.achievements.unlocked / stats.achievements.total) * 100)
      : 0;
  const achievementsText = `${stats.achievements.unlocked} / ${stats.achievements.total} (${achievementsPct}%)`;

  const tiles: Record<(typeof TILE_ORDER)[number], ReactNode> = {
    cloud: (
      <div className="stat-tile">
        <div className="stat-tile-heading">
          <CloudIcon className={`stat-icon ${stats.cloudStatus === 'ok' ? 'ok' : 'syncing'}`} />
          <span className="stat-label">ESTADO EN CLOUD</span>
        </div>
        <span className={`stat-value ${stats.cloudStatus === 'syncing' ? 'syncing' : ''}`}>{stats.cloudLabel}</span>
      </div>
    ),
    lastSession: (
      <div className="stat-tile">
        <div className="stat-tile-heading">
          <CalendarIcon className="stat-icon" />
          <span className="stat-label">ÚLTIMA SESIÓN</span>
        </div>
        <span className="stat-value">{stats.lastSession}</span>
      </div>
    ),
    playtime: (
      <div className="stat-tile">
        <div className="stat-tile-heading">
          <ClockIcon className="stat-icon" />
          <span className="stat-label">TIEMPO DE JUEGO</span>
        </div>
        <span className="stat-value">{stats.playtime}</span>
      </div>
    ),
    achievements: (
      <div className="stat-tile">
        <div className="stat-tile-heading">
          <TrophyIcon className="stat-icon" />
          <span className="stat-label">LOGROS</span>
        </div>
        <span className="stat-value">{achievementsText}</span>
        <div className="stat-progress">
          <div className="stat-progress-track">
            <div className="stat-progress-fill" style={{ width: `${achievementsPct}%` }} />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="stats-row" role="list" aria-label="Estadísticas del juego">
      {TILE_ORDER.map((key) => (
        <div key={key} role="listitem">
          {tiles[key]}
        </div>
      ))}
    </div>
  );
};