import { friends as allFriends } from '../data/friends';
import type { Friend } from '../data/friends';
import type { Project } from '../data/projects.tsx';
import { getSteamAchievements } from '../data/steamAchievements';
import { useState } from 'react';
import { ProjectLogo } from './ProjectLogo';
import { SmartImage } from './SmartImage';
import {
  CalendarIcon,
  ClockIcon,
  CloudIcon,
  CodeIcon,
  DownloadIcon,
  GearIcon,
  HeartIcon,
  InfoIcon,
  PlayIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrophyIcon,
} from './Icons';
import { ImageViewer } from './ImageViewer';
import './ProjectStorePage.css';

interface ProjectStorePageProps {
  project: Project | null;
}

/** La rejilla 2x2 de Steam muestra 4 capturas; el resto, vía el enlace de gestion. */
const GRID_SHOT_COUNT = 4;

const MAX_FEATURED_UNLOCKED = 7;

/** Logro mostrable: con icono real de Steam o solo con texto (tecnologías). */
interface AchievementEntry {
  name: string;
  icon: string | null;
  hidden: boolean;
}

const STORE_TABS = [
  'Página de la tienda',
  'Centro de la comunidad',
  'Tienda de puntos',
  'Discusiones',
  'Guías',
  'Soporte',
];

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!project) {
    return <EmptyState />;
  }

  // Logros reales del juego si el proyecto tiene `steamAppId` y se han
  // descargado con `npm run steam:achievements`; si no, los del propio proyecto.
  const steam = getSteamAchievements(project.slug);
  const achievementList: AchievementEntry[] = steam
    ? steam.achievements
    : project.technologies.map((tech) => ({ name: tech, icon: null, hidden: false }));

  const achievementTotal = steam?.total ?? project.totalTech;
  // El progreso desbloqueado es inventado: Steam no publica el progreso de un
  // usuario sin su API key, así que solo se muestra si el proyecto lo define.
  const achievementUnlocked = project.unlockedTech > 0 ? project.unlockedTech : null;
  const achievementsPercent =
    achievementUnlocked !== null && achievementTotal > 0
      ? Math.round((achievementUnlocked / achievementTotal) * 100)
      : 0;

  const [featuredAchievement, ...otherAchievements] = achievementList;
  const shownAchievements = otherAchievements.slice(0, MAX_FEATURED_UNLOCKED);
  const achievementOverflow = Math.max(0, otherAchievements.length - MAX_FEATURED_UNLOCKED);

  const playingFriends = friendsPlaying(project.name);
  const friendsCountText =
    playingFriends.length === 1
      ? '1 amigo jugó a él anteriormente'
      : `${playingFriends.length} amigos jugaron a él anteriormente`;

  const gridShots = project.screenshots.slice(0, GRID_SHOT_COUNT);

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
            </div>

            <div className="store-cloud">
              <CloudIcon className="store-cloud-icon" />
              <div className="store-cloud-info">
                <span className="store-cloud-label">Estado en cloud</span>
                <span className="store-cloud-value">Actualizado</span>
              </div>
            </div>

            {/* Fila compacta y alineada a la izquierda, como en el cliente */}
            <div className="store-stats">
              <div className="store-stat">
                <CalendarIcon className="store-stat-icon" />
                <div className="store-stat-info">
                  <span className="store-stat-label">Última sesión</span>
                  <span className="store-stat-value">{project.lastUpdate}</span>
                </div>
              </div>
              <div className="store-stat">
                <ClockIcon className="store-stat-icon" />
                <div className="store-stat-info">
                  <span className="store-stat-label">Tiempo de juego</span>
                  <span className="store-stat-value">{project.devTime}</span>
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
        </header>

        <nav className="store-tabs" aria-label="Secciones de la página del proyecto">
          {STORE_TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`store-tab ${index === 0 ? 'active' : ''}`}
              aria-current={index === 0 ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="store-body">
          <section className="store-main">
            {/* En Steam la caja de recomendación va dentro de la columna
                principal, no a todo el ancho como una franja. */}
            <section className="store-recommendation" aria-label="Recomendación">
              <div className="store-recommendation-left">
                <span className="store-recommendation-time">Has jugado durante {project.devTime}</span>
                <span className="store-recommendation-question">
                  ¿Recomendarías este juego a otros jugadores?
                </span>
              </div>
              <div className="store-recommendation-buttons">
                <button className="store-recommend-btn" type="button">
                  <ThumbsUpIcon className="store-recommend-btn-icon-svg" />
                  Sí
                </button>
                <button className="store-recommend-btn" type="button">
                  <ThumbsDownIcon className="store-recommend-btn-icon-svg" />
                  No
                </button>
                <button className="store-recommend-btn" type="button">
                  Quizás más tarde
                </button>
              </div>
            </section>

            <section className="store-section">
              <h2 className="store-section-title">Acerca de este juego</h2>
              <p className="store-about">{project.description}</p>
            </section>

            {/* Rejilla 2x2 como la sección "Grabaciones y capturas" de Steam */}
            <section className="store-section">
              <h2 className="store-section-title">Grabaciones y capturas</h2>
              {gridShots.length > 0 ? (
                <>
                  <div className="store-shots-grid">
                    {gridShots.map((file, index) => (
                      <button
                        key={file}
                        className="store-shot"
                        style={{ background: project.fallbackGradient }}
                        onClick={() => {
                          setViewerIndex(index);
                          setViewerOpen(true);
                        }}
                        aria-label={`Ver captura ${index + 1} de ${project.screenshots.length}`}
                        type="button"
                      >
                        <SmartImage
                          basePath={`/projects/${project.slug}/screenshots/${file}`}
                          kind="screenshots"
                          className="store-shot-img"
                          alt={`Captura ${index + 1}`}
                          fallback={<span className="gradient-fallback" />}
                        />
                        <span className="store-shot-download" aria-hidden="true">
                          <DownloadIcon className="store-shot-download-svg" />
                        </span>
                      </button>
                    ))}
                  </div>

                  {project.screenshots.length > 0 && (
                    <button
                      className="store-shots-manage"
                      type="button"
                      onClick={() => {
                        setViewerIndex(gridShots.length);
                        setViewerOpen(true);
                      }}
                    >
                      Administrar mis {project.screenshots.length} grabaciones y capturas
                    </button>
                  )}
                </>
              ) : (
                <p className="store-shots-empty">Este proyecto todavía no tiene capturas.</p>
              )}
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

              {achievementTotal > 0 ? (
                <>
                  <p className="store-ach-text">
                    {achievementUnlocked !== null ? (
                      <>
                        Has desbloqueado {achievementUnlocked}/{achievementTotal} (
                        {achievementsPercent}%)
                      </>
                    ) : (
                      <>
                        {achievementTotal} logros en Steam
                        {steam ? ` · ${steam.name}` : ''}
                      </>
                    )}
                  </p>

                  {achievementUnlocked !== null && (
                    <div className="store-ach-bar" aria-hidden="true">
                      <div className="store-ach-bar-fill" style={{ width: `${achievementsPercent}%` }} />
                    </div>
                  )}
                </>
              ) : (
                <p className="store-ach-text">Este juego no tiene logros en Steam.</p>
              )}

              {featuredAchievement && (
                <div className="store-ach-featured" title={featuredAchievement.name}>
                  {featuredAchievement.icon ? (
                    <img
                      className="store-ach-featured-image"
                      src={featuredAchievement.icon}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <TrophyIcon className="store-ach-featured-icon" />
                  )}
                  <div className="store-ach-featured-info">
                    <span className="store-ach-featured-title">{featuredAchievement.name}</span>
                    <span className="store-ach-featured-desc">
                      {featuredAchievement.hidden ? 'Logro secreto' : 'Logro destacado'}
                    </span>
                  </div>
                </div>
              )}

              {shownAchievements.length > 0 && (
                <div className="store-ach-grid">
                  {shownAchievements.map((achievement, index) => (
                    <span
                      key={`${achievement.name}-${index}`}
                      className={`store-ach-cell ${achievement.hidden ? 'hidden' : ''}`}
                      title={achievement.name}
                    >
                      {achievement.icon ? (
                        <img
                          className="store-ach-cell-image"
                          src={achievement.icon}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <CodeIcon className="store-ach-cell-icon" />
                      )}
                    </span>
                  ))}
                  {achievementOverflow > 0 && (
                    <span className="store-ach-more">+{achievementOverflow}</span>
                  )}
                </div>
              )}

              <a className="store-ach-view-all" href="#">Ver mis logros</a>
            </section>
          </aside>
        </div>
      </div>

      <ImageViewer
        key={`${project.slug}-${viewerOpen ? 'open' : 'closed'}-${viewerIndex}`}
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
