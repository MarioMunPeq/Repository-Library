import { friends as allFriends } from '../data/friends';
import type { Friend } from '../data/friends';
import type { Project } from '../data/projects.tsx';
import { useState } from 'react';
import { ProjectLogo } from './ProjectLogo';
import { SmartImage } from './SmartImage';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CodeIcon,
  GearIcon,
  HeartIcon,
  InfoIcon,
  PlayIcon,
  TrophyIcon,
} from './Icons';
import { ImageViewer } from './ImageViewer';
import './ProjectStorePage.css';

interface ProjectStorePageProps {
  project: Project | null;
}

const PLACEHOLDER_SHOT_COUNT = 3;

const MAX_FEATURED_UNLOCKED = 6;
const MAX_LOCKED_SHOWN = 6;

const AVATAR_PALETTE = ['#2a475e', '#2d5a3f', '#4a3a6a', '#6a523a', '#3a4f6a', '#5e3a52'];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function friendsPlaying(projectName: string): Friend[] {
  const related = allFriends.filter((friend) => friend.project === projectName);
  if (related.length > 0) {
    return related.slice(0, 2);
  }
  return [];
}

const EmptyState: React.FC = () => (
  <main className="main-panel empty">
    <div className="empty-books" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </div>
  </main>
);

export const ProjectStorePage: React.FC<ProjectStorePageProps> = ({ project }) => {
  if (!project) {
    return <EmptyState />;
  }

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const achievementsPercent =
    project.totalTech === 0 ? 0 : Math.round((project.unlockedTech / project.totalTech) * 100);

  const unlockedTechs = project.technologies.slice(0, project.unlockedTech);
  const lockedTechs = project.technologies.slice(project.unlockedTech);
  const featuredAchievement = unlockedTechs[0] || lockedTechs[0];
  const otherUnlocked = unlockedTechs.slice(1, MAX_FEATURED_UNLOCKED + 1);
  const otherUnlockedOverflow = unlockedTechs.length - 1 - MAX_FEATURED_UNLOCKED;
  const shownLocked = lockedTechs.slice(0, MAX_LOCKED_SHOWN);
  const lockedOverflow = lockedTechs.length - MAX_LOCKED_SHOWN;
  const playingFriends = friendsPlaying(project.name);
  const friendsCountText =
    playingFriends.length === 1
      ? '1 amigo jugó a él anteriormente'
      : `${playingFriends.length} amigos jugaron a él anteriormente`;

  const shotFiles =
    project.screenshots.length > 0
      ? project.screenshots
      : Array.from({ length: PLACEHOLDER_SHOT_COUNT }, () => null);

  return (
    <main className="store-page" role="main" aria-label={project.name}>
      <div className="store-shell" key={project.slug}>
        <header className="store-banner" style={{ background: project.fallbackGradient }}>
          <SmartImage
            basePath={project.heroPath}
            kind="hero"
            className="store-banner-img"
            alt=""
            fallback={<span className="gradient-fallback" />}
          />
          <div className="store-banner-logo">
            <ProjectLogo project={project} />
          </div>
        </header>

        <div className="store-actionbar">
          <div className="store-play-group">
            {project.githubUrl ? (
              <a className="store-play-btn" href={project.githubUrl} target="_blank" rel="noreferrer">
                <PlayIcon className="store-play-icon" />
                Jugar
              </a>
            ) : (
              <button className="store-play-btn" type="button" disabled>
                <PlayIcon className="store-play-icon" />
                Jugar
              </button>
            )}
            <button
              className="store-play-dropdown"
              type="button"
              aria-label="Opciones de jugar"
              disabled={!project.githubUrl}
            >
              <ChevronDownIcon className="store-play-chevron" />
            </button>
          </div>

          <div className="store-stats">
            <div className="store-stat">
              <ClockIcon className="store-stat-icon" />
              <div className="store-stat-info">
                <span className="store-stat-label">Tiempo de juego</span>
                <span className="store-stat-value">{project.devTime}</span>
              </div>
            </div>
            <div className="store-stat">
              <CalendarIcon className="store-stat-icon" />
              <div className="store-stat-info">
                <span className="store-stat-label">Última sesión</span>
                <span className="store-stat-value">{project.lastUpdate}</span>
              </div>
            </div>
            <div className="store-stat">
              <TrophyIcon className="store-stat-icon" />
              <div className="store-stat-info">
                <span className="store-stat-label">Logros</span>
                <span className="store-stat-value">
                  {project.unlockedTech}/{project.totalTech}
                </span>
                <div className="store-stat-bar" aria-hidden="true">
                  <div className="store-stat-bar-fill" style={{ width: `${achievementsPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="store-icon-actions">
            <button className="store-icon-btn" type="button" aria-label="Ajustes">
              <GearIcon className="store-icon-btn-svg" />
            </button>
            <button className="store-icon-btn" type="button" aria-label="Información">
              <InfoIcon className="store-icon-btn-svg" />
            </button>
            <button className="store-icon-btn" type="button" aria-label="Me gusta">
              <HeartIcon className="store-icon-btn-svg" />
            </button>
          </div>
        </div>

        <nav className="store-tabs" role="tablist" aria-label="Secciones del proyecto">
          <button className="store-tab active" type="button">
            Página del proyecto
          </button>
          <button className="store-tab" type="button">
            Registro de cambios
          </button>
          <button className="store-tab" type="button">
            Documentación
          </button>
        </nav>

        <section className="store-recommendation" aria-label="Recomendación">
          <div className="store-recommendation-left">
            <span className="store-recommendation-time">Has invertido {project.devTime} en este proyecto</span>
            <span className="store-recommendation-question">¿Recomendarías este proyecto a otros desarrolladores?</span>
          </div>
          <div className="store-recommendation-buttons">
            <button className="store-recommend-btn" type="button">👍 Sí</button>
            <button className="store-recommend-btn" type="button">👎 No</button>
            <button className="store-recommend-btn" type="button">Quizás más tarde</button>
          </div>
        </section>

        <div className="store-body">
          <section className="store-main">
            <section className="store-section">
              <h2 className="store-section-title">Acerca de este proyecto</h2>
              <p className="store-about">{project.description}</p>
            </section>

            <section className="store-section">
              <h2 className="store-section-title">Capturas de pantalla</h2>
              <div className="store-shots">
                <button className="store-shot-arrow left" type="button" aria-label="Anterior">
                  <ChevronLeftIcon className="store-shot-arrow-svg" />
                </button>
                <div className="store-shots-strip">
                  {shotFiles.map((file, index) => (
                    <button
                      key={file ?? `placeholder-${index}`}
                      className="store-shot"
                      style={{ background: project.fallbackGradient }}
                      onClick={() => file && (setViewerIndex(index), setViewerOpen(true))}
                      aria-label={file ? `Ver captura ${index + 1} de ${project.screenshots.length}` : ''}
                      type="button"
                      disabled={!file}
                    >
                      {file && (
                        <SmartImage
                          basePath={`/projects/${project.slug}/screenshots/${file}`}
                          kind="screenshots"
                          className="store-shot-img"
                          alt={`Captura ${index + 1}`}
                          fallback={<span className="gradient-fallback" />}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button className="store-shot-arrow right" type="button" aria-label="Siguiente">
                  <ChevronRightIcon className="store-shot-arrow-svg" />
                </button>
              </div>
            </section>

            {project.updates.length > 0 && (
              <section className="store-section">
                <h2 className="store-section-title">Actividad</h2>
                <div className="store-activity-input" aria-label="Escribir actividad">
                  <input
                    type="text"
                    className="store-activity-textarea"
                    placeholder="Escribe algo sobre este proyecto..."
                    readOnly
                  />
                </div>
                <div className="store-updates">
                  {project.updates.map((entry) => (
                    <article className="store-update" key={`${entry.date}-${entry.title}`}>
                      <span className="store-update-date">{entry.date}</span>
                      <div className="store-update-card">
                        <h3 className="store-update-title">{entry.title}</h3>
                        <p className="store-update-body">{entry.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </section>

          <aside className="store-side">
            <section className="store-panel">
              <h2 className="store-panel-title store-friends-title">Amigos que juegan a este juego</h2>
              <p className="store-friends-count">{friendsCountText}</p>
              <div className="store-friends-row">
                {playingFriends.map((friend) => {
                  const avatar = (
                    <>
                      {friend.avatarInitial}
                      {friend.slug && (
                        <SmartImage
                          basePath={`/friends/${friend.slug}/avatar`}
                          kind="avatar"
                          className="store-friends-avatar-img"
                          alt=""
                        />
                      )}
                    </>
                  );
                  if (friend.githubUrl) {
                    return (
                      <a
                        key={friend.id}
                        className="store-friends-avatar"
                        style={{ background: avatarColor(friend.name) }}
                        title={friend.name}
                        href={friend.githubUrl}
                        target="_blank"
                        rel="noopener"
                      >
                        {avatar}
                      </a>
                    );
                  }
                  return (
                    <span
                      key={friend.id}
                      className="store-friends-avatar"
                      style={{ background: avatarColor(friend.name) }}
                      title={friend.name}
                    >
                      {avatar}
                    </span>
                  );
                })}
              </div>
              <a className="store-friends-link" href="#">
                Ver todos los amigos que juegan a este juego
              </a>
            </section>

            <section className="store-panel">
              <h2 className="store-panel-title">Logros</h2>
              <p className="store-ach-text">
                Has desbloqueado {project.unlockedTech}/{project.totalTech} ({achievementsPercent}%)
              </p>
              <div className="store-ach-bar" aria-hidden="true">
                <div className="store-ach-bar-fill" style={{ width: `${achievementsPercent}%` }} />
              </div>

              {featuredAchievement && (
                <div className="store-ach-featured" title={featuredAchievement}>
                  <TrophyIcon className="store-ach-featured-icon" />
                  <div className="store-ach-featured-info">
                    <span className="store-ach-featured-title">{featuredAchievement}</span>
                    <span className="store-ach-featured-desc">Logro desbloqueado</span>
                  </div>
                </div>
              )}

              {otherUnlocked.length > 0 && (
                <div className="store-ach-unlocked-group">
                  <div className="store-ach-grid-small">
                    {otherUnlocked.map((tech, index) => (
                      <span
                        key={index}
                        className="store-ach-cell-small unlocked"
                        title={tech}
                      >
                        <CodeIcon className="store-ach-cell-small-icon" />
                      </span>
                    ))}
                    {otherUnlockedOverflow > 0 && (
                      <span className="store-ach-cell-small more" title={`${otherUnlockedOverflow} logros más`}>
                        +{otherUnlockedOverflow}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {lockedTechs.length > 0 && (
                <div className="store-ach-locked-group">
                  <span className="store-ach-locked-title">Logros bloqueados</span>
                  <div className="store-ach-grid-small">
                    {shownLocked.map((tech, index) => (
                      <span
                        key={index}
                        className="store-ach-cell-small locked"
                        title={tech}
                      >
                        <CodeIcon className="store-ach-cell-small-icon" />
                      </span>
                    ))}
                    {lockedOverflow > 0 && (
                      <span className="store-ach-cell-small more" title={`${lockedOverflow} logros más`}>
                        +{lockedOverflow}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <a className="store-ach-view-all" href="#">Ver todos los logros</a>
            </section>
          </aside>
        </div>
      </div>

      <ImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={project.screenshots}
        initialIndex={viewerIndex}
        projectSlug={project.slug}
        projectFallbackGradient={project.fallbackGradient}
        altTexts={project.screenshots.map((_, i) => `Captura ${i + 1} de ${project.screenshots.length} - ${project.name}`)}
      />
    </main>
  );
};
