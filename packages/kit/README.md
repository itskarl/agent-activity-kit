# agent-activity-kit

Animated, accessible React components for showing what an AI agent is doing: streaming answers, tool calls, multi-step plans, approvals, undo and recovery.

**[Live demo and docs →](https://agent-activity-kit.vercel.app)**

## Install

```bash
npm i agent-activity-kit motion
```

`react`, `react-dom` (18 or later) and `motion` (12 or later) are peer dependencies.

## Setup

Import the styles once, in your root layout or entry file, and wrap your app in `KitProvider`:

```tsx
import "agent-activity-kit/styles.css";
import { KitProvider } from "agent-activity-kit";

export default function App({ children }) {
  return <KitProvider motion="system">{children}</KitProvider>;
}
```

`motion` accepts `"system"` (follows `prefers-reduced-motion`), `"reduced"` or `"full"`.

## Components

| Component | What it shows |
| --- | --- |
| `StreamingText` | A streamed response, paced from bursty chunks into a steady reveal |
| `ThinkingIndicator` | That work is happening and what kind, then a "Thought for 6s" summary |
| `ToolCallCard`, `ToolResults` | One tool call, present tense while running and past tense with a result when done |
| `StepTimeline` | A multi-step plan with queued, running, done and failed states |
| `ApprovalCard` | A confirmation before a destructive action that collapses into a receipt |
| `UndoToast` | A timed undo window that pauses on hover, focus and hidden tabs |
| `ErrorRetry` | A failure with a reason, one clear action and a visible recovery |

Also exported: `StatusIcon`, `AutoHeight`, the motion tokens `ease`, `duration`, `spring` and `heightTransition`, and icons from `agent-activity-kit/icons`.

```tsx
import { ToolCallCard, ToolResults } from "agent-activity-kit";
import { SearchIcon } from "agent-activity-kit/icons";

<ToolCallCard
  icon={<SearchIcon />}
  label={{ running: "Searching the web", done: "Searched the web" }}
  status={status}
  summary="4 sources"
>
  <ToolResults items={results} />
</ToolCallCard>
```

Components are controlled: pass the current status and they animate the transitions. Every example on the [demo site](https://agent-activity-kit.vercel.app) has a "Show code" panel.

## Theming

Components read only `--ak-*` CSS custom properties. Override them on `:root` or any wrapper:

```css
:root {
  --ak-accent: #0f766e;
  --ak-radius: 8px;
}
```

Light and dark values are built in. Dark applies under `prefers-color-scheme: dark` or `data-theme="dark"` on `<html>`. Set `data-theme="light"` to force light.

## Accessibility

- Reduced motion turns off transforms, height animation, looping effects and text pacing. State still reads through color and opacity.
- Screen readers hear one sentence per meaningful change, not every token.
- When a decision removes buttons, focus moves to the result.
- The undo window pauses on hover, focus and hidden tabs, and Escape dismisses it.

## Next.js and React Server Components

The package is a client module, so components work in Server Components without extra wrappers. Use the motion tokens inside client components.

## License

MIT © Karl Rodulfo
