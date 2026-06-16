import "./CategorySection.css";
import { ArrowRight } from "lucide-react";

import flourImg from "../../assets/pp1.jpg";
import grainImg from "../../assets/pp2.jpg";
import sellerImg from "../../assets/pi10.jpg";
import wheatImg from "../../assets/ppp.jpg";

function CategorySection() {
  return (
    <section className="category-section">

      <div className="category-header">

        <div>
          <span className="category-tag">
            CURATED
          </span>

          <h2>
            Shop by Category
          </h2>

          <p>
            Explore our heritage grain selection
          </p>
        </div>

        <button className="category-view-btn">
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="category-grid">

        {/* LEFT */}

        <div className="category-card tall-card">

          <img src={flourImg} alt="" />

          <div className="category-overlay">
            <h3>Premium Flour</h3>
            <p>Stone-ground excellence</p>
          </div>

        </div>

        {/* CENTER TOP */}

        <div className="category-card wide-card">

          <img src={grainImg} alt="" />

          <div className="category-overlay">
            <h3>Whole Grains</h3>
            <p>100% organic</p>
          </div>

        </div>

        {/* CENTER BOTTOM */}

        <div className="category-card medium-card">

          <img src={sellerImg} alt="" />

          <div className="category-overlay">
            <h3>Dairy & Oils</h3>
            <p>Our top picks</p>
          </div>

        </div>

        {/* RIGHT */}

        <div className="category-card tall-card right-card">

          <img src={wheatImg} alt="" />

          <div className="category-overlay">
            <h3>Black Wheat</h3>
            <p>Heirloom variety</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default CategorySection;