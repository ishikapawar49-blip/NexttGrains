import User from "../models/User.js";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";
import Product from "../models/Product.js";



/* ===========================================================
   HELPER : ACCOUNT STATS
=========================================================== */

const getAccountStats = async (userId) => {

    const totalOrders = await Order.countDocuments({
        user: userId,
    });

    const wishlist = await Wishlist.findOne({
        user: userId,
    });

    const addressCount = await Address.countDocuments({
        user: userId,
    });

    const notificationCount = await Notification.countDocuments({
        user: userId,
        isRead: false,
    });

    const couponCount = await Coupon.countDocuments({
        status: "Active",
    });

    const savedAmount = await Order.aggregate([
        {
            $match: {
                user: userId,
                paymentStatus: "Paid",
            },
        },
        {
            $group: {
                _id: null,
                totalSaved: {
                    $sum: "$discount",
                },
            },
        },
    ]);

    return {

        orders: totalOrders,

        wishlist: wishlist
            ? wishlist.products.length
            : 0,

        addresses: addressCount,

        notifications: notificationCount,

        coupons: couponCount,

        saved:

            savedAmount.length > 0
                ? savedAmount[0].totalSaved
                : 0,
    };
};



/* ===========================================================
   HELPER : RECENT ORDERS
=========================================================== */

const getRecentOrders = async (userId) => {

    const orders = await Order.find({

        user: userId,

    })

        .sort({

            createdAt: -1,

        })

        .limit(5)

        .select(

            "orderNumber totalItems grandTotal orderStatus estimatedDeliveryDate createdAt"
        );

    return orders;
};



/* ===========================================================
   HELPER : RECOMMENDED PRODUCTS
=========================================================== */

const getRecommendedProducts = async () => {

    const products = await Product.find({

        status: "Active",

        stock: {

            $gt: 0,

        },

    })

        .sort({

            sold: -1,

            rating: -1,

        })

        .limit(4)

        .select(

            "name price images thumbnail rating mrp"
        );

    return products;
};



/* ===========================================================
   HELPER : ACCOUNT INSIGHTS
=========================================================== */

const getAccountInsights = async (userId) => {

    const deliveredOrders = await Order.countDocuments({

        user: userId,

        orderStatus: "Delivered",

    });

    const cashbackEarned = await Order.aggregate([

        {

            $match: {

                user: userId,

                paymentStatus: "Paid",

            },

        },

        {

            $group: {

                _id: null,

                totalCashback: {

                    $sum: "$discount",

                },

            },

        },

    ]);

    return {

        ordersDelivered: deliveredOrders,

        averageDeliveryDays: 7,

        cashbackEarned:

            cashbackEarned.length > 0

                ? cashbackEarned[0].totalCashback

                : 0,

    };
};



/* ===========================================================
   GET DASHBOARD
=========================================================== */

export const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;



        const profile = await User.findById(userId).select(

            "-password"
        );



        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "User not found.",

            });

        }



        const [

            stats,

            recentOrders,

            recommendedProducts,

            insights,

            notifications,

            coupons,

        ] = await Promise.all([

            getAccountStats(userId),

            getRecentOrders(userId),

            getRecommendedProducts(),

            getAccountInsights(userId),

            Notification.find({

                user: userId,

            })

                .sort({

                    createdAt: -1,

                })

                .limit(5),

            Coupon.find({

                status: "Active",

            })

                .sort({

                    createdAt: -1,

                })

                .limit(5),

        ]);



        return res.status(200).json({

            success: true,

            message: "Account dashboard fetched successfully.",

            data: {

                profile,

                stats,

                recentOrders,

                recommendedProducts,

                insights,

                notifications,

                coupons,

            },

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};

/* ===========================================================
   UPDATE PROFILE
=========================================================== */

export const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            name,

            gender,

            dateOfBirth,

        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(

            userId,

            {
                name,
                gender,
                dateOfBirth,
            },

            {
                new: true,
                runValidators: true,
            }

        ).select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile updated successfully.",

            data: updatedUser,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};



/* ===========================================================
   UPLOAD PROFILE IMAGE
=========================================================== */

export const uploadProfileImage = async (req, res) => {

    try {

        const userId = req.user.id;

        const { profileImage } = req.body;

        const updatedUser = await User.findByIdAndUpdate(

            userId,

            {
                profileImage,
            },

            {
                new: true,
            }

        ).select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile image updated successfully.",

            data: updatedUser,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};



/* ===========================================================
   REMOVE PROFILE IMAGE
=========================================================== */

export const removeProfileImage = async (req, res) => {

    try {

        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(

            userId,

            {
                profileImage: "",
            },

            {
                new: true,
            }

        ).select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile image removed successfully.",

            data: updatedUser,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};



/* ===========================================================
   LOGOUT
=========================================================== */

export const logout = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,

            message: "Logged out successfully.",

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error.",

        });

    }

};