import "./FreshArrivals.css";
import "./BestSellers.css";
import {
  Heart,
  Star,
  Zap,
  Plus,
  ChevronRight,
} from "lucide-react";

import product1 from "../../assets/pi5.jpg";
import product2 from "../../assets/pp6.jpg";
import product3 from "../../assets/b5.jpg";
import product4 from "../../assets/b4.jpg";

const products = [
  {
    id: 1,
    image: product1,
    discount: "20% OFF",
    rating: "4.7",
    reviews: "980",
    name: "Premium Masoor Dal",
    desc: "Unpolished, slow-sun dried · 1 kg",
    price: 159,
    oldPrice: 199,
  },
  {
    id: 2,
    image: product2,
    discount: "24% OFF",
    rating: "4.8",
    reviews: "1,340",
    name: "Heritage Ragi Flour",
    desc: "Finger millet, calcium-rich · 1 kg",
    price: 129,
    oldPrice: 169,
  },
  {
    id: 3,
    image: product3,
    discount: "25% OFF",
    rating: "4.9",
    reviews: "3,120",
    name: "Royal Dry Fruit Mix",
    desc: "Almonds · Cashews · Walnuts · Dates · 500 g",
    price: 749,
    oldPrice: 999,
  },
  {
    id: 4,
    image: product4,
    discount: "20% OFF",
    rating: "4.8",
    reviews: "4,280",
    name: "Chakki Fresh Atta",
    desc: "Traditional chakki, low GI · 5 kg",
    price: 319,
    oldPrice: 399,
  },
];

function FreshArrivals() {
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
    <div className="product-card" key={item.id}>

      <div className="product-image-wrapper">

        <img src={item.image} alt={item.name} />

        <span className="discount-badge">
          {item.discount}
        </span>

        <span className="organic-badge">
          ORGANIC
        </span>

        <button className="wishlist-btn">
          <Heart size={20} />
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
          {item.desc}
        </p>

        <div className="price-row">

          <div>
            <span className="price">
              ₹{item.price}
            </span>

            <span className="old-price">
              ₹{item.oldPrice}
            </span>
          </div>

          <button className="add-btn">
            <Plus size={18} />
            ADD
          </button>

        </div>

      </div>

    </div>
  ))}

</div>

    </section>
  );
}

export default FreshArrivals;