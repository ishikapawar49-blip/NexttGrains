import Product from "../models/Product.js";


// =====================
// ADD PRODUCT
// =====================

export const addProduct=async(req,res)=>{

try{

const{

vendorId,
name,
category,
description,
packagingDate,
expiryDate,
price,
stock,
images

}=req.body;

if(

!vendorId||
!name||
!category||
!description||
!packagingDate||
!expiryDate||
!price||
stock===undefined||
!images

){

return res.status(400).json({

success:false,

message:"Please fill all fields"

});

}

const product=

await Product.create({

vendorId,

name,

category,

description,

packagingDate,

expiryDate,

price,

stock,

images,

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

res.status(500).json({

success:false,

message:err.message

});

}

};


// =====================
// UPDATE PRODUCT
// =====================

export const updateProduct=async(req,res)=>{

try{

const product=

await Product.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true

}

);

res.json({

success:true,

message:"Updated",

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