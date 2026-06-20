import "./VendorLogin.css";

import { Store } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function VendorLogin(){

const navigate=useNavigate();

const[email,setEmail]=useState("");
const[password,setPassword]=useState("");

const[loading,setLoading]=useState(false);

const handleLogin=async()=>{

if(email===""||password===""){

toast.error("Please fill all fields");

return;

}

try{

setLoading(true);

const res=await axios.post(

"http://localhost:5000/api/auth/vendor-login",

{

email,

password

}

);

localStorage.setItem(

"vendor",

JSON.stringify(res.data.user)

);

localStorage.setItem(

"vendorToken",

res.data.token

);

toast.success("Login Success");

navigate("/vendor/dashboard");

}

catch(err){

toast.error(

err.response?.data?.message||

"Login Failed"

);

}

finally{

setLoading(false);

}

};

return(

<div className="ngVendorLoginPage">

<div className="ngVendorLoginCard">

<div className="ngVendorLoginIcon">

<Store size={36}/>

</div>

<h1 className="ngVendorLoginHeading">

Vendor Login

</h1>

<p className="ngVendorLoginSubHeading">

Sign in to your NexttGrains Vendor Dashboard

</p>

<button className="ngVendorGoogleBtn">

Continue with Google

</button>

<div className="ngVendorLoginDivider">

<span>OR</span>

</div>

<label className="ngVendorLoginLabel">

Email

</label>

<input

className="ngVendorLoginInput"

type="email"

placeholder="Enter your email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>

<label className="ngVendorLoginLabel">

Password

</label>

<input

className="ngVendorLoginInput"

type="password"

placeholder="Enter password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<button

className="ngVendorLoginButton"

onClick={handleLogin}

>

{

loading

?

"Signing In..."

:

"Sign In"

}

</button>

<p className="ngVendorLoginBottomText">

Don't have an account?

<Link to="/vendor/signup">

Sign Up

</Link>

</p>

</div>

</div>

);

}