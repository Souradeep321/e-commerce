// Singleton BroadcastChannel — module-level, not per-component-mount, so
// N components calling useCart() don't each open their own channel.
const CHANNEL_NAME = "cart-sync";
type CartBroadcastMessage = { type: "cart-updated" };

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function notifyCartUpdated() {
  getChannel()?.postMessage({ type: "cart-updated" } satisfies CartBroadcastMessage);
}

export function subscribeCartUpdates(onUpdate: () => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const handler = (event: MessageEvent<CartBroadcastMessage>) => {
    if (event.data?.type === "cart-updated") onUpdate();
  };
  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}