# Agent Activity Kit

**[Live demo →](https://agent-activity-kit.vercel.app)** · **[npm →](https://www.npmjs.com/package/agent-activity-kit)**

Small, carefully animated React components for showing what an AI agent is doing: streaming answers, tool calls, multi-step plans, approvals, undo and recovery.

The goal is to make automation feel **trustworthy**: every state change is visible, explained and, where it matters, reversible.

```bash
npm i agent-activity-kit motion
```

See the [package README](packages/kit/README.md) for setup, components, theming and accessibility.

## Repository layout

| Path | What it is |
| --- | --- |
| `packages/kit` | The `agent-activity-kit` npm package: components, tokens and styles |
| `src` | The Next.js demo and docs site, which uses the package like any consumer would |

## Motion principles

1. **Smooth the network, not the content.** Pace the reveal, and keep the words themselves still.
2. **Motion explains a change of state.** Every animation answers "what just happened?"
3. **Reversible beats confirmable.** Ask before destructive actions, then offer undo anyway.
4. **Calm by default, honest under stress.** Only the active step loops. Errors get a reason and one action.

## Development

```bash
npm install
npm run dev        # builds the package, then starts the demo
npm run dev:kit    # in a second terminal, rebuilds the package on change
```

## Releasing

```bash
npm run changeset          # describe the change
npm run version-packages   # bump the version and update the changelog
npm run release            # build and publish to npm
```

## License

MIT
