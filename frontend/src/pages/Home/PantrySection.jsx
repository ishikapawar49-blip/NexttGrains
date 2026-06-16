import "./PantrySection.css";

import flourImg from "../../assets/pi8.jpg";
import grainsImg from "../../assets/pi9.jpg";
import milletImg from "../../assets/pi6.jpg";
import dairyImg from "../../assets/pi7.jpg";

const categories = [
  {
    title: "Flours",
    count: "2 PRODUCTS",
    image: flourImg,
  },
  {
    title: "Whole Grains",
    count: "2 PRODUCTS",
    image: grainsImg,
  },
  {
    title: "Millets",
    count: "2 PRODUCTS",
    image: milletImg,
  },
  {
    title: "Dairy & Oils",
    count: "1 PRODUCTS",
    image: dairyImg,
  },
];

function PantrySection() {
  return (
    <section className="pantry-section">
      {/* Header */}
      <div className="pantry-header">
        <h2>
          A pantry, <span>thoughtfully</span> sourced.
        </h2>

        <button className="browse-btn">
          Browse everything →
        </button>
      </div>

      {/* Cards */}
      <div className="pantry-grid">
        {categories.map((item, index) => (
          <div className="pantry-card" key={index}>
            <img
              src={item.image}
              alt={item.title}
            />

            <div className="card-overlay">
              <h3>{item.title}</h3>
              <p>{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PantrySection;