"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronIcon } from "agent-activity-kit/icons";
import { useReducedMotionPref } from "agent-activity-kit";
import { heightTransition, spring } from "agent-activity-kit";
import type { CodeTab } from "./code";

export const CodeContext = createContext<Record<string, CodeTab[]>>({});
export const useCode = (id: string) => useContext(CodeContext)[id];

const CodeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" />
  </svg>
);

/** A collapsible code viewer with a usage tab and the kit source behind it. */
export function CodePanel({ tabs, label = "code" }: { tabs: CodeTab[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotionPref();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const copyTimer = useRef<number | undefined>(undefined);

  const select = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") select(active + 1);
    else if (e.key === "ArrowLeft") select(active - 1);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tabs[active].code);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="code-panel" data-open={open}>
      <button
        type="button"
        className="code-toggle"
        aria-expanded={open}
        aria-controls={`${baseId}-body`}
        onClick={() => setOpen((o) => !o)}
      >
        <CodeIcon />
        {open ? `Hide ${label}` : `Show ${label}`}
        <motion.span className="code-toggle__chevron" animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}>
          <ChevronIcon size={13} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            id={`${baseId}-body`}
            className="code-panel__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={heightTransition(reduced)}
          >
            <div className="code-panel__frame">
              <div className="code-panel__bar">
                <div className="code-tabs" role="tablist" aria-label="Code files" onKeyDown={onTabKey}>
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.label}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${i}`}
                      aria-selected={i === active}
                      aria-controls={`${baseId}-panel`}
                      tabIndex={i === active ? 0 : -1}
                      className="code-tab"
                      onClick={() => setActive(i)}
                    >
                      {i === active && <motion.span layoutId={`${baseId}-tab`} className="code-tab__pill" transition={spring.snappy} />}
                      <span className="code-tab__text">{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="code-copy" onClick={copy}>
                  {copied ? "Copied" : "Copy"}
                </button>
                <span className="ak-sr-only" role="status">
                  {copied ? "Copied to clipboard" : ""}
                </span>
              </div>
              <div
                role="tabpanel"
                id={`${baseId}-panel`}
                aria-labelledby={`${baseId}-tab-${active}`}
                className="code-view"
                dangerouslySetInnerHTML={{ __html: tabs[active].html }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
