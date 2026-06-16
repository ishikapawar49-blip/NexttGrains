import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({

name:String,

email:String,

phone:String,

city:String,

orders:Number,

spent:Number,

segment:String,

joined:String

});

export default mongoose.model(
"Customer",
customerSchema
);