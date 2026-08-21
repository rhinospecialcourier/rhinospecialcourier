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
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/AdminPanel";
import { supabase } from "../supabase";

type Page = 'home' | 'about' | 'terms' | 'privacy' | 'customs' | 'locations' | 'tracking' | 'stores' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminSession, setAdminSession] = useState<any>(null);
  const [checkingAdminSession, setCheckingAdminSession] = useState(true);

  // Check if user is already logged in (cliente)
  useEffect(() => {
    const savedUser = sessionStorage.getItem("rhinoCurrentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Detectar acceso al panel admin vía URL (ej: tusitio.com/#admin)
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Revisar si ya hay una sesión de administrador activa (Supabase Auth)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAdminSession(data.session);
      setCheckingAdminSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    sessionStorage.setItem("rhinoCurrentUser", JSON.stringify(user));
    setCurrentPage('tracking');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem("rhinoCurrentUser", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("rhinoCurrentUser");
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleAdminLogout = () => {
    setCurrentPage('home');
    window.location.hash = '';
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    if (currentUser) {
      setCurrentPage('tracking');
    } else {
      setAuthModalOpen(true);
    }
  };

  // Panel de administrador
  if (currentPage === 'admin') {
    if (checkingAdminSession) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
          <Toaster />
        </div>
      );
    }
    if (!adminSession) {
      return (
        <>
          <AdminLogin onLoginSuccess={() => {}} />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster />
      </>
    );
  }

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
        <CustomerTracking user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
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