"use client";

import { useEffect, useState, type ReactNode } from "react";
import { KitProvider, type MotionPreference } from "@/kit";
import { SegmentedControl } from "./SegmentedControl";

type Theme = "system" | "light" | "dark" | "ember";

function read<T extends string>(key: string, fallback: T): T {
  try {
    return (window.localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

export function DemoShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [motionPref, setMotionPref] = useState<MotionPreference>("system");

  useEffect(() => {
    setTheme(read<Theme>("ak-theme", "system"));
    setMotionPref(read<MotionPreference>("ak-motion", "system"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);

  return (
    <KitProvider motion={motionPref}>
      <div className="controls" role="region" aria-label="Demo settings">
        <SegmentedControl
          label="Theme"
          value={theme}
          onChange={(v) => {
            setTheme(v);
            write("ak-theme", v);
          }}
          options={[
            { value: "system", label: "Auto" },
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "ember", label: "Ember" },
          ]}
        />
        <SegmentedControl
          label="Motion"
          value={motionPref}
          onChange={(v) => {
            setMotionPref(v);
            write("ak-motion", v);
          }}
          options={[
            { value: "system", label: "Auto" },
            { value: "full", label: "Full" },
            { value: "reduced", label: "Reduced" },
          ]}
        />
      </div>
      {children}
    </KitProvider>
  );
}
