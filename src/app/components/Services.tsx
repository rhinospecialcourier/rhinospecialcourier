import { motion } from "motion/react";
import { Package, Plane, Truck, Shield, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const services = [
  {
    icon: Plane,
    title: "Importación Aérea",
    description: "Envíos rápidos desde cualquier país. Tu paquete en Colombia en 5-7 días.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Truck,
    title: "Entrega a Domicilio",
    description: "Llevamos tu paquete directamente a tu puerta en toda Colombia.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Shield,
    title: "Seguro Incluido",
    description: "Seguro de $100 USD en cada envío.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: DollarSign,
    title: "Gestión Aduanera",
    description: "Nos encargamos de todos los trámites de importación y documentación.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Package,
    title: "Consolidación",
    description: "Agrupa varios paquetes en uno solo y ahorra en costos de envío.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Clock,
    title: "Rastreo 24/7",
    description: "Sigue tu paquete en tiempo real desde el origen hasta tu puerta.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Nuestros Servicios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Todo lo que necesitas para importar desde el extranjero a Colombia de forma segura y rápida
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-lg ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={service.color} size={28} />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
