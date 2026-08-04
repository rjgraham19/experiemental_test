import { useEffect, useRef } from "react";

/**
 * A video that behaves like an animated visual rather than a player:
 * no controls, muted, looping, and it starts itself once scrolled into
 * view (and pauses again when it leaves, so offscreen videos aren't
 * burning CPU on long pages).
 *
 * Muted playback is what makes programmatic play() permissible without a
 * user gesture under browser autoplay policies; the promise is still
 * guarded since a browser may refuse regardless.
 */
export function InViewVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* autoplay refused — leave it on its first frame */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
