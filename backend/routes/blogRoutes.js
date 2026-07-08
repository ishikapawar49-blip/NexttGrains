import express from "express";
import upload from "../middleware/upload.js";
import {

    createBlog,

    getBlogs,

    getBlogById,

    updateBlog,

    deleteBlog,

    changeBlogStatus,

    incrementBlogViews,

    getPublishedBlogs

} from "../controllers/blogController.js";

// import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   ADMIN ROUTES
========================================================== */

// Create Blog
router.post(
    "/create",
    upload.fields([
        {
            name: "featuredImage",
            maxCount: 1
        },
        {
            name: "bannerImage",
            maxCount: 1
        }
    ]),
    createBlog
);

// Get All Blogs

router.get(

    "/",

    // verifyToken,

    // isAdmin,

    getBlogs

);

// Published Blogs

router.get(

    "/published",

    getPublishedBlogs

);

// Get Blog By Id

router.get(

    "/:id",

    // verifyToken,

    // isAdmin,

    getBlogById

);

// Update Blog
router.put(
    "/update/:id",
    upload.fields([
        {
            name: "featuredImage",
            maxCount: 1
        },
        {
            name: "bannerImage",
            maxCount: 1
        }
    ]),
    updateBlog
);

// Delete Blog

router.delete(

    "/delete/:id",

    // verifyToken,

    // isAdmin,

    deleteBlog

);

// Change Status

router.patch(

    "/status/:id",

    // verifyToken,

    // isAdmin,

    changeBlogStatus

);

// Increase Views

router.patch(

    "/views/:id",

    incrementBlogViews

);

export default router;