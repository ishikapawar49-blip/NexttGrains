import React, { useState } from "react";
import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Store,
  Boxes,
  ShoppingCart,
  PackageSearch,
  Ticket,
  Image,
  Newspaper,
  FileText,
  Wallet,
  BarChart3,
  Bell,
  LifeBuoy,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

const menuItems=[

// {
// title:"Dashboard",
// path:"/",
// icon:<LayoutDashboard size={22}/>
// },

{
title:"Customers",
path:"/customers",
icon:<Users size={22}/>
},

{
title:"Vendors",
path:"/vendors",
icon:<Store size={22}/>
},

{
title:"Products",
path:"/products",
icon:<Boxes size={22}/>
},

{
title:"Orders",
path:"/orders",
icon:<ShoppingCart size={22}/>
},

{
title:"Inventory",
path:"/inventory",
icon:<PackageSearch size={22}/>
},

{
title:"Coupons",
path:"/coupons",
icon:<Ticket size={22}/>
},

{
title:"Banners",
path:"/banners",
icon:<Image size={22}/>
},

{
title:"Blogs",
path:"/blogs",
icon:<Newspaper size={22}/>
},

{
title:"CMS",
path:"/cms",
icon:<FileText size={22}/>
},

{
title:"Finance",
path:"/finance",
icon:<Wallet size={22}/>
},

{
title:"Reports",
path:"/reports",
icon:<BarChart3 size={22}/>
},

{
title:"Notifications",
path:"/notifications",
icon:<Bell size={22}/>
},

{
title:"Support Tickets",
path:"/support",
icon:<LifeBuoy size={22}/>
},

{
title:"Audit Logs",
path:"/auditlogs",
icon:<ScrollText size={22}/>
},

{
title:"Settings",
path:"/settings",
icon:<Settings size={22}/>
}

];

export default function AdminSidebar() {

  const [collapsed, setCollapsed] = useState(false);

  return (

    <div className={`adminSidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebarTop">

        <div className="logoCircle">
          N
        </div>

        {!collapsed && (
          <div>

            <h2>NextTGrains</h2>

            <span>ADMIN CONSOLE</span>

          </div>
        )}

      </div>

      <div className="menuContainer">

        {menuItems.map((item, index) => (

          <div
            className={`menuItem ${index === 0 ? "active" : ""}`}
            key={index}
          >

            {item.icon}

            {!collapsed && <span>{item.title}</span>}

          </div>

        ))}

      </div>

      <div className="sidebarBottom">

        <button
          className="collapseBtn"
          onClick={() => setCollapsed(!collapsed)}
        >

          {collapsed ? <ChevronRight /> : <ChevronLeft />}

        </button>

        {!collapsed && (
          <div className="logoutBtn">

            <LogOut size={21} />

            <span>Sign out</span>

          </div>
        )}

      </div>

    </div>

  );
}