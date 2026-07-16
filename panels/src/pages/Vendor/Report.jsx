import React, {
useEffect,
useState,
useMemo
} from "react";

import "./Report.css";

import axios from "axios";

import {

IndianRupee,
ShoppingBag,
Truck,
Clock3,
RotateCw

} from "lucide-react";

import {

ResponsiveContainer,

LineChart,
Line,

CartesianGrid,

XAxis,
YAxis,

Tooltip,

PieChart,
Pie,
Cell,

BarChart,
Bar

} from "recharts";

/* ==========================================================
   COLORS
========================================================== */

const PIE_COLORS = [

"#5D7A1F",
"#D7A643",
"#6D9F71",
"#87B94F",
"#355C32",
"#B8C78D"

];

/* ==========================================================
   COMPONENT
========================================================== */

export default function Report(){

const [loading,setLoading]=useState(true);

const [analytics,setAnalytics]=useState(null);

const [refreshing,setRefreshing]=useState(false);

const token=localStorage.getItem("vendorToken");

/* ==========================================================
   LOAD REPORT
========================================================== */

const loadReport=async()=>{

try{

setLoading(true);

const res=await axios.get(

"http://localhost:5000/api/reports/vendor/dashboard",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

setAnalytics(res.data.analytics);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

setRefreshing(false);

}

};

/* ==========================================================
   REFRESH
========================================================== */

const handleRefresh=async()=>{

setRefreshing(true);

await loadReport();

};

/* ==========================================================
   INITIAL LOAD
========================================================== */

useEffect(()=>{

loadReport();

},[]);

/* ==========================================================
   SUMMARY
========================================================== */

const summary=useMemo(()=>{

if(!analytics){

return{

revenue:0,

totalOrders:0,

pendingOrders:0,

deliveredOrders:0,

shippedOrders:0,

repeatBuyers:0,

repeatBuyerPercentage:0

};

}

return analytics.summary;

},[analytics]);
/* ==========================================================
   LOADING
========================================================== */

if(loading){

return(

<div className="ven-report-page">

<div className="ven-report-loading">

Loading Vendor Analytics...

</div>

</div>

);

}

/* ==========================================================
   JSX
========================================================== */

return(

<div className="ven-report-page">

<div className="ven-report-container">

{/* =======================================================
    HEADER
======================================================= */}

<div className="ven-report-header">

<div className="ven-report-header-left">

<h1>

Reports & Analytics

</h1>

<p>

Track your store performance, revenue trends and product
category insights in real-time.

</p>

</div>

<button

className="ven-report-refresh-btn"

onClick={handleRefresh}

disabled={refreshing}

>

<RotateCw

size={18}

className={refreshing ? "ven-report-spin" : ""}

/>

{

refreshing

?

"Refreshing..."

:

"Refresh"

}

</button>

</div>

{/* =======================================================
    SUMMARY CARDS
======================================================= */}

<div className="ven-report-summary-grid">

{/* Revenue */}

<div className="ven-report-summary-card">

<div>

<span>Total Revenue</span>

<h2>

₹

{

summary.revenue.toLocaleString(

"en-IN"

)

}

</h2>

</div>

<div className="ven-report-summary-icon revenue">

<IndianRupee size={30}/>

</div>

</div>

{/* Orders */}

<div className="ven-report-summary-card">

<div>

<span>Total Orders</span>

<h2>

{

summary.totalOrders

}

</h2>

</div>

<div className="ven-report-summary-icon orders">

<ShoppingBag size={30}/>

</div>

</div>

{/* Pending */}

<div className="ven-report-summary-card">

<div>

<span>Pending Orders</span>

<h2>

{

summary.pendingOrders

}

</h2>

</div>

<div className="ven-report-summary-icon pending">

<Clock3 size={30}/>

</div>

</div>

{/* Delivered */}

<div className="ven-report-summary-card">

<div>

<span>Delivered Orders</span>

<h2>

{

summary.deliveredOrders

}

</h2>

</div>

<div className="ven-report-summary-icon delivered">

<Truck size={30}/>

</div>

</div>

</div>
{/* =======================================================
    CHART GRID
======================================================= */}

<div className="ven-report-chart-grid">

{/* =======================================================
    MONTHLY REVENUE
======================================================= */}

<div className="ven-report-chart-card ven-report-chart-large">

<div className="ven-report-chart-header">

<div>

<h3>

Monthly Revenue

</h3>

<p>

Revenue earned month-wise

</p>

</div>

</div>

<div className="ven-report-chart-body">

<ResponsiveContainer

width="100%"

height={360}

>

<LineChart

data={analytics.monthlyRevenue}

>

<CartesianGrid

strokeDasharray="3 3"

vertical={false}

/>

<XAxis

dataKey="month"

tickLine={false}

axisLine={false}

/>

<YAxis

tickLine={false}

axisLine={false}

/>

<Tooltip
formatter={(value)=>[
`₹${value.toLocaleString("en-IN")}`,
"Revenue"
]}
/>

<Line

type="monotone"

dataKey="revenue"

stroke="#5D7A1F"

strokeWidth={4}

dot={{

r:5,

fill:"#5D7A1F"

}}

activeDot={{

r:8

}}

/>

</LineChart>

</ResponsiveContainer>

{/* <div className="ven-report-category-legend">

{

analytics.categorySplit.map((item,index)=>(

<div

key={item.category}

className="ven-report-category-item"

>

<span

className="ven-report-category-color"

style={{

background:

PIE_COLORS[

index %

PIE_COLORS.length

]

}}

></span>

<span>

{item.category}

</span>

</div>

))

}

</div> */}
</div>

</div>

{/* =======================================================
    CATEGORY SPLIT
======================================================= */}

<div className="ven-report-chart-card">

<div className="ven-report-chart-header">

<div>

<h3>

Category Split

</h3>

<p>

Revenue by category

</p>

</div>

</div>

{/* <div className="ven-report-chart-body">

<ResponsiveContainer

width="100%"

height={360}

>

<PieChart>

<Pie

data={analytics.categorySplit}

dataKey="revenue"

nameKey="category"

outerRadius={125}

innerRadius={65}

paddingAngle={3}

label

>

{

analytics.categorySplit.map(

(entry,index)=>(

<Cell

key={index}

fill={

PIE_COLORS[

index %

PIE_COLORS.length

]

}

/>

)

)

}

</Pie>
<Tooltip

formatter={(value,name,props)=>[

`₹${value.toLocaleString("en-IN")}`,

props.payload.category

]}

/>
</PieChart>

</ResponsiveContainer>
<div className="ven-report-category-legend">

{
analytics.categorySplit.map((item,index)=>(

<div
key={item.category}
className="ven-report-category-item"
>

<span
className="ven-report-category-color"
style={{
background:PIE_COLORS[index % PIE_COLORS.length]
}}
></span>

<span>{item.category}</span>

</div>

))
}

</div>
</div> */}
<div className="ven-report-chart-body">

<div className="ven-report-category-wrapper">

<div className="ven-report-category-chart">

<ResponsiveContainer
width="100%"
height={360}
>

<PieChart>

<Pie
data={analytics.categorySplit}
dataKey="revenue"
nameKey="category"
outerRadius={125}
innerRadius={65}
paddingAngle={3}
label
>

{
analytics.categorySplit.map((entry,index)=>(

<Cell
key={index}
fill={PIE_COLORS[index % PIE_COLORS.length]}
/>

))
}

</Pie>

<Tooltip
formatter={(value,name,props)=>[
`₹${value.toLocaleString("en-IN")}`,
props.payload.category
]}
/>

</PieChart>

</ResponsiveContainer>

</div>

<div className="ven-report-category-legend">

{

analytics.categorySplit.map((item,index)=>(

<div
key={item.category}
className="ven-report-category-item"
>

<span
className="ven-report-category-color"
style={{
background:
PIE_COLORS[index % PIE_COLORS.length]
}}
></span>

<span>{item.category}</span>

</div>

))

}

</div>

</div>

</div>
</div>

</div>
{/* =======================================================
    BOTTOM GRID
======================================================= */}

<div className="ven-report-bottom-grid">

{/* =======================================================
    ORDERS BY DAY
======================================================= */}

<div className="ven-report-chart-card ven-report-chart-large">

<div className="ven-report-chart-header">

<div>

<h3>

Orders By Day

</h3>

<p>

Weekly order distribution

</p>

</div>

</div>

<div className="ven-report-chart-body">

<ResponsiveContainer

width="100%"

height={340}

>

<BarChart

data={analytics.ordersByDay}

>

<CartesianGrid

strokeDasharray="3 3"

vertical={false}

/>

<XAxis

dataKey="day"

tickLine={false}

axisLine={false}

/>

<YAxis

tickLine={false}

axisLine={false}

/>

<Tooltip/>

<Bar

dataKey="orders"

fill="#5D7A1F"

radius={[8,8,0,0]}

/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

{/* =======================================================
    RIGHT SIDE
======================================================= */}

<div className="ven-report-right-column">

{/* ==============================
    REPEAT BUYERS
============================== */}

<div className="ven-report-info-card">

<h3>

Repeat Buyers

</h3>

<h2>

{

summary.repeatBuyers

}

</h2>

<p>

{

summary.repeatBuyerPercentage

}

%

of customers purchased more than once.

</p>

</div>



{/* ==============================
    REVENUE INSIGHT
============================== */}

<div className="ven-report-info-card">

<h3>

Revenue Insight

</h3>

<p>

Your store has generated

<strong>

{" "}₹{

summary.revenue.toLocaleString("en-IN")

}
{" "}

</strong>

from

<strong>

{" "}

{

summary.totalOrders

}
{" "}

</strong>

orders.

</p>

</div>

</div>

</div>

</div>

</div>

);

}