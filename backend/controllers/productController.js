import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

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
description,
packagingDate,
expiryDate,
price,
stock

}=req.body;

if(

!vendorId||
!name||
!category||
!quantity||
!unit||
!description||
!packagingDate||
!expiryDate||
!price||
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

const imageUrls=[];

for(const file of req.files){

const base64=`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploaded=await cloudinary.uploader.upload(base64,{
folder:"NextTGrains/products",
resource_type:"image"
});

imageUrls.push(uploaded.secure_url);

}


const product=await Product.create({

vendorId,

name,

category,

quantity,

unit,

description,

packagingDate,

expiryDate,

price,

stock,
thumbnail:imageUrls[0],
images:imageUrls,

status:

stock==0

?

"Out Of Stock"

:

"Active"

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

// 
// =====================
// GET SINGLE PRODUCT
// =====================

export const getSingleProduct = async (req, res) => {

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
product.category=req.body.category;
product.quantity=req.body.quantity;
product.unit=req.body.unit;
product.description=req.body.description;
product.packagingDate=req.body.packagingDate;
product.expiryDate=req.body.expiryDate;
product.price=req.body.price;
product.stock=req.body.stock;

product.status=
Number(req.body.stock)===0
?
"Out Of Stock"
:
"Active";


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