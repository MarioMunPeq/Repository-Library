export type ProjectStatus = 'completed' | 'in-development' | 'paused' | 'coming-soon';

export interface Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  status: ProjectStatus;
  tags: string[];
  technologies: string[];
  url: string;
  bannerColor: string;
  icon: React.ReactNode;
  bannerImage?: string;
}

export const projects: Project[] = [
  {
    id: 'space-shooter',
    name: 'Starbound Odyssey',
    description: 'Un shooter espacial arcade con generación procedural de niveles, jefes épicos y sistema de mejoras persistentes. Desarrollado con Phaser 3 y TypeScript, incluye modo historia infinito y tablas de clasificación globales.',
    shortDescription: 'Shooter espacial arcade con generación procedural',
    status: 'completed',
    tags: ['Arcade', 'Roguelike', 'Singleplayer'],
    technologies: ['Phaser 3', 'TypeScript', 'Vite', 'WebGL'],
    url: 'https://mariomunpeq.github.io/space-shooter',
    bannerColor: '#1a2a3a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 'platformer',
    name: 'Pixel Runner',
    description: 'Plataformas de precisión con estilo retro pixel-art. 50 niveles hechos a mano, speedrun mode, editor de niveles integrado y reproductor de ghost data para competir contra tus mejores tiempos.',
    shortDescription: 'Plataformas de precisión con editor de niveles',
    status: 'in-development',
    tags: ['Platformer', 'Speedrun', 'Level Editor'],
    technologies: ['React', 'TypeScript', 'Canvas API', 'Zustand'],
    url: 'https://mariomunpeq.github.io/pixel-runner',
    bannerColor: '#2d1a3a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'rpg-tactical',
    name: 'Chronicles of Aether',
    description: 'RPG táctico por turnos con sistema de jobs, crafting profundo y narrativa ramificada. Combate en cuadrícula con altura, cobertura y elementos. Incluye campaña de 30+ horas y modo multijugador asíncrono.',
    shortDescription: 'RPG táctico por turnos con sistema de jobs',
    status: 'paused',
    tags: ['RPG', 'Tactical', 'Turn-based', 'Story Rich'],
    technologies: ['Unity', 'C#', 'Addressables', 'DOTS'],
    url: 'https://mariomunpeq.github.io/chronicles-aether',
    bannerColor: '#2a3a1a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'horror-puzzle',
    name: 'Echoes in the Dark',
    description: 'Horror psicológico en primera persona con mecánicas de sonido y luz. Resuelve puzzles ambientales mientras evitas entidades que reaccionan a tu ruido. Múltiples finales basados en tus decisiones.',
    shortDescription: 'Horror psicológico con mecánicas de sonido',
    status: 'coming-soon',
    tags: ['Horror', 'Puzzle', 'First-Person', 'Atmospheric'],
    technologies: ['Three.js', 'TypeScript', 'GSAP', 'Web Audio API'],
    url: 'https://mariomunpeq.github.io/echoes-dark',
    bannerColor: '#3a1a1a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    id: 'card-game',
    name: 'Arcane Duels',
    description: 'Juego de cartas coleccionables online con draft en tiempo real, más de 300 cartas únicas, facciones asimétricas y torneos semanales. Cross-platform con sincronización en la nube.',
    shortDescription: 'CCG online con draft en tiempo real',
    status: 'in-development',
    tags: ['Card Game', 'Multiplayer', 'Strategy', 'Deckbuilder'],
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
    url: 'https://mariomunpeq.github.io/arcane-duels',
    bannerColor: '#2a1a3a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20M7 4v16M17 4v16" />
      </svg>
    ),
  },
  {
    id: 'metroidvania',
    name: 'Hollow Crown',
    description: 'Metroidvania atmosférico con mundo interconectado, habilidades de movimiento progresivas y lore ambiental. Combate fluido, jefes memorables y finales múltiples. Arte hand-drawn y banda sonora original.',
    shortDescription: 'Metroidvania con mundo interconectado',
    status: 'coming-soon',
    tags: ['Metroidvania', 'Exploration', 'Action', 'Atmospheric'],
    technologies: ['Godot 4', 'GDScript', 'C#', 'Aseprite'],
    url: 'https://mariomunpeq.github.io/hollow-crown',
    bannerColor: '#1a3a2a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M8 14l2 2 4-4" />
      </svg>
    ),
  },
];

export const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  completed: { label: 'Completado', color: '#a4d007', bgColor: 'rgba(164, 208, 7, 0.15)' },
  'in-development': { label: 'En desarrollo', color: '#66c0f4', bgColor: 'rgba(102, 192, 244, 0.15)' },
  paused: { label: 'Pausado', color: '#ffcc00', bgColor: 'rgba(255, 204, 0, 0.15)' },
  'coming-soon': { label: 'Próximamente', color: '#8899a6', bgColor: 'rgba(136, 153, 166, 0.15)' },
};