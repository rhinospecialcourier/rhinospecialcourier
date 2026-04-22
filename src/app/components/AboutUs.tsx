import { motion } from "motion/react";
import { Target, Eye, Zap, Shield, Globe, Users } from "lucide-react";
import { Button } from "./ui/button";

interface AboutUsProps {
  onBack: () => void;
}

export function AboutUs({ onBack }: AboutUsProps) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-8 border-primary text-primary hover:bg-primary/10"
          >
            ← Volver al Inicio
          </Button>

          <h1 className="text-primary mb-8" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Sobre Nosotros
          </h1>

          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: '1.125rem' }}>
                <strong className="text-foreground">Rhino Special Courier SAS</strong> es tu aliado estratégico en logística y transporte internacional. 
                Nos especializamos en ofrecer soluciones de envío rápidas, seguras y confiables, abarcando tanto la modalidad de 
                <strong className="text-primary"> Courier</strong> para tus paquetes más urgentes y personales, como la 
                <strong className="text-secondary"> Carga Comercial</strong> para grandes volúmenes y operaciones de importación.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: '1.125rem' }}>
                Con años de experiencia en el sector, entendemos la importancia de la eficiencia y la transparencia en cada etapa del proceso. 
                Nuestro compromiso es simplificar tu cadena de suministro, ofreciéndote tarifas competitivas y un servicio personalizado que se 
                adapta a tus necesidades específicas, ya seas un particular, un emprendedor o una gran empresa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              {/* Misión */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Target className="text-primary" size={24} />
                  </div>
                  <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Nuestra Misión
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Conectar tus importaciones segura a Colombia, garantizando la entrega oportuna y el cuidado integral de tu mercancía.
                </p>
              </motion.div>

              {/* Visión */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Eye className="text-secondary" size={24} />
                  </div>
                  <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Nuestra Visión
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la agencia de carga de referencia, reconocida para el 2027 por la excelencia en el servicio, 
                  la innovación tecnológica y la confiabilidad en el manejo de Courier y Carga Comercial.
                </p>
              </motion.div>
            </div>

            {/* Valores */}
            <div className="mt-12">
              <h2 className="text-primary mb-6" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                Nuestros Valores
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">Velocidad</h3>
                  <p className="text-muted-foreground">
                    Entregas rápidas sin comprometer la seguridad de tu mercancía.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Shield className="text-secondary" size={24} />
                  </div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">Seguridad</h3>
                  <p className="text-muted-foreground">
                    Protección integral de tus envíos con seguro incluido.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="text-primary" size={24} />
                  </div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">Alcance Global</h3>
                  <p className="text-muted-foreground">
                    Conexiones desde Miami, España y China directamente a Colombia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
