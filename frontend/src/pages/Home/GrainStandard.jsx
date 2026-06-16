import "./GrainStandard.css";

import {
  ShieldCheck,
  Leaf,
  Handshake,
  QrCode,
  Sprout,
  Factory,
} from "lucide-react";

import farmImage from "../../assets/pp3.jpg";

function GrainStandard() {
  return (
<section className="grain-standard">

  <div className="grain-standard-header">
    <span className="grain-standard-tag">
      WHY NEXTTGRAINS
    </span>

    <h2>
      The Grain Standard
    </h2>
  </div>

  <div className="grain-standard-grid">

    <div className="grain-standard-card grain-standard-purity-card">
      <div className="grain-standard-icon-circle">
        <ShieldCheck size={22} />
      </div>

      <h3>Residue Free Purity</h3>

      <p>
        Every grain is tested for 200+ chemical
        residues to ensure your family gets only
        what nature intended.
      </p>

      <img src={farmImage} alt="Farm" />
    </div>

    <div className="grain-standard-card grain-standard-dark-card">
      <div>
        <h4>Sustainable Farming</h4>

        <p>
          Regenerative techniques that heal
          the soil for generations.
        </p>
      </div>

      <Leaf size={34} />
    </div>

    <div className="grain-standard-card grain-standard-yellow-card">
      <Handshake size={30} />

      <h4>Direct</h4>

      <span>FROM FARMERS</span>
    </div>

    <div className="grain-standard-card grain-standard-trace-card">
      <QrCode size={26} />

      <h4>Traceable</h4>

      <p>
        Scan QR on any pack to see the farm
        of origin.
      </p>
    </div>

    <div className="grain-standard-card grain-standard-natural-card">
      <Sprout size={26} />

      <h4>Natural Processing</h4>

      <p>
        Stone-milled, sun-dried, hand-packed.
      </p>
    </div>

    <div className="grain-standard-card grain-standard-quality-card">
      <div>
        <h4>Quality Assurance</h4>

        <p>
          Every batch lab-tested before
          it leaves our facility.
        </p>
      </div>

      <Factory size={34} />
    </div>

  </div>

</section>
  );
}

export default GrainStandard;