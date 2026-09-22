import type { Project } from '../data/projects.tsx';
import { SmartImage } from './SmartImage';
import './ProjectLogo.css';

interface ProjectLogoProps {
  project: Project;
}

/**
 * Logo del proyecto superpuesto al hero. Intenta cargar `logoPath`;
 * si la imagen no existe, renderiza el título en texto (respaldo).
 */
export const ProjectLogo: React.FC<ProjectLogoProps> = ({ project }) => (
  <SmartImage
    basePath={project.logoPath}
    kind="logo"
    className="project-logo-img"
    alt=""
    fallback={<span className="project-logo-fallback">{project.name}</span>}
  />
);