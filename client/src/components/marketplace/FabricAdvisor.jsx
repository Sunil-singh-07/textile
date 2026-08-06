import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { aiApi } from '../../api/aiApi';
import { cartApi } from '../../api/cartApi';
import { formatCurrency } from '../../utils/formatters';
import Spinner from '../ui/Spinner';

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  content:
    "Hi, I'm your Fabric Advisor. Ask me to recommend a fabric, compare two options, or add something to your cart.",
};

// POST /ai/chat never echoes a conversationId back (see server/controllers/
// aiController.js — it generates one internally but only uses it to key its
// in-memory history map, it's not in the response body). So instead of
// waiting to "capture" one that never arrives, we mint our own client-side
// and send it on every call — the backend accepts a caller-supplied id just
// as happily, and this is what actually makes multi-turn context work.
const createConversationId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `conv-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const FabricAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const conversationId = useMemo(createConversationId, []);
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const chatMutation = useMutation({
    mutationFn: (message) => aiApi.chat(message, conversationId),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply, products: data.products },
      ]);
      if (data.cartAction?.added) {
        toast.success('Added to your cart');
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: () => {
      // axiosClient's interceptor already toasts the error — just keep the
      // thread readable instead of leaving the user's message hanging.
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "Sorry, I couldn't reach the advisor just now. Please try again.",
        },
      ]);
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.addItem(productId, quantity),
    onSuccess: () => {
      toast.success('Added to your cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = draft.trim();
    if (!message || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: message }]);
    setDraft('');
    chatMutation.mutate(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mb-3 flex h-[30rem] w-96 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated"
          >
            <header className="flex items-center justify-between border-b border-border bg-primary-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <div>
                  <p className="font-display text-sm font-medium text-ink">Fabric Advisor</p>
                  <p className="text-xs text-muted">AI-powered, ask anything</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Fabric Advisor"
                className="rounded-full p-1.5 text-ink/60 hover:bg-primary-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary text-background'
                        : 'bg-background text-ink'
                    }`}
                  >
                    <p>{message.content}</p>

                    {message.products?.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {message.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2.5 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-ink">{product.name}</p>
                              <p className="font-mono text-[11px] text-muted">
                                {formatCurrency(product.price)}/m
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                addToCartMutation.mutate({ productId: product._id, quantity: 1 })
                              }
                              disabled={addToCartMutation.isPending || product.stock === 0}
                              aria-label={`Add ${product.name} to cart`}
                              className="shrink-0 rounded-full bg-accent-100 p-1.5 text-accent-600 transition-colors hover:bg-accent-300 disabled:opacity-40"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-background px-3.5 py-2.5">
                    <Spinner size="sm" />
                    <span className="text-xs text-muted">Thinking…</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about GSM, MOQ, blends…"
                aria-label="Message the Fabric Advisor"
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
              />
              <button
                type="submit"
                disabled={!draft.trim() || chatMutation.isPending}
                aria-label="Send message"
                className="shrink-0 rounded-full bg-primary p-2.5 text-background transition-colors hover:bg-primary-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close Fabric Advisor' : 'Open Fabric Advisor'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background shadow-elevated hover:bg-primary-700"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </motion.button>
    </div>
  );
};

export default FabricAdvisor;
