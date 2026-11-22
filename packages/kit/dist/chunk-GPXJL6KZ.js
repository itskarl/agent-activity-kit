"use client";

// src/icons.tsx
import { motion } from "motion/react";

// src/motion.ts
var ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1]
};
var duration = { fast: 0.15, base: 0.24, slow: 0.42 };
var spring = {
  snappy: { type: "spring", stiffness: 520, damping: 40 },
  gentle: { type: "spring", stiffness: 280, damping: 30 }
};
function heightTransition(reduced) {
  return reduced ? { duration: 0 } : { height: { duration: 0.32, ease: ease.out }, opacity: { duration: 0.2 } };
}

// src/icons.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function Svg({ size = 16, children, ...rest }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.6,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      ...rest,
      children
    }
  );
}
var draw = (delay = 0) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 0.34, ease: ease.out, delay }
});
var CheckIcon = (p) => /* @__PURE__ */ jsx(Svg, { strokeWidth: 1.9, ...p, children: /* @__PURE__ */ jsx(motion.path, { d: "M3.5 8.4l2.9 2.9 6.1-6.6", ...draw(0.05) }) });
var CrossIcon = (p) => /* @__PURE__ */ jsxs(Svg, { strokeWidth: 1.9, ...p, children: [
  /* @__PURE__ */ jsx(motion.path, { d: "M4.5 4.5l7 7", ...draw(0.02) }),
  /* @__PURE__ */ jsx(motion.path, { d: "M11.5 4.5l-7 7", ...draw(0.12) })
] });
var SpinnerIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, className: "ak-spin", children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5", opacity: 0.25 }),
  /* @__PURE__ */ jsx("path", { d: "M13.5 8A5.5 5.5 0 0 0 8 2.5" })
] });
var QueuedIcon = (p) => /* @__PURE__ */ jsx(Svg, { ...p, children: /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "2.4", fill: "currentColor", stroke: "none" }) });
var ChevronIcon = (p) => /* @__PURE__ */ jsx(Svg, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M6 3.5L10.5 8 6 12.5" }) });
var AlertIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M8 2.2l6.2 11H1.8z" }),
  /* @__PURE__ */ jsx("path", { d: "M8 6.6v3" }),
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "11.4", r: "0.4", fill: "currentColor" })
] });
var UndoIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M5.5 3.5L2.5 6.5l3 3" }),
  /* @__PURE__ */ jsx("path", { d: "M2.8 6.5H10a3.5 3.5 0 0 1 0 7H7" })
] });
var SearchIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "4.2" }),
  /* @__PURE__ */ jsx("path", { d: "M10.2 10.2l3.3 3.3" })
] });
var DatabaseIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("ellipse", { cx: "8", cy: "3.8", rx: "5", ry: "1.8" }),
  /* @__PURE__ */ jsx("path", { d: "M3 3.8v8.4c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V3.8" }),
  /* @__PURE__ */ jsx("path", { d: "M3 8c0 1 2.2 1.8 5 1.8S13 9 13 8" })
] });
var LayersIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M8 2.5l5.5 3L8 8.5l-5.5-3z" }),
  /* @__PURE__ */ jsx("path", { d: "M2.5 8.5l5.5 3 5.5-3" }),
  /* @__PURE__ */ jsx("path", { d: "M2.5 11.2l5.5 3 5.5-3", opacity: 0.55 })
] });
var FileIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M4 1.8h5l3 3v9.4H4z" }),
  /* @__PURE__ */ jsx("path", { d: "M9 1.8v3h3" })
] });
var GlobeIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.8" }),
  /* @__PURE__ */ jsx("path", { d: "M2.4 8h11.2M8 2.2c1.6 1.6 2.4 3.5 2.4 5.8S9.6 12.2 8 13.8M8 2.2C6.4 3.8 5.6 5.7 5.6 8s.8 4.2 2.4 5.8" })
] });
var UserIcon = (p) => /* @__PURE__ */ jsxs(Svg, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "5.5", r: "2.7" }),
  /* @__PURE__ */ jsx("path", { d: "M2.8 14c.6-2.6 2.7-4.2 5.2-4.2s4.6 1.6 5.2 4.2" })
] });

export {
  ease,
  duration,
  spring,
  heightTransition,
  CheckIcon,
  CrossIcon,
  SpinnerIcon,
  QueuedIcon,
  ChevronIcon,
  AlertIcon,
  UndoIcon,
  SearchIcon,
  DatabaseIcon,
  LayersIcon,
  FileIcon,
  GlobeIcon,
  UserIcon
};
//# sourceMappingURL=chunk-GPXJL6KZ.js.map