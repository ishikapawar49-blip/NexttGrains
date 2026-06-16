import Hero from "./Hero";
import CategorySection from "./CategorySection";
// import PantrySection from "./PantrySection";
import BestSellers from "./BestSellers";
import SubscribeSection from "./SubscribeSection";
import FreshArrivals from "./FreshArrivals";
// import WhyNexttGrains from "./WhyNexttGrains";
import GrainStandard from "./GrainStandard";
import OurStory from "./OurStory"; 
import Testimonials from "./Testimonials";
import CTASection from "./CTASection";

function Home() {
  return (
     <>
      <Hero />
      <CategorySection />
      {/* <PantrySection /> */}
      <BestSellers />
      <SubscribeSection />
      <FreshArrivals />
      {/* <WhyNexttGrains /> */}
      <GrainStandard />
      <OurStory />
      <Testimonials />
      <CTASection />
    </>
  );
}

export default Home;