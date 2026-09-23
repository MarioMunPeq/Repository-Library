export const username = 'MarioMunPeq';

export type CloudStatus = 'ok' | 'syncing';

export type ProjectCategory = 'portfolio' | 'juego';

export type ProjectRecommendation = 'desarrolladores' | 'juego';

export type ProjectStatus = 'completado' | 'en desarrollo' | 'proximamente';

export interface ProjectAchievements {
  unlocked: number;
  total: number;
}

export interface ProjectStats {
  cloudStatus: CloudStatus;
  cloudLabel: string;
  lastSession: string;
  playtime: string;
  achievements: ProjectAchievements;
}

export type ActivityKind = 'achievement' | 'play' | 'screenshot' | 'friend';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  text: string;
  date: string;
}

export interface ProjectUpdate {
  date: string;
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  recommendation: ProjectRecommendation;
  githubUrl: string | null;
  status: ProjectStatus;
  /** Rutas derivadas del slug SIN extensión (assets de Steam, todos opcionales).
   *  La extensión real la resuelve `SmartImage` en runtime (`resolveAssetSrc`). */
  /** Cuadrado pequeño ~64x64 — sidebar en vista lista. `/projects/<slug>/icon` */
  iconPath: string;
  /** Vertical ~600x900 — sidebar en vista cuadrícula. `/projects/<slug>/capsule` */
  capsulePath: string;
  /** Horizontal ~460x215 — tarjetas de la tienda. `/projects/<slug>/header` */
  headerPath: string;
  /** Panorámico ~3840x1240 — banner grande. `/projects/<slug>/hero` */
  heroPath: string;
  /** Transparente, superpuesto al hero. `/projects/<slug>/logo` */
  logoPath: string;
  /** Nombres de archivo dentro de `/public/projects/<slug>/screenshots/` (sin extensión) */
  screenshots: string[];
  /** Placeholder de gradiente mientras no existan imágenes reales */
  fallbackGradient: string;
  description: string;
  tags: string[];
  devTime: string;
  lastUpdate: string;
  unlockedTech: number;
  totalTech: number;
  technologies: string[];
  collaborators: string[];
  updates: ProjectUpdate[];
  stats: ProjectStats;
  activity: ActivityItem[];
}

type ProjectInput = Omit<Project, 'iconPath' | 'capsulePath' | 'headerPath' | 'heroPath' | 'logoPath'> & {
  iconPath?: string;
  capsulePath?: string;
  headerPath?: string;
  heroPath?: string;
  logoPath?: string;
};

/**
 * Define un proyecto resolviendo automáticamente sus rutas de imagen
 * (assets de Steam) a partir del slug. Para añadir un proyecto nuevo basta con:
 *   1. Crear `/public/projects/<slug>/` (con `screenshots/`)
 *   2. Añadir una entrada aquí con `defineProject`
 * Todos los assets son opcionales: mientras no existan, la interfaz usa
 * `fallbackGradient` como respaldo.
 */
const defineProject = (input: ProjectInput): Project => ({
  ...input,
  recommendation: input.recommendation ?? 'desarrolladores',
  iconPath: input.iconPath ?? `/projects/${input.slug}/icon`,
  capsulePath: input.capsulePath ?? `/projects/${input.slug}/capsule`,
  headerPath: input.headerPath ?? `/projects/${input.slug}/header`,
  heroPath: input.heroPath ?? `/projects/${input.slug}/hero`,
  logoPath: input.logoPath ?? `/projects/${input.slug}/logo`,
});

const defaultStats = (): ProjectStats => ({
  cloudStatus: 'ok',
  cloudLabel: 'OK',
  lastSession: '—',
  playtime: '—',
  achievements: { unlocked: 0, total: 0 },
});

export const projects: Project[] = [
  defineProject({
    slug: 'persona5',
    name: 'Persona 5 Royal',
    category: 'portfolio',
    recommendation: 'desarrolladores',
    githubUrl: 'http://mariomunpeq.is-a.dev/',
    status: 'completado',
    screenshots: ['1', '2', '3', '4', '5', '6'],
    fallbackGradient: 'linear-gradient(90deg, #14060a 0%, #4a0d16 55%, #8f1420 100%)',
    description:
      'Portfolio personal desarrollado como un CV viviente con una estética inspirada en Persona 5: perfil, proyectos, experiencia, formación y contacto en una experiencia web interactiva y visual.',
    tags: ['Portfolio', 'React', 'TypeScript'],
    devTime: '120h',
    lastUpdate: '22 Sep 2026',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
  }),
  defineProject({
    slug: 'vault-archive',
    name: 'Fallout: New Vegas',
    category: 'portfolio',
    recommendation: 'desarrolladores',
    githubUrl: 'https://mariomunpeq.github.io/Vault-Archive/',
    status: 'en desarrollo',
    screenshots: [],
    fallbackGradient: 'linear-gradient(90deg, #150d24 0%, #2b1a4a 55%, #3f2a6e 100%)',
    description:
      'HUD web interactivo inspirado en el Pip-Boy de Fallout. Portfolio técnico y visual creado desde cero, con secuencia de arranque, efecto CRT, navegación por pestañas y efectos de sonido.',
    tags: ['Portfolio', 'React', 'TypeScript'],
    devTime: '100h',
    lastUpdate: 'Hoy',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
  }),
  defineProject({
    slug: 'minecraft',
    name: 'Minecraft Portfolio',
    category: 'portfolio',
    recommendation: 'desarrolladores',
    githubUrl: null,
    status: 'proximamente',
    screenshots: [],
    fallbackGradient: 'linear-gradient(90deg, #14260f 0%, #2c4a1a 55%, #3f7a2a 100%)',
    description:
      'Portfolio temático construido como un mundo jugable en Minecraft: cada build cuenta un capítulo de la trayectoria como desarrollador. Próximamente disponible.',
    tags: ['Minecraft', 'Portfolio', 'Próximamente'],
    devTime: '—',
    lastUpdate: 'próximamente',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
    headerPath: '/projects/minecraft/hero',
  }),
  defineProject({
    slug: 'news-tower',
    name: 'News Tower',
    category: 'juego',
    recommendation: 'desarrolladores',
    githubUrl: 'https://mariomunpeq.github.io/Euromario/',
    status: 'completado',
    screenshots: ['1'],
    fallbackGradient: 'linear-gradient(90deg, #0e1a2b 0%, #1c3f6e 55%, #a8201f 100%)',
    description:
      'Agregador de noticias de videojuegos que recopila, filtra y resume las historias más relevantes de las últimas 24 horas con IA: detección de juego, puntuación de relevancia, agrupación de historias y digest diario automático publicado como web estática.',
    tags: ['Python', 'IA', 'Automatización'],
    devTime: '—',
    lastUpdate: '27 Ago 2026',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
  }),
  defineProject({
    slug: 'baldurs-gate-3',
    name: 'Baldur\'s Gate 3',
    category: 'juego',
    recommendation: 'desarrolladores',
    githubUrl: 'https://mariomunpeq.github.io/Dungeon-Archive/',
    status: 'completado',
    screenshots: ['1', '2', '3', '4', '5'],
    fallbackGradient: 'linear-gradient(90deg, #1c1208 0%, #3a2412 55%, #5c3a1e 100%)',
    description:
      'Portfolio temático inspirado en Baldur\'s Gate 3: compendio interactivo, gestión de personaje, diario de aventura y mecánicas de D&D 5e adaptadas a la web como PWA.',
    tags: ['Portfolio', 'React', 'TypeScript', 'D&D 5e'],
    devTime: '20h',
    lastUpdate: '23 Ago 2026',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
  }),
  defineProject({
    slug: 'league-of-legends-helper',
    name: 'League of Legends Helper',
    category: 'juego',
    recommendation: 'juego',
    githubUrl: 'https://github.com/MarioMunPeq/RecomendadorDeCampeones',
    status: 'completado',
    screenshots: ['1', '2', '3'],
    fallbackGradient: 'linear-gradient(90deg, #0a1a0a 0%, #1a3a1a 55%, #2a5a2a 100%)',
    description:
      'Herramienta interactiva para League of Legends que recomienda campeones según tu estilo de juego, composición de equipo y meta actual. Incluye contadores, builds óptimas y estadísticas de winrate.',
    tags: ['League of Legends', 'React', 'TypeScript', 'Juego'],
    devTime: '5h',
    lastUpdate: '6 Ene 2026',
    unlockedTech: 0,
    totalTech: 0,
    technologies: [],
    collaborators: [],
    updates: [],
    stats: defaultStats(),
    activity: [],
    headerPath: '/projects/league-of-legends-helper/hero',
  }),
];
