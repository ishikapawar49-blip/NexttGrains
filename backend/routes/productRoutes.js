import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
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
changeStatus,
getAdminProducts,
getProductStats,
filterProducts,
exportProductsExcel,
exportProductsPDF,
getCategories,
getVendors,
}
from "../controllers/productController.js";

const router=express.Router();
router.post(
    "/add",
    authMiddleware,
    upload.array("images",4),
    addProduct
);

router.get("/all",getAllProducts);
router.get("/vendor/:vendorId",getVendorProducts);
router.get("/recommended/:id",getRecommendedProducts);
router.get("/category/:category",getCategoryProducts);
router.post("/review/:id",addReview);
router.patch("/rating/:id",updateRating);

router.put(
    "/update/:id",
    authMiddleware,
    upload.array("images",4),
    updateProduct
);

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteProduct
);

router.patch(
    "/status/:id",
    authMiddleware,
    changeStatus
);
router.get("/admin/all", getAdminProducts);
router.get("/admin/stats", getProductStats);
router.get("/admin/filter", filterProducts);
router.get("/admin/categories",getCategories);
router.get("/admin/vendors",getVendors);
router.get("/admin/export/excel", exportProductsExcel);
router.get("/admin/export/pdf", exportProductsPDF);
router.get("/:id",getSingleProduct);
export default router;