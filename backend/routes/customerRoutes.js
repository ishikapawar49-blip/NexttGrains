import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getCustomers,
    getCustomer,
    updateCustomer,
    toggleBlockCustomer,
    deleteCustomer,
    exportCustomersExcel,
exportCustomersPDF
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getCustomers);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getCustomer
);
router.get("/:id", getCustomer);

router.put("/:id", updateCustomer);

router.put("/block/:id", toggleBlockCustomer);

router.delete("/:id", deleteCustomer);

router.get("/export/excel", exportCustomersExcel);

router.get("/export/pdf", exportCustomersPDF);

export default router;