import "./OrderManagement.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaFileExcel,
  FaFilePdf,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaShoppingBag,
} from "react-icons/fa";

import {
  MdRefresh,
  MdFilterList,
} from "react-icons/md";

import {
  IoEyeOutline,
} from "react-icons/io5";

const API = "http://localhost:5000/api/orders";

function OrderManagement() {

  /* ===========================
      STATES
  =========================== */

  const [orders, setOrders] = useState([]);
   
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving,setSaving]=useState(false);
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [statusModal, setStatusModal] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [updateData, setUpdateData] = useState({

    orderStatus: "",

    paymentStatus: "",

    deliveryPartner: "",

    trackingId: "",

    trackingUrl: "",

    adminRemark: ""

});
  /* ===========================
        FETCH ORDERS
  =========================== */

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}`, {

        params: {

          page,

          search,

          status,

          paymentStatus,

          paymentMethod,

        },

      });

      setOrders(res.data.orders);

      setTotalPages(res.data.totalPages);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };
  const fetchOrderDetails = async (orderId) => {

  try {

    const res = await axios.get(`${API}/${orderId}`);

    setSelectedOrder(res.data.order);
    setUpdateData({

    orderStatus:
        res.data.order.orderStatus || "",

    paymentStatus:
        res.data.order.paymentStatus || "",

    deliveryPartner:
        res.data.order.tracking?.deliveryPartner || "",

    trackingId:
        res.data.order.tracking?.trackingId || "",

    trackingUrl:
        res.data.order.tracking?.trackingUrl || "",

    adminRemark:
        res.data.order.adminRemark || ""

});

    setDrawerOpen(true);

  } catch (err) {

    console.log(err);

  }

};
const updateOrderStatus = async (id, status) => {

  try {

    await axios.put(`${API}/status/${id}`, {

      orderStatus: status,

      updatedBy: localStorage.getItem("adminId")

    });

    fetchOrders();

    toast.success("Status Updated");

  }

  catch {

    toast.error("Unable to update");

  }

};

const updateOrder = async () => {

    try {

        setSaving(true);
    await axios.put(
    `${API}/status/${selectedOrder._id}`,
    {
        ...updateData,
        updatedBy: localStorage.getItem("adminId")
    }
);
 await fetchOrders();
await fetchOrderDetails(selectedOrder._id);

        setTimeout(() => {

            setDrawerOpen(false);

            setSelectedOrder(null);

        }, 700);

        setStatusModal(false);

        toast.success("Order Updated Successfully");

    }

    catch (error) {

        toast.error("Unable to update order");

    }

    finally {

        setSaving(false);

    }

};
  /* ===========================
        FETCH STATS
  =========================== */

  const fetchStats = async () => {

    try {

      const res = await axios.get(`${API}/admin/stats`);

      setStats(res.data.stats);

    } catch (err) {

      console.log(err);

    }

  };
    /* ===========================
        EXPORT
  =========================== */

  const exportExcel = () => {

    window.open(

      `${API}/admin/export/excel`,

      "_blank"

    );

  };

  const exportPDF = () => {

    window.open(

      `${API}/admin/export/pdf`,

      "_blank"

    );

  };
    const refreshOrders = () => {

    setRefresh(!refresh);

  };
    useEffect(() => {

    fetchOrders();

  }, [

    page,

    search,

    status,

    paymentStatus,

    paymentMethod,

    refresh,

  ]);

  useEffect(() => {

    fetchStats();

  }, []);
    return (

<div className="om">

{/* =======================================
        TOP BAR
======================================= */}

<div className="om-top">

<h2>

Orders Management

</h2>

<div className="om-top-actions">

<button

className="om-refresh-btn"

onClick={refreshOrders}

>

<MdRefresh />

Refresh

</button>

<button

className="om-excel-btn"

onClick={exportExcel}

>

<FaFileExcel />

Export Excel

</button>

<button

className="om-pdf-btn"

onClick={exportPDF}

>

<FaFilePdf />

Export PDF

</button>

</div>

</div>
<div className="om-cards">

{/* <div className="om-card">

<FaShoppingBag className="om-card-icon"/>

<h3>
Today's Orders
</h3>

<h1>

{stats.todayOrders|| 0}

</h1>

</div> */}

<div className="om-card">

<FaTruck className="om-card-icon"/>

<h3>

Pending

</h3>

<h1>

{stats.pendingOrders || 0}

</h1>

</div>
<div className="om-card">

<FaCheckCircle className="om-card-icon"/>

<h3>

Confirmed

</h3>

<h1>

{stats.confirmedOrders|| 0}

</h1>

</div>


<div className="om-card">

<FaCheckCircle className="om-card-icon"/>

<h3>

Delivered

</h3>

<h1>

{stats.deliveredOrders || 0}

</h1>
</div>

<div className="om-card">
<FaTimesCircle className="om-card-icon"/>
<h3>
Cancelled
</h3>
<h1>
{stats.cancelledOrders || 0}
</h1>
</div>

<div className="om-card">
<FaMoneyBillWave className="om-card-icon"/>
<h3>
Revenue
</h3>
<h1>
₹{Number(stats.revenue || 0).toLocaleString("en-IN")}
</h1>
</div>
</div>

<div className="om-toolbar">
<div className="om-search">
<FaSearch/>
<input
type="text"
placeholder="Search Order ID..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>
</div>

<select
value={status}

onChange={(e)=>setStatus(e.target.value)}

>

<option value="">

All Status

</option>

<option>

🟠 Pending

</option>

<option>

Confirmed

</option>

<option>
🟣 Packed
</option>

<option>

🔵 Shipped

</option>

<option>

🟢 Delivered

</option>

<option>

🔴 Cancelled

</option>

</select>

<select

value={paymentStatus}

onChange={(e)=>setPaymentStatus(e.target.value)}

>

<option value="">

Payment Status

</option>

<option>

🟡 Pending
</option>

<option>

🟢 Paid

</option>

<option>

🔵 Refunded

</option>

</select>

<select

value={paymentMethod}

onChange={(e)=>setPaymentMethod(e.target.value)}

>

<option value="">

Payment Method

</option>

<option>

COD

</option>

<option>

UPI

</option>

<option>

Credit Card

</option>

<option>

Debit Card

</option>

<option>

Net Banking

</option>

</select>

</div>
{/* =======================================
        ORDERS TABLE
======================================= */}

<div className="om-table-wrapper">

<table className="om-table">

<thead>
<tr>
<th>Order ID</th>
    <th>Customer</th>
    <th>Product Details</th>
    <th>Product Amount</th>
    <th>Shipping</th>
    <th>Handling</th>
    <th>Delivery</th>
    <th>Total Paid</th>
    <th>Payment Status</th>
    <th>Date</th>
    <th>Delivery Status</th>
</tr>
</thead>

<tbody>

{loading ? (

<tr>

<td
colSpan="11"
className="om-loading"
>

<div className="om-loader"></div>

<p>

Loading Orders...

</p>

</td>

</tr>

) : orders.length===0 ? (

<tr>

<td
colSpan="8"
className="om-loading"
>

No Orders Found
Try changing filters
</td>

</tr>

) : (

orders.map((order)=>(

<tr key={order._id}>

{/* ======================
      ORDER
====================== */}

<td>

<div className="om-order-info">

<h4>

{order.orderNumber}

</h4>

<span>

{order.totalProducts} Products

</span>

</div>

</td>

{/* ======================
      CUSTOMER
====================== */}

<td>

<div className="om-customer">

<h4>

{order.customerName}

</h4>

<span>

{order.customerPhone}

</span>

</div>

</td>

{/* ======================
      ITEMS
====================== */}
<td>
  {order.items?.length > 0 && (
    <div className="om-product-cell">

      {order.items[0].productImage && (
        <img
          src={order.items[0].productImage}
          alt=""
          className="om-table-product-img"
        />
      )}

      <div className="om-product-info">

        <h5>{order.items[0].productName}</h5>

        <span className="om-product-qty">
          Qty : {order.items[0].quantity}
        </span>
  <br />
        <span className="om-product-id">
          ID : {order.items[0].product}
        </span>

        {order.items.length > 1 && (
          <p>+{order.items.length - 1} More</p>
        )}

      </div>

    </div>
  )}
</td>

{/* ======================
      AMOUNT
====================== */}

<td>

<div className="om-sub-price">

Subtotal :

₹

{order.subtotal}

</div>

</td>
{/* delievry charges */}
<td>

₹{order.deliveryCharge || 0}

</td>

<td>

₹{order.handlingCharge || 0}

</td>
<td>

₹{order.deliveryCharge || 0}

</td>
<td>

<strong>

₹{order.grandTotal}

</strong>

</td>

{/* ======================
      PAYMENT
====================== */}
<td>

<div>

{order.paymentMethod}

</div>

<div

className={`

om-payment-status

${order.paymentStatus?.toLowerCase()}

`}

>

{order.paymentStatus}

</div>

</td>

{/* ======================
      DATE
====================== */}

<td>

<div className="om-date">
{
new Date(order.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})
}
</div>

</td>

{/* ======================
      STATUS
====================== */}
<td>

<select

className="om-status-select"

value={order.orderStatus}

onChange={(e)=>{

updateOrderStatus(
order._id,
e.target.value
);
}}
>

<option>Pending</option>

<option>Confirmed</option>

<option>Accepted</option>

<option>Packed</option>

<option>Shipped</option>

<option>Out For Delivery</option>

<option>Delivered</option>

<option>Cancelled</option>

<option>Return Requested</option>

<option>Returned</option>

<option>Refunded</option>

</select>

</td>


</tr>

))

)}

</tbody>

</table>

</div>

{/* =======================================
        PAGINATION
======================================= */}

<div className="om-pagination">

<button

disabled={page===1}

onClick={()=>setPage(page-1)}

>

Previous

</button>

<span>

Page

{page}

of

{totalPages}

</span>

<button

disabled={page===totalPages}

onClick={()=>setPage(page+1)}

>

Next

</button>

</div>
{/* =======================================
        ORDER DETAILS DRAWER
======================================= */}

{drawerOpen && (

<div className="om-drawer-overlay">

<div className="om-drawer">

{/* ===========================
        HEADER
=========================== */}

<div className="om-drawer-header">

<div>

<h2>

Order Details

</h2>

<p>

{selectedOrder?.orderNumber}

</p>

</div>

<button

className="om-drawer-close"

onClick={() => {

setDrawerOpen(false);

setSelectedOrder(null);

}}

>

✕

</button>

</div>

{/* ===========================
        LOADING
=========================== */}

{!selectedOrder ? (

<div className="om-drawer-loading">

Loading...

</div>

) : (

<>

{/* ===========================
        CUSTOMER
=========================== */}

<div className="om-section">

<h3>

Customer Information

</h3>

<div className="om-grid">

<div>

<label>

Customer Name

</label>

<p>

{selectedOrder.customer?.name ||

selectedOrder.customerName ||

"-"}

</p>

</div>

<div>

<label>

Phone

</label>

<p>

{selectedOrder.customer?.phone ||

selectedOrder.customerPhone ||

"-"}

</p>

</div>

<div>

<label>

Email

</label>

<p>

{selectedOrder.customer?.email ||

"-"}

</p>

</div>

<div>

<label>

Customer ID

</label>

<p>

{selectedOrder.customer?.id ||

"-"}

</p>

</div>

</div>

</div>

{/* ===========================
        DELIVERY ADDRESS
=========================== */}

<div className="om-section">

<h3>

Delivery Address

</h3>

<div className="om-grid">

<div>

<label>

Receiver

</label>

<p>

{selectedOrder.deliveryAddress?.fullName ||

"-"}

</p>

</div>

<div>

<label>

Phone

</label>

<p>

{selectedOrder.deliveryAddress?.phone ||

"-"}

</p>

</div>

<div className="om-full-width">

<label>

Address

</label>

<p>

{selectedOrder.deliveryAddress?.addressLine1}

{" "}

{selectedOrder.deliveryAddress?.addressLine2}

</p>

</div>

<div>

<label>

Landmark

</label>

<p>

{selectedOrder.deliveryAddress?.landmark ||

"-"}

</p>

</div>

<div>

<label>

City

</label>

<p>

{selectedOrder.deliveryAddress?.city ||

"-"}

</p>

</div>

<div>

<label>

State

</label>

<p>

{selectedOrder.deliveryAddress?.state ||

"-"}

</p>

</div>

<div>

<label>

Pincode

</label>

<p>

{selectedOrder.deliveryAddress?.pincode ||

"-"}

</p>

</div>

<div>

<label>

Country

</label>

<p>

{selectedOrder.deliveryAddress?.country ||

"India"}

</p>

</div>

</div>

</div>
{/* ===========================
        ORDER ITEMS
=========================== */}

<div className="om-section">

<h3>

Ordered Products

</h3>

<div className="om-products">

{selectedOrder.items?.map((item,index)=>(

<div
className="om-product-card"
key={index}
>

<div className="om-product-image">

<img
loading="lazy"
src={

item.productImage ||

item.product?.thumbnail ||

item.product?.images?.[0]

}

alt={item.productName}

/>

</div>

<div className="om-product-details">

<h4>

{item.productName}

</h4>

<p>

SKU :

{item.sku || "-"}

</p>

<p>

Unit :

{item.unit || "-"}

</p>

<p>

Qty :

{item.quantity}

</p>

</div>

<div className="om-product-price">

<h4>

₹{item.subtotal}

</h4>

<p>

₹{item.price}

×

{item.quantity}

</p>

</div>

</div>

))}

</div>

</div>

{/* ===========================
        PRICE BREAKDOWN
=========================== */}

<div className="om-section">

<h3>

Payment Summary

</h3>

<div className="om-summary">

<div className="om-summary-row">

<span>

Subtotal

</span>

<span>

₹{Number(selectedOrder.pricing?.subtotal || 0).toLocaleString("en-IN")}
</span>

</div>

<div className="om-summary-row">

<span>

Discount

</span>

<span>

- ₹{selectedOrder.pricing?.discount || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Coupon Discount

</span>

<span>

- ₹{selectedOrder.pricing?.couponDiscount || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Platform Fee

</span>

<span>

₹{selectedOrder.pricing?.platformFee || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Handling Charge

</span>

<span>

₹{selectedOrder.pricing?.handlingCharge || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Packing Charge

</span>

<span>

₹{selectedOrder.pricing?.packingCharge || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Delivery Charge

</span>

<span>

₹{selectedOrder.pricing?.deliveryCharge || 0}

</span>

</div>

<div className="om-summary-row">

<span>

Tax

</span>

<span>

₹{selectedOrder.pricing?.tax || 0}

</span>

</div>

<div className="om-summary-divider"></div>

<div className="om-summary-row om-summary-total">

<span>

Grand Total

</span>

<span>

₹{selectedOrder.pricing?.grandTotal || 0}

</span>

</div>

</div>

</div>
{/* ===========================
        PAYMENT DETAILS
=========================== */}

<div className="om-section">

<h3>

Payment Details

</h3>

<div className="om-grid">

<div>

<label>

Payment Method

</label>

<p>

{selectedOrder.paymentMethod || "-"}

</p>

</div>

<div>

<label>

Payment Status

</label>

<p>

{selectedOrder.paymentStatus || "-"}

</p>

</div>

<div>

<label>

Razorpay Order ID

</label>

<p>

{selectedOrder.razorpayOrderId || "-"}

</p>

</div>

<div>

<label>

Razorpay Payment ID

</label>

<p>

{selectedOrder.razorpayPaymentId || "-"}

</p>

</div>

</div>

</div>

{/* ===========================
        TRACKING DETAILS
=========================== */}

<div className="om-section">

<h3>

Tracking Details

</h3>

<div className="om-grid">

<div>

<label>

Delivery Partner

</label>

<p>

{selectedOrder.tracking?.deliveryPartner || "-"}

</p>

</div>

<div>

<label>

Tracking ID

</label>

<p>

{selectedOrder.tracking?.trackingId || "-"}

</p>

</div>

<div className="om-full-width">

<label>

Tracking URL

</label>

<p>

{selectedOrder.tracking?.trackingUrl || "-"}

</p>

</div>

<div>

<label>

Estimated Delivery

</label>

<p>

{

selectedOrder.tracking?.estimatedDeliveryDate

?

new Date(

selectedOrder.tracking.estimatedDeliveryDate

).toLocaleDateString()

:

"-"

}

</p>

</div>

<div>

<label>

Delivered At

</label>

<p>

{

selectedOrder.tracking?.deliveredAt

?

new Date(

selectedOrder.tracking.deliveredAt

).toLocaleDateString()

:

"-"

}

</p>

</div>

</div>

</div>

{/* ===========================
        STATUS TIMELINE
=========================== */}

<div className="om-section">

<h3>

Order Timeline

</h3>

<div className="om-timeline">

{

selectedOrder.statusHistory?.length>0

?

selectedOrder.statusHistory.map(

(step,index)=>(

<div

className="om-timeline-item"

key={index}

>

<div className="om-timeline-dot"></div>

<div className="om-timeline-content">

<h4>

{step.status}

</h4>

<p>

{step.note || ""}

</p>

<span>

{

new Date(

step.updatedAt

).toLocaleString()

}

</span>

</div>

</div>

)

)

:

<p>

No Status Updates Yet
</p>

}

</div>

</div>

{/* ===========================
        REMARKS
=========================== */}

<div className="om-section">

<h3>

Remarks

</h3>

<div className="om-grid">

<div className="om-full-width">

<label>

Admin Remark

</label>

<p>

{selectedOrder.adminRemark || "-"}

</p>

</div>

<div className="om-full-width">

<label>

Customer Remark

</label>

<p>

{selectedOrder.customerRemark || "-"}

</p>

</div>

</div>

</div>

{/* ===========================
        FOOTER
=========================== */}

<div className="om-drawer-footer">

<button

className="om-edit-btn"

onClick={()=>

setStatusModal(true)

}

>

Update Order

</button>

<button

className="om-close-btn"

onClick={()=>{

setDrawerOpen(false);

setSelectedOrder(null);

}}

>

Close

</button>

</div>

</>

)}

</div>

</div>

)}
{statusModal && (

<div className="om-modal-overlay">

<div className="om-status-modal">

<h2>

Update Order

</h2>

<div className="om-modal-grid">

<div>

<label>

Order Status

</label>

<select

value={updateData.orderStatus}

onChange={(e)=>

setUpdateData({

...updateData,

orderStatus:e.target.value

})

}

>

<option>Pending</option>

<option>Confirmed</option>

<option>Accepted</option>

<option>Packed</option>

<option>Shipped</option>

<option>Out For Delivery</option>

<option>Delivered</option>

<option>Cancelled</option>

<option>Return Requested</option>

<option>Returned</option>

<option>Refunded</option>

</select>

</div>

<div>

<label>

Payment Status

</label>

<select

value={updateData.paymentStatus}

onChange={(e)=>

setUpdateData({

...updateData,

paymentStatus:e.target.value

})

}

>

<option>Pending</option>

<option>Paid</option>

<option>Failed</option>

<option>Refunded</option>

<option>Partially Refunded</option>

</select>

</div>

<div>

<label>

Delivery Partner

</label>

<input

value={updateData.deliveryPartner}

onChange={(e)=>

setUpdateData({

...updateData,

deliveryPartner:e.target.value

})

}

/>

</div>

<div>

<label>

Tracking ID

</label>

<input

value={updateData.trackingId}

onChange={(e)=>

setUpdateData({

...updateData,

trackingId:e.target.value

})

}

/>

</div>

<div className="om-full-width">

<label>

Tracking URL

</label>

<input

value={updateData.trackingUrl}

onChange={(e)=>

setUpdateData({

...updateData,

trackingUrl:e.target.value

})

}

/>

</div>

<div className="om-full-width">

<label>

Admin Remark

</label>

<textarea

rows="4"

value={updateData.adminRemark}

onChange={(e)=>

setUpdateData({

...updateData,

adminRemark:e.target.value

})

}

/>

</div>

</div>

<div className="om-modal-footer">

<button

className="om-save-btn"

onClick={updateOrder}

>

{

saving

?

"Updating..."

:

"Save Changes"

}

</button>

<button

className="om-cancel-btn"

onClick={()=>

setStatusModal(false)

}

>

Cancel

</button>

</div>

</div>

</div>

)}
        </div>
    );
}

export default OrderManagement;