import "./AddProducts.css";
import React,{useState, useEffect} from "react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";
import {toast} from "react-toastify";

export default function AddProducts(){
const navigate=useNavigate();
const [loading,setLoading]=useState(false);
const [preview,setPreview]=useState([]);
const {id}=useParams();
const isEdit=id?true:false;

const [form,setForm]=useState({
name:"",
category:"",
quantity:"",
unit:"",
description:"",

packagingDate:"",

expiryDate:"",

price:"",

stock:"",

images:[]

});

const [errors,setErrors]=useState({});

const getProduct=async()=>{

try{

const res=await axios.get(

`http://localhost:5000/api/products/${id}`

);

const p=res.data.product;

setForm({

name:p.name,

category:p.category,

quantity:p.quantity,

unit:p.unit,

description:p.description,

packagingDate:p.packagingDate?.slice(0,10),

expiryDate:p.expiryDate?.slice(0,10),

price:p.price,

stock:p.stock,

images:[]

});

setPreview(p.images);

}

catch(err){

console.log(err);

}

};
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

setPreview([

...preview.filter(img=>img.startsWith("http")),

...arr

]);

};


// 
const removeImage = (index)=>{

const updatedPreview=preview.filter((_,i)=>i!==index);

setPreview(updatedPreview);

}

// =======================

const validate=()=>{

let err={};

if(form.name.trim()==""){

err.name="Required";

}

if(form.category==""){

err.category="Required";

}
if(form.quantity<=0){

err.quantity="Enter Quantity";

}

if(form.unit==""){

err.unit="Select Unit";

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

if(
!isEdit &&
(form.images.length<1 || form.images.length>4)
){
    err.images="Select 1 to 4 images";
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

const vendor=JSON.parse(localStorage.getItem("vendor"));

const data=new FormData();

data.append("vendorId",vendor._id);
data.append("name",form.name);
data.append("category",form.category);
data.append("quantity",form.quantity);
data.append("unit",form.unit);
data.append("description",form.description);
data.append("packagingDate",form.packagingDate);
data.append("expiryDate",form.expiryDate);
data.append("price",form.price);
data.append("stock",form.stock);
if(isEdit){

data.append(

"oldImages",

JSON.stringify(preview.filter(img=>img.startsWith("http")))

);

}
form.images.forEach((img)=>{

data.append("images",img);

});

if(isEdit){

await axios.put(

`http://localhost:5000/api/products/update/${id}`,

data,

{

headers:{
"Content-Type":"multipart/form-data"
}

}

);

toast.success("Product Updated");

}
else{

await axios.post(

"http://localhost:5000/api/products/add",

data,

{

headers:{
"Content-Type":"multipart/form-data"
}

}

);

toast.success("Product Added");

}

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

// 
useEffect(()=>{

if(id){

getProduct();

}

},[]);


return(

<div className="ngVendorAddPage">

<h1>

Add Product

</h1>

<div className="ngVendorForm">

<input
name="name"
value={form.name}
placeholder="Product Name"
onChange={handleChange}
/>

{errors.name&&<p>{errors.name}</p>}

<input
name="category"
value={form.category}
placeholder="Category"
onChange={handleChange}
/>

{errors.category&&<p>{errors.category}</p>}

{/*  */}

<div className="ngQtyRow">

<input
type="number"
name="quantity"
value={form.quantity}
placeholder="Quantity"
onChange={handleChange}
/>
{errors.quantity && <p>{errors.quantity}</p>}

<select
name="unit"
value={form.unit}
onChange={handleChange}
>
{errors.unit && <p>{errors.unit}</p>}

<option value="">Unit</option>

<option value="kg">Kg</option>
<option value="g">Gram</option>
<option value="mg">Mg</option>

<option value="L">Liter</option>
<option value="ml">Ml</option>

<option value="pcs">Pieces</option>
<option value="pack">Pack</option>
<option value="dozen">Dozen</option>

<option value="box">Box</option>
<option value="bag">Bag</option>

<option value="bottle">Bottle</option>
<option value="jar">Jar</option>

<option value="packet">Packet</option>

<option value="bundle">Bundle</option>

</select>

</div>

{/*  */}

<textarea
name="description"
value={form.description}
placeholder="Description"
onChange={handleChange}
/>

{errors.description&&<p>{errors.description}</p>}

<input
type="date"
name="packagingDate"
value={form.packagingDate}
onChange={handleChange}
/>

<input
type="date"
name="expiryDate"
value={form.expiryDate}
onChange={handleChange}
/>

<input
type="number"
name="price"
value={form.price}
placeholder="Price"
onChange={handleChange}
/>

{errors.price&&<p>{errors.price}</p>}

<input
type="number"
name="stock"
value={form.stock}
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
<p>
Leave empty if you don't want to change images.
</p>
{errors.images&&<p>{errors.images}</p>}

<div className="ngVendorPreview">

{

preview.map((img,index)=>(

<div
className="ngPreviewBox"
key={index}
>

<span
className="ngRemoveImage"
onClick={()=>removeImage(index)}
>

✕

</span>

<img
src={img}
alt=""
/>

</div>

))

}

</div>

<button

onClick={handleSubmit}

>

{

loading
?
(isEdit?"Updating...":"Adding...")
:
(isEdit?"Update Product":"Add Product")
}

</button>

</div>

</div>

);

}