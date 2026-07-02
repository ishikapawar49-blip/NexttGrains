import express from "express";

import {
  createAddress,
  getAddresses,
} from "../controllers/addressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Address
router.post("/", protect, createAddress);

// Get Logged-in User Addresses
router.get("/", protect, getAddresses);

export default router;