"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotionPref } from "./KitProvider";

/**
 * Network streams arrive in bursts. This reveals `target` at a steady pace
 * that speeds up with the backlog, so a big chunk never lands as a wall of text
 * and the reveal never falls far behind the stream.
 */
export function useSmoothedText(target: string, enabled: boolean) {
  const [count, setCount] = useState(enabled ? 0 : target.length);
  const targetRef = useRef(target);
  const countRef = useRef(count);

  useLayoutEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();
    let revealed = countRef.current;

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const length = targetRef.current.length;
      if (revealed > length) revealed = 0; // a new stream started
      const backlog = length - revealed;
      if (backlog > 0) {
        const charsPerSecond = Math.max(40, backlog * 3.5);
        revealed = Math.min(length, revealed + charsPerSecond * dt);
      }
      const next = Math.floor(revealed);
      if (next !== countRef.current) {
        countRef.current = next;
        setCount(next);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  return enabled ? target.slice(0, Math.min(count, target.length)) : target;
}

export interface StreamingTextProps {
  /** Everything received so far. Grow it as chunks arrive. */
  text: string;
  /** True once the stream has ended. */
  done: boolean;
  /** Pace bursty chunks into a steady reveal. Defaults to true. */
  smooth?: boolean;
  /** Called once the final character is on screen. */
  onComplete?: () => void;
  className?: string;
}

export function StreamingText({ text, done, smooth = true, onComplete, className }: StreamingTextProps) {
  const reduced = useReducedMotionPref();
  const visible = useSmoothedText(text, smooth && !reduced);
  const finished = done && visible.length >= text.length;
  const paragraphs = visible.split(/\n{2,}/);

  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });
  useEffect(() => {
    if (finished) onCompleteRef.current?.();
  }, [finished]);

  return (
    <div className={["ak-stream", className].filter(Boolean).join(" ")} aria-busy={!finished}>
      {paragraphs.map((paragraph, pi) => (
        <p key={pi}>
          {reduced
            ? paragraph
            : paragraph.split(/(\s+)/).map((token, ti) =>
                /^\s*$/.test(token) ? (
                  token
                ) : (
                  <span key={ti} className="ak-stream__word">
                    {token}
                  </span>
                ),
              )}
          {pi === paragraphs.length - 1 && (
            <AnimatePresence>
              {!finished && (
                <motion.span
                  key="caret"
                  className="ak-caret"
                  aria-hidden="true"
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                />
              )}
            </AnimatePresence>
          )}
        </p>
      ))}
      <span className="ak-sr-only" role="status">
        {finished ? "Response complete." : text.length > 0 ? "Responding…" : ""}
      </span>
    </div>
  );
}
