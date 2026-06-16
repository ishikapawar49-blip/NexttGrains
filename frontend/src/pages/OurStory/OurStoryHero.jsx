import "./OurStoryHero.css";

function OurStoryHero() {
  return (
    <section className="osh-hero">

      <div className="osh-hero-content">

        <span className="osh-hero-tag">
          OUR STORY
        </span>

        <h1 className="osh-hero-title">
          We started with one
          <span> question</span>
        </h1>

        <p className="osh-hero-subtitle">
          Why does the wheat your grandmother cooked with
          no longer exist in your  
          <br></br>
          <span> kitchen? </span>
        </p>

      </div>

    <section className="osh-stats">

  <div className="osh-stats-card">

    <div className="osh-stat-item">
      <h3>1.2M+</h3>
      <p>Households served</p>
    </div>

    <div className="osh-stat-item">
      <h3>1,200+</h3>
      <p>Farmer partners</p>
    </div>

    <div className="osh-stat-item">
      <h3>40+</h3>
      <p>Cities delivered</p>
    </div>

    <div className="osh-stat-item">
      <h3>12</h3>
      <p>Quality certifications</p>
    </div>

  </div>

</section>
    </section>

  );
}

export default OurStoryHero;