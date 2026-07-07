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
sku:{
    type:String,
    default:""
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
unit:{
    type:String,
    default:""
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
platformFee: {
    type: Number,
    default: 0
},

handlingCharge: {
    type: Number,
    default: 0
},

packingCharge: {
    type: Number,
    default: 0
},

tax: {
    type: Number,
    default: 0
},

couponCode: {
    type: String,
    default: ""
},

couponDiscount: {
    type: Number,
    default: 0
},
    // Payment
    paymentMethod: {
      type: String,
enum:[
"COD",
"UPI",
"Credit Card",
"Debit Card",
"Net Banking",
]
    },

    paymentStatus: {
      type: String,
enum:[
"Pending",
"Paid",
"Failed",
"Refunded",
"Partially Refunded"
],
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
    "Return Requested",
    "Returned",
    "Refunded"
  ],
  default: "Pending",
},
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },
deliveryPartner:{
    type:String,
    trim:true,
    default:""
},

trackingId: {
    type: String,
    trim: true,
    default: ""
},

trackingUrl: {
    type: String,
    trim: true,
    default: ""
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
    adminRemark: {
    type: String,
    default: ""
},

customerRemark: {
    type: String,
    default: ""
},
    invoiceNumber:{
    type:String,
    default:""
},

invoiceUrl:{
    type:String,
    default:""
},
refundAmount:{
    type:Number,
    default:0
},

refundStatus:{
    type:String,
    enum:[
        "None",
        "Requested",
        "Approved",
        "Rejected",
        "Completed"
    ],
    default:"None"
},
returnReason:{
    type:String,
    default:""
},

returnRequested:{
    type:Boolean,
    default:false
},
deliveryOTP: {
    type: String,
    default: null
},
statusHistory: [
{
    status: {
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
        "Return Requested",
        "Returned",
        "Refunded"
    ]
},

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    note: {
        type: String,
        default: ""
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}
],
isDeleted: {
    type: Boolean,
    default: false
},
lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},
  },
{
    timestamps: true,

    toJSON: {
        virtuals: true
    },

    toObject: {
        virtuals: true
    }
}
);

orderSchema.virtual("totalCharges").get(function () {

    return (

        this.deliveryCharge +

        this.platformFee +

        this.handlingCharge +

        this.packingCharge +

        this.tax

    );

});

orderSchema.index({ user: 1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ paymentStatus: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentMethod: 1 });

orderSchema.index({ trackingId: 1 });

orderSchema.index({ deliveryPartner: 1 });

orderSchema.index({ isDeleted: 1 });

export default mongoose.model("Order", orderSchema);