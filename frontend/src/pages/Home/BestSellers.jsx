import "./BestSellers.css";

import { Heart, Star, Zap, Plus, ChevronRight } from "lucide-react";

import product1 from "../../assets/b2.jpg";
import product2 from "../../assets/b1.jpg";
import product3 from "../../assets/ppp.jpg";
import product4 from "../../assets/b3.jpg";

const products = [
  {
    id: 1,
    image: product1,
    discount: "22% OFF",
    rating: "4.8",
    reviews: "2,143",
    name: "Sharbati Whole Wheat",
    desc: "Stone-ground, MP harvested · 5 kg",
    price: 349,
    oldPrice: 449,
  },
  {
    id: 2,
    image: product2,
    discount: "28% OFF",
    rating: "4.9",
    reviews: "1,820",
    name: "Cold-Pressed Mustard Oil",
    desc: "Wood-pressed, single origin · 1 L",
    price: 289,
    oldPrice: 399,
  },
  {
    id: 3,
    image: product3,
    discount: "20% OFF",
    rating: "4.7",
    reviews: "980",
    name: "Premium Masoor Dal",
    desc: "Unpolished, slow-sun dried · 1 kg",
    price: 159,
    oldPrice: 199,
  },
  {
    id: 4,
    image: product4,
    discount: "24% OFF",
    rating: "4.8",
    reviews: "1,340",
    name: "Heritage Ragi Flour",
    desc: "Finger millet, calcium-rich · 1 kg",
    price: 129,
    oldPrice: 169,
  },
];

function BestSellers() {
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

        <button className="view-all-btn">
          View all
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="product-grid">

        {products.map((item) => (
          <div className="product-card" key={item.id}>

            <div className="product-image-wrapper">

              <img
                src={item.image}
                alt={item.name}
              />

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
                  <Star size={16} fill="#F5B23D" color="#F5B23D" />
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

                <div className="price-box">
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

export default BestSellers;