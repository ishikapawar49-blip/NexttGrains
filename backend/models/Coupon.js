import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
{
    couponCode:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        uppercase:true
    },

    couponName:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        default:""
    },

    couponType:{
        type:String,
        enum:[
            "Flat",
            "Percentage"
        ],
        required:true
    },

    discountValue:{
        type:Number,
        required:true,
        min:1
    },

    maxDiscount:{
        type:Number,
        default:0
    },

    minimumOrderAmount:{
        type:Number,
        default:0
    },

    maximumOrderAmount:{
        type:Number,
        default:0
    },

    usageLimit:{
        type:Number,
        default:0
    },

    usedCount:{
        type:Number,
        default:0
    },

    perUserLimit:{
        type:Number,
        default:1
    },

    firstOrderOnly:{
        type:Boolean,
        default:false
    },

    applicableCategories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }
    ],

    applicableProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],

    applicableUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    excludedProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],

    excludedCategories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }
    ],

    startDate:{
        type:Date,
        required:true
    },

    expiryDate:{
        type:Date,
        required:true
    },

    couponImage:{
        type:String,
        default:""
    },

    bannerImage:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:[
            "Active",
            "Inactive",
            "Expired"
        ],
        default:"Active"
    },

    adminRemark:{
        type:String,
        default:""
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true,

    toJSON:{
        virtuals:true
    },

    toObject:{
        virtuals:true
    }
}
);

/* ===========================================
   Virtual : Remaining Uses
=========================================== */

couponSchema.virtual("remainingUses").get(function(){

    if(this.usageLimit===0){

        return "Unlimited";

    }

    return this.usageLimit-this.usedCount;

});

/* ===========================================
   Virtual : Is Expired
=========================================== */

couponSchema.virtual("isExpired").get(function(){

    return new Date()>this.expiryDate;

});

/* ===========================================
   Auto Expire
=========================================== */
couponSchema.pre("save", async function () {

    if (new Date() > this.expiryDate) {
        this.status = "Expired";
    }

});
/* ===========================================
   Indexes
=========================================== */

// couponSchema.index({
//     couponCode:1
// });

couponSchema.index({
    status:1
});

couponSchema.index({
    expiryDate:1
});

couponSchema.index({
    startDate:1
});

couponSchema.index({
    couponType:1
});

couponSchema.index({
    isDeleted:1
});

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema);

export default Coupon;