import "./OrderDetails.css";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  IoArrowBack,
  IoLocationOutline,
  IoCardOutline,
  IoCubeOutline,
} from "react-icons/io5";

import { getOrderDetails } from "../../services/orderApi";

export default function OrderDetails() {

  const navigate = useNavigate();

  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);

  const [payment, setPayment] = useState(null);

  useEffect(() => {

    fetchOrder();

  }, [orderId]);

  const fetchOrder = async () => {

    try {

      const res = await getOrderDetails(orderId);

      console.log(res.data);

      setOrder(res.data.order);

      setPayment(res.data.payment);

    }

    catch (err) {

      console.log(err.response?.data || err);

    }

    finally {

      setLoading(false);

    }

  };
const downloadInvoice = () => {

const pdf = new jsPDF();

const green="#1B5E20";
const gray="#666";

pdf.setFillColor(27,94,32);
pdf.rect(0,0,210,28,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(24);
pdf.text("NexttGrains",15,18);

pdf.setFontSize(12);
pdf.text("INVOICE",165,18);

pdf.setTextColor(0);

pdf.setFontSize(11);

pdf.text(`Invoice No : ${order.orderNumber}`,15,40);

pdf.text(
`Order Date : ${new Date(order.createdAt).toLocaleDateString()}`,
15,
47
);

pdf.text(
`Payment : ${payment?.paymentMethod || order.paymentMethod}`,
130,
40
);

pdf.text(
`Status : ${payment?.paymentStatus || order.paymentStatus}`,
130,
47
);

pdf.setFontSize(14);

pdf.setTextColor(green);

pdf.text("Bill To",15,62);

pdf.setTextColor(0);

pdf.setFontSize(11);

let y=70;

pdf.text(order.address.fullName,15,y);

y+=7;

pdf.text(`+91 ${order.address.mobile}`,15,y);

y+=7;

pdf.text(`House : ${order.address.houseNo}`,15,y);

y+=7;

pdf.text(`Area : ${order.address.area}`,15,y);

y+=7;

if(order.address.landmark){

pdf.text(
`Landmark : ${order.address.landmark}`,
15,
y
);

y+=7;

}

pdf.text(

`${order.address.city}, ${order.address.state} - ${order.address.pincode}`,

15,

y

);

y+=15;

pdf.setFillColor(235,240,235);

pdf.rect(15,y,180,10,"F");

pdf.setFont(undefined,"bold");

pdf.text("Product",18,y+7);

pdf.text("Qty",120,y+7);

pdf.text("Price",145,y+7);

pdf.text("Total",175,y+7);

pdf.setFont(undefined,"normal");

y+=18;

order.items.forEach(item=>{

pdf.text(item.productName,18,y);

pdf.text(String(item.quantity),123,y);

pdf.text(`Rs ${item.price}`,145,y);

pdf.text(`Rs ${item.subtotal}`,175,y);

y+=10;

});

y+=8;

pdf.line(120,y,195,y);

y+=10;

pdf.setFont(undefined,"bold");

pdf.text(`Subtotal`,125,y);

pdf.text(`Rs ${order.subtotal}`,175,y);

y+=8;

pdf.text(`Delivery`,125,y);

pdf.text(`Rs ${order.deliveryCharge}`,175,y);

y+=8;

pdf.text(`Discount`,125,y);

pdf.text(`Rs ${order.discount}`,175,y);

y+=10;

pdf.setDrawColor(0);

pdf.line(120,y,195,y);

y+=10;

pdf.setTextColor(green);

pdf.setFontSize(15);

pdf.text(`Grand Total`,125,y);

pdf.text(`Rs ${order.grandTotal}`,175,y);

y+=18;

pdf.setTextColor(gray);

pdf.setFontSize(10);

pdf.text(

"Thank you for shopping with NexttGrains.",

15,

285

);

pdf.save(`Invoice-${order.orderNumber}.pdf`);

};
  if (loading) {

    return (

      <div className="ngOrderDetails_loading">

        Loading...

      </div>

    );

  }

  if (!order) {

    return (

      <div className="ngOrderDetails_loading">

        Order not found

      </div>

    );

  }

  return (

<div className="ngOrderDetails_page">

<div className="ngOrderDetails_container">

<div className="ngOrderDetails_topBar">

<button
className="ngOrderDetails_backBtn"
onClick={()=>navigate(-1)}
>
<IoArrowBack/>
Back
</button>

<button
className="ngInvoiceBtn"
onClick={downloadInvoice}
>
Download Invoice
</button>
</div>

<div className="ngOrderDetails_header">

<div>

<h1>

Order Details

</h1>

<p>

Order ID :

<strong>

{order.orderNumber}

</strong>

</p>

<p>

Placed on

{" "}

{new Date(order.createdAt).toLocaleDateString()}

</p>

</div>

<span
className={`ngOrderDetails_status ${order.orderStatus.replaceAll(" ","")}`}
>

{order.orderStatus}

</span>

</div>

<div className="ngOrderDetails_body">

<div className="ngOrderDetails_left">

<div className="ngOrderDetails_card">

<h2>

<IoCubeOutline/>

Products

</h2>

{

order.items.map((item,index)=>(

<div
className="ngOrderDetails_product"
key={index}
>

<img
src={
item.productImage ||
item.product?.thumbnail ||
item.product?.images?.[0]
}
alt={item.productName}
/>

<div>

<h3>

{item.productName}

</h3>

<p>

{
item.productDescription ||
item.product?.shortDescription
}

</p>

<h4>

₹{item.price}

</h4>

<p>

Qty : {item.quantity}

</p>

</div>

<div>

₹{item.subtotal}

</div>

</div>

))

}

</div>

<div className="ngOrderDetails_card">

<h2>

<IoLocationOutline/>

Delivery Address

</h2>

<p>
<strong>{order.address?.fullName}</strong>
</p>

<p>
+91 {order.address?.mobile}
</p>

<p>
House No : {order.address?.houseNo}
</p>

{
order.address?.floor && (
<p>
Floor : {order.address.floor}
</p>
)
}

<p>
Area : {order.address?.area}
</p>

{
order.address?.landmark && (
<p>
Landmark : {order.address.landmark}
</p>
)
}

<p>
{order.address?.city},
{" "}
{order.address?.state}
-
{order.address?.pincode}
</p>

</div>

</div>

<div className="ngOrderDetails_right">

<div className="ngOrderDetails_card">

<h2>

<IoCardOutline/>

Payment

</h2>

<div className="ngOrderDetails_row">

<span>

Payment Method

</span>

<strong>

{payment?.paymentMethod || order.paymentMethod}

</strong>

</div>

<div className="ngOrderDetails_row">

<span>

Payment Status

</span>

<strong>

{payment?.paymentStatus || order.paymentStatus}

</strong>

</div>

<div className="ngOrderDetails_row">

<span>

Transaction ID

</span>

<strong>

{payment?.razorpayPaymentId || "-"}

</strong>

</div>

</div>

<div className="ngOrderDetails_card">

<h2>

Price Details

</h2>

<div className="ngOrderDetails_row">

<span>

Subtotal

</span>

<strong>

₹{order.subtotal}

</strong>

</div>

<div className="ngOrderDetails_row">

<span>

Delivery Charge

</span>

<strong>

₹{order.deliveryCharge}

</strong>

</div>

<div className="ngOrderDetails_row">

<span>

Discount

</span>

<strong>

- ₹{order.discount}

</strong>

</div>

<hr/>

<div className="ngOrderDetails_row">

<b>

Grand Total

</b>

<b>

₹{order.grandTotal}

</b>

</div>
</div>

</div>

</div>

</div>

</div>

);

}