import "./Testimonials.css";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: `"The khapali flour brought back the taste of my grandmother's rotis. Pure, fragrant, and so wholesome."`,
    name: "Priya Sharma",
    city: "Mumbai",
  },
  {
    id: 2,
    text: `"I can actually feel the difference. Lighter digestion, more energy. NexttGrains is the real deal."`,
    name: "Rohan Mehta",
    city: "Bangalore",
  },
  {
    id: 3,
    text: `"Beautiful packaging, ethical sourcing, and quality you can taste. Won't buy atta anywhere else now."`,
    name: "Anjali Verma",
    city: "Pune",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">

      <div className="testimonials-header">

        <span className="testimonials-tag">
          Loved by Families
        </span>

        <h2>
          Words from our Kitchen
        </h2>

      </div>

      <div className="testimonials-grid">

        {testimonials.map((item) => (
          <div
            key={item.id}
            className="testimonial-card"
          >

            <Quote
              size={28}
              strokeWidth={2.2}
              className="testimonials-quote-icon"
            />

            <p className="testimonial-text">
              {item.text}
            </p>

            <div className="testimonial-footer">

              <div>

                <h4>{item.name}</h4>

                <span>{item.city}</span>

              </div>

              <div className="testimonials-stars">

                <Star fill="#E2A040" />
                <Star fill="#E2A040" />
                <Star fill="#E2A040" />
                <Star fill="#E2A040" />
                <Star fill="#E2A040" />

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Testimonials;