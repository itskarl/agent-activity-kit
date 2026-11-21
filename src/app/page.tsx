import { AgentRun } from "@/demo/AgentRun";
import { DemoShell } from "@/demo/DemoShell";
import { Sections } from "@/demo/Sections";

const principles = [
  {
    title: "Smooth the network, not the content",
    body: "Streams are bursty, but reading shouldn't be. Pace the reveal, and keep the words themselves still.",
  },
  {
    title: "Motion explains a change of state",
    body: "Every animation answers “what just happened?”: a step finished, a call failed, a choice was recorded. Nothing moves just to decorate.",
  },
  {
    title: "Reversible beats confirmable",
    body: "Ask before destructive actions, then offer undo anyway. A second chance builds more trust than a scarier dialog.",
  },
  {
    title: "Calm by default, honest under stress",
    body: "Only the active step loops. Errors get a reason and one clear action. With reduced motion, state still reads through color and opacity.",
  },
];

export default function Home() {
  return (
    <DemoShell>
      <main className="page">
        <header className="hero">
          <p className="eyebrow">Open-source React components</p>
          <h1>Agent Activity Kit</h1>
          <p className="lead">
            Small, carefully animated components for showing what an AI agent is doing: streaming answers, tool calls,
            multi-step plans, approvals, undo and recovery. Built to make automation feel trustworthy, accessible from the
            first commit, and themed entirely with design tokens.
          </p>
          <nav className="toc" aria-label="Components">
            <a href="#streaming">Streaming</a>
            <a href="#thinking">Thinking</a>
            <a href="#tools">Tool calls</a>
            <a href="#timeline">Timeline</a>
            <a href="#approval">Approve &amp; undo</a>
            <a href="#errors">Errors</a>
            <a href="#principles">Principles</a>
          </nav>
        </header>

        <AgentRun />

        <div className="sections">
          <Sections />
        </div>

        <section className="principles" id="principles" aria-labelledby="principles-title">
          <h2 id="principles-title">Motion principles</h2>
          <div className="principles__grid">
            {principles.map((p) => (
              <article key={p.title} className="principle">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>
            Built by Karl Rodulfo with React, Next.js and Motion. Respects <code>prefers-reduced-motion</code>, works with a
            keyboard, and announces changes to screen readers.
          </p>
        </footer>
      </main>
    </DemoShell>
  );
}
