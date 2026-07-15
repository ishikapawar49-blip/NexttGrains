import "./Order.css";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Package,
  Search,
  RefreshCcw,
  Eye,
  Calendar,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock3,
  CreditCard,
  User,
  Loader2,
  X,
Info,
} from "lucide-react";

/* ==========================================================
   API
========================================================== */

const API = "http://localhost:5000/api/orders";

function Order() {
  /* ==========================================================
      AUTH
  ========================================================== */

  const token = localStorage.getItem("vendorToken");

  const vendor = JSON.parse(localStorage.getItem("vendor"));

  const vendorId = vendor?._id;

  /* ==========================================================
      STATES
  ========================================================== */

  const [venOrderpageOrders, setVenOrderpageOrders] = useState([]);

  const [venOrderpageFilteredOrders, setVenOrderpageFilteredOrders] =
    useState([]);

  const [venOrderpageLoading, setVenOrderpageLoading] = useState(true);

  const [venOrderpageRefreshing, setVenOrderpageRefreshing] =
    useState(false);

  const [venOrderpageSearch, setVenOrderpageSearch] = useState("");

  const [venOrderpagePaymentFilter, setVenOrderpagePaymentFilter] =
    useState("");

  const [venOrderpageDeliveryFilter, setVenOrderpageDeliveryFilter] =
    useState("");

  const [venOrderpageSelectedOrder, setVenOrderpageSelectedOrder] =
    useState(null);

  /* ==========================================================
      FETCH ORDERS
  ========================================================== */

  const fetchOrders = async () => {
    try {
      setVenOrderpageLoading(true);

      const res = await axios.get(
        `${API}/vendor/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVenOrderpageOrders(res.data.orders || []);

      setVenOrderpageFilteredOrders(
        res.data.orders || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setVenOrderpageLoading(false);
    }
  };

  /* ==========================================================
      REFRESH
  ========================================================== */

  const refreshOrders = async () => {
    try {
      setVenOrderpageRefreshing(true);

      await fetchOrders();
    } finally {
      setVenOrderpageRefreshing(false);
    }
  };

  /* ==========================================================
      FILTERS
  ========================================================== */

  useEffect(() => {
    let data = [...venOrderpageOrders];

    /* ---------------- SEARCH ---------------- */

    if (venOrderpageSearch.trim()) {
      const search =
        venOrderpageSearch.toLowerCase();

      data = data.filter((order) => {
        const productNames =
          order.items
            ?.map((item) =>
              item.productName.toLowerCase()
            )
            .join(" ") || "";

        return (
          order.orderNumber
            ?.toLowerCase()
            .includes(search) ||
          order.customerName
            ?.toLowerCase()
            .includes(search) ||
          productNames.includes(search)
        );
      });
    }

    /* ---------------- PAYMENT ---------------- */

    if (venOrderpagePaymentFilter) {
      data = data.filter(
        (order) =>
          order.paymentStatus ===
          venOrderpagePaymentFilter
      );
    }

    /* ---------------- DELIVERY ---------------- */

    if (venOrderpageDeliveryFilter) {
      data = data.filter(
        (order) =>
          order.deliveryStatus ===
          venOrderpageDeliveryFilter
      );
    }

    setVenOrderpageFilteredOrders(data);
  }, [
    venOrderpageOrders,
    venOrderpageSearch,
    venOrderpagePaymentFilter,
    venOrderpageDeliveryFilter,
  ]);

  /* ==========================================================
      SUMMARY CARDS
  ========================================================== */

  const venOrderpageStats = useMemo(() => {
    return {
      total:
        venOrderpageOrders.length,

      pending:
        venOrderpageOrders.filter(
          (o) =>
            o.deliveryStatus ===
            "Pending"
        ).length,

      shipped:
        venOrderpageOrders.filter(
          (o) =>
            o.deliveryStatus ===
            "Shipped"
        ).length,

      delivered:
        venOrderpageOrders.filter(
          (o) =>
            o.deliveryStatus ===
            "Delivered"
        ).length,
    };
  }, [venOrderpageOrders]);

  /* ==========================================================
      STATUS COLORS
  ========================================================== */

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "paid";

      case "Pending":
        return "pending";

      case "Failed":
        return "failed";

      case "Refunded":
        return "refunded";

      default:
        return "pending";
    }
  };

  const getDeliveryClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Packed":
        return "packed";

      case "Confirmed":
        return "confirmed";

      case "Cancelled":
        return "cancelled";

      case "Pending":
        return "pending";

      default:
        return "pending";
    }
  };

  /* ==========================================================
      INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    if (vendorId) {
      fetchOrders();
    }
  }, [vendorId]);

  return (
    <>
      {/* =============================
          PART 2
      ============================== */}
      <>
  {/* ==========================================================
      HEADER
  ========================================================== */}

  <div className="ven-orderpage-container">

    <div className="ven-orderpage-header">

      <div className="ven-orderpage-header-left">

        <h1>Orders</h1>

        <p>
          View orders received for your products.
        </p>

      </div>

      <button
        className="ven-orderpage-refresh-btn"
        onClick={refreshOrders}
        disabled={venOrderpageRefreshing}
      >

        {
          venOrderpageRefreshing
          ?

          <Loader2
            size={18}
            className="ven-orderpage-spin"
          />

          :

          <RefreshCcw size={18} />

        }

        Refresh

      </button>

    </div>


    {/* ==========================================================
        SUMMARY
    ========================================================== */}

    <div className="ven-orderpage-summary-grid">

      <div className="ven-orderpage-summary-card">

        <div className="ven-orderpage-summary-icon total">

          <ShoppingBag size={22} />

        </div>

        <div>

          <span>Total Orders</span>

          <h2>

            {venOrderpageStats.total}

          </h2>

        </div>

      </div>


      <div className="ven-orderpage-summary-card">

        <div className="ven-orderpage-summary-icon pending">

          <Clock3 size={22} />

        </div>

        <div>

          <span>Pending</span>

          <h2>

            {venOrderpageStats.pending}

          </h2>

        </div>

      </div>


      <div className="ven-orderpage-summary-card">

        <div className="ven-orderpage-summary-icon shipped">

          <Truck size={22} />

        </div>

        <div>

          <span>Shipped</span>

          <h2>

            {venOrderpageStats.shipped}

          </h2>

        </div>

      </div>


      <div className="ven-orderpage-summary-card">

        <div className="ven-orderpage-summary-icon delivered">

          <CheckCircle2 size={22} />

        </div>

        <div>

          <span>Delivered</span>

          <h2>

            {venOrderpageStats.delivered}

          </h2>

        </div>

      </div>

    </div>


    {/* ==========================================================
        FILTER BAR
    ========================================================== */}

    <div className="ven-orderpage-toolbar">


      {/* Search */}

      <div className="ven-orderpage-search-box">

        <Search
          size={18}
          className="ven-orderpage-search-icon"
        />

        <input

          type="text"

          placeholder="Search Order ID, Customer or Product..."

          value={venOrderpageSearch}

          onChange={(e)=>setVenOrderpageSearch(e.target.value)}

        />

      </div>


      {/* Payment */}

      <select

        className="ven-orderpage-select"

        value={venOrderpagePaymentFilter}

        onChange={(e)=>

          setVenOrderpagePaymentFilter(

            e.target.value

          )

        }

      >

        <option value="">

          All Payments

        </option>

        <option value="Pending">

          Pending

        </option>

        <option value="Paid">

          Paid

        </option>

        <option value="Failed">

          Failed

        </option>

        <option value="Refunded">

          Refunded

        </option>

      </select>


      {/* Delivery */}

      <select

        className="ven-orderpage-select"

        value={venOrderpageDeliveryFilter}

        onChange={(e)=>

          setVenOrderpageDeliveryFilter(

            e.target.value

          )

        }

      >

        <option value="">

          All Delivery Status

        </option>

        <option value="Pending">

          Pending

        </option>

        <option value="Confirmed">

          Confirmed

        </option>

        <option value="Accepted">

          Accepted

        </option>

        <option value="Packed">

          Packed

        </option>

        <option value="Shipped">

          Shipped

        </option>

        <option value="Out For Delivery">

          Out For Delivery

        </option>

        <option value="Delivered">

          Delivered

        </option>

        <option value="Cancelled">

          Cancelled

        </option>

      </select>

    </div>



    {/* ==========================================================
        TABLE STARTS IN PART 3
    ========================================================== */}
{/* ==========================================================
    ORDERS TABLE
========================================================== */}

<div className="ven-orderpage-table-wrapper">

  {
    venOrderpageLoading

    ?

    <div className="ven-orderpage-loading">

      <Loader2
        size={42}
        className="ven-orderpage-spin"
      />

      <h3>Loading Orders...</h3>

    </div>

    :

    venOrderpageFilteredOrders.length===0

    ?

    <div className="ven-orderpage-empty">

      <Package size={55}/>

      <h3>No Orders Found</h3>

      <p>

        Orders received for your products will appear here.

      </p>

    </div>

    :

<table className="ven-orderpage-table">

<thead>

<tr>

<th>Product</th>

<th>Product ID</th>

<th>Order ID</th>

<th>Customer</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

<th>Payment</th>

<th>Delivery</th>

<th>Date</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

venOrderpageFilteredOrders.map((order)=>{

return order.items.map((item,index)=>(

<tr

key={`${order.orderId}-${index}`}

>

{/* PRODUCT */}

<td>

<div className="ven-orderpage-product">

<img

src={item.productImage}

alt={item.productName}

/>

<div>

<h4>

{item.productName}

</h4>



</div>

</div>

</td>

{/* PRODUCT ID */}

<td>

<span className="ven-orderpage-order-id">

{

String(item.productId)

.slice(-8)

.toUpperCase()

}

</span>

</td>

{/* ORDER ID */}

<td>

<span className="ven-orderpage-order-id">

{

order.orderNumber

}

</span>

</td>

{/* CUSTOMER */}

<td>

<div className="ven-orderpage-customer">

<User size={17}/>

<span>

{order.customerName}

</span>

</div>

</td>

{/* QUANTITY */}

<td>

<div className="ven-orderpage-qty">

{item.quantity}

{

item.unit

&&

` ${item.unit}`

}

</div>

</td>

{/* PRICE */}

<td>

₹

{

item.productPrice.toLocaleString()

}

</td>

{/* TOTAL */}

<td>

<strong>

₹

{

item.subtotal.toLocaleString()

}

</strong>

</td>

{/* PAYMENT */}

<td>

<span

className={`

ven-orderpage-payment-badge

${getPaymentClass(

order.paymentStatus

)}

`}

>

{

order.paymentStatus

}

</span>

</td>

{/* DELIVERY */}

<td>

<span

className={`

ven-orderpage-delivery-badge

${getDeliveryClass(

order.deliveryStatus

)}

`}

>

{

order.deliveryStatus

}

</span>

</td>

{/* DATE */}

<td>

<div className="ven-orderpage-date">

<Calendar size={15}/>

{

new Date(

order.orderDate

)

.toLocaleDateString(

"en-IN"

)

}

</div>

</td>

{/* ACTION */}

<td>

<button

className="ven-orderpage-view-btn"

onClick={()=>

setVenOrderpageSelectedOrder(

{

...order,

selectedItem:item

}

)

}

>

<Eye size={17}/>

View

</button>

</td>

</tr>

))

})

}

</tbody>

</table>

}

</div>

{/* ==========================================================
      VIEW ORDER MODAL
========================================================== */}

{
venOrderpageSelectedOrder && (

<div
className="ven-orderpage-modal-overlay"
onClick={()=>
setVenOrderpageSelectedOrder(null)
}
>

<div
className="ven-orderpage-modal"
onClick={(e)=>e.stopPropagation()}
>

<div className="ven-orderpage-modal-header">

<h2>

Order Details

</h2>

<button
className="ven-orderpage-close-btn"
onClick={()=>
setVenOrderpageSelectedOrder(null)
}
>

<X size={20}/>

</button>

</div>



<div className="ven-orderpage-modal-body">

{/* LEFT */}

<div className="ven-orderpage-modal-left">

<img

src={
venOrderpageSelectedOrder.selectedItem.productImage
}

alt="product"

/>

</div>



{/* RIGHT */}

<div className="ven-orderpage-modal-right">

<div className="ven-orderpage-detail-grid">

<div>

<label>

Product Name

</label>

<p>

{

venOrderpageSelectedOrder.selectedItem.productName

}

</p>

</div>

<div>

<label>

Product ID

</label>

<p>

{

venOrderpageSelectedOrder.selectedItem.productId

}

</p>

</div>

<div>

<label>

Order ID

</label>

<p>

{

venOrderpageSelectedOrder.orderNumber

}

</p>

</div>

<div>

<label>

Customer

</label>

<p>

{

venOrderpageSelectedOrder.customerName

}

</p>

</div>

<div>

<label>

Quantity

</label>

<p>

{

venOrderpageSelectedOrder.selectedItem.quantity

}

</p>

</div>

<div>

<label>

Selling Price

</label>

<p>

₹

{

venOrderpageSelectedOrder.selectedItem.productPrice

.toLocaleString()

}

</p>

</div>

<div>

<label>

Subtotal

</label>

<p>

₹

{

venOrderpageSelectedOrder.selectedItem.subtotal

.toLocaleString()

}

</p>

</div>

<div>

<label>

Payment Method

</label>

<p>

{

venOrderpageSelectedOrder.paymentMethod

}

</p>

</div>

<div>

<label>

Payment Status

</label>

<span

className={`

ven-orderpage-payment-badge

${getPaymentClass(

venOrderpageSelectedOrder.paymentStatus

)}

`}

>

{

venOrderpageSelectedOrder.paymentStatus

}

</span>

</div>

<div>

<label>

Delivery Status

</label>

<span

className={`

ven-orderpage-delivery-badge

${getDeliveryClass(

venOrderpageSelectedOrder.deliveryStatus

)}

`}

>

{

venOrderpageSelectedOrder.deliveryStatus

}

</span>

</div>

<div>

<label>

Order Date

</label>

<p>

{

new Date(

venOrderpageSelectedOrder.orderDate

).toLocaleString("en-IN")

}

</p>

</div>

</div>



<div className="ven-orderpage-note-box">

<Info size={18}/>

<div>

<h4>

Vendor Information

</h4>

<p>

Delivery Status is controlled by the Admin Panel.

Vendors can only view order information.

</p>

</div>

</div>

</div>

</div>

</div>

</div>

)
}
  </div>

</>
    </>
  );
}

export default Order;