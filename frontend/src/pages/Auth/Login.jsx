import "./Auth.css";

import React,{useState} from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import {FiEye,FiEyeOff} from "react-icons/fi";
import {toast} from "react-toastify";
import grain from "../../assets/grains.jpg";

function Login(){

const navigate=useNavigate();

const [showPassword,setShowPassword]=useState(false);

const [loading,setLoading]=useState(false);

const [form,setForm]=useState({

email:"",

password:""

});

const [errors,setErrors]=useState({});

// Handle input change
const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:

e.target.value

});

};

//validate form
const validate=()=>{

let err={};

const emailRegex=

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(

!emailRegex.test(form.email)

){

err.email="Invalid Email";

}

if(

form.password.length<8

){

err.password="Invalid Password";

}

setErrors(err);

return Object.keys(err).length===0;

};

//login api
const handleLogin=async()=>{

if(

!validate()

){

return;

}

try{

setLoading(true);

const res=

await axios.post(

"http://localhost:5000/api/auth/login",

form

);

localStorage.setItem(

"token",

res.data.token

);

localStorage.setItem(

"user",

JSON.stringify(

res.data.user

)

);

toast.success(

"Login Successful"

);

setTimeout(()=>{

navigate("/");

},1200);

}

catch(err){

toast.error(

err.response.data.message

);

}

finally{

setLoading(false);

}

};

//
return(

<div className="ngAuth_page">

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

Sign in to track orders,
manage wishlist and unlock offers.

</p>

</div>

</div>

<div className="ngAuth_right">

<div className="ngAuth_box">

<h1>

Welcome back

</h1>

<p className="ngAuth_sub">

Sign in with email or phone.

</p>

<div className="ngAuth_inputGroup">

<label>

Email

</label>

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

<label>Password</label>

<div className="ngAuth_passwordBox">

<input
name="password"
type={ showPassword ? "text" : "password" }
placeholder="••••••••"
value={form.password}
onChange={handleChange}
/>
<span

onClick={()=>

setShowPassword(

!showPassword

)

}

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
{ errors.password&& <p> {errors.password} </p> }
</div>
<button

className="ngAuth_btn"

onClick={handleLogin}

disabled={loading}

>

{

loading

?

"Signing In..."

:

"Sign in"

}

</button>

<div className="ngAuth_or">

<hr/>

<span>

OR

</span>

<hr/>

</div>

<button className="ngAuth_btn">

Continue with Phone OTP

</button>

<div className="ngAuth_switchText">

New here?

<Link to="/register">

Create account

</Link>

</div>

</div>

</div>

</div>

);

}

export default Login;