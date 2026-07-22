import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import blogRoutes from "./routes/blogRoutes.js"
import financeRoutes from "./routes/financeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import adminVendorRoutes from "./routes/AdminVendorRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();
connectDB();

const app=express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth",authRoutes);
app.use( "/api/customers", customerRoutes );
app.use( "/api/products", productRoutes );
app.use("/api/cart",cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/vendor/profile", profileRoutes);
app.use( "/api/admin/vendors", adminVendorRoutes);
// app.use("/api/notification", notificationRoutes);

app.get("/",(req,res)=>{
res.send("NexttGrains Backend Running");
});

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
console.log(`Server running on ${PORT}`);
});