import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

import {

getVendorProfile,

updateVendorProfile,

uploadProfileImage,

uploadKYCDocument,

updateDocumentDetails,

deleteDocument

} from "../controllers/ProfileController.js";

const router = express.Router();


/* ==========================================================
   GET PROFILE
========================================================== */

router.get(

"/",

authMiddleware,

getVendorProfile

);


/* ==========================================================
   UPDATE PROFILE
========================================================== */

router.put(

"/",

authMiddleware,

updateVendorProfile

);


/* ==========================================================
   PROFILE IMAGE
========================================================== */

router.post(

"/profile-image",

authMiddleware,

upload.single("image"),

uploadProfileImage

);


/* ==========================================================
   UPLOAD DOCUMENT
========================================================== */

router.post(

"/upload-document",

authMiddleware,

upload.single("document"),

uploadKYCDocument

);


/* ==========================================================
   UPDATE DOCUMENT DETAILS
========================================================== */

router.put(

"/document-details",

authMiddleware,

updateDocumentDetails

);


/* ==========================================================
   DELETE DOCUMENT
========================================================== */

router.delete(

"/document",

authMiddleware,

deleteDocument

);

export default router;