import OurStoryHero from "./OurStoryHero";
import OurStory from "../Home/OurStory";
import FoundersSection from "./FoundersSection";

function OurStoryPage() {
  return (
    <>
      <OurStoryHero />
      <OurStory
        showTag={false}
        showButton={false}
        detailed={true}
        pageView={true}
      />
      <FoundersSection />
    </>
  );
}

export default OurStoryPage;