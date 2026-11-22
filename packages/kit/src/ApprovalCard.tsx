"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, type ReactNode } from "react";
import { AutoHeight } from "./AutoHeight";
import { AlertIcon } from "./icons";
import { ease } from "./motion";
import { StatusIcon } from "./StatusIcon";

export type ApprovalStatus = "pending" | "confirmed" | "cancelled";

export interface ApprovalItem {
  id: string;
  label: string;
  meta?: string;
}

export interface ApprovalCardProps {
  status: ApprovalStatus;
  title: string;
  description?: string;
  items?: ApprovalItem[];
  confirmLabel: string;
  cancelLabel?: string;
  /** What the card collapses to once the person decides. */
  resultLabel: ReactNode;
  tone?: "danger" | "neutral";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ApprovalCard({
  status,
  title,
  description,
  items,
  confirmLabel,
  cancelLabel = "Cancel",
  resultLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: ApprovalCardProps) {
  const titleId = useId();
  // The buttons disappear after a decision, so focus moves to the result
  // instead of falling back to the page.
  const moveFocus = useRef(false);

  const decide = (fn: () => void) => () => {
    moveFocus.current = true;
    fn();
  };

  return (
    <AutoHeight>
      <div
        className="ak-approval"
        data-tone={tone}
        data-status={status}
        role="group"
        aria-labelledby={titleId}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "pending" ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="ak-approval__head">
                <span className="ak-approval__icon" aria-hidden="true">
                  <AlertIcon />
                </span>
                <div>
                  <p className="ak-approval__title" id={titleId}>
                    {title}
                  </p>
                  {description && <p className="ak-approval__desc">{description}</p>}
                </div>
              </div>
              {items && items.length > 0 && (
                <ul className="ak-approval__items">
                  {items.map((item) => (
                    <li key={item.id}>
                      <span className="ak-approval__item-label">{item.label}</span>
                      {item.meta && <span className="ak-approval__item-meta">{item.meta}</span>}
                    </li>
                  ))}
                </ul>
              )}
              <div className="ak-approval__actions">
                <button type="button" className="ak-btn ak-btn--ghost" onClick={decide(onCancel)}>
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  className={tone === "danger" ? "ak-btn ak-btn--danger" : "ak-btn ak-btn--primary"}
                  onClick={decide(onConfirm)}
                >
                  {confirmLabel}
                </button>
              </div>
              <span className="ak-sr-only" role="status">
                Approval needed: {title}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={status}
              ref={(el) => {
                if (el && moveFocus.current) {
                  moveFocus.current = false;
                  el.focus({ preventScroll: true });
                }
              }}
              tabIndex={-1}
              className="ak-approval__result"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: ease.out }}
            >
              <StatusIcon status={status === "confirmed" ? "done" : "queued"} />
              <span id={titleId} role="status">
                {resultLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AutoHeight>
  );
}
