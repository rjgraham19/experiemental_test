import { Link } from "@tanstack/react-router";
import type { Project } from "@/lib/projects";

/**
 * Square grid thumbnail, shared by the unified /work feed and the
 * Visualizations hub page so the two can't drift apart.
 *
 * Deliberately minimal: highlight image + project title only. No index
 * number, no subtitle, no hover-collage pop-out, no "Enter" affordance —
 * the tile itself is the affordance.
 */
export function ProjectTile({ project }: { project: Project }) {
  return (
    <li className="relative">
      <Link
        to="/work/$hub/$slug"
        params={{ hub: project.hub, slug: project.slug }}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        aria-label={`Open ${project.title}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-md bg-black">
          <img
            src={project.highlight ?? project.cover}
            alt={project.title}
            loading="lazy"
            style={{ objectPosition: project.highlightPosition ?? "50% 50%" }}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-[900ms] ease-cinematic"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-95 group-hover:opacity-85 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display font-medium uppercase tracking-tight text-xl md:text-2xl lg:text-3xl leading-[0.95] text-balance text-foreground group-hover:text-accent transition-colors line-clamp-3">
              {project.title}
            </h2>
          </div>
        </div>
      </Link>
    </li>
  );
}
