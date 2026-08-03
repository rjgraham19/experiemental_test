import { Fragment, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Word-by-word reveal driven by scroll: the line sits dimmed and each word
 * resolves to full strength as it passes through the viewport.
 *
 * Dimming is done with opacity rather than a fixed grey, so the effect reads
 * correctly against both the site's black background and the white region on
 * the TaB page without needing to know which it's on.
 *
 * Words are split on whitespace and each is inline-block. Only whole words
 * become inline-block — never individual letters — otherwise the browser
 * treats every letter as a line-break opportunity and breaks mid-word.
 */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // Floors at 0.35 rather than near-invisible: close to the muted grey of the
  // reference, and it means the line stays legible even if scroll progress
  // never updates for some reason, instead of failing to unreadable.
  const opacity = useTransform(progress, range, [0.35, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

export function ScrollRevealText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "blockquote";
}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // starts as the block's top enters from the bottom of the viewport,
    // completes once its bottom reaches the middle of the screen
    offset: ["start end", "end center"],
  });

  // Spring-smoothed so the reveal glides rather than tracking scroll exactly.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const words = text.split(" ");

  // Readers who've asked for reduced motion get the line at full strength,
  // rather than a dimmed line that only resolves if they scroll.
  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Fragment key={i}>
            <Word progress={progress} range={[start, end]}>
              {word}
            </Word>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
