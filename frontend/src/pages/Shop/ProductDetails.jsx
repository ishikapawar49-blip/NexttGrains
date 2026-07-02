import Cart from "./Cart";
import "./ProductDetails.css";
import { useCart } from "../../context/CartContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  Leaf,
} from "lucide-react";
import {
    MdOutlineLocalShipping,
    MdVerified,
    MdPayments,
} from "react-icons/md";
import {
    GiWheat,
} from "react-icons/gi";

function ProductDetails() {
  const { id } = useParams();
  const [cartOpen,setCartOpen]=useState(false);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const discount = (mrp, price) => {
  if (!mrp || !price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const getProduct = async () => {
console.log("Fetching Product", id);
    try {
        setLoading(true);
        const res = await axios.get(
            `http://localhost:5000/api/products/${id}`
        );
        console.log(res.data);
        setProduct(res.data.product);
        setSelectedImage(
            res.data.product.images?.[0] ||
            res.data.product.thumbnail
        );
        const related = await axios.get(
            `http://localhost:5000/api/products/recommended/${id}`
        );
        setRelatedProducts(related.data.products);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        setLoading(false);
    }
};

  useEffect(() => {
    getProduct();
}, [id]);

  // saara logic
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!product) {
    return <div>Not Found</div>;
  }


return (
<section className="ngpdPage">
<div className="ngpdWrapper">
{/* ================= BREADCRUMB ================= */}
<div className="ngpdBreadcrumb">

<span>Home</span>

<span>/</span>

<span>Shop</span>

<span>/</span>

<span>{product.name}</span>

</div>

{/* ================= HERO ================= */}

<div className="ngpdHero">

{/* ================= LEFT ================= */}

<div className="ngpdHeroLeft">

<div className="ngpdMainImage">

<img

src={selectedImage}

alt={product.name}

/>

</div>

<div className="ngpdThumbStrip">

{product.images?.map((img,index)=>(

<div

key={index}

className={`ngpdThumbItem ${selectedImage===img ? "active" : ""}`}

onClick={()=>setSelectedImage(img)}

>

<img

src={img}

alt="thumbnail"

/>

</div>

))}

</div>

</div>

{/* ================= RIGHT ================= */}

<div className="ngpdHeroRight">

<div className="ngpdBadgeRow">

{product.isOrganic &&

<div className="ngpdBadge">

ORGANIC

</div>

}

{product.stoneGround &&

<div className="ngpdBadge">

STONE GROUND

</div>

}

</div>

<h1 className="ngpdTitle">

{product.name}

</h1>

<p className="ngpdSubtitle">

{product.shortDescription}

</p>

<div className="ngpdRatingRow">

<div className="ngpdRatingBox">

<Star

size={18}

fill="#F7B731"

color="#F7B731"

/>

<span>

{Number(product.rating).toFixed(1)}

</span>

</div>

<p>

{product.reviews} Reviews

</p>

</div>

<div className="ngpdPriceRow">

<h2>

₹{product.price}

</h2>

<del>

₹{product.mrp}

</del>

<div className="ngpdDiscount">

{discount(product.mrp,product.price)}% OFF

</div>

</div>

<p className="ngpdTax">

Quantity: {product.quantity}{" "}{product.unit}

</p>

<div className="ngpdCartRow">

<div className="ngpdQtyBox">

<button

onClick={()=>{

if(quantity>1){

setQuantity(quantity-1)

}

}}

>

<Minus size={18}/>

</button>

<span>

{quantity}

</span>

<button

onClick={()=>

setQuantity(quantity+1)

}

>

<Plus size={18}/>

</button>

</div>

<button
className="ngpdCartBtn"
onClick={async()=>{

await addToCart(

product._id,

quantity

);

}}
>

Add To Cart

</button>

<button className="ngpdWishlistBtn">

<Heart size={18}/>

</button>

</div>

<div className="ngpdTrustGrid">

<div className="ngpdTrustCard">

<Truck size={28}/>

<h4>

Delivery

</h4>

<p>

{product.deliveryTime}

</p>

</div>

<div className="ngpdTrustCard">

<Shield size={28}/>

<h4>
Lab Tested

</h4>

<p>

Quality Checked

</p>

</div>

<div className="ngpdTrustCard">

<Leaf size={28}/>

<h4>

Organic

</h4>

<p>

Farm Fresh

</p>

</div>
</div>

{/* about and nutirition */}
<hr className="ngpdDivider"/>
<div className="ngpdAboutSection">
<h3>
About this product
</h3>
<p>
{product.aboutProduct}
</p>
<h3 className="ngpdNutritionHeading">
Nutritional highlights
</h3>
<div className="ngpdNutritionGrid">
{product.nutrition?.map((item,index)=>(
<div
className="ngpdNutritionCard"
key={index}
>
<h4>

{item.value}

</h4>

<p>

{item.label}
</p>
</div>
))}
</div>
</div>
</div>
</div>

{/* ================= PRODUCT INFORMATION ================= */}
<div className="ngpdInfoList">

    <div className="ngpdInfoRow">
        <span>Category</span>
        <b>{product.category}</b>
    </div>

    <div className="ngpdInfoRow">
        <span>Weight</span>
        <b>{product.quantity} {product.unit}</b>
    </div>

    <div className="ngpdInfoRow">
        <span>Origin</span>
        <b>{product.origin}</b>
    </div>

    <div className="ngpdInfoRow">
        <span>Packaging Date</span>
        <b>{product.packagingDate?.slice(0,10)}</b>
    </div>

    <div className="ngpdInfoRow">
        <span>Expiry Date</span>
        <b>{product.expiryDate?.slice(0,10)}</b>
    </div>

</div>
{/* 
<div className="ngpdInfoSection">

  <h2 className="ngpdSectionTitle">
    Product Information
  </h2>

  <div className="ngpdInfoGrid">

    <div className="ngpdInfoCard">
      <span>Category</span>
      <b>{product.category}</b>
    </div>

    <div className="ngpdInfoCard">
      <span>Weight</span>
      <b>{product.quantity} {product.unit}</b>
    </div>

    <div className="ngpdInfoCard">
      <span>Origin</span>
      <b>{product.origin}</b>
    </div>

    <div className="ngpdInfoCard">
      <span>Packaging Date</span>
      <b>{product.packagingDate?.slice(0,10)}</b>
    </div>

    <div className="ngpdInfoCard">
      <span>Expiry Date</span>
      <b>{product.expiryDate?.slice(0,10)}</b>
    </div>

    <div className="ngpdInfoCard">
      <span>Available Stock</span>
      <b>{product.stock}</b>
    </div>

  </div>

</div> */}

{/* ================= DELIVERY ================= */}
<div className="ngpdDeliveryList">

    <div className="ngpdDeliveryRow">

        <MdOutlineLocalShipping className="ngpdDeliveryIcon"/>

        <div>

            <h4>Fast Delivery</h4>

            <p>Delivered within {product.deliveryTime}</p>

        </div>

    </div>

    <div className="ngpdDeliveryRow">

        <GiWheat className="ngpdDeliveryIcon"/>

        <div>

            <h4>Farm Fresh</h4>

            <p>Directly sourced from certified farmers.</p>

        </div>

    </div>

    <div className="ngpdDeliveryRow">

        <MdVerified className="ngpdDeliveryIcon"/>

        <div>

            <h4>Lab Tested</h4>

            <p>Quality checked & residue free.</p>

        </div>

    </div>

    <div className="ngpdDeliveryRow">

        <MdPayments className="ngpdDeliveryIcon"/>

        <div>

            <h4>Secure Payment</h4>

            <p>UPI • Cards • COD</p>

        </div>

    </div>

</div>
{/* 
<div className="ngpdDeliverySection">

  <h2 className="ngpdSectionTitle">
    Delivery & Quality
  </h2>

  <div className="ngpdDeliveryGrid">

    <div className="ngpdDeliveryCard">

      <h4>
        🚚 Fast Delivery
      </h4>

      <p>

        Delivered within

        <strong>

          {" "}
          {product.deliveryTime}

        </strong>

      </p>

    </div>

    <div className="ngpdDeliveryCard">

      <h4>

        🌾 Farm Fresh

      </h4>

      <p>

        Directly sourced from verified farmers.

      </p>

    </div>

    <div className="ngpdDeliveryCard">

      <h4>

        🧪 Lab Tested

      </h4>

      <p>

        Chemical & residue free.

      </p>

    </div>

    <div className="ngpdDeliveryCard">

      <h4>

        💳 Secure Payment

      </h4>

      <p>

        UPI • Cards • COD

      </p>

    </div>

  </div>

</div> */}

{/* ================= REVIEWS ================= */}

<div className="ngpdReviewSection">

  <h2 className="ngpdSectionTitle">

    Customer Reviews

  </h2>

  {

  product.reviewList?.length===0 ?

  (

    <div className="ngpdNoReview">

      No Reviews Yet

    </div>

  )

  :

  product.reviewList.map((review,index)=>(

    <div

      className="ngpdReviewCard"

      key={index}

    >

      <div className="ngpdReviewTop">

        <h4>

          {review.name}

        </h4>

        <span>

          ⭐ {review.rating}

        </span>

      </div>

      <p>

        {review.comment}

      </p>

    </div>

  ))

  }

</div>

{/* ================= RELATED PRODUCTS ================= */}

<div className="ngpdRelatedSection">

<h2 className="ngpdSectionTitle">

You May Also Like

</h2>

<div className="ngpdRelatedGrid">

{

relatedProducts.map(item=>(

<div

className="ngpdRelatedCard"

key={item._id}

>

<div className="ngpdRelatedImage">

<img

src={item.thumbnail}

alt={item.name}

/>

</div>

<div className="ngpdRelatedContent">

<h4>

{item.name}

</h4>

<p>

{item.quantity} {item.unit}

</p>

<div className="ngpdRelatedPrice">

<strong>

₹{item.price}

</strong>

<span>

₹{item.mrp}

</span>

</div>

<button

className="ngpdViewBtn"

onClick={()=>{

window.location.href=`/product/${item._id}`;

}}

>

View Product

</button>

</div>

</div>

))

}

</div>

</div>


</div>
<Cart

open={cartOpen}

onClose={()=>setCartOpen(false)}

/>
</section>

);
}

export default ProductDetails;