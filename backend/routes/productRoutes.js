import express from "express";

import{

addProduct,

getVendorProducts,

updateProduct,

deleteProduct,

changeStatus

}

from "../controllers/productController.js";

const router=

express.Router();

router.post(

"/add",

addProduct

);

router.get(

"/vendor/:vendorId",

getVendorProducts

);

router.put(

"/update/:id",

updateProduct

);

router.delete(

"/delete/:id",

deleteProduct

);

router.patch(

"/status/:id",

changeStatus

);

export default router;