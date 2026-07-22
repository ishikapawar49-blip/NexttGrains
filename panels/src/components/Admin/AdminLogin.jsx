import React, { useState } from "react";
import "./AdminLogin.css";

import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({

    email: "",

    password: "",

    remember: true

  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: type === "checkbox" ? checked : value

    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const response = await fetch(

        "http://localhost:5000/api/auth/admin-login",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            email: formData.email,

            password: formData.password

          })

        }

      );

      const data = await response.json();

      if (!data.success) {

        setLoading(false);

        setError(data.message);

        return;

      }

      localStorage.setItem("adminToken", data.token);

      localStorage.setItem(

        "adminUser",

        JSON.stringify(data.user)

      );

      navigate("/admin/customers");

    }

    catch (err) {

      setError("Unable to connect to server.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

<div className="admin-login-page">

<div className="admin-login-left">

<div className="admin-login-overlay"/>

<div className="admin-login-brand">

<div className="admin-login-logo">

N

</div>

<h1>

NexttGrains

</h1>

<h2>

Admin Console

</h2>

<p>

Manage customers, vendors, products,

orders, finance and reports from one

secure dashboard.

</p>

<div className="admin-login-security">

<ShieldCheck size={22}/>

<span>

Enterprise Grade Secure Access

</span>

</div>

</div>

</div>

<div className="admin-login-right">

<form

className="admin-login-card"

onSubmit={handleSubmit}

>

<div className="admin-login-heading">

<h2>

Welcome Back

</h2>

<p>

Login to your Admin Account

</p>

</div>

{error && (

<div className="admin-login-error">

{error}

</div>

)}

<div className="admin-login-field">

<label>

Email Address

</label>

<div className="admin-login-input">

<Mail size={18}/>

<input

type="email"

name="email"

value={formData.email}

onChange={handleChange}

placeholder="Enter admin email"

required

/>

</div>

</div>

<div className="admin-login-field">

<label>

Password

</label>

<div className="admin-login-input">

<Lock size={18}/>

<input

type={showPassword ? "text":"password"}

name="password"

value={formData.password}

onChange={handleChange}

placeholder="Enter password"

required

/>

<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

>

{

showPassword

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</button>

</div>

</div>

<div className="admin-login-options">

<label>

<input

type="checkbox"

name="remember"

checked={formData.remember}

onChange={handleChange}

/>

Remember Me

</label>

<button

type="button"

className="admin-login-forgot"

>

Forgot Password?

</button>

</div>

<button

className="admin-login-btn"

disabled={loading}

>

{

loading

?

"Signing In..."

:

<>

Login

<ArrowRight size={18}/>

</>

}

</button>

<div className="admin-login-footer">

© 2026 NexttGrains

</div>

</form>

</div>

</div>

  );

}