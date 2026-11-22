"use client";

import { motion } from "motion/react";
import type { SVGProps } from "react";
import { ease } from "./motion";

type IconProps = { size?: number } & Omit<SVGProps<SVGSVGElement>, "ref">;

function Svg({ size = 16, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const draw = (delay = 0) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 0.34, ease: ease.out, delay },
});

export const CheckIcon = (p: IconProps) => (
  <Svg strokeWidth={1.9} {...p}>
    <motion.path d="M3.5 8.4l2.9 2.9 6.1-6.6" {...draw(0.05)} />
  </Svg>
);

export const CrossIcon = (p: IconProps) => (
  <Svg strokeWidth={1.9} {...p}>
    <motion.path d="M4.5 4.5l7 7" {...draw(0.02)} />
    <motion.path d="M11.5 4.5l-7 7" {...draw(0.12)} />
  </Svg>
);

export const SpinnerIcon = (p: IconProps) => (
  <Svg {...p} className="ak-spin">
    <circle cx="8" cy="8" r="5.5" opacity={0.25} />
    <path d="M13.5 8A5.5 5.5 0 0 0 8 2.5" />
  </Svg>
);

export const QueuedIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="2.4" fill="currentColor" stroke="none" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3.5L10.5 8 6 12.5" />
  </Svg>
);

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 2.2l6.2 11H1.8z" />
    <path d="M8 6.6v3" />
    <circle cx="8" cy="11.4" r="0.4" fill="currentColor" />
  </Svg>
);

export const UndoIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 3.5L2.5 6.5l3 3" />
    <path d="M2.8 6.5H10a3.5 3.5 0 0 1 0 7H7" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="7" cy="7" r="4.2" />
    <path d="M10.2 10.2l3.3 3.3" />
  </Svg>
);

export const DatabaseIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="8" cy="3.8" rx="5" ry="1.8" />
    <path d="M3 3.8v8.4c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V3.8" />
    <path d="M3 8c0 1 2.2 1.8 5 1.8S13 9 13 8" />
  </Svg>
);

export const LayersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 2.5l5.5 3L8 8.5l-5.5-3z" />
    <path d="M2.5 8.5l5.5 3 5.5-3" />
    <path d="M2.5 11.2l5.5 3 5.5-3" opacity={0.55} />
  </Svg>
);

export const FileIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 1.8h5l3 3v9.4H4z" />
    <path d="M9 1.8v3h3" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M2.4 8h11.2M8 2.2c1.6 1.6 2.4 3.5 2.4 5.8S9.6 12.2 8 13.8M8 2.2C6.4 3.8 5.6 5.7 5.6 8s.8 4.2 2.4 5.8" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="5.5" r="2.7" />
    <path d="M2.8 14c.6-2.6 2.7-4.2 5.2-4.2s4.6 1.6 5.2 4.2" />
  </Svg>
);
