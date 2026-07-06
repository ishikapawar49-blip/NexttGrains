import express from "express";

import {
    getDashboard,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    logout,
} from "../controllers/accountController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



/* ===========================================================
   ACCOUNT DASHBOARD
=========================================================== */

router.get(
    "/dashboard",
    authMiddleware,
    getDashboard
);



/* ===========================================================
   UPDATE PROFILE
=========================================================== */

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);



/* ===========================================================
   PROFILE IMAGE
=========================================================== */

router.put(
    "/profile/image",
    authMiddleware,
    uploadProfileImage
);

router.delete(
    "/profile/image",
    authMiddleware,
    removeProfileImage
);



/* ===========================================================
   LOGOUT
=========================================================== */

router.post(
    "/logout",
    authMiddleware,
    logout
);



export default router;