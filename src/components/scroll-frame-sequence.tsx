import { useEffect, useRef, useState } from "react";

/**
 * A PNG/WebP frame sequence scrubbed by scroll position: scrolling down
 * advances the frames, scrolling back up runs them in reverse, so the
 * subject reads as spinning under the reader's control.
 *
 * Frames are drawn to a canvas rather than swapped on an <img>, which
 * avoids the flash that src-swapping causes, and are all preloaded first
 * so scrubbing never lands on a frame that hasn't arrived yet.
 *
 * The scroll position is read on a continuous requestAnimationFrame loop
 * rather than from scroll events, because Lenis's smoothing means scroll
 * events don't fire at a steady rate.
 */
export function ScrollFrameSequence({
  frames,
  className,
  alt,
}: {
  frames: string[];
  className?: string;
  alt?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  // Preload every frame before allowing scrubbing.
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const imgs = frames.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === frames.length && !cancelled) setReady(true);
      };
      return img;
    });
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [frames]);

  useEffect(() => {
    if (!ready) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastFrame = -1;

    const sizeCanvas = () => {
      const first = imagesRef.current[0];
      if (!first?.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastFrame = -1; // force a redraw at the new size
    };

    const draw = (index: number) => {
      const img = imagesRef.current[index];
      if (!img?.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // contain the frame within the canvas, preserving aspect ratio
      const scale = Math.min(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight,
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const tick = () => {
      const rect = wrapper.getBoundingClientRect();
      // Progress starts the moment the section's top edge appears at the
      // bottom of the viewport, and completes as the sticky frame releases —
      // so the sequence is already turning while the section scrolls into
      // place, rather than waiting until it's aligned with the viewport top.
      const travel = rect.height;
      const progress =
        travel <= 0
          ? 0
          : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));

      const index = Math.min(
        frames.length - 1,
        Math.max(0, Math.round(progress * (frames.length - 1))),
      );
      if (index !== lastFrame) {
        lastFrame = index;
        draw(index);
      }
      raf = requestAnimationFrame(tick);
    };

    sizeCanvas();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", sizeCanvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [ready, frames]);

  return (
    <div ref={wrapperRef} className={className}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className="h-[80vh] w-auto max-w-full"
        />
      </div>
    </div>
  );
}
