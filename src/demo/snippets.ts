/** Usage examples shown in each section's "Show code" panel. */

export const usage: Record<string, string> = {
  run: `import {
  ApprovalCard, StepTimeline, StreamingText,
  ThinkingIndicator, ToolCallCard, UndoToast,
} from "@/kit";

export function AgentMessage({ run }: { run: AgentRunState }) {
  return (
    <>
      <ThinkingIndicator active={run.thinking} status={run.thinkingStatus} />

      <StepTimeline
        steps={[
          {
            id: "search",
            label: "Find last week's import",
            status: run.steps.search,
            content: (
              <ToolCallCard
                label={{ running: "Querying the CRM", done: "Queried the CRM" }}
                status={run.query.status}
                summary={run.query.summary}
              />
            ),
          },
          {
            id: "confirm",
            label: "Ask before deleting",
            status: run.steps.confirm,
            content: (
              <ApprovalCard
                status={run.approval}
                title="Delete 3 duplicate records?"
                confirmLabel="Delete 3 records"
                resultLabel="Deleted 3 duplicate records"
                onConfirm={run.confirm}
                onCancel={run.cancel}
              />
            ),
          },
        ]}
      />

      <StreamingText text={run.answer} done={run.answerDone} />

      <UndoToast
        open={run.canUndo}
        message="Deleted 3 records"
        onUndo={run.undo}
        onDismiss={run.dismissUndo}
      />
    </>
  );
}`,

  streaming: `import { StreamingText } from "@/kit";

export function Answer() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Append chunks exactly as they arrive. StreamingText paces the reveal.
    const stream = openModelStream();
    stream.on("chunk", (chunk) => setText((t) => t + chunk));
    stream.on("end", () => setDone(true));
    return () => stream.close();
  }, []);

  return <StreamingText text={text} done={done} />;
}

// Turn pacing off to render chunks as they land:
<StreamingText text={text} done={done} smooth={false} />`,

  thinking: `import { ThinkingIndicator } from "@/kit";

<ThinkingIndicator
  active={isThinking}
  status={currentStep} // "Reading your notes", "Comparing three drafts"…
/>

// Custom copy for the finished state:
<ThinkingIndicator
  active={isThinking}
  label="Planning"
  doneLabel={(s) => \`Planned in \${s}s\`}
/>`,

  tools: `import { ToolCallCard, ToolResults } from "@/kit";
import { GlobeIcon, SearchIcon } from "@/kit/icons";

<ToolCallCard
  icon={<SearchIcon />}
  label={{
    running: "Searching the web",
    done: "Searched the web",
    error: "Search failed",
  }}
  status={call.status} // "running" | "done" | "error"
  summary={call.status === "done" ? \`\${call.results.length} sources\` : undefined}
>
  {call.status === "done" && (
    <ToolResults
      items={call.results.map((r) => ({
        id: r.url,
        title: r.title,
        meta: r.domain,
        icon: <GlobeIcon size={14} />,
      }))}
    />
  )}
</ToolCallCard>`,

  timeline: `import { StepTimeline, type TimelineStep } from "@/kit";

const steps: TimelineStep[] = [
  { id: "outline", label: "Draft the outline", status: "done" },
  { id: "sources", label: "Gather sources", status: "done" },
  {
    id: "write",
    label: "Write each section",
    status: "running",
    detail: "Writing section 3 of 4", // shown while running or failed
  },
  { id: "review", label: "Send to reviewers", status: "queued" },
];

<StepTimeline steps={steps} label="Publishing plan" />

// Steps can hold rich content, such as tool calls, once they start:
{ id: "search", label: "Search", status, content: <ToolCallCard … /> }`,

  approval: `import { ApprovalCard, UndoToast, type ApprovalStatus } from "@/kit";

export function DeleteDuplicates({ records }: { records: Customer[] }) {
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [undoOpen, setUndoOpen] = useState(false);

  return (
    <>
      <ApprovalCard
        status={status}
        title={\`Delete \${records.length} duplicate records?\`}
        description="The originals stay. You can undo this for a few seconds afterward."
        items={records.map((r) => ({ id: r.id, label: r.name, meta: r.email }))}
        confirmLabel={\`Delete \${records.length} records\`}
        resultLabel={status === "cancelled" ? "Cancelled. Nothing was changed." : "Deleted"}
        onConfirm={() => {
          setStatus("confirmed");
          setUndoOpen(true);
          deleteRecords(records);
        }}
        onCancel={() => setStatus("cancelled")}
      />

      <UndoToast
        open={undoOpen}
        message={\`Deleted \${records.length} records\`}
        duration={6000} // pauses on hover, focus and hidden tabs
        onUndo={() => {
          setUndoOpen(false);
          restoreRecords(records);
        }}
        onDismiss={() => setUndoOpen(false)}
      />
    </>
  );
}`,

  errors: `import { ErrorRetry, type ErrorRetryStatus } from "@/kit";

const [status, setStatus] = useState<ErrorRetryStatus>("error");
const [attempt, setAttempt] = useState(1);

async function retry() {
  setStatus("retrying");
  try {
    await syncCalendar();
    setStatus("recovered");
  } catch {
    setAttempt((a) => a + 1);
    setStatus("error");
  }
}

<ErrorRetry
  status={status}
  title="Couldn't reach Google Calendar"
  message="The request timed out after 30 seconds. Your draft invite is saved."
  recoveredTitle="Back on track"
  recoveredMessage="Calendar is responding again, and I picked up where I left off."
  attempt={attempt}
  maxAttempts={3}
  details="GET /calendar/v3/freeBusy\\n504 Gateway Timeout"
  onRetry={retry}
/>`,
};

/** Kit source files shown alongside each example. */
export const sources: Record<string, string[]> = {
  run: ["index.ts", "motion.ts", "KitProvider.tsx"],
  streaming: ["StreamingText.tsx"],
  thinking: ["ThinkingIndicator.tsx", "useElapsed.ts"],
  tools: ["ToolCallCard.tsx", "StatusIcon.tsx"],
  timeline: ["StepTimeline.tsx"],
  approval: ["ApprovalCard.tsx", "UndoToast.tsx", "AutoHeight.tsx"],
  errors: ["ErrorRetry.tsx"],
};
