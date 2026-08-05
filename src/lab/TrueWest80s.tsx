import { Link } from "@tanstack/react-router";
import { projectBySlug, type Credit, type MediaItem } from "@/lib/projects";
import "./true-west-80s.css";

/**
 * True West, skinned as vintage appliance advertising. LAB ONLY.
 *
 * This is a *skin*, not a redesign: the photo and text layout mirrors the
 * real page in work.$hub.$slug.tsx beat for beat —
 *
 *   sticky title over the full-bleed hero
 *   → description (8 cols) beside credits (4 cols)
 *   → pull quote
 *   → 55/45 band: second act left, two model studies stacked right
 *   → both duality lines beneath, on a narrow measure
 *   → plan comparison, full width, contained
 *
 * Only the treatment changes — Caprasimo headlines, Libre Baskerville copy,
 * gold-framed halftone photographs on black. An earlier version restructured
 * the page into an ad pastiche; Reid wants the layout he already has, wearing
 * a different aesthetic, which is also the sharper test of the skin idea.
 *
 * Content comes from projects.ts, so there's one copy of it.
 */
export function TrueWest80s() {
  const project = projectBySlug("true-west");
  if (!project) return <p className="p-10">True West not found in projects.ts</p>;

  const [cover, second, render1, render2, diagram] = project.media as MediaItem[];
  const [westLine, suburbLine] = project.dualityLines ?? ["", ""];

  return (
    <article className="tw80 min-h-screen pb-10">
      {/* Hero — title over the cover image, as on the real page. */}
      <header className="relative grid grid-cols-1 grid-rows-1">
        <div className="col-start-1 row-start-1 z-10 self-start px-5 pt-8 md:px-10 md:pt-12">
          <p className="tw80-label">{project.subtitle}</p>
          <h1 className="tw80-headline tw80-headline-left mt-3">{project.title}</h1>
        </div>

        <figure className="col-start-1 row-start-1 tw80-frame">
          <img src={cover.src} alt={cover.caption ?? project.title} />
        </figure>
      </header>

      {/* Description beside credits — the real page's 8/4 split. */}
      <section className="grid grid-cols-1 gap-6 px-5 py-7 md:grid-cols-12 md:gap-8 md:px-10 md:py-9">
        <div className="md:col-span-8">
          <p className="tw80-copy-lead">{project.description}</p>
        </div>
        <dl className="md:col-span-4">
          {project.credits?.map((c: Credit) => (
            <div key={c.role} className="mb-3">
              <dt className="tw80-label">{c.role}</dt>
              <dd className="m-0 mt-1">{c.name}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Pull quote — the page's oversized statement. */}
      {project.pullQuote && (
        <section className="px-5 py-6 md:px-10 md:py-8">
          <blockquote className="tw80-headline tw80-headline-left max-w-4xl">
            {project.pullQuote}
          </blockquote>
        </section>
      )}

      {/* Dual-world band: 55/45, second act left at full height, the two
          model studies stacked right — matching the real page exactly. */}
      <section className="px-5 py-6 md:px-10 md:py-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[55fr_45fr] md:gap-4">
          <figure className="tw80-frame h-full">
            <img
              src={second.src}
              alt={second.caption ?? project.title}
              className="h-full w-full object-cover"
            />
          </figure>

          <div className="flex flex-col gap-3 md:gap-4">
            {[render1, render2].map((m) => (
              <figure key={m.src} className="tw80-frame">
                <img src={m.src} alt={m.caption ?? project.title} />
              </figure>
            ))}
          </div>
        </div>

        {/* Both duality lines beneath the band, on a narrow measure. */}
        <div className="mt-7 max-w-3xl space-y-2 md:mt-9">
          <p className="tw80-duality">{westLine}</p>
          <p className="tw80-duality">{suburbLine}</p>
        </div>
      </section>

      {/* Plan comparison, full width and contained rather than cropped. */}
      <section className="px-5 py-6 md:px-10 md:py-8">
        <figure className="tw80-frame">
          <img
            src={diagram.src}
            alt={diagram.caption ?? project.title}
            className="w-full object-contain"
          />
        </figure>
        <p className="tw80-caption">{diagram.caption}</p>
      </section>

      {/* Closing lockup, after "GENERAL (GE) ELECTRIC". */}
      <footer className="px-5 md:px-10">
        <hr className="tw80-rule-gold" />
        <p className="tw80-lockup mt-5">
          <span>True</span>
          <span className="tw80-seal">RG</span>
          <span>West</span>
        </p>

        <div
          className="mt-7 flex items-baseline justify-between gap-4 border-t pt-3"
          style={{ borderColor: "#ffffff22" }}
        >
          <span className="tw80-label">Lab experiment · not the live page</span>
          <Link to="/lab" className="tw80-label underline underline-offset-4">
            ← Back to lab
          </Link>
        </div>
      </footer>
    </article>
  );
}
