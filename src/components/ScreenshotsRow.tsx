import { useRef } from 'react';
import type { Project } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ScreenshotsRowProps {
  project: Project;
}

export const ScreenshotsRow: React.FC<ScreenshotsRowProps> = ({ project }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 'left' | 'right') => {
    const strip = stripRef.current;
    if (!strip) return;
    const amount = Math.min(420, Math.max(160, strip.clientWidth * 0.6));
    strip.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="screenshots-section" aria-labelledby="screenshots-heading">
      <h2 id="screenshots-heading" className="section-title">CAPTURAS DE PANTALLA</h2>
      <div className="screenshots-viewport">
        <button
          className="shot-arrow shot-arrow-left"
          onClick={() => scrollBy('left')}
          aria-label="Anteriores capturas"
        >
          <ChevronLeftIcon />
        </button>
        <div className="screenshots-strip" ref={stripRef} role="list" aria-label="Capturas de pantalla">
          {project.screenshots.length === 0 ? (
            <p className="screenshots-empty">—</p>
          ) : (
            project.screenshots.map((file) => (
              <div className="screenshot-tile" role="listitem" key={file}>
                <div className="screenshot-thumb" style={{ backgroundImage: project.fallbackGradient }}>
                  <SmartImage
                    basePath={`/projects/${project.slug}/screenshots/${file}`}
                    kind="screenshots"
                    alt=""
                    fallback={<span className="gradient-fallback" />}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <button
          className="shot-arrow shot-arrow-right"
          onClick={() => scrollBy('right')}
          aria-label="Siguientes capturas"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
};
