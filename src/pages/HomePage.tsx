import HeroSection from "../components/sections/home/HeroSection";
import BeliefSection from "../components/sections/home/BeliefSection";
import ExpertiseSection from "../components/sections/home/ExpertiseSection";
import SelectedWorkSection from "../components/sections/home/SelectedWorkSection";

import FeedbackSection from "../components/sections/home/FeedbackSection";
import FaqSection from "../components/sections/home/FaqSection";
import ContactCTASection from "../components/sections/home/ContactCTASection";
import TechParallaxSection from "../components/sections/home/TechParallaxSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeliefSection />
      <ExpertiseSection />
      <SelectedWorkSection />
      <TechParallaxSection />
      <FeedbackSection />
      <FaqSection />
      <ContactCTASection />
    </>
  );
}
