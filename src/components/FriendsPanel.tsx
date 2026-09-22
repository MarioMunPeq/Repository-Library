import { useMemo, useRef, useState } from 'react';
import { currentUser as defaultCurrentUser, friends as defaultFriends } from '../data/friends';
import type { CurrentUser, Friend, FriendStatus } from '../data/friends';
import { SmartImage } from './SmartImage';
import {
  ChevronDownIcon,
  CloseIcon,
  GearIcon,
  GroupChatIcon,
  MinimizeIcon,
  PlusIcon,
  ResizeIcon,
  SearchIcon,
} from './Icons';
import './FriendsPanel.css';

interface FriendsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser?: CurrentUser;
  friends?: Friend[];
}

const AVATAR_PALETTE = ['#2a475e', '#2d5a3f', '#4a3a6a', '#6a523a', '#3a4f6a', '#5e3a52'];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

const isOfflineStatus = (status: FriendStatus) => status === 'offline' || status === 'invisible';

interface DragState {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  baseLeft: number;
  baseTop: number;
  width: number;
  height: number;
}

export const FriendsPanel: React.FC<FriendsPanelProps> = ({
  open,
  onOpenChange,
  currentUser = defaultCurrentUser,
  friends = defaultFriends,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const handleDragStart = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button, a')) return;
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origX: offset.x,
      origY: offset.y,
      baseLeft: rect.left - offset.x,
      baseTop: rect.top - offset.y,
      width: rect.width,
      height: rect.height,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    if (!state) return;
    const maxLeft = Math.max(0, window.innerWidth - state.width);
    const maxTop = Math.max(0, window.innerHeight - state.height);
    const left = Math.min(Math.max(state.baseLeft + state.origX + (event.clientX - state.startX), 0), maxLeft);
    const top = Math.min(Math.max(state.baseTop + state.origY + (event.clientY - state.startY), 0), maxTop);
    setOffset({ x: left - state.baseLeft, y: top - state.baseTop });
  };

  const handleDragEnd = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onlineFriends = useMemo(
    () => friends.filter((friend) => !isOfflineStatus(friend.status)),
    [friends],
  );
  const offlineFriends = useMemo(
    () => friends.filter((friend) => isOfflineStatus(friend.status)),
    [friends],
  );
  const favorites = useMemo(() => friends.filter((friend) => friend.favorite), [friends]);

  const activityGroups = useMemo(() => {
    const groups: { name: string; friends: Friend[] }[] = [];
    const seen = new Set<string>();
    for (const friend of onlineFriends) {
      if (friend.activityGroup && !seen.has(friend.activityGroup)) {
        seen.add(friend.activityGroup);
        groups.push({
          name: friend.activityGroup,
          friends: onlineFriends.filter((item) => item.activityGroup === friend.activityGroup),
        });
      }
    }
    return groups;
  }, [onlineFriends]);

  const ungroupedOnline = useMemo(
    () => onlineFriends.filter((friend) => !friend.activityGroup),
    [onlineFriends],
  );

  if (!open) return null;

  const renderRow = (friend: Friend, indented = false) => {
    const offline = isOfflineStatus(friend.status);
    const playing = Boolean(friend.project);
    const rowClassName = `fp-row ${indented ? 'indented' : ''}`;
    const content = (
      <>
        <span
          className={`fp-avatar row ${offline ? 'ring-offline' : playing ? 'ring-playing' : 'ring-online'}`}
          style={{ width: 32, height: 32 }}
          aria-hidden="true"
        >
          {friend.avatarInitial}
          {friend.slug && (
            <SmartImage
              basePath={`/friends/${friend.slug}/avatar`}
              kind="avatar"
              className="fp-avatar-img"
              alt=""
            />
          )}
        </span>
        <span className="fp-row-info">
          <span className={`fp-name ${offline ? 'offline' : playing ? 'playing' : 'online'}`}>
            {friend.name}
          </span>
          <span className={`fp-subtitle ${offline ? 'offline' : ''}`}>{friend.statusText}</span>
        </span>
      </>
    );
    if (friend.githubUrl) {
      return (
        <a key={friend.id} className={rowClassName} href={friend.githubUrl} target="_blank" rel="noopener">
          {content}
        </a>
      );
    }
    return (
      <button key={friend.id} className={rowClassName}>
        {content}
      </button>
    );
  };

  return (
    <div
      className="friends-root"
      ref={rootRef}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <section className="friends-panel" id="friends-panel" role="region" aria-label="Panel de amigos">
        <header
          className={`fp-header${dragging ? ' dragging' : ''}`}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <span
            className={`fp-avatar head ${currentUser.status === 'online' ? 'ring-online' : 'ring-offline'}`}
            style={{ width: 44, height: 44 }}
            aria-hidden="true"
          >
            {currentUser.avatarInitial}
          </span>
          <div className="fp-header-user">
            <span className="fp-header-name">
              {currentUser.name}
              <ChevronDownIcon className="fp-header-chevron" />
            </span>
            <span className="fp-header-status">{currentUser.statusText}</span>
          </div>
          <div className="fp-header-actions">
            <button className="fp-icon-btn" aria-label="Ajustes">
              <GearIcon className="fp-icon-btn-svg" />
            </button>
            <button className="fp-icon-btn" aria-label="Minimizar" onClick={() => onOpenChange(false)}>
              <MinimizeIcon className="fp-icon-btn-svg" />
            </button>
            <button className="fp-icon-btn" aria-label="Cerrar" onClick={() => onOpenChange(false)}>
              <CloseIcon className="fp-icon-btn-svg" />
            </button>
          </div>
        </header>

        {favorites.length > 0 && (
          <div className="fp-favorites" role="list" aria-label="Amigos favoritos">
            {favorites.map((friend) => (
              <button key={friend.id} className="fp-fav" title={`${friend.name} · ${friend.statusText}`}>
                <span
                  className="fp-fav-avatar"
                  style={{ background: avatarColor(friend.name) }}
                  aria-hidden="true"
                >
                  {friend.avatarInitial}
                  {friend.slug && (
                    <SmartImage
                      basePath={`/friends/${friend.slug}/avatar`}
                      kind="avatar"
                      className="fp-fav-avatar-img"
                      alt=""
                    />
                  )}
                </span>
                <span
                  className={`fp-fav-dot ${isOfflineStatus(friend.status) ? 'off' : 'on'}`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        )}

        <div className="fp-toolbar">
          <span className="fp-toolbar-title">AMIGOS</span>
          <div className="fp-toolbar-actions">
            <button className="fp-icon-btn" aria-label="Buscar amigos">
              <SearchIcon className="fp-icon-btn-svg" />
            </button>
            <button className="fp-icon-btn accent" aria-label="Añadir amigo">
              <PlusIcon className="fp-icon-btn-svg" />
            </button>
          </div>
        </div>

        <div className="fp-list">
          <h3 className="fp-section-title">AMIGOS EN LÍNEA ({onlineFriends.length})</h3>

          {activityGroups.map((group) => (
            <div key={group.name}>
              <div className="fp-group">
                <GroupChatIcon className="fp-group-icon" />
                <span className="fp-group-name">{group.name}</span>
              </div>
              {group.friends.map((friend) => renderRow(friend, true))}
            </div>
          ))}

          {ungroupedOnline.map((friend) => renderRow(friend))}

          {onlineFriends.length === 0 && <p className="fp-empty">No hay amigos en línea</p>}

          {offlineFriends.length > 0 && (
            <>
              <h3 className="fp-section-title">DESCONECTADOS ({offlineFriends.length})</h3>
              {offlineFriends.map((friend) => renderRow(friend))}
            </>
          )}
        </div>

        <footer className="fp-groups">
          <div className="fp-groups-head">
            <span className="fp-groups-title-row">
              <ChevronDownIcon className="fp-groups-chevron" />
              CHATS DE GRUPO
            </span>
            <button className="fp-icon-btn accent" aria-label="Nuevo chat de grupo">
              <PlusIcon className="fp-icon-btn-svg" />
            </button>
          </div>
          <p className="fp-groups-text">Los chats de grupo en los que participes aparecerán aquí.</p>
          <ResizeIcon className="fp-resize" />
        </footer>
      </section>
    </div>
  );
};