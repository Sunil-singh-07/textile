import { z } from 'zod';

// Mirrors server/controllers/orderController.js's placeOrder validation:
// shippingInfo.name, .address, and .phone are all required, non-empty
// strings — nothing more, nothing less. Keeping this in lockstep so a
// client-side rejection never says something the backend would disagree with.
export const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  address: z.string().trim().min(1, 'Shipping address is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
});
