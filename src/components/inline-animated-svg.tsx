import { useEffect, useRef } from "react";

/**
 * Fetches an SVG file and injects its markup directly into the page DOM
 * (not via <object>/<img>), so any embedded scripts run in the same
 * document as the rest of the page. innerHTML doesn't execute <script>
 * tags on its own, so any scripts found after injecting are manually
 * recreated and re-inserted to force the browser to actually run them.
 *
 * No custom trigger/playback logic — whatever the file itself is
 * configured to do (e.g. autoplay on load) just happens on its own.
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

        const scripts = container.querySelectorAll("script");
        scripts.forEach((oldScript) => {
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
