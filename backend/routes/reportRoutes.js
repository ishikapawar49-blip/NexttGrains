import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import vendorMiddleware from "../middleware/vendorMiddleware.js";
import {

createReport,

getReports,

getDashboardAnalytics,

getVendorDashboardAnalytics,

getRevenueChart,

getOrderChart,

getCustomerChart,

getCategoryChart,

exportPDF,

deleteReport

} from "../controllers/reportController.js";

// import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router=express.Router();

/* ==========================================================
   ADMIN ROUTES
========================================================== */

/* ==========================================
   Generate Report
========================================== */

router.post(

"/create",

// verifyToken,

// isAdmin,

createReport

);

/* ==========================================
   All Reports
========================================== */

router.get(

"/",

// verifyToken,

// isAdmin,

getReports

);

/* ==========================================
   Dashboard Analytics
========================================== */

router.get(

"/dashboard",

// verifyToken,

// isAdmin,

getDashboardAnalytics

);

/* ==========================================
   VENDOR DASHBOARD ANALYTICS
========================================== */
router.get(

"/vendor/dashboard",

authMiddleware,

vendorMiddleware,

getVendorDashboardAnalytics

);
/* ==========================================
   Revenue Chart
========================================== */

router.get(

"/charts/revenue",

// verifyToken,

// isAdmin,

getRevenueChart

);

/* ==========================================
   Orders Chart
========================================== */

router.get(

"/charts/orders",

// verifyToken,

// isAdmin,

getOrderChart

);

/* ==========================================
   Customers Chart
========================================== */

router.get(

"/charts/customers",

// verifyToken,

// isAdmin,

getCustomerChart

);

/* ==========================================
   Categories Chart
========================================== */

router.get(

"/charts/categories",

// verifyToken,

// isAdmin,

getCategoryChart

);

/* ==========================================
   Export PDF
========================================== */

router.get(

"/export/pdf/:id",

// verifyToken,

// isAdmin,

exportPDF

);

/* ==========================================
   Delete Report
========================================== */

router.delete(

"/delete/:id",

// verifyToken,

// isAdmin,

deleteReport

);

export default router;