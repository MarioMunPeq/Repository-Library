import { useState } from 'react';
import { AddIcon, ChatIcon, DownloadIcon, FriendsIcon, ResizeIcon } from './Icons';
import { AddProductModal } from './AddProductModal';

interface FooterProps {
  friendsOpen: boolean;
  onToggleFriends: () => void;
}

export const Footer: React.FC<FooterProps> = ({ friendsOpen, onToggleFriends }) => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <footer className="footer">
      <button className="footer-add" type="button" onClick={() => setAddOpen(true)}>
        <AddIcon className="footer-add-icon" />
        <span>Añadir un producto</span>
      </button>

      <div className="footer-status">
        <DownloadIcon className="footer-status-icon" />
        <span>Gestionar descargas</span>
      </div>

      <div className="footer-right">
        <button
          className={`footer-friends ${friendsOpen ? 'active' : ''}`}
          onClick={onToggleFriends}
          aria-expanded={friendsOpen}
          aria-controls="friends-panel"
        >
          <FriendsIcon className="footer-friends-icon" />
          <ChatIcon className="footer-friends-icon" />
          <span>Amigos y chat</span>
        </button>

        <span className="footer-resize" aria-hidden="true">
          <ResizeIcon className="footer-resize-icon" />
        </span>
      </div>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />
    </footer>
  );
};