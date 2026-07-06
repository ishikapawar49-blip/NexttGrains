import "../Shop/Shop.css";
import "./Wishlist.css";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  IoHeart,
  IoTrashOutline,
  IoCartOutline,
  IoArrowBack,
  IoHeartDislikeOutline,
} from "react-icons/io5";
import {
  Heart,
  Star,
  Plus,
  Zap,
} from "lucide-react";
import {
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} from "../../services/wishlistApi";

export default function Wishlist() {

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);
const { addToCart } = useCart();

const getDiscount = (mrp, price) => {

  if (!mrp || !price) return 0;

  return Math.round(((mrp - price) / mrp) * 100);

};
  useEffect(() => {

    loadWishlist();

  }, []);

  const loadWishlist = async () => {

    try {

      const res = await getWishlist();

console.log(JSON.stringify(res.data.products[0].product, null, 2));
      setWishlist(res.data.products || []);

    }

    catch (err) {

      console.log(err.response?.data || err);

    }

    finally {

      setLoading(false);

    }

  };

  const removeItem = async (productId) => {

    try {

      await removeWishlistItem(productId);

      setWishlist((prev) =>

        prev.filter(

          (item) => item.product._id !== productId

        )

      );

    }

    catch (err) {

      console.log(err.response?.data || err);

    }

  };

  const handleClearWishlist = async () => {

    const ok = window.confirm(
      "Clear your wishlist?"
    );

    if (!ok) return;

    try {

      await clearWishlist();

      setWishlist([]);

    }

    catch (err) {

      console.log(err.response?.data || err);

    }

  };

  if (loading) {

    return (

      <div className="ngWishlist_loading">

        Loading Wishlist...

      </div>

    );

  }

  if (wishlist.length === 0) {

    return (

      <div className="ngWishlist_emptyPage">

        <IoHeartDislikeOutline className="ngWishlist_emptyIcon" />

        <h2>Your Wishlist is Empty</h2>

        <p>

          Save your favourite organic products here.

        </p>

        <button

          className="ngWishlist_shopBtn"

          onClick={() => navigate("/products")}

        >

          Continue Shopping

        </button>

      </div>

    );

  }

  return (

    <div className="ngWishlist_page">

      <div className="ngWishlist_container">

        <div className="ngWishlist_topBar">

          <button

            className="ngWishlist_backBtn"

            onClick={() => navigate(-1)}

          >

            <IoArrowBack />

            Back

          </button>

          {/* <button

            className="ngWishlist_clearBtn"

            onClick={handleClearWishlist}

          >

            <IoTrashOutline />

            Clear Wishlist

          </button> */}

        </div>

        <div className="ngWishlist_heading">

          <div>

            <h1>

              My Wishlist

            </h1>

            <p>

              {wishlist.length} saved product(s)

            </p>

          </div>

        </div>

<div className="shop-products-scroll">
        <div className="shop-product-grid">
          {
          wishlist.length===0

?

<div className="shopNoProduct">

No Products Found

</div>

:

wishlist.map(({ product:item }) => (

<Link

to={`/product/${item._id}`}

className="shop-product-card"

key={item._id}

style={{

textDecoration:"none",

color:"inherit"

}}

>
              <div className="shop-product-image">

<img

src={item.thumbnail || item.images?.[0]}

alt={item.name}

/>
                <span className="shop-discount">
                  {getDiscount(
                item.mrp,
                item.price
                )}% OFF
                </span>

                <span className="shop-organic">
                  ORGANIC
                </span>
<button

className="shop-wishlist"

onClick={async(e)=>{

e.preventDefault();

e.stopPropagation();

await removeItem(item._id);

}}

>

<Heart
size={18}
fill="#ef4444"
color="#ef4444"
/>

</button>
              </div>

              <div className="shop-product-content">

                <div className="shop-product-meta">

                  <span className="shop-rating">
                    <Star size={16} fill="#F5B23D" color="#F5B23D" size={16} />
                    {Number(item.rating || 4.5).toFixed(1)}
              {/* <span className="shop-review-count">
({item.reviews || item.reviewCount || 0})
</span> */}
                  </span>

                  <span className="shop-delivery">
                    <Zap size={14} />
                    24 hr
                  </span>

                </div>

                <h4>{item.name}</h4>
<p className="shop-product-desc">
  {item.shortDescription}

  <span className="shop-product-qty">
    • {item.quantity} {item.unit}
  </span>
</p>
                <div className="shop-product-footer">

                  <div>
                    <strong>₹{item.price}</strong>
                    <span>₹{item.mrp}</span>
                  </div>

                 <button

className="shop-add-btn"

onClick={async(e)=>{

e.preventDefault();

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

))

}

</div>

</div>

</div>

</div>

);

}