import { useState, useEffect, lazy, Suspense } from "react";
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
import { WhatsAppButton } from "./components/WhatsAppButton";
import { supabase } from "../supabase";

// Carga diferida: estas partes solo se descargan cuando el visitante realmente las necesita
const AboutUs = lazy(() => import("./components/AboutUs").then(m => ({ default: m.AboutUs })));
const Terms = lazy(() => import("./components/Terms").then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import("./components/Privacy").then(m => ({ default: m.Privacy })));
const CustomsManagement = lazy(() => import("./components/CustomsManagement").then(m => ({ default: m.CustomsManagement })));
const Locations = lazy(() => import("./components/Locations").then(m => ({ default: m.Locations })));
const RecommendedStores = lazy(() => import("./components/RecommendedStores").then(m => ({ default: m.RecommendedStores })));
const AuthModal = lazy(() => import("./components/AuthModal").then(m => ({ default: m.AuthModal })));
const CustomerTracking = lazy(() => import("./components/CustomerTracking").then(m => ({ default: m.CustomerTracking })));
const AdminLogin = lazy(() => import("./components/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminPanel = lazy(() => import("./components/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ResetPassword = lazy(() => import("./components/ResetPassword").then(m => ({ default: m.ResetPassword })));

type Page = 'home' | 'about' | 'terms' | 'privacy' | 'customs' | 'locations' | 'tracking' | 'stores' | 'admin' | 'reset-password';

function SectionLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authSession, setAuthSession] = useState<any>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if user is already logged in (cliente)
  useEffect(() => {
    const savedUser = sessionStorage.getItem("rhinoCurrentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Detectar qué página mostrar según la URL: /reset-password (ruta real) o #admin (hash)
  useEffect(() => {
    if (window.location.pathname === '/reset-password') {
      setCurrentPage('reset-password');
    } else if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Revisar la sesión de Supabase Auth y si corresponde a un administrador (por su etiqueta "role": "admin")
  useEffect(() => {
    const checkSession = (session: any) => {
      setAuthSession(session);
      setIsAdminSession(session?.user?.user_metadata?.role === 'admin');
    };

    supabase.auth.getSession().then(({ data }) => {
      checkSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("rhinoCurrentUser");
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleAdminLogout = () => {
    setCurrentPage('home');
    window.location.hash = '';
  };

  const handleResetPasswordDone = () => {
    window.history.replaceState({}, '', '/');
    setCurrentPage('home');
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

  // Página de restablecer contraseña (viene del enlace del correo)
  if (currentPage === 'reset-password') {
    return (
      <Suspense fallback={<SectionLoading />}>
        <ResetPassword onDone={handleResetPasswordDone} />
        <Toaster />
      </Suspense>
    );
  }

  // Panel de administrador
  if (currentPage === 'admin') {
    if (checkingSession) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
          <Toaster />
        </div>
      );
    }
    // Solo se considera sesión de administrador válida si el usuario tiene la etiqueta "role": "admin"
    if (!authSession || !isAdminSession) {
      return (
        <Suspense fallback={<SectionLoading />}>
          <AdminLogin onLoginSuccess={() => {}} />
          <Toaster />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<SectionLoading />}>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster />
      </Suspense>
    );
  }

  // Render different pages
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onOpenAuth={handleOpenAuth} />
        <Suspense fallback={<SectionLoading />}>
          <AboutUs onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <Terms onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <Privacy onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <CustomsManagement onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <Locations onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <RecommendedStores onBack={() => handleNavigate('home')} />
        </Suspense>
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
        <Suspense fallback={<SectionLoading />}>
          <CustomerTracking user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
        </Suspense>
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
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            open={authModalOpen}
            onOpenChange={setAuthModalOpen}
            onLogin={handleLogin}
          />
        </Suspense>
      )}
      <WhatsAppButton />
      <Toaster />
    </div>
  );
}