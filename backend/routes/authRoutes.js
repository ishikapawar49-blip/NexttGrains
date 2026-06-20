import express from "express";

import {

registerUser,

loginUser,

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


// PROFILE

router.get(

"/profile",

authMiddleware,

getProfile

);

export default router;