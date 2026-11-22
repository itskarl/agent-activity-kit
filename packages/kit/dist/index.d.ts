import * as react from 'react';
import { ReactNode } from 'react';
import { Transition } from 'motion/react';

type MotionPreference = "system" | "reduced" | "full";
/**
 * Resolves the reduced-motion preference once for the whole kit: Motion's
 * transforms, the kit's CSS animations (via data-motion) and JS-driven effects
 * like text smoothing all read from here.
 */
declare function KitProvider({ motion, children, }: {
    motion?: MotionPreference;
    children: ReactNode;
}): react.JSX.Element;
declare function useReducedMotionPref(): boolean;

/**
 * Network streams arrive in bursts. This reveals `target` at a steady pace
 * that speeds up with the backlog, so a big chunk never lands as a wall of text
 * and the reveal never falls far behind the stream.
 */
declare function useSmoothedText(target: string, enabled: boolean): string;
interface StreamingTextProps {
    /** Everything received so far. Grow it as chunks arrive. */
    text: string;
    /** True once the stream has ended. */
    done: boolean;
    /** Pace bursty chunks into a steady reveal. Defaults to true. */
    smooth?: boolean;
    /** Called once the final character is on screen. */
    onComplete?: () => void;
    className?: string;
}
declare function StreamingText({ text, done, smooth, onComplete, className }: StreamingTextProps): react.JSX.Element;

interface ThinkingIndicatorProps {
    active: boolean;
    /** What the agent is doing right now. Changes slide in like a ticker. */
    status?: string;
    label?: string;
    doneLabel?: (seconds: number) => string;
}
declare function ThinkingIndicator({ active, status, label, doneLabel, }: ThinkingIndicatorProps): react.JSX.Element;

type ToolStatus = "running" | "done" | "error";
interface ToolCallCardProps {
    icon?: ReactNode;
    /** Present tense while running, past tense when done: "Searching the web" → "Searched the web". */
    label: {
        running: string;
        done: string;
        error?: string;
    };
    status: ToolStatus;
    /** A short result, such as "4 sources". Appears when the call finishes. */
    summary?: string;
    /** Expandable details: results, arguments, output. */
    children?: ReactNode;
    defaultOpen?: boolean;
}
declare function ToolCallCard({ icon, label, status, summary, children, defaultOpen }: ToolCallCardProps): react.JSX.Element;
interface ToolResult {
    id: string;
    title: string;
    meta?: string;
    icon?: ReactNode;
}
/** A result list whose rows stagger in. */
declare function ToolResults({ items }: {
    items: ToolResult[];
}): react.JSX.Element;

type Status = "queued" | "running" | "done" | "failed";
/** A status glyph that cross-scales between states and draws its check or cross. */
declare function StatusIcon({ status, size }: {
    status: Status;
    size?: number;
}): react.JSX.Element;

interface TimelineStep {
    id: string;
    label: string;
    status: Status;
    /** One line shown while the step is running or after it fails. */
    detail?: string;
    /** Rich content, such as tool calls, shown once the step has started. */
    content?: ReactNode;
}
declare function StepTimeline({ steps, label }: {
    steps: TimelineStep[];
    label?: string;
}): react.JSX.Element;

type ApprovalStatus = "pending" | "confirmed" | "cancelled";
interface ApprovalItem {
    id: string;
    label: string;
    meta?: string;
}
interface ApprovalCardProps {
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
declare function ApprovalCard({ status, title, description, items, confirmLabel, cancelLabel, resultLabel, tone, onConfirm, onCancel, }: ApprovalCardProps): react.JSX.Element;

interface UndoToastProps {
    open: boolean;
    message: string;
    /** Milliseconds before the toast closes on its own. Paused on hover, focus or a hidden tab. */
    duration?: number;
    undoLabel?: string;
    onUndo: () => void;
    onDismiss: () => void;
}
declare function UndoToast({ open, ...props }: UndoToastProps): react.JSX.Element;

type ErrorRetryStatus = "error" | "retrying" | "recovered";
interface ErrorRetryProps {
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
declare function ErrorRetry({ status, title, message, recoveredTitle, recoveredMessage, onRetry, attempt, maxAttempts, details, }: ErrorRetryProps): react.JSX.Element;

/** Animates its height to fit its children whenever they change size. */
declare function AutoHeight({ children, className }: {
    children: ReactNode;
    className?: string;
}): react.JSX.Element;

type Bezier = [number, number, number, number];
/** Shared motion tokens. Mirrors the CSS custom properties in kit.css. */
declare const ease: {
    out: Bezier;
    inOut: Bezier;
};
declare const duration: {
    fast: number;
    base: number;
    slow: number;
};
declare const spring: Record<"snappy" | "gentle", Transition>;
/** Height transitions collapse to instant when reduced motion is on. */
declare function heightTransition(reduced: boolean): Transition;

export { ApprovalCard, type ApprovalCardProps, type ApprovalItem, type ApprovalStatus, AutoHeight, ErrorRetry, type ErrorRetryProps, type ErrorRetryStatus, KitProvider, type MotionPreference, type Status, StatusIcon, StepTimeline, StreamingText, type StreamingTextProps, ThinkingIndicator, type ThinkingIndicatorProps, type TimelineStep, ToolCallCard, type ToolCallCardProps, type ToolResult, ToolResults, type ToolStatus, UndoToast, type UndoToastProps, duration, ease, heightTransition, spring, useReducedMotionPref, useSmoothedText };
