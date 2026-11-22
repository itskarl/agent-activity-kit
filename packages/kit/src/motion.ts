import type { Transition } from "motion/react";

type Bezier = [number, number, number, number];

/** Shared motion tokens. Mirrors the CSS custom properties in kit.css. */
export const ease: { out: Bezier; inOut: Bezier } = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
};

export const duration = { fast: 0.15, base: 0.24, slow: 0.42 };

export const spring: Record<"snappy" | "gentle", Transition> = {
  snappy: { type: "spring", stiffness: 520, damping: 40 },
  gentle: { type: "spring", stiffness: 280, damping: 30 },
};

/** Height transitions collapse to instant when reduced motion is on. */
export function heightTransition(reduced: boolean): Transition {
  return reduced
    ? { duration: 0 }
    : { height: { duration: 0.32, ease: ease.out }, opacity: { duration: 0.2 } };
}
