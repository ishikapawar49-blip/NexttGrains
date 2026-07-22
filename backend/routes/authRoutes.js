import express from "express";
import {
registerUser,
loginUser,
adminLogin,
adminRegister,
getProfile,
vendorRegister,
vendorLogin
}
from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();


// CUSTOMER

router.post(

"/register",

registerUser

);

router.post(

"/login",

loginUser

);


// VENDOR

router.post(

"/vendor-register",

vendorRegister

);

router.post(

"/vendor-login",

vendorLogin

);

router.post(

"/admin-login",

adminLogin

);
router.post(

"/admin-register",

adminRegister

);
// PROFILE

router.get(

"/profile",

authMiddleware,

getProfile

);

export default router;