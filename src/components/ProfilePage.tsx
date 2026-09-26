import { devProfile } from '../data/devProfile';
import { projects } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import {
  CameraIcon,
  ChevronDownIcon,
  CodeIcon,
  GearIcon,
  HeartIcon,
  MapPinIcon,
} from './Icons';
import './ProfilePage.css';

const MAX_FEATURED_CELLS = 8;
const MAX_SIDE_BADGES = 4;
const MAX_STACK_SHOTS = 2;
const MAX_GROUPS = 2;

export const ProfilePage: React.FC = () => {
  const favorite = projects.find((project) => project.slug === devProfile.favoriteProject.id) ?? projects[0];
  const totalScreenshots = projects.reduce((sum, project) => sum + project.screenshots.length, 0);

  const favAchievements = devProfile.favoriteProject.achievements;
  const achievementsPercent =
    favAchievements.total === 0 ? 0 : Math.round((favAchievements.unlocked / favAchievements.total) * 100);

  const shownCells = Math.min(favorite.technologies.length, MAX_FEATURED_CELLS);
  const overflowTech = favorite.technologies.length - shownCells;

  const shots = favorite.screenshots;
  const bigShot = shots[0];
  const stackedShots = shots.slice(1, 1 + MAX_STACK_SHOTS);
  const remainingShots = Math.max(0, totalScreenshots - (bigShot ? 1 : 0) - stackedShots.length);

  const sideBadges = devProfile.badges.slice(0, MAX_SIDE_BADGES);
  const sideBadgeOverflow = devProfile.badges.length - sideBadges.length;

  const favStats = [
    { label: 'Horas jugadas', value: devProfile.favoriteProject.hours },
    { label: 'Logros', value: favAchievements.unlocked },
  ];

  const statsRows = [
    { label: 'Juegos', value: projects.length },
    { label: 'Capturas', value: totalScreenshots },
    { label: 'Artículos del Workshop', value: devProfile.stats.articles },
    { label: 'Reseñas', value: devProfile.reviews },
    { label: 'Videos', value: devProfile.stats.videos },
  ];

  return (
    <main className="profile-page" role="main" aria-label={`Perfil de ${devProfile.username}`}>
      <div className="profile-container">
        <header className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-inner">
                <SmartImage
                  basePath={devProfile.avatarBasePath}
                  kind="avatar"
                  className="profile-avatar-img"
                  alt={`Avatar de ${devProfile.username}`}
                  fallback={
                    <img
                      src={`${import.meta.env.BASE_URL}logo/logo.svg`}
                      alt={`Avatar de ${devProfile.username}`}
                      className="profile-avatar-img"
                    />
                  }
                />
              </div>
            </div>
          </div>

          <div className="profile-header-info">
            <div className="profile-name-row">
              <h1 className="profile-username">{devProfile.username}</h1>
              <ChevronDownIcon className="profile-username-caret" />
            </div>
            <div className="profile-realname-row">
              <span className="profile-realname">{devProfile.realName}</span>
              <span className="profile-location">
                <MapPinIcon className="profile-location-icon" />
                {devProfile.location}
              </span>
              <span className="profile-country-flag" aria-hidden="true">
                {devProfile.countryFlag}
              </span>
            </div>

            <div className="profile-featured-badges" role="list" aria-label="Insignias destacadas">
              {devProfile.featuredBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="profile-featured-badge"
                  style={{ background: badge.color }}
                  title={badge.label}
                  role="listitem"
                >
                  {badge.short}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-header-right">
            <div className="profile-header-right-top">
              <div className="profile-level" title={`Nivel ${devProfile.level}`}>
                <span className="profile-level-number">{devProfile.level}</span>
                <span className="profile-level-label">Nivel</span>
              </div>
              <div className="profile-years-card">
                <div className="profile-years-head">
                  <CodeIcon className="profile-years-icon" />
                  <span className="profile-years-value">{devProfile.yearsExperience}</span>
                </div>
                <span className="profile-years-label">Años de Servicio</span>
              </div>
            </div>

            <div className="profile-actions">
              <button className="profile-edit-btn" type="button">
                Modificar perfil
              </button>
              <button className="profile-settings-btn" type="button" aria-label="Ajustes del perfil">
                <GearIcon className="profile-settings-icon" />
              </button>
            </div>
          </div>
        </header>

        <div className="profile-body">
          <section className="profile-main">
            <section className="profile-panel">
              <h2 className="profile-panel-title">Juego favorito</h2>
              <div className="profile-fav-row">
                <span className="profile-fav-thumb" style={{ background: favorite.fallbackGradient }} aria-hidden="true">
                  <SmartImage
                    basePath={favorite.headerPath}
                    kind="header"
                    className="profile-fav-thumb-img"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                </span>
                <span className="profile-fav-name">{favorite.name}</span>
              </div>

              <div className="profile-fav-stats" role="list" aria-label="Estadísticas del juego favorito">
                {favStats.map((stat) => (
                  <div key={stat.label} className="profile-fav-stat" role="listitem">
                    <span className="profile-fav-stat-value">{stat.value}</span>
                    <span className="profile-fav-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-ach-block">
                <div className="profile-ach-head">
                  <span className="profile-ach-title">Avance en los logros</span>
                  <span className="profile-ach-text">
                    {favAchievements.unlocked} de {favAchievements.total}
                  </span>
                  <div
                    className="profile-ach-bar"
                    role="progressbar"
                    aria-valuenow={achievementsPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progreso de logros"
                  >
                    <div className="profile-ach-bar-fill" style={{ width: `${achievementsPercent}%` }} />
                  </div>
                  <div className="profile-ach-badges">
                    {favorite.technologies.slice(0, shownCells).map((tech) => (
                      <span key={tech} className="profile-ach-badge" title={tech}>
                        <CodeIcon className="profile-ach-badge-icon" />
                      </span>
                    ))}
                    {overflowTech > 0 && (
                      <span className="profile-ach-badge more" title={`${overflowTech} más`}>
                        +{overflowTech}
                      </span>
                    )}
                  </div>
                </div>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <CameraIcon className="profile-meta-icon" />
                    Capturas: <span className="profile-meta-value">{totalScreenshots}</span>
                  </span>
                  <span className="profile-meta-item">
                    <HeartIcon className="profile-meta-icon" />
                    Reseña: <span className="profile-meta-value">{devProfile.reviews}</span>
                  </span>
                </div>
              </div>
            </section>

            <section className="profile-panel">
              <h2 className="profile-panel-title">Expositor de capturas</h2>
              <div className="profile-shots">
                <span
                  className={`profile-shot-big ${stackedShots.length === 0 ? 'only' : ''}`}
                  style={{ background: favorite.fallbackGradient }}
                  title={bigShot ?? 'Sin capturas'}
                  aria-hidden="true"
                >
                  {bigShot && (
                    <SmartImage
                      basePath={`/projects/${favorite.slug}/screenshots/${bigShot}`}
                      kind="screenshots"
                      className="profile-shot-img"
                      alt=""
                      fallback={<span className="gradient-fallback" />}
                    />
                  )}
                </span>
                {stackedShots.length > 0 && (
                  <div className="profile-shot-stack">
                    {stackedShots.map((file) => (
                      <span
                        key={file}
                        className="profile-shot-small"
                        style={{ background: favorite.fallbackGradient }}
                        title={file}
                        aria-hidden="true"
                      >
                        <SmartImage
                          basePath={`/projects/${favorite.slug}/screenshots/${file}`}
                          kind="screenshots"
                          className="profile-shot-img"
                          alt=""
                          fallback={<span className="gradient-fallback" />}
                        />
                      </span>
                    ))}
                    {remainingShots > 0 && (
                      <span className="profile-shot-more" aria-hidden="true">
                        +{remainingShots}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          </section>

          <aside className="profile-side">
            <section className="profile-panel">
              <h2 className="profile-panel-title accent">En línea</h2>
              <p className="profile-online-text">
                <span className="profile-online-warn">1 bloqueo por VAC registrado</span> |{' '}
                <button className="profile-side-link" type="button">
                  Ver historial de bloqueos
                </button>
              </p>
              <p className="profile-online-text">Última actividad {devProfile.lastActivity}</p>
            </section>

            <section className="profile-panel">
              <h2 className="profile-panel-title">
                Insignias <span className="profile-panel-count">{favAchievements.unlocked}</span>
              </h2>
              <div className="profile-badge-grid">
                {sideBadges.map((badge) => (
                  <span
                    key={badge.id}
                    className="profile-badge-cell"
                    style={{ background: badge.color }}
                    title={badge.label}
                  >
                    {badge.short}
                  </span>
                ))}
                {sideBadgeOverflow > 0 && (
                  <span className="profile-badge-cell more" title={`${sideBadgeOverflow} más`}>
                    +{sideBadgeOverflow}
                  </span>
                )}
              </div>
            </section>

            <section className="profile-panel">
              <h2 className="profile-panel-title">Estadísticas</h2>
              <div className="profile-stats-list">
                {statsRows.map((row) => (
                  <div key={row.label} className="profile-stats-row">
                    <span className="profile-stats-label">{row.label}</span>
                    <span className="profile-stats-value">
                      {row.value > 0 ? row.value : <span className="profile-stats-empty">—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-panel">
              <h2 className="profile-panel-title">
                Grupos <span className="profile-panel-count">{devProfile.groups.length}</span>
              </h2>
              {devProfile.groups.slice(0, MAX_GROUPS).map((group) => (
                <div key={group.id} className="profile-group-row">
                  <span className="profile-group-avatar" aria-hidden="true">
                    {group.name.charAt(0)}
                  </span>
                  <span className="profile-group-info">
                    <span className="profile-group-name">{group.name}</span>
                    <span className="profile-group-members">
                      {group.members.toLocaleString('es-ES')} miembros
                    </span>
                  </span>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};
