import express from "express";
import upload from "../middleware/upload.js";

import{
addProduct,
getAllProducts,
getVendorProducts,
getSingleProduct,
getRecommendedProducts,
getCategoryProducts,
addReview,
updateRating,
updateProduct,
deleteProduct,
changeStatus
}
from "../controllers/productController.js";

const router=express.Router();
router.post("/add",upload.array("images",4),addProduct);

router.get("/all",getAllProducts);
router.get("/vendor/:vendorId",getVendorProducts);
router.get("/recommended/:id",getRecommendedProducts);
router.get("/category/:category",getCategoryProducts);
router.post("/review/:id",addReview);
router.patch("/rating/:id",updateRating);
router.get("/:id",getSingleProduct);
router.put("/update/:id",upload.array("images",4),updateProduct);
router.delete("/delete/:id",deleteProduct);
router.patch("/status/:id",changeStatus);

export default router;