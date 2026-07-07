import express from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  changeCouponStatus,
  getActiveCoupons,
  validateCoupon,
} from "../controllers/couponController.js";

// import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===========================================================
   Admin Routes
=========================================================== */

// Create Coupon
router.post(
  "/create",
  // verifyToken,
  // isAdmin,
  createCoupon
);

// Get All Coupons
router.get(
  "/",
  // verifyToken,
  // isAdmin,
  getCoupons
);

// Get Single Coupon
router.get(
  "/:id",
  // verifyToken,
  // isAdmin,
  getCouponById
);

// Update Coupon
router.put(
  "/update/:id",
  // verifyToken,
  // isAdmin,
  updateCoupon
);

// Soft Delete Coupon
router.delete(
  "/delete/:id",
  // verifyToken,
  // isAdmin,
  deleteCoupon
);

// Change Coupon Status
router.patch(
  "/status/:id",
  // verifyToken,
  // isAdmin,
  changeCouponStatus
);

/* ===========================================================
   Customer Routes
=========================================================== */

// Get Active Coupons
router.get(
  "/active/list",
  getActiveCoupons
);

// Validate Coupon (Checkout)
router.post(
  "/validate",
  validateCoupon
);

export default router;