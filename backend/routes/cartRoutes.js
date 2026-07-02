import express from "express";

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

router.post("/add",addToCart);

router.get("/:userId",getCart);

router.patch("/increase",increaseQuantity);

router.patch("/decrease",decreaseQuantity);

router.delete("/remove",removeItem);

router.delete("/clear",clearCart);

export default router;