import "./Shop.css";
import {
  Heart,
  Star,
  Plus,
  Zap,
} from "lucide-react";

import wheat from "../../assets/pi3.jpg";
import oil from "../../assets/pi4.jpg";
import dal from "../../assets/pi5.jpg";
import flour from "../../assets/pi6.jpg";
import dryfruit from "../../assets/pi7.jpg";
import ragi from "../../assets/pi8.jpg";
import millet from "../../assets/pi9.jpg";
import honey from "../../assets/b5.jpg";
import turmeric from "../../assets/b4.jpg";

const products = [
  {
    id: 1,
    image: wheat,
    title: "Sharbati Whole Wheat",
    desc: "Stone-ground, MP harvested · 5 kg",
    price: 349,
    oldPrice: 449,
    rating: 4.8,
    discount: "22% OFF",
  },
  {
    id: 2,
    image: oil,
    title: "Cold-Pressed Mustard Oil",
    desc: "Wood-pressed · 1 L",
    price: 289,
    oldPrice: 399,
    rating: 4.9,
    discount: "28% OFF",
  },
  {
    id: 3,
    image: dal,
    title: "Premium Masoor Dal",
    desc: "Unpolished · 1 kg",
    price: 159,
    oldPrice: 199,
    rating: 4.7,
    discount: "20% OFF",
  },
  {
    id: 4,
    image: ragi,
    title: "Heritage Ragi Flour",
    desc: "Finger millet · 1 kg",
    price: 129,
    oldPrice: 169,
    rating: 4.8,
    discount: "24% OFF",
  },
  {
    id: 5,
    image: dryfruit,
    title: "Royal Dry Fruit Mix",
    desc: "Almonds · Cashews · Dates",
    price: 749,
    oldPrice: 999,
    rating: 4.9,
    discount: "25% OFF",
  },
  {
    id: 6,
    image: flour,
    title: "Chakki Fresh Atta",
    desc: "Traditional chakki · 5 kg",
    price: 319,
    oldPrice: 399,
    rating: 4.8,
    discount: "20% OFF",
  },
  {
  id: 7,
  image: millet,
  title: "Ancient Bajra Millet",
  desc: "Stone-ground · High Fiber · 2 kg",
  price: 229,
  oldPrice: 299,
  rating: 4.8,
  discount: "18% OFF",
},

{
  id: 8,
  image: honey,
  title: "Raw Forest Honey",
  desc: "Unprocessed · Natural · 500 g",
  price: 399,
  oldPrice: 499,
  rating: 4.9,
  discount: "20% OFF",
},

{
  id: 9,
  image: turmeric,
  title: "Lakadong Turmeric",
  desc: "High Curcumin · Premium · 250 g",
  price: 189,
  oldPrice: 249,
  rating: 4.8,
  discount: "24% OFF",
},
];

function Shop() {
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

        <select className="shop-sort">
          <option>Sort: Popular</option>
          <option>Price Low → High</option>
          <option>Price High → Low</option>
        </select>
      </div>

      <div className="shop-layout">

        <aside className="shop-sidebar">

          <h3>Category</h3>

          <label><input type="shop-checkbox" /> Grains</label>
          <label><input type="shop-checkbox" /> Oils</label>
          <label><input type="shop-checkbox" /> Pulses</label>
          <label><input type="shop-checkbox" /> Millets</label>
          <label><input type="shop-checkbox" /> Dry Fruits</label>
          <label><input type="shop-checkbox" /> Flour</label>

          <h3 className="shop-quality-title">Quality</h3>

          <label>
            <input type="shop-checkbox" />
            Certified Organic only
          </label>

          <h3 className="shop-quality-title">Price Range</h3>

          <input type="range" />
        </aside>

<div className="shop-products-scroll">
        <div className="shop-product-grid">

          {products.map((item) => (
            <div className="shop-product-card" key={item.id}>

              <div className="shop-product-image">

                <img src={item.image} alt="" />

                <span className="shop-discount">
                  {item.discount}
                </span>

                <span className="shop-organic">
                  ORGANIC
                </span>

                <button className="shop-wishlist">
                  <Heart size={18} />
                </button>

              </div>

              <div className="shop-product-content">

                <div className="shop-product-meta">

                  <span className="shop-rating">
                    <Star size={16} fill="#F5B23D" color="#F5B23D" size={16} />
                    {item.rating}
                  </span>

                  <span className="shop-delivery">
                    <Zap size={14} />
                    24 hr
                  </span>

                </div>

                <h4>{item.title}</h4>

                <p>{item.desc}</p>

                <div className="shop-product-footer">

                  <div>
                    <strong>₹{item.price}</strong>
                    <span>₹{item.oldPrice}</span>
                  </div>

                  <button className="shop-add-btn">
                    <Plus size={18} />
                    ADD
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
        </div>

      </div>

    </section>
  );
}

export default Shop;