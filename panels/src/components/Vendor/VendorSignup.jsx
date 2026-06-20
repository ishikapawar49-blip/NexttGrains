import "./VendorSignup.css";

import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {Store,Eye,EyeOff} from "lucide-react";
import axios from "axios";
import {toast} from "react-toastify";

export default function VendorSignup(){

const navigate=useNavigate();

const[loading,setLoading]=useState(false);

const[showPassword,setShowPassword]=useState(false);

const[showConfirmPassword,setShowConfirmPassword]=useState(false);

const[form,setForm]=useState({

fullName:"",

email:"",

phone:"",

businessName:"",

gstNumber:"",

address:"",

password:"",

confirmPassword:""

});

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};

const validate=()=>{

if(

form.fullName.trim()===""||

form.email.trim()===""||

form.phone.trim()===""||

form.businessName.trim()===""||

form.address.trim()===""||

form.password.trim()===""||

form.confirmPassword.trim()===""

){

toast.error("Please fill all fields");

return false;

}

if(form.password.length<6){

toast.error("Password must be atleast 6 characters");

return false;

}

if(form.password!==form.confirmPassword){

toast.error("Passwords do not match");

return false;

}

return true;

};

const handleSignup=async()=>{

if(!validate()) return;

try{

setLoading(true);

const res=await axios.post(

"http://localhost:5000/api/auth/vendor-register",

form

);

toast.success(

res.data.message||

"Vendor Account Created"

);

navigate("/vendor/login");

}

catch(err){

toast.error(

err.response?.data?.message||

"Signup Failed"

);

}

finally{

setLoading(false);

}

};

return(

<div className="ngVendorSignupPage">

<div className="ngVendorSignupCard">

<div className="ngVendorSignupLogo">

<Store size={34}/>

</div>

<h1 className="ngVendorSignupHeading">

Vendor Signup

</h1>

<p className="ngVendorSignupSubHeading">

Create your NexttGrains Vendor Account

</p>

<div className="ngVendorSignupGrid">

<div>

<label className="ngVendorSignupLabel">

Full Name

</label>

<input

className="ngVendorSignupInput"

type="text"

name="fullName"

placeholder="Enter full name"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

Email

</label>

<input

className="ngVendorSignupInput"

type="email"

name="email"

placeholder="Enter email"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

Phone Number

</label>

<input

className="ngVendorSignupInput"

type="text"

name="phone"

placeholder="Phone number"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

Business Name

</label>

<input

className="ngVendorSignupInput"

type="text"

name="businessName"

placeholder="Business name"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

GST Number

</label>

<input

className="ngVendorSignupInput"

type="text"

name="gstNumber"

placeholder="GST Number"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

Business Address

</label>

<input

className="ngVendorSignupInput"

type="text"

name="address"

placeholder="Business address"

onChange={handleChange}

/>

</div>

<div>

<label className="ngVendorSignupLabel">

Password

</label>

<div className="ngVendorSignupPasswordBox">

<input

className="ngVendorSignupInput"

type={showPassword?"text":"password"}

name="password"

placeholder="Password"

onChange={handleChange}

/>

<span

className="ngVendorSignupEye"

onClick={()=>setShowPassword(!showPassword)}

>

{

showPassword

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</span>

</div>

</div>

<div>

<label className="ngVendorSignupLabel">

Confirm Password

</label>

<div className="ngVendorSignupPasswordBox">

<input

className="ngVendorSignupInput"

type={showConfirmPassword?"text":"password"}

name="confirmPassword"

placeholder="Confirm Password"

onChange={handleChange}

/>

<span

className="ngVendorSignupEye"

onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

>

{

showConfirmPassword

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</span>

</div>

</div>

</div>

<button

className="ngVendorSignupButton"

onClick={handleSignup}

>

{

loading

?

"Creating Account..."

:

"Create Vendor Account"

}

</button>

<p className="ngVendorSignupBottomText">

Already have an account?

<Link to="/vendor/login">

Login

</Link>

</p>

</div>

</div>

);

}