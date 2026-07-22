import "./VendorManagement.css";
import { useEffect, useState } from "react";
import axios from "axios";
import VendorDetailsModal from "../../components/Admin/VendorDetailsModal";
import {

Search,

Download,

RefreshCcw,

Store,

BadgeCheck,

Clock3,

Ban,

ChevronDown

} from "lucide-react";

const VendorManagement = () => {

const token = localStorage.getItem("adminToken");
console.log("Admin Token :", token);
const api = axios.create({

baseURL: "http://localhost:5000/api",

headers:{

Authorization:`Bearer ${token}`

}

});

/* ==========================================================
STATE
========================================================== */

const [loading,setLoading]=useState(true);

const [vendors,setVendors]=useState([]);

const [stats,setStats]=useState({

totalVendors:0,

verified:0,

pendingKyc:0,

suspended:0

});

const [pagination,setPagination]=useState({

page:1,

totalPages:1,

totalRecords:0

});

const [page,setPage]=useState(1);

const [search,setSearch]=useState("");

const [statusFilter,setStatusFilter]=useState("");

const [categoryFilter,setCategoryFilter]=useState("");

const [exportOpen,setExportOpen]=useState(false);
const [selectedVendor,setSelectedVendor]=useState(null);

const [showVendorModal,setShowVendorModal]=useState(false);
/* ==========================================================
FETCH
========================================================== */

const fetchVendors=async()=>{

try{

setLoading(true);

const {data}=await api.get(

"/admin/vendors",

{

params:{

page,

search,

status:statusFilter,

category:categoryFilter

}

}

);

setVendors(data.vendors || []);

setPagination(data.pagination || {});

setStats(

data.stats ||

{

totalVendors:0,

verified:0,

pendingKyc:0,

suspended:0

}

);

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};

// UPDATE kyc
const updateKycStatus = async (vendorId,status)=>{

try{

await api.put(

`/admin/vendors/${vendorId}/kyc`,

{

status

}

);

fetchVendors();

}

catch(error){

console.log(error);

alert("Unable to update KYC.");

}

};

// 
const openVendorModal = async (vendor) => {

  try {

    const { data } = await api.get(

      `/admin/vendors/${vendor._id}`

    );

    setSelectedVendor(data.vendor);

    setShowVendorModal(true);

  }

  catch(error){

    console.log(error);

  }

};

const closeVendorModal = () => {

    setShowVendorModal(false);

    setSelectedVendor(null);

};

/* ==========================================================
EXPORT
========================================================== */
const downloadFile = async (url, fileName) => {

  try {

    const response = await axios.get(

      `http://localhost:5000/api${url}`,

      {

        responseType: "blob",

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

    const blob = new Blob([response.data]);

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {

    console.error(error);

    alert("Unable to download file.");

  }

};

const exportPDF = () => {

  downloadFile(

    "/admin/vendors/export/pdf",

    "NexttGrains_Vendors.pdf"

  );

};

const exportExcel = () => {

  downloadFile(

    "/admin/vendors/export/excel",

    "NexttGrains_Vendors.xlsx"

  );

};
/* ==========================================================
EFFECT
========================================================== */

useEffect(()=>{

fetchVendors();

},[

page,

search,

statusFilter,

categoryFilter

]);
return(

<div className="vendor-page">

{/* ==========================================================
HEADER
========================================================== */}

<div className="vendor-header">

<div>

<h1 className="vendor-heading">

Vendors

</h1>

<p className="vendor-subheading">

Onboard, verify and monitor seller performance.

</p>

</div>

<div className="vendor-header-right">

<div className="vendor-export-wrapper">

<button

className="vendor-export-btn"

onClick={()=>setExportOpen(!exportOpen)}

>

<Download size={19}/>

Export

<ChevronDown size={16}/>

</button>

{

exportOpen &&

<div className="vendor-export-dropdown">

<div

onClick={exportPDF}

>

Export PDF

</div>

<div

onClick={exportExcel}

>

Export Excel

</div>

</div>

}

</div>

</div>

</div>

{/* ==========================================================
STATS
========================================================== */}

<div className="vendor-stats">

{/* TOTAL */}

<div className="vendor-card">

<div className="vendor-card-top">

<div>

<p className="vendor-card-title">

TOTAL VENDORS

</p>

<h2>

{stats.totalVendors}

</h2>

<p className="vendor-card-growth positive">

▲ {stats.totalVendors>0?"+0":"0"} vs total

</p>

</div>

<div className="vendor-card-icon green">

<Store size={24}/>

</div>

</div>

</div>

{/* VERIFIED */}

<div className="vendor-card">

<div className="vendor-card-top">

<div>

<p className="vendor-card-title">

VERIFIED

</p>

<h2>

{stats.verified}

</h2>

<p className="vendor-card-growth positive">

▲ Verified Vendors

</p>

</div>

<div className="vendor-card-icon dark">

<BadgeCheck size={24}/>

</div>

</div>

</div>

{/* PENDING */}

<div className="vendor-card">

<div className="vendor-card-top">

<div>

<p className="vendor-card-title">

PENDING KYC

</p>

<h2>

{stats.pendingKyc}

</h2>

<p className="vendor-card-growth warning">

Pending Verification

</p>

</div>

<div className="vendor-card-icon yellow">

<Clock3 size={24}/>

</div>

</div>

</div>

{/* SUSPENDED */}

<div className="vendor-card">

<div className="vendor-card-top">

<div>

<p className="vendor-card-title">

SUSPENDED

</p>

<h2>

{stats.suspended}

</h2>

<p className="vendor-card-growth danger">

Inactive Vendors

</p>

</div>

<div className="vendor-card-icon olive">

<Ban size={24}/>

</div>

</div>

</div>

</div>

{/* ==========================================================
SEARCH & FILTER CONTAINER
========================================================== */}

<div className="vendor-table-container">

<div className="vendor-toolbar">

<div className="vendor-search">

<Search size={22}/>

<input

type="text"

placeholder="Search vendors..."

value={search}

onChange={(e)=>{

setSearch(e.target.value);

setPage(1);

}}

>

</input>

</div>

<select

value={statusFilter}

onChange={(e)=>{

setStatusFilter(e.target.value);

setPage(1);

}}

>

<option value="">

Status

</option>

<option value="Pending">

Pending

</option>

<option value="Approved">

Approved

</option>

<option value="Rejected">

Rejected

</option>

</select>

<select

value={categoryFilter}

onChange={(e)=>{

setCategoryFilter(e.target.value);

setPage(1);

}}

>

<option value="">

Category

</option>

<option value="Grains">

Grains

</option>

<option value="Rice">

Rice

</option>

<option value="Pulses">

Pulses

</option>

<option value="Oil">

Oil

</option>

<option value="Flour">

Flour

</option>

<option value="Spices">

Spices

</option>

</select>

</div>
{/* ==========================================================
TABLE
========================================================== */}

<div className="vendor-table-wrapper">

{

loading ?

(

<div className="vendor-loading">

Loading Vendors...

</div>

)

:

(

<>

<table className="vendor-table">

<thead>

<tr>

<th>VENDOR</th>

<th>PRODUCTS</th>

<th>30-DAY SALES</th>

<th>KYC</th>

<th>JOINED</th>

<th>ACTIONS</th>

</tr>

</thead>

<tbody>

{

vendors.length===0 ?

(

<tr>

<td
colSpan="7"
className="vendor-empty"
>

No vendors found.

</td>

</tr>

)

:

vendors.map((vendor)=>(

<tr key={vendor._id}>

{/* ===================== Vendor ===================== */}

<td>

<div className="vendor-user">

<div className="vendor-avatar">

{

vendor.vendorName

?

vendor.vendorName

.split(" ")

.map(n=>n[0])

.join("")

.substring(0,2)

.toUpperCase()

:

"V"

}

</div>

<div>

<h4>

{vendor.businessName || vendor.vendorName}

</h4>

<p>

{vendor.vendorId || "Vendor"}

</p>

</div>

</div>

</td>

{/* ===================== Products ===================== */}

<td>

{vendor.productCount}

</td>

{/* ===================== Revenue ===================== */}

<td>

₹

{
(vendor.last30DaysRevenue || 0).toLocaleString("en-IN")
}

</td>

{/* ===================== KYC ===================== */}
<td>

<select
value={vendor.kycStatus}
className={`vendor-chip ${vendor.kycStatus.toLowerCase()}`}
onChange={(e)=>
updateKycStatus(
vendor._id,
e.target.value
)
}
>

<option value="Pending">
Pending
</option>

<option value="Verified">
Approved
</option>

<option value="Rejected">
Rejected
</option>

</select>

</td>
{/* ===================== Joined ===================== */}

<td>

{

new Date(

vendor.joinedDate

).toLocaleDateString()

}

</td>

{/* ===================== Actions ===================== */}

<td>

<div className="vendor-actions">

<button
onClick={() => openVendorModal(vendor)}
>

View

</button>

<button>

Edit

</button>

<button

className="delete"

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

{/* ==========================================================
PAGINATION
========================================================== */}

<div className="vendor-pagination">

<div>

Showing

<b>

{" "}

{

vendors.length===0

?

0

:

(page-1)*10+1

}

-

{

(page-1)*10+

vendors.length

}

{" "}

</b>

of

<b>

{" "}

{pagination.totalRecords || 0}

</b>

</div>

<div className="vendor-pages">

<button

disabled={page===1}

onClick={()=>setPage(page-1)}

>

Previous

</button>

{

Array.from(

{

length:

pagination.totalPages || 1

}

).map((_,index)=>(

<button

key={index}

className={

page===index+1

?

"active"

:

""

}

onClick={()=>

setPage(index+1)

}

>

{index+1}

</button>

))

}

<button

disabled={

page===pagination.totalPages

}

onClick={()=>

setPage(page+1)

}

>

Next

</button>

</div>

</div>

</>

)

}

</div>

</div>
<VendorDetailsModal

open={showVendorModal}

onClose={closeVendorModal}

vendor={selectedVendor}

/>
</div>


);

};

export default VendorManagement;