"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type MotionPreference = "system" | "reduced" | "full";

const ReducedMotionContext = createContext(false);

/**
 * Resolves the reduced-motion preference once for the whole kit: Motion's
 * transforms, the kit's CSS animations (via data-motion) and JS-driven effects
 * like text smoothing all read from here.
 */
export function KitProvider({
  motion = "system",
  children,
}: {
  motion?: MotionPreference;
  children: ReactNode;
}) {
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setOsReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const reduced = motion === "reduced" || (motion === "system" && osReduced);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <div data-motion={reduced ? "reduced" : "full"} style={{ display: "contents" }}>
          {children}
        </div>
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionPref() {
  return useContext(ReducedMotionContext);
}
