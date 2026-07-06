import "./Shop.css";
import { useWishlist } from "../../context/WishlistContext";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext";
import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Star,
  Plus,
  Zap,
} from "lucide-react";

function Shop() {
const [products,setProducts] = useState([]);
const { toggleWishlist, isWishlisted, }=useWishlist();
const { addToCart } = useCart();
const [loading,setLoading] = useState(true);
const [selectedCategories, setSelectedCategories] = useState([]);
const [maxPrice, setMaxPrice] = useState(5000);
const [sortBy, setSortBy] = useState("popular");

useEffect(()=>{

getProducts();

},[]);

const getProducts = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/products/all"
);

setProducts(res.data.products);

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

const categories = [
  ...new Set(
    products.map(product => product.category)
  )
];

let filteredProducts = [...products];

// Category Filter
if (selectedCategories.length > 0) {

  filteredProducts = filteredProducts.filter(product =>
    selectedCategories.includes(product.category)
  );

}

// Price Filter
filteredProducts = filteredProducts.filter(
  product => product.price <= maxPrice
);

// Sorting
if (sortBy === "low") {

  filteredProducts.sort((a, b) => a.price - b.price);

}

else if (sortBy === "high") {

  filteredProducts.sort((a, b) => b.price - a.price);

}

else if (sortBy === "latest") {

  filteredProducts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

}

  return (
    <section className="shop-page">

      <div className="shop-topbar">
        <div>
          <span className="shop-breadcrumb">
            Home / Shop
          </span>

          <h1>All Products</h1>

          <p>Every product residue-free, traceable to its farm, and stone-ground for maximum nutrition. </p>
        </div>

        <select

className="shop-sort"

value={sortBy}

onChange={(e)=>setSortBy(e.target.value)}

>
         <option value="popular">Popular</option>

<option value="low">
Price Low → High
</option>

<option value="high">
Price High → Low
</option>

<option value="latest">
Latest
</option>
        </select>
      </div>

      <div className="shop-layout">

        <aside className="shop-sidebar">

          <h3>Category</h3>

          {
categories.map(cat=>(

<label key={cat}>

<input
type="checkbox"

checked={selectedCategories.includes(cat)}

onChange={(e)=>{

if(e.target.checked){

setSelectedCategories([
...selectedCategories,
cat
]);

}else{

setSelectedCategories(

selectedCategories.filter(c=>c!==cat)

);

}

}}
/>

{cat}

</label>

))
}

          <h3 className="shop-quality-title">Price Range</h3>

          <input

type="range"

min="0"

max="5000"

step="50"

value={maxPrice}

onChange={(e)=>

setMaxPrice(Number(e.target.value))

}

/>

<p>

Under ₹{maxPrice}

</p>
        </aside>

<div className="shop-products-scroll">
        <div className="shop-product-grid">
          {
            loading
?

<h2>Loading...</h2>

:
         filteredProducts.length === 0 ? (

<div className="shopNoProduct">

No Products Found

</div>

) : 

filteredProducts.map((item) => (

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

                <img src={item.thumbnail} alt="" />

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

await toggleWishlist(item._id);

}}

>

<Heart

size={18}

fill={

isWishlisted(item._id)

?

"#ef4444"

:

"transparent"

}

color="#ef4444"

/>

</button>
              </div>

              <div className="shop-product-content">

                <div className="shop-product-meta">

                  <span className="shop-rating">
                    <Star size={16} fill="#F5B23D" color="#F5B23D" size={16} />
                    {Number(item.rating || 4.5).toFixed(1)}
                    <span className="shop-review-count">
                    ({item.reviews || 0})
                    </span>
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
          ))}

        </div>
        </div>

      </div>

    </section>
  );
}

export default Shop;