"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AutoHeight } from "./AutoHeight";
import { AlertIcon, CheckIcon, SpinnerIcon } from "./icons";
import { useReducedMotionPref } from "./KitProvider";
import { heightTransition, spring } from "./motion";

export type ErrorRetryStatus = "error" | "retrying" | "recovered";

export interface ErrorRetryProps {
  status: ErrorRetryStatus;
  title: string;
  message: string;
  recoveredTitle: string;
  recoveredMessage: string;
  onRetry: () => void;
  attempt?: number;
  maxAttempts?: number;
  /** Technical details, hidden behind a disclosure. */
  details?: string;
}

export function ErrorRetry({
  status,
  title,
  message,
  recoveredTitle,
  recoveredMessage,
  onRetry,
  attempt,
  maxAttempts,
  details,
}: ErrorRetryProps) {
  const reduced = useReducedMotionPref();
  const [showDetails, setShowDetails] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const focusInside = useRef(false);
  const recovered = status === "recovered";

  // When the retry button disappears, keep focus on the card.
  useEffect(() => {
    if (recovered && focusInside.current) rootRef.current?.focus({ preventScroll: true });
  }, [recovered]);

  return (
    <AutoHeight>
      <motion.div
        ref={rootRef}
        tabIndex={-1}
        className="ak-error"
        data-status={status}
        initial={false}
        animate={status === "error" && !reduced ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        onFocus={() => (focusInside.current = true)}
        onBlur={(e) => {
          if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) focusInside.current = false;
        }}
      >
        <div className="ak-error__head">
          <span className="ak-error__icon" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.span
                key={recovered ? "ok" : "err"}
                className="ak-error__glyph"
                initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={spring.snappy}
              >
                {recovered ? <CheckIcon /> : <AlertIcon />}
              </motion.span>
            </AnimatePresence>
          </span>
          <div className="ak-error__text">
            <p className="ak-error__title">{recovered ? recoveredTitle : title}</p>
            <p className="ak-error__msg">{recovered ? recoveredMessage : message}</p>
          </div>
        </div>

        {!recovered && (
          <div className="ak-error__actions">
            <button
              type="button"
              className="ak-btn ak-btn--primary"
              aria-disabled={status === "retrying"}
              onClick={status === "error" ? onRetry : undefined}
            >
              {status === "retrying" ? (
                <>
                  <SpinnerIcon size={14} /> Retrying…
                </>
              ) : (
                "Try again"
              )}
            </button>
            {details && (
              <button
                type="button"
                className="ak-btn ak-btn--ghost"
                aria-expanded={showDetails}
                onClick={() => setShowDetails((s) => !s)}
              >
                {showDetails ? "Hide details" : "Details"}
              </button>
            )}
            {attempt != null && (
              <span className="ak-error__attempt">
                Attempt {attempt}
                {maxAttempts ? ` of ${maxAttempts}` : ""}
              </span>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {showDetails && details && !recovered && (
            <motion.pre
              key="details"
              className="ak-error__details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={heightTransition(reduced)}
            >
              {details}
            </motion.pre>
          )}
        </AnimatePresence>

        <span className="ak-sr-only" role="alert">
          {status === "error" ? `${title}. ${message}` : ""}
        </span>
        <span className="ak-sr-only" role="status">
          {status === "retrying" ? "Retrying…" : recovered ? `${recoveredTitle}. ${recoveredMessage}` : ""}
        </span>
      </motion.div>
    </AutoHeight>
  );
}
