import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Settled"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const vendorWalletSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentBalance: {
      type: Number,
      default: 0,
    },

    pendingSettlement: {
      type: Number,
      default: 0,
    },

    settledAmount: {
      type: Number,
      default: 0,
    },

    lifetimeEarnings: {
      type: Number,
      default: 0,
    },

    transactions: [walletTransactionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("VendorWallet", vendorWalletSchema);