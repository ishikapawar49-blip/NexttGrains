import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import grain from "../../assets/grains.jpg";

function Register(){
  const navigate=useNavigate();
const [showPassword,setShowPassword]=useState(false);
const [loading,setLoading]=useState(false);

const [form,setForm]=useState({
name:"",
email:"",
phone:"",
password:""
});
const [errors,setErrors]=useState({});

// HANDLE CHANGE
const handleChange=(e)=>{
const {name,value}=e.target;
if(name==="phone"){
const phone=value.replace(/\D/g,"");
if(phone.length<=10){
setForm({
...form,
phone
});
}
return;
}
setForm({
...form,
[name]:value
});
};

//Validation function
const validate=()=>{

let err={};

if(form.name.trim().length<3){

err.name="Enter valid name";

}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(form.email)){

err.email="Invalid Email";

}

if(form.phone.length!==10){

err.phone="Phone must be 10 digits";

}

const passRegex=

/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;

if(!passRegex.test(form.password)){

err.password="Weak Password";

}

setErrors(err);

return Object.keys(err).length===0;

};


//register api
const handleRegister=async()=>{

if(!validate()){

return;

}

try{

setLoading(true);

const res=

await axios.post(

"http://localhost:5000/api/auth/register",

form

);

toast.success(
"Account Created Successfully!"
);

setTimeout(()=>{

navigate("/login");

},1800);

}

catch(err){

alert(

err.response.data.message

);

}

finally{

setLoading(false);

}

};

//return 
return(

<div className="ngAuth_page">

{/* LEFT */}

<div className="ngAuth_left">

<div className="ngAuth_logo">

<div className="ngAuth_logoCircle">

N

</div>

<h2>

NexttGrains

</h2>

</div>

<img
src={grain}
alt=""
/>

<div className="ngAuth_overlay">

<h1>

The Future of Every Grain
<br/>

delivered to your door.

</h1>

<p>

Sign up and enjoy fresh grains,
exclusive offers and faster checkout.

</p>

</div>

</div>

{/* RIGHT */}

<div className="ngAuth_right">

<div className="ngAuth_box">

<h1>

Create account

</h1>

<p className="ngAuth_sub">

Join thousands eating better grains.

</p>

<button className="ngAuth_googleBtn">

<FcGoogle size={24}/>

Continue with Google

</button>

<div className="ngAuth_or">

<hr/>

<span>

OR

</span>

<hr/>

</div>

<div className="ngAuth_inputGroup">

<input name="name" type="text" placeholder="Full name"
       value={form.name} 
       onChange={handleChange}
/>
{errors.name&& <p> {errors.name} </p>}

</div>

<div className="ngAuth_inputGroup">

<input
name="email"
type="email"
placeholder="you@email.com"
value={form.email}
onChange={handleChange}
/>
{ errors.email&& <p> {errors.email} </p> }

</div>

<div className="ngAuth_inputGroup">

 <input
 name="phone"
    type="tel"
    placeholder="Phone number"
    value={form.phone}
onChange={handleChange}
maxLength={10}
  />

{ errors.phone&& <p> {errors.phone} </p> }

</div>

<div className="ngAuth_inputGroup">
<div className="ngAuth_passwordBox">
<input
name="password"
type={showPassword?"text":"password"}
placeholder="Password"
value={form.password}
onChange={handleChange}
/>
<span

onClick={()=>setShowPassword(!showPassword)}

>

{

showPassword

?

<FiEyeOff/>

:

<FiEye/>

}

</span>
</div>
{

errors.password&&

<p>

{errors.password}

</p>

}
</div>

<button className="ngAuth_createBtn" onClick={handleRegister} disabled={loading} >

<FiMail/>
{ loading ? "Creating..." : "Create account" }

<FaArrowRight/>

</button>

<div className="ngAuth_switchText">

Have an account?

<Link to="/login">

Sign in

</Link>

</div>

</div>

</div>

</div>

);

}

export default Register;