import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

/* ==========================================================
   HELPER
========================================================== */

const getLast30Days = () => {

const date = new Date();

date.setDate(date.getDate() - 30);

return date;

};

/* ==========================================================
   GET ALL VENDORS
========================================================== */

export const getAllVendors = async (req,res)=>{

try{

/* ======================================================
   QUERY
====================================================== */

const page = Number(req.query.page) || 1;

const limit = Number(req.query.limit) || 10;

const skip = (page-1)*limit;

const search = req.query.search || "";

const approvalStatus = req.query.status || "";

const businessCategory = req.query.category || "";

const businessType = req.query.type || "";

/* ======================================================
   FILTER
====================================================== */

const filter = {

role:"vendor",

isDeleted:false

};

if(search){

filter.$or=[

{
name:{
$regex:search,
$options:"i"
}
},

{
email:{
$regex:search,
$options:"i"
}
},

{
phone:{
$regex:search,
$options:"i"
}
},

{
"vendorProfile.vendorId":{
$regex:search,
$options:"i"
}
},

{
"vendorProfile.businessName":{
$regex:search,
$options:"i"
}
}

];

}

if(approvalStatus){

filter["vendorProfile.vendorApprovalStatus"]=
approvalStatus;

}

if(businessCategory){

filter["vendorProfile.businessCategory"]=
businessCategory;

}

if(businessType){

filter["vendorProfile.businessType"]=
businessType;

}

/* ======================================================
   GET VENDORS
====================================================== */

const vendors = await User.find(filter)

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit)

.select("-password");
console.log("----------------");

console.log(filter);

console.log(vendors);

console.log(vendors.length);

console.log("----------------");

const totalVendors =

await User.countDocuments(filter);

/* ======================================================
   LAST 30 DAYS
====================================================== */

const last30Days = getLast30Days();
// 
const stats = {

totalVendors,

verified: await User.countDocuments({
role:"vendor",
isDeleted:false,
"vendorProfile.kycStatus":"Verified"
}),

pendingKyc: await User.countDocuments({
role:"vendor",
isDeleted:false,
"vendorProfile.kycStatus":"Pending"
}),

suspended: await User.countDocuments({
role:"vendor",
isDeleted:false,
"vendorProfile.storeStatus":"Suspended"
})

};

/* ======================================================
   BUILD RESPONSE
====================================================== */

const vendorData = [];

for(const vendor of vendors){

/* ============================================
   PRODUCT COUNT
============================================ */
const productCount = await Product.countDocuments({
    vendorId: vendor._id,
    isDeleted: false,
    status: "Active"
});

// 
console.log("Vendor ID :", vendor._id.toString());

const products = await Product.find({
    vendorId: vendor._id
});

console.log(
    "Products Found :",
    products.length
);

products.forEach((product)=>{

    console.log(
        product.name,
        product.vendorId.toString(),
        product.status,
        product.isDeleted
    );

});

/* ============================================
   LAST 30 DAYS ORDERS
============================================ */

const orders=

await Order.find({

createdAt:{

$gte:last30Days

},

isDeleted:false,

"items.vendor":vendor._id

});

/* ============================================
   SALES
============================================ */

let revenue=0;

let orderCount=0;

orders.forEach(order=>{

const vendorItems=

order.items.filter(

item=>

item.vendor &&

item.vendor.toString()===

vendor._id.toString()

);

if(vendorItems.length){

orderCount++;

}

vendorItems.forEach(item=>{

revenue+=item.subtotal || 0;

});

});


/* ============================================
   PUSH
============================================ */

vendorData.push({

_id: vendor._id,

vendorId:
vendor.vendorProfile?.vendorId || "",

profileImage:
vendor.vendorProfile?.profileImage?.url || "",

vendorName:
vendor.name || "",

email:
vendor.email || "",

phone:
vendor.phone || "",

businessName:
vendor.vendorProfile?.businessName || "",

businessType:
vendor.vendorProfile?.businessType || "",

businessCategory:
vendor.vendorProfile?.businessCategory || "",

productCount,

last30DaysOrders:
orderCount,

last30DaysRevenue:
Number(revenue.toFixed(2)),

joinedDate:
vendor.createdAt,

approvalStatus:
vendor.vendorProfile?.vendorApprovalStatus || "Pending",

kycStatus:
vendor.vendorProfile?.kycStatus || "Pending",

});
}

/* ======================================================
   RESPONSE
====================================================== */
res.status(200).json({

success:true,

vendors:vendorData,

stats,

pagination:{

page,

limit,

totalPages:
Math.ceil(totalVendors/limit),

totalRecords:
totalVendors

}

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
/* ==========================================================
   GET SINGLE VENDOR DETAILS
========================================================== */

export const getVendorById = async (req,res)=>{

try{

const {id}=req.params;

/* ======================================================
   FIND VENDOR
====================================================== */

const vendor=

await User.findOne({

_id:id,

role:"vendor",

isDeleted:false

}).select("-password");

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

/* ======================================================
   PRODUCT COUNT
====================================================== */
const productCount = await Product.countDocuments({
    vendorId: vendor._id,
    isDeleted: false,
    status: "Active"
});

/* ======================================================
   LAST 30 DAYS
====================================================== */

const last30Days=getLast30Days();

/* ======================================================
   ORDERS
====================================================== */

const orders=

await Order.find({

createdAt:{

$gte:last30Days

},

isDeleted:false,

"items.vendor":vendor._id

});

/* ======================================================
   SALES
====================================================== */

let revenue=0;

let totalOrders=0;

orders.forEach(order=>{

const vendorItems=

order.items.filter(

item=>

item.vendor &&

item.vendor.toString()===

vendor._id.toString()

);

if(vendorItems.length){

totalOrders++;

}

vendorItems.forEach(item=>{

revenue+=item.subtotal || 0;

});

});

/* ======================================================
   RESPONSE
====================================================== */

res.status(200).json({
success:true,

vendor:{
_id:vendor._id,

vendorId:
vendor.vendorProfile?.vendorId || "",

profileImage:
vendor.vendorProfile?.profileImage?.url || "",

vendorName:
vendor.name,

ownerName:
vendor.vendorProfile.ownerName,

email:
vendor.email,

phone:
vendor.phone,

businessName:
vendor.vendorProfile?.businessName || "",

businessDescription:
vendor.vendorProfile.businessDescription,

businessType:
vendor.vendorProfile?.businessType || "",

businessCategory:
vendor.vendorProfile?.businessCategory || "",

website:
vendor.vendorProfile.website,

establishedYear:
vendor.vendorProfile.establishedYear,

address:{

locality:

vendor.vendorProfile.address.locality,

city:

vendor.vendorProfile.address.city,

state:

vendor.vendorProfile.address.state,

country:

vendor.vendorProfile.address.country,

pincode:

vendor.vendorProfile.address.pincode

},

location:{

latitude:

vendor.vendorProfile.location.latitude,

longitude:

vendor.vendorProfile.location.longitude

},

documents:{

pan:{

number:

vendor.vendorProfile.documents.pan.number,

status:

vendor.vendorProfile.documents.pan.status,

url:

vendor.vendorProfile.documents.pan.file.url

},

aadhaar:{

number:

vendor.vendorProfile.documents.aadhaar.number,

status:

vendor.vendorProfile.documents.aadhaar.status,

url:

vendor.vendorProfile.documents.aadhaar.file.url

},

gst:{

number:

vendor.vendorProfile.documents.gst.number,

status:

vendor.vendorProfile.documents.gst.status,

url:

vendor.vendorProfile.documents.gst.certificate.url

},

businessRegistration:{

number:

vendor.vendorProfile.documents.businessRegistration.number,

status:

vendor.vendorProfile.documents.businessRegistration.status,

url:

vendor.vendorProfile.documents.businessRegistration.file.url

}

},

profileCompletion:

vendor.vendorProfile.profileCompletion,

kycStatus:
vendor.vendorProfile?.kycStatus || "Pending",

storeStatus:
vendor.vendorProfile?.storeStatus || "Draft",

approvalStatus:
vendor.vendorProfile?.vendorApprovalStatus || "Pending",

lastLogin:

vendor.lastLogin,

joinedDate:

vendor.createdAt,

productCount,

last30DaysOrders:

totalOrders,

last30DaysRevenue:

Number(revenue.toFixed(2))

}

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
/* ==========================================================
   UPDATE VENDOR APPROVAL STATUS
========================================================== */

export const updateVendorApprovalStatus = async (req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;

/* ======================================================
   VALIDATION
====================================================== */

const allowedStatus=[

"Pending",
"Approved",
"Rejected"

];

if(!allowedStatus.includes(status)){

return res.status(400).json({

success:false,

message:"Invalid vendor approval status."

});

}

/* ======================================================
   FIND VENDOR
====================================================== */

const vendor=

await User.findOne({

_id:id,

role:"vendor",

isDeleted:false

});

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

/* ======================================================
   UPDATE STATUS
====================================================== */

vendor.vendorProfile.vendorApprovalStatus=status;

/* ======================================================
   OPTIONAL STORE STATUS
====================================================== */

if(status==="Approved"){

vendor.vendorProfile.storeStatus="Active";

}

if(status==="Rejected"){

vendor.vendorProfile.storeStatus="Suspended";

}

await vendor.save();

/* ======================================================
   RESPONSE
====================================================== */

res.status(200).json({

success:true,

message:"Vendor approval status updated successfully.",

vendor:{

_id:vendor._id,

vendorApprovalStatus:

vendor.vendorProfile.vendorApprovalStatus,

storeStatus:

vendor.vendorProfile.storeStatus

}

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


// UPDATEvENDOR KYC
export const updateVendorKycStatus = async (req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;

const vendor = await User.findById(id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found"

});

}

vendor.vendorProfile.kycStatus=status;

await vendor.save();

res.json({

success:true,

message:"KYC updated"

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
   DELETE VENDOR (SOFT DELETE)
========================================================== */

export const deleteVendor = async (req,res)=>{

try{

const {id}=req.params;

/* ======================================================
   FIND VENDOR
====================================================== */

const vendor=

await User.findOne({

_id:id,

role:"vendor",

isDeleted:false

});

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

/* ======================================================
   SOFT DELETE
====================================================== */

vendor.isDeleted=true;

await vendor.save();

/* ======================================================
   RESPONSE
====================================================== */

res.status(200).json({

success:true,

message:"Vendor deleted successfully."

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
/* ==========================================================
   EXPORT VENDORS PDF
========================================================== */

export const exportVendorsPDF = async (req,res)=>{

try{

const vendors=await User.find({

role:"vendor",

isDeleted:false

}).select("-password")

.sort({

createdAt:-1

});

/* ======================================================
   PDF
====================================================== */

const doc=new PDFDocument({

margin:35,

size:"A4"

});

res.setHeader(

"Content-Type",

"application/pdf"

);

res.setHeader(

"Content-Disposition",

'attachment; filename="NexttGrains_Vendors.pdf"'

);

doc.pipe(res);

/* ======================================================
   HEADER
====================================================== */

doc

.fontSize(24)

.fillColor("#355C32")

.text(

"NexttGrains",

{

align:"center"

}

);

doc.moveDown(.3);

doc

.fontSize(16)

.fillColor("#000")

.text(

"Vendor Management Report",

{

align:"center"

}

);

doc.moveDown(1.5);

/* ======================================================
   TABLE HEADER
====================================================== */

doc

.fontSize(10)

.font("Helvetica-Bold");

doc.text("Vendor ID",35,130);

doc.text("Vendor",105,130);

doc.text("Business",220,130);

doc.text("Products",340,130);

doc.text("Revenue",405,130);

doc.text("Status",485,130);

doc.text("Joined",545,130);

doc.moveTo(30,145)

.lineTo(580,145)

.stroke();

/* ======================================================
   DATA
====================================================== */

let y=155;

const last30Days=getLast30Days();

for(const vendor of vendors){
const productCount = await Product.countDocuments({
    vendorId: vendor._id,
    isDeleted: false,
    status: "Active"
});
const orders=

await Order.find({

createdAt:{

$gte:last30Days

},

isDeleted:false,

"items.vendor":vendor._id

});

let revenue=0;

orders.forEach(order=>{

const vendorItems=

order.items.filter(

item=>

item.vendor &&

item.vendor.toString()===

vendor._id.toString()

);

vendorItems.forEach(item=>{

revenue+=item.subtotal || 0;

});

});

if(y>760){

doc.addPage();

y=60;

}

doc

.font("Helvetica")

.fontSize(9);

doc.text(

vendor.vendorProfile.vendorId || "-",

35,

y,

{

width:65

}

);

doc.text(

vendor.name,

105,

y,

{

width:105

}

);

doc.text(

vendor.vendorProfile.businessName || "-",

220,

y,

{

width:105

}

);

doc.text(

String(productCount),

340,

y

);

doc.text(

`₹${revenue.toLocaleString("en-IN")}`,

405,

y

);

doc.text(

vendor.vendorProfile.vendorApprovalStatus,

485,

y

);

doc.text(

new Date(

vendor.createdAt

).toLocaleDateString(),

545,

y

);

y+=24;

}

/* ======================================================
   FOOTER
====================================================== */

doc.moveDown(2);

doc

.fontSize(10)

.fillColor("#666")

.text(

"Generated by NexttGrains Admin Panel",

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
/* ==========================================================
   EXPORT VENDORS EXCEL
========================================================== */

export const exportVendorsExcel = async (req,res)=>{

try{

const vendors=await User.find({

role:"vendor",

isDeleted:false

})

.select("-password")

.sort({

createdAt:-1

});

const workbook=new ExcelJS.Workbook();

const worksheet=workbook.addWorksheet("Vendors");

/* ======================================================
   HEADER
====================================================== */

worksheet.columns=[

{

header:"Vendor ID",

key:"vendorId",

width:18

},

{

header:"Vendor Name",

key:"vendorName",

width:25

},

{

header:"Business Name",

key:"businessName",

width:30

},

{

header:"Email",

key:"email",

width:30

},

{

header:"Phone",

key:"phone",

width:18

},

{

header:"Business Type",

key:"businessType",

width:20

},

{

header:"Category",

key:"category",

width:22

},

{

header:"Products",

key:"products",

width:12

},

{

header:"Orders (30 Days)",

key:"orders",

width:18

},

{

header:"Revenue (30 Days)",

key:"revenue",

width:20

},

{

header:"Approval Status",

key:"approval",

width:18

},

{

header:"KYC Status",

key:"kyc",

width:16

},

{

header:"Store Status",

key:"store",

width:16

},

{

header:"Joined",

key:"joined",

width:18

}

];

/* ======================================================
   STYLE HEADER
====================================================== */

worksheet.getRow(1).font={

bold:true,

color:{argb:"FFFFFFFF"}

};

worksheet.getRow(1).fill={

type:"pattern",

pattern:"solid",

fgColor:{argb:"355C32"}

};

worksheet.getRow(1).alignment={

vertical:"middle",

horizontal:"center"

};

/* ======================================================
   LAST 30 DAYS
====================================================== */

const last30Days=getLast30Days();


/* ======================================================
   DATA
====================================================== */

for(const vendor of vendors){
const productCount = await Product.countDocuments({
    vendorId: vendor._id,
    isDeleted: false,
    status: "Active"
});

const orders=

await Order.find({

createdAt:{

$gte:last30Days

},

isDeleted:false,

"items.vendor":vendor._id

});

let revenue=0;

let orderCount=0;

orders.forEach(order=>{

const vendorItems=

order.items.filter(

item=>

item.vendor &&

item.vendor.toString()===

vendor._id.toString()

);

if(vendorItems.length){

orderCount++;

}

vendorItems.forEach(item=>{

revenue+=item.subtotal || 0;

});

});

worksheet.addRow({

vendorId:

vendor.vendorProfile.vendorId,

vendorName:

vendor.name,

businessName:

vendor.vendorProfile.businessName,

email:

vendor.email,

phone:

vendor.phone,

businessType:

vendor.vendorProfile.businessType,

category:

vendor.vendorProfile.businessCategory,

products:

productCount,

orders:

orderCount,

revenue:

Number(revenue.toFixed(2)),

approval:

vendor.vendorProfile.vendorApprovalStatus,

kyc:

vendor.vendorProfile.kycStatus,

store:

vendor.vendorProfile.storeStatus,

joined:

new Date(

vendor.createdAt

).toLocaleDateString()

});

}

/* ======================================================
   ROW STYLE
====================================================== */

worksheet.eachRow((row,rowNumber)=>{

if(rowNumber===1)return;

row.alignment={

vertical:"middle",

horizontal:"center"

};

});

/* ======================================================
   RESPONSE
====================================================== */

res.setHeader(

"Content-Type",

"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

);

res.setHeader(

"Content-Disposition",

'attachment; filename="NexttGrains_Vendors.xlsx"'

);

await workbook.xlsx.write(res);

res.end();

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};