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
 * The pull quote splits across the two headlines the way the reference splits
 * "The greatest invention since the ice cube" / "is now on the GE Top Freezer
 * Refrigerator." — which is what produces the pitchman cadence.
 */

/**
 * INVENTED COPY — placeholder, for Reid to rewrite or bin.
 *
 * Density is what makes the reference read as a period ad, more than the
 * typefaces do: GE runs roughly two hundred words of dense, enthusiastic,
 * feature-listed copy in narrow columns. One sentence per column reads as a
 * modern layout wearing old fonts, however accurate the type is. So this
 * imitates the voice — second person, short declaratives, a specific number,
 * a closing "another reason" line — using true facts about the production.
 */
const AD_COPY = {
  left: [
    "You don’t even have to leave your seat to watch a house come apart. The kitchen is real — cabinets, counters, a working range — and every night it gives way to open country. And you also get these outstanding features:",
    "Full suburban kitchen, built to be taken apart and reassembled for eight straight performances without a repaint.",
    "Astroturf lawn and synthetic greenery hold their colour under any light cue, so the suburb stays relentlessly green.",
  ],
  right: [
    "Provision for rapid changeover lets the run crew reset the entire floor in about six minutes.",
    "Every surface is backed by the Newman Studio shop — drafted, built, painted and rigged in house — which means that wherever you sit in the house, there is a finished face turned toward you.",
    "The suburban kitchen with the collapsing wall: another reason True West is the most argued-about set on campus.",
  ],
};

export function TrueWest80s() {
  const project = projectBySlug("true-west");
  if (!project) return <p className="p-10">True West not found in projects.ts</p>;

  const [full, second, render1, render2, diagram] = project.media as MediaItem[];

  /* The pull quote, split so it runs across the two headlines. */
  const quote = project.pullQuote ?? "";
  const [headA, headB] = quote.includes(" as ")
    ? [quote.slice(0, quote.indexOf(" as ")), quote.slice(quote.indexOf(" as ") + 1)]
    : [quote, ""];

  const grid: MediaItem[] = [second, render1, render2, diagram];

  return (
    <article className="tw80 min-h-screen px-4 py-6 md:px-8 md:py-8 lg:px-12">
      <p className="tw80-label text-center">Newman Studio · University of Michigan</p>

      <h1 className="tw80-headline mt-3">{headA}</h1>

      {/* Gold-framed grid. Gaps kept tight — the reference's six-up is packed
          almost edge to edge, and loose gutters are what read as modern. */}
      <section className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:gap-2.5 lg:grid-cols-4">
        {grid.map((m, i) => (
          <figure key={m.src} className="tw80-frame">
            <img src={m.src} alt={m.caption ?? `${project.title} view ${i + 1}`} />
          </figure>
        ))}
      </section>

      {/* Both halves stay white, as in the reference — its gold lives in the
          frames and the appliance, never in the headline. */}
      <h2 className="tw80-headline mt-4 md:mt-5">{headB}</h2>

      {/* Copy | photograph | copy — the reference's lower half. */}
      <section className="mt-5 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-[1fr_1.05fr_1fr] md:gap-6">
        <div className="tw80-copy">
          {AD_COPY.left.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <figure className="tw80-frame self-start">
          <img src={full.src} alt={full.caption ?? "Full set"} />
        </figure>

        <div className="tw80-copy">
          {AD_COPY.right.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}

          {/* The boxed badge from the reference's lower-right corner. */}
          <div className="tw80-badge mt-4" style={{ textIndent: 0 }}>
            <p className="tw80-label mb-1.5">Built by</p>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1" style={{ textIndent: 0 }}>
              {project.credits?.map((c: Credit) => (
                <div key={c.role} className="flex items-baseline justify-between gap-3">
                  <dt className="tw80-label" style={{ letterSpacing: "0.12em" }}>
                    {c.role}
                  </dt>
                  <dd className="m-0 text-[0.9rem]">{c.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Small print, the spec line these ads always carried along the foot. */}
      <section className="mt-6 md:mt-7">
        <hr className="tw80-rule-gold" />
        <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((m, i) => (
            <p key={m.src} className="tw80-caption">
              Fig. {i + 1} — {m.caption}
            </p>
          ))}
        </div>
      </section>

      {/* Brand lockup, after "GENERAL (GE) ELECTRIC". */}
      <footer className="mt-7 md:mt-9">
        <hr className="tw80-rule-gold" />
        <p className="tw80-lockup mt-4">
          <span>True</span>
          <span className="tw80-seal">RG</span>
          <span>West</span>
        </p>
        <p className="tw80-label mt-2 text-center">{project.subtitle}</p>

        <div
          className="mt-6 flex items-baseline justify-between gap-4 border-t pt-3"
          style={{ borderColor: "#ffffff22" }}
        >
          <span className="tw80-label">Lab experiment · placeholder ad copy</span>
          <Link to="/lab" className="tw80-label underline underline-offset-4">
            ← Back to lab
          </Link>
        </div>
      </footer>
    </article>
  );
}
