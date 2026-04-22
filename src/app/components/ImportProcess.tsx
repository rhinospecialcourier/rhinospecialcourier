import { motion } from "motion/react";
import { ShoppingCart, Package, Plane, Home, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Abre tu Casillero",
    description: "Abre tu casillero de forma gratuita.",
    step: "01"
  },
  {
    icon: ShoppingCart,
    title: "Compra Online",
    description: "Compra en tu tienda favorita de USA, España y China o cualquier país.",
    step: "02"
  },
  {
    icon: Plane,
    title: "Usa Nuestra Dirección",
    description: "Te damos una dirección en el extranjero para tus compras.",
    step: "03"
  },
  {
    icon: Home,
    title: "Importamos y Entregamos",
    description: "Recibimos, consolidamos y enviamos tu paquete. Entrega a domicilio en 5-7 días hábiles.",
    step: "04"
  }
];

export function ImportProcess() {
  return (
    <section id="process" className="py-20 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            ¿Cómo Funciona?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Importar nunca fue tan fácil. Solo 4 pasos para recibir tus productos en casa
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary transform -translate-y-1/2 opacity-20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-background" style={{ fontWeight: 700 }}>{step.step}</span>
                    </div>

                    <div className="mb-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="text-primary" size={32} />
                      </div>
                      <h3 style={{ fontWeight: 600, fontSize: '1.25rem' }} className="mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center">
                          <CheckCircle className="text-primary" size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}