import mongoose from "mongoose";

const productSchema = new mongoose.Schema(

{

vendorId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

productId: {
    type: String,
    unique: true,
    required: true
},

sku: {
    type: String,
    unique: true
},

vendorName: {
    type: String,
    default: ""
},

brand: {
    type: String,
    default: ""
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

discount: {
    type: Number,
    default: 0
},

tax: {
    type: Number,
    default: 0
},

rating:{
type:Number,
default:4.5
},

reviews:{
type:Number,
default:0
},

reviewList:[
{
user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
name:String,
rating:Number,
comment:String,
createdAt:{
type:Date,
default:Date.now
}
}
],

isOrganic:{
type:Boolean,
default:true
},

stoneGround:{
type:Boolean,
default:true
},

deliveryTime:{
type:String,
default: "5-7 Business Days",
},
averageRating:{
type:Number,
default:4.5
},
origin:{
type:String,
default:"India"
},

labTested:{
type:Boolean,
default:true
},

sold:{
type:Number,
default:0
},
minStock: {
    type: Number,
    default: 20
},

featured: {
    type: Boolean,
    default: false
},

published: {
    type: Boolean,
    default: true
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