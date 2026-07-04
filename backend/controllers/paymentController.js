import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Address from "../models/Address.js";



// =========================
// CREATE PAYMENT ORDER
// =========================

export const createPaymentOrder = async (req, res) => {

    try {

        const {

            addressId,

            items,

            subtotal,

            deliveryCharge,

            platformFee,

            handlingCharge,

            discount,

            grandTotal,

        } = req.body;

        const user = req.user.id;



        // Check Address

        const address = await Address.findById(addressId);

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found",

            });

        }



        // Save Order

        const order = await Order.create({

            user,

            address: addressId,

            items,

            subtotal,

            deliveryCharge,

            platformFee,

            handlingCharge,

            discount,

            grandTotal,

        });



        // Razorpay Order

        const razorpayOrder = await razorpay.orders.create({

            amount: grandTotal * 100,

            currency: "INR",

            receipt: order._id.toString(),

        });



        // Save Razorpay Order Id

        order.razorpayOrderId = razorpayOrder.id;

        await order.save();



        // Save Payment

        await Payment.create({

            user,

            order: order._id,

            razorpayOrderId: razorpayOrder.id,

            amount: grandTotal,

            paymentStatus: "Pending",

        });



        res.status(200).json({

            success: true,

            order,

            razorpayOrder,

        });

    }

catch (error) {

    console.log("========= PAYMENT ERROR =========");
    console.log(error);
    console.log(error.message);
    console.log(error.stack);

    res.status(500).json({
        success:false,
        message:error.message
    });

}

};



export const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.paymentStatus = "Paid";
        payment.paidAt = new Date();

        await payment.save();

        const order = await Order.findById(payment.order);

        order.paymentStatus = "Paid";
        order.paymentMethod = "Razorpay";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;

        await order.save();

        return res.json({
            success: true,
            message: "Payment Verified",
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};