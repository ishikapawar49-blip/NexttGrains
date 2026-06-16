import { useState } from "react";
import "./FoundersSection.css";

import ashwin from "../../assets/ashwin_founder.png";
import vaibhav from "../../assets/vaibhav_founder.jpg";
import pranit from "../../assets/pranit_founder.png";

function FoundersSection() {
  const [selectedFounder, setSelectedFounder] = useState(null);

  const founders = [
     {
      id: 1,
      image: pranit,
      name: "Pranit Pandurang Nagpure",
      role: "Founder & Food Safety",

      short:
        "Food safety auditor with deep farming roots.",

      story:
        "An FSSC Version 6 Lead Auditor, comes from a farming family and shares a deep-rooted connection with agriculture. Born and raised in an agricultural environment, he gained firsthand experience of the everyday challenges faced by farmers from an early age. With a strong academic foundation in B.Sc. Agriculture and M.Sc. Food Technology, along with extensive professional experience in organic inspection and third-party food safety auditing, combines practical field knowledge with technical expertise. Over the years, has worked closely with farmers, processors, exporters, and certification bodies, ensuring compliance with standards such as NPOP, EU Organic, and NOP Organic. strong understanding of food safety, traceability, quality assurance, and global food safety systems forms the backbone of NexttGrains, a brand committed to providing pesticide residue-free grains while promoting sustainable, transparent, and farmer-focused agricultural practices",
    },
    {
      id: 2,
      image: ashwin,
      name: "Ashwin Rajendra Khanzode",
      role: "Co-Founder & CEO",

      short:
        "Agronomist, researcher and agriculture innovator.",

      story:
        "A passionate agriculture professional with a strong vision to bring innovation, sustainability, and quality to theagricultural sector. holds a B.Sc. in Agriculture and an M.Sc. in Agriculture specializing in Genetics and Plant Breeding, along with 3 years of hands-on experience in Research & Development with leading seed companies. With a deep understanding of crop improvement, seed technology, and sustainable farming practices, committed to creating solutions that benefit both farmers and consumers. As a founder of NexttGrains, working towards the core mission of providing pesticide-free and residue-free grains while promoting healthier food choices and farmer-centric growth. By combining scientific knowledge with practical agricultural experience, aims to build a trusted brand that supports sustainable agriculture, food purity, and long-term environmental responsibility.",
    },

    {
      id: 3,
      image: vaibhav,
      name: "Vaibhav Gajanan Rithe",
      role: "Co-Founder & Operations",

      short:
        "Building sustainable farm-to-home supply chains.",

      story:
        "An academic background in B.Sc. Agriculture and MBA in Marketing, brings over 6 years of experience in the agriculture development sector, livelihood promotion, agri-entrepreneurship development, and mentoring. With a strong foundation in rural development and agri-innovation,  actively associated with NGOs and farmer development initiatives, working to empower rural entrepreneurs and promote sustainable agricultural practices. expertise includes regenerative agriculture, carbon credit systems, livelihood development, and sustainable farming models. Through guidance and vision, NexttGrains is committed to promoting pesticide residue-free grains while creating long-term impact through transparent, sustainable, and farmer-focused agricultural practices. ",
    },

   
  ];

  return (
    <>
      <section className="founders-section">

        <span className="founders-tag">
          THE FOUNDERS
        </span>

        <h2>
          Meet the people behind
          <span> NexttGrains</span>
        </h2>

        <div className="founders-grid">

          {founders.map((founder) => (
            <div
              key={founder.id}
              className="founder-card"
              onClick={() => setSelectedFounder(founder)}
            >

              <img
                src={founder.image}
                alt={founder.name}
              />

              <h3>{founder.name}</h3>

              <span>{founder.role}</span>

              <p>{founder.short}</p>

              <button>
                Read Story →
              </button>

            </div>
          ))}

        </div>

      </section>

      {selectedFounder && (
        <div
          className="founder-modal-overlay"
          onClick={() => setSelectedFounder(null)}
        >

          <div
            className="founder-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={selectedFounder.image}
              alt=""
            />

            <h2>{selectedFounder.name}</h2>

            <span>
              {selectedFounder.role}
            </span>

            <p>
              {selectedFounder.story}
            </p>

            <blockquote>
              "Healthy food begins at the farm."
            </blockquote>

          </div>

        </div>
      )}
    </>
  );
}

export default FoundersSection;