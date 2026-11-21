"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ApprovalCard,
  StepTimeline,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard,
  ToolResults,
  UndoToast,
  type ApprovalStatus,
  type Status,
  type TimelineStep,
  type ToolStatus,
} from "@/kit";
import { DatabaseIcon, LayersIcon, UserIcon } from "@/kit/icons";
import { ease } from "@/kit/motion";
import { answerCancelled, answerConfirmed, answerUndone, duplicateRecords } from "./data";
import { runScript, streamChunks } from "./sim";

type StepId = "search" | "dedupe" | "confirm" | "summary";
const initialSteps: Record<StepId, Status> = { search: "queued", dedupe: "queued", confirm: "queued", summary: "queued" };
type Sleep = (ms: number) => Promise<void>;

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: ease.out },
};

/** The full story: every component working together in one agent run. */
export function AgentRun() {
  const [runId, setRunId] = useState(0);
  const [thinking, setThinking] = useState<{ visible: boolean; active: boolean; status?: string }>({ visible: false, active: false });
  const [stepsVisible, setStepsVisible] = useState(false);
  const [stepStatus, setStepStatus] = useState(initialSteps);
  const [queryStatus, setQueryStatus] = useState<ToolStatus>("running");
  const [compareStatus, setCompareStatus] = useState<ToolStatus>("running");
  const [approval, setApproval] = useState<ApprovalStatus>("pending");
  const [undone, setUndone] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [answer, setAnswer] = useState({ visible: false, text: "", done: false });

  const decide = useRef<((d: "confirm" | "cancel") => void) | null>(null);
  const sleepRef = useRef<Sleep | null>(null);
  const answerQueue = useRef<Promise<void>>(Promise.resolve());

  const setStep = (id: StepId, status: Status) => setStepStatus((prev) => ({ ...prev, [id]: status }));

  // Streams are queued so a follow-up (like the undo note) always lands after the main answer.
  const queueStream = (text: string, sleep: Sleep, delay = 0) => {
    answerQueue.current = answerQueue.current.then(async () => {
      if (delay) await sleep(delay);
      setAnswer((a) => ({ ...a, visible: true, done: false }));
      setStep("summary", "running");
      await streamChunks(text, (chunk) => setAnswer((a) => ({ ...a, text: a.text + chunk })), sleep);
      setAnswer((a) => ({ ...a, done: true }));
    });
    return answerQueue.current;
  };

  useEffect(
    () =>
      runScript(async (sleep, signal) => {
        sleepRef.current = sleep;
        answerQueue.current = Promise.resolve();
        setThinking({ visible: false, active: false });
        setStepsVisible(false);
        setStepStatus(initialSteps);
        setQueryStatus("running");
        setCompareStatus("running");
        setApproval("pending");
        setUndone(false);
        setToastOpen(false);
        setAnswer({ visible: false, text: "", done: false });

        await sleep(700);
        setThinking({ visible: true, active: true, status: "Reading the request" });
        await sleep(1300);
        setThinking((t) => ({ ...t, status: "Checking the CRM schema" }));
        await sleep(1300);
        setThinking((t) => ({ ...t, status: "Planning the cleanup" }));
        await sleep(1200);
        setThinking((t) => ({ ...t, active: false }));

        await sleep(350);
        setStepsVisible(true);
        await sleep(450);
        setStep("search", "running");
        await sleep(1800);
        setQueryStatus("done");
        await sleep(500);
        setStep("search", "done");

        setStep("dedupe", "running");
        await sleep(2000);
        setCompareStatus("done");
        await sleep(500);
        setStep("dedupe", "done");

        setStep("confirm", "running");
        const decision = await new Promise<"confirm" | "cancel">((resolve, reject) => {
          decide.current = resolve;
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
        });
        decide.current = null;

        if (decision === "confirm") {
          setApproval("confirmed");
          setToastOpen(true);
        } else {
          setApproval("cancelled");
        }
        const streamed = queueStream(decision === "confirm" ? answerConfirmed : answerCancelled, sleep, 900);
        await sleep(450);
        setStep("confirm", "done");
        await streamed;
      }),
    [runId],
  );

  const handleUndo = () => {
    setToastOpen(false);
    setUndone(true);
    if (sleepRef.current) queueStream(answerUndone, sleepRef.current).catch(() => {});
  };

  const steps: TimelineStep[] = [
    {
      id: "search",
      label: "Find last week's import",
      status: stepStatus.search,
      content: (
        <ToolCallCard
          icon={<DatabaseIcon />}
          label={{ running: "Querying the CRM", done: "Queried the CRM" }}
          status={queryStatus}
          summary="1,204 records"
        >
          <pre className="code">
            {`SELECT * FROM customers\nWHERE import_id = 'nov-12-batch'`}
          </pre>
        </ToolCallCard>
      ),
    },
    {
      id: "dedupe",
      label: "Look for duplicates",
      status: stepStatus.dedupe,
      content: (
        <ToolCallCard
          icon={<LayersIcon />}
          label={{ running: "Comparing records", done: "Compared records" }}
          status={compareStatus}
          summary="3 duplicates"
        >
          {compareStatus === "done" ? (
            <ToolResults
              items={duplicateRecords.map((r) => ({ id: r.id, title: r.label, meta: "2 copies", icon: <UserIcon size={14} /> }))}
            />
          ) : undefined}
        </ToolCallCard>
      ),
    },
    {
      id: "confirm",
      label: "Ask before deleting",
      status: stepStatus.confirm,
      detail: approval === "pending" ? "Waiting for your approval" : undefined,
      content: (
        <ApprovalCard
          status={approval}
          title="Delete 3 duplicate records?"
          description="The originals stay. You can undo this for a few seconds afterward."
          items={duplicateRecords}
          confirmLabel="Delete 3 records"
          resultLabel={
            approval === "cancelled"
              ? "Cancelled. Nothing was changed."
              : undone
                ? "Deletion undone. All 3 records are restored."
                : "Deleted 3 duplicate records"
          }
          onConfirm={() => decide.current?.("confirm")}
          onCancel={() => decide.current?.("cancel")}
        />
      ),
    },
    { id: "summary", label: "Summarize what changed", status: stepStatus.summary },
  ];

  return (
    <div className="run">
      <div className="run__bar">
        <span className="run__title">
          <span className="run__dot" aria-hidden="true" />
          Live demo
        </span>
        <button type="button" className="ak-btn ak-btn--ghost run__replay" onClick={() => setRunId((r) => r + 1)}>
          Run again
        </button>
      </div>

      <div className="run__body">
        <div className="msg msg--user">
          Clean up the duplicate customer records from last week&apos;s import, and tell me what you changed.
        </div>

        <div className="run__agent">
          <AnimatePresence>
            {thinking.visible && (
              <motion.div key="thinking" {...fadeUp}>
                <ThinkingIndicator active={thinking.active} status={thinking.status} />
              </motion.div>
            )}
          </AnimatePresence>

          {stepsVisible && (
            <motion.div {...fadeUp}>
              <StepTimeline steps={steps} label="Cleanup progress" />
            </motion.div>
          )}

          {answer.visible && (
            <motion.div className="run__answer" {...fadeUp}>
              <StreamingText text={answer.text} done={answer.done} onComplete={() => setStep("summary", "done")} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="toast-anchor">
        <UndoToast
          open={toastOpen}
          message="Deleted 3 records"
          duration={7000}
          onUndo={handleUndo}
          onDismiss={() => setToastOpen(false)}
        />
      </div>
    </div>
  );
}
