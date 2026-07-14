import "./Report.css";

import { useEffect,useState } from "react";

import axios from "axios";

import {

FaFilePdf,

FaChartLine,

FaShoppingBag,

FaUsers,

FaMoneyBillWave,

FaBoxes,

FaReceipt,

FaSearch,

FaSyncAlt,

FaDownload,

FaEye,

FaTrash,

FaCalendarAlt,

FaFilter

} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
Cell
} from "recharts";

const API="http://localhost:5000/api/reports";

function Report(){

const[reports,setReports]=useState([]);

const[analytics,setAnalytics]=useState({});

const[loading,setLoading]=useState(false);

const[search,setSearch]=useState("");

const[dateFilter,setDateFilter]=useState("Monthly");

const [revenueChart,setRevenueChart]=useState([]);
const [orderChart,setOrderChart]=useState([]);
const [customerChart,setCustomerChart]=useState([]);
const [categoryChart,setCategoryChart]=useState([]);
/* ==========================================================
        FETCH DASHBOARD
========================================================== */
const fetchDashboard = async () => {

  try{

    setLoading(true);

    const [
      reportRes,
      analyticsRes,
      revenueRes,
      orderRes,
      customerRes,
      categoryRes
    ] = await Promise.all([
      axios.get(API),
      axios.get(`${API}/dashboard`),
      axios.get(`${API}/charts/revenue`),
      axios.get(`${API}/charts/orders`),
      axios.get(`${API}/charts/customers`),
      axios.get(`${API}/charts/categories`)
    ]);

    setReports(reportRes.data.reports || []);
    setAnalytics(analyticsRes.data.analytics || {});
    setRevenueChart(revenueRes.data.chart || []);
    setOrderChart(orderRes.data.chart || []);
    setCustomerChart(customerRes.data.chart || []);
    setCategoryChart(categoryRes.data.chart || []);

  }catch(error){
    console.log(error);
  }finally{
    setLoading(false);
  }

};

useEffect(() => {

    fetchDashboard();

    const interval = setInterval(() => {

        fetchDashboard();

    }, 5000);

    return () => clearInterval(interval);

}, []);
/* ==========================================================
        GENERATE REPORT
========================================================== */

const generateReport=async()=>{

try{

const end = new Date();

const start = new Date();
start.setFullYear(start.getFullYear() - 1);

await axios.post(`${API}/create`, {
    reportType: dateFilter,
    reportName: `${dateFilter} Report`,
    startDate: start,
    endDate: end
});

await fetchDashboard();
toast.success("Report Generated Successfully");
}

catch(error){

console.log(error);

}

};

/* ==========================================================
        EXPORT PDF
========================================================== */

const exportPDF=(id)=>{

window.open(

`${API}/export/pdf/${id}`,

"_blank"

);

};

/* ==========================================================
        DELETE
========================================================== */

const deleteReport=async(id)=>{

const confirmDelete=

window.confirm(

"Delete this report?"

);

if(!confirmDelete) return;

try{

await axios.delete(

`${API}/delete/${id}`

);

fetchDashboard();

}

catch(error){

console.log(error);

}

};

/* ==========================================================
        SEARCH
========================================================== */

const filteredReports=

reports.filter((report)=>{

return(

report.reportName

.toLowerCase()

.includes(

search.toLowerCase()

)

||

report.reportType

.toLowerCase()

.includes(

search.toLowerCase()

)

);

});

return(

<div className="repo-report-page">

{/* ======================================================
        HEADER
====================================================== */}

<div className="repo-report-header">

<div>

<h1>

Reports & Analytics

</h1>

<p>

Business intelligence, revenue insights & performance analytics

</p>

</div>

<div className="repo-report-header-right">

<select

value={dateFilter}

onChange={(e)=>

setDateFilter(

e.target.value

)

}

>

<option>

Daily

</option>

<option>

Weekly

</option>

<option>

Monthly

</option>

<option>

Quarterly

</option>

<option>

Yearly

</option>

</select>

<button

className="repo-report-generate-btn"

onClick={generateReport}

>
<FaSyncAlt/>

Generate Report

</button>

</div>

</div>
{/* ======================================================
        KPI CARDS
====================================================== */}

<div className="repo-report-stats">

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Total Revenue</span>

<h2>

₹{

analytics.grossRevenue?.toLocaleString()

||

0

}

</h2>

<p>

Gross Sales

</p>

</div>

<div className="repo-report-stat-icon repo-report-green">

<FaMoneyBillWave/>

</div>

</div>

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Net Profit</span>

<h2>

₹{

analytics.totalProfit?.toLocaleString()

||

0

}

</h2>

<p>

After Expenses

</p>

</div>

<div className="repo-report-stat-icon repo-report-blue">

<FaChartLine/>

</div>

</div>

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Total Orders</span>

<h2>

{

analytics.totalOrders || 0

}

</h2>

<p>

Completed +

Pending

</p>

</div>

<div className="repo-report-stat-icon repo-report-orange">

<FaShoppingBag/>

</div>

</div>

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Customers</span>

<h2>

{

analytics.totalCustomers || 0

}

</h2>

<p>

Registered Users

</p>

</div>

<div className="repo-report-stat-icon repo-report-purple">

<FaUsers/>

</div>

</div>

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Products Sold</span>

<h2>

{

analytics.totalProductsSold || 0

}

</h2>

<p>

Across Categories

</p>

</div>

<div className="repo-report-stat-icon repo-report-cyan">

<FaBoxes/>

</div>

</div>

<div className="repo-report-stat-card">

<div className="repo-report-stat-left">

<span>Refunds</span>

<h2>

₹{

analytics.refundAmount?.toLocaleString()

||

0

}

</h2>

<p>

Customer Refunds

</p>

</div>

<div className="repo-report-stat-icon repo-report-red">

<FaReceipt/>

</div>

</div>

</div>

{/* ======================================================
        FILTER BAR
====================================================== */}

<div className="repo-report-toolbar">

<div className="repo-report-search">

<FaSearch/>

<input

type="text"

placeholder="Search Reports..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>

</div>

<button

className="repo-report-filter-btn"

>

<FaFilter/>

Filters

</button>

</div>
{/* ======================================================
        ANALYTICS SUMMARY
====================================================== */}

<div className="repo-report-summary-grid">

<div className="repo-report-summary-card">

<div className="repo-report-summary-header">

<h3>

Revenue Summary

</h3>

<FaMoneyBillWave/>

</div>

<div className="repo-report-summary-body">

<div>

<span>Gross Revenue</span>

<strong>

₹{

analytics.grossRevenue?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Net Revenue</span>

<strong>

₹{

analytics.netRevenue?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Profit</span>

<strong>

₹{

analytics.totalProfit?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Expenses</span>

<strong>

₹{

analytics.totalExpense?.toLocaleString()

||

0

}

</strong>

</div>

</div>

</div>

{/* =============================== */}

<div className="repo-report-summary-card">

<div className="repo-report-summary-header">

<h3>

Orders Summary

</h3>

<FaShoppingBag/>

</div>

<div className="repo-report-summary-body">

<div>

<span>Total Orders</span>

<strong>

{analytics.totalOrders || 0}

</strong>

</div>

<div>

<span>Completed</span>

<strong>

{analytics.completedOrders || 0}

</strong>

</div>

<div>

<span>Pending</span>

<strong>

{analytics.pendingOrders || 0}

</strong>

</div>

<div>

<span>Cancelled</span>

<strong>

{analytics.cancelledOrders || 0}

</strong>

</div>

</div>

</div>

{/* =============================== */}

<div className="repo-report-summary-card">

<div className="repo-report-summary-header">

<h3>

Customer Summary

</h3>

<FaUsers/>

</div>

<div className="repo-report-summary-body">

<div>

<span>Total Customers</span>

<strong>

{analytics.totalCustomers || 0}

</strong>

</div>

<div>

<span>New Customers</span>

<strong>

{analytics.newCustomers || 0}

</strong>

</div>

<div>

<span>Repeat Customers</span>

<strong>

{analytics.repeatCustomers || 0}

</strong>

</div>

<div>

<span>Conversion Rate</span>

<strong>

{analytics.conversionRate || 0}%

</strong>

</div>

</div>

</div>

{/* =============================== */}

<div className="repo-report-summary-card">

<div className="repo-report-summary-header">

<h3>

Finance Summary

</h3>

<FaReceipt/>

</div>

<div className="repo-report-summary-body">

<div>

<span>GST Collected</span>

<strong>

₹{

analytics.gstCollected?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Platform Fee</span>

<strong>

₹{

analytics.platformRevenue?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Delivery Revenue</span>

<strong>

₹{

analytics.deliveryRevenue?.toLocaleString()

||

0

}

</strong>

</div>

<div>

<span>Gateway Charges</span>

<strong>

₹{

analytics.paymentGatewayCharges?.toLocaleString()

||

0

}

</strong>

</div>

</div>

</div>

</div>

{/* ======================================================
        TOP PRODUCTS
====================================================== */}

<div className="repo-report-top-products">

<div className="repo-report-section-title">

<h2>

Top Selling Products

</h2>

</div>

<div className="repo-report-product-list">

{

analytics.topProducts?.length>0

?

analytics.topProducts.map((product,index)=>(

<div

className="repo-report-product-card"

key={index}

>

<div>

<h4>

{product.productName}

</h4>

<span>

{product.quantitySold} Sold

</span>

</div>

<div>

<strong>

₹{

product.revenue?.toLocaleString()

||

0

}

</strong>

</div>

</div>

))

:

<div className="repo-report-empty">

No Product Analytics Available

</div>

}

</div>

</div>
{/* ======================================================
        ANALYTICS CHARTS
====================================================== */}

<div className="repo-report-chart-grid">

<div className="repo-report-chart-card">

<div className="repo-report-section-title">

<h2>

Revenue Trend

</h2>

</div>

<div className="repo-chart-wrapper">
<ResponsiveContainer
width="100%"
height="100%"
>
<AreaChart
data={revenueChart}
margin={{
top:20,
right:25,
left:10,
bottom:10
}}
>
<XAxis dataKey="label"
tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<YAxis

tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<Tooltip

contentStyle={{

borderRadius:"12px",

border:"none",

boxShadow:"0 10px 30px rgba(0,0,0,.08)"

}}
/>
<Area

type="monotone"

dataKey="revenue"

stroke="#22c55e"

strokeWidth={4}

fill="#22c55e22"

dot={{

r:5,

fill:"#22c55e",

stroke:"#fff",

strokeWidth:3

}}

activeDot={{

r:8

}}
/>
</AreaChart>
</ResponsiveContainer>

</div>

</div>

<div className="repo-report-chart-card">

<div className="repo-report-section-title">

<h2>

Orders Trend

</h2>

</div>

<div className="repo-chart-wrapper">
<ResponsiveContainer
width="100%"
height="100%"
>
<BarChart data={orderChart}>
<XAxis dataKey="label"

tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<YAxis

tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<Tooltip

contentStyle={{

borderRadius:"12px",

border:"none",

boxShadow:"0 10px 30px rgba(0,0,0,.08)"

}}
/>
<Bar dataKey="orders"
fill="#22c55e"

radius={[10,10,0,0]}

barSize={36}

/>
</BarChart>
</ResponsiveContainer>


{/* <span>

(Bar Chart)

</span> */}

</div>

</div>

<div className="repo-report-chart-card">

<div className="repo-report-section-title">

<h2>

Customer Growth

</h2>

</div>

<div className="repo-chart-wrapper">
<ResponsiveContainer
width="100%"
height="100%"
>
<LineChart data={customerChart}>
<XAxis dataKey="label"

tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<YAxis

tick={{

fontSize:12,

fill:"#64748b"

}}

tickLine={false}

axisLine={false}

/>
<Tooltip

contentStyle={{

borderRadius:"12px",

border:"none",

boxShadow:"0 10px 30px rgba(0,0,0,.08)"

}}
/>
<Line

type="monotone"

dataKey="customers"

stroke="#2563eb"

strokeWidth={4}

dot={{

r:5,

fill:"#2563eb",

stroke:"#fff",

strokeWidth:3

}}

activeDot={{

r:8

}}
/>
</LineChart>
</ResponsiveContainer>


</div>

</div>

<div className="repo-report-chart-card">

<div className="repo-report-section-title">

<h2>

Category Distribution

</h2>

</div>

<div className="repo-chart-wrapper">
<ResponsiveContainer
width="100%"
height="100%"
>
<PieChart>
<Pie
data={categoryChart}
dataKey="percentage"
nameKey="category"
innerRadius={70}
outerRadius={105}
paddingAngle={3}
cornerRadius={6}
label
>
{
categoryChart.map((entry,index)=>

<Cell

key={index}

fill={[
"#22c55e",
"#2563eb",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#06b6d4"

][index%6]}

/>

)
}

</Pie>
{/* 
<Pie
    data={categoryChart}
    dataKey="percentage"
    nameKey="category"
    innerRadius={70}

outerRadius={105}

paddingAngle={3}

cornerRadius={6}
    fill="#22c55e"
    label
/> */}

<Tooltip

contentStyle={{

borderRadius:"12px",

border:"none",

boxShadow:"0 10px 30px rgba(0,0,0,.08)"

}}
/>

<Legend/>

</PieChart>

</ResponsiveContainer>
</div>

</div>

</div>

{/* ======================================================
        TOP CATEGORIES
====================================================== */}

<div className="repo-report-two-column">

<div className="repo-report-list-card">

<div className="repo-report-section-title">

<h2>

Top Categories

</h2>

</div>

{

analytics.topCategories?.length>0

?

analytics.topCategories.map((category,index)=>(

<div

key={index}

className="repo-report-list-row"

>

<div>

<strong>

{category.categoryName}

</strong>

</div>

<div>

₹{

category.revenue?.toLocaleString()

||

0

}

</div>

</div>

))

:

<div className="repo-report-empty">

No Categories Found

</div>

}

</div>

{/* ======================================================
        TOP CITIES
====================================================== */}

<div className="repo-report-list-card">

<div className="repo-report-section-title">

<h2>

Top Cities

</h2>

</div>

{

analytics.topCities?.length>0

?

analytics.topCities.map((city,index)=>(

<div

key={index}

className="repo-report-list-row"

>

<div>

<strong>

{city.city}

</strong>

</div>

<div>

₹{

city.revenue?.toLocaleString()

||

0

}

</div>

</div>

))

:

<div className="repo-report-empty">

No Cities Found

</div>

}

</div>

</div>

{/* ======================================================
        REPORTS TABLE
====================================================== */}

<div className="repo-report-table-card">

<div className="repo-report-section-title">

<h2>

Generated Reports

</h2>

</div>

<table className="repo-report-table">

<thead>

<tr>

<th>

Report

</th>

<th>

Type

</th>

<th>

Generated

</th>

<th>

Revenue

</th>

<th>

Orders

</th>

<th>

Status

</th>

<th>

Actions

</th>

</tr>

</thead>

<tbody>

{

loading

?

(

<tr>

<td

colSpan="7"

className="repo-report-empty"

>

Loading Reports...

</td>

</tr>

)

:

filteredReports.length===0

?

(

<tr>

<td

colSpan="7"

className="repo-report-empty"

>

No Reports Found

</td>

</tr>

)

:

filteredReports.map((report)=>(

<tr

key={report._id}

>

<td>

{report.reportName}

</td>

<td>

{report.reportType}

</td>

<td>

{

new Date(

report.generatedAt

)

.toLocaleDateString()

}

</td>

<td>

₹{

report.grossRevenue?.toLocaleString()

||

0

}

</td>

<td>

{

report.totalOrders || 0

}

</td>

<td>

<span

className="repo-report-status"

>

{

report.reportStatus

}

</span>

</td>

<td>

<div className="repo-report-actions">

<button

className="repo-report-view-btn"

title="View"

>

<FaEye/>

</button>

<button

className="repo-report-download-btn"

title="Export PDF"

onClick={()=>

exportPDF(

report._id

)

}

>

<FaDownload/>

</button>

<button

className="repo-report-delete-btn"

title="Delete"

onClick={()=>

deleteReport(

report._id

)

}

>

<FaTrash/>

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>
{/* ======================================================
        FOOTER
====================================================== */}

<div className="repo-report-footer">

<div className="repo-report-footer-left">

<span>

Showing

{" "}

<strong>

{filteredReports.length}

</strong>

{" "}

Generated Reports

</span>

</div>

<div className="repo-report-footer-right">

<button

className="repo-report-refresh-btn"

onClick={fetchDashboard}

>

<FaSyncAlt/>

Refresh

</button>

<button

className="repo-report-export-all-btn"

onClick={()=>{

if(filteredReports.length>0){

exportPDF(

filteredReports[0]._id

);

}

}}

>

<FaFilePdf/>

Export Latest Report

</button>

</div>

</div>

</div>

);

}

export default Report;