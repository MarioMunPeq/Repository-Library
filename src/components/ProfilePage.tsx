import { devProfile } from '../data/devProfile';
import { projects } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ChevronDownIcon, ClockIcon, CodeIcon, GearIcon, MapPinIcon, TrophyIcon } from './Icons';
import './ProfilePage.css';

const MAX_FEATURED_CELLS = 8;

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
  const stackedShots = shots.slice(1, 4);
  const remainingShots = Math.max(0, totalScreenshots - (bigShot ? 1 : 0) - stackedShots.length);

  const favStats = [
    { label: 'Horas jugadas', value: String(devProfile.favoriteProject.hours), icon: ClockIcon },
    { label: 'Logros', value: String(favAchievements.unlocked), icon: TrophyIcon },
  ];

  const statRows = [
    { label: 'Proyectos', value: String(projects.length) },
    { label: 'Capturas', value: String(totalScreenshots) },
    { label: 'Vídeos', value: String(devProfile.stats.videos) },
    { label: 'Artículos', value: String(devProfile.stats.articles) },
  ];

  return (
    <main className="profile-page" role="main" aria-label={`Perfil de ${devProfile.username}`}>
      <header className="profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-inner">
              <img className="profile-avatar-img" src={devProfile.avatar} alt={`Avatar de ${devProfile.username}`} />
            </div>
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
              <span className="profile-years-label">Años de experiencia</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-edit-btn" type="button">
              Editar perfil
            </button>
            <button className="profile-settings-btn" type="button" aria-label="Ajustes del perfil">
              <GearIcon className="profile-settings-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="profile-body">
        <div className="profile-main">
          <section className="profile-panel">
            <h2 className="profile-panel-title">Proyecto favorito</h2>
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

            <div className="profile-fav-stats" role="list" aria-label="Estadísticas del proyecto favorito">
              {favStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="profile-fav-stat" role="listitem">
                    <div className="profile-fav-stat-head">
                      <Icon className="profile-fav-stat-icon" />
                      <span className="profile-fav-stat-label">{stat.label}</span>
                    </div>
                    <span className="profile-fav-stat-value">{stat.value}</span>
                  </div>
                );
              })}
            </div>

            <div className="profile-ach-block">
              <div className="profile-ach-head">
                <span className="profile-ach-text">
                  {favAchievements.unlocked} de {favAchievements.total}
                </span>
                <div className="profile-ach-bar" aria-hidden="true">
                  <div className="profile-ach-bar-fill" style={{ width: `${achievementsPercent}%` }} />
                </div>
              </div>
              <div className="profile-ach-badges">
                {favorite.technologies.slice(0, shownCells).map((tech) => (
                  <span key={tech} className="profile-ach-badge" title={tech} aria-hidden="true">
                    <CodeIcon className="profile-ach-badge-icon" />
                  </span>
                ))}
                {overflowTech > 0 && (
                  <span className="profile-ach-badge more" title={`${overflowTech} más`} aria-hidden="true">
                    +{overflowTech}
                  </span>
                )}
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
                  {stackedShots.map((file, index) => {
                    const isLast = index === stackedShots.length - 1;
                    return (
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
                        {isLast && remainingShots > 0 && (
                          <span className="profile-shot-overlay">+{remainingShots}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="profile-side">
          <section className="profile-panel profile-status-panel">
            <span className="profile-status-label">Última actividad</span>
            <span className="profile-status-value">{devProfile.lastActivity}</span>
          </section>

          <section className="profile-panel">
            <h2 className="profile-panel-title">Insignias</h2>
            <div className="profile-badges-grid">
              {devProfile.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="profile-badge"
                  style={{ background: badge.color }}
                  title={badge.label}
                  aria-hidden="true"
                >
                  {badge.short}
                </span>
              ))}
            </div>
          </section>

          <section className="profile-panel">
            <h2 className="profile-panel-title">Estadísticas</h2>
            <ul className="profile-stats-list">
              {statRows.map((row) => (
                <li key={row.label} className="profile-stat-row">
                  <span className="profile-stat-label">{row.label}</span>
                  <span className="profile-stat-value">{row.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
};