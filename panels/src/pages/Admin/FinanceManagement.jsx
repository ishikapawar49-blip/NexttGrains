import "./FinanceManagement.css";

import { useEffect, useState } from "react";
import axios from "axios";

import SetCharges from "./SetCharges";

import {

    FaSearch,

    FaPlus,

    FaWallet,

    FaMoneyBillWave,

    FaTruck,

    FaPercentage,

    FaChartLine,

    FaCog,

    FaEye,

    FaEdit

} from "react-icons/fa";

const API="http://localhost:5000/api/finance";

function FinanceManagement(){

const[finance,setFinance]=useState(null);

const[loading,setLoading]=useState(false);

const[search,setSearch]=useState("");

const[showModal,setShowModal]=useState(false);

/* ==========================================================
        FETCH FINANCE SETTINGS
========================================================== */

const fetchFinance=async()=>{

try{

setLoading(true);

const res=

await axios.get(API);

setFinance(res.data.finance);

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};

useEffect(()=>{

fetchFinance();

},[]);

/* ==========================================================
        QUICK STATS
========================================================== */

const stats=[

{

title:"Delivery Rules",

value:

finance?.deliveryRules?.length || 0,

icon:<FaTruck/>,

color:"green"

},

{

title:"Platform Fee",

value:

finance?.platformFee?.enabled

?

`₹${finance.platformFee.amount}`

:

"Disabled",

icon:<FaWallet/>,

color:"blue"

},

{

title:"Handling Fee",

value:

finance?.handlingFee?.enabled

?

`₹${finance.handlingFee.amount}`

:

"Disabled",

icon:<FaMoneyBillWave/>,

color:"orange"

},

{

title:"GST",

value:

finance?.gst?.enabled

?

`${finance.gst.percentage}%`

:

"Disabled",

icon:<FaPercentage/>,

color:"purple"

}

];

return(

<div className="finance-management">

{/* ======================================================
        HEADER
====================================================== */}

<div className="finance-header">

<div>

<h1>

Finance Management

</h1>

<p>

Manage delivery charges, platform fees, GST, vendor commissions and checkout pricing.

</p>

</div>

<button

className="finance-create-btn"

onClick={()=>

setShowModal(true)

}

>

<FaPlus/>

Set Charges

</button>

</div>

{/* ======================================================
        STATS
====================================================== */}

<div className="finance-stats">

{

stats.map((item,index)=>(

<div

key={index}

className="finance-stat-card"

>

<div>

<span>

{item.title}

</span>

<h2>

{item.value}

</h2>

</div>

<div

className={`finance-stat-icon ${item.color}`}

>

{item.icon}

</div>

</div>

))

}

</div>

{/* ======================================================
        SEARCH
====================================================== */}

<div className="finance-search-box">

<FaSearch/>

<input

type="text"

placeholder="Search finance settings..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>

</div>
{/* ======================================================
        FINANCE SUMMARY
====================================================== */}

<div className="finance-summary-grid">

{/* ================= DELIVERY ================= */}

<div className="finance-summary-card">

<div className="finance-summary-header">

<h3>

<FaTruck/>

Delivery Charges

</h3>

<button

className="finance-edit-btn"

onClick={()=>setShowModal(true)}

>

<FaEdit/>

Edit

</button>

</div>

<div className="finance-summary-body">

{

finance?.deliveryRules?.map((rule,index)=>(

<div

key={index}

className="finance-rule-item"

>

<div>

₹{rule.minAmount}

-

₹{rule.maxAmount}

</div>

<div>

{

rule.freeDelivery

?

<span className="finance-free">

FREE

</span>

:

`₹${rule.deliveryCharge}`

}

</div>

</div>

))

}

</div>

</div>

{/* ================= PLATFORM ================= */}

<div className="finance-summary-card">

<div className="finance-summary-header">

<h3>

<FaWallet/>

Platform Fee

</h3>

</div>

<div className="finance-summary-body">

<div className="finance-row">

<span>

Status

</span>

<strong>

{

finance?.platformFee?.enabled

?

"Enabled"

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Fee Type

</span>

<strong>

{

finance?.platformFee?.feeType

}

</strong>

</div>

<div className="finance-row">

<span>

Amount

</span>

<strong>

₹{

finance?.platformFee?.amount

}

</strong>

</div>

<div className="finance-row">

<span>

Maximum

</span>

<strong>

₹{

finance?.platformFee?.maximumFee

}

</strong>

</div>

</div>

</div>

{/* ================= HANDLING ================= */}

<div className="finance-summary-card">

<div className="finance-summary-header">

<h3>

<FaMoneyBillWave/>

Handling Fee

</h3>

</div>

<div className="finance-summary-body">

<div className="finance-row">

<span>

Status

</span>

<strong>

{

finance?.handlingFee?.enabled

?

"Enabled"

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Type

</span>

<strong>

{

finance?.handlingFee?.feeType

}

</strong>

</div>

<div className="finance-row">

<span>

Amount

</span>

<strong>

₹{

finance?.handlingFee?.amount

}

</strong>

</div>

</div>

</div>

{/* ================= GST ================= */}

<div className="finance-summary-card">

<div className="finance-summary-header">

<h3>

<FaPercentage/>

GST

</h3>

</div>

<div className="finance-summary-body">

<div className="finance-row">

<span>

Status

</span>

<strong>

{

finance?.gst?.enabled

?

"Enabled"

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

GST Rate

</span>

<strong>

{

finance?.gst?.percentage

}%

</strong>

</div>

<div className="finance-row">

<span>

Vendor Commission

</span>

<strong>

{

finance?.vendorSettings?.commission

}%

</strong>

</div>

<div className="finance-row">

<span>

Settlement

</span>

<strong>

{

finance?.vendorSettings?.settlementDays

}

 Days

</strong>

</div>

</div>

</div>

</div>
{/* ======================================================
        ADVANCED SETTINGS
====================================================== */}

<div className="finance-bottom-grid">

{/* ===============================================
        OTHER CHARGES
=============================================== */}

<div className="finance-panel">

<div className="finance-panel-header">

<h3>

<FaCog/>

Other Charges

</h3>

</div>

<div className="finance-panel-body">

<div className="finance-row">

<span>

Packaging Fee

</span>

<strong>

{

finance?.packagingFee?.enabled

?

`₹${finance.packagingFee.amount}`

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Rain Fee

</span>

<strong>

{

finance?.rainFee?.enabled

?

`₹${finance.rainFee.amount}`

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Surge Fee

</span>

<strong>

{

finance?.surgeFee?.enabled

?

`₹${finance.surgeFee.amount}`

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

COD Charge

</span>

<strong>

₹{

finance?.codCharge || 0

}

</strong>

</div>

<div className="finance-row">

<span>

Cancellation Fee

</span>

<strong>

{

finance?.cancellationCharge?.enabled

?

`₹${finance.cancellationCharge.amount}`

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Refund Processing

</span>

<strong>

{

finance?.refundProcessingFee?.enabled

?

`₹${finance.refundProcessingFee.amount}`

:

"Disabled"

}

</strong>

</div>

</div>

</div>

{/* ===============================================
        WALLET
=============================================== */}

<div className="finance-panel">

<div className="finance-panel-header">

<h3>

<FaChartLine/>

Wallet & Vendor

</h3>

</div>

<div className="finance-panel-body">

<div className="finance-row">

<span>

Wallet

</span>

<strong>

{

finance?.walletSettings?.enabled

?

"Enabled"

:

"Disabled"

}

</strong>

</div>

<div className="finance-row">

<span>

Min Recharge

</span>

<strong>

₹{

finance?.walletSettings?.minimumRecharge

}

</strong>

</div>

<div className="finance-row">

<span>

Max Recharge

</span>

<strong>

₹{

finance?.walletSettings?.maximumRecharge

}

</strong>

</div>

<div className="finance-row">

<span>

Commission

</span>

<strong>

{

finance?.vendorSettings?.commission

}%

</strong>

</div>

<div className="finance-row">

<span>

Settlement

</span>

<strong>

{

finance?.vendorSettings?.settlementDays

}

 Days

</strong>

</div>

<div className="finance-row">

<span>

Invoice Prefix

</span>

<strong>

{

finance?.invoicePrefix

}

</strong>

</div>

</div>

</div>

</div>

{/* ======================================================
        FOOTER
====================================================== */}

<div className="finance-footer">

<div>

Showing current finance configuration.

</div>

<button

className="finance-footer-btn"

onClick={()=>setShowModal(true)}

>

<FaEye/>

View / Update Charges

</button>

</div>

{/* ======================================================
        MODAL
====================================================== */}

{

showModal &&

(

<SetCharges

finance={finance}

refreshFinance={fetchFinance}

onClose={()=>

setShowModal(false)

}

/>

)

}

</div>

);

}

export default FinanceManagement;