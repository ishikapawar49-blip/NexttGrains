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
shortDescription:"",
aboutProduct:"",
packagingDate:"",
expiryDate:"",
price:"",
mrp:"",
rating:"",
reviews:"",
nutrition:[
{
label:"",
value:""
}
],
stock:"",
images:[]

});

const [errors,setErrors]=useState({});
const discount =

form.mrp > 0 &&
form.price > 0

?

Math.round(

((form.mrp - form.price) / form.mrp)

*100

)

:

0;

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
shortDescription:p.shortDescription || "",
aboutProduct:p.aboutProduct || "",
packagingDate:p.packagingDate?.slice(0,10),
expiryDate:p.expiryDate?.slice(0,10),
price:p.price,
mrp:p.mrp || "",
rating:p.rating || "",
reviews:p.reviews || "",
nutrition:p.nutrition?.length?p.nutrition:[{label:"",value:""}],
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

// 
const addNutrition=()=>{

setForm({

...form,

nutrition:[
...form.nutrition,

{
label:"",
value:""
}

]

});

};

// 
const handleNutritionChange=(

index,
field,
value

)=>{

const updated=[...form.nutrition];

updated[index][field]=value;

setForm({

...form,

nutrition:updated

});

};

//  remove nutrition item
const removeNutrition=(index)=>{

const updated=

form.nutrition.filter(

(_,i)=>i!==index

);

setForm({

...form,

nutrition:updated

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

if(form.category===""){
err.category="Required";
}

if(
form.category==="Other"
&&
!form.categoryCustom?.trim()
){
err.category="Enter Category";
}

if(form.quantity<=0){
err.quantity="Enter Quantity";
}

if(form.unit==""){
err.unit="Select Unit";
}
if(form.shortDescription.length<10){
err.shortDescription="Minimum 10 characters";
}

if(form.aboutProduct.length<30){
err.aboutProduct="Minimum 30 characters";
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
data.append("category",form.category==="Other"?form.categoryCustom:form.category);
data.append("quantity",form.quantity);
data.append("unit",form.unit);
data.append("shortDescription",form.shortDescription);
data.append("aboutProduct",form.aboutProduct);
data.append("packagingDate",form.packagingDate);
data.append("expiryDate",form.expiryDate);
data.append("price",form.price);
data.append("mrp",form.mrp);
data.append("rating",form.rating);
data.append("reviews",form.reviews);
data.append("nutrition",JSON.stringify(form.nutrition));
data.append("stock",form.stock);

if(isEdit){
data.append("oldImages",
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

<div className="ngQtyRow">

<div className="ngFieldGroup">
<label>Product Name</label>
<input
name="name"
value={form.name}
placeholder="Product Name"
onChange={handleChange}
/>
{errors.name&&<p>{errors.name}</p>}
</div>

<div className="ngFieldGroup">
<label>Category</label>
<select
name="category"
value={form.category}
onChange={handleChange}
>
<option value="">Select Category</option>
<option value="Atta">Atta</option>
<option value="Wheat">Wheat</option>
<option value="Rice">Rice</option>
<option value="Dal">Dal</option>
<option value="Oil">Oil</option>
<option value="Spices">Spices</option>
<option value="Flour">Flour</option>
<option value="Millets">Millets</option>
<option value="Dry Fruits">Dry Fruits</option>
<option value="Organic Foods">Organic Foods</option>
<option value="Other">Other</option>
</select>
{
form.category==="Other" && (

<input
name="category"
value={form.categoryCustom || ""}
placeholder="Enter Category"
onChange={(e)=>

setForm({

...form,
categoryCustom:e.target.value

})

}
/>

)
}

{errors.category&&<p>{errors.category}</p>}

</div>

</div>
{/*  */}

<div className="ngQtyRow">

<div className="ngFieldGroup">
<label>Quantity</label>

<input
type="number"
name="quantity"
value={form.quantity}
placeholder="Quantity"
onChange={handleChange}
/>
{errors.quantity && <p>{errors.quantity}</p>}
</div>

<div className="ngFieldGroup">
<label>Unit</label>

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
</div>

{/*  */}
<div className="ngFieldGroup">
<label>Short Description</label>
<textarea
name="shortDescription"
value={form.shortDescription}
placeholder="Short Description"
onChange={handleChange}
/>
{errors.shortDescription &&<p>{errors.shortDescription}</p>}
</div>

<div className="ngFieldGroup">
<label>About Product</label>
<textarea
name="aboutProduct"
value={form.aboutProduct}
placeholder="About Product"
onChange={handleChange}
/>
{errors.aboutProduct &&<p>{errors.aboutProduct}</p>}
</div>

<div className="ngQtyRow">
<div className="ngFieldGroup">
<label>MFG Date</label>
<input
type="date"
name="packagingDate"
value={form.packagingDate}
onChange={handleChange}
/>
</div>

<div className="ngFieldGroup">
<label>Expiry Date</label>

<input
type="date"
name="expiryDate"
value={form.expiryDate}
onChange={handleChange}
/>
</div>
</div>

<div className="ngThreeCol">
<div className="ngFieldGroup">
<label>MRP</label>
<input
type="number"
name="mrp"
value={form.mrp}
placeholder="MRP"
onChange={handleChange}
/></div>

<div className="ngFieldGroup">
<label>Selling Price</label>
<input
type="number"
name="price"
value={form.price}
placeholder="Selling Price"
onChange={handleChange}
/>
{errors.price&&<p>{errors.price}</p>}
</div>
{
form.mrp > 0 &&
form.price > 0 && (
<div className="ngFieldGroup">
<label>Discount</label>
<div className="ngDiscountPreview">
Discount :
<strong>
{discount}% OFF</strong></div></div>
)
}

<div className="ngFieldGroup">
<label>Stock</label>
<input
type="number"
name="stock"
value={form.stock}
placeholder="Stock"
onChange={handleChange}
/>
{errors.stock&&<p>{errors.stock}</p>}
</div>
</div>

<div className="ngQtyRow">
<div className="ngFieldGroup">
<label>Rating</label>
<input
type="number"
step="0.1"
name="rating"
value={form.rating}
placeholder="Rating (4.9)"
onChange={handleChange}
/></div>

<div className="ngFieldGroup">
<label>Reviews Count</label>
<input
type="number"
name="reviews"
value={form.reviews}
placeholder="Reviews Count"
onChange={handleChange}
/></div>

</div>

<h3 className="ngNutritionTitle">

Nutrition Information

</h3>

{

form.nutrition.map((item,index)=>(

<div
className="ngNutritionRow"
key={index}
>

<input
placeholder="Nutrition Name"
value={item.label}
onChange={(e)=>

handleNutritionChange(
index,
"label",
e.target.value
)

}
/>

<input
placeholder="Value"
value={item.value}
onChange={(e)=>

handleNutritionChange(
index,
"value",
e.target.value
)

}
/>

<button
type="button"
className="ngNutritionRemoveBtn"
onClick={()=>removeNutrition(index)}
>

✕

</button>

</div>

))

}

<button
type="button"
className="ngAddNutritionBtn"
onClick={addNutrition}
>

+ Add Nutrition

</button>

<label className="ngInputLabel">Product Images (1-4)</label>
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