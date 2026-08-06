import crypto from 'crypto';
import mongoose from 'mongoose';
import Groq from "groq-sdk";
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// Simple in-memory conversation store, keyed by conversationId.
// Fine for a hackathon demo — resets on server restart, no DB overhead.
const conversations = new Map();

// Groq's chat-completions API follows OpenAI's tool-calling contract:
// { type: 'function', function: { name, description, parameters } }.
// (Not Anthropic's { name, input_schema } shape — those are not interchangeable.)
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: "Add a product to the buyer's cart when they clearly ask to buy/add it.",
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'The MongoDB _id of the product' },
          quantity: { type: 'number', description: 'How many units to add' },
        },
        required: ['productId', 'quantity'],
      },
    },
  },
];

// Lightweight retrieval: text search first, fall back to category/name regex
// if nothing matches (handles short or loosely-worded queries better).
const retrieveProducts = async (message) => {
  let products = await Product.find(
    { $text: { $search: message } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(6);

  if (products.length === 0) {
    products = await Product.find({
        $or: [
            { name: { $regex: message, $options: "i" } },
            { category: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } },
            { fabricType: { $regex: message, $options: "i" } },
        ],
    }).limit(6);
  }

  return products;
};

const executeAddToCart = async (req, res, productId, quantity) => {
  // Defensive: arguments come from model-generated JSON, not a validated
  // client request, so treat them as untrusted input.
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return { added: false, reason: 'That product could not be identified.' };
  }
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    return { added: false, reason: 'Quantity must be at least 1.' };
  }
  quantity = qty;

  const product = await Product.findById(productId);
  if (!product) return { added: false, reason: 'Product not found.' };
  if (product.stock < quantity) return { added: false, reason: `Only ${product.stock} in stock.` };

  const owner = req.user
    ? { ownerType: 'user', ownerId: req.user.id }
    : (() => {
        let guestToken = req.cookies?.guestToken;
        if (!guestToken) {
          guestToken = crypto.randomUUID();
          res.cookie('guestToken', guestToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
        }
        return { ownerType: 'guest', ownerId: guestToken };
      })();

  let cart = await Cart.findOne(owner);
  if (!cart) cart = await Cart.create({ ...owner, items: [] });

  const existing = cart.items.find((i) => i.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ productId, quantity });

  await cart.save();
  return { added: true, productId, quantity };
};

// POST /api/ai/chat  (public, auth-aware via attachUserIfPresent middleware)
export const chat = asyncHandler(async (req, res) => {
  const {
    message,
    conversationId = crypto.randomUUID(),
    } = req.body || {};

  if (!message || typeof message !== 'string') {
    throw new ApiError(400, 'A message is required.', 'VALIDATION_ERROR');
  }

  const products = await retrieveProducts(message);
  const history = conversations.get(conversationId) || [];

  const productContext = products.length
    ? `Relevant products from our catalog:\n${products
        .map(
          (p) =>
            `- id: ${p._id}, name: ${p.name}, category: ${p.category}, price: ₹${p.price}, stock: ${p.stock}, specs: ${JSON.stringify(p.specs)}`
        )
        .join('\n')}`
    : 'No matching products found in the catalog for this query.';

  const systemPrompt = `You are a helpful marketplace assistant for a B2B textile marketplace. Answer questions about fabrics, help with recommendations and comparisons, and use the add_to_cart tool ONLY when the user clearly asks to add/buy a specific product. Be concise and specific, referencing real product names and prices from the catalog data provided. Never invent products that aren't in the provided list.\n\n${productContext}`;

  const baseMessages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message },
  ];

  // Round 1: let the model see the tool and decide whether to call it.
  const first = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    messages: baseMessages,
    tools: TOOLS,
    tool_choice: 'auto',
  });

  const firstMessage = first.choices[0]?.message;
  const toolCall = firstMessage?.tool_calls?.find((tc) => tc.function?.name === 'add_to_cart');

  let replyText = firstMessage?.content || '';
  let cartAction = null;

  if (toolCall) {
    let args = {};
    try {
      args = JSON.parse(toolCall.function.arguments || '{}');
    } catch {
      // Malformed tool-call JSON from the model — fall through with empty
      // args so executeAddToCart's own validation reports a clean reason.
    }

    cartAction = await executeAddToCart(req, res, args.productId, args.quantity);

    // Round 2: feed the tool result back so the model phrases a natural
    // confirmation (or apology) instead of us hand-writing one.
    const second = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [
        ...baseMessages,
        firstMessage,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(cartAction),
        },
      ],
    });

    replyText = second.choices[0]?.message?.content || replyText;
  }

  if (!replyText) {
    replyText = "I'm sorry, I couldn't generate a response.";
  }

  history.push({
    role: "user",
    content: message,
    });

  if (toolCall) {
        history.push(firstMessage);

        history.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(cartAction),
        });
    }

  history.push({
        role: "assistant",
        content: replyText,
    });
  conversations.set(conversationId, history.slice(-10)); // cap history length

  res.status(200).json({
    reply: replyText,
    products:
        products.length > 0
            ? products.map((p) => ({
                _id: p._id,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: p.stock,
                image: p.image,
            }))
            : undefined,
    cartAction: cartAction || undefined,
    conversationId,
  });
});