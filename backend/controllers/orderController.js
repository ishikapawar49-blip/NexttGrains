import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Payment from "../models/Payment.js";


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

product.description ||

"",
                productImage:

                    product.thumbnail ||

                    product.images[0],

                price: product.price,

                quantity: item.quantity,

                subtotal: itemSubtotal,

            });

        }



        /* ==========================
           PRICE CALCULATION
        ========================== */

        const deliveryCharge =

            subtotal >= 499

                ? 0

                : 40;



        const discount = 0;



        const grandTotal =

            subtotal +

            deliveryCharge -

            discount;



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

            deliveryCharge,

            grandTotal,

            paymentMethod,

  paymentStatus: "Pending",

            orderStatus: "Pending",

            estimatedDeliveryDate,

        });



        /* ==========================
           UPDATE PRODUCT STOCK
        ========================== */

        for (const item of cart.items) {

            await Product.findByIdAndUpdate(

                item.product._id,

                {

                    $inc: {

                        stock: -item.quantity,

                        sold: item.quantity,

                    },

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
   GET ORDER DETAILS
=========================================================== */

export const getOrderDetails = async (req, res) => {

    try {

        const { orderId } = req.params;

        const order = await Order.findById(orderId)

            .populate({

                path: "user",

                select: "name email phone",

            })

            .populate({

                path: "address",

            })

.populate({
    path: "items.product",
    select:
      "name thumbnail images shortDescription category quantity unit price mrp rating"
})

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found.",

            });

        }

        const payment = await Payment.findOne({

            order: order._id,

        });

        return res.status(200).json({

            success: true,

            order,

            payment,

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

        const { orderStatus } = req.body;

        const validStatus = [

            "Pending",

            "Confirmed",

            "Accepted",

            "Packed",

            "Shipped",

            "Out For Delivery",

            "Delivered",

            "Cancelled",

        ];



        if (!validStatus.includes(orderStatus)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status.",

            });

        }



        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found.",

            });

        }



        if (order.orderStatus === "Cancelled") {

            return res.status(400).json({

                success: false,

                message: "Cancelled order cannot be updated.",

            });

        }



        order.orderStatus = orderStatus;



        if (orderStatus === "Delivered") {

            order.deliveredAt = new Date();



            await Payment.findOneAndUpdate(

                {

                    order: order._id,

                },

                {

                    paymentStatus: "Paid",

                    paidAt: new Date(),

                }

            );

        }



        await order.save();



        return res.status(200).json({

            success: true,

            message: "Order status updated successfully.",

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

    try {

        const orders = await Order.find()

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