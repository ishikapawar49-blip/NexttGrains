import express from "express";

import {
    toggleWishlist,
    getWishlist,
    removeWishlistItem,
    clearWishlist,
} from "../controllers/wishlistController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================================================
   GET WISHLIST
=========================================================== */

router.get(
    "/",
    authMiddleware,
    getWishlist
);



/* ===========================================================
   TOGGLE WISHLIST
=========================================================== */

router.post(
    "/toggle",
    authMiddleware,
    toggleWishlist
);



/* ===========================================================
   REMOVE SINGLE PRODUCT
=========================================================== */

router.delete(
    "/:productId",
    authMiddleware,
    removeWishlistItem
);



/* ===========================================================
   CLEAR WISHLIST
=========================================================== */

router.delete(
    "/",
    authMiddleware,
    clearWishlist
);



export default router;