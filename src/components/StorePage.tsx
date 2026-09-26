import { useMemo, useState } from 'react';
import { projects } from '../data/projects.tsx';
import type { Project, ProjectStatus } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ProjectLogo } from './ProjectLogo';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, SearchIcon } from './Icons';
import './StorePage.css';

interface StorePageProps {
  onOpenProject: (project: Project) => void;
}

/** Slug del proyecto que se usa como fondo a toda página de la tienda. */
const HERO_SLUG = 'persona5';

const NO_TIME = '—';

const STORE_NAV = ['Explorar', 'Recomendaciones', 'Categorías', 'Hardware', 'Formas de jugar', 'Más'];

const STATUS_LABEL: Record<ProjectStatus, string> = {
  completado: 'Ya disponible',
  'en desarrollo': 'En desarrollo',
  proximamente: 'Próximamente',
};

type SortKey = 'todos' | 'recientes' | 'nombre';

const SORT_LABEL: Record<SortKey, string> = {
  todos: 'Todos los proyectos',
  recientes: 'Añadidos recientemente',
  nombre: 'Por nombre',
};

export const StorePage: React.FC<StorePageProps> = ({ onOpenProject }) => {
  const hero = projects.find((project) => project.slug === HERO_SLUG) ?? projects[0];

  // El resto de proyectos es los que va enseñando el cuadrado central.
  const featured = useMemo(
    () => projects.filter((project) => project.slug !== hero.slug),
    [hero.slug],
  );

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('todos');

  const total = featured.length;
  const active = featured[featuredIndex % Math.max(total, 1)];

  const step = (direction: -1 | 1) => {
    if (total === 0) return;
    setFeaturedIndex((index) => (index + direction + total) % total);
  };

  const visibleProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? projects.filter(
          (project) =>
            project.name.toLowerCase().includes(needle) ||
            project.tags.some((tag) => tag.toLowerCase().includes(needle)),
        )
      : projects;

    if (sort === 'nombre') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    if (sort === 'recientes') {
      return projects.filter((project) => filtered.includes(project));
    }
    return filtered;
  }, [query, sort]);

  return (
    <main className="store-page" role="main" aria-label="Tienda">
      {/* ---------- Fondo a toda página (Persona 5) ---------- */}
      <div className="store-backdrop" aria-hidden="true">
        <SmartImage
          basePath={hero.heroPath}
          kind="hero"
          className="store-backdrop-img"
          alt=""
          fallback={<span className="gradient-fallback" />}
        />
        <span className="store-backdrop-scrim" />
      </div>

      {/* ---------- Barra de navegación de la tienda ---------- */}
      <nav className="store-nav" aria-label="Navegación de la tienda">
        <ul className="store-nav-list">
          {STORE_NAV.map((item) => (
            <li key={item}>
              <button className="store-nav-item" type="button">
                {item}
                <ChevronDownIcon className="store-nav-caret" />
              </button>
            </li>
          ))}
        </ul>

        <div className="store-search">
          <input
            className="store-search-input"
            type="search"
            value={query}
            placeholder="Buscar en la tienda"
            aria-label="Buscar en la tienda"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="store-search-btn" type="button" aria-label="Buscar">
            <SearchIcon className="store-search-icon" />
          </button>
        </div>

        <button className="store-wishlist" type="button">
          <HeartIcon className="store-wishlist-icon" />
          <span className="store-wishlist-label">Lista de deseados</span>
          <span className="store-wishlist-count">{projects.length}</span>
        </button>
      </nav>

      {/* ---------- Splash: cuadrado central que avanza al pulsar ---------- */}
      <section className="store-splash" aria-label="Proyectos destacados">
        {active && (
          <>
            <div className="store-switcher-wrap">
              <div
                key={active.slug}
                className="store-switcher-card"
                style={{ background: active.fallbackGradient }}
              >
                {/* La imagen es el zona clicable: avanza al siguiente proyecto */}
                <button
                  className="store-switcher-media"
                  onClick={() => step(1)}
                  aria-label={`Ver el siguiente proyecto (ahora: ${active.name})`}
                >
                  <SmartImage
                    basePath={active.heroPath}
                    kind="hero"
                    className="store-switcher-img"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                  <span className="store-switcher-scrim" />
                  <span className="store-switcher-logo">
                    <ProjectLogo project={active} />
                  </span>
                  <span className="store-switcher-meta">
                    <span className="store-switcher-name">{active.name}</span>
                    <span className="store-switcher-sub">
                      {active.devTime !== NO_TIME
                        ? `${active.devTime} de trabajo`
                        : STATUS_LABEL[active.status]}
                    </span>
                  </span>
                </button>

                {/* Panel de "ficha de tienda": valoración, etiquetas y precio */}
                <div className="store-switcher-info">
                  <p className="store-switcher-review">
                    <span className="store-switcher-review-score">{active.price.review}</span>{' '}
                    <span className="store-switcher-review-count">
                      ({active.price.reviewCount} reseñas)
                    </span>
                  </p>

                  <ul className="store-switcher-tags" aria-label="Etiquetas">
                    {active.tags.slice(0, 3).map((tag) => (
                      <li key={tag} className="store-switcher-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="store-switcher-buy">
                    <div className="store-switcher-prices">
                      {active.price.discount && (
                        <span className="store-switcher-discount">
                          -{active.price.discount}%
                        </span>
                      )}
                      {active.price.original && (
                        <span className="store-switcher-was">{active.price.original}</span>
                      )}
                      <span className="store-switcher-now">{active.price.final}</span>
                    </div>
                    <button
                      className="store-switcher-cta"
                      type="button"
                      onClick={() => onOpenProject(active)}
                    >
                      Ver en la biblioteca
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="store-switcher-arrow left"
                type="button"
                aria-label="Proyecto anterior"
                onClick={() => step(-1)}
              >
                <ChevronLeftIcon className="store-switcher-arrow-svg" />
              </button>
              <button
                className="store-switcher-arrow right"
                type="button"
                aria-label="Proyecto siguiente"
                onClick={() => step(1)}
              >
                <ChevronRightIcon className="store-switcher-arrow-svg" />
              </button>
            </div>

            <div className="store-dots" role="tablist" aria-label="Seleccionar proyecto">
              {featured.map((project, index) => (
                <button
                  key={project.slug}
                  type="button"
                  role="tab"
                  className={`store-dot ${index === featuredIndex % total ? 'active' : ''}`}
                  aria-selected={index === featuredIndex % total}
                  aria-label={project.name}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>

            <p className="store-switcher-hint">
              Pulsa la imagen para ver el siguiente proyecto
            </p>
          </>
        )}
      </section>

      {/* ---------- Todos los juegos ---------- */}
      <section className="store-projects" aria-labelledby="store-projects-title">
        <div className="store-projects-head">
          <h2 id="store-projects-title" className="store-projects-title">
            {query ? 'Resultados' : 'Todos los juegos'}{' '}
            <span className="store-projects-count">({visibleProjects.length})</span>
          </h2>
          <select
            className="store-sort"
            aria-label="Ordenar proyectos"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </div>

        {visibleProjects.length === 0 ? (
          <p className="store-projects-empty">No hay proyectos que coincidan con la búsqueda.</p>
        ) : (
          <div className="store-projects-grid" role="list" aria-label="Todos los proyectos">
            {visibleProjects.map((project) => (
              <button
                key={project.slug}
                className="store-project-card"
                role="listitem"
                onClick={() => onOpenProject(project)}
                aria-label={`Ver ${project.name} en la biblioteca`}
              >
                <div
                  className="store-project-frame"
                  style={{ background: project.fallbackGradient }}
                  aria-hidden="true"
                >
                  <SmartImage
                    basePath={project.capsulePath}
                    kind="capsule"
                    className="store-project-img"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                </div>
                <span className="store-project-name">{project.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
