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
  playOnce = false,
}: {
  src: string;
  className?: string;
  /**
   * Run the clip a single time, the first time it's scrolled into view, and
   * then leave it resting on its final frame — so it reads as a still image
   * that animated once, rather than a video on a loop.
   */
  playOnce?: boolean;
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
          // Stop watching after the first play, so scrolling back past it
          // doesn't restart the animation.
          if (playOnce) observer.disconnect();
        } else if (!playOnce) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playOnce]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop={!playOnce}
      playsInline
      // Fully buffered ahead of time for the one-shot case: it gets a single
      // chance to play, so it shouldn't stall partway through.
      preload={playOnce ? "auto" : "metadata"}
      className={className}
    />
  );
}
