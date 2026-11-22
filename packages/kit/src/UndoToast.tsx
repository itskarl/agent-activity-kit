"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { UndoIcon } from "./icons";
import { spring } from "./motion";

export interface UndoToastProps {
  open: boolean;
  message: string;
  /** Milliseconds before the toast closes on its own. Paused on hover, focus or a hidden tab. */
  duration?: number;
  undoLabel?: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ open, ...props }: UndoToastProps) {
  return <AnimatePresence>{open && <Toast key="toast" {...props} />}</AnimatePresence>;
}

function Toast({ message, duration = 6000, undoLabel = "Undo", onUndo, onDismiss }: Omit<UndoToastProps, "open">) {
  const barRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000));
  const onDismissRef = useRef(onDismiss);
  useLayoutEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const setPause = (value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
  };

  useEffect(() => {
    let remaining = duration;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current && !document.hidden) remaining -= dt;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0, remaining / duration)})`;
      const s = Math.max(0, Math.ceil(remaining / 1000));
      setSecondsLeft((prev) => (prev === s ? prev : s));
      if (remaining <= 0) {
        onDismissRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return (
    <motion.div
      className="ak-toast"
      data-paused={paused}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.18 } }}
      transition={spring.gentle}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPause(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onDismiss();
      }}
    >
      <span className="ak-toast__msg" role="status">
        {message}
      </span>
      <button type="button" className="ak-toast__undo" onClick={onUndo}>
        <UndoIcon size={14} />
        {undoLabel}
      </button>
      <span className="ak-toast__time" aria-hidden="true">
        {paused ? "Paused" : `${secondsLeft}s`}
      </span>
      <span className="ak-toast__bar" aria-hidden="true">
        <span ref={barRef} className="ak-toast__bar-fill" />
      </span>
    </motion.div>
  );
}
