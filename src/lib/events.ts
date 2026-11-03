// Petits événements de page entre sections (sans état global) :
// - rn:filter : une autre section demande d'afficher les projets d'un besoin ;
// - rn:launch : une autre section demande d'ouvrir la présentation de 60 s d'un projet.
import type { Tag } from "@/data/projects";

export const showProjects = (tag: Tag) => window.dispatchEvent(new CustomEvent("rn:filter", { detail: tag }));
export const launchPresentation = (slug: string) => window.dispatchEvent(new CustomEvent("rn:launch", { detail: slug }));
