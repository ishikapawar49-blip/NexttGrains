import "./FreshArrivals.css";
import "./BestSellers.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import {
  Heart,
  Star,
  Zap,
  Plus,
  ChevronRight,
} from "lucide-react";
 
function FreshArrivals() {
  const [products,setProducts]=useState([]);
const [loading,setLoading]=useState(true);
const { toggleWishlist, isWishlisted } = useWishlist();
const { addToCart } = useCart();

const getProducts = async () => {
  try {

    const res = await axios.get(
      "http://localhost:5000/api/products/new-arrivals"
    );

    console.log(res.data);

    setProducts(res.data.products);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const getDiscount = (mrp, price) => {

  if (!mrp || !price) return 0;

  return getDiscount(item.mrp, item.price)

};

useEffect(()=>{
getProducts();
},[]);

  return (
    <section className="fresh-arrivals">

      <div className="fresh-header">

        <div>
          <span className="fresh-tag">
            FRESH ARRIVALS
          </span>

          <h2>New on the shelf</h2>

          <p>
            Just landed from our partner farms.
          </p>
        </div>

        <button className="view-btn">
          View all
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="product-grid">

  {products.map((item) => (
<Link
    to={`/product/${item._id}`}
    key={item._id}
    className="product-card"
    style={{
        textDecoration: "none",
        color: "inherit"
    }}
>
      <div className="product-image-wrapper">

        <img src={item.thumbnail} alt={item.name} />

        <span className="discount-badge">
{
Math.round(((item.mrp-item.price)/item.mrp)*100)
}% OFF
</span>

        <span className="organic-badge">
          ORGANIC
        </span>

       <button
    className="wishlist-btn"
    onClick={async (e) => {

        e.preventDefault();
        e.stopPropagation();

        await toggleWishlist(item._id);

    }}
>

    <Heart
        size={20}
        fill={
            isWishlisted(item._id)
                ? "#ef4444"
                : "transparent"
        }
        color="#ef4444"
    />

</button>

      </div>

      <div className="product-content">

        <div className="rating-row">

          <div className="rating-left">
            <Star
              size={16}
              fill="#F5B23D"
              color="#F5B23D"
            />
            <span>{item.rating}</span>
            <small>({item.reviews})</small>
          </div>

          <div className="delivery">
            <Zap size={13} />
            24 hr
          </div>

        </div>

        <h3>{item.name}</h3>

       <p className="product-desc">
    {item.shortDescription}

    <span className="best-product-qty">
        • {item.quantity}{item.unit}
    </span>
</p>

        <div className="price-row">

          <div>
            <span className="price">
              ₹{item.price}
            </span>

            <span className="old-price">
              ₹{item.mrp}
            </span>
          </div>

          <button

    className="add-btn"

    onClick={async (e) => {

        e.preventDefault();
        e.stopPropagation();

        await addToCart(
            item._id,
            1
        );

    }}

>

    <Plus size={18}/>
    ADD

</button>

        </div>

      </div>

    </Link>
  ))}

</div>

    </section>
  );
}

export default FreshArrivals;