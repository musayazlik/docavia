import { useSyncExternalStore } from "react";

let cached = 0;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  // cached so repeated calls within a render return an identical value
  const now = Date.now();
  if (now - cached > 30_000) cached = now;
  return cached;
}

function getServerSnapshot() {
  return null;
}

/**
 * Wall-clock tick that is `null` during prerender and hydration, then
 * switches to the client clock (refreshed once a minute). Lets components
 * show "today"/"open now" state without hydration mismatches.
 */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
