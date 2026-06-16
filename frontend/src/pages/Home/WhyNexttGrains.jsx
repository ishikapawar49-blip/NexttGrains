import "./WhyNexttGrains.css";

import { PiLeafLight } from "react-icons/pi";
import { FiShield } from "react-icons/fi";
import { HiOutlineTruck } from "react-icons/hi";
import { IoSparklesOutline } from "react-icons/io5";

const features = [
  {
    icon: <PiLeafLight />,
    title: "Direct from farms",
    description:
      "1,200+ certified-organic partner farms. No middlemen, no shortcuts.",
  },
  {
    icon: <FiShield />,
    title: "Lab tested batches",
    description:
      "Every batch tested for purity, moisture and pesticide residue.",
  },
  {
    icon: <HiOutlineTruck />,
    title: "24-hour delivery",
    description:
      "Cold-chain logistics across 40+ cities. Fresh stock, never warehoused stale.",
  },
  {
    icon: <IoSparklesOutline />,
    title: "Honest pricing",
    description:
      "Farmer-fair pricing with full traceability QR on every pack.",
  },
];

function WhyNexttGrains() {
  return (
    <section className="why-section">

      <div className="why-header">

        <span className="why-tag">
          WHY NEXTTGRAINS
        </span>

        <h2>
          A grocery brand built like a tech company
        </h2>

        <p>
          Software-grade supply chain. Hand-tended quality.
        </p>

      </div>

      <div className="why-grid">

        {features.map((item, index) => (
          <div className="why-card" key={index}>

            <div className="why-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default WhyNexttGrains;