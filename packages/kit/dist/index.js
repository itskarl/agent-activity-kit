"use client";
import {
  AlertIcon,
  CheckIcon,
  ChevronIcon,
  CrossIcon,
  QueuedIcon,
  SpinnerIcon,
  UndoIcon,
  duration,
  ease,
  heightTransition,
  spring
} from "./chunk-GPXJL6KZ.js";

// src/KitProvider.tsx
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var ReducedMotionContext = createContext(false);
function KitProvider({
  motion: motion10 = "system",
  children
}) {
  const [osReduced, setOsReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsReduced(mq.matches);
    const onChange = (e) => setOsReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const reduced = motion10 === "reduced" || motion10 === "system" && osReduced;
  return /* @__PURE__ */ jsx(ReducedMotionContext.Provider, { value: reduced, children: /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: reduced ? "always" : "never", children: /* @__PURE__ */ jsx("div", { "data-motion": reduced ? "reduced" : "full", style: { display: "contents" }, children }) }) });
}
function useReducedMotionPref() {
  return useContext(ReducedMotionContext);
}

// src/StreamingText.tsx
import { AnimatePresence, motion } from "motion/react";
import { useEffect as useEffect2, useLayoutEffect, useRef, useState as useState2 } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function useSmoothedText(target, enabled) {
  const [count, setCount] = useState2(enabled ? 0 : target.length);
  const targetRef = useRef(target);
  const countRef = useRef(count);
  useLayoutEffect(() => {
    targetRef.current = target;
  }, [target]);
  useEffect2(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();
    let revealed = countRef.current;
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1e3);
      last = now;
      const length = targetRef.current.length;
      if (revealed > length) revealed = 0;
      const backlog = length - revealed;
      if (backlog > 0) {
        const charsPerSecond = Math.max(40, backlog * 3.5);
        revealed = Math.min(length, revealed + charsPerSecond * dt);
      }
      const next = Math.floor(revealed);
      if (next !== countRef.current) {
        countRef.current = next;
        setCount(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
  return enabled ? target.slice(0, Math.min(count, target.length)) : target;
}
function StreamingText({ text, done, smooth = true, onComplete, className }) {
  const reduced = useReducedMotionPref();
  const visible = useSmoothedText(text, smooth && !reduced);
  const finished = done && visible.length >= text.length;
  const paragraphs = visible.split(/\n{2,}/);
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });
  useEffect2(() => {
    if (finished) onCompleteRef.current?.();
  }, [finished]);
  return /* @__PURE__ */ jsxs("div", { className: ["ak-stream", className].filter(Boolean).join(" "), "aria-busy": !finished, children: [
    paragraphs.map((paragraph, pi) => /* @__PURE__ */ jsxs("p", { children: [
      reduced ? paragraph : paragraph.split(/(\s+)/).map(
        (token, ti) => /^\s*$/.test(token) ? token : /* @__PURE__ */ jsx2("span", { className: "ak-stream__word", children: token }, ti)
      ),
      pi === paragraphs.length - 1 && /* @__PURE__ */ jsx2(AnimatePresence, { children: !finished && /* @__PURE__ */ jsx2(
        motion.span,
        {
          className: "ak-caret",
          "aria-hidden": "true",
          exit: { opacity: 0, transition: { duration: 0.3 } }
        },
        "caret"
      ) })
    ] }, pi)),
    /* @__PURE__ */ jsx2("span", { className: "ak-sr-only", role: "status", children: finished ? "Response complete." : text.length > 0 ? "Responding\u2026" : "" })
  ] });
}

// src/ThinkingIndicator.tsx
import { AnimatePresence as AnimatePresence2, motion as motion2 } from "motion/react";

// src/useElapsed.ts
import { useEffect as useEffect3, useState as useState3 } from "react";
function useElapsed(active) {
  const [range, setRange] = useState3({ start: null, end: null });
  const [, setTick] = useState3(0);
  useEffect3(() => {
    if (!active) return;
    setRange({ start: Date.now(), end: null });
    const id = window.setInterval(() => setTick((t) => t + 1), 1e3);
    return () => {
      window.clearInterval(id);
      setRange((r) => ({ ...r, end: Date.now() }));
    };
  }, [active]);
  if (range.start === null) return 0;
  return Math.max(1, Math.round(((range.end ?? Date.now()) - range.start) / 1e3));
}

// src/ThinkingIndicator.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function ThinkingIndicator({
  active,
  status,
  label = "Thinking",
  doneLabel = (s) => `Thought for ${s}s`
}) {
  const seconds = useElapsed(active);
  const announcement = active ? `${label}${status ? `: ${status}` : ""}` : doneLabel(seconds);
  return /* @__PURE__ */ jsxs2("div", { className: "ak-thinking", "data-active": active, children: [
    /* @__PURE__ */ jsx3("span", { className: "ak-thinking__orb", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx3("span", { className: active ? "ak-thinking__label ak-shimmer" : "ak-thinking__label", "aria-hidden": "true", children: active ? label : doneLabel(seconds) }),
    active && status && /* @__PURE__ */ jsx3("span", { className: "ak-thinking__status", "aria-hidden": "true", children: /* @__PURE__ */ jsx3(AnimatePresence2, { mode: "popLayout", initial: false, children: /* @__PURE__ */ jsx3(
      motion2.span,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.3, ease: ease.out },
        children: status
      },
      status
    ) }) }),
    active && /* @__PURE__ */ jsxs2("span", { className: "ak-thinking__time", "aria-hidden": "true", children: [
      seconds,
      "s"
    ] }),
    /* @__PURE__ */ jsx3("span", { className: "ak-sr-only", role: "status", children: announcement })
  ] });
}

// src/ToolCallCard.tsx
import { AnimatePresence as AnimatePresence4, motion as motion4 } from "motion/react";
import { useId, useState as useState4 } from "react";

// src/StatusIcon.tsx
import { AnimatePresence as AnimatePresence3, motion as motion3 } from "motion/react";
import { jsx as jsx4 } from "react/jsx-runtime";
var glyphs = {
  queued: (s) => /* @__PURE__ */ jsx4(QueuedIcon, { size: s }),
  running: (s) => /* @__PURE__ */ jsx4(SpinnerIcon, { size: s }),
  done: (s) => /* @__PURE__ */ jsx4(CheckIcon, { size: s }),
  failed: (s) => /* @__PURE__ */ jsx4(CrossIcon, { size: s })
};
function StatusIcon({ status, size = 16 }) {
  return /* @__PURE__ */ jsx4("span", { className: "ak-status", "data-status": status, style: { width: size, height: size }, "aria-hidden": "true", children: /* @__PURE__ */ jsx4(AnimatePresence3, { initial: false, children: /* @__PURE__ */ jsx4(
    motion3.span,
    {
      className: "ak-status__glyph",
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      transition: spring.snappy,
      children: glyphs[status](size)
    },
    status
  ) }) });
}

// src/ToolCallCard.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function ToolCallCard({ icon, label, status, summary, children, defaultOpen = false }) {
  const [open, setOpen] = useState4(defaultOpen);
  const bodyId = useId();
  const reduced = useReducedMotionPref();
  const hasBody = children != null;
  const text = status === "running" ? label.running : status === "done" ? label.done : label.error ?? `${label.running} failed`;
  const headerContent = /* @__PURE__ */ jsxs3(Fragment, { children: [
    /* @__PURE__ */ jsx5(StatusIcon, { status: status === "running" ? "running" : status === "done" ? "done" : "failed" }),
    icon && /* @__PURE__ */ jsx5("span", { className: "ak-tool__icon", "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ jsx5("span", { className: "ak-tool__label", children: /* @__PURE__ */ jsx5(AnimatePresence4, { mode: "popLayout", initial: false, children: /* @__PURE__ */ jsx5(
      motion4.span,
      {
        className: status === "running" ? "ak-shimmer" : void 0,
        initial: { opacity: 0, y: 8, filter: "blur(3px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(3px)" },
        transition: { duration: 0.3, ease: ease.out },
        children: status === "running" ? `${text}\u2026` : text
      },
      text
    ) }) }),
    /* @__PURE__ */ jsx5(AnimatePresence4, { initial: false, children: summary && status !== "running" && /* @__PURE__ */ jsx5(
      motion4.span,
      {
        className: "ak-tool__summary",
        initial: { opacity: 0, x: -6 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: ease.out, delay: 0.1 },
        children: summary
      }
    ) }),
    hasBody && /* @__PURE__ */ jsx5(motion4.span, { className: "ak-tool__chevron", "aria-hidden": "true", animate: { rotate: open ? 90 : 0 }, transition: spring.snappy, children: /* @__PURE__ */ jsx5(ChevronIcon, { size: 14 }) })
  ] });
  return /* @__PURE__ */ jsxs3("div", { className: "ak-tool", "data-status": status, children: [
    hasBody ? /* @__PURE__ */ jsx5(
      "button",
      {
        type: "button",
        className: "ak-tool__header",
        "aria-expanded": open,
        "aria-controls": bodyId,
        onClick: () => setOpen((o) => !o),
        children: headerContent
      }
    ) : /* @__PURE__ */ jsx5("div", { className: "ak-tool__header", children: headerContent }),
    /* @__PURE__ */ jsx5(AnimatePresence4, { initial: false, children: open && hasBody && /* @__PURE__ */ jsx5(
      motion4.div,
      {
        id: bodyId,
        className: "ak-tool__body",
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: heightTransition(reduced),
        children: /* @__PURE__ */ jsx5("div", { className: "ak-tool__body-inner", children })
      },
      "body"
    ) }),
    /* @__PURE__ */ jsx5("span", { className: "ak-sr-only", role: "status", children: status === "running" ? `${label.running}\u2026` : `${text}${summary ? `, ${summary}` : ""}` })
  ] });
}
function ToolResults({ items }) {
  return /* @__PURE__ */ jsx5(
    motion4.ul,
    {
      className: "ak-results",
      initial: "hidden",
      animate: "show",
      variants: { show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } },
      children: items.map((item) => /* @__PURE__ */ jsxs3(
        motion4.li,
        {
          className: "ak-results__item",
          variants: {
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out } }
          },
          children: [
            item.icon && /* @__PURE__ */ jsx5("span", { className: "ak-results__icon", "aria-hidden": "true", children: item.icon }),
            /* @__PURE__ */ jsx5("span", { className: "ak-results__title", children: item.title }),
            item.meta && /* @__PURE__ */ jsx5("span", { className: "ak-results__meta", children: item.meta })
          ]
        },
        item.id
      ))
    }
  );
}

// src/StepTimeline.tsx
import { AnimatePresence as AnimatePresence5, motion as motion5 } from "motion/react";
import { useEffect as useEffect4, useRef as useRef2, useState as useState5 } from "react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var statusText = {
  queued: "queued",
  running: "in progress",
  done: "done",
  failed: "failed"
};
function useStepAnnouncement(steps) {
  const previous = useRef2({});
  const [message, setMessage] = useState5("");
  useEffect4(() => {
    const changed = steps.find((s) => previous.current[s.id] !== void 0 && previous.current[s.id] !== s.status);
    if (changed && changed.status !== "queued") {
      const index = steps.indexOf(changed) + 1;
      setMessage(`Step ${index} of ${steps.length}, ${changed.label}: ${statusText[changed.status]}`);
    }
    previous.current = Object.fromEntries(steps.map((s) => [s.id, s.status]));
  }, [steps]);
  return message;
}
function StepTimeline({ steps, label = "Agent progress" }) {
  const reduced = useReducedMotionPref();
  const announcement = useStepAnnouncement(steps);
  return /* @__PURE__ */ jsxs4("div", { className: "ak-timeline-wrap", children: [
    /* @__PURE__ */ jsx6("ol", { className: "ak-timeline", "aria-label": label, children: steps.map((step, i) => {
      const showDetail = step.detail && (step.status === "running" || step.status === "failed");
      const showContent = step.content != null && step.status !== "queued";
      return /* @__PURE__ */ jsxs4(
        motion5.li,
        {
          className: "ak-step",
          "data-status": step.status,
          "aria-current": step.status === "running" ? "step" : void 0,
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.05, duration: 0.32, ease: ease.out },
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "ak-step__rail", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx6("span", { className: "ak-step__node", children: /* @__PURE__ */ jsx6(StatusIcon, { status: step.status, size: 14 }) }),
              i < steps.length - 1 && /* @__PURE__ */ jsx6("span", { className: "ak-step__line", children: /* @__PURE__ */ jsx6(
                motion5.span,
                {
                  className: "ak-step__line-fill",
                  initial: false,
                  animate: { scaleY: step.status === "done" ? 1 : 0 },
                  transition: reduced ? { duration: 0 } : { duration: 0.5, ease: ease.inOut }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "ak-step__content", children: [
              /* @__PURE__ */ jsxs4("span", { className: "ak-step__label", children: [
                step.label,
                /* @__PURE__ */ jsxs4("span", { className: "ak-sr-only", children: [
                  ", ",
                  statusText[step.status]
                ] })
              ] }),
              /* @__PURE__ */ jsx6(AnimatePresence5, { initial: false, children: showDetail && /* @__PURE__ */ jsx6(
                motion5.p,
                {
                  className: "ak-step__detail",
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  transition: heightTransition(reduced),
                  children: step.detail
                },
                "detail"
              ) }),
              /* @__PURE__ */ jsx6(AnimatePresence5, { initial: false, children: showContent && /* @__PURE__ */ jsx6(
                motion5.div,
                {
                  className: "ak-step__body",
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  transition: heightTransition(reduced),
                  children: /* @__PURE__ */ jsx6("div", { className: "ak-step__body-inner", children: step.content })
                },
                "content"
              ) })
            ] })
          ]
        },
        step.id
      );
    }) }),
    /* @__PURE__ */ jsx6("span", { className: "ak-sr-only", role: "status", children: announcement })
  ] });
}

// src/ApprovalCard.tsx
import { AnimatePresence as AnimatePresence6, motion as motion7 } from "motion/react";
import { useId as useId2, useRef as useRef4 } from "react";

// src/AutoHeight.tsx
import { motion as motion6 } from "motion/react";
import { useLayoutEffect as useLayoutEffect2, useRef as useRef3, useState as useState6 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
function AutoHeight({ children, className }) {
  const innerRef = useRef3(null);
  const [height, setHeight] = useState6("auto");
  const reduced = useReducedMotionPref();
  useLayoutEffect2(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsx7(
    motion6.div,
    {
      className,
      style: { overflow: "hidden", margin: -4, padding: 4 },
      initial: false,
      animate: { height: height === "auto" ? "auto" : height + 8 },
      transition: reduced ? { duration: 0 } : { duration: 0.34, ease: ease.out },
      children: /* @__PURE__ */ jsx7("div", { ref: innerRef, children })
    }
  );
}

// src/ApprovalCard.tsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function ApprovalCard({
  status,
  title,
  description,
  items,
  confirmLabel,
  cancelLabel = "Cancel",
  resultLabel,
  tone = "danger",
  onConfirm,
  onCancel
}) {
  const titleId = useId2();
  const moveFocus = useRef4(false);
  const decide = (fn) => () => {
    moveFocus.current = true;
    fn();
  };
  return /* @__PURE__ */ jsx8(AutoHeight, { children: /* @__PURE__ */ jsx8(
    "div",
    {
      className: "ak-approval",
      "data-tone": tone,
      "data-status": status,
      role: "group",
      "aria-labelledby": titleId,
      children: /* @__PURE__ */ jsx8(AnimatePresence6, { mode: "wait", initial: false, children: status === "pending" ? /* @__PURE__ */ jsxs5(
        motion7.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0, scale: 0.98, filter: "blur(2px)" },
          transition: { duration: 0.2 },
          children: [
            /* @__PURE__ */ jsxs5("div", { className: "ak-approval__head", children: [
              /* @__PURE__ */ jsx8("span", { className: "ak-approval__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx8(AlertIcon, {}) }),
              /* @__PURE__ */ jsxs5("div", { children: [
                /* @__PURE__ */ jsx8("p", { className: "ak-approval__title", id: titleId, children: title }),
                description && /* @__PURE__ */ jsx8("p", { className: "ak-approval__desc", children: description })
              ] })
            ] }),
            items && items.length > 0 && /* @__PURE__ */ jsx8("ul", { className: "ak-approval__items", children: items.map((item) => /* @__PURE__ */ jsxs5("li", { children: [
              /* @__PURE__ */ jsx8("span", { className: "ak-approval__item-label", children: item.label }),
              item.meta && /* @__PURE__ */ jsx8("span", { className: "ak-approval__item-meta", children: item.meta })
            ] }, item.id)) }),
            /* @__PURE__ */ jsxs5("div", { className: "ak-approval__actions", children: [
              /* @__PURE__ */ jsx8("button", { type: "button", className: "ak-btn ak-btn--ghost", onClick: decide(onCancel), children: cancelLabel }),
              /* @__PURE__ */ jsx8(
                "button",
                {
                  type: "button",
                  className: tone === "danger" ? "ak-btn ak-btn--danger" : "ak-btn ak-btn--primary",
                  onClick: decide(onConfirm),
                  children: confirmLabel
                }
              )
            ] }),
            /* @__PURE__ */ jsxs5("span", { className: "ak-sr-only", role: "status", children: [
              "Approval needed: ",
              title
            ] })
          ]
        },
        "pending"
      ) : /* @__PURE__ */ jsxs5(
        motion7.div,
        {
          ref: (el) => {
            if (el && moveFocus.current) {
              moveFocus.current = false;
              el.focus({ preventScroll: true });
            }
          },
          tabIndex: -1,
          className: "ak-approval__result",
          initial: { opacity: 0, y: 4 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          transition: { duration: 0.28, ease: ease.out },
          children: [
            /* @__PURE__ */ jsx8(StatusIcon, { status: status === "confirmed" ? "done" : "queued" }),
            /* @__PURE__ */ jsx8("span", { id: titleId, role: "status", children: resultLabel })
          ]
        },
        status
      ) })
    }
  ) });
}

// src/UndoToast.tsx
import { AnimatePresence as AnimatePresence7, motion as motion8 } from "motion/react";
import { useEffect as useEffect5, useLayoutEffect as useLayoutEffect3, useRef as useRef5, useState as useState7 } from "react";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
function UndoToast({ open, ...props }) {
  return /* @__PURE__ */ jsx9(AnimatePresence7, { children: open && /* @__PURE__ */ jsx9(Toast, { ...props }, "toast") });
}
function Toast({ message, duration: duration2 = 6e3, undoLabel = "Undo", onUndo, onDismiss }) {
  const barRef = useRef5(null);
  const pausedRef = useRef5(false);
  const [paused, setPaused] = useState7(false);
  const [secondsLeft, setSecondsLeft] = useState7(Math.ceil(duration2 / 1e3));
  const onDismissRef = useRef5(onDismiss);
  useLayoutEffect3(() => {
    onDismissRef.current = onDismiss;
  });
  const setPause = (value) => {
    pausedRef.current = value;
    setPaused(value);
  };
  useEffect5(() => {
    let remaining = duration2;
    let last = performance.now();
    let raf = 0;
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current && !document.hidden) remaining -= dt;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0, remaining / duration2)})`;
      const s = Math.max(0, Math.ceil(remaining / 1e3));
      setSecondsLeft((prev) => prev === s ? prev : s);
      if (remaining <= 0) {
        onDismissRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration2]);
  return /* @__PURE__ */ jsxs6(
    motion8.div,
    {
      className: "ak-toast",
      "data-paused": paused,
      initial: { opacity: 0, y: 18, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.18 } },
      transition: spring.gentle,
      onMouseEnter: () => setPause(true),
      onMouseLeave: () => setPause(false),
      onFocus: () => setPause(true),
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPause(false);
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onDismiss();
      },
      children: [
        /* @__PURE__ */ jsx9("span", { className: "ak-toast__msg", role: "status", children: message }),
        /* @__PURE__ */ jsxs6("button", { type: "button", className: "ak-toast__undo", onClick: onUndo, children: [
          /* @__PURE__ */ jsx9(UndoIcon, { size: 14 }),
          undoLabel
        ] }),
        /* @__PURE__ */ jsx9("span", { className: "ak-toast__time", "aria-hidden": "true", children: paused ? "Paused" : `${secondsLeft}s` }),
        /* @__PURE__ */ jsx9("span", { className: "ak-toast__bar", "aria-hidden": "true", children: /* @__PURE__ */ jsx9("span", { ref: barRef, className: "ak-toast__bar-fill" }) })
      ]
    }
  );
}

// src/ErrorRetry.tsx
import { AnimatePresence as AnimatePresence8, motion as motion9 } from "motion/react";
import { useEffect as useEffect6, useRef as useRef6, useState as useState8 } from "react";
import { Fragment as Fragment2, jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function ErrorRetry({
  status,
  title,
  message,
  recoveredTitle,
  recoveredMessage,
  onRetry,
  attempt,
  maxAttempts,
  details
}) {
  const reduced = useReducedMotionPref();
  const [showDetails, setShowDetails] = useState8(false);
  const rootRef = useRef6(null);
  const focusInside = useRef6(false);
  const recovered = status === "recovered";
  useEffect6(() => {
    if (recovered && focusInside.current) rootRef.current?.focus({ preventScroll: true });
  }, [recovered]);
  return /* @__PURE__ */ jsx10(AutoHeight, { children: /* @__PURE__ */ jsxs7(
    motion9.div,
    {
      ref: rootRef,
      tabIndex: -1,
      className: "ak-error",
      "data-status": status,
      initial: false,
      animate: status === "error" && !reduced ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 },
      transition: { duration: 0.4 },
      onFocus: () => focusInside.current = true,
      onBlur: (e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) focusInside.current = false;
      },
      children: [
        /* @__PURE__ */ jsxs7("div", { className: "ak-error__head", children: [
          /* @__PURE__ */ jsx10("span", { className: "ak-error__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx10(AnimatePresence8, { initial: false, children: /* @__PURE__ */ jsx10(
            motion9.span,
            {
              className: "ak-error__glyph",
              initial: { opacity: 0, scale: 0.5, rotate: -30 },
              animate: { opacity: 1, scale: 1, rotate: 0 },
              exit: { opacity: 0, scale: 0.5 },
              transition: spring.snappy,
              children: recovered ? /* @__PURE__ */ jsx10(CheckIcon, {}) : /* @__PURE__ */ jsx10(AlertIcon, {})
            },
            recovered ? "ok" : "err"
          ) }) }),
          /* @__PURE__ */ jsxs7("div", { className: "ak-error__text", children: [
            /* @__PURE__ */ jsx10("p", { className: "ak-error__title", children: recovered ? recoveredTitle : title }),
            /* @__PURE__ */ jsx10("p", { className: "ak-error__msg", children: recovered ? recoveredMessage : message })
          ] })
        ] }),
        !recovered && /* @__PURE__ */ jsxs7("div", { className: "ak-error__actions", children: [
          /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              className: "ak-btn ak-btn--primary",
              "aria-disabled": status === "retrying",
              onClick: status === "error" ? onRetry : void 0,
              children: status === "retrying" ? /* @__PURE__ */ jsxs7(Fragment2, { children: [
                /* @__PURE__ */ jsx10(SpinnerIcon, { size: 14 }),
                " Retrying\u2026"
              ] }) : "Try again"
            }
          ),
          details && /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              className: "ak-btn ak-btn--ghost",
              "aria-expanded": showDetails,
              onClick: () => setShowDetails((s) => !s),
              children: showDetails ? "Hide details" : "Details"
            }
          ),
          attempt != null && /* @__PURE__ */ jsxs7("span", { className: "ak-error__attempt", children: [
            "Attempt ",
            attempt,
            maxAttempts ? ` of ${maxAttempts}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx10(AnimatePresence8, { initial: false, children: showDetails && details && !recovered && /* @__PURE__ */ jsx10(
          motion9.pre,
          {
            className: "ak-error__details",
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: heightTransition(reduced),
            children: details
          },
          "details"
        ) }),
        /* @__PURE__ */ jsx10("span", { className: "ak-sr-only", role: "alert", children: status === "error" ? `${title}. ${message}` : "" }),
        /* @__PURE__ */ jsx10("span", { className: "ak-sr-only", role: "status", children: status === "retrying" ? "Retrying\u2026" : recovered ? `${recoveredTitle}. ${recoveredMessage}` : "" })
      ]
    }
  ) });
}
export {
  ApprovalCard,
  AutoHeight,
  ErrorRetry,
  KitProvider,
  StatusIcon,
  StepTimeline,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard,
  ToolResults,
  UndoToast,
  duration,
  ease,
  heightTransition,
  spring,
  useReducedMotionPref,
  useSmoothedText
};
//# sourceMappingURL=index.js.map