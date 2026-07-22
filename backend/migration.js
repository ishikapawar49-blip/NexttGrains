import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

console.log("Mongo Connected");

const result = await Product.updateMany(
  {
    isDeleted: { $exists: false }
  },
  {
    $set: {
      isDeleted: false
    }
  }
);

console.log(result);

process.exit();