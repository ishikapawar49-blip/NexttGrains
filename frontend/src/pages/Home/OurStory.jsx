import "./OurStory.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import storyImage from "../../assets/story.jpg";

function OurStory({
  showButton = true,
  detailed = false,
  showTag = true,
  pageView = false,
})
{
    const navigate = useNavigate();


  return (
<section
  className={`our-story ${pageView ? "our-story-page" : ""}`}
>
      <div className="our-story-image">

        <img
          src={storyImage}
          alt="NexttGrains Story"
        />

      </div>

      <div className="our-story-content">

        {showTag && (
  <span className="our-story-tag">
    OUR STORY
  </span>
)}

        <h2>
          Goodness grown at the source.
        </h2>

        {/* <p>
          NexttGrains began in the heart of
          Vidarbha, Maharashtra, with a simple
          belief: the food we eat should heal —
          not harm.  We partner with farmers who still
          remember traditional growing methods,
          heritage seeds and regenerative
          farming practices.
        </p>

       
        <p>
          Every pack you buy supports farming
          families while bringing clean,
          traceable grains to your table.
        </p> */}
       {!detailed && (
  <>
    <p>
      NexttGrains is dedicated to providing high-quality
      pesticide residue-free grains through responsible and
      sustainable agricultural practices. Our mission is to
      deliver safe, nutritious, and trustworthy food while
      creating long-term value for farmers and consumers alike.
    </p>

    <p>
      Founded by professionals with strong backgrounds in
      agriculture, food technology, food safety, and rural
      development, NexttGrains combines practical farming
      knowledge with technical expertise to ensure quality,
      traceability, and food safety across the supply chain.
    </p>
  </>
)}

{detailed && (
  <>
    <p>
     We work closely with farmers, processors, and agricultural stakeholders to promote better farming practices, 
quality assurance, and transparent sourcing systems. Our focus is on reducing harmful chemical residues in food 
while supporting environmentally responsible and farmer-friendly agriculture.  
    </p>

    <p>
      At NexttGrains, we believe that healthy food starts at the farm level. By encouraging sustainable farming 
methods, regenerative agriculture, and rural entrepreneurship, we aim to build a future where consumers have 
access to safe grains and farmers achieve sustainable growth and better livelihoods.
With expertise in agriculture development, food safety auditing, livelihood promotion, and agri-innovation, our 
team is committed to creating a trusted brand that stands for purity, quality, sustainability, and farmer 
empowerment.
    </p>
  </>
)}

{showButton && (
  <button
    className="story-btn"
    onClick={() => navigate("/our-story")}
  >  Read our journey
          <ArrowRight size={18} />
        </button>
)}
      </div>

    </section>
  );
}

export default OurStory;