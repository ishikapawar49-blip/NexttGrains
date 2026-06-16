import React from "react";
import "./Customer.css";

import {
  FiDownload,
  FiPlus,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiChevronRight,
  FiUsers,
  FiUserPlus
} from "react-icons/fi";

import { MdWorkspacePremium } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

function Customers() {

const stats=[

{
title:"TOTAL CUSTOMERS",
value:"12,901",
change:"+4.2%",
icon:<FiUsers/>
},

{
title:"NEW THIS WEEK",
value:"342",
change:"+8.1%",
icon:<FiUserPlus/>
},

{
title:"VIP SEGMENT",
value:"218",
change:"+12",
icon:<MdWorkspacePremium/>
},

{
title:"ACTIVE CITIES",
value:"84",
change:"+3",
icon:<HiOutlineLocationMarker/>
}

];

return(

<div className="custContainer">

<div className="custHeader">

<div>

<h1>

Customers

</h1>

<p>

Manage shoppers, segments and lifetime value.

</p>

</div>

<div className="custHeaderBtns">

<button className="custExportBtn">

<FiDownload/>

Export CSV

</button>

<button className="custAddBtn">

<FiPlus/>

Add Customer

</button>

</div>

</div>

<div className="custStatsGrid">

{

stats.map((item,index)=>(

<div
className="custCard"
key={index}
>

<div className="custCardTop">

<div>

<p>

{item.title}

</p>

<h2>

{item.value}

</h2>

<span>

▲ {item.change}

<span className="custGray">

vs last week

</span>

</span>

</div>

<div className="custIcon">

{item.icon}

</div>

</div>

</div>

))

}

</div>

<div className="custSearchSection">

<div className="custSearch">

<FiSearch/>

<input

type="text"

placeholder="Search by name, email or phone..."

/>

</div>

<div className="custFilters">

<button>

<FiFilter/>

Segment

</button>

<button>

<FiMapPin/>

City

</button>

<button>

Joined

</button>

<button>

Spent

<FiChevronRight/>

</button>

</div>

</div>

      {/* ================= TABLE ================= */}

      <div className="custTableWrapper">

        <table className="custTable">

          <thead>

            <tr>

              <th></th>

              <th>CUSTOMER</th>

              <th>PHONE</th>

              <th>CITY</th>

              <th>ORDERS</th>

              <th>SPENT</th>

              <th>SEGMENT</th>

              <th>JOINED</th>

              <th>ACTIONS</th>

            </tr>

          </thead>

          <tbody>

            {

            [

            {

            initials:"AS",

            name:"Aarav Sharma",

            email:"user1@nexttgrains.in",

            phone:"+91 9800000000",

            city:"Mumbai",

            orders:3,

            spent:"₹2,400",

            segment:"VIP",

            joined:"2024-01-12"

            },

            {

            initials:"DP",

            name:"Diya Patel",

            email:"user2@nexttgrains.in",

            phone:"+91 9800000131",

            city:"Delhi",

            orders:5,

            spent:"₹3,380",

            segment:"Active",

            joined:"2024-02-12"

            },

            {

            initials:"RG",

            name:"Rohan Gupta",

            email:"user3@nexttgrains.in",

            phone:"+91 9800000262",

            city:"Bengaluru",

            orders:7,

            spent:"₹4,360",

            segment:"Active",

            joined:"2024-03-12"

            },

            {

            initials:"IV",

            name:"Ishita Verma",

            email:"user4@nexttgrains.in",

            phone:"+91 9800000393",

            city:"Pune",

            orders:9,

            spent:"₹5,340",

            segment:"New",

            joined:"2024-04-12"

            },

            {

            initials:"KS",

            name:"Kabir Singh",

            email:"user5@nexttgrains.in",

            phone:"+91 9800000524",

            city:"Hyderabad",

            orders:11,

            spent:"₹6,320",

            segment:"Active",

            joined:"2024-05-12"

            },

            {

            initials:"MI",

            name:"Meera Iyer",

            email:"user6@nexttgrains.in",

            phone:"+91 9800000655",

            city:"Kolkata",

            orders:13,

            spent:"₹7,300",

            segment:"VIP",

            joined:"2024-06-12"

            }

            ].map((item,index)=>(

            <tr key={index}>

              <td>

                <input type="checkbox"/>

              </td>

              <td>

                <div className="custUser">

                  <div className="custAvatar">

                    {item.initials}

                  </div>

                  <div>

                    <h4>

                      {item.name}

                    </h4>

                    <span>

                      {item.email}

                    </span>

                  </div>

                </div>

              </td>

              <td>

                {item.phone}

              </td>

              <td>

                {item.city}

              </td>

              <td>

                {item.orders}

              </td>

              <td>

                {item.spent}

              </td>

              <td>

                <span className={`custBadge ${item.segment}`}>

                  {item.segment}

                </span>

              </td>

              <td>

                {item.joined}

              </td>

              <td>

                <div className="custActions">

                  <button>

                    View

                  </button>

                  <button>

                    Edit

                  </button>

                  <button className="delete">

                    Delete

                  </button>

                </div>

              </td>

            </tr>

            ))

            }

          </tbody>

        </table>

      </div>
{/* ================= PAGINATION ================= */}

<div className="custPagination">

    <div className="custPageInfo">

        Showing 1–14 of 14

    </div>

    <div className="custPageBtns">

        <button className="custPrevBtn">

            Previous

        </button>

        <button className="custPageActive">

            1

        </button>

        <button>

            2

        </button>

        <button>

            3

        </button>

        <button className="custNextBtn">

            Next

        </button>

    </div>

</div>
    </div>

);

}

export default Customers;