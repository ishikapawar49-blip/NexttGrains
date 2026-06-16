import React from "react";
import "./AdminDashboard.css";

import {
  FiDownload,
  FiPlus,
  FiUsers,
  FiShoppingCart
} from "react-icons/fi";

import { MdStorefront } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";

import RevenueChart from "./RevenueChart";
import CategoryChart from "./CategoryChart";
import RecentOrders from "./RecentOrders";
import TopVendors from "./TopVendors";
import OperationsAlerts from "./OperationsAlerts";
import QuickActions from "./QuickActions";

const stats = [

{
title:"GROSS REVENUE",
value:"₹18,42,930",
change:"+12.4%",
icon:<FaRupeeSign/>
},

{
title:"ORDERS",
value:"3,284",
change:"+8.1%",
icon:<FiShoppingCart/>
},

{
title:"CUSTOMERS",
value:"12,901",
change:"+4.2%",
icon:<FiUsers/>
},

{
title:"ACTIVE VENDORS",
value:"184",
change:"+6",
icon:<MdStorefront/>
}

];

function AdminDashboard(){

return(

<div className="adashContainer">

<div className="adashHeader">

<div>

<h1>

Operations Dashboard

</h1>

<p>

Live snapshot across customers, vendors, orders and inventory.

</p>

</div>

<div className="adashBtns">

<button>

<FiDownload/>

Export

</button>

<button className="greenBtn">

<FiPlus/>

New Campaign

</button>

</div>

</div>

<div className="adashStatsGrid">

{

stats.map((item,index)=>(

<div
className="adashStatCard"
key={index}
>

<div className="adashStatTop">

<div>

<p>

{item.title}

</p>

<h2>

{item.value}

</h2>

<span>

▲ {item.change}

<span className="gray">

vs last week

</span>

</span>

</div>

<div className="adashStatIcon">

{item.icon}

</div>

</div>

</div>

))

}

</div>

<div className="adashChartsGrid">

<RevenueChart/>

<CategoryChart/>

</div>

<div className="adashOrdersGrid">

<RecentOrders/>

<TopVendors/>

</div>

<div className="adashBottomGrid">

<OperationsAlerts/>

<QuickActions/>

</div>

</div>

)

}

export default AdminDashboard;