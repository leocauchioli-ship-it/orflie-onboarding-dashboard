import AuthoritySection from "@/components/AuthoritySection";
import CaptureSection from "@/components/CaptureSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ImpactSection from "@/components/ImpactSection";
import Navbar from "@/components/Navbar";
import PainSection from "@/components/PainSection";
import ProcessSection from "@/components/ProcessSection";

const Index = () => {
  return (
    <div className="page-shell min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ImpactSection />
        <PainSection />
        <AuthoritySection />
        <ProcessSection />
        <CaptureSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
