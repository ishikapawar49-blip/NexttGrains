import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    placeOrder,
    getMyOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus,
    getVendorOrders,
    getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(

"/place",

authMiddleware,

placeOrder

);
router.get(
    "/user/:userId",
    authMiddleware,
    getMyOrders
);

router.get(
    "/:orderId",
    authMiddleware,
    getOrderDetails
);

router.put(
    "/cancel/:orderId",
    authMiddleware,
    cancelOrder
);
router.put("/status/:orderId", updateOrderStatus);

router.get("/vendor/:vendorId", getVendorOrders);

router.get("/", getAllOrders);

export default router;