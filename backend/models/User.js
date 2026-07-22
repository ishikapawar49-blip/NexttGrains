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
  // unique: true,
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
//  profileImage: {
//       type: String,
//       default: "",
//     },
//       gender: {
//       type: String,
//       enum: ["Male", "Female", "Other", ""],
//       default: "",
//     },

//  dateOfBirth: {
//       type: Date,
//       default: null,
//     },

//     businessName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//      gstNumber: {
//       type: String,
//       default: "",
//       trim: true,
//     },

// address: {
//       type: String,
//       default: "",
//       trim: true,
//     },


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

    status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
},

totalOrders: {
    type: Number,
    default: 0,
},

isDeleted: {
    type: Boolean,
    default: false,
},

  // vendor
vendorProfile: {

vendorId: {
type: String,
unique: true,
index: true,
default: ""
},

profileImage:{

url:{
type:String,
default:""
},

publicId:{
type:String,
default:""
}

},

ownerName: {
type: String,
default: ""
},

businessName: {
type: String,
default: ""
},

businessDescription: {
type: String,
default: ""
},

businessType: {
type: String,
default: ""
},

businessCategory: {
type: String,
default: ""
},

establishedYear: {
type: Number,
default: null
},

website: {
type: String,
default: ""
},

address: {

locality: {
type: String,
default: ""
},

city: {
type: String,
default: ""
},

state: {
type: String,
default: ""
},

country: {
type: String,
default: "India"
},

pincode: {
type: String,
default: ""
}

},
location:{

latitude:{
type:Number,
default:null
},

longitude:{
type:Number,
default:null
}

},

documents: {

pan:{

number:{
type:String,
default:""
},

file:{

url:{
type:String,
default:""
},

publicId:{
type:String,
default:""
}

},

status:{
type:String,
enum:["Pending","Verified","Rejected"],
default:"Pending"
}

},

aadhaar: {

  number: {
    type: String,
    default: ""
  },

  file: {

    url: {
      type: String,
      default: ""
    },

    publicId: {
      type: String,
      default: ""
    }

  },

  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  }

},
gst:{

number:{
type:String,
default:""
},

certificate:{

url:{
type:String,
default:""
},

publicId:{
type:String,
default:""
}

},

status:{
type:String,
enum:["Pending","Verified","Rejected"],
default:"Pending"
}

},


businessRegistration:{
number:{
type:String,
default:""
},

file:{

url:{
type:String,
default:""
},

publicId:{
type:String,
default:""
}

},

status:{
type:String,
enum:["Pending","Verified","Rejected"],
default:"Pending"
}

}

},
profileCompletion:{
type:Number,
default:0
},

kycStatus:{
type:String,
enum:[
"Incomplete",
"Pending",
"Verified",
"Rejected"
],
default:"Incomplete"
},

storeStatus:{
type:String,
enum:[
"Draft",
"Active",
"Suspended"
],
default:"Draft"
},
vendorApprovalStatus:{
        type:String,
        enum:[
            "Pending",
            "Approved",
            "Rejected"
        ],
        default:"Pending"
    }

},

  },
  {
    timestamps: true,
  }


);



export default mongoose.model("User", userSchema);