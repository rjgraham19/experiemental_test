import { Link } from "@tanstack/react-router";
import { projectBySlug, type Credit, type MediaItem } from "@/lib/projects";
import "./true-west-80s.css";

/**
 * True West as a 1980s shelter magazine. LAB ONLY.
 *
 * Reuses the real project's data and photographs from src/lib/projects.ts —
 * only the presentation is invented here, so there's one copy of the content
 * and the experiment can't drift out of sync with the real page.
 *
 * The point being tested: whether a project page can abandon the site's black
 * minimalism completely — type, colour, texture, layout — and still feel like
 * the same portfolio. Everything is scoped to .tw80.
 */
export function TrueWest80s() {
  const project = projectBySlug("true-west");
  if (!project) return <p className="p-10">True West not found in projects.ts</p>;

  const [full, second, render1, render2, diagram] = project.media as MediaItem[];
  const [westLine, suburbLine] = project.dualityLines ?? ["", ""];

  return (
    <article className="tw80 min-h-screen px-5 py-8 md:px-12 md:py-14 lg:px-20">
      {/* Masthead — an issue line and a folio, the furniture that tells you
          you're holding a magazine before you've read a word. */}
      <header className="tw80-masthead">
        <div className="flex items-baseline justify-between gap-4">
          <p className="tw80-kicker">Newman Studio · Ann Arbor</p>
          <p className="tw80-kicker">No. 04 · Scenic</p>
        </div>

        <h1 className="tw80-headline mt-5 uppercase">True West</h1>

        <div className="mt-5 flex flex-col gap-4 pb-1 md:flex-row md:items-end md:justify-between">
          <p className="tw80-deck">{project.pullQuote}</p>
          <p className="tw80-label shrink-0">{project.subtitle}</p>
        </div>
      </header>

      {/* Opening plate, full measure. */}
      <figure className="tw80-figure mt-8 md:mt-12">
        <img src={full.src} alt={full.caption ?? "True West set"} />
        <figcaption>
          <b>Plate I</b>
          {full.caption}
        </figcaption>
      </figure>

      {/* Feature text, set in columns with a drop cap. */}
      <section className="tw80-cols mt-10 md:mt-14">
        <p className="tw80-dropcap">{project.description}</p>
      </section>

      {/* The duality, given facing panels — the argument of the design set as
          a spread rather than described in a caption. */}
      <section className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2">
        <div className="tw80-panel tw80-panel-west">
          <p className="tw80-label mb-3">The Wild West</p>
          <p>{westLine}</p>
        </div>
        <div className="tw80-panel tw80-panel-suburb">
          <p className="tw80-label mb-3">Suburbia</p>
          <p>{suburbLine}</p>
        </div>
      </section>

      <hr className="tw80-rule-double mt-12 md:mt-16" />

      {/* Second act, given the weight of a turned page. */}
      <figure className="tw80-figure mt-8 md:mt-12">
        <img src={second.src} alt={second.caption ?? "Second act"} />
        <figcaption>
          <b>Plate II</b>
          {second.caption}
        </figcaption>
      </figure>

      <blockquote className="tw80-pull mx-auto mt-12 max-w-3xl md:mt-16">
        “{project.pullQuote}”
      </blockquote>

      {/* Studies, paired the way a magazine runs supporting art. */}
      <section className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2">
        {[render1, render2].map((m, i) => (
          <figure key={m.src} className="tw80-figure">
            <img src={m.src} alt={m.caption ?? "Model study"} />
            <figcaption>
              <b>Fig. {i + 1}</b>
              {m.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      <figure className="tw80-figure mt-8 md:mt-12">
        <img src={diagram.src} alt={diagram.caption ?? "Plan comparison"} />
        <figcaption>
          <b>Plan</b>
          {diagram.caption}
        </figcaption>
      </figure>

      {/* Credits as a masthead block, which is where a magazine would put
          them — not as a list appended to the end of a web page. */}
      <footer className="mt-14 md:mt-20">
        <hr className="tw80-rule-double" />
        <dl className="tw80-credits mt-6 grid grid-cols-1 gap-x-10 sm:grid-cols-2 md:grid-cols-3">
          {project.credits?.map((c: Credit) => (
            <div key={c.role}>
              <dt>{c.role}</dt>
              <dd>{c.name}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-baseline justify-between gap-4 border-t pt-4" style={{ borderColor: "var(--rule)" }}>
          <p className="tw80-label">Lab experiment · not the live page</p>
          <Link to="/lab" className="tw80-label underline underline-offset-4">
            ← Back to lab
          </Link>
        </div>
      </footer>
    </article>
  );
}
