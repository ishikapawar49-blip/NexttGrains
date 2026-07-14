import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Finance from "../models/Finance.js";

export const generateAnalytics = async (
    startDate = null,
    endDate = null
) => {

    /* =====================================================
       DATE FILTER
    ===================================================== */

    const orderFilter = {
        isDeleted: false
    };

    if (startDate && endDate) {

        orderFilter.createdAt = {

            $gte: new Date(startDate),

            $lte: new Date(endDate)

        };

    }

    /* =====================================================
       FETCH DATA
    ===================================================== */

    const [

        orders,

        products,

        customers,

        coupons,

        finances

    ] = await Promise.all([

Order.find(orderFilter)
.populate("user")
.populate("address")
.populate("items.product"), 

        Product.find({
            isDeleted: false
        }),

        User.find({
            role: "customer",
            isDeleted: false
        }),

        Coupon.find(),

        Finance.find()

    ]);

    /* =====================================================
       FINANCIAL SUMMARY
    ===================================================== */

    const grossRevenue = orders.reduce(

        (sum, order) =>

            sum + (order.grandTotal || 0),

        0

    );

    const totalExpense = finances.reduce(

        (sum, finance) =>

            sum + (finance.amount || 0),

        0

    );

    const refundAmount = orders.reduce(

        (sum, order) =>

            sum + (order.refundAmount || 0),

        0

    );

    const gstCollected = orders.reduce(

        (sum, order) =>

            sum + (order.tax || 0),

        0

    );

    const deliveryRevenue = orders.reduce(

        (sum, order) =>

            sum + (order.deliveryCharge || 0),

        0

    );

    const platformRevenue = orders.reduce(

        (sum, order) =>

            sum + (order.platformFee || 0),

        0

    );

    const paymentGatewayCharges = grossRevenue * 0.02;

    const vendorPayout = grossRevenue * 0.80;

    const netRevenue =

        grossRevenue -

        refundAmount;

    const totalProfit =

        netRevenue -

        totalExpense -

        vendorPayout -

        paymentGatewayCharges;

    /* =====================================================
       ORDER SUMMARY
    ===================================================== */

    const totalOrders = orders.length;

    const completedOrders = orders.filter(

        order =>

            order.orderStatus === "Delivered"

    ).length;

    const pendingOrders = orders.filter(

        order =>

            order.orderStatus === "Pending"

    ).length;

    const confirmedOrders = orders.filter(

        order =>

            order.orderStatus === "Confirmed"

    ).length;

    const packedOrders = orders.filter(

        order =>

            order.orderStatus === "Packed"

    ).length;

    const shippedOrders = orders.filter(

        order =>

            order.orderStatus === "Shipped"

    ).length;

    const cancelledOrders = orders.filter(

        order =>

            order.orderStatus === "Cancelled"

    ).length;

    const returnedOrders = orders.filter(

        order =>

            order.orderStatus === "Returned"

    ).length;

    const averageOrderValue =

        totalOrders === 0

            ? 0

            : grossRevenue / totalOrders;

    /* =====================================================
       CUSTOMER SUMMARY
    ===================================================== */

    const totalCustomers = customers.length;

    const activeCustomers = customers.filter(

        customer =>

            customer.status === "Active"

    ).length;

    const inactiveCustomers = customers.filter(

        customer =>

            customer.status === "Inactive"

    ).length;

    const repeatCustomers = customers.filter(

        customer =>

            (customer.totalOrders || 0) > 1

    ).length;

    const newCustomers = customers.filter(customer => {

        const diff =

            Date.now() -

            new Date(customer.createdAt).getTime();

        return diff <= 30 * 24 * 60 * 60 * 1000;

    }).length;

    const conversionRate =

        totalCustomers === 0

            ? 0

            : Number(

                (

                    (completedOrders /

                        totalCustomers) *

                    100

                ).toFixed(2)

            );

    const repeatPurchaseRate =

        totalCustomers === 0

            ? 0

            : Number(

                (

                    (repeatCustomers /

                        totalCustomers) *

                    100

                ).toFixed(2)

            );

    const cartAbandonmentRate = 0;

    /* =====================================================
       PRODUCT SUMMARY
    ===================================================== */

    let totalProductsSold = 0;

    const categoryMap = {};

    const productMap = {};
    /* =====================================================
   PRODUCT SALES
===================================================== */

orders.forEach(order => {

    order.items.forEach(item => {

        totalProductsSold += item.quantity || 0;

        /* ---------------- Product ---------------- */

        const productName =

            item.productName ||

            item.product?.name ||

            "Unknown Product";

        if (!productMap[productName]) {

           productMap[productName]={

productName,

quantitySold:0,

revenue:0

};

productMap[productName].quantitySold+=
item.quantity||0;
        }

        productMap[productName].quantity +=

            item.quantity || 0;

        productMap[productName].revenue +=

            item.subtotal || 0;

        /* ---------------- Category ---------------- */

        const category =

            item.product?.category ||

            "Others";

        if (!categoryMap[category]) {

            categoryMap[category]={

categoryName:category,

orders:0,

revenue:0

};

        }
categoryMap[category].orders+=
item.quantity||0;
        categoryMap[category].quantity +=

            item.quantity || 0;

        categoryMap[category].revenue +=

            item.subtotal || 0;

    });

});

/* =====================================================
   TOP PRODUCTS
===================================================== */

const topProducts =

Object.values(productMap)

.sort(

(a,b)=>

b.revenue-a.revenue

)

.slice(0,10);

/* =====================================================
   TOP CATEGORIES
===================================================== */

const topCategories =

Object.values(categoryMap)

.sort(

(a,b)=>

b.revenue-a.revenue

)

.slice(0,10);

/* =====================================================
   CITY ANALYTICS
===================================================== */

const cityMap = {};

orders.forEach(order=>{

const city =

order.address?.city ||

"Unknown";

if(!cityMap[city]){

cityMap[city]={

city,

orders:0,

revenue:0

};

}

cityMap[city].orders++;

cityMap[city].revenue+=

order.grandTotal||0;

});

const topCities=

Object.values(cityMap)

.sort(

(a,b)=>

b.revenue-a.revenue

)

.slice(0,10);

/* =====================================================
   PRODUCT STATUS
===================================================== */

const lowStockProducts=

products.filter(

product=>

product.stock<=

(product.minStock||20)

).length;

const outOfStockProducts=

products.filter(

product=>

product.stock===0

).length;

/* =====================================================
   VENDOR SUMMARY
===================================================== */

const vendorList=

await User.find({

role:"vendor",

isDeleted:false

});

const totalVendors=

vendorList.length;

const activeVendors=

vendorList.filter(

vendor=>

vendor.status==="Active"

).length;

const suspendedVendors=

vendorList.filter(

vendor=>

vendor.status==="Inactive"

).length;

const pendingKYC=

vendorList.filter(

vendor=>

!vendor.isVerified

).length;

/* =====================================================
   COUPON SUMMARY
===================================================== */

const couponsUsed=

orders.filter(

order=>

order.couponCode

).length;

const couponDiscount=

orders.reduce(

(sum,order)=>

sum+

(order.couponDiscount||0),

0
);
/* =====================================================
   REVENUE CHART (LAST 12 MONTHS)
===================================================== */

const revenueChart = [];

for (let i = 11; i >= 0; i--) {

    const current = new Date();

    current.setMonth(current.getMonth() - i);

    const month = current.getMonth();

    const year = current.getFullYear();

    const revenue = orders
        .filter(order => {

            const d = new Date(order.createdAt);

            return (

                d.getMonth() === month &&

                d.getFullYear() === year

            );

        })
        .reduce(

            (sum, order) =>

                sum + (order.grandTotal || 0),

            0

        );

   revenueChart.push({
    label: current.toLocaleString("default", {
        month: "short"
    }),
    revenue
});

}

/* =====================================================
   ORDER STATUS CHART
===================================================== */

const orderChart = [
{
label:"Pending",
orders:pendingOrders
},
{
label:"Confirmed",
orders:confirmedOrders
},
{
label:"Packed",
orders:packedOrders
},
{
label:"Shipped",
orders:shippedOrders
},
{
label:"Delivered",
orders:completedOrders
},
{
label:"Cancelled",
orders:cancelledOrders
},
{
label:"Returned",
orders:returnedOrders
}
];
/* =====================================================
   CUSTOMER CHART
===================================================== */

const customerChart=[

{
label:"Active",
customers:activeCustomers
},
{
label:"Inactive",
customers:inactiveCustomers
},
{
label:"Repeat",
customers:repeatCustomers
},
{
label:"New",
customers:newCustomers
}

];

/* =====================================================
   CATEGORY CHART
===================================================== */
const totalRevenue =
topCategories.reduce(
(sum,item)=>sum+item.revenue,
0
);

const categoryChart=
topCategories.map(item=>({

category:item.category,

percentage:
totalRevenue===0
?0
:Number(
(
item.revenue*100
/
totalRevenue
).toFixed(2)
)

}));
// const categoryChart =

// topCategories.map(category => ({

//     name: category.category,

//     revenue: category.revenue,

//     quantity: category.quantity

// }));

/* =====================================================
   RETURN
===================================================== */

return {

    grossRevenue,

    netRevenue,

    totalProfit,

    totalExpense,

    refundAmount,

    gstCollected,

    vendorPayout,

    deliveryRevenue,

    platformRevenue,

    paymentGatewayCharges,

    totalOrders,

    completedOrders,

    pendingOrders,

    confirmedOrders,

    packedOrders,

    shippedOrders,

    cancelledOrders,

    returnedOrders,

    averageOrderValue,

    totalCustomers,

    newCustomers,

    repeatCustomers,

    activeCustomers,

    inactiveCustomers,

    conversionRate,

    repeatPurchaseRate,

    cartAbandonmentRate,

    totalProductsSold,

    lowStockProducts,

    outOfStockProducts,

    totalVendors,

    activeVendors,

    suspendedVendors,

    pendingKYC,

    couponsUsed,

    couponDiscount,

    topProducts,

    topCategories,

    topCities,

    revenueChart,

    orderChart,

    customerChart,

    categoryChart

};

};