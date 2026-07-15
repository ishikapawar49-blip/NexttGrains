import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// new
const uploadFromBuffer = (fileBuffer, folder, resourceType = "auto") => {

    return new Promise((resolve,reject)=>{

   //      const stream = cloudinary.uploader.upload_stream(
   //  {
   //      folder,
   //      resource_type: resourceType,
   //      format: undefined
   //  },
const stream = cloudinary.uploader.upload_stream(
{
    folder,
    resource_type: resourceType,

    use_filename: true,
    unique_filename: false,

    filename_override:
        Date.now().toString(),

    format:
        resourceType === "raw"
            ? "pdf"
            : undefined
},
            (error,result)=>{
console.log("Cloudinary Error :",error);
console.log("Cloudinary Result :",result);
                if(result) resolve(result);

                else reject(error);

            }

        );

        streamifier
            .createReadStream(fileBuffer)
            .pipe(stream);

    });

};
/* ==========================================================
   CALCULATE PROFILE COMPLETION
========================================================== */

const calculateProfileCompletion = (vendorProfile) => {

let totalFields = 0;
let completedFields = 0;

const check = (value) => {

totalFields++;

if (
value !== undefined &&
value !== null &&
value !== ""
) {

completedFields++;

}

};

/* ===========================
   BASIC DETAILS
=========================== */

check(vendorProfile.ownerName);

check(vendorProfile.businessName);

check(vendorProfile.businessDescription);

check(vendorProfile.businessType);

check(vendorProfile.businessCategory);

check(vendorProfile.establishedYear);

check(vendorProfile.website);

/* ===========================
   PROFILE IMAGE
=========================== */

check(vendorProfile.profileImage?.url);

/* ===========================
   ADDRESS
=========================== */

check(vendorProfile.address?.locality);

check(vendorProfile.address?.city);

check(vendorProfile.address?.state);

check(vendorProfile.address?.country);

check(vendorProfile.address?.pincode);

/* ===========================
   LOCATION
=========================== */

check(vendorProfile.location?.latitude);

check(vendorProfile.location?.longitude);

/* ===========================
   DOCUMENTS
=========================== */

check(vendorProfile.documents?.pan?.number);

check(vendorProfile.documents?.pan?.file?.url);

check(vendorProfile.documents?.aadhaar?.number);

check(vendorProfile.documents?.aadhaar?.file?.url);

check(vendorProfile.documents?.gst?.number);

check(vendorProfile.documents?.gst?.certificate?.url);

check(vendorProfile.documents?.businessRegistration?.number);

check(vendorProfile.documents?.businessRegistration?.file?.url);

return Math.round(

(completedFields / totalFields) * 100

);

};

/* ==========================================================
   CALCULATE KYC STATUS
========================================================== */

const calculateKYCStatus = (vendorProfile) => {

const docs = vendorProfile.documents;

if (

!docs.pan.file.url ||

!docs.aadhaar.file.url ||
 
!docs.gst.certificate.url ||

!docs.businessRegistration.file.url

){

return "Incomplete";

}

const rejected =

docs.pan.status === "Rejected" ||

docs.aadhaar.status === "Rejected" ||

docs.gst.status === "Rejected" ||

docs.businessRegistration.status === "Rejected";

if(rejected){

return "Rejected";

}

const verified =

docs.pan.status === "Verified" &&

docs.aadhaar.status === "Verified" &&

docs.gst.status === "Verified" &&

docs.businessRegistration.status === "Verified";

if(verified){

return "Verified";

}

return "Pending";

};

/* ==========================================================
   GET VENDOR PROFILE
========================================================== */

export const getVendorProfile = async (req,res)=>{

try{

const vendor = await User.findById(

req.user.id

).select("-password");

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

if(vendor.role!=="vendor"){

return res.status(403).json({

success:false,

message:"Access denied."

});

}

vendor.vendorProfile.profileCompletion =

calculateProfileCompletion(

vendor.vendorProfile

);

vendor.vendorProfile.kycStatus =

calculateKYCStatus(

vendor.vendorProfile

);

await vendor.save();

res.status(200).json({

success:true,

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
/* ==========================================================
   UPDATE VENDOR PROFILE
========================================================== */

export const updateVendorProfile = async (req, res) => {

try{

const vendor = await User.findById(req.user.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

if(vendor.role !== "vendor"){

return res.status(403).json({

success:false,

message:"Access denied."

});

}

const{

ownerName,

businessName,

businessDescription,

businessType,

businessCategory,

establishedYear,

website,

address,

location

}=req.body;

/* ==========================================
   BASIC DETAILS
========================================== */

if(ownerName !== undefined){

vendor.vendorProfile.ownerName = ownerName.trim();

}

if(businessName !== undefined){

vendor.vendorProfile.businessName = businessName.trim();

}

if(businessDescription !== undefined){

vendor.vendorProfile.businessDescription =

businessDescription.trim();

}

if(businessType !== undefined){

vendor.vendorProfile.businessType = businessType;

}

if(businessCategory !== undefined){

vendor.vendorProfile.businessCategory =

businessCategory;

}

if(establishedYear !== undefined){

vendor.vendorProfile.establishedYear =

Number(establishedYear);

}

if(website !== undefined){

vendor.vendorProfile.website =

website.trim();

}

/* ==========================================
   ADDRESS
========================================== */

if(address){
if(address.locality!==undefined)
vendor.vendorProfile.address.locality=
address.locality;

vendor.vendorProfile.address.city =

address.city || "";

vendor.vendorProfile.address.state =

address.state || "";

vendor.vendorProfile.address.country =

address.country || "India";

vendor.vendorProfile.address.pincode =

address.pincode || "";

}

/* ==========================================
   LOCATION
========================================== */

if(location){

vendor.vendorProfile.location.latitude =

location.latitude || null;

vendor.vendorProfile.location.longitude =

location.longitude || null;

}

/* ==========================================
   PROFILE %
========================================== */

vendor.vendorProfile.profileCompletion =

calculateProfileCompletion(

vendor.vendorProfile

);

/* ==========================================
   KYC STATUS
========================================== */

vendor.vendorProfile.kycStatus =

calculateKYCStatus(

vendor.vendorProfile

);

/* ==========================================
   STORE STATUS
========================================== */

if(

vendor.vendorProfile.profileCompletion>=80 &&

vendor.vendorProfile.kycStatus==="Verified"

){

vendor.vendorProfile.storeStatus="Active";

}

else{

vendor.vendorProfile.storeStatus="Draft";

}

/* ==========================================
   SAVE
========================================== */

await vendor.save();

res.status(200).json({

success:true,

message:"Vendor profile updated successfully.",

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
/* ==========================================================
   UPLOAD PROFILE IMAGE
========================================================== */

export const uploadProfileImage = async (req, res) => {

try{

const vendor = await User.findById(req.user.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

if(vendor.role!=="vendor"){

return res.status(403).json({

success:false,

message:"Access denied."

});

}

if(!req.file){

return res.status(400).json({

success:false,

message:"Please select an image."

});

}

/* ==========================================
   DELETE OLD IMAGE
========================================== */

if(

vendor.vendorProfile.profileImage.publicId

){

await cloudinary.uploader.destroy(

vendor.vendorProfile.profileImage.publicId

);

}

/* ==========================================
   UPLOAD NEW IMAGE
========================================== */

// const uploadFromBuffer = (fileBuffer, folder) => {

//     return new Promise((resolve, reject) => {

//         const stream = cloudinary.uploader.upload_stream(

//             {
//                 folder
//             },

//             (error, result) => {

//                 if (result) resolve(result);

//                 else reject(error);

//             }

//         );

//         streamifier.createReadStream(fileBuffer).pipe(stream);

//     });

// };

const result = await uploadFromBuffer(
    req.file.buffer,
    "NexttGrains/Vendors/Profile",
    "image"
);
/* ==========================================
   SAVE
========================================== */

vendor.vendorProfile.profileImage.url =

result.secure_url;

vendor.vendorProfile.profileImage.publicId =

result.public_id;

/* ==========================================
   PROFILE %
========================================== */

vendor.vendorProfile.profileCompletion =

calculateProfileCompletion(

vendor.vendorProfile

);

vendor.vendorProfile.kycStatus =

calculateKYCStatus(

vendor.vendorProfile

);

/* ==========================================
   STORE STATUS
========================================== */

if(

vendor.vendorProfile.profileCompletion>=80 &&

vendor.vendorProfile.kycStatus==="Verified"

){

vendor.vendorProfile.storeStatus="Active";

}

else{

vendor.vendorProfile.storeStatus="Draft";

}

await vendor.save();

res.status(200).json({

success:true,

message:"Profile image uploaded successfully.",

image:vendor.vendorProfile.profileImage,

profileCompletion:

vendor.vendorProfile.profileCompletion,

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
/* ==========================================================
   UPLOAD KYC DOCUMENT
========================================================== */

export const uploadKYCDocument = async (req,res)=>{

try{

const vendor = await User.findById(req.user.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

if(vendor.role!=="vendor"){

return res.status(403).json({

success:false,

message:"Access denied."

});

}
console.log(req.file);
if(!req.file){

return res.status(400).json({

success:false,

message:"Please upload document."

});

}

const{

documentType,

documentSide

}=req.body;

let existingPublicId="";

/* =====================================================
   FIND OLD FILE
===================================================== */

switch(documentType){

case "pan":

existingPublicId=

vendor.vendorProfile.documents.pan.file.publicId;

break;

case "aadhaar":

existingPublicId =
vendor.vendorProfile.documents.aadhaar.file.publicId;

break;

case "gst":

existingPublicId=

vendor.vendorProfile.documents.gst.certificate.publicId;

break;

case "businessRegistration":

existingPublicId=

vendor.vendorProfile.documents.businessRegistration.file.publicId;

break;

default:

return res.status(400).json({

success:false,

message:"Invalid document type."

});

}

/* =====================================================
   DELETE OLD DOCUMENT
===================================================== */

if(existingPublicId){

await cloudinary.uploader.destroy(existingPublicId);

}

/* =====================================================
   UPLOAD NEW DOCUMENT
===================================================== */
const resourceType =
req.file.mimetype === "application/pdf"
? "raw"
: "image";

const upload = await uploadFromBuffer(
    req.file.buffer,
    "NexttGrains/Vendors/Documents",
    resourceType
);

console.log(upload.secure_url);
console.log(upload.resource_type);
console.log(upload.format);
console.log(req.file.originalname);
console.log(req.file.mimetype);

console.log(upload.resource_type);
console.log(upload);
console.log("Document Type:", documentType);
console.log("Document Side:", documentSide);
/* =====================================================
   SAVE NEW FILE
===================================================== */
// let fileUrl = upload.secure_url;

// if (upload.resource_type === "raw") {
//     fileUrl = upload.secure_url.replace(
//         "/image/upload/",
//         "/raw/upload/"
//     );
// }
// 

let fileUrl = upload.secure_url;

if (
    upload.resource_type === "raw" &&
    !fileUrl.endsWith(".pdf")
) {
    fileUrl += ".pdf";
}

switch(documentType){

case "pan":
console.log("Saving PAN");

vendor.vendorProfile.documents.pan.file.url = fileUrl;
vendor.vendorProfile.documents.pan.file.publicId = upload.public_id;

vendor.vendorProfile.documents.pan.file.publicId=

upload.public_id;

vendor.vendorProfile.documents.pan.status="Pending";

break;

case "aadhaar":
vendor.vendorProfile.documents.aadhaar.file.url =
fileUrl;
vendor.vendorProfile.documents.aadhaar.file.publicId =
upload.public_id;
vendor.vendorProfile.documents.aadhaar.status =
"Pending";
break;

case "gst":
console.log("Saving GST");

vendor.vendorProfile.documents.gst.certificate.url = fileUrl;
// vendor.vendorProfile.documents.gst.certificate.url=
// upload.secure_url;

vendor.vendorProfile.documents.gst.certificate.publicId=

upload.public_id;

vendor.vendorProfile.documents.gst.status="Pending";

break;

case "businessRegistration":

vendor.vendorProfile.documents.businessRegistration.file.url = fileUrl;
// vendor.vendorProfile.documents.businessRegistration.file.url=
// upload.secure_url;

vendor.vendorProfile.documents.businessRegistration.file.publicId=

upload.public_id;

vendor.vendorProfile.documents.businessRegistration.status="Pending";

break;

}

/* =====================================================
   RECALCULATE
===================================================== */

vendor.vendorProfile.profileCompletion=

calculateProfileCompletion(

vendor.vendorProfile

);

vendor.vendorProfile.kycStatus=

calculateKYCStatus(

vendor.vendorProfile

);

if(

vendor.vendorProfile.profileCompletion>=80 &&

vendor.vendorProfile.kycStatus==="Verified"

){

vendor.vendorProfile.storeStatus="Active";

}

else{

vendor.vendorProfile.storeStatus="Draft";

}
console.log("Before Save");
await vendor.save();
console.log("After Save");
res.status(200).json({

success:true,

message:"Document uploaded successfully.",

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
/* ==========================================================
   UPDATE DOCUMENT DETAILS
========================================================== */

export const updateDocumentDetails = async (req,res)=>{

try{

const vendor = await User.findById(req.user.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

const{

panNumber,

aadhaarNumber,

gstNumber,

businessRegistrationNumber

}=req.body;

if(panNumber!==undefined){

vendor.vendorProfile.documents.pan.number=

panNumber.trim();

}

if(aadhaarNumber!==undefined){

vendor.vendorProfile.documents.aadhaar.number=

aadhaarNumber.trim();

}

if(gstNumber!==undefined){

vendor.vendorProfile.documents.gst.number=

gstNumber.trim();

}

if(businessRegistrationNumber!==undefined){

vendor.vendorProfile.documents.businessRegistration.number=

businessRegistrationNumber.trim();

}

/* ===============================
   RECALCULATE
=============================== */

vendor.vendorProfile.profileCompletion=

calculateProfileCompletion(

vendor.vendorProfile

);

vendor.vendorProfile.kycStatus=

calculateKYCStatus(

vendor.vendorProfile

);

if(

vendor.vendorProfile.profileCompletion>=80 &&

vendor.vendorProfile.kycStatus==="Verified"

){

vendor.vendorProfile.storeStatus="Active";

}

else{

vendor.vendorProfile.storeStatus="Draft";

}

await vendor.save();

res.status(200).json({

success:true,

message:"Document details updated.",

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};



/* ==========================================================
   DELETE DOCUMENT
========================================================== */

export const deleteDocument = async(req,res)=>{

try{

const vendor=

await User.findById(req.user.id);

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found."

});

}

const{

documentType,

documentSide

}=req.body;

let publicId="";

/* ===============================
   GET PUBLIC ID
=============================== */

switch(documentType){

case "pan":

publicId=

vendor.vendorProfile.documents.pan.file.publicId;

break;

case "aadhaar":

vendor.vendorProfile.documents.aadhaar.file = {
  url: "",
  publicId: ""
};

vendor.vendorProfile.documents.aadhaar.status =
"Pending";

break;

case "gst":

publicId=

vendor.vendorProfile.documents.gst.certificate.publicId;

break;

case "businessRegistration":

publicId=

vendor.vendorProfile.documents.businessRegistration.file.publicId;

break;

default:

return res.status(400).json({

success:false,

message:"Invalid document."

});

}

/* ===============================
   DELETE CLOUDINARY
=============================== */

if(publicId){

await cloudinary.uploader.destroy(publicId);

}

/* ===============================
   REMOVE FROM DB
=============================== */

switch(documentType){

case "pan":

vendor.vendorProfile.documents.pan.file={

url:"",

publicId:""

};

vendor.vendorProfile.documents.pan.status="Pending";

break;

case "aadhaar":

vendor.vendorProfile.documents.aadhaar.file = {

url: "",

publicId: ""

};

vendor.vendorProfile.documents.aadhaar.status = "Pending";

break;

case "gst":

vendor.vendorProfile.documents.gst.certificate={

url:"",

publicId:""

};

vendor.vendorProfile.documents.gst.status="Pending";

break;

case "businessRegistration":

vendor.vendorProfile.documents.businessRegistration.file={

url:"",

publicId:""

};

vendor.vendorProfile.documents.businessRegistration.status="Pending";

break;

}

/* ===============================
   RECALCULATE
=============================== */

vendor.vendorProfile.profileCompletion=

calculateProfileCompletion(

vendor.vendorProfile

);

vendor.vendorProfile.kycStatus=

calculateKYCStatus(

vendor.vendorProfile

);

if(

vendor.vendorProfile.profileCompletion>=80 &&

vendor.vendorProfile.kycStatus==="Verified"

){

vendor.vendorProfile.storeStatus="Active";

}

else{

vendor.vendorProfile.storeStatus="Draft";

}

await vendor.save();

res.status(200).json({

success:true,

message:"Document deleted successfully.",

vendor

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};