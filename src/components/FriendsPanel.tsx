import { useEffect, useMemo, useRef, useState } from 'react';
import { currentUser as defaultCurrentUser, friends as defaultFriends } from '../data/friends';
import type { CurrentUser, Friend, FriendStatus } from '../data/friends';
import { devProfile } from '../data/devProfile';
import { gameOf } from '../data/games';
import type { FriendGame } from '../data/games';
import { SmartImage } from './SmartImage';
import {
  AddFriendIcon,
  ChevronDownIcon,
  CloseIcon,
  FilterIcon,
  GroupChatIcon,
  MinimizeIcon,
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

/** El icono que descarga `npm run steam:games` es un jpg; el png queda como
 *  red de seguridad por si se regenera en otro formato. */
const GAME_ICON_EXTENSIONS = ['jpg', 'png'] as const;

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
  /** "Chats de grupo" arranca plegado, como en el cliente. */
  const [groupsOpen, setGroupsOpen] = useState(false);
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

  /** Un grupo por cada juego que alguien está jugando, con su icono y su
   *  ficha en la tienda, como el bloque de "Counter-Strike 2" del cliente. */
  const activityGroups = useMemo(() => {
    const groups: { game: FriendGame; friends: Friend[] }[] = [];
    const seen = new Set<string>();
    for (const friend of onlineFriends) {
      const game = gameOf(friend.game);
      if (game && !seen.has(game.id)) {
        seen.add(game.id);
        groups.push({ game, friends: onlineFriends.filter((item) => item.game === game.id) });
      }
    }
    return groups;
  }, [onlineFriends]);

  /** Los que están en línea pero no jugando a nada: los que no sacan su
   *  nombre de la fila y se quedan solo con el "Conectado" de subtítulo. */
  const ungroupedOnline = useMemo(
    () => onlineFriends.filter((friend) => !friend.game),
    [onlineFriends],
  );

  if (!open) return null;

  const renderRow = (friend: Friend, indented = false) => {
    const offline = isOfflineStatus(friend.status);
    const game = gameOf(friend.game);
    const playing = Boolean(game);
    const rowClassName = `fp-row ${indented ? 'indented' : ''} ${indented ? 'rich' : ''}`;
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
          {/* En línea el subtítulo es el juego (o "Conectado" si no juega a
              nada); desconectado, la última conexión. */}
          <span className={`fp-subtitle ${offline ? 'offline' : ''}`}>
            {offline ? `Última conexión: ${friend.lastSeen ?? 'hace un tiempo'}` : game?.name ?? 'Conectado'}
          </span>
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
            {favorites.map((friend) => {
              const content = (
                <>
                  <span
                    className={`fp-fav-avatar ${ringClass(friend.status, Boolean(friend.game))}`}
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
                </>
              );
              const title = `${friend.name} · ${gameOf(friend.game)?.name ?? 'Conectado'}`;
              // Igual que las filas de la lista, el favorito abre su GitHub.
              if (friend.githubUrl) {
                return (
                  <a
                    key={friend.id}
                    className="fp-fav"
                    href={friend.githubUrl}
                    target="_blank"
                    rel="noopener"
                    title={title}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <button key={friend.id} className="fp-fav" title={title}>
                  {content}
                </button>
              );
            })}
          </div>
        )}

        <div className="fp-toolbar">
          <span className="fp-toolbar-title">Amigos</span>
          <div className="fp-toolbar-actions">
            <button className="fp-icon-btn" aria-label="Buscar amigos">
              <SearchIcon className="fp-icon-btn-svg" />
            </button>
            <button className="fp-icon-btn" aria-label="Añadir amigo">
              <AddFriendIcon className="fp-icon-btn-svg" />
            </button>
          </div>
        </div>

        <div className="fp-list">
          <div className="fp-section">
            {activityGroups.length > 0 && (
              <>
                {activityGroups.map(({ game, friends: groupFriends }) => (
                  <div key={game.id} className="fp-activity">
                    {/* El encabezado lleva el icono del juego y abre su ficha. */}
                    <a
                      className="fp-group"
                      href={game.storeUrl}
                      target="_blank"
                      rel="noopener"
                      title={game.name}
                    >
                      <SmartImage
                        basePath={`/games/${game.id}/icon`}
                        kind="icon"
                        extensions={GAME_ICON_EXTENSIONS}
                        className="fp-group-icon-img"
                        fallback={<GroupChatIcon className="fp-group-icon" />}
                      />
                      <span className="fp-group-name">{game.name}</span>
                    </a>
                    {groupFriends.map((friend) => renderRow(friend, true))}
                  </div>
                ))}
                <hr className="fp-divider" />
              </>
            )}

            {/* El contador solo mira a los que no están bajo un juego: los
                agrupados ya se cuentan en su propio bloque, como en el cliente. */}
            <h3 className="fp-section-title">
              Amigos en línea <span className="fp-section-count">({ungroupedOnline.length})</span>
            </h3>

            {ungroupedOnline.map((friend) => renderRow(friend))}

            {/* Solo cuando no hay nadie en línea: si todos están jugando a algo
                ya aparecen arriba, bajo su juego. */}
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

        {/* El cliente pinta esta barra plegada por defecto: el cuerpo solo se
            abre al pulsarla. */}
        <footer className={`fp-groups${groupsOpen ? ' open' : ''}`}>
          <button
            className="fp-groups-head"
            type="button"
            aria-expanded={groupsOpen}
            onClick={() => setGroupsOpen((value) => !value)}
          >
            <span className="fp-groups-title-row">
              <ChevronDownIcon className="fp-groups-chevron" />
              Chats de grupo
            </span>
            <span className="fp-icon-btn" aria-hidden="true">
              <GroupChatIcon className="fp-icon-btn-svg" />
            </span>
          </button>
          {groupsOpen && (
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
          )}
        </footer>
        </section>
      </div>
    </>
  );
};
