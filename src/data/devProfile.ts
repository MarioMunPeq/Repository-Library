export interface DevBadge {
  id: string;
  label: string;
  short: string;
  color: string;
}

export interface DevProfile {
  avatarBasePath: string;
  username: string;
  realName: string;
  location: string;
  level: number;
  yearsExperience: number;
  lastActivity: string;
  favoriteProject: {
    id: string;
    hours: number;
    achievements: {
      unlocked: number;
      total: number;
    };
  };
  featuredBadges: DevBadge[];
  badges: DevBadge[];
  stats: {
    videos: number;
    articles: number;
  };
}

export const devProfile: DevProfile = {
  avatarBasePath: '/profile/avatar',
  username: 'MarioMunPeq',
  realName: 'Mario Muñoz Pequeño',
  location: 'Valladolid, España',
  level: 12,
  yearsExperience: 3,
  lastActivity: 'hace 3 días',
  favoriteProject: {
    id: 'persona5',
    hours: 286,
    achievements: {
      unlocked: 41,
      total: 54,
    },
  },
  featuredBadges: [
    { id: 'bootcamp-ia', label: 'Bootcamp IA', short: 'IA', color: '#3a5c7a' },
    { id: 'grado-dam', label: 'Grado DAM', short: 'DAM', color: '#2d5a3f' },
    { id: 'react', label: 'React', short: 'R', color: '#2f5c8f' },
    { id: 'typescript', label: 'TypeScript', short: 'TS', color: '#4a3a6a' },
    { id: 'opensource', label: 'Open Source', short: 'OS', color: '#6a523a' },
  ],
  badges: [
    { id: 'bootcamp-ia', label: 'Bootcamp de IA', short: 'IA', color: '#3a5c7a' },
    { id: 'grado-dam', label: 'Grado DAM', short: 'DAM', color: '#2d5a3f' },
    { id: 'react', label: 'React', short: 'R', color: '#2f5c8f' },
    { id: 'typescript', label: 'TypeScript', short: 'TS', color: '#4a3a6a' },
    { id: 'vite', label: 'Vite', short: 'V', color: '#6a3a5c' },
    { id: 'webgl', label: 'WebGL', short: 'W', color: '#3a5a3a' },
    { id: 'node', label: 'Node.js', short: 'N', color: '#5a4a2a' },
    { id: 'github', label: 'GitHub', short: 'GH', color: '#2a2a2a' },
  ],
  stats: {
    videos: 0,
    articles: 4,
  },
};