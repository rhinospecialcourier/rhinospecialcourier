import { Facebook, Instagram, MessageCircle, Video, Link } from "lucide-react";
import logo from "figma:asset/f761057a3aa56feaf3375313fa74e80c80aac082.png";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Rhino Special Courier" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-muted-foreground mb-4">
              Importación rápida y segura desde cualquier parte del mundo a Colombia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Facebook className="text-muted-foreground group-hover:text-primary" size={20} />
              </a>
              <a 
                href="https://www.instagram.com/rhinospecialcourier/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group"
              >
                <Instagram className="text-muted-foreground group-hover:text-primary" size={20} />
              </a>
              <a 
                href="https://wa.me/573204775878" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors group"
              >
                <MessageCircle className="text-white" size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@rhinospecialcourier?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group"
              >
                <Video className="text-muted-foreground group-hover:text-primary" size={20} />
              </a>
              <a 
                href="https://linktr.ee/rhinospecialcourier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group"
              >
                <Link className="text-muted-foreground group-hover:text-primary" size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4" style={{ fontWeight: 600 }}>Servicios</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-primary transition-colors">
                  Importación Aérea
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-primary transition-colors">
                  Entrega a Domicilio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-muted-foreground hover:text-primary transition-colors">
                  Consolidación
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customs')} className="text-muted-foreground hover:text-primary transition-colors">
                  Gestión Aduanera
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('tracking')} className="text-muted-foreground hover:text-primary transition-colors">
                  Rastreo 24/7
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stores')} className="text-muted-foreground hover:text-primary transition-colors">
                  Tiendas Recomendadas
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4" style={{ fontWeight: 600 }}>Empresa</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('about')} className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('process')} className="text-muted-foreground hover:text-primary transition-colors">
                  Cómo Funciona
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('locations')} className="text-muted-foreground hover:text-primary transition-colors">
                  Nuestras Sedes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-muted-foreground hover:text-primary transition-colors">
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              © 2025 Rhino Special Courier SAS. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <button onClick={() => onNavigate('terms')} className="text-muted-foreground hover:text-primary transition-colors" style={{ fontSize: '0.875rem' }}>
                Términos
              </button>
              <button onClick={() => onNavigate('privacy')} className="text-muted-foreground hover:text-primary transition-colors" style={{ fontSize: '0.875rem' }}>
                Privacidad
              </button>
              <button onClick={() => onNavigate('customs')} className="text-muted-foreground hover:text-primary transition-colors" style={{ fontSize: '0.875rem' }}>
                Gestión Aduanera
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}