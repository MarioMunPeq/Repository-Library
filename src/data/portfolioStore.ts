export type PortfolioStatus = 'released' | 'in-development' | 'paused' | 'coming-soon';

export interface PortfolioAchievement {
  id: string;
  tech: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface PortfolioScreenshot {
  id: string;
  url: string;
  caption?: string;
}

export interface PortfolioEntry {
  id: string;
  name: string;
  status: PortfolioStatus;
  bannerColor: string;
  bannerImage?: string;
  tagline: string;
  playTimeHours: number;
  achievements: PortfolioAchievement[];
  lastSession: string;
  screenshots: PortfolioScreenshot[];
  url: string;
}

export const portfolioStore: PortfolioEntry[] = [
  {
    id: 'space-shooter',
    name: 'Starbound Odyssey',
    status: 'released',
    bannerColor: '#1a2a3a',
    bannerImage: 'https://picsum.photos/seed/starbound-banner/616/353',
    tagline: 'Shooter espacial arcade con generación procedural de niveles, jefes épicos y sistema de mejoras persistentes.',
    playTimeHours: 42,
    achievements: [
      {
        id: 'phaser',
        tech: 'Phaser 3',
        name: 'Motor de vuelo',
        description: 'Coordina tu primera nave usando el motor de juego Phaser 3.',
        unlocked: true,
      },
      {
        id: 'typescript',
        tech: 'TypeScript',
        name: 'Código estelar',
        description: 'Escribes lógica tipada capaz de atravesar galaxias de eventos.',
        unlocked: true,
      },
      {
        id: 'vite',
        tech: 'Vite',
        name: 'Hiperespacio instantáneo',
        description: 'Enciendes el dev server y el hot reload responde a la velocidad de la luz.',
        unlocked: true,
      },
      {
        id: 'webgl',
        tech: 'WebGL',
        name: 'Renderizador de nebulosas',
        description: 'Tu GPU proyecta estrellas y partículas sin despeinarse.',
        unlocked: true,
      },
    ],
    lastSession: '2026-05-14',
    screenshots: [
      { id: 'overview', url: 'https://picsum.photos/seed/starbound-1/1920/1080', caption: 'Visión general del proyecto' },
      { id: 'gameplay', url: 'https://picsum.photos/seed/starbound-2/1920/1080', caption: 'Combate contra jefes' },
      { id: 'systems', url: 'https://picsum.photos/seed/starbound-3/1920/1080', caption: 'Sistema de mejoras' },
    ],
    url: 'https://mariomunpeq.github.io/space-shooter',
  },
  {
    id: 'platformer',
    name: 'Pixel Runner',
    status: 'in-development',
    bannerColor: '#2d1a3a',
    bannerImage: 'https://picsum.photos/seed/pixel-banner/616/353',
    tagline: 'Plataformas de precisión estilo retro pixel-art con editor de niveles integrado y speedrun mode.',
    playTimeHours: 27,
    achievements: [
      {
        id: 'react',
        tech: 'React',
        name: 'Componentes saltarines',
        description: 'Construye la interfaz del editor con componentes que rebotan entre estados.',
        unlocked: true,
      },
      {
        id: 'typescript',
        tech: 'TypeScript',
        name: 'Precisión tipada',
        description: 'Modelas los niveles con tipos que caen siempre en el hueco correcto.',
        unlocked: true,
      },
      {
        id: 'canvas',
        tech: 'Canvas API',
        name: 'Píxel perfecto',
        description: 'Renderizas cada sprite con una claridad quirúrgica.',
        unlocked: true,
      },
      {
        id: 'zustand',
        tech: 'Zustand',
        name: 'Estado a contrarreloj',
        description: 'Almacena tus mejores tiempos en un store global sin caer en deudas.',
        unlocked: false,
      },
    ],
    lastSession: '2026-09-18',
    screenshots: [
      { id: 'level', url: 'https://picsum.photos/seed/pixel-1/1920/1080', caption: 'Diseño de niveles' },
      { id: 'editor', url: 'https://picsum.photos/seed/pixel-2/1920/1080', caption: 'Editor de niveles integrado' },
      { id: 'ghost', url: 'https://picsum.photos/seed/pixel-3/1920/1080', caption: 'Replay de ghost data' },
    ],
    url: 'https://mariomunpeq.github.io/pixel-runner',
  },
  {
    id: 'rpg-tactical',
    name: 'Chronicles of Aether',
    status: 'paused',
    bannerColor: '#2a3a1a',
    bannerImage: 'https://picsum.photos/seed/aether-banner/616/353',
    tagline: 'RPG táctico por turnos con sistema de jobs, crafting profundo y narrativa ramificada.',
    playTimeHours: 96,
    achievements: [
      {
        id: 'unity',
        tech: 'Unity',
        name: 'Motor de campaña',
        description: 'Levantas la campaña de 30+ horas sobre un motor de combate por cuadrícula.',
        unlocked: true,
      },
      {
        id: 'csharp',
        tech: 'C#',
        name: 'Hechizos compilados',
        description: 'Expulsas sistemas de crafting a base de clases bien encantadas.',
        unlocked: true,
      },
      {
        id: 'addressables',
        tech: 'Addressables',
        name: 'Recursos invocables',
        description: 'Conjura y descarta assets bajo demanda sin agotar el maná de la memoria.',
        unlocked: false,
      },
      {
        id: 'dots',
        tech: 'DOTS',
        name: 'Apóstoles del multithreading',
        description: 'Invocas miles de unidades sin sacrificar el frame rate.',
        unlocked: false,
      },
    ],
    lastSession: '2026-01-30',
    screenshots: [
      { id: 'combat', url: 'https://picsum.photos/seed/aether-1/1920/1080', caption: 'Combate táctico' },
      { id: 'jobs', url: 'https://picsum.photos/seed/aether-2/1920/1080', caption: 'Sistema de jobs' },
      { id: 'world', url: 'https://picsum.photos/seed/aether-3/1920/1080', caption: 'Exploración del mundo' },
    ],
    url: 'https://mariomunpeq.github.io/chronicles-aether',
  },
  {
    id: 'horror-puzzle',
    name: 'Echoes in the Dark',
    status: 'coming-soon',
    bannerColor: '#3a1a1a',
    bannerImage: 'https://picsum.photos/seed/echoes-banner/616/353',
    tagline: 'Horror psicológico en primera persona con mecánicas de sonido y luz. Múltiples finales según tus decisiones.',
    playTimeHours: 12,
    achievements: [
      {
        id: 'threejs',
        tech: 'Three.js',
        name: 'Sombras con vida',
        description: 'Aún no has encendido la primera luz del motor 3D.',
        unlocked: false,
      },
      {
        id: 'typescript',
        tech: 'TypeScript',
        name: 'Sospechosos tipados',
        description: 'El compilador sigue vigilando en la oscuridad del archivo fuente.',
        unlocked: false,
      },
      {
        id: 'gsap',
        tech: 'GSAP',
        name: 'Escalofríos animados',
        description: 'Las puertas del proyecto aún no se abren en su punto de anclaje.',
        unlocked: false,
      },
      {
        id: 'webaudio',
        tech: 'Web Audio API',
        name: 'Silencio absoluto',
        description: 'No hay señal sonora todavía en los radares de esta sesión.',
        unlocked: false,
      },
    ],
    lastSession: '2026-08-02',
    screenshots: [
      { id: 'intro', url: 'https://picsum.photos/seed/echoes-1/1920/1080', caption: 'Ambiente inicial' },
      { id: 'mechanics', url: 'https://picsum.photos/seed/echoes-2/1920/1080', caption: 'Mecánicas de luz' },
      { id: 'tbd', url: 'https://picsum.photos/seed/echoes-3/1920/1080', caption: 'Zona por descubrir' },
    ],
    url: 'https://mariomunpeq.github.io/echoes-dark',
  },
  {
    id: 'card-game',
    name: 'Arcane Duels',
    status: 'in-development',
    bannerColor: '#2a1a3a',
    bannerImage: 'https://picsum.photos/seed/arcane-banner/616/353',
    tagline: 'CCG online con draft en tiempo real, más de 300 cartas únicas y torneos semanales cross-platform.',
    playTimeHours: 68,
    achievements: [
      {
        id: 'react',
        tech: 'React',
        name: 'Mazo de componentes',
        description: 'Construyes la mesa de juego con una librería de cartas virtuales reutilizables.',
        unlocked: true,
      },
      {
        id: 'node',
        tech: 'Node.js',
        name: 'Host del torneo',
        description: 'Mantienes el servidor en pie mientras todos tus usuarios hacen draft a la vez.',
        unlocked: true,
      },
      {
        id: 'socketio',
        tech: 'Socket.io',
        name: 'Canal de mentes',
        description: 'Sincronizas partidas en tiempo real sin chispa de desincronización.',
        unlocked: true,
      },
      {
        id: 'postgresql',
        tech: 'PostgreSQL',
        name: 'Archivista de cartas',
        description: 'Indexas 300+ cartas únicas con integridad referencial.',
        unlocked: true,
      },
      {
        id: 'prisma',
        tech: 'Prisma',
        name: 'Contrato con el oráculo',
        description: 'Aún no has firmado el pacto de consultas tipadas con tu base de datos.',
        unlocked: false,
      },
    ],
    lastSession: '2026-09-21',
    screenshots: [
      { id: 'table', url: 'https://picsum.photos/seed/arcane-1/1920/1080', caption: 'Mesa de juego' },
      { id: 'draft', url: 'https://picsum.photos/seed/arcane-2/1920/1080', caption: 'Draft en tiempo real' },
      { id: 'collection', url: 'https://picsum.photos/seed/arcane-3/1920/1080', caption: 'Colección de cartas' },
    ],
    url: 'https://mariomunpeq.github.io/arcane-duels',
  },
  {
    id: 'metroidvania',
    name: 'Hollow Crown',
    status: 'coming-soon',
    bannerColor: '#1a3a2a',
    bannerImage: 'https://picsum.photos/seed/hollow-banner/616/353',
    tagline: 'Metroidvania atmosférico con mundo interconectado, habilidades de movimiento progresivas y lore ambiental.',
    playTimeHours: 9,
    achievements: [
      {
        id: 'godot',
        tech: 'Godot 4',
        name: 'Primer santuario',
        description: 'Desbloqueas la primera habilidad: el motor de juego como punto de guardado.',
        unlocked: true,
      },
      {
        id: 'gdscript',
        tech: 'GDScript',
        name: 'Runas del script',
        description: 'Las inscripciones del mundo aún esperan su intérprete.',
        unlocked: false,
      },
      {
        id: 'csharp',
        tech: 'C#',
        name: 'Forja de clases',
        description: 'El herrero no ha templado todavía los sistemas de combate.',
        unlocked: false,
      },
      {
        id: 'aseprite',
        tech: 'Aseprite',
        name: 'Paleta del artista',
        description: 'Los pinceles descansan a la espera del primer arte hand-drawn.',
        unlocked: false,
      },
    ],
    lastSession: '2026-09-10',
    screenshots: [
      { id: 'prologue', url: 'https://picsum.photos/seed/hollow-1/1920/1080', caption: 'Prólogo del viaje' },
      { id: 'map', url: 'https://picsum.photos/seed/hollow-2/1920/1080', caption: 'Mapa interconectado' },
      { id: 'tbd', url: 'https://picsum.photos/seed/hollow-3/1920/1080', caption: 'Zona por descubrir' },
    ],
    url: 'https://mariomunpeq.github.io/hollow-crown',
  },
];

export function getPortfolioEntry(id: string): PortfolioEntry | undefined {
  return portfolioStore.find((entry) => entry.id === id);
}

export function getAchievementCounts(entry: PortfolioEntry): { unlocked: number; total: number } {
  const unlocked = entry.achievements.filter((achievement) => achievement.unlocked).length;
  return { unlocked, total: entry.achievements.length };
}

export function formatPlayTime(hours: number): string {
  return `${Math.floor(hours)} h`;
}