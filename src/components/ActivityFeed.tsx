import type { ReactNode } from 'react';
import type { ActivityItem, ActivityKind } from '../data/projects.tsx';
import { CameraIcon, FriendsIcon, PlayIcon, TrophyIcon } from './Icons';

interface ActivityFeedProps {
  items: ActivityItem[];
  username: string;
}

const KIND_META: Record<ActivityKind, { className: string; children: ReactNode }> = {
  achievement: { className: 'achievement', children: <TrophyIcon /> },
  play: { className: 'play', children: <PlayIcon /> },
  screenshot: { className: 'screenshot', children: <CameraIcon /> },
  friend: { className: 'friend', children: <FriendsIcon /> },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, username }) => {
  return (
    <section className="activity-section" aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="section-title">ACTIVIDAD</h2>
      <div className="activity-list" role="list">
        {items.length === 0 ? (
          <p className="activity-empty">—</p>
        ) : (
          items.map((item) => {
            const meta = KIND_META[item.kind];
            const text =
              item.kind === 'friend'
                ? item.text
                : `${username} ${item.text}`;
            return (
              <div className="activity-item" role="listitem" key={item.id}>
                <span className={`activity-icon ${meta.className}`} aria-hidden="true">
                  {meta.children}
                </span>
                <div className="activity-body">
                  <p className="activity-text">{text}</p>
                  <p className="activity-date">{item.date}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};