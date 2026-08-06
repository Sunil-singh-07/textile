import axiosClient from './axiosClient';

// Maps to server/routes/aiRoutes.js -> POST /ai/chat. Public, auth-aware
// (works for guests and logged-in buyers alike, same as cart).
//
// conversationId is optional on the first call — the backend generates one
// server-side and the conversation history is kept in-memory keyed by it.
// The caller MUST capture conversationId from the response and pass it back
// on every subsequent message, or the assistant loses all context.
//
// Response shape note: an earlier backend build had a key typo that sent
// `produproducts` / `cts` instead of `products` in the response body. That
// was flagged and acknowledged as fixed on the backend, so this service
// reads `products` as the primary key — but falls back to the old typo'd
// keys defensively in case an unpatched server instance is still running.
export const aiApi = {
  chat: (message, conversationId) =>
    axiosClient.post('/ai/chat', { message, conversationId }).then((res) => {
      const data = res.data;
      const products = data.products ?? data.produproducts ?? data.cts ?? undefined;
      return { ...data, products };
    }),
};
