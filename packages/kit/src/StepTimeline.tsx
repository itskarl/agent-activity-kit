"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotionPref } from "./KitProvider";
import { ease, heightTransition } from "./motion";
import { StatusIcon, type Status } from "./StatusIcon";

export interface TimelineStep {
  id: string;
  label: string;
  status: Status;
  /** One line shown while the step is running or after it fails. */
  detail?: string;
  /** Rich content, such as tool calls, shown once the step has started. */
  content?: ReactNode;
}

const statusText: Record<Status, string> = {
  queued: "queued",
  running: "in progress",
  done: "done",
  failed: "failed",
};

function useStepAnnouncement(steps: TimelineStep[]) {
  const previous = useRef<Record<string, Status>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const changed = steps.find((s) => previous.current[s.id] !== undefined && previous.current[s.id] !== s.status);
    if (changed && changed.status !== "queued") {
      const index = steps.indexOf(changed) + 1;
      setMessage(`Step ${index} of ${steps.length}, ${changed.label}: ${statusText[changed.status]}`);
    }
    previous.current = Object.fromEntries(steps.map((s) => [s.id, s.status]));
  }, [steps]);

  return message;
}

export function StepTimeline({ steps, label = "Agent progress" }: { steps: TimelineStep[]; label?: string }) {
  const reduced = useReducedMotionPref();
  const announcement = useStepAnnouncement(steps);

  return (
    <div className="ak-timeline-wrap">
      <ol className="ak-timeline" aria-label={label}>
        {steps.map((step, i) => {
          const showDetail = step.detail && (step.status === "running" || step.status === "failed");
          const showContent = step.content != null && step.status !== "queued";
          return (
            <motion.li
              key={step.id}
              className="ak-step"
              data-status={step.status}
              aria-current={step.status === "running" ? "step" : undefined}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.32, ease: ease.out }}
            >
              <div className="ak-step__rail" aria-hidden="true">
                <span className="ak-step__node">
                  <StatusIcon status={step.status} size={14} />
                </span>
                {i < steps.length - 1 && (
                  <span className="ak-step__line">
                    <motion.span
                      className="ak-step__line-fill"
                      initial={false}
                      animate={{ scaleY: step.status === "done" ? 1 : 0 }}
                      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: ease.inOut }}
                    />
                  </span>
                )}
              </div>
              <div className="ak-step__content">
                <span className="ak-step__label">
                  {step.label}
                  <span className="ak-sr-only">, {statusText[step.status]}</span>
                </span>
                <AnimatePresence initial={false}>
                  {showDetail && (
                    <motion.p
                      key="detail"
                      className="ak-step__detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={heightTransition(reduced)}
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
                <AnimatePresence initial={false}>
                  {showContent && (
                    <motion.div
                      key="content"
                      className="ak-step__body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={heightTransition(reduced)}
                    >
                      <div className="ak-step__body-inner">{step.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ol>
      <span className="ak-sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}
