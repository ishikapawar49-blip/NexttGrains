import React from "react";
import "./Customer.css";
import{ getCustomers, toggleBlockCustomer, deleteCustomer, exportExcel, exportPDF} from "../../services/customerApi";
import { useEffect, useState } from "react";
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
const [customers,setCustomers]=useState([]);
const [stats,setStats]=useState([]);
const [showExport,setShowExport]=useState(false);
const [search,setSearch]=useState("");
const [segmentFilter, setSegmentFilter] = useState("All");
const [cityFilter, setCityFilter] = useState("All");
const [joinedFilter, setJoinedFilter] = useState("Newest");
const [spentFilter, setSpentFilter] = useState("None");

const loadCustomers=async()=>{

const res=

await getCustomers();

setCustomers(

res.data.customers

);

const data=

res.data.customers;
setStats([

{

title:"TOTAL CUSTOMERS",

value:data.length,

icon:<FiUsers/>

},

{

title:"NEW THIS WEEK",

value:data.filter(

x=>{

const diff=

(Date.now()

-new Date(x.joined))

/

86400000;

return diff<=7;

}

).length,

icon:<FiUserPlus/>

},

{

title:"VIP SEGMENT",

value:data.filter(

x=>x.segment==="VIP"

).length,

icon:<MdWorkspacePremium/>

},

{

title:"ACTIVE CITIES",

value:

new Set(

data.map(

x=>x.city

)

).size,

icon:<HiOutlineLocationMarker/>

}

]);

};

const filtered = customers
.filter(item=>{

const searchMatch =
item.name.toLowerCase().includes(search.toLowerCase()) ||
item.email.toLowerCase().includes(search.toLowerCase()) ||
item.phone.includes(search);

const segmentMatch =
segmentFilter==="All"
?true
:(item.isBlocked
?"Blocked"
:item.segment)===segmentFilter;

const cityMatch =
cityFilter==="All"
?true
:item.city===cityFilter;

return searchMatch && segmentMatch && cityMatch;

})
.sort((a,b)=>{

if(joinedFilter==="Newest"){
return new Date(b.joined)-new Date(a.joined);
}

if(joinedFilter==="Oldest"){
return new Date(a.joined)-new Date(b.joined);
}

if(spentFilter==="High"){
return b.spent-a.spent;
}

if(spentFilter==="Low"){
return a.spent-b.spent;
}

return 0;

});

const cities = [
"All",
...new Set(
customers.map(x=>x.city)
)
];
const handleDelete = async (id) => {

    const ok = window.confirm(

        "Delete this customer?"

    );

    if (!ok) return;

    try {

        await deleteCustomer(id);

        loadCustomers();

    }

    catch (err) {

        console.log(err);

    }

};

const downloadExcel = async () => {

    const res = await exportExcel();

const blob = new Blob(

[res.data],

{

type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

}

);

const url = URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="Customers.xlsx";

a.click();

URL.revokeObjectURL(url);
};

const downloadPDF = async () => {

    const res = await exportPDF();

const blob = new Blob(

[res.data],

{

type:"application/pdf"

}

);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = "Customers.pdf";

a.click();

URL.revokeObjectURL(url);
};

useEffect(()=>{
loadCustomers();
},[]);

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

<div className="custExportWrapper">

<button

className="custExportBtn"

onClick={()=>

setShowExport(

!showExport

)

}

>

<FiDownload/>

Export

</button>

{

showExport &&

<div className="custExportMenu">

<button

onClick={downloadExcel}

>

Export Excel

</button>

<button

onClick={downloadPDF}

>

Export PDF

</button>

</div>

}

</div>
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
<span className="custGray">

Live

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
value={search}
type="text"
placeholder="Search by name, email or phone..."
onChange={ e=>setSearch( e.target.value ) }
/>

</div>

<div className="custFilters">

<select
value={segmentFilter}
onChange={(e)=>setSegmentFilter(e.target.value)}
>

<option>All</option>
<option>VIP</option>
<option>Active</option>
<option>New</option>
<option>Blocked</option>

</select>

<select
value={cityFilter}
onChange={(e)=>setCityFilter(e.target.value)}
>

{
cities.map(city=>(

<option
key={city}
value={city}
>

{city}

</option>

))
}

</select>

<select
value={joinedFilter}
onChange={(e)=>setJoinedFilter(e.target.value)}
>

<option value="Newest">
Newest
</option>

<option value="Oldest">
Oldest
</option>

</select>

<select
value={spentFilter}
onChange={(e)=>setSpentFilter(e.target.value)}
>

<option value="None">
Spent
</option>

<option value="High">
High → Low
</option>

<option value="Low">
Low → High
</option>

</select>

</div>

</div>

      {/* ================= TABLE ================= */}

      <div className="custTableWrapper">

        <table className="custTable">

          <thead>

            <tr>

              <th></th>

              <th>CUSTOMER</th>
              <th>EMAIL</th>
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

           filtered.map((item)=>(

           <tr key={item._id}>

              <td>

                <input type="checkbox"/>

              </td>

              <td>

                <div className="custUser">

                  <div className="custAvatar">

                    {

item.name

.substring(0,2)

.toUpperCase()

}

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

{item.email}

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

                ₹{item.spent}

              </td>

              <td>

                <span

className={`custBadge ${item.isBlocked?"Blocked":item.segment}`}

>

{

item.isBlocked

?

"Blocked"

:

item.segment

}

</span>

              </td>

              <td>

               {

new Date(

item.joined

)

.toLocaleDateString()

}

              </td>

              <td>

                <div className="custActions">

<button

onClick={async()=>{

await toggleBlockCustomer(

item._id

);

loadCustomers();

}}

>

{

item.isBlocked

?

"Unblock"

:

"Block"

}

</button>
                 <button

className="delete"

onClick={()=>

handleDelete(

item._id

)

}

>

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

      Showing

1-

{filtered.length}

of

{customers.length}

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