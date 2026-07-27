import { useEffect, useRef } from "react";

type SvgatorPlayer = { play: () => void };
type SvgatorRoot = SVGSVGElement & {
  svgatorPlayer?: { ready: (cb: (player: SvgatorPlayer) => void) => void };
};

/**
 * Embeds an SVGator-exported SVG that carries its own <script>.
 *
 * The markup is fetched and injected into the real page DOM — not via
 * <img>, <object>, or background-image. <img> refuses to execute scripts
 * inside an SVG at all, and <object> runs them in an isolated document
 * where scroll detection can't observe the parent page.
 *
 * innerHTML doesn't execute <script> tags, so each one is recreated after
 * injection to force the browser to run it.
 *
 * Playback: this export was configured with an "on scroll into view"
 * trigger, but the emitted file contains no IntersectionObserver and no
 * autoplay flag — so nothing in it appears to actually start playback.
 * An IntersectionObserver here calls play() once the graphic scrolls into
 * view. If the file does turn out to self-start, this is harmless: play()
 * on an already-running animation is a no-op.
 */
export function InlineAnimatedSvg({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const container = containerRef.current;
    if (!container) return;

    fetch(src)
      .then((res) => res.text())
      .then((markup) => {
        if (cancelled || !container) return;
        container.innerHTML = markup;

        container.querySelectorAll("script").forEach((oldScript) => {
          const newScript = document.createElement("script");
          for (const attr of Array.from(oldScript.attributes)) {
            newScript.setAttribute(attr.name, attr.value);
          }
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        const svg = container.querySelector("svg") as SvgatorRoot | null;
        if (!svg) return;

        const play = () => {
          if (cancelled) return;
          if (!svg.svgatorPlayer) {
            // the embedded script may still be initialising
            retry = setTimeout(play, 50);
            return;
          }
          svg.svgatorPlayer.ready((player) => {
            if (!cancelled) player.play();
          });
        };

        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              play();
              observer?.disconnect();
            }
          },
          { threshold: 0.25 },
        );
        observer.observe(svg);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (retry) clearTimeout(retry);
    };
  }, [src]);

  return <div ref={containerRef} className={className} />;
}
