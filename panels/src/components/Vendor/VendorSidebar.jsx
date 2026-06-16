import React,{useState} from "react";
import "./VendorSidebar.css";
import {NavLink} from "react-router-dom";

import{

LayoutDashboard,
Boxes,
PackageSearch,
ShoppingCart,
Users,
BarChart3,
Wallet,
Bell,
Store,
FileText,
CreditCard,
BadgeCheck,
ChevronLeft,
ChevronRight,
LogOut

}from "lucide-react";

const menuItems=[

{
title:"Dashboard",
path:"/vendor/dashboard",
icon:<LayoutDashboard size={22}/>
},

{
title:"Products",
path:"/vendor/products",
icon:<Boxes size={22}/>
},

{
title:"Inventory",
path:"/vendor/inventory",
icon:<PackageSearch size={22}/>
},

{
title:"Orders",
path:"/vendor/orders",
icon:<ShoppingCart size={22}/>
},

{
title:"Customers",
path:"/vendor/customers",
icon:<Users size={22}/>
},

{
title:"Reports",
path:"/vendor/reports",
icon:<BarChart3 size={22}/>
},

{
title:"Payouts",
path:"/vendor/payouts",
icon:<Wallet size={22}/>
},

{
title:"Notifications",
path:"/vendor/notifications",
icon:<Bell size={22}/>
},

{
title:"Store Settings",
path:"/vendor/store",
icon:<Store size={22}/>
},

{
title:"GST Details",
path:"/vendor/gst",
icon:<FileText size={22}/>
},

{
title:"Bank Details",
path:"/vendor/bank",
icon:<CreditCard size={22}/>
},

{
title:"KYC Documents",
path:"/vendor/kyc",
icon:<BadgeCheck size={22}/>
}

];

export default function VendorSidebar(){

const[collapsed,setCollapsed]=useState(false);

return(

<div className={`vendorSidebar ${collapsed?"collapsed":""}`}>

<div className="vendorSidebarTop">

<div className="vendorLogoCircle">

N

</div>

{

!collapsed&&

<div>

<h2>

Annapurna Mills

</h2>

<span>

VENDOR STUDIO

</span>

</div>

}

</div>

<div className="vendorMenuContainer">

{

menuItems.map((item,index)=>(

<NavLink

to={item.path}

key={index}

className={({isActive})=>

isActive

?

"vendorMenuItem active"

:

"vendorMenuItem"

}

>

{item.icon}

{

!collapsed&&

<span>

{item.title}

</span>

}

</NavLink>

))

}

</div>

<div className="vendorSidebarBottom">

<button

className="vendorCollapseBtn"

onClick={()=>setCollapsed(!collapsed)}

>

{

collapsed

?

<ChevronRight/>

:

<ChevronLeft/>

}

</button>

{

!collapsed&&

<div className="vendorLogoutBtn">

<LogOut size={19}/>

<span>

Sign out

</span>

</div>

}

</div>

</div>

);

}