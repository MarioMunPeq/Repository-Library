import { PlayIcon } from './Icons';

export interface ProjectHeaderData {
  name: string;
  bannerColor: string;
  bannerImage?: string;
  url: string;
}

interface ProjectHeaderProps {
  data: ProjectHeaderData;
}

function shade(hex: string, amt: number): string {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ data }) => {
  const { name, bannerColor, bannerImage, url } = data;
  const artGradient = `linear-gradient(135deg, ${shade(bannerColor, 40)} 0%, ${bannerColor} 45%, ${shade(bannerColor, -70)} 100%)`;

  return (
    <header className="game-header" style={{ backgroundColor: bannerColor }}>
      <div
        className="game-header-art"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : { backgroundImage: artGradient }}
      />
      <div className="game-header-vignette" />
      <div className="game-header-content">
        <h1 className="game-title">{name}</h1>
        <a className="play-btn" href={url} target="_blank" rel="noopener noreferrer" role="button">
          <PlayIcon className="play-btn-icon" />
          <span>JUGAR</span>
        </a>
      </div>
    </header>
  );
};