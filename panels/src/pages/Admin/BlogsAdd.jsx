import "./BlogsAdd.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {

FaTimes,

FaSave,

FaNewspaper,

FaHeading,

FaUser,

FaTags,

FaImage,

FaAlignLeft,

FaClock,

FaGlobe,

FaCheckCircle

} from "react-icons/fa";

const API="http://localhost:5000/api/blogs";

function BlogsAdd({

blog,

refreshBlogs,

onClose

}){

const[loading,setLoading]=useState(false);

const[formData,setFormData]=useState({

title:"",

slug:"",

shortDescription:"",

description:"",

author:"NexttGrains Editorial",

featuredImage:"",

bannerImage:"",

imageAlt:"",

category:"",

tags:"",

readingTime:5,

featured:false,

status:"Draft",

metaTitle:"",

metaDescription:"",

keywords:"",

canonicalUrl:""

});
const [featuredFile,setFeaturedFile]=useState(null);

const [bannerFile,setBannerFile]=useState(null);
/* ===========================================
        HANDLE CHANGE
=========================================== */

const handleChange=(e)=>{

const{

name,

value,

type,

checked,

files

}=e.target;

if(type==="file"){

if(name==="featuredImage"){

setFeaturedFile(files[0]);

}

if(name==="bannerImage"){

setBannerFile(files[0]);

}

return;

}

setFormData((prev)=>({

...prev,

[name]:

type==="checkbox"

?

checked

:

value

}));

}

/* ===========================================
        AUTO SLUG
=========================================== */

useEffect(()=>{

if(!formData.title) return;

setFormData((prev)=>({

...prev,

slug:

formData.title

.toLowerCase()

.trim()

.replace(/[^\w\s-]/g,"")

.replace(/\s+/g,"-")

.replace(/-+/g,"-")

}));

},[formData.title]);

/* ===========================================
        EDIT DATA
=========================================== */

useEffect(()=>{

if(blog){

setFormData({

title:blog.title || "",

slug:blog.slug || "",

shortDescription:

blog.shortDescription || "",

description:

blog.description || "",

author:

blog.author || "NexttGrains Editorial",

featuredImage:

blog.featuredImage || "",

bannerImage:

blog.bannerImage || "",

imageAlt:

blog.imageAlt || "",

category:

blog.category || "",

tags:

blog.tags

?

blog.tags.join(", ")

:

"",

readingTime:

blog.readingTime || 5,

featured:

blog.featured || false,

status:

blog.status || "Draft",

metaTitle:

blog.metaTitle || "",

metaDescription:

blog.metaDescription || "",

keywords:

blog.keywords

?

blog.keywords.join(", ")

:

"",

canonicalUrl:

blog.canonicalUrl || ""

});

}

},[blog]);
/* ===========================================
        SAVE BLOG
=========================================== */

const saveBlog=async(e)=>{

e.preventDefault();

try{

setLoading(true);

const payload=new FormData();
payload.append("title",formData.title);

payload.append("slug",formData.slug);

payload.append("shortDescription",formData.shortDescription);

payload.append("description",formData.description);

payload.append("author",formData.author);

payload.append("imageAlt",formData.imageAlt);

payload.append("category",formData.category);

payload.append("readingTime",formData.readingTime);

payload.append("featured",formData.featured);

payload.append("status",formData.status);

payload.append("metaTitle",formData.metaTitle);

payload.append("metaDescription",formData.metaDescription);

payload.append("canonicalUrl",formData.canonicalUrl);

payload.append(

"tags",

JSON.stringify(

formData.tags

.split(",")

.map(item=>item.trim())

.filter(Boolean)

)

);

payload.append(

"keywords",

JSON.stringify(

formData.keywords

.split(",")

.map(item=>item.trim())

.filter(Boolean)

)

);
if(featuredFile){

payload.append(

"featuredImage",

featuredFile

);

}

if(bannerFile){

payload.append(

"bannerImage",

bannerFile

);

}

if(blog){

await axios.put(

`${API}/update/${blog._id}`,

payload,

{

headers:{

"Content-Type":"multipart/form-data"

}

}

);

}

else{

await axios.post(

`${API}/create`,

payload,

{

headers:{

"Content-Type":"multipart/form-data"

}

}

);

}

refreshBlogs();

onClose();

}

catch(error){

console.log(error);

alert(

error.response?.data?.message ||

"Something went wrong."

);

}

finally{

setLoading(false);

}

};
return(

<div className="blogs-modal-overlay">

<div className="blogs-modal">

<div className="blogs-modal-header">

<h2>

<FaNewspaper/>

{

blog

?

"Edit Blog"

:

"Add New Blog"

}

</h2>

<button

className="blogs-close-btn"

onClick={onClose}

>

<FaTimes/>

</button>

</div>

<form

className="blogs-form"

onSubmit={saveBlog}

>
    {/* ==========================================================
    BASIC INFORMATION
========================================================== */}

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

<FaHeading/>

Blog Title

</label>

<input

type="text"

name="title"

placeholder="Enter Blog Title"

value={formData.title}

onChange={handleChange}

required

/>

</div>

<div className="blogs-form-group">

<label>

<FaGlobe/>

Slug

</label>

<input

type="text"

name="slug"

placeholder="blog-url-slug"

value={formData.slug}

onChange={handleChange}

/>

</div>

</div>

{/* ==========================================================
    SHORT DESCRIPTION
========================================================== */}

<div className="blogs-form-group">

<label>

<FaAlignLeft/>

Short Description

</label>

<textarea

name="shortDescription"

placeholder="Write a short description..."

rows="4"

value={formData.shortDescription}

onChange={handleChange}

required

/>

</div>

{/* ==========================================================
    BLOG CONTENT
========================================================== */}

<div className="blogs-form-group">

<label>

<FaNewspaper/>

Blog Content

</label>

<textarea

name="description"

placeholder="Write complete blog content..."

rows="10"

value={formData.description}

onChange={handleChange}

required

/>

</div>

{/* ==========================================================
    AUTHOR & CATEGORY
========================================================== */}

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

<FaUser/>

Author

</label>

<input

type="text"

name="author"

placeholder="Author Name"

value={formData.author}

onChange={handleChange}

/>

</div>

<div className="blogs-form-group">

<label>

<FaTags/>

Category

</label>

<select

name="category"

value={formData.category}

onChange={handleChange}

required

>

<option value="">

Select Category

</option>

<option value="Rice">

Rice

</option>

<option value="Pulses">

Pulses

</option>

<option value="Flours">

Flours

</option>

<option value="Millets">

Millets

</option>

<option value="Spices">

Spices

</option>

<option value="Dry Fruits">

Dry Fruits

</option>

<option value="Organic">

Organic

</option>

<option value="Recipes">

Recipes

</option>

<option value="Health">

Health

</option>

<option value="Lifestyle">

Lifestyle

</option>

<option value="News">

News

</option>

<option value="Others">

Others

</option>

</select>

</div>

</div>
{/* ==========================================================
    IMAGES
========================================================== */}

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

<FaImage/>

Featured Image

</label>

<input
type="file"
accept="image/*"
name="featuredImage"
placeholder="Upload Featured Image"
onChange={handleChange}
/>

</div>

<div className="blogs-form-group">

<label>

<FaImage/>

Banner Image

</label>

<input
type="file"
accept="image/*"
name="bannerImage"
placeholder="Upload Banner Image"
onChange={handleChange}

/>

</div>

</div>

{/* ==========================================================
    IMAGE ALT
========================================================== */}

<div className="blogs-form-group">

<label>

<FaImage/>

Image Alt Text

</label>

<input

type="text"

name="imageAlt"

placeholder="Describe the image"

value={formData.imageAlt}

onChange={handleChange}

/>

</div>

{/* ==========================================================
    TAGS & READING TIME
========================================================== */}

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

<FaTags/>

Tags

</label>

<input

type="text"

name="tags"

placeholder="organic, healthy, rice"

value={formData.tags}

onChange={handleChange}

/>

<small>

Separate tags using comma (,)

</small>

</div>

<div className="blogs-form-group">

<label>

<FaClock/>

Reading Time (Minutes)

</label>

<input

type="number"

name="readingTime"

min="1"

value={formData.readingTime}

onChange={handleChange}

/>

</div>

</div>

{/* ==========================================================
    FEATURED & STATUS
========================================================== */}

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

Featured Blog

</label>

<div className="blogs-checkbox">

<input

type="checkbox"

name="featured"

checked={formData.featured}

onChange={handleChange}

/>

<span>

Show on Homepage

</span>

</div>

</div>

<div className="blogs-form-group">

<label>

<FaCheckCircle/>

Status

</label>

<select

name="status"

value={formData.status}

onChange={handleChange}

>

<option value="Draft">

Draft

</option>

<option value="Published">

Published

</option>

</select>

</div>

</div>
{/* ==========================================================
    SEO DETAILS
========================================================== */}

<div className="blogs-form-group">

<label>

<FaGlobe/>

Meta Title

</label>

<input

type="text"

name="metaTitle"

placeholder="SEO Meta Title"

value={formData.metaTitle}

onChange={handleChange}

/>

</div>

<div className="blogs-form-group">

<label>

<FaAlignLeft/>

Meta Description

</label>

<textarea

name="metaDescription"

rows="4"

placeholder="SEO Meta Description"

value={formData.metaDescription}

onChange={handleChange}

/>

</div>

<div className="blogs-form-grid">

<div className="blogs-form-group">

<label>

<FaTags/>

SEO Keywords

</label>

<input

type="text"

name="keywords"

placeholder="organic, healthy food, grains"

value={formData.keywords}

onChange={handleChange}

/>

<small>

Separate keywords using comma (,)

</small>

</div>

<div className="blogs-form-group">

<label>

<FaGlobe/>

Canonical URL

</label>

<input

type="text"

name="canonicalUrl"

placeholder="https://nexttgrains.com/blog"

value={formData.canonicalUrl}

onChange={handleChange}

/>

</div>

</div>

{/* ==========================================================
    FOOTER BUTTONS
========================================================== */}

<div className="blogs-form-footer">

<button

type="button"

className="blogs-cancel-btn"

onClick={onClose}

>

<FaTimes/>

Cancel

</button>

<button

type="submit"

className="blogs-save-btn"

disabled={loading}

>

<FaSave/>

{

loading

?

"Saving..."

:

blog

?

"Update Blog"

:

"Save Blog"

}

</button>

</div>

</form>

</div>

</div>

);

}

export default BlogsAdd;