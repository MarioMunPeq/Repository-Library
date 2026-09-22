import { useMemo } from 'react';
import { projects } from '../data/projects.tsx';
import type { ProjectUpdate } from '../data/projects.tsx';
import { GitHubIcon, LinkedInIcon } from './Icons';
import './ProjectStorePage.css';
import './ComunidadPage.css';

interface FeedEntry {
  projectName: string;
  fallbackGradient: string;
  update: ProjectUpdate;
}

const MONTH_ABBREVIATIONS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function daysAgo(date: string, now: Date = new Date()): number {
  const text = date.trim().toLowerCase();
  if (text === 'ahora' || text === 'hoy') return 0;
  if (text === 'ayer') return 1;

  const relative = text.match(/^hace\s+(\d+)\s+([a-zA-Z]+)/);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2];
    if (unit.startsWith('min') || unit.startsWith('h')) return 0;
    if (unit.startsWith('d')) return amount;
    if (unit.startsWith('sem') || unit.startsWith('s')) return amount * 7;
    if (unit.startsWith('mes') || unit.startsWith('m')) return amount * 30;
    if (unit.startsWith('a')) return amount * 365;
    return amount;
  }

  const absolute = text.match(/^(\d{1,2})\s+([a-z]+)/);
  if (absolute) {
    const day = Number(absolute[1]);
    const monthName = absolute[2];
    const monthIndex = MONTH_ABBREVIATIONS.findIndex(
      (month) => month.startsWith(monthName) || monthName.startsWith(month),
    );
    if (monthIndex >= 0) {
      const currentYear = now.getFullYear();
      let year = currentYear;
      if (new Date(year, monthIndex, day).getTime() > now.getTime()) {
        year -= 1;
      }
      const diffMs = now.getTime() - new Date(year, monthIndex, day).getTime();
      return Math.max(0, Math.floor(diffMs / 86_400_000));
    }
  }

  return Number.MAX_SAFE_INTEGER;
}

export const ComunidadPage: React.FC = () => {
  const feed = useMemo(() => {
    const entries: FeedEntry[] = [];
    for (const project of projects) {
      if (project.status === 'proximamente') continue;
      for (const update of project.updates) {
        entries.push({ projectName: project.name, fallbackGradient: project.fallbackGradient, update });
      }
    }
    return entries.sort((a, b) => daysAgo(a.update.date) - daysAgo(b.update.date));
  }, []);

  return (
    <main className="community-page" role="main" aria-label="Comunidad">
      <aside className="community-side">
        <section className="community-panel">
          <h2 className="community-panel-title">Sobre mí</h2>
          <a
            className="community-social-row"
            href="https://github.com/tu-usuario"
            target="_blank"
            rel="noreferrer"
          >
            <span className="community-social-icon github">
              <GitHubIcon />
            </span>
            <span className="community-social-text">GitHub</span>
          </a>
          <a
            className="community-social-row"
            href="https://www.linkedin.com/in/tu-usuario"
            target="_blank"
            rel="noreferrer"
          >
            <span className="community-social-icon linkedin">
              <LinkedInIcon />
            </span>
            <span className="community-social-text">LinkedIn</span>
          </a>
        </section>
      </aside>

      <section className="community-feed">
        <h2 className="community-feed-title">Actividad reciente</h2>
        <div className="community-feed-list">
          {feed.map((entry) => (
            <article className="store-update" key={`${entry.projectName}-${entry.update.date}-${entry.update.title}`}>
              <div className="community-update-meta">
                <span className="store-update-date">{entry.update.date}</span>
                <span className="community-chip" style={{ background: entry.fallbackGradient }}>
                  {entry.projectName}
                </span>
              </div>
              <div className="store-update-card">
                <h3 className="store-update-title">{entry.update.title}</h3>
                <p className="store-update-body">{entry.update.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};