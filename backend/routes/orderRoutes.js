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
    getOrderStats,
    filterOrders,
    exportOrdersExcel,
exportOrdersPDF,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);

router.get("/user/:userId", authMiddleware, getMyOrders);

router.get("/vendor/:vendorId", getVendorOrders);

router.get("/admin/stats", getOrderStats);

router.get("/admin/filter", filterOrders);

router.get("/admin/export/excel", exportOrdersExcel);

router.get("/admin/export/pdf", exportOrdersPDF);

router.get("/", getAllOrders);

router.get("/:orderId", authMiddleware, getOrderDetails);

router.put("/cancel/:orderId", authMiddleware, cancelOrder);

router.put("/status/:orderId", updateOrderStatus);

export default router;