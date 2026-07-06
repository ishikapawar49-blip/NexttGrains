import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import{

addToCart,
getCart,
increaseQuantity,
decreaseQuantity,
removeItem,
clearCart

}

from "../controllers/cartController.js";

const router=

express.Router();

router.post("/add", authMiddleware, addToCart);

router.get("/:userId", authMiddleware, getCart);

router.patch("/increase", authMiddleware, increaseQuantity);

router.patch("/decrease", authMiddleware, decreaseQuantity);

router.delete("/remove", authMiddleware, removeItem);

router.delete("/clear", authMiddleware, clearCart);
export default router;