import express from "express";

import {

    createFinance,

    getFinance,

    updateFinance,

    calculateCharges

} from "../controllers/financeController.js";

// import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   ADMIN ROUTES
========================================================== */

// Create Finance Settings (Only Once)

router.post(

    "/create",

    // verifyToken,

    // isAdmin,

    createFinance

);

// Get Finance Settings

router.get(

    "/",

    // verifyToken,

    // isAdmin,

    getFinance

);

// Update Finance Settings

router.put(

    "/update",

    // verifyToken,

    // isAdmin,

    updateFinance

);

/* ==========================================================
   WEBSITE / CHECKOUT ROUTES
========================================================== */

// Calculate Checkout Charges

router.get(

    "/calculate",

    calculateCharges

);

export default router;