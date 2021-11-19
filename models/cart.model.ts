import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    status: { type: String, default: "Pending" },
    totalPrice: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Cart", cartSchema);
