import { useEffect, useMemo, useRef, useState } from 'react';
import { currentUser as defaultCurrentUser, friends as defaultFriends } from '../data/friends';
import { devProfile } from '../data/devProfile';
import type { CurrentUser, Friend, FriendStatus } from '../data/friends';
import { SmartImage } from './SmartImage';
import {
  ChevronDownIcon,
  CloseIcon,
  FilterIcon,
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

/** Color del marco del avatar según el estado: jugando, conectado o desconectado. */
const ringClass = (status: FriendStatus, playing: boolean): string => {
  if (isOfflineStatus(status)) return 'ring-offline';
  return playing ? 'ring-playing' : 'ring-online';
};

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
  /** En móvil el panel es una hoja inferior, no una ventana arrastrable. */
  const [isSheet, setIsSheet] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const sync = () => {
      setIsSheet(query.matches);
      if (!query.matches) {
        setSheetExpanded(false);
        setOffset({ x: 0, y: 0 });
      }
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Escape cierra el panel, esté en modo ventana o en modo hoja.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  const handleDragStart = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    // La hoja inferior está anclada: no se arrastra.
    if (isSheet) return;
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
          className={`fp-avatar row ${ringClass(friend.status, playing)}`}
          style={{ width: 32, height: 32 }}
          aria-hidden="true"
        >
          {friend.slug ? (
            <SmartImage
              basePath={`/friends/${friend.slug}/avatar`}
              kind="avatar"
              className="fp-avatar-img"
              alt=""
            />
          ) : (
            friend.avatarInitial
          )}
        </span>
        <span className="fp-row-info">
          <span className={`fp-name ${offline ? 'offline' : 'online'}`}>{friend.name}</span>
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
    <>
      {/* Velo detrás de la hoja inferior (solo móvil) */}
      {isSheet && open && (
        <button
          className="fp-sheet-scrim"
          type="button"
          aria-label="Cerrar el panel de amigos"
          onClick={() => onOpenChange(false)}
        />
      )}

      <div
        className={`friends-root${isSheet ? ' sheet' : ''}${sheetExpanded ? ' expanded' : ''}`}
        ref={rootRef}
        style={isSheet ? undefined : { transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <section className="friends-panel" id="friends-panel" role="region" aria-label="Panel de amigos">
          {/* Tirador para desplegar y recoger la hoja (solo móvil) */}
          <button
            className="fp-sheet-handle"
            type="button"
            aria-expanded={sheetExpanded}
            aria-label={sheetExpanded ? 'Contraer el panel de amigos' : 'Desplegar el panel de amigos'}
            onClick={() => setSheetExpanded((value) => !value)}
          >
            <span className="fp-sheet-handle-bar" aria-hidden="true" />
          </button>

          <header
            className={`fp-header${dragging ? ' dragging' : ''}`}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
          <span
            className={`fp-avatar head ${ringClass(currentUser.status, false)}`}
            style={{ width: 52, height: 52 }}
            aria-hidden="true"
          >
            <SmartImage
              basePath={devProfile.avatarBasePath}
              kind="avatar"
              className="fp-avatar-img"
              alt=""
            />
          </span>
          <div className="fp-header-user">
            <span className={`fp-header-name ${ringClass(currentUser.status, false)}`}>
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
                  className={`fp-fav-avatar ${ringClass(friend.status, Boolean(friend.project))}`}
                  style={{ background: avatarColor(friend.name) }}
                  aria-hidden="true"
                >
                  {friend.slug ? (
                    <SmartImage
                      basePath={`/friends/${friend.slug}/avatar`}
                      kind="avatar"
                      className="fp-fav-avatar-img"
                      alt=""
                    />
                  ) : (
                    friend.avatarInitial
                  )}
                </span>
                <span className="fp-fav-name">{friend.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="fp-toolbar">
          <span className="fp-toolbar-title">Amigos</span>
          <div className="fp-toolbar-actions">
            <button className="fp-icon-btn" aria-label="Buscar amigos">
              <SearchIcon className="fp-icon-btn-svg" />
            </button>
            <button className="fp-icon-btn" aria-label="Añadir amigo">
              <PlusIcon className="fp-icon-btn-svg" />
            </button>
          </div>
        </div>

        <div className="fp-list">
          <div className="fp-section">
            <h3 className="fp-section-title">
              Amigos en línea <span className="fp-section-count">({onlineFriends.length})</span>
            </h3>

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
          </div>

          {offlineFriends.length > 0 && (
            <div className="fp-section">
              <h3 className="fp-section-title">
                Desconectados <span className="fp-section-count">({offlineFriends.length})</span>
                <button className="fp-section-action" aria-label="Ordenar desconectados">
                  <FilterIcon className="fp-icon-btn-svg" />
                </button>
              </h3>
              {offlineFriends.map((friend) => renderRow(friend))}
            </div>
          )}
        </div>

        <footer className="fp-groups">
          <div className="fp-groups-head">
            <span className="fp-groups-title-row">
              <ChevronDownIcon className="fp-groups-chevron" />
              Chats de grupo
            </span>
            <button className="fp-icon-btn" aria-label="Nuevo chat de grupo">
              <PlusIcon className="fp-icon-btn-svg" />
            </button>
          </div>
          <div className="fp-groups-body">
            <input
              className="fp-groups-input"
              type="text"
              placeholder="Los chats de grupo en los que participes aparecerán aquí."
              readOnly
              aria-label="Buscar chat de grupo"
            />
            <p className="fp-groups-text">
              Puedes iniciar un chat con <span className="fp-groups-link">amigos</span> o unirte al chat de un{' '}
              <span className="fp-groups-link">grupo de Steam</span>.
            </p>
            <ResizeIcon className="fp-resize" />
          </div>
        </footer>
        </section>
      </div>
    </>
  );
};
