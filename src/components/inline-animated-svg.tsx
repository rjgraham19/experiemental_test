import { useEffect, useRef } from "react";

/**
 * Embeds an SVGator-exported SVG that carries its own <script>.
 *
 * The markup is fetched and injected into the real page DOM — not via
 * <img>, <object>, or background-image, all of which drop or sandbox the
 * script. innerHTML alone won't execute <script> tags, so each one is
 * recreated after injection to force the browser to run it.
 *
 * No playback/trigger code here on purpose: this SVG is exported with
 * its own "on scroll into view" trigger and handles starting itself.
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
    const container = containerRef.current;
    if (!container) return;

    fetch(src)
      .then((res) => res.text())
      .then((markup) => {
        if (cancelled || !container) return;
        container.innerHTML = markup;

        // innerHTML doesn't run scripts — recreate them so they execute.
        container.querySelectorAll("script").forEach((oldScript) => {
          const newScript = document.createElement("script");
          for (const attr of Array.from(oldScript.attributes)) {
            newScript.setAttribute(attr.name, attr.value);
          }
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return <div ref={containerRef} className={className} />;
}
