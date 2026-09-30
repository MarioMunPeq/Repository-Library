/** Insignia del perfil. Al ser del color del lenguaje o herramienta, el texto
 *  se pinta en oscuro o claro según loluminoso del fondo (ver `readableText`). */
export interface DevBadge {
  id: string;
  label: string;
  short: string;
  color: string;
}

export interface DevGroup {
  id: string;
  name: string;
  members: number;
}

/** Enlaces y datos de las redes. LinkedIn no tiene API pública, así que el
 *  titular y la ubicación se declaran aquí a mano. */
export interface DevSocial {
  githubUser: string;
  githubUrl: string;
  linkedinUrl: string;
  linkedinHeadline: string;
  linkedinLocation: string;
}

/** Fondo del perfil a toda página, igual que en Steam: un vídeo en bucle y sin
 *  sonido con un póster debajo. El póster es lo que se ve mientras carga y lo
 *  único que se ve en móvil, donde el vídeo no se reproduce.
 *
 *  Son los mismos archivos que usa tu perfil real de Steam, descargados a
 *  `public/profile/` (webm 3,3 MB + mp4 3,1 MB + jpg 0,3 MB). Se sirven con
 *  `assetUrl()` para respetar el `base` de Vite. */
export interface DevBackground {
  posterPath: string;
  /** Fuentes de vídeo por orden de preferencia: la primera que sepa
   *  reproducir el navegador gana, igual que hace Steam. */
  sources: { path: string; type: string }[];
}

export interface DevProfile {
  avatarBasePath: string;
  background: DevBackground;
  username: string;
  /** Saldo de la cartera, como el que muestra el chip azul de la barra. */
  walletBalance: string;
  realName: string;
  role: string;
  bio: string;
  location: string;
  countryFlag: string;
  level: number;
  yearsExperience: number;
  /** Puntos de experiencia, como el "650 EXP" del perfil real de Steam. */
  exp: number;
  lastActivity: string;
  favoriteProject: {
    id: string;
    hours: number;
    achievements: {
      unlocked: number;
      total: number;
    };
  };
  /** Lenguajes y herramientas, cada uno con su color oficial. */
  badges: DevBadge[];
  reviews: number;
  groups: DevGroup[];
  social: DevSocial;
  /** Cifras de las estadísticas de la derecha. Lo que cuenta proyectos
   *  (juegos, capturas) vive en la biblioteca, no aquí. */
  stats: {
    articles: number;
    guides: number;
    artwork: number;
    inventory: number;
  };
}

export const devProfile: DevProfile = {
  avatarBasePath: '/profile/avatar',
  background: {
    posterPath: '/profile/background.jpg',
    sources: [
      { path: '/profile/background.webm', type: 'video/webm' },
      { path: '/profile/background.mp4', type: 'video/mp4' },
    ],
  },
  username: 'MarioMunPeq',
  walletBalance: '0,45€',
  realName: 'Mario Muñoz Pequeño',
  role: 'Desarrollador web',
  bio: 'Esta web es mi portfolio con forma de cliente de Steam: cada proyecto tiene su ficha, con descripción, capturas y los logros del juego al que se asocia. Me interesa el frontend y también el lado visual de las cosas: los shaders, los efectos y el detalle que hace que una interfaz se sienta viva.',
  location: 'Valladolid, España',
  countryFlag: '🇪🇸',
  level: 24,
  yearsExperience: 2,
  exp: 650,
  lastActivity: 'hace 3 días',
  favoriteProject: {
    id: 'persona5',
    hours: 120,
    achievements: {
      unlocked: 41,
      total: 54,
    },
  },
  badges: [
    { id: 'typescript', label: 'TypeScript', short: 'TS', color: '#3178c6' },
    { id: 'javascript', label: 'JavaScript', short: 'JS', color: '#f1e05a' },
    { id: 'python', label: 'Python', short: 'PY', color: '#3572a5' },
    { id: 'react', label: 'React', short: 'R', color: '#61dafb' },
    { id: 'html', label: 'HTML', short: 'HTM', color: '#e34c26' },
    { id: 'css', label: 'CSS', short: 'CSS', color: '#563d7c' },
    { id: 'vite', label: 'Vite', short: 'V', color: '#646cff' },
  ],
  reviews: 1,
  groups: [
    { id: 'indie-devs', name: 'Indie Devs España', members: 3420 },
    { id: 'react-latam', name: 'Front-End España', members: 12870 },
  ],
  social: {
    githubUser: 'MarioMunPeq',
    githubUrl: 'https://github.com/MarioMunPeq',
    linkedinUrl: 'https://www.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o/',
    linkedinHeadline: 'Desarrollador web · DAM · Constructor de cosas para entender cómo funcionan',
    linkedinLocation: 'Valladolid, España',
  },
  stats: {
    articles: 4,
    guides: 0,
    artwork: 1,
    inventory: 0,
  },
};
