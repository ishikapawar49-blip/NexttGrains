import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

{

name:{
type:String,
required:true,
trim:true
},

email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
  index: true,
},

phone:{
type:String,
required:true,
unique:true,
trim: true,
match: /^[6-9]\d{9}$/,
},

password:{
type:String,
required:true
},

  role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
 profileImage: {
      type: String,
      default: "",
    },
      gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

 dateOfBirth: {
      type: Date,
      default: null,
    },

    businessName: {
      type: String,
      default: "",
      trim: true,
    },

     gstNumber: {
      type: String,
      default: "",
      trim: true,
    },

address: {
      type: String,
      default: "",
      trim: true,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

 lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);