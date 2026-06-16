import mongoose from "mongoose";

const productSchema = new mongoose.Schema(

{

vendorId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

name:{
type:String,
required:true,
trim:true
},

category:{
type:String,
required:true
},

description:{
type:String,
required:true
},

packagingDate:{
type:Date,
required:true
},

expiryDate:{
type:Date,
required:true
},

price:{
type:Number,
required:true
},

stock:{
type:Number,
required:true
},

images:{
type:[String],
required:true
},

status:{
type:String,
enum:["Active","Inactive","Out Of Stock"],
default:"Active"
}

},

{

timestamps:true

}

);

const Product=

mongoose.model(

"Product",

productSchema

);

export default Product;