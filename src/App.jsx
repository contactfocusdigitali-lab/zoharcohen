import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ParentStory from "./components/ParentStory.jsx";
import Services from "./components/Services.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import TrustBand from "./components/TrustBand.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFab from "./components/WhatsAppFab.jsx";

export default function App() {
  return (
    <div className="site" dir="rtl">
      <Header />
      <Hero />
      <ParentStory />
      <Services />
      <HowItWorks />
      <TrustBand />
      <ContactSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
