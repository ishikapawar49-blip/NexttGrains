import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Payment from "../models/Payment.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { generateAnalytics } from "../utils/reportAnalytics.js";
import Report from "../models/Report.js";

/* ===========================================================
   HELPER : GENERATE ORDER NUMBER
=========================================================== */
const generateOrderNumber = () => {

    return `NG${Date.now()}`;

};

/* ===========================================================
   PLACE ORDER
=========================================================== */

export const placeOrder = async (req, res) => {

    try {

        const {

            userId,

            addressId,

            paymentMethod,

        } = req.body;



        /* ==========================
           VALIDATION
        ========================== */

        if (

            !userId ||

            !addressId ||

            !paymentMethod

        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields.",

            });

        }


        /* ==========================
           ADDRESS CHECK
        ========================== */

        const address = await Address.findById(addressId);

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found.",

            });

        }



        /* ==========================
           CART CHECK
        ========================== */

        const cart = await Cart.findOne({

            user: userId,

        }).populate("items.product");



        if (

            !cart ||

            cart.items.length === 0

        ) {

            return res.status(400).json({

                success: false,

                message: "Cart is empty.",

            });

        }



        /* ==========================
           PREPARE ORDER ITEMS
        ========================== */

        const orderItems = [];

        let subtotal = 0;

        let totalItems = 0;



        for (const item of cart.items) {

            const product = item.product;



            if (!product) {

                return res.status(404).json({

                    success: false,

                    message: "Product not found.",

                });

            }



            if (

                product.stock < item.quantity

            ) {

                return res.status(400).json({

                    success: false,

                    message: `${product.name} is out of stock.`,

                });

            }



            const itemSubtotal =

                product.price *

                item.quantity;



            subtotal += itemSubtotal;

            totalItems += item.quantity;



 orderItems.push({

product: product._id,

vendor: product.vendorId,

productName: product.name,

productDescription:
    product.shortDescription ||
    "",

sku:
    product.sku || "",

unit:
    product.unit || "",

productImage:
    product.thumbnail ||
    product.images[0],

price: product.price,

quantity: item.quantity,

subtotal: itemSubtotal

});

        }



        /* ==========================
           PRICE CALCULATION
        ========================== */
const discount = 0;

const couponCode = "";

const couponDiscount = 0;

const platformFee =
    subtotal >= 500
        ? 0
        : 9;

const handlingCharge =
    subtotal >= 500
        ? 0
        : 12;

const packingCharge = 8;

const deliveryCharge =
    subtotal >= 499
        ? 0
        : 40;

const taxableAmount =
    subtotal -
    discount -
    couponDiscount;

const tax =
    Number((taxableAmount * 0.05).toFixed(2));

const grandTotal =
    taxableAmount +
    platformFee +
    handlingCharge +
    packingCharge +
    deliveryCharge +
    tax;



        const orderNumber =

            generateOrderNumber();
                    /* ==========================
           CREATE ORDER
        ========================== */

        const estimatedDeliveryDate = new Date();

        estimatedDeliveryDate.setDate(

            estimatedDeliveryDate.getDate() + 7

        );



        const order = await Order.create({

orderNumber,

user: userId,

address: addressId,

items: orderItems,

totalItems,

subtotal,

discount,

couponCode,

couponDiscount,

platformFee,

handlingCharge,

packingCharge,

deliveryCharge,

tax,

grandTotal,

paymentMethod,

paymentStatus: "Pending",

orderStatus: "Pending",

estimatedDeliveryDate,

deliveryPartner: "",

trackingId: "",

trackingUrl: "",

adminRemark: "",

customerRemark: "",

refundAmount: 0,

refundStatus: "None",

returnRequested: false,

returnReason: "",

deliveryOTP:
    Math.floor(
        1000 +
        Math.random() * 9000
    ).toString(),

statusHistory: [

{

status: "Pending",

updatedBy: null,

note: "Order Placed"

}

]

});
        /* ==========================
           UPDATE PRODUCT STOCK
        ========================== */
await User.findByIdAndUpdate(
    userId,
    {
        $inc: {
            totalOrders: 1
        }
    }
);
for (const item of cart.items) {

    await Product.findByIdAndUpdate(
        item.product._id,
        {
            $inc: {
                stock: -item.quantity,
                sold: item.quantity,
                totalRevenue: item.product.price * item.quantity,
                totalProfit: item.product.price * item.quantity
            }
        }
    );
}

/* ==========================
   CREATE PAYMENT
========================== */

await Payment.create({

    user: userId,

    order: order._id,

    razorpayOrderId: "",

    razorpayPaymentId: "",

    razorpaySignature: "",

    amount: grandTotal,

    currency: "INR",

    paymentMethod,

    paymentStatus: "Pending",

    gateway:
        paymentMethod === "COD"
            ? "Cash On Delivery"
            : "Razorpay",

    paidAt: null,

});

        /* ==========================
           CLEAR CART
        ========================== */

        cart.items = [];

        await cart.save();



        /* ==========================
           RESPONSE
        ========================== */

        return res.status(201).json({

            success: true,

            message: "Order placed successfully.",

            order,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};



// 

/* ===========================================================
   GET MY ORDERS
=========================================================== */

export const getMyOrders = async (req, res) => {

    try {

        const { userId } = req.params;

        const orders = await Order.find({
            user: userId,
        })

.populate({
    path: "items.product",
    select:
      "name thumbnail images shortDescription description quantity unit",
})
        .populate({

            path: "address",

        })

        .sort({

            createdAt: -1,

        });
        const formattedOrders = orders.map(order => ({
    ...order.toObject(),

    status: order.orderStatus,

    paymentStatus: order.paymentStatus,

    tracking:{

        deliveryPartner:order.deliveryPartner,

        trackingId:order.trackingId,

        trackingUrl:order.trackingUrl,

        estimatedDeliveryDate:order.estimatedDeliveryDate,

        deliveredAt:order.deliveredAt

    },

    history:order.statusHistory
}));
return res.status(200).json({
    success: true,
    totalOrders: formattedOrders.length,
    orders: formattedOrders
});

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};

/* ===========================================================
   GET ORDER DETAILS
=========================================================== */

export const getOrderDetails = async (req, res) => {

    try {

        const { orderId } = req.params;

        const order = await Order.findById(orderId)

            .populate({

path:"user",

select:"name email phone email profileImage"

})

            .populate({

path:"address",

select:`
fullName
phone
addressLine1
addressLine2
city
state
country
pincode
landmark
addressType
`
})

.populate({

path:"items.product",

select:`
name
thumbnail
images
category
quantity
unit
price
mrp
rating
brand
sku
`

})

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found.",

            });

        }

       const payment =
await Payment.findOne({

order:order._id

}).select(

`
amount
currency
paymentMethod
paymentStatus
gateway
razorpayOrderId
razorpayPaymentId
paidAt
`

);

       return res.status(200).json({

success:true,

order:{

...order.toObject(),

customer:{

id:order.user?._id,

name:order.user?.name,

email:order.user?.email,

phone:order.user?.phone,

profileImage:order.user?.profileImage

},

deliveryAddress:order.address,

pricing:{

subtotal:order.subtotal,

discount:order.discount,

couponDiscount:order.couponDiscount,

platformFee:order.platformFee,

handlingCharge:order.handlingCharge,

packingCharge:order.packingCharge,

deliveryCharge:order.deliveryCharge,

tax:order.tax,

grandTotal:order.grandTotal

},

tracking:{

deliveryPartner:order.deliveryPartner,

trackingId:order.trackingId,

trackingUrl:order.trackingUrl,

estimatedDeliveryDate:

order.estimatedDeliveryDate,

deliveredAt:

order.deliveredAt

},

statusHistory:

order.statusHistory

},

payment

});
    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};

/* ===========================================================
   CANCEL ORDER
=========================================================== */

export const cancelOrder = async (req, res) => {

    try {

        const { orderId } = req.params;

        const { cancelReason } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found.",

            });

        }



        /* ==========================
           VALIDATE STATUS
        ========================== */

       if (

    order.orderStatus === "Packed" ||

    order.orderStatus === "Shipped" ||

    order.orderStatus === "Out For Delivery" ||

    order.orderStatus === "Delivered"

) {

    return res.status(400).json({

        success:false,

        message:"This order can no longer be cancelled."

    });

}

        if (

            order.orderStatus === "Cancelled"

        ) {

            return res.status(400).json({

                success: false,

                message: "Order is already cancelled.",

            });

        }



        /* ==========================
           RESTORE PRODUCT STOCK
        ========================== */

        for (const item of order.items) {

            await Product.findByIdAndUpdate(

                item.product,

                {

                    $inc: {

                        stock: item.quantity,

                        sold: -item.quantity,

                    },

                }

            );

        }



        /* ==========================
           UPDATE ORDER
        ========================== */

        order.orderStatus = "Cancelled";

        order.cancelReason =

            cancelReason ||

            "Cancelled by customer";



        await order.save();



        /* ==========================
           UPDATE PAYMENT
        ========================== */

        await Payment.findOneAndUpdate(

            {

                order: order._id,

            },

            {

                paymentStatus: "Refunded",

            }

        );



        return res.status(200).json({

            success: true,

            message: "Order cancelled successfully.",

            order,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};

/* ===========================================================
   UPDATE ORDER STATUS
=========================================================== */
export const updateOrderStatus = async (req, res) => {
  try {

    const { orderId } = req.params;

    const {
      orderStatus,
      paymentStatus,
      deliveryPartner,
      trackingId,
      trackingUrl,
      adminRemark,
      updatedBy
    } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.orderStatus = orderStatus;
    order.paymentStatus = paymentStatus;
    order.deliveryPartner = deliveryPartner;
    order.trackingId = trackingId;
    order.trackingUrl = trackingUrl;
    order.adminRemark = adminRemark;
    order.lastUpdatedBy = updatedBy;

    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "Paid";
    }

    if (orderStatus === "Cancelled") {
      order.paymentStatus = "Refunded";
    }

    order.statusHistory.push({
      status: orderStatus,
      updatedBy,
      note: adminRemark || ""
    });

    await order.save();

    // 

// const analytics = await generateAnalytics();

// await Report.create({

//     reportName: "Live Dashboard",

//     reportType: "Realtime",

//     ...analytics

// });

    return res.status(200).json({
      success: true,
      message: "Order Updated",
      order
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });

  }
};

/* ===========================================================
   GET VENDOR ORDERS
=========================================================== */

export const getVendorOrders = async (req, res) => {

    try {

        const { vendorId } = req.params;

        const orders = await Order.find({

            "items.vendor": vendorId,

        })

        .populate({

            path: "user",

            select: "name email phone",

        })

        .populate({

            path: "address",

        })

        .sort({

            createdAt: -1,

        });

        return res.status(200).json({

            success: true,

            totalOrders: orders.length,

            orders,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};

/* ===========================================================
   GET ALL ORDERS
=========================================================== */

export const getAllOrders = async (req, res) => {

try{

const{

page=1,

limit=10,

search="",

status="",

paymentStatus="",

paymentMethod=""

}=req.query;

const query={

isDeleted:false

};

if(search){

query.$or=[

{

orderNumber:{

$regex:search,

$options:"i"

}

}

];

}

if(status){

query.orderStatus=status;

}

if(paymentStatus){

query.paymentStatus=paymentStatus;

}

if(paymentMethod){

query.paymentMethod=paymentMethod;

}

const totalOrders=

await Order.countDocuments(query);

const orders=

await Order.find(query)

.populate({

path:"user",

select:

"name email phone profileImage"

})

.populate({

path:"address",

select:

"fullName phone city state addressLine1 pincode"

})

.sort({

createdAt:-1

})

.skip(

(page-1)*limit

)

.limit(

Number(limit)

);

const formattedOrders=

orders.map(order=>({

...order.toObject(),

customerName:

order.user?.name ||

"Customer",

customerPhone:

order.user?.phone ||

"",

city:

order.address?.city ||

"",

totalProducts:

order.items.length,

totalQuantity:

order.totalItems,

payment:

order.paymentMethod,

paymentState:

order.paymentStatus,

status:

order.orderStatus

}));

return res.status(200).json({

success:true,

totalOrders,

currentPage:Number(page),

totalPages:Math.ceil(

totalOrders/limit

),

orders:formattedOrders

});

}

catch(error){

console.error(error);

return res.status(500).json({

success:false,

message:"Internal Server Error."

});

}

};

/* ===========================================================
   GET ORDER STATS (ADMIN DASHBOARD)
=========================================================== */

export const getOrderStats = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const totalOrders =
            await Order.countDocuments({
                isDeleted: false
            });

        const todayOrders =
            await Order.countDocuments({

                isDeleted: false,

                createdAt: {
                    $gte: today
                }

            });

        const pendingOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Pending"

            });

        const confirmedOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Confirmed"

            });

        const packedOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Packed"

            });

        const shippedOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Shipped"

            });

        const outForDelivery =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Out For Delivery"

            });

        const deliveredOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Delivered"

            });

        const cancelledOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Cancelled"

            });

        const returnedOrders =
            await Order.countDocuments({

                isDeleted: false,

                orderStatus: "Returned"

            });

        const revenue =
            await Order.aggregate([

                {

                    $match: {

                        isDeleted: false,

                        orderStatus: "Delivered"

                    }

                },

                {

                    $group: {

                        _id: null,

                        totalRevenue: {

                            $sum: "$grandTotal"

                        }

                    }

                }

            ]);

        const averageOrderValue =
            totalOrders > 0
                ? (
                    revenue[0]?.totalRevenue || 0
                ) / totalOrders
                : 0;

        return res.status(200).json({

            success: true,

            stats: {

                totalOrders,

                todayOrders,

                pendingOrders,

                confirmedOrders,

                packedOrders,

                shippedOrders,

                outForDelivery,

                deliveredOrders,

                cancelledOrders,

                returnedOrders,

                revenue:
                    revenue[0]?.totalRevenue || 0,

                averageOrderValue:
                    Number(
                        averageOrderValue.toFixed(2)
                    )

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error."

        });

    }

};

/* ===========================================================
   FILTER ORDERS
=========================================================== */

export const filterOrders = async (req, res) => {

    try {

        const {

            search = "",

            status = "",

            paymentStatus = "",

            paymentMethod = "",

            deliveryPartner = "",

            fromDate = "",

            toDate = "",

            page = 1,

            limit = 10

        } = req.query;

        const query = {

            isDeleted: false

        };

        if (search) {

            query.orderNumber = {

                $regex: search,

                $options: "i"

            };

        }

        if (status) {

            query.orderStatus = status;

        }

        if (paymentStatus) {

            query.paymentStatus = paymentStatus;

        }

        if (paymentMethod) {

            query.paymentMethod = paymentMethod;

        }

        if (deliveryPartner) {

            query.deliveryPartner = deliveryPartner;

        }

        if (fromDate || toDate) {

            query.createdAt = {};

            if (fromDate) {

                query.createdAt.$gte = new Date(fromDate);

            }

            if (toDate) {

                const endDate = new Date(toDate);

                endDate.setHours(23,59,59,999);

                query.createdAt.$lte = endDate;

            }

        }

        const totalOrders =

            await Order.countDocuments(query);

        const orders =

            await Order.find(query)

            .populate({

                path:"user",

                select:"name phone email"

            })

            .populate({

                path:"address",

                select:"fullName city state"

            })

            .sort({

                createdAt:-1

            })

            .skip(

                (page-1)*limit

            )

            .limit(

                Number(limit)

            );

        return res.status(200).json({

            success:true,

            totalOrders,

            currentPage:Number(page),

            totalPages:

                Math.ceil(totalOrders/limit),

            orders

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error."

        });

    }

};

/* ===========================================================
   EXPORT ORDERS EXCEL
=========================================================== */

export const exportOrdersExcel = async (req, res) => {

    try {

        const orders = await Order.find({

            isDeleted:false

        })

        .populate({

            path:"user",

            select:"name email phone"

        })

        .sort({

            createdAt:-1

        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Orders");

        worksheet.columns=[

            {

                header:"Order No",

                key:"orderNumber",

                width:20

            },

            {

                header:"Customer",

                key:"customer",

                width:25

            },

            {

                header:"Payment",

                key:"payment",

                width:18

            },

            {

                header:"Status",

                key:"status",

                width:18

            },

            {

                header:"Items",

                key:"items",

                width:10

            },

            {

                header:"Subtotal",

                key:"subtotal",

                width:15

            },

            {

                header:"Delivery",

                key:"delivery",

                width:15

            },

            {

                header:"Tax",

                key:"tax",

                width:12

            },

            {

                header:"Grand Total",

                key:"grandTotal",

                width:18

            },

            {

                header:"Date",

                key:"date",

                width:20

            }

        ];

        orders.forEach(order=>{

            worksheet.addRow({

                orderNumber:order.orderNumber,

                customer:

                    order.user?.name ||

                    "Customer",

                payment:

                    order.paymentMethod,

                status:

                    order.orderStatus,

                items:

                    order.totalItems,

                subtotal:

                    order.subtotal,

                delivery:

                    order.deliveryCharge,

                tax:

                    order.tax,

                grandTotal:

                    order.grandTotal,

                date:

                    order.createdAt

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=Orders.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Failed to export excel."

        });

    }

};

/* ===========================================================
   EXPORT ORDERS PDF
=========================================================== */

export const exportOrdersPDF = async(req,res)=>{

try{

const orders=

await Order.find({

isDeleted:false

})

.populate({

path:"user",

select:"name"

})

.sort({

createdAt:-1

});

const doc=

new PDFDocument({

margin:40

});

res.setHeader(

"Content-Type",

"application/pdf"

);

res.setHeader(

"Content-Disposition",

"attachment; filename=Orders.pdf"

);

doc.pipe(res);

doc

.fontSize(18)

.text(

"NextTGrains Orders Report",

{

align:"center"

}

);

doc.moveDown();

orders.forEach(order=>{

doc

.fontSize(11)

.text(

`Order : ${order.orderNumber}`

);

doc.text(

`Customer : ${order.user?.name}`

);

doc.text(

`Status : ${order.orderStatus}`

);

doc.text(

`Payment : ${order.paymentMethod}`

);

doc.text(

`Grand Total : ₹${order.grandTotal}`

);

doc.text(

`Date : ${order.createdAt.toLocaleDateString()}`

);

doc.moveDown();

});

doc.end();

}

catch(error){

console.error(error);

return res.status(500).json({

success:false,

message:"Failed to export pdf."

});

}

};