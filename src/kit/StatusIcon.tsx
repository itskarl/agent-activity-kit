"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CrossIcon, QueuedIcon, SpinnerIcon } from "./icons";
import { spring } from "./motion";

export type Status = "queued" | "running" | "done" | "failed";

const glyphs: Record<Status, (size: number) => React.ReactNode> = {
  queued: (s) => <QueuedIcon size={s} />,
  running: (s) => <SpinnerIcon size={s} />,
  done: (s) => <CheckIcon size={s} />,
  failed: (s) => <CrossIcon size={s} />,
};

/** A status glyph that cross-scales between states and draws its check or cross. */
export function StatusIcon({ status, size = 16 }: { status: Status; size?: number }) {
  return (
    <span className="ak-status" data-status={status} style={{ width: size, height: size }} aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          className="ak-status__glyph"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={spring.snappy}
        >
          {glyphs[status](size)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
