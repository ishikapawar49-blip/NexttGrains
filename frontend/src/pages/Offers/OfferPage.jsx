import "./OfferPage.css";
import {
  Tag,
  Clock3,
  Flame,
} from "lucide-react";

function OfferPage() {
  const offers = [
    {
      icon: <Tag size={32} />,
      title: "First Order ₹100 OFF",
      subtitle: "Min order ₹499",
      code: "WELCOME100",
    },

    {
      icon: <Clock3 size={32} />,
      title: "Subscribe & Save 15%",
      subtitle: "Recurring savings",
      code: "AUTO15",
    },

    {
      icon: <Flame size={32} />,
      title: "Bulk Pantry Bundle",
      subtitle: "25% off ₹1,500+ orders",
      code: "PANTRY25",
    },
  ];

  return (
    <section className="offers-page">

      {/* HERO */}

      <div className="offer-banner">

        <div className="offer-content">

          <span className="offer-tag">
            FLASH SALE • ENDS TONIGHT
          </span>

          <h1>
            Up to 40% off everything organic.
          </h1>

          <p>
            Use code
            <span className="coupon-pill">
              HARVEST40
            </span>
            at checkout.
          </p>

          <div className="timer">

            <div className="time-box">
              <h3>08</h3>
              <span>HRS</span>
            </div>

            <div className="time-box">
              <h3>42</h3>
              <span>MIN</span>
            </div>

            <div className="time-box">
              <h3>17</h3>
              <span>SEC</span>
            </div>

          </div>

        </div>

        <div className="offer-flame">
          🔥
        </div>

      </div>

      {/* OFFERS */}

      <div className="offers-grid">

        {offers.map((offer, index) => (
          <div
            className="offer-card"
            key={index}
          >
            <div className="offer-icon">
              {offer.icon}
            </div>

            <h3>{offer.title}</h3>

            <p>{offer.subtitle}</p>

            <div className="coupon-code">

              <span>{offer.code}</span>

              <button>
                COPY
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default OfferPage;