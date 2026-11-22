"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ease } from "./motion";
import { useReducedMotionPref } from "./KitProvider";

/** Animates its height to fit its children whenever they change size. */
export function AutoHeight({ children, className }: { children: ReactNode; className?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const reduced = useReducedMotionPref();

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden", margin: -4, padding: 4 }}
      initial={false}
      animate={{ height: height === "auto" ? "auto" : height + 8 }}
      transition={reduced ? { duration: 0 } : { duration: 0.34, ease: ease.out }}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}
