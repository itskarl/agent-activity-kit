"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ApprovalCard,
  ErrorRetry,
  StepTimeline,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard,
  ToolResults,
  UndoToast,
  type ApprovalStatus,
  type ErrorRetryStatus,
  type Status,
  type ToolStatus,
} from "agent-activity-kit";
import { FileIcon, GlobeIcon, SearchIcon, UndoIcon } from "agent-activity-kit/icons";
import type { CodeTab } from "./code";
import { CodeContext, CodePanel, useCode } from "./CodePanel";
import { duplicateRecords } from "./data";
import { runScript, streamChunks } from "./sim";

function Section({
  id,
  index,
  title,
  description,
  notes,
  onReplay,
  replayLabel = "Replay",
  children,
}: {
  id: string;
  index: number;
  title: string;
  description: string;
  notes: string[];
  onReplay: () => void;
  replayLabel?: string;
  children: ReactNode;
}) {
  const code = useCode(id);
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section__intro">
        <p className="section__index">{String(index).padStart(2, "0")}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="section__desc">{description}</p>
        <ul className="notes">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
      <div className="section__demo">
        <div className="stage">
          <button type="button" className="stage__replay" onClick={onReplay}>
            <UndoIcon size={13} />
            {replayLabel}
          </button>
          <div className="stage__inner">{children}</div>
        </div>
        {code && <CodePanel tabs={code} />}
      </div>
    </section>
  );
}

/* 01 ─ Streaming text */

const streamSample = `Model output arrives in uneven bursts: a few words, a pause, then a whole sentence at once. Reading that is tiring, because your eyes keep jumping to catch up.

The smoothed version reveals text at a steady pace and only speeds up when it falls behind, so it never trails the real stream by more than a moment.`;

function StreamingSection() {
  const [run, setRun] = useState(0);
  const [stream, setStream] = useState({ text: "", done: false });

  useEffect(
    () =>
      runScript(async (sleep) => {
        setStream({ text: "", done: false });
        await sleep(500);
        await streamChunks(streamSample, (c) => setStream((s) => ({ ...s, text: s.text + c })), sleep);
        setStream((s) => ({ ...s, done: true }));
      }),
    [run],
  );

  return (
    <Section
      id="streaming"
      index={1}
      title="Streaming response"
      description="The same stream, rendered two ways. The left shows chunks as they arrive. The right paces them into a calm, readable reveal."
      notes={[
        "Smoothing adapts its speed to the backlog, so it never lags far behind.",
        "Words fade and un-blur in, without sliding. Nothing moves under your eyes.",
        "Screen readers hear “Responding…” once and “Response complete” at the end, not every chunk.",
      ]}
      onReplay={() => setRun((r) => r + 1)}
    >
      <div className="compare">
        <div className="compare__col">
          <p className="compare__label">Raw chunks</p>
          <StreamingText text={stream.text} done={stream.done} smooth={false} />
        </div>
        <div className="compare__col">
          <p className="compare__label compare__label--accent">Smoothed</p>
          <StreamingText text={stream.text} done={stream.done} />
        </div>
      </div>
    </Section>
  );
}

/* 02 ─ Thinking indicator */

const thinkingStatuses = ["Reading your notes", "Comparing three drafts", "Checking the style guide", "Picking the strongest opening"];

function ThinkingSection() {
  const [run, setRun] = useState(0);
  const [state, setState] = useState({ active: false, status: thinkingStatuses[0] });

  useEffect(
    () =>
      runScript(async (sleep) => {
        setState({ active: false, status: thinkingStatuses[0] });
        await sleep(300);
        setState({ active: true, status: thinkingStatuses[0] });
        for (const status of thinkingStatuses.slice(1)) {
          await sleep(1500);
          setState({ active: true, status });
        }
        await sleep(1600);
        setState((s) => ({ ...s, active: false }));
      }),
    [run],
  );

  return (
    <Section
      id="thinking"
      index={2}
      title="Thinking indicator"
      description="Shows that work is happening, and what kind, without the anxiety of a spinner. It settles into a quiet summary when it finishes."
      notes={[
        "A breathing orb and a light sweep give a sense of life at low contrast.",
        "Status lines move like a ticker: the old line exits up as the new one enters from below.",
        "Elapsed time is visible but hidden from screen readers, so it doesn't chatter every second.",
      ]}
      onReplay={() => setRun((r) => r + 1)}
    >
      <div className="center-stage">
        <ThinkingIndicator active={state.active} status={state.status} />
      </div>
    </Section>
  );
}

/* 03 ─ Tool calls */

const sources = [
  { id: "s1", title: "Designing for agent transparency", meta: "uxdesign.cc", icon: <GlobeIcon size={14} /> },
  { id: "s2", title: "Trust calibration in automated systems", meta: "acm.org", icon: <GlobeIcon size={14} /> },
  { id: "s3", title: "Undo as a safety net in UI", meta: "nngroup.com", icon: <GlobeIcon size={14} /> },
  { id: "s4", title: "Progressive disclosure, revisited", meta: "alistapart.com", icon: <GlobeIcon size={14} /> },
];

function ToolSection() {
  const [run, setRun] = useState(0);
  const [search, setSearch] = useState<ToolStatus>("running");
  const [file, setFile] = useState<ToolStatus>("running");

  useEffect(
    () =>
      runScript(async (sleep) => {
        setSearch("running");
        setFile("running");
        await sleep(1900);
        setSearch("done");
        await sleep(900);
        setFile("error");
      }),
    [run],
  );

  return (
    <Section
      id="tools"
      index={3}
      title="Tool-call card"
      description="Each tool call is one row: present tense while it runs, past tense with a result when it's done. Details are one click away."
      notes={[
        "The label swaps with a short blur-and-slide, so the tense change reads as progress.",
        "The status icon draws its check or cross instead of popping in.",
        "Height animates to auto on expand, and result rows stagger in.",
      ]}
      onReplay={() => setRun((r) => r + 1)}
    >
      <div className="stack" key={run}>
        <ToolCallCard
          icon={<SearchIcon />}
          label={{ running: "Searching the web", done: "Searched the web" }}
          status={search}
          summary="4 sources"
        >
          {search === "done" ? <ToolResults items={sources} /> : undefined}
        </ToolCallCard>
        <ToolCallCard
          icon={<FileIcon />}
          label={{ running: "Reading Q3-forecast.xlsx", done: "Read Q3-forecast.xlsx", error: "Couldn't open Q3-forecast.xlsx" }}
          status={file}
          summary="No access"
        >
          {file === "error" ? (
            <p className="muted-text">The file is in a shared drive you haven&apos;t connected yet. Connect it, or upload a copy.</p>
          ) : undefined}
        </ToolCallCard>
      </div>
    </Section>
  );
}

/* 04 ─ Step timeline */

const timelineLabels = ["Draft the outline", "Gather sources", "Write each section", "Send to reviewers", "Publish"];

function TimelineSection() {
  const [run, setRun] = useState(0);
  const [statuses, setStatuses] = useState<Status[]>(timelineLabels.map(() => "queued"));

  useEffect(
    () =>
      runScript(async (sleep) => {
        const next: Status[] = timelineLabels.map(() => "queued");
        const push = () => setStatuses([...next]);
        push();
        await sleep(500);
        for (let i = 0; i < 4; i++) {
          next[i] = "running";
          push();
          await sleep(1400);
          next[i] = i === 3 ? "failed" : "done";
          push();
          await sleep(250);
        }
      }),
    [run],
  );

  return (
    <Section
      id="timeline"
      index={4}
      title="Step timeline"
      description="A multi-step plan with queued, running, done and failed states. The rail fills as work completes, and failures stop the line with a reason."
      notes={[
        "The connector fills top-down with an ease-in-out, like progress flowing to the next step.",
        "The running step has a soft radiating ring. It's the only thing on the page that loops.",
        "Screen readers hear one sentence per change: “Step 2 of 5, Gather sources: done”.",
      ]}
      onReplay={() => setRun((r) => r + 1)}
    >
      <StepTimeline
        key={run}
        label="Publishing plan"
        steps={timelineLabels.map((label, i) => ({
          id: label,
          label,
          status: statuses[i],
          detail:
            i === 1
              ? "Reading 6 articles"
              : i === 2
                ? "Writing section 3 of 4"
                : i === 3
                  ? "The email service rate-limited this request. Try again in a minute."
                  : undefined,
        }))}
      />
    </Section>
  );
}

/* 05 ─ Approve or undo */

function ApprovalSection() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [undone, setUndone] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const reset = () => {
    setStatus("pending");
    setUndone(false);
    setToastOpen(false);
    setRun((r) => r + 1);
  };

  return (
    <Section
      id="approval"
      index={5}
      title="Approve or undo"
      description="Before anything destructive, the agent asks. After it acts, an undo window gives a second chance. Trust comes from both."
      notes={[
        "The card collapses into a one-line receipt, and focus moves to it so keyboard users aren't stranded.",
        "The undo timer pauses on hover, on focus and when the tab is hidden.",
        "Escape dismisses the toast. Nothing steals focus when it appears.",
      ]}
      onReplay={reset}
      replayLabel="Reset"
    >
      <div className="approval-stage" key={run}>
        <ApprovalCard
          status={status}
          title="Delete 3 duplicate records?"
          description="The originals stay. You can undo this for a few seconds afterward."
          items={duplicateRecords}
          confirmLabel="Delete 3 records"
          resultLabel={
            status === "cancelled"
              ? "Cancelled. Nothing was changed."
              : undone
                ? "Deletion undone. All 3 records are restored."
                : "Deleted 3 duplicate records"
          }
          onConfirm={() => {
            setStatus("confirmed");
            setToastOpen(true);
          }}
          onCancel={() => setStatus("cancelled")}
        />
        <div className="toast-anchor">
          <UndoToast
            open={toastOpen}
            message="Deleted 3 records"
            onUndo={() => {
              setToastOpen(false);
              setUndone(true);
            }}
            onDismiss={() => setToastOpen(false)}
          />
        </div>
      </div>
    </Section>
  );
}

/* 06 ─ Error and retry */

function ErrorSection() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState<ErrorRetryStatus>("error");
  const [attempt, setAttempt] = useState(1);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (retryKey === 0) return;
    return runScript(async (sleep) => {
      await sleep(1500);
      if (attempt < 2) {
        setAttempt((a) => a + 1);
        setStatus("error");
      } else {
        setStatus("recovered");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const reset = () => {
    setStatus("error");
    setAttempt(1);
    setRetryKey(0);
    setRun((r) => r + 1);
  };

  return (
    <Section
      id="errors"
      index={6}
      title="Error and retry"
      description="The unhappy path most demos skip. A clear reason, one obvious action, and a satisfying recovery. Retry twice to see it recover."
      notes={[
        "A small horizontal nudge marks each failure. It's skipped entirely with reduced motion.",
        "The retry button keeps its place and focus while it works, so nothing jumps.",
        "Recovery fades the card's color from red to green and the icon spins into a check.",
      ]}
      onReplay={reset}
      replayLabel="Reset"
    >
      <div key={run}>
        <ErrorRetry
          status={status}
          title="Couldn't reach Google Calendar"
          message={
            attempt === 1
              ? "The request timed out after 30 seconds. Your draft invite is saved."
              : "Still timing out. This usually clears up within a minute."
          }
          recoveredTitle="Back on track"
          recoveredMessage="Calendar is responding again, and I picked up where I left off."
          attempt={attempt}
          maxAttempts={3}
          details={`GET /calendar/v3/freeBusy\n504 Gateway Timeout · request 7f3c-21ab`}
          onRetry={() => {
            setStatus("retrying");
            setRetryKey((k) => k + 1);
          }}
        />
      </div>
    </Section>
  );
}

export function Sections({ code }: { code: Record<string, CodeTab[]> }) {
  return (
    <CodeContext.Provider value={code}>
      <StreamingSection />
      <ThinkingSection />
      <ToolSection />
      <TimelineSection />
      <ApprovalSection />
      <ErrorSection />
    </CodeContext.Provider>
  );
}
