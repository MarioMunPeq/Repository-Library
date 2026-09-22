export type FriendStatus = 'online' | 'offline' | 'invisible';

export interface Friend {
  id: string;
  slug?: string;
  name: string;
  avatarInitial: string;
  status: FriendStatus;
  statusText: string;
  githubUrl?: string;
  project?: string;
  activityGroup?: string;
  favorite?: boolean;
}

export interface CurrentUser {
  name: string;
  avatarInitial: string;
  status: FriendStatus;
  statusText: string;
}

export const currentUser: CurrentUser = {
  name: 'MarioMunPeq',
  avatarInitial: 'MM',
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
    statusText: 'Satisfactory',
    project: 'Satisfactory',
    activityGroup: 'Satisfactory',
    favorite: true,
  },
  {
    id: 'paula1610',
    slug: 'paula1610',
    name: 'Paula1610',
    avatarInitial: 'PA',
    githubUrl: 'https://github.com/Paula1610',
    status: 'online',
    statusText: 'En línea',
    favorite: true,
  },
];