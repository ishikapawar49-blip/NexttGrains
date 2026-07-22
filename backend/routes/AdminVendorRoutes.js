import express from "express";

import {
getAllVendors,
getVendorById,
updateVendorApprovalStatus,
updateVendorKycStatus,
deleteVendor,
exportVendorsPDF,
exportVendorsExcel
} from "../controllers/AdminVendorController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ==========================================================
   EXPORT PDF
========================================================== */

router.get(
"/export/pdf",
authMiddleware,
adminMiddleware,
exportVendorsPDF
);

/* ==========================================================
   EXPORT EXCEL
========================================================== */

router.get(
"/export/excel",
authMiddleware,
adminMiddleware,
exportVendorsExcel
);
/* ==========================================================
   VENDOR LIST
========================================================== */

router.get(
"/",
authMiddleware,
adminMiddleware,
getAllVendors
);

/* ==========================================================
   SINGLE VENDOR
========================================================== */

router.get(
"/:id",
authMiddleware,
adminMiddleware,
getVendorById
);

/* ==========================================================
   UPDATE APPROVAL STATUS
========================================================== */

router.put(
"/:id/approval-status",
authMiddleware,
adminMiddleware,
updateVendorApprovalStatus
);
// 
router.put(
"/:id/kyc",
authMiddleware,
adminMiddleware,
updateVendorKycStatus
);
/* ==========================================================
   DELETE VENDOR
========================================================== */

router.delete(
"/:id",
authMiddleware,
adminMiddleware,
deleteVendor
);



export default router;