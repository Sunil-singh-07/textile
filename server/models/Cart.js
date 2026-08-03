import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ['guest', 'user'],
      required: true,
    },
    ownerId: {
      type: String, // guestToken string OR User._id.toString() — kept as String
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
  },
  { timestamps: true }
);

// One active cart per owner
cartSchema.index({ ownerType: 1, ownerId: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
