import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ==========================================================
   MONTH NAMES
========================================================== */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ==========================================================
   WEEK DAYS
========================================================== */

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/* ==========================================================
   FORMAT CATEGORY NAME
========================================================== */

const formatCategoryName = (category) => {
  if (!category) return "Others";

  if (typeof category === "string") {
    return category.trim();
  }

  if (category.name) {
    return category.name;
  }

  if (category.categoryName) {
    return category.categoryName;
  }

  return "Others";
};

/* ==========================================================
   GENERATE VENDOR REPORT ANALYTICS
========================================================== */

export const generateVendorAnalytics = async (vendorId) => {

  /* ========================================================
     GET ALL ORDERS OF THIS VENDOR
  ======================================================== */

  const orders = await Order.find({
    isDeleted: false,
    "items.vendor": vendorId,
  })
    .populate({
      path: "user",
      select: "name fullName firstName lastName",
    })
    .populate({
      path: "items.product",
      select: "category categoryName",
    })
    .sort({
      createdAt: -1,
    });

  /* ========================================================
     SUMMARY VARIABLES
  ======================================================== */

  let totalRevenue = 0;

  let totalOrders = 0;

  let deliveredOrders = 0;

  let pendingOrders = 0;

  let shippedOrders = 0;

  /* ========================================================
     REPEAT BUYER
  ======================================================== */

  const buyerMap = {};

  /* ========================================================
     CATEGORY SPLIT
  ======================================================== */

  const categoryMap = {};

  /* ========================================================
     MONTHLY REVENUE
  ======================================================== */

  const monthlyRevenueMap = {};

  MONTHS.forEach((month) => {
    monthlyRevenueMap[month] = 0;
  });

  /* ========================================================
     ORDERS BY DAY
  ======================================================== */

  const ordersByDayMap = {};

  WEEK_DAYS.forEach((day) => {
    ordersByDayMap[day] = 0;
  });

  /* ========================================================
     PROCESS EACH ORDER
  ======================================================== */

  for (const order of orders) {

    const vendorItems = order.items.filter(
      (item) =>
        item.vendor &&
        item.vendor.toString() === vendorId.toString()
    );

    if (!vendorItems.length) continue;

    totalOrders++;
        /* ========================================================
       REVENUE
    ======================================================== */

    let vendorOrderRevenue = 0;

    vendorItems.forEach((item) => {

      vendorOrderRevenue += item.subtotal || 0;

    });

    totalRevenue += vendorOrderRevenue;

    /* ========================================================
       DELIVERY STATUS
    ======================================================== */

    switch (order.orderStatus) {

      case "Delivered":
        deliveredOrders++;
        break;

      case "Shipped":
      case "Out For Delivery":
        shippedOrders++;
        break;

      default:
        pendingOrders++;
        break;

    }

    /* ========================================================
       REPEAT BUYERS
    ======================================================== */

    const customerId = order.user?._id?.toString();

    if (customerId) {

      buyerMap[customerId] = (buyerMap[customerId] || 0) + 1;

    }

    /* ========================================================
       MONTHLY REVENUE
    ======================================================== */

    const monthName = MONTHS[
      new Date(order.createdAt).getMonth()
    ];

    monthlyRevenueMap[monthName] += vendorOrderRevenue;

    /* ========================================================
       ORDERS BY DAY
    ======================================================== */

    const weekDay = WEEK_DAYS[
      new Date(order.createdAt).getDay()
    ];

    ordersByDayMap[weekDay]++;

    /* ========================================================
       CATEGORY SPLIT
    ======================================================== */

    vendorItems.forEach((item) => {

      const categoryName = formatCategoryName(
        item.product?.category ||
        item.product?.categoryName
      );

      categoryMap[categoryName] =
        (categoryMap[categoryName] || 0) +
        item.subtotal;

    });

  }

  /* ========================================================
     REPEAT BUYERS %
  ======================================================== */

  let repeatBuyerCount = 0;

  Object.values(buyerMap).forEach((count) => {

    if (count > 1) {

      repeatBuyerCount++;

    }

  });

  const repeatBuyerPercentage =
    Object.keys(buyerMap).length === 0
      ? 0
      : Number(
          (
            (repeatBuyerCount /
              Object.keys(buyerMap).length) *
            100
          ).toFixed(1)
        );
          /* ========================================================
     SUMMARY
  ======================================================== */

  const summary = {

    revenue: Number(totalRevenue.toFixed(2)),

    totalOrders,

    pendingOrders,

    shippedOrders,

    deliveredOrders,

    repeatBuyers: repeatBuyerCount,

    repeatBuyerPercentage,

    rating: 0

  };

  /* ========================================================
     MONTHLY REVENUE CHART
  ======================================================== */

  const monthlyRevenue = MONTHS.map((month) => ({

    month,

    revenue: Number(monthlyRevenueMap[month].toFixed(2))

  }));

  /* ========================================================
     CATEGORY SPLIT CHART
  ======================================================== */

  const categorySplit = Object.entries(categoryMap).map(

    ([category, revenue]) => ({

      category,

      revenue: Number(revenue.toFixed(2))

    })

  );

  /* ========================================================
     ORDERS BY DAY CHART
  ======================================================== */

  const ordersByDay = WEEK_DAYS.map((day) => ({

    day,

    orders: ordersByDayMap[day]

  }));

  /* ========================================================
     TOP CATEGORIES
  ======================================================== */

  categorySplit.sort(

    (a, b) => b.revenue - a.revenue

  );

  /* ========================================================
     RETURN
  ======================================================== */

  return {

    summary,

    monthlyRevenue,

    categorySplit,

    ordersByDay

  };

};