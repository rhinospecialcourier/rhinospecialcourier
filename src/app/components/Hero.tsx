import { motion } from "motion/react";
import { Package, Zap, Shield, Clock } from "lucide-react";
import { Button } from "./ui/button";
import logo from "figma:asset/dfc188dfe9cc0d9611a29a33ee529e641d0b2ece.png";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(217, 70, 239, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/30 shadow-lg shadow-primary/20"
            >
              <span className="text-primary animate-pulse">⚡</span>
              <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                CASILLERO INTERNACIONAL, COURIER Y CARGA COMERCIAL
              </span>
              <span className="text-secondary animate-pulse">🌎</span>
            </motion.div>

            <h1 className="text-primary mb-4" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1 }}>
              Importación Rápida
              <br />
              <span style={{ color: '#FCD34D' }}>a Colombia</span>
            </h1>

            <p className="text-muted-foreground mb-8" style={{ fontSize: '1.125rem' }}>
              Traemos tus paquetes desde cualquier parte del mundo directamente a tu puerta. 
              Tarifa competitiva, velocidad incomparable y seguridad garantizada.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button onClick={() => scrollToSection('calculator')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Package className="mr-2" size={20} />
                Cotizar Envío
              </Button>
              <Button onClick={() => scrollToSection('tracking')} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Rastrear Paquete
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-primary" size={20} />
                </div>
                <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>5-7</div>
                <div className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Días Entrega</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-secondary" size={20} />
                </div>
                <div className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>100%</div>
                <div className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Seguro</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-primary" size={20} />
                </div>
                <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>24/7</div>
                <div className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Soporte</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <div 
                className="w-full max-w-md mx-auto rounded-2xl p-8"
                style={{ backgroundColor: '#0A0E27' }}
              >
                <img 
                  src={logo} 
                  alt="Rhino Courier" 
                  className="w-full drop-shadow-2xl" 
                />
              </div>
            </motion.div>

            {/* Glowing Circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
            </motion.div>
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-80 h-80 rounded-full bg-secondary/20 blur-3xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}