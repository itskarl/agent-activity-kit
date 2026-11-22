"use client";

import { useEffect, useState } from "react";

/** Whole seconds since `active` last became true; freezes when it turns false. */
export function useElapsed(active: boolean) {
  const [range, setRange] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    setRange({ start: Date.now(), end: null });
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      window.clearInterval(id);
      setRange((r) => ({ ...r, end: Date.now() }));
    };
  }, [active]);

  if (range.start === null) return 0;
  return Math.max(1, Math.round(((range.end ?? Date.now()) - range.start) / 1000));
}
