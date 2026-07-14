import mongoose from "mongoose";

/* ==========================================================
   DELIVERY RULE SCHEMA
========================================================== */

const deliveryRuleSchema = new mongoose.Schema(
{
    minAmount: {
        type: Number,
        required: true,
        default: 0
    },

    maxAmount: {
        type: Number,
        required: true,
        default: 999999
    },

    deliveryCharge: {
        type: Number,
        required: true,
        default: 0
    },

    freeDelivery: {
        type: Boolean,
        default: false
    }

},
{
    _id: false
}
);

/* ==========================================================
   PLATFORM FEE
========================================================== */

const platformFeeSchema = new mongoose.Schema(
{
    enabled: {
        type: Boolean,
        default: true
    },

    feeType: {
        type: String,
        enum: [
            "Flat",
            "Percentage"
        ],
        default: "Flat"
    },

    amount: {
        type: Number,
        default: 5
    },

    minimumOrder: {
        type: Number,
        default: 0
    },

    maximumFee: {
        type: Number,
        default: 20
    }

},
{
    _id: false
}
);

/* ==========================================================
   HANDLING FEE
========================================================== */

const handlingFeeSchema = new mongoose.Schema(
{
    enabled: {
        type: Boolean,
        default: true
    },

    feeType: {
        type: String,
        enum: [
            "Flat",
            "Percentage"
        ],
        default: "Flat"
    },

    amount: {
        type: Number,
        default: 8
    },

    minimumOrder: {
        type: Number,
        default: 0
    }

},
{
    _id: false
}
);

/* ==========================================================
   PACKAGING FEE
========================================================== */

const packagingFeeSchema = new mongoose.Schema(
{
    enabled: {
        type: Boolean,
        default: true
    },

    amount: {
        type: Number,
        default: 10
    }

},
{
    _id: false
}
);

/* ==========================================================
   EXTRA FEES
========================================================== */

const extraFeeSchema = new mongoose.Schema(
{
    enabled: {
        type: Boolean,
        default: false
    },

    amount: {
        type: Number,
        default: 0
    }

},
{
    _id: false
}
);

/* ==========================================================
   GST
========================================================== */

const gstSchema = new mongoose.Schema(
{
    enabled: {
        type: Boolean,
        default: true
    },

    percentage: {
        type: Number,
        default: 18
    }

},
{
    _id: false
}
);

/* ==========================================================
   VENDOR SETTINGS
========================================================== */

const vendorSchema = new mongoose.Schema(
{
    commissionType: {
        type: String,
        enum: [
            "Flat",
            "Percentage"
        ],
        default: "Percentage"
    },

    commission: {
        type: Number,
        default: 12
    },

    settlementDays: {
        type: Number,
        default: 7
    }

},
{
    _id: false
}
);
/* ==========================================================
   MAIN FINANCE SCHEMA
========================================================== */

const financeSchema = new mongoose.Schema(
{
    /* ==========================================
       DELIVERY CHARGES
    ========================================== */

    deliveryRules: {
        type: [deliveryRuleSchema],
        default: [
            {
                minAmount: 0,
                maxAmount: 149,
                deliveryCharge: 80
            },
            {
                minAmount: 150,
                maxAmount: 399,
                deliveryCharge: 30
            },
            {
                minAmount: 400,
                maxAmount: 999999,
                deliveryCharge: 0,
                freeDelivery: true
            }
        ]
    },

    /* ==========================================
       PLATFORM
    ========================================== */

    platformFee: {
        type: platformFeeSchema,
        default: () => ({})
    },

    /* ==========================================
       HANDLING
    ========================================== */

    handlingFee: {
        type: handlingFeeSchema,
        default: () => ({})
    },

    /* ==========================================
       PACKAGING
    ========================================== */

    packagingFee: {
        type: packagingFeeSchema,
        default: () => ({})
    },

    /* ==========================================
       RAIN FEE
    ========================================== */

    rainFee: {
        type: extraFeeSchema,
        default: () => ({})
    },

    /* ==========================================
       SURGE FEE
    ========================================== */

    surgeFee: {
        type: extraFeeSchema,
        default: () => ({})
    },

    /* ==========================================
       GST
    ========================================== */

    gst: {
        type: gstSchema,
        default: () => ({})
    },

    /* ==========================================
       VENDOR
    ========================================== */

    vendorSettings: {
        type: vendorSchema,
        default: () => ({})
    },
        /* ==========================================
       COD SETTINGS
    ========================================== */

    codCharge: {
        type: Number,
        default: 0
    },

    codMinimumOrder: {
        type: Number,
        default: 0
    },

    /* ==========================================
       CANCELLATION
    ========================================== */

    cancellationCharge: {
        enabled: {
            type: Boolean,
            default: false
        },

        amount: {
            type: Number,
            default: 0
        }
    },

    /* ==========================================
       RETURN
    ========================================== */

    returnCharge: {
        enabled: {
            type: Boolean,
            default: false
        },

        amount: {
            type: Number,
            default: 0
        }
    },

    /* ==========================================
       REFUND
    ========================================== */

    refundProcessingFee: {
        enabled: {
            type: Boolean,
            default: false
        },

        amount: {
            type: Number,
            default: 0
        }
    },

    /* ==========================================
       WALLET
    ========================================== */

    walletSettings: {

        enabled: {
            type: Boolean,
            default: true
        },

        minimumRecharge: {
            type: Number,
            default: 100
        },

        maximumRecharge: {
            type: Number,
            default: 10000
        }

    },

    /* ==========================================
       INVOICE
    ========================================== */

    invoicePrefix: {
        type: String,
        default: "NG"
    },

    invoiceFooter: {
        type: String,
        default: "Thank you for shopping with NexttGrains."
    },

    /* ==========================================
       STATUS
    ========================================== */

    active: {
        type: Boolean,
        default: true
    },

    /* ==========================================
       AUDIT
    ========================================== */

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

},
{
    timestamps: true,

    toJSON: {
        virtuals: true
    },

    toObject: {
        virtuals: true
    }
});
/* ==========================================================
   VIRTUAL
========================================================== */

financeSchema.virtual("totalExtraFees").get(function(){

    let total = 0;

    if(this.platformFee.enabled){

        total += this.platformFee.amount;

    }

    if(this.handlingFee.enabled){

        total += this.handlingFee.amount;

    }

    if(this.packagingFee.enabled){

        total += this.packagingFee.amount;

    }

    if(this.rainFee.enabled){

        total += this.rainFee.amount;

    }

    if(this.surgeFee.enabled){

        total += this.surgeFee.amount;

    }

    return total;

});
/* ==========================================================
   INDEXES
========================================================== */

financeSchema.index({
    active: 1
});

financeSchema.index({
    createdAt: -1
});
/* ==========================================================
   EXPORT MODEL
========================================================== */

const Finance =
mongoose.models.Finance ||
mongoose.model(
    "Finance",
    financeSchema
);

export default Finance;