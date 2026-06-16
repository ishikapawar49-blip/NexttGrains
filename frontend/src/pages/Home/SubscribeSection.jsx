import "./SubscribeSection.css";
import { ArrowRight } from "lucide-react";

import pantryImage from "../../assets/pi1.jpg";

function SubscribeSection() {
  return (
    <section className="subscribe-wrapper">
      <div className="subscribe-container">

        {/* LEFT */}
        <div className="subscribe-content">

          <span className="subscribe-tag">
            SUBSCRIBE & SAVE
          </span>

          <h2>
            Your monthly pantry, on autopilot.
          </h2>

          <p>
            Schedule deliveries of your staples and save
            15% every month.
            <br />
            Pause or cancel anytime.
          </p>

          <button className="subscribe-btn">
            Build my plan
            <ArrowRight size={22} />
          </button>

        </div>

        {/* RIGHT */}
        <div className="subscribe-image">
          <img
            src={pantryImage}
            alt="Monthly Pantry"
          />
        </div>

      </div>
    </section>
  );
}

export default SubscribeSection;