import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Opens a project as an inset panel over the feed, rather than as a full page.
 * LAB ONLY.
 *
 * The project renders in an iframe, and that is the whole trick. Three of the
 * project pages are built on scroll animations that measure the browser
 * window — the TaB can sequence and the Lollapalooza record scrub each read
 * window.innerHeight, and both use h-screen frames inside a 300–400vh runway.
 * In an ordinary modal those would still measure the window rather than the
 * panel, so the sections would overflow their container and the scroll maths
 * driving the animations would track against the wrong height.
 *
 * Giving the panel its own document makes its window the panel: 100vh,
 * h-screen and innerHeight all resolve to the panel's own size, so every
 * project page keeps working exactly as it does today with no changes to any
 * of them. Which is the requirement — same pages, smaller frame.
 *
 * The address bar is kept in step with history.pushState so back closes the
 * panel and the link stays shareable, while a direct visit to the same URL
 * still renders the full page as before.
 */
export function ProjectModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  // Close on Escape. Captured on the parent document; the iframe gets its own
  // listener once it loads, since key events inside it don't bubble out here.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Hold the feed still behind the panel, and put focus back where it was.
  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      (returnFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  const onFrameLoad = useCallback(
    (e: React.SyntheticEvent<HTMLIFrameElement>) => {
      // Same-origin, so Escape can be wired up inside the panel too. Guarded
      // anyway: if the document ever isn't reachable, the outer listener and
      // the backdrop still close it.
      try {
        const doc = e.currentTarget.contentDocument;
        doc?.addEventListener("keydown", (ev) => {
          if ((ev as KeyboardEvent).key === "Escape") onClose();
        });
      } catch {
        /* cross-origin — outer close paths still work */
      }
    },
    [onClose],
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* The feed stays visible and blurred behind, so it reads as a layer
          over the page rather than a new page. Clicking it closes. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        className="absolute inset-0 h-full w-full cursor-zoom-out bg-black/55 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-x-[3vw] inset-y-[4vh] overflow-hidden rounded-lg bg-background shadow-[0_30px_90px_rgba(0,0,0,0.7)] outline-none md:inset-x-[5vw]"
      >
        <iframe
          src={url}
          title={title}
          onLoad={onFrameLoad}
          className="h-full w-full border-0"
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        className="pill absolute right-[3vw] top-[calc(4vh-2.6rem)] z-10 md:right-[5vw]"
      >
        Close ✕
      </button>
    </div>,
    document.body,
  );
}
