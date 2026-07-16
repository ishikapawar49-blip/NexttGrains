import Report from "../models/Report.js";
import Order from "../models/Order.js";
import Customer from "../models/User.js";
import Product from "../models/Product.js";
import Finance from "../models/Finance.js";
import Coupon from "../models/Coupon.js";
import { generateAnalytics } from "../utils/reportAnalytics.js";
import { generateVendorAnalytics } from "../utils/vendorReportAnalytics.js";
import PDFDocument from "pdfkit";

/* ==========================================================
   CREATE REPORT
========================================================== */

export const createReport = async(req,res)=>{

try{

const{

reportName,

reportType,

startDate,

endDate,

notes

}=req.body;

/* ===========================
   Date Filter
=========================== */
const analytics = await generateAnalytics(
startDate,
endDate
);
/* ===========================
   RESPONSE
=========================== */
const report = await Report.create({

    reportName,

    reportType,

    startDate,

    endDate,

    notes,

    ...analytics

});
res.status(201).json({

success:true,

message:"Report generated successfully.",

report

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:"Failed to generate report.",

error:error.message

});

}

};

/* ==========================================================
   GET ALL REPORTS
========================================================== */

export const getReports=async(req,res)=>{

try{

const reports=

await Report.find({

isDeleted:false

})

.sort({

generatedAt:-1

});

res.status(200).json({

success:true,

reports

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   GET DASHBOARD ANALYTICS
========================================================== */

export const getDashboardAnalytics=async(req,res)=>{

try{
const analytics = await generateAnalytics();

res.json({
success:true,
analytics
});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   DELETE REPORT
========================================================== */

export const deleteReport=async(req,res)=>{

try{

await Report.findByIdAndUpdate(

req.params.id,

{

isDeleted:true

}

);

res.status(200).json({

success:true,

message:"Report deleted successfully."

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
/* ==========================================================
   REVENUE CHART
========================================================== */

export const getRevenueChart=async(req,res)=>{

try{
const analytics = await generateAnalytics();

res.json({
success:true,
chart: analytics.revenueChart
});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   ORDER CHART
========================================================== */

export const getOrderChart=async(req,res)=>{

try{
const analytics = await generateAnalytics();

res.json({
success:true,
chart: analytics.orderChart
});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   CUSTOMER CHART
========================================================== */

export const getCustomerChart=async(req,res)=>{

try{
const analytics = await generateAnalytics();

res.json({
success:true,
chart: analytics.customerChart
});
}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   CATEGORY CHART
========================================================== */

export const getCategoryChart=async(req,res)=>{

try{
const analytics = await generateAnalytics();

res.json({
success:true,
chart: analytics.categoryChart
});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

/* ==========================================================
   EXPORT PDF
========================================================== */

export const exportPDF=async(req,res)=>{

try{

const report=

await Report.findById(

req.params.id

);

if(!report){

return res.status(404).json({

success:false,

message:"Report not found."

});

}

const doc=

new PDFDocument({

margin:50,

size:"A4"

});

res.setHeader(

"Content-Type",

"application/pdf"

);

res.setHeader(

"Content-Disposition",

`attachment; filename=${report.reportName}.pdf`

);

doc.pipe(res);

/* ======================================================
   HEADER
====================================================== */

doc

.fontSize(24)

.fillColor("#2E7D32")

.text(

"NexttGrains",

{

align:"center"

}

);

doc.moveDown(.5);

doc

.fontSize(18)

.fillColor("#000")

.text(

"Business Analytics Report",

{

align:"center"

}

);

doc.moveDown();

doc.fontSize(12);

doc.text(

`Report : ${report.reportName}`

);

doc.text(

`Type : ${report.reportType}`

);

doc.text(

`Generated : ${new Date(

report.generatedAt

).toLocaleString()}`

);

doc.moveDown();

/* ======================================================
   FINANCIAL SUMMARY
====================================================== */

doc

.fontSize(16)

.fillColor("#2E7D32")

.text("Financial Summary");

doc.moveDown(.5);

doc.fillColor("#000");

doc.text(

`Gross Revenue : ₹ ${report.grossRevenue}`

);

doc.text(

`Net Revenue : ₹ ${report.netRevenue}`

);

doc.text(

`Profit : ₹ ${report.totalProfit}`

);

doc.text(

`Expense : ₹ ${report.totalExpense}`

);

doc.text(

`Vendor Payout : ₹ ${report.vendorPayout}`

);

doc.text(

`GST : ₹ ${report.gstCollected}`

);

doc.moveDown();

/* ======================================================
   ORDERS
====================================================== */

doc

.fontSize(16)

.fillColor("#2E7D32")

.text("Orders");

doc.moveDown(.5);

doc.fillColor("#000");

doc.text(

`Total Orders : ${report.totalOrders}`

);

doc.text(

`Completed : ${report.completedOrders}`

);

doc.text(

`Cancelled : ${report.cancelledOrders}`

);

doc.text(

`Returned : ${report.returnedOrders}`

);

doc.text(

`Average Order Value : ₹ ${report.averageOrderValue}`

);

doc.moveDown();

/* ======================================================
   CUSTOMERS
====================================================== */

doc

.fontSize(16)

.fillColor("#2E7D32")

.text("Customers");

doc.moveDown(.5);

doc.fillColor("#000");

doc.text(

`Total Customers : ${report.totalCustomers}`

);

doc.text(

`New Customers : ${report.newCustomers}`

);

doc.text(

`Repeat Customers : ${report.repeatCustomers}`

);

doc.text(

`Conversion Rate : ${report.conversionRate}%`

);

doc.moveDown();

/* ======================================================
   FOOTER
====================================================== */

doc.moveDown(2);

doc

.fontSize(10)

.fillColor("#777")

.text(

"Generated automatically by NexttGrains Admin Dashboard",

{

align:"center"

}

);

doc.end();

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};

// VENDOR
/* ==========================================================
   VENDOR DASHBOARD ANALYTICS
========================================================== */

export const getVendorDashboardAnalytics = async (req, res) => {

try{

const vendorId = req.user.id;

const analytics = await generateVendorAnalytics(vendorId);

res.status(200).json({

success:true,

analytics

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};