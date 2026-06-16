import "./AddProducts.css";

import React,{useState} from "react";

import axios from "axios";

import {useNavigate} from "react-router-dom";

import {toast} from "react-toastify";

export default function AddProducts(){

const navigate=useNavigate();

const [loading,setLoading]=useState(false);

const [preview,setPreview]=useState([]);

const [form,setForm]=useState({

name:"",

category:"",

description:"",

packagingDate:"",

expiryDate:"",

price:"",

stock:"",

images:[]

});

const [errors,setErrors]=useState({});


// =======================

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};


// =======================

const handleImages=(e)=>{

const files=

Array.from(

e.target.files

);

if(files.length<1||files.length>4){

toast.error(

"Select minimum 1 and maximum 4 images"

);

return;

}

setForm({

...form,

images:files

});

const arr=[];

files.forEach(file=>{

arr.push(

URL.createObjectURL(file)

);

});

setPreview(arr);

};


// =======================

const validate=()=>{

let err={};

if(form.name.trim()==""){

err.name="Required";

}

if(form.category==""){

err.category="Required";

}

if(form.description.length<20){

err.description="Minimum 20 characters";

}

if(form.price<=0){

err.price="Invalid Price";

}

if(form.stock<0){

err.stock="Invalid Stock";

}

if(form.images.length<1){

err.images="Upload Image";

}

setErrors(err);

return Object.keys(err).length===0;

};


// =======================

const handleSubmit=async()=>{

if(

!validate()

){

return;

}

try{

setLoading(true);


// Cloudinary upload next step

const imageUrls=[];

for(

let img of form.images

){

imageUrls.push(

URL.createObjectURL(img)

);

}


const vendor=

JSON.parse(

localStorage.getItem("user")

);

await axios.post(

"http://localhost:5000/api/products/add",

{

vendorId:vendor.id,

name:form.name,

category:form.category,

description:form.description,

packagingDate:form.packagingDate,

expiryDate:form.expiryDate,

price:form.price,

stock:form.stock,

images:imageUrls

}

);

toast.success(

"Product Added"

);

navigate(

"/vendor/products"

);

}

catch(err){

toast.error(

err.response?.data?.message||

"Error"

);

}

finally{

setLoading(false);

}

};


return(

<div className="ngVendorAddPage">

<h1>

Add Product

</h1>

<div className="ngVendorForm">

<input
name="name"
placeholder="Product Name"
onChange={handleChange}
/>

{errors.name&&<p>{errors.name}</p>}

<input
name="category"
placeholder="Category"
onChange={handleChange}
/>

{errors.category&&<p>{errors.category}</p>}

<textarea

name="description"

placeholder="Description"

onChange={handleChange}

/>

{errors.description&&<p>{errors.description}</p>}

<input

type="date"

name="packagingDate"

onChange={handleChange}

/>

<input

type="date"

name="expiryDate"

onChange={handleChange}

/>

<input

type="number"

name="price"

placeholder="Price"

onChange={handleChange}

/>

{errors.price&&<p>{errors.price}</p>}

<input

type="number"

name="stock"

placeholder="Stock"

onChange={handleChange}

/>

{errors.stock&&<p>{errors.stock}</p>}

<input

type="file"

multiple

accept="image/*"

onChange={handleImages}

/>

{errors.images&&<p>{errors.images}</p>}

<div className="ngVendorPreview">

{

preview.map(

(img,index)=>

<img

key={index}

src={img}

alt=""

/>

)

}

</div>

<button

onClick={handleSubmit}

>

{

loading

?

"Adding..."

:

"Add Product"

}

</button>

</div>

</div>

);

}