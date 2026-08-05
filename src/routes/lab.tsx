import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * The lab — a scratch page that only exists on the `lab` branch.
 *
 * Ground rules, so experiments stay disposable:
 *
 *  • Nothing here is ever merged wholesale. If an experiment works, the good
 *    part gets lifted onto main deliberately, on its own.
 *
 *  • When an experiment needs to change something shared — the nav, the pill
 *    styles, the project page template — copy it into src/lab/ and change the
 *    copy. Editing the original makes the experiment impossible to unpick
 *    later, which is the one way a lab can damage the real site.
 *
 *  • Anything only this page needs (components, assets, CSS) belongs under
 *    src/lab/, so deleting the branch really does delete all of it.
 *
 * noindex because branch deploys are publicly reachable — this shouldn't
 * turn up in search results alongside the real site.
 */
export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Lab — Reid Graham" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Deliberately not SiteNav: experiments should start from a blank
          canvas rather than inheriting the real site's chrome. Pull pieces in
          only when an experiment actually needs them. */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-accent">
          Lab — experiments only
        </p>
        <Link
          to="/"
          className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 transition-colors hover:text-foreground"
        >
          Real site →
        </Link>
      </header>

      <main className="px-6 md:px-10">
        {/* ── Experiments go below this line ─────────────────────────── */}

        <div className="flex min-h-[70vh] items-center justify-center rounded-md border border-dashed border-border">
          <p className="max-w-sm px-6 text-center text-sm text-foreground/45">
            Empty on purpose. Whatever we try goes here — nothing on this
            branch can reach the real site.
          </p>
        </div>

        {/* ── End experiments ────────────────────────────────────────── */}
      </main>

      <footer className="px-6 py-10 md:px-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30">
          Branch: lab · not indexed · safe to delete
        </p>
      </footer>
    </div>
  );
}
