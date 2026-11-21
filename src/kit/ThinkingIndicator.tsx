"use client";

import { AnimatePresence, motion } from "motion/react";
import { ease } from "./motion";
import { useElapsed } from "./useElapsed";

export interface ThinkingIndicatorProps {
  active: boolean;
  /** What the agent is doing right now. Changes slide in like a ticker. */
  status?: string;
  label?: string;
  doneLabel?: (seconds: number) => string;
}

export function ThinkingIndicator({
  active,
  status,
  label = "Thinking",
  doneLabel = (s) => `Thought for ${s}s`,
}: ThinkingIndicatorProps) {
  const seconds = useElapsed(active);
  const announcement = active ? `${label}${status ? `: ${status}` : ""}` : doneLabel(seconds);

  return (
    <div className="ak-thinking" data-active={active}>
      <span className="ak-thinking__orb" aria-hidden="true" />
      <span className={active ? "ak-thinking__label ak-shimmer" : "ak-thinking__label"} aria-hidden="true">
        {active ? label : doneLabel(seconds)}
      </span>
      {active && status && (
        <span className="ak-thinking__status" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: ease.out }}
            >
              {status}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
      {active && (
        <span className="ak-thinking__time" aria-hidden="true">
          {seconds}s
        </span>
      )}
      <span className="ak-sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}
