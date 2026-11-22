"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "./icons";
import { useReducedMotionPref } from "./KitProvider";
import { ease, heightTransition, spring } from "./motion";
import { StatusIcon } from "./StatusIcon";

export type ToolStatus = "running" | "done" | "error";

export interface ToolCallCardProps {
  icon?: ReactNode;
  /** Present tense while running, past tense when done: "Searching the web" → "Searched the web". */
  label: { running: string; done: string; error?: string };
  status: ToolStatus;
  /** A short result, such as "4 sources". Appears when the call finishes. */
  summary?: string;
  /** Expandable details: results, arguments, output. */
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function ToolCallCard({ icon, label, status, summary, children, defaultOpen = false }: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const reduced = useReducedMotionPref();
  const hasBody = children != null;
  const text = status === "running" ? label.running : status === "done" ? label.done : (label.error ?? `${label.running} failed`);

  const headerContent = (
    <>
      <StatusIcon status={status === "running" ? "running" : status === "done" ? "done" : "failed"} />
      {icon && <span className="ak-tool__icon" aria-hidden="true">{icon}</span>}
      <span className="ak-tool__label">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className={status === "running" ? "ak-shimmer" : undefined}
            initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
            transition={{ duration: 0.3, ease: ease.out }}
          >
            {status === "running" ? `${text}…` : text}
          </motion.span>
        </AnimatePresence>
      </span>
      <AnimatePresence initial={false}>
        {summary && status !== "running" && (
          <motion.span
            className="ak-tool__summary"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.out, delay: 0.1 }}
          >
            {summary}
          </motion.span>
        )}
      </AnimatePresence>
      {hasBody && (
        <motion.span className="ak-tool__chevron" aria-hidden="true" animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}>
          <ChevronIcon size={14} />
        </motion.span>
      )}
    </>
  );

  return (
    <div className="ak-tool" data-status={status}>
      {hasBody ? (
        <button
          type="button"
          className="ak-tool__header"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((o) => !o)}
        >
          {headerContent}
        </button>
      ) : (
        <div className="ak-tool__header">{headerContent}</div>
      )}
      <AnimatePresence initial={false}>
        {open && hasBody && (
          <motion.div
            key="body"
            id={bodyId}
            className="ak-tool__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={heightTransition(reduced)}
          >
            <div className="ak-tool__body-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="ak-sr-only" role="status">
        {status === "running" ? `${label.running}…` : `${text}${summary ? `, ${summary}` : ""}`}
      </span>
    </div>
  );
}

export interface ToolResult {
  id: string;
  title: string;
  meta?: string;
  icon?: ReactNode;
}

/** A result list whose rows stagger in. */
export function ToolResults({ items }: { items: ToolResult[] }) {
  return (
    <motion.ul
      className="ak-results"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } }}
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          className="ak-results__item"
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out } },
          }}
        >
          {item.icon && <span className="ak-results__icon" aria-hidden="true">{item.icon}</span>}
          <span className="ak-results__title">{item.title}</span>
          {item.meta && <span className="ak-results__meta">{item.meta}</span>}
        </motion.li>
      ))}
    </motion.ul>
  );
}
