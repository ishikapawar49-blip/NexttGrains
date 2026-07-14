import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
{
    /* ==========================================================
       BASIC DETAILS
    ========================================================== */

    reportName:{
        type:String,
        required:true,
        trim:true
    },

    reportType:{
        type:String,
        required:true,
        enum:[
            "Daily",
            "Weekly",
            "Monthly",
            "Quarterly",
            "Yearly",
            "Custom"
        ]
    },

    reportStatus:{
        type:String,
        enum:[
            "Generated",
            "Pending",
            "Failed"
        ],
        default:"Generated"
    },

    /* ==========================================================
       DATE RANGE
    ========================================================== */

    startDate:{
        type:Date,
        required:true
    },

    endDate:{
        type:Date,
        required:true
    },

    generatedAt:{
        type:Date,
        default:Date.now
    },

    /* ==========================================================
       REVENUE
    ========================================================== */

    grossRevenue:{
        type:Number,
        default:0
    },

    netRevenue:{
        type:Number,
        default:0
    },

    totalProfit:{
        type:Number,
        default:0
    },

    totalExpense:{
        type:Number,
        default:0
    },

    vendorPayout:{
        type:Number,
        default:0
    },

    refundAmount:{
        type:Number,
        default:0
    },

    gstCollected:{
        type:Number,
        default:0
    },

    platformRevenue:{
        type:Number,
        default:0
    },

    deliveryRevenue:{
        type:Number,
        default:0
    },

    paymentGatewayCharges:{
        type:Number,
        default:0
    },

    /* ==========================================================
       ORDERS
    ========================================================== */

    totalOrders:{
        type:Number,
        default:0
    },

    completedOrders:{
        type:Number,
        default:0
    },

    pendingOrders:{
        type:Number,
        default:0
    },

    cancelledOrders:{
        type:Number,
        default:0
    },

    returnedOrders:{
        type:Number,
        default:0
    },

    averageOrderValue:{
        type:Number,
        default:0
    },

    /* ==========================================================
       CUSTOMERS
    ========================================================== */

    totalCustomers:{
        type:Number,
        default:0
    },

    newCustomers:{
        type:Number,
        default:0
    },

    repeatCustomers:{
        type:Number,
        default:0
    },

    activeCustomers:{
        type:Number,
        default:0
    },

    inactiveCustomers:{
        type:Number,
        default:0
    },

    conversionRate:{
        type:Number,
        default:0
    },

    repeatPurchaseRate:{
        type:Number,
        default:0
    },

    cartAbandonmentRate:{
        type:Number,
        default:0
    },

    /* ==========================================================
       PRODUCTS
    ========================================================== */

    totalProductsSold:{
        type:Number,
        default:0
    },

    lowStockProducts:{
        type:Number,
        default:0
    },

    outOfStockProducts:{
        type:Number,
        default:0
    },

    /* ==========================================================
       VENDORS
    ========================================================== */

    totalVendors:{
        type:Number,
        default:0
    },

    activeVendors:{
        type:Number,
        default:0
    },

    suspendedVendors:{
        type:Number,
        default:0
    },

    pendingKYC:{
        type:Number,
        default:0
    },

    /* ==========================================================
       COUPONS
    ========================================================== */

    couponsUsed:{
        type:Number,
        default:0
    },

    couponDiscount:{
        type:Number,
        default:0
    },
        /* ==========================================================
       TOP PRODUCTS
    ========================================================== */

    topProducts:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                default:null
            },

            productName:{
                type:String,
                default:""
            },

            quantitySold:{
                type:Number,
                default:0
            },

            revenue:{
                type:Number,
                default:0
            },

            profit:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       TOP CATEGORIES
    ========================================================== */

    topCategories:[
        {
            categoryName:{
                type:String,
                default:""
            },

            orders:{
                type:Number,
                default:0
            },

            revenue:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       TOP CITIES
    ========================================================== */

    topCities:[
        {
            city:{
                type:String,
                default:""
            },

            orders:{
                type:Number,
                default:0
            },

            revenue:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       REVENUE CHART
    ========================================================== */

    revenueChart:[
        {
            label:{
                type:String,
                default:""
            },

            revenue:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       ORDER CHART
    ========================================================== */

    orderChart:[
        {
            label:{
                type:String,
                default:""
            },

            orders:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       CUSTOMER CHART
    ========================================================== */

    customerChart:[
        {
            label:{
                type:String,
                default:""
            },

            customers:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       CATEGORY CHART
    ========================================================== */

    categoryChart:[
        {
            category:{
                type:String,
                default:""
            },

            percentage:{
                type:Number,
                default:0
            }
        }
    ],

    /* ==========================================================
       GENERATED BY
    ========================================================== */

    generatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    notes:{
        type:String,
        default:""
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
});

/* ==========================================================
   VIRTUAL : PROFIT MARGIN
========================================================== */

reportSchema.virtual("profitMargin").get(function(){

    if(this.grossRevenue===0){

        return 0;

    }

    return Number(

        (

            (this.totalProfit/this.grossRevenue)

            *100

        ).toFixed(2)

    );

});

/* ==========================================================
   VIRTUAL : ORDER COMPLETION RATE
========================================================== */

reportSchema.virtual("orderCompletionRate").get(function(){

    if(this.totalOrders===0){

        return 0;

    }

    return Number(

        (

            (this.completedOrders/this.totalOrders)

            *100

        ).toFixed(2)

    );

});

/* ==========================================================
   VIRTUAL : CANCELLATION RATE
========================================================== */

reportSchema.virtual("cancellationRate").get(function(){

    if(this.totalOrders===0){

        return 0;

    }

    return Number(

        (

            (this.cancelledOrders/this.totalOrders)

            *100

        ).toFixed(2)

    );

});

/* ==========================================================
   VIRTUAL : RETURN RATE
========================================================== */

reportSchema.virtual("returnRate").get(function(){

    if(this.totalOrders===0){

        return 0;

    }

    return Number(

        (

            (this.returnedOrders/this.totalOrders)

            *100

        ).toFixed(2)

    );

});

/* ==========================================================
   VIRTUAL : AVERAGE REVENUE PER CUSTOMER
========================================================== */

reportSchema.virtual("averageRevenuePerCustomer").get(function(){

    if(this.totalCustomers===0){

        return 0;

    }

    return Number(

        (

            this.netRevenue/

            this.totalCustomers

        ).toFixed(2)

    );

});

/* ==========================================================
   AUTO REPORT NAME
========================================================== */

reportSchema.pre("validate",function(){

    if(!this.reportName){

        this.reportName=

        `${this.reportType} Report`;

    }

});

/* ==========================================================
   INDEXES
========================================================== */

reportSchema.index({

    reportType:1

});

reportSchema.index({

    reportStatus:1

});

reportSchema.index({

    generatedAt:-1

});

reportSchema.index({

    startDate:-1

});

reportSchema.index({

    endDate:-1

});

reportSchema.index({

    grossRevenue:-1

});

reportSchema.index({

    netRevenue:-1

});

reportSchema.index({

    totalOrders:-1

});

reportSchema.index({

    totalCustomers:-1

});

reportSchema.index({

    isDeleted:1

});

/* ==========================================================
   EXPORT MODEL
========================================================== */

const Report=

mongoose.models.Report ||

mongoose.model(

    "Report",

    reportSchema

);

export default Report;