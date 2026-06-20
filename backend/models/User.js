import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

{

name:{
type:String,
required:true,
trim:true
},

email:{
type:String,
required:true,
unique:true,
trim:true,
lowercase:true
},

phone:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

role:{

type:String,

enum:[

"customer",

"vendor",

"admin"

],

default:"customer"

},

businessName:{

type:String,

default:""

},

gstNumber:{

type:String,

default:""

},

address:{

type:String,

default:""

},

isVerified:{

type:Boolean,

default:false

}

},

{

timestamps:true

}

);

export default mongoose.model(

"User",

userSchema

);