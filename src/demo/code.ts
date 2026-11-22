import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";
import { sources, usage } from "./snippets";

export interface CodeTab {
  label: string;
  code: string;
  html: string;
}

const highlight = (code: string, lang: string) =>
  codeToHtml(code, {
    lang,
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: false,
  });

/** Highlights each section's usage example and kit source at build time. */
export async function loadCode(): Promise<Record<string, CodeTab[]>> {
  const kitDir = path.join(process.cwd(), "src", "kit");
  const entries = await Promise.all(
    Object.keys(usage).map(async (id) => {
      const tabs: CodeTab[] = [{ label: "Usage", code: usage[id], html: await highlight(usage[id], "tsx") }];
      for (const file of sources[id] ?? []) {
        const code = (await readFile(path.join(kitDir, file), "utf8")).trimEnd();
        tabs.push({ label: file, code, html: await highlight(code, file.endsWith(".ts") ? "ts" : "tsx") });
      }
      return [id, tabs] as const;
    }),
  );
  return Object.fromEntries(entries);
}
