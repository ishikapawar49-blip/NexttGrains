import Coupon from "../models/coupon.js";

/* ===========================================================
   Create Coupon
=========================================================== */

export const createCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      couponName,
      description,
      couponType,
      discountValue,
      maxDiscount,
      minimumOrderAmount,
      maximumOrderAmount,
      usageLimit,
      perUserLimit,
      firstOrderOnly,
      applicableCategories,
      applicableProducts,
      applicableUsers,
      excludedProducts,
      excludedCategories,
      startDate,
      expiryDate,
      couponImage,
      bannerImage,
      status,
      adminRemark,
    } = req.body;

    /* ===========================================
       Required Validation
    =========================================== */

    if (
      !couponCode ||
      !couponName ||
      !couponType ||
      !discountValue ||
      !startDate ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    /* ===========================================
       Coupon Type Validation
    =========================================== */

    if (!["Flat", "Percentage"].includes(couponType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon type.",
      });
    }

    /* ===========================================
       Percentage Validation
    =========================================== */

    if (
      couponType === "Percentage" &&
      (discountValue <= 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount must be between 1 to 100.",
      });
    }

    /* ===========================================
       Flat Validation
    =========================================== */

    if (couponType === "Flat" && discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Flat discount should be greater than zero.",
      });
    }

    /* ===========================================
       Date Validation
    =========================================== */

    const start = new Date(startDate);
    const expiry = new Date(expiryDate);

    if (start >= expiry) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be greater than start date.",
      });
    }

    /* ===========================================
       Duplicate Coupon Check
    =========================================== */

    const existingCoupon = await Coupon.findOne({
      couponCode: couponCode.trim().toUpperCase(),
      isDeleted: false,
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists.",
      });
    }

    /* ===========================================
       Auto Expired Status
    =========================================== */

    let couponStatus = status || "Active";

    if (new Date() > expiry) {
      couponStatus = "Expired";
    }

    /* ===========================================
       Create Coupon
    =========================================== */
console.log(req.body);
console.log("REQ BODY =>", req.body);
const coupon = await Coupon.create({
    couponCode: couponCode.trim().toUpperCase(),
    couponName: couponName.trim(),
    description,

    couponType,

    discountValue: Number(discountValue),

    maxDiscount: Number(maxDiscount || 0),

    minimumOrderAmount: Number(minimumOrderAmount || 0),

    maximumOrderAmount: Number(maximumOrderAmount || 0),

    usageLimit: Number(usageLimit || 0),

    perUserLimit: Number(perUserLimit || 1),

    firstOrderOnly,

    applicableCategories: applicableCategories || [],

    applicableProducts: applicableProducts || [],

    applicableUsers: applicableUsers || [],

    excludedProducts: excludedProducts || [],

    excludedCategories: excludedCategories || [],

    startDate: start,

    expiryDate: expiry,

    couponImage,

    bannerImage,

    status: couponStatus,

    adminRemark,

    createdBy: null
});
    // const coupon = await Coupon.create({
    //   couponCode: couponCode.trim().toUpperCase(),
    //   couponName: couponName.trim(),
    //   description,
    //   couponType,
    //   discountValue,
    //   maxDiscount,
    //   minimumOrderAmount,
    //   maximumOrderAmount,
    //   usageLimit,
    //   perUserLimit,
    //   firstOrderOnly,
    //   applicableCategories,
    //   applicableProducts,
    //   applicableUsers,
    //   excludedProducts,
    //   excludedCategories,
    //   startDate: start,
    //   expiryDate: expiry,
    //   couponImage,
    //   bannerImage,
    //   status: couponStatus,
    //   adminRemark,
    //   createdBy: req.user?._id || null,
    // });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: coupon,
    });
  } catch (error) {

    console.log("ERROR =>", error);

    console.log(error.stack);

    return res.status(500).json({
        success:false,
        message:error.message,
        error:error
    });

}
};

/* ===========================================================
   Get All Coupons
=========================================================== */

export const getCoupons = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      couponType = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    /* ===========================================
       Filter
    =========================================== */

    const filter = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          couponCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          couponName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (couponType) {
      filter.couponType = couponType;
    }

    /* ===========================================
       Sorting
    =========================================== */

    const sortOption = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    /* ===========================================
       Pagination
    =========================================== */

    const totalCoupons = await Coupon.countDocuments(filter);

    const coupons = await Coupon.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    /* ===========================================
       Auto Expire Coupons
    =========================================== */

    const today = new Date();

    await Coupon.updateMany(
      {
        expiryDate: { $lt: today },
        status: { $ne: "Expired" },
        isDeleted: false,
      },
      {
        $set: {
          status: "Expired",
        },
      }
    );

    return res.status(200).json({
      success: true,
      totalCoupons,
      totalPages: Math.ceil(totalCoupons / limit),
      currentPage: page,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error("Get Coupons Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons.",
      error: error.message,
    });
  }
};

/* ===========================================================
   Get Coupon By Id
=========================================================== */

export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("applicableCategories", "categoryName")
      .populate("excludedCategories", "categoryName")
      .populate("applicableProducts", "productName")
      .populate("excludedProducts", "productName")
      .populate("applicableUsers", "name email");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    /* ===========================================
       Auto Expire
    =========================================== */

    if (
      coupon.status !== "Expired" &&
      new Date() > coupon.expiryDate
    ) {
      coupon.status = "Expired";
      await coupon.save();
    }

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Get Coupon Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupon.",
      error: error.message,
    });
  }
};
/* ===========================================================
   Update Coupon
=========================================================== */

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    const {
      couponCode,
      couponName,
      description,
      couponType,
      discountValue,
      maxDiscount,
      minimumOrderAmount,
      maximumOrderAmount,
      usageLimit,
      perUserLimit,
      firstOrderOnly,
      applicableCategories,
      applicableProducts,
      applicableUsers,
      excludedProducts,
      excludedCategories,
      startDate,
      expiryDate,
      couponImage,
      bannerImage,
      status,
      adminRemark,
    } = req.body;

    /* ===========================================
       Duplicate Coupon Code Check
    =========================================== */

    if (couponCode) {
      const existingCoupon = await Coupon.findOne({
        couponCode: couponCode.trim().toUpperCase(),
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message: "Coupon code already exists.",
        });
      }

      coupon.couponCode = couponCode.trim().toUpperCase();
    }

    /* ===========================================
       Percentage Validation
    =========================================== */

    if (
      couponType === "Percentage" &&
      (discountValue <= 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount must be between 1 and 100.",
      });
    }

    /* ===========================================
       Flat Validation
    =========================================== */

    if (couponType === "Flat" && discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Flat discount should be greater than zero.",
      });
    }

    /* ===========================================
       Date Validation
    =========================================== */

    if (startDate && expiryDate) {
      const start = new Date(startDate);
      const expiry = new Date(expiryDate);

      if (start >= expiry) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be after start date.",
        });
      }

      coupon.startDate = start;
      coupon.expiryDate = expiry;
    }

    /* ===========================================
       Update Fields
    =========================================== */

    if (couponName !== undefined) coupon.couponName = couponName;
    if (description !== undefined) coupon.description = description;
    if (couponType !== undefined) coupon.couponType = couponType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (minimumOrderAmount !== undefined)
      coupon.minimumOrderAmount = minimumOrderAmount;
    if (maximumOrderAmount !== undefined)
      coupon.maximumOrderAmount = maximumOrderAmount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;
    if (firstOrderOnly !== undefined)
      coupon.firstOrderOnly = firstOrderOnly;

    if (applicableCategories !== undefined)
      coupon.applicableCategories = applicableCategories;

    if (applicableProducts !== undefined)
      coupon.applicableProducts = applicableProducts;

    if (applicableUsers !== undefined)
      coupon.applicableUsers = applicableUsers;

    if (excludedProducts !== undefined)
      coupon.excludedProducts = excludedProducts;

    if (excludedCategories !== undefined)
      coupon.excludedCategories = excludedCategories;

    if (couponImage !== undefined)
      coupon.couponImage = couponImage;

    if (bannerImage !== undefined)
      coupon.bannerImage = bannerImage;

    if (adminRemark !== undefined)
      coupon.adminRemark = adminRemark;

    /* ===========================================
       Status Update
    =========================================== */

    if (status) {
      coupon.status = status;
    }

    if (new Date() > coupon.expiryDate) {
      coupon.status = "Expired";
    }

    coupon.updatedBy = req.user?._id || null;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    });
  } catch (error) {
    console.error("Update Coupon Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon.",
      error: error.message,
    });
  }
};

/* ===========================================================
   Delete Coupon (Soft Delete)
=========================================================== */

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isDeleted = true;
    coupon.updatedBy = req.user?._id || null;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Coupon Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
      error: error.message,
    });
  }
};

/* ===========================================================
   Change Coupon Status
=========================================================== */

export const changeCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive", "Expired"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon status.",
      });
    }

    const coupon = await Coupon.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (new Date() > coupon.expiryDate) {
      coupon.status = "Expired";
    } else {
      coupon.status = status;
    }

    coupon.updatedBy = req.user?._id || null;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon status updated successfully.",
      data: coupon,
    });
  } catch (error) {
    console.error("Change Coupon Status Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon status.",
      error: error.message,
    });
  }
};

/* ===========================================================
   Get Active Coupons
=========================================================== */

export const getActiveCoupons = async (req, res) => {
  try {
    await Coupon.updateMany(
      {
        expiryDate: { $lt: new Date() },
        status: { $ne: "Expired" },
        isDeleted: false,
      },
      {
        $set: {
          status: "Expired",
        },
      }
    );

    const coupons = await Coupon.find({
      status: "Active",
      isDeleted: false,
      startDate: { $lte: new Date() },
      expiryDate: { $gte: new Date() },
    })
      .sort({
        createdAt: -1,
      })
      .populate("applicableCategories", "categoryName")
      .populate("applicableProducts", "productName");

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error("Get Active Coupons Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active coupons.",
      error: error.message,
    });
  }
};

/* ===========================================================
   Validate Coupon (Checkout)
=========================================================== */

export const validateCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      orderAmount,
      userId,
      isFirstOrder = false,
    } = req.body;

    if (!couponCode || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and order amount are required.",
      });
    }

    const coupon = await Coupon.findOne({
      couponCode: couponCode.trim().toUpperCase(),
      isDeleted: false,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    /* ===========================================
       Status Check
    =========================================== */

    if (coupon.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Coupon is not active.",
      });
    }

    /* ===========================================
       Date Validation
    =========================================== */

    const today = new Date();

    if (today < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not started yet.",
      });
    }

    if (today > coupon.expiryDate) {
      coupon.status = "Expired";
      await coupon.save();

      return res.status(400).json({
        success: false,
        message: "Coupon has expired.",
      });
    }

    /* ===========================================
       Usage Limit
    =========================================== */

    if (
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded.",
      });
    }

    /* ===========================================
       Minimum Order Validation
    =========================================== */

    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount should be ₹${coupon.minimumOrderAmount}.`,
      });
    }

    /* ===========================================
       Maximum Order Validation
    =========================================== */

    if (
      coupon.maximumOrderAmount > 0 &&
      orderAmount > coupon.maximumOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Maximum eligible order amount is ₹${coupon.maximumOrderAmount}.`,
      });
    }

    /* ===========================================
       First Order Validation
    =========================================== */

    if (coupon.firstOrderOnly && !isFirstOrder) {
      return res.status(400).json({
        success: false,
        message: "Coupon is valid only for first order.",
      });
    }

    /* ===========================================
       Discount Calculation
    =========================================== */

    let discount = 0;

    if (coupon.couponType === "Flat") {
      discount = coupon.discountValue;
    } else {
      discount = (orderAmount * coupon.discountValue) / 100;

      if (
        coupon.maxDiscount > 0 &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    }

    const finalAmount = Math.max(orderAmount - discount, 0);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: {
        couponId: coupon._id,
        couponCode: coupon.couponCode,
        couponName: coupon.couponName,
        couponType: coupon.couponType,
        discount,
        finalAmount,
        orderAmount,
        remainingUses: coupon.remainingUses,
        userId,
      },
    });
  } catch (error) {
    console.error("Validate Coupon Error :", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon.",
      error: error.message,
    });
  }
};