import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";



/* ===========================================================
   TOGGLE WISHLIST
=========================================================== */

export const toggleWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.body;



        if (!productId) {

            return res.status(400).json({

                success: false,

                message: "Product ID is required.",

            });

        }



        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found.",

            });

        }



        let wishlist = await Wishlist.findOne({

            user: userId,

        });



        if (!wishlist) {

            wishlist = await Wishlist.create({

                user: userId,

                products: [

                    {

                        product: productId,

                    },

                ],

            });

            return res.status(201).json({

                success: true,

                action: "added",

                message: "Product added to wishlist.",

                wishlist,

            });

        }



        const exists = wishlist.products.find(

            (item) =>

                item.product.toString() === productId

        );



        if (exists) {

            wishlist.products = wishlist.products.filter(

                (item) =>

                    item.product.toString() !== productId

            );



            await wishlist.save();



            return res.status(200).json({

                success: true,

                action: "removed",

                message: "Product removed from wishlist.",

                wishlist,

            });

        }



        wishlist.products.push({

            product: productId,

        });



        await wishlist.save();



        return res.status(200).json({

            success: true,

            action: "added",

            message: "Product added to wishlist.",

            wishlist,

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
   GET WISHLIST
=========================================================== */

export const getWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({

            user: userId,

        }).populate({

            path: "products.product",
select:
"name price mrp images thumbnail rating reviews reviewList stock status quantity unit shortDescription"
  });

        if (!wishlist) {

            return res.status(200).json({

                success: true,

                products: [],

            });

        }
        wishlist.products.forEach(item => {
    if (item.product) {
        item.product.reviews = item.product.reviewList?.length || 0;
    }
});

        return res.status(200).json({

            success: true,

            products: wishlist.products,

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
   REMOVE SINGLE ITEM
=========================================================== */

export const removeWishlistItem = async (req, res) => {

    try {

        const userId = req.user.id;

        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({

            user: userId,

        });

        if (!wishlist) {

            return res.status(404).json({

                success: false,

                message: "Wishlist not found.",

            });

        }

        wishlist.products = wishlist.products.filter(

            (item) =>

                item.product.toString() !== productId

        );

        await wishlist.save();

        return res.status(200).json({

            success: true,

            message: "Product removed successfully.",

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
   CLEAR WISHLIST
=========================================================== */

export const clearWishlist = async (req, res) => {

    try {

        const userId = req.user.id;

        await Wishlist.findOneAndUpdate(

            {

                user: userId,

            },

            {

                products: [],

            }

        );

        return res.status(200).json({

            success: true,

            message: "Wishlist cleared successfully.",

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