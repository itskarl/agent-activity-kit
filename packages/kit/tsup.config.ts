import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: { index: "src/index.ts", icons: "src/icons.tsx" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  // Don't wipe dist while watching, or a running demo briefly loses the package.
  clean: !options.watch,
  splitting: true,
  target: "es2020",
  // Every component uses state or effects, so the whole bundle is a client module.
  banner: { js: '"use client";' },
  external: ["react", "react-dom", "react/jsx-runtime", "motion", "motion/react"],
  onSuccess: "cp src/styles.css dist/styles.css",
}));
