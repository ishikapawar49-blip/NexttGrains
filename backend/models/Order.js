import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
  type: String,
  default: "",
},

    productImage: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Delivery Address
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // Ordered Products
    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalItems: {
      type: Number,
      required: true,
      min: 1,
    },

    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "Net Banking"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Accepted",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);