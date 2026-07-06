import "./Orders.css";
import OrderDetails from "./OrderDetails";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  IoSearchOutline,
  IoBagHandleOutline,
  IoChevronForward,
} from "react-icons/io5";

import { getMyOrders } from "../../services/orderApi";

export default function Orders() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {

    fetchOrders();

  }, []);

const fetchOrders = async () => {

    try {

        console.log("User:", user);

        console.log("UserId:", userId);

        const res = await getMyOrders(userId);

        console.log("Orders:", res.data);
        console.log(res.data.orders[0]);
        console.log("ITEM =>", res.data.orders[0].items[0]);
console.log("IMAGE =>", res.data.orders[0].items[0].productImage);
console.log("PRODUCT =>", res.data.orders[0].items[0].product);
console.log(
  "FIRST ITEM FULL DATA",
  JSON.stringify(res.data.orders[0].items[0], null, 2)
);

console.log(
  "FIRST ORDER FULL DATA",
  JSON.stringify(res.data.orders[0], null, 2)
);
        setOrders(res.data.orders || []);

    }

    catch (err) {

        console.log(err.response?.data || err);

    }

    finally {

        setLoading(false);

    }

};
  const filteredOrders = useMemo(() => {

    let data = [...orders];

    if (status !== "All") {

        data = data.filter(
            (item) => item.orderStatus === status
        );

    }

    if (search.trim()) {

        const value = search.toLowerCase();

        data = data.filter((item) =>

            item.orderNumber
                .toLowerCase()
                .includes(value)

        );

    }

    if (sortBy === "Newest") {

        data.sort(

            (a, b) =>

                new Date(b.createdAt) -

                new Date(a.createdAt)

        );

    }

    else {

        data.sort(

            (a, b) =>

                new Date(a.createdAt) -

                new Date(b.createdAt)

        );

    }

    return data;

}, [orders, search, status, sortBy]);
if (loading) {

    return (

        <div className="ngOrders_loading">

            Loading Orders...

        </div>

    );

}
return (

<div className="ngOrders_page">

<div className="ngOrders_container">

<h1>

My Orders

</h1>

<p>

Track, manage and review all your purchases.

</p>
<div className="ngOrders_top">

<div className="ngOrders_search">

<IoSearchOutline />

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

<option>All</option>

<option>Pending</option>

<option>Confirmed</option>

<option>Accepted</option>

<option>Packed</option>

<option>Shipped</option>

<option>Out For Delivery</option>

<option>Delivered</option>

<option>Cancelled</option>

</select>

<select

value={sortBy}

onChange={(e)=>setSortBy(e.target.value)}

>

<option>Newest</option>

<option>Oldest</option>

</select>

</div>
{

filteredOrders.length===0 && (

<div className="ngOrders_empty">

<h2>

No Orders Found

</h2>

<p>

Looks like you haven't placed any order yet.

</p>

</div>

)

}
<div className="ngOrders_list">

{

filteredOrders.flatMap((order)=>

order.items.map((item,index)=>(
<div className="ngOrders_card" key={`${order._id}-${index}`}>

    <div className="ngOrders_cardTop">

        <div className="ngOrders_orderInfo">

            <div className="ngOrders_imageBox">

<img
  src={
    item.productImage ||
    item.image ||
    item.product?.thumbnail ||
    item.product?.images?.[0] ||
    "/images/no-image.png"
  }
  alt={item.productName}
/>
            </div>

            <div className="ngOrders_info">

<h3 className="ngOrders_productTitle">
    {
item.productName ||
item.name ||
item.product?.name
}
</h3>

<p className="ngOrders_shortDesc">
{
    item.product?.shortDescription ||
    item.product?.description ||
    item.productDescription ||
    "No description available"
}
</p>

<div className="ngOrders_priceRow">

    <span className="ngOrders_price">

        ₹{item.price}

    </span>

    <span className="ngOrders_qty">

        Qty : {item.quantity}

    </span>

</div>

<div className="ngOrders_meta">

    <span>

        Order ID :
        <strong>
            {order.orderNumber}
        </strong>

    </span>

  

</div>
<div className="ngOrders_payment">
  <span>
        Order Date : 
        {new Date(order.createdAt).toLocaleDateString()}

    </span>
    </div>
<div className="ngOrders_payment">

    Payment :
    <strong>
        {order.paymentMethod}
    </strong>

</div>

                {/* {
                    order.items.length > 1 &&

                    <span className="ngOrders_moreItems">

                        + {order.items.length - 1} more item(s)

                    </span>

                } */}


            </div>

        </div>

        <div className="ngOrders_priceBox">

            <span
                className={`ngOrders_status ${order.orderStatus.replaceAll(" ", "")}`}
            >
                {order.orderStatus}
            </span>

<div className="ngOrders_total">

    ₹{order.grandTotal}

</div>

<div className="ngOrders_totalLabel">

    Total Paid

</div>

        </div>

    </div>

    <div className="ngOrders_cardBottom">
<button
    className="ngOrders_outlineBtn"
    onClick={() => navigate(`/orders/${order._id}`)}
>
    View Details
    <IoChevronForward />
</button>

        {
            order.orderStatus !== "Cancelled" &&
            order.orderStatus !== "Delivered" &&

            <button
                className="ngOrders_trackBtn"
            >

                <IoBagHandleOutline />

                Track Order

            </button>

        }

    </div>

</div>

)))

}

</div>
</div>

</div>
);
}