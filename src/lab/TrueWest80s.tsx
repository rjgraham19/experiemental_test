import { Link } from "@tanstack/react-router";
import { projectBySlug, type Credit, type MediaItem } from "@/lib/projects";
import "./true-west-80s.css";

/**
 * True West as a vintage appliance advertisement. LAB ONLY.
 *
 * Structured after Reid's GE Top Freezer reference, beat for beat:
 *
 *   headline (first half of a spoken sentence)
 *   → grid of gold-framed product shots
 *   → headline (second half, completing the sentence)
 *   → three columns: ad copy | hero photograph | ad copy
 *   → boxed badge and a spaced-capitals brand lockup
 *
 * The pull quote splits across the two headlines the way the reference
 * splits "The greatest invention since the ice cube" / "is now on the GE Top
 * Freezer Refrigerator." — which is what produces the pitchman cadence.
 *
 * Content comes from projects.ts, so there's one copy of it and this can't
 * drift out of sync with the real page.
 */

export function TrueWest80s() {
  const project = projectBySlug("true-west");
  if (!project) return <p className="p-10">True West not found in projects.ts</p>;

  const [full, second, render1, render2, diagram] = project.media as MediaItem[];

  /* The flanking columns take the duality pair rather than the description.
     The description's closing sentence is the pull quote word for word, and
     the pull quote is already carrying both headlines — splitting it in here
     as well printed the same line twice on one page. The duality lines are
     the two ideas the description opens with, minus that repetition. */
  const [westLine, suburbLine] = project.dualityLines ?? ["", ""];

  // The pull quote, split so it runs across the two headlines.
  const quote = project.pullQuote ?? "";
  const [headA, headB] = quote.includes(" as ")
    ? [quote.slice(0, quote.indexOf(" as ")), quote.slice(quote.indexOf(" as ") + 1)]
    : [quote, ""];

  const grid: MediaItem[] = [second, render1, render2, diagram];

  return (
    <article className="tw80 min-h-screen px-4 py-8 md:px-10 md:py-12 lg:px-16">
      <p className="tw80-label text-center">Newman Studio · University of Michigan</p>

      <h1 className="tw80-headline mt-4">{headA}</h1>

      {/* Gold-framed grid, after the reference's six-up of product shots. */}
      <section className="mt-7 grid grid-cols-2 gap-3 md:mt-9 md:gap-4 lg:grid-cols-4">
        {grid.map((m, i) => (
          <figure key={m.src} className="tw80-frame">
            <img src={m.src} alt={m.caption ?? `${project.title} view ${i + 1}`} />
          </figure>
        ))}
      </section>

      <h2 className="tw80-headline mt-7 md:mt-9">
        {headB && <span className="tw80-gold">{headB}</span>}
      </h2>

      {/* Copy | photograph | copy — the reference's lower half. */}
      <section className="mt-7 grid grid-cols-1 gap-6 md:mt-9 md:grid-cols-[1fr_1.15fr_1fr] md:gap-7">
        <div className="tw80-copy">
          <p className="tw80-label mb-2" style={{ textIndent: 0 }}>
            The Wild West
          </p>
          <p>{westLine}</p>
        </div>

        <figure className="tw80-frame self-start">
          <img src={full.src} alt={full.caption ?? "Full set"} />
        </figure>

        <div className="tw80-copy">
          <p className="tw80-label mb-2" style={{ textIndent: 0 }}>
            Suburbia
          </p>
          <p>{suburbLine}</p>

          {/* The badge that sat in the reference's lower-right corner. */}
          <div className="tw80-badge mt-5" style={{ textIndent: 0 }}>
            <p className="tw80-label mb-2">Built by</p>
            <dl className="space-y-1.5" style={{ textIndent: 0 }}>
              {project.credits?.map((c: Credit) => (
                <div key={c.role}>
                  <dt className="tw80-label" style={{ letterSpacing: "0.14em" }}>
                    {c.role}
                  </dt>
                  <dd className="m-0 text-[0.95rem]">{c.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Plate list, set as the small-print spec line these ads carried. */}
      <section className="mt-8 md:mt-10">
        <hr className="tw80-rule-gold" />
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((m, i) => (
            <p key={m.src} className="tw80-caption">
              Fig. {i + 1} — {m.caption}
            </p>
          ))}
        </div>
      </section>

      {/* Brand lockup, after "GENERAL (GE) ELECTRIC". */}
      <footer className="mt-10 md:mt-14">
        <hr className="tw80-rule-gold" />
        <p className="tw80-lockup mt-6">
          <span>True</span>
          <span className="tw80-seal">RG</span>
          <span>West</span>
        </p>
        <p className="tw80-label mt-3 text-center">{project.subtitle}</p>

        <div
          className="mt-8 flex items-baseline justify-between gap-4 border-t pt-4"
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
