import express from "express";

import {

createReport,

getReports,

getDashboardAnalytics,

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