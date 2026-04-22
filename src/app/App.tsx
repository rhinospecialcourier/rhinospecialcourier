import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { ImportProcess } from "./components/ImportProcess";
import { Calculator } from "./components/Calculator";
import { Tracking } from "./components/Tracking";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AboutUs } from "./components/AboutUs";
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";
import { CustomsManagement } from "./components/CustomsManagement";
import { Locations } from "./components/Locations";
import { AuthModal } from "./components/AuthModal";
import { CustomerTracking } from "./components/CustomerTracking";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { RecommendedStores } from "./components/RecommendedStores";

type Page = 'home' | 'about' | 'terms' | 'privacy' | 'customs' | 'locations' | 'tracking' | 'stores';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("rhinoCurrentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentPage('tracking');
  };

  const handleLogout = () => {
    localStorage.removeItem("rhinoCurrentUser");
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    if (currentUser) {
      // If already logged in, go to tracking
      setCurrentPage('tracking');
    } else {
      // Otherwise, open login modal
      setAuthModalOpen(true);
    }
  };

  // Render different pages
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <AboutUs onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <Terms onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <Privacy onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'customs') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <CustomsManagement onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'locations') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <Locations onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'stores') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <RecommendedStores onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'tracking' && currentUser) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <CustomerTracking user={currentUser} onLogout={handleLogout} />
        <Footer onNavigate={handleNavigate} />
        <WhatsAppButton />
        <Toaster />
      </div>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenAuth={handleOpenAuth} />
      <Hero />
      <Services />
      <ImportProcess />
      <Calculator />
      <Tracking />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer onNavigate={handleNavigate} />
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onLogin={handleLogin}
      />
      <WhatsAppButton />
      <Toaster />
    </div>
  );
}