/** Helpers that fake an agent's timing so the demos feel like real streams. */

export function makeSleep(signal: AbortSignal) {
  return (ms: number) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
      const id = window.setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(id);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });
}

export const isAbort = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

/** Emits `full` in irregular chunks, with the occasional big burst, like a real model stream. */
export async function streamChunks(full: string, onChunk: (chunk: string) => void, sleep: (ms: number) => Promise<void>) {
  let i = 0;
  while (i < full.length) {
    const burst = Math.random() < 0.14;
    const size = burst ? 40 + Math.floor(Math.random() * 60) : 3 + Math.floor(Math.random() * 14);
    onChunk(full.slice(i, i + size));
    i += size;
    await sleep(burst ? 380 + Math.random() * 320 : 30 + Math.random() * 130);
  }
}

/** Runs an async script and cancels it whenever `key` changes or the component unmounts. */
export function runScript(script: (sleep: (ms: number) => Promise<void>, signal: AbortSignal) => Promise<void>) {
  const controller = new AbortController();
  script(makeSleep(controller.signal), controller.signal).catch((e) => {
    if (!isAbort(e)) throw e;
  });
  return () => controller.abort();
}
