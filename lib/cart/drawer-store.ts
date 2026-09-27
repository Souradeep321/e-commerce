import { useSyncExternalStore } from "react";

// Plain external store for UI-only drawer state — not TanStack Query
// (this isn't server state) and not Context (no Provider needed to share
// it between CartIcon and CartDrawer; useSyncExternalStore is the correct
// primitive for external mutable state read by multiple components).
let isOpen = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function openDrawer() {
  isOpen = true;
  emitChange();
}

export function closeDrawer() {
  isOpen = false;
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return isOpen;
}

function getServerSnapshot() {
  return false; // drawer is always closed on the server render
}

export function useIsDrawerOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}