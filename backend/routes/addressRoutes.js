import express from "express";

import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// Create Address
router.post("/", authMiddleware, createAddress);
// Get Addresses
router.get("/", authMiddleware, getAddresses);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id",authMiddleware,deleteAddress);

export default router;