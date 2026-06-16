import "./CTASection.css";

import { ArrowRight } from "lucide-react";

import farmBg from "../../assets/pp3.jpg";

function CTASection() {
  return (
    <section className="cta-section">

      <div
        className="cta-container"
        style={{
          backgroundImage: `linear-gradient(
            rgba(28,58,24,.78),
            rgba(20,60,25,.82)
          ), url(${farmBg})`,
        }}
      >

        <div className="cta-content">

          <h2>
            Eat clean. Live whole. Start 
            <span> today.</span>
          </h2>

          <p>
            Get 15% off your first order, free delivery
            on orders above ₹999, and a story behind
            every grain.
          </p>

          <div className="cta-buttons">

            <button className="cta-primary-btn">
              Shop Collection
              <ArrowRight size={18} />
            </button>

            <button className="cta-secondary-btn">
              Meet the Farmers
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTASection;