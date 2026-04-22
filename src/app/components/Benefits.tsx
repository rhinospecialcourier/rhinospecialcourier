import { motion } from "motion/react";
import { Shield, Zap, DollarSign, Headphones, Globe, Lock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const benefits = [
  {
    icon: Zap,
    title: "Velocidad Incomparable",
    description: "Entregas en 5-7 días desde cualquier parte de Colombia."
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Seguro de $100 USD en cada envío."
  },
  {
    icon: DollarSign,
    title: "Precios Competitivos",
    description: "Las mejores tarifas del mercado colombiano."
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Atención al cliente disponible todo el tiempo."
  },
  {
    icon: Globe,
    title: "Cobertura Global",
    description: "Importados desde América, Europa y Asia."
  },
  {
    icon: Lock,
    title: "Gestión Aduanera",
    description: "Nos encargamos de todos los trámites."
  }
];

export function Benefits() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            ¿Por Qué Rhino?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            La combinación perfecta de velocidad, seguridad y eficiencia
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-background" size={28} />
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.25rem' }} className="mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-4 gap-6"
        >
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-primary mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>3K+</div>
            <div className="text-muted-foreground">Paquetes Entregados</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-secondary mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>5</div>
            <div className="text-muted-foreground">Países de Origen</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-primary mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>98.77%</div>
            <div className="text-muted-foreground">Satisfacción</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-secondary mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>24/7</div>
            <div className="text-muted-foreground">Soporte</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}