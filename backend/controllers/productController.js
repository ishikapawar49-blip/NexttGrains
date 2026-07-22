import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import generateProductId from "../utils/productIdGenerator.js";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

// =====================
// ADD PRODUCT
// =====================
export const addProduct=async(req,res)=>{

try{
console.log("BODY =", req.body);

console.log("FILES =", req.files);

console.log("Cloud =", process.env.CLOUDINARY_CLOUD_NAME);

console.log("Key =", process.env.CLOUDINARY_API_KEY);

const{
vendorId,
name,
category,
quantity,
unit,
shortDescription,
aboutProduct,
packagingDate,
expiryDate,
price,
mrp,
rating,
reviews,
nutrition,
stock
}=req.body;

if(
!vendorId||
!name||
!category||
!quantity||
!unit||
!shortDescription||
!aboutProduct||
!packagingDate||
!expiryDate||
!price||
!mrp||
stock===undefined||
!req.files||
req.files.length<1||
req.files.length>4
){

return res.status(400).json({

success:false,

message:"Please fill all fields"

});

}
console.log(req.body);
console.log(req.files);
const productId = await generateProductId();

const sku = "SKU-" + Math.floor(
100000 + Math.random() * 900000
);
const vendor = await User.findById(vendorId);

const vendorName = vendor?.name || "";
const imageUrls=[];

for(const file of req.files){

const base64=`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploaded=await cloudinary.uploader.upload(base64,{
folder:"NextTGrains/products",
resource_type:"image"
});

imageUrls.push(uploaded.secure_url);

}

//  create product
const product=await Product.create({
productId,
sku,
vendorName,
brand:req.body.brand,
discount:req.body.discount || 0,
tax:req.body.tax || 0,
featured:req.body.featured || false,
newArrival:req.body.newArrival || false,
published:req.body.published ?? true,
minStock:req.body.minStock || 20,
vendorId,
name,
category,
quantity,
unit,
shortDescription,
aboutProduct,
packagingDate,
expiryDate,
price,
mrp,
rating: 0,
averageRating: 0,
reviews: 0,
reviewList: [],
nutrition: nutrition ? JSON.parse(nutrition) : [],
stock,
sold:0,
thumbnail:imageUrls[0],
images:imageUrls,
status:
stock==0 ? "Out Of Stock" : "Active"
});

res.status(201).json({

success:true,

message:"Product Added",

product

});

}

catch(err){
console.log("==================");
console.log(err);
console.log(err.message);
console.log("==================");
res.status(500).json({

success:false,

message:err.message

});

}

};


// =====================
// GET VENDOR PRODUCTS
// =====================

export const getVendorProducts=async(req,res)=>{

try{

const products=

await Product.find({

vendorId:req.params.vendorId

}).sort({

createdAt:-1

});

res.json({

success:true,

products

});

}

catch(err){

console.log("==================");
console.log(err);
console.log(err.message);
console.log("==================");

res.status(500).json({

success:false,

message:err.message

});

}

};

// =====================
// GET ALL ACTIVE PRODUCTS
// =====================

export const getAllProducts = async (req,res)=>{

try{

const products = await Product.find({
status:"Active",
stock:{ $gt:0 }
})
.sort({createdAt:-1});

res.json({
success:true,
products
});

}

catch(err){

res.status(500).json({
success:false,
message:err.message
});

}

};

// =====================
// GET SINGLE PRODUCT
// =====================
export const getSingleProduct = async (req,res)=>{

try{

const product = await Product.findById(req.params.id);

if(!product){

return res.status(404).json({

success:false,
message:"Product not found"

});

}

res.json({

success:true,
product

});

}

catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

};

// recommended products
export const getRecommendedProducts = async(req,res)=>{

try{

const current = await Product.findById(req.params.id);

if(!current){

return res.status(404).json({

success:false,

message:"Product not found"

});

}

// const products = await Product.find({

// category:current.category,

// _id:{

// $ne:req.params.id

// },

// status:"Active",

// stock:{

// $gt:0

// }

// })

// .limit(4)

// .sort({

// createdAt:-1

// });
const products = await Product.find({
    status: "Active",
    stock: { $gt: 0 }
}).sort({ createdAt: -1 });

products.forEach(product => {
    product.reviews = product.reviewList.length;
});

res.json({

success:true,

products

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// categoryAPI
export const getCategoryProducts=async(req,res)=>{

try{

const products=

await Product.find({

category:req.params.category,

status:"Active",

stock:{

$gt:0

}

});

res.json({

success:true,

products

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// reviewAPI
export const addReview=async(req,res)=>{

try{

const{

name,

rating,

comment

}=req.body;

const product=

await Product.findById(

req.params.id

);


product.reviewList.push({

    name,

    rating,

    comment

});

const avg =
    product.reviewList.reduce(
        (sum, item) => sum + item.rating,
        0
    ) / product.reviewList.length;

product.reviews = product.reviewList.length;

product.rating = Number(avg.toFixed(1));

product.averageRating = Number(avg.toFixed(1));

await product.save();

res.json({

success:true,

product

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
// rating API
export const updateRating=async(req,res)=>{

try{

const{

rating

}=req.body;

const product=

await Product.findById(

req.params.id

);

product.rating=rating;

await product.save();

res.json({

success:true,

product

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// =====================
// UPDATE PRODUCT
// =====================

export const updateProduct = async (req,res)=>{

try{

const product=await Product.findById(req.params.id);

if(!product){
return res.status(404).json({
success:false,
message:"Product not found"

});

}

product.name=req.body.name;
product.brand = req.body.brand;
const vendor = await User.findById(product.vendorId);
product.vendorName = vendor?.name || "";product.discount = req.body.discount;
product.tax = req.body.tax;
product.featured = req.body.featured;
product.newArrival=req.body.newArrival;
product.published = req.body.published;
product.minStock = req.body.minStock;
product.category=req.body.category;
product.quantity=req.body.quantity;
product.unit=req.body.unit;
product.shortDescription=req.body.shortDescription;
product.aboutProduct=req.body.aboutProduct;
product.packagingDate=req.body.packagingDate;
product.expiryDate=req.body.expiryDate;
product.price=req.body.price;
product.mrp=req.body.mrp;
product.rating=req.body.rating;
product.reviews=req.body.reviews;
product.nutrition=req.body.nutrition?JSON.parse(req.body.nutrition):[];
product.stock=req.body.stock;
product.sold=req.body.sold;
product.status=Number(req.body.stock)===0 ? "Out Of Stock" : "Active";


// Agar user new images upload kare
if(req.files && req.files.length>0){

const imageUrls=[];

// old images
if(req.body.oldImages){

const oldImages=JSON.parse(req.body.oldImages);

oldImages.forEach(img=>{

imageUrls.push(img);

});

}

// new upload
for(const file of req.files){

const base64=`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploaded=await cloudinary.uploader.upload(base64,{

folder:"NextTGrains/products",
resource_type:"image"

});

imageUrls.push(uploaded.secure_url);

}

product.images=imageUrls;
product.thumbnail=imageUrls[0];

}

await product.save();

res.json({

success:true,
message:"Product Updated",
product

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,
message:err.message

});

}

};


// =====================
// DELETE PRODUCT
// =====================

export const deleteProduct=async(req,res)=>{

try{

await Product.findByIdAndDelete(

req.params.id

);

res.json({

success:true,

message:"Deleted"

});

}

catch(err){

console.log("================");

console.log(err);

console.log("================");

res.status(500).json({

success:false,

message:err.message

});

}

};


// =====================
// CHANGE STATUS
// =====================

export const changeStatus=async(req,res)=>{

try{

const product=

await Product.findById(

req.params.id

);

product.status=

req.body.status;

await product.save();

res.json({

success:true,

product

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

export const getAdminProducts = async (req, res) => {

    try {

        const products = await Product.find()

        .populate(
            "vendorId",
            "name email"
        )

        .sort({
            createdAt: -1
        });
const formatted = products.map(product => {

    const totalReviews =
        product.reviewList?.length > 0
            ? product.reviewList.length
            : (product.reviews || 0);

    const averageRating =
        product.reviewList?.length > 0
            ? Number(
                (
                    product.reviewList.reduce(
                        (sum, review) => sum + review.rating,
                        0
                    ) / product.reviewList.length
                ).toFixed(1)
            )
            : (product.averageRating || product.rating || 0);

    return {

        ...product.toObject(),

        reviews: totalReviews,

        rating: averageRating,

        averageRating: averageRating,

        inventoryValue: product.price * product.stock,

        lowStock: product.stock <= product.minStock

    };

});
console.log(JSON.stringify(formatted, null, 2));
        res.json({

            success: true,

            products:formatted

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const getProductStats = async (req, res) => {

    try {

        const products = await Product.find();

        const total = products.length;

        const active = products.filter(
            x => x.status === "Active"
        ).length;

        const bestseller = products.filter(
            x => x.sold >= 20
        ).length;

        const lowStock = products.filter(
            x => x.stock <= 20
        ).length;

        const promotion = products.filter(
            x => x.discount > 0
        ).length;

        const outOfStock = products.filter(
            x => x.stock === 0
        ).length;

        const inventoryValue = products.reduce(
            (sum, p) => sum + (p.price * p.stock),
            0
        );

        const featured = products.filter(
            x => x.featured
        ).length;

        res.json({

            success: true,

            stats: {
                total,
                active,
                bestseller,
                lowStock,
                promotion,
                outOfStock,
                inventoryValue,
                featured
            }

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const filterProducts = async (req, res) => {

    try {

        const {

            search,

            category,

            vendor,

            status,

            priceMin,

            priceMax

        } = req.query;

        const query = {};

        if (search) {

            query.$or = [

                {

                    name: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    productId: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    sku: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ];

        }

        if (category && category !== "All") {

            query.category = category;

        }

        if (vendor && vendor !== "All") {

            query.vendorName = vendor;

        }

        if (status && status !== "All") {

            query.status = status;

        }

        if (priceMin || priceMax) {

            query.price = {};

            if (priceMin) {

                query.price.$gte = Number(priceMin);

            }

            if (priceMax) {

                query.price.$lte = Number(priceMax);

            }

        }

        const products = await Product.find(query)

        .populate(

            "vendorId",

            "name email"

        )

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            products

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }};
    
export const exportProductsExcel = async (req,res)=>{

try{

const products=await Product.find().populate("vendorId","name");

const workbook=new ExcelJS.Workbook();

const sheet=workbook.addWorksheet("Products");

sheet.columns=[

{header:"Product ID",key:"productId",width:18},

{header:"SKU",key:"sku",width:18},

{header:"Product",key:"name",width:30},

{header:"Vendor",key:"vendor",width:25},

{header:"Category",key:"category",width:20},

{header:"Price",key:"price",width:15},

{header:"MRP",key:"mrp",width:15},

{header:"Discount",key:"discount",width:15},

{header:"Stock",key:"stock",width:12},

{header:"Sold",key:"sold",width:12},

{header:"Status",key:"status",width:18},

{header:"Rating",key:"rating",width:10}

];

products.forEach(product=>{

sheet.addRow({

productId:product.productId,

sku:product.sku,

name:product.name,

vendor:product.vendorId?.name || "-",

category:product.category,

price:product.price,

mrp:product.mrp,

discount:product.discount,

stock:product.stock,

sold:product.sold,

status:product.status,

rating:product.rating

});

});

res.setHeader(

"Content-Type",

"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

);

res.setHeader(

"Content-Disposition",

"attachment; filename=Products.xlsx"

);

await workbook.xlsx.write(res);

res.end();

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
export const exportProductsPDF=async(req,res)=>{

try{

const products=await Product.find().populate("vendorId","name");

const doc=new jsPDF({

orientation:"landscape"

});

const rows=[];

products.forEach(product=>{

rows.push([

product.productId,

product.sku,

product.name,

product.vendorId?.name || "-",

product.category,

product.price,

product.stock,

product.status,

product.rating,

product.sold

]);

});

doc.setFontSize(18);

doc.text(

"NexttGrains Products Report",

14,

18

);

autoTable(doc,{

startY:28,

theme:"grid",

head:[[

"ID",

"SKU",

"Product",

"Vendor",

"Category",

"Price",

"Stock",

"Status",

"Rating",

"Sold"

]],

body:rows,

styles:{

fontSize:8,

cellPadding:2,

halign:"center"

},

headStyles:{

fillColor:[47,75,29],

textColor:255

}

});

const pdf=doc.output("arraybuffer");

res.writeHead(200,{

"Content-Type":"application/pdf",

"Content-Disposition":"attachment; filename=Products.pdf",

"Content-Length":pdf.byteLength

});

res.end(Buffer.from(pdf));

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
export const getCategories = async (req,res)=>{

try{

const categories=

await Product.distinct("category");

res.json({

success:true,

categories

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
export const getVendors = async(req,res)=>{

try{

const vendors=

await Product.find()

.populate("vendorId","name")

.select("vendorId");

const list=[

...new Set(

vendors.map(

x=>x.vendorId?.name

).filter(Boolean)

)

];

res.json({

success:true,

vendors:list

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// 
// =====================
// BEST SELLERS
// =====================

export const getBestSellerProducts = async (req, res) => {
try{
    const allProducts = await Product.find();

console.log("============= ALL PRODUCTS =============");

allProducts.forEach((p) => {
    console.log({
        name: p.name,
        category: p.category,
        status: p.status,
        stock: p.stock,
        published: p.published,
        isDeleted: p.isDeleted
    });
});

console.log("========================================");

const products = await Product.aggregate([

{
$match:{
    status:"Active",
    stock:{ $gt:0 }
}
},

{
$sort:{
// sold:-1,
createdAt:-1
}
},

{
$group:{

_id:"$category",

product:{
$first:"$$ROOT"
}

}

},

{
$replaceRoot:{
newRoot:"$product"
}
},

{
$sort:{
// sold:-1
category:1
}
},

{
$limit:4
}

]);

console.log("BEST SELLER PRODUCTS");
console.log(products);
res.json({

success:true,

products

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,

message:err.message

});

}

};

// NEW ARRIVAL
export const getNewArrivalProducts = async (req,res)=>{

try{

const products=await Product.find({

status:"Active",

stock:{ $gt:0 },

newArrival:true

})

.sort({

createdAt:-1

})
.limit(4);

res.json({

success:true,

products

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});
console.log(products);
}

};

// change new arrival
export const changeNewArrival = async (req, res) => {
  try {

    console.log("Product ID:", req.params.id);
    console.log("Body:", req.body);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const total = await Product.countDocuments({
      newArrival: true,
      _id: { $ne: product._id }
    });

    if (
      req.body.newArrival === true &&
      total >= 4
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 products allowed."
      });
    }

    product.newArrival = req.body.newArrival;
if (!product.productId) {
    product.productId = await generateProductId();
}

if (!product.sku) {
    product.sku = "SKU-" + Math.floor(
        100000 + Math.random() * 900000
    );
}
    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (err) {

    console.log("CHANGE NEW ARRIVAL ERROR");
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
