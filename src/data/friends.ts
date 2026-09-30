export type FriendStatus = 'online' | 'offline' | 'invisible';

export interface Friend {
  id: string;
  slug?: string;
  name: string;
  avatarInitial: string;
  status: FriendStatus;
  githubUrl?: string;
  /** Id del juego que está jugando (ver `friendGames`). Es lo que hace que el
   *  cliente lo agrupe bajo el juego, con su icono, en vez de dejarlo suelto en
   *  "Amigos en línea". */
  game?: string;
  /** Nombre del proyecto del portfolio con el que se enlaza (ficha de tienda). */
  project?: string;
  favorite?: boolean;
  /** Solo para los desconectados: "hace 1 día y 13 horas". */
  lastSeen?: string;
}

export interface CurrentUser {
  name: string;
  avatarInitial: string;
  status: FriendStatus;
  statusText: string;
}

export const currentUser: CurrentUser = {
  name: 'MarioMunPeq',
  avatarInitial: 'MP',
  status: 'invisible',
  statusText: 'Invisible',
};

export const friends: Friend[] = [
  {
    id: 'jeanpefe',
    slug: 'jeanpefe',
    name: 'Jeanpefe',
    avatarInitial: 'JP',
    githubUrl: 'https://github.com/Jeanpefe',
    status: 'online',
    game: 'satisfactory',
    favorite: true,
  },
  {
    id: 'paula1610',
    slug: 'paula1610',
    name: 'Paula1610',
    avatarInitial: 'PA',
    githubUrl: 'https://github.com/Paula1610',
    status: 'online',
    game: 'hollow-knight',
    favorite: true,
  },
  {
    id: 'kr1s',
    name: 'The Red Ambassadress',
    avatarInitial: 'KR',
    status: 'online',
    game: 'magia-exedra',
  },
  // Desconectados: el cliente los lista con su "última conexión" y un caret
  // de ordenación, así que la lista necesita más de dos entradas.
  {
    id: 'oxido',
    name: 'oxido',
    avatarInitial: 'OX',
    status: 'offline',
    lastSeen: 'hace 2 días',
  },
];
