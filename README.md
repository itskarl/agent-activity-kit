# Agent Activity Kit

**[Live demo →](https://agent-activity-kit.vercel.app)**

Small, carefully animated React components for showing what an AI agent is doing: streaming answers, tool calls, multi-step plans, approvals, undo and recovery.

The goal is to make automation feel **trustworthy**: every state change is visible, explained and, where it matters, reversible.

## Components

| Component | What it shows |
| --- | --- |
| `StreamingText` | A streamed response, paced from bursty network chunks into a steady reveal |
| `ThinkingIndicator` | That work is happening and what kind, then a quiet "Thought for 6s" summary |
| `ToolCallCard` + `ToolResults` | One tool call: present tense while running, past tense plus a result when done, with expandable details |
| `StepTimeline` | A multi-step plan with queued, running, done and failed states |
| `ApprovalCard` | A confirmation before a destructive action that collapses into a one-line receipt |
| `UndoToast` | A timed undo window that pauses on hover, focus and hidden tabs |
| `ErrorRetry` | A failure with a reason, one clear action and a visible recovery |

## Usage

```tsx
import { KitProvider, ToolCallCard, ToolResults } from "@/kit";
import "@/kit/kit.css";

<KitProvider motion="system">
  <ToolCallCard
    label={{ running: "Searching the web", done: "Searched the web" }}
    status={status}
    summary="4 sources"
  >
    <ToolResults items={results} />
  </ToolCallCard>
</KitProvider>
```

Components are controlled: you pass the current status and they animate the transitions.

## Accessibility

- **Reduced motion.** `KitProvider` resolves `prefers-reduced-motion` (or an explicit override) once. Transforms, height animations, looping effects and text smoothing all turn off. State still reads through color and opacity.
- **Screen readers.** Each component announces meaningful changes once ("Step 2 of 5, Gather sources: done"), not every token or second.
- **Keyboard and focus.** Disclosures use real buttons with `aria-expanded`. When a decision removes the buttons, focus moves to the result instead of falling back to the page.
- **Timing.** The undo window pauses while you hover or focus it, or when the tab is hidden, and Escape dismisses it.

## Theming

Every component reads only `--ak-*` custom properties. The demo ships Light, Dark and a custom "Ember" brand theme, which also changes the corner radius, to show that a theme is just a different set of token values.

## Motion principles

1. **Smooth the network, not the content.** Pace the reveal, and keep the words themselves still.
2. **Motion explains a change of state.** Every animation answers "what just happened?"
3. **Reversible beats confirmable.** Ask before destructive actions, then offer undo anyway.
4. **Calm by default, honest under stress.** Only the active step loops. Errors get a reason and one action.

## Development

```bash
npm install
npm run dev
```

Built with Next.js, React and [Motion](https://motion.dev).

## License

MIT
