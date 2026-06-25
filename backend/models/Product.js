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

quantity:{
    type:Number,
    required:true
},

unit:{
    type:String,
    required:true
},

shortDescription:{
type:String,
required:true
},

aboutProduct:{
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

mrp:{
type:Number,
required:true
},

rating:{
type:Number,
default:0
},

reviews:{
type:Number,
default:0
},

nutrition:[
{
label:String,
value:String
}
],

stock:{
type:Number,
required:true
},


images:{
type:[String],
required:true
},
thumbnail:{
type:String,
default:""
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