import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ParentStory from "./components/ParentStory.jsx";
import Services from "./components/Services.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import TrustBand from "./components/TrustBand.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFab from "./components/WhatsAppFab.jsx";
import PrivacyPolicy from "./legal/PrivacyPolicy.jsx";
import AccessibilityStatement from "./legal/AccessibilityStatement.jsx";

const routes = {
  "/privacy": PrivacyPolicy,
  "/accessibility": AccessibilityStatement,
};

function Home() {
  return (
    <>
      <Hero />
      <ParentStory />
      <Services />
      <HowItWorks />
      <TrustBand />
      <ContactSection />
    </>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const Page = routes[path] ?? Home;

  return (
    <div className="site" dir="rtl">
      <a className="skip-link" href="#main">
        דילוג לתוכן הראשי
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Page />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
