import { Package, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import logo from "figma:asset/f761057a3aa56feaf3375313fa74e80c80aac082.png";

interface NavbarProps {
  onOpenAuth: () => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img src={logo} alt="Rhino Special Courier" className="h-16 w-auto object-contain" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors">
              Servicios
            </button>
            <button onClick={() => scrollToSection('process')} className="text-foreground hover:text-primary transition-colors">
              Proceso
            </button>
            <button onClick={() => scrollToSection('calculator')} className="text-foreground hover:text-primary transition-colors">
              Cotizar
            </button>
            <button onClick={() => scrollToSection('tracking')} className="text-foreground hover:text-primary transition-colors">
              Rastreo
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors">
              Contacto
            </button>
            <Button onClick={onOpenAuth} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Ingresar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Servicios
            </button>
            <button onClick={() => scrollToSection('process')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Proceso
            </button>
            <button onClick={() => scrollToSection('calculator')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Cotizar
            </button>
            <button onClick={() => scrollToSection('tracking')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Rastreo
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Contacto
            </button>
            <Button onClick={onOpenAuth} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Ingresar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}