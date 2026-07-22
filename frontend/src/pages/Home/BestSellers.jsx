import "./BestSellers.css";
import { Heart, Star, Zap, Plus, ChevronRight } from "lucide-react";
import { useEffect,useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function BestSellers() {
  const navigate = useNavigate();

const [products,setProducts]=useState([]);

const [loading,setLoading]=useState(true);

const {

toggleWishlist,

isWishlisted

}=useWishlist();

const {

addToCart

}=useCart();

useEffect(()=>{

getProducts();

},[]);

const getProducts=async()=>{

try{

const res=await axios.get(

"http://localhost:5000/api/products/best-sellers"

);

setProducts(

res.data.products

);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

};

const getDiscount=(mrp,price)=>{

if(!mrp || !price) return 0;

return Math.round(

((mrp-price)/mrp)*100

);

};

  return (
    <section className="best-sellers">

      <div className="best-header">

        <div>
          <span className="section-tag">
            BEST SELLERS
          </span>

          <h2>
            What India is reordering
          </h2>

          <p>
            Top picks loved by our community this week.
          </p>
        </div>

<button

className="view-all-btn"

onClick={()=>navigate("/shop")}

>
            View all
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="product-grid">

        {

loading ?

<h2 className="best-loading">

Loading...

</h2>

:

products.map((item)=>(
<Link

to={`/product/${item._id}`}

className="product-card"

key={item._id}

style={{

textDecoration:"none",

color:"inherit"

}}

>
            <div className="product-image-wrapper">

              <img
                src={item.thumbnail}
                alt={item.name}
              />

              <span className="discount-badge">
                {

getDiscount(

item.mrp,

item.price

)

}% OFF
              </span>

              <span className="organic-badge">
                ORGANIC
              </span>

              <button

className="wishlist-btn"

onClick={async(e)=>{

e.preventDefault();

e.stopPropagation();

await toggleWishlist(

item._id

);

}}

>
             <Heart

size={20}

fill={

isWishlisted(

item._id

)

?

"#ef4444"

:

"transparent"

}

color="#ef4444"

/>
              </button>

            </div>

            <div className="product-content">

              <div className="rating-row">

                <div className="rating-left">
                  <Star size={16} fill="#F5B23D" color="#F5B23D" />
                  <span>{

Number(

item.rating || 4.5

).toFixed(1)

}</span>
                  <small>({item.reviews || 0})</small>
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

•

{item.quantity}

{item.unit}

</span>
              </p>

              <div className="price-row">

                <div className="price-box">
                  <span className="price">
                    ₹{item.price}
                  </span>

                  <span className="old-price">
                    ₹{item.mrp}
                  </span>
                </div>

                <button

className="add-btn"

onClick={async(e)=>{

e.preventDefault();

await addToCart(

item._id,

1

);

}}

>
                  <Plus size={18} />
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

export default BestSellers;