import { useSyncExternalStore } from "react";

// Tiny shared flag: flips true the moment the Preloader finishes, so the hero
// wordmark, the hero description and the header items can all run one
// coordinated entrance as the preloader lifts (instead of animating on mount,
// hidden behind the preloader). Module-level so any client component can read it
// without prop-drilling or a provider.

let loaded = false;
const listeners = new Set<() => void>();

/** Called once by the Preloader when loading completes. Idempotent. */
export function markLoaded(): void {
  if (loaded) return;
  loaded = true;
  for (const notify of listeners) notify();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** True once the preloader has finished; drives the post-load entrances. */
export function useLoaded(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => loaded,
    () => false, // server + first client render: not loaded yet
  );
}
