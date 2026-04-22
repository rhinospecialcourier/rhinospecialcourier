import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

const testimonials = [
  {
    name: "María González",
    role: "Empresaria",
    content: "Rhino ha transformado mi negocio. Importo productos de China y siempre llegan en tiempo récord. ¡El servicio es impecable!",
    rating: 5,
    initials: "MG"
  },
  {
    name: "Carlos Rodríguez",
    role: "Tech Enthusiast",
    content: "Compré mi laptop en Amazon USA y la recibí en Bogotá en 6 días. El rastreo en tiempo real me dio mucha tranquilidad.",
    rating: 5,
    initials: "CR"
  },
  {
    name: "Ana Martínez",
    role: "Fashion Blogger",
    content: "Perfecto para mis compras de ropa desde Europa. La gestión aduanera es un plus enorme. No tengo que preocuparme por nada.",
    rating: 5,
    initials: "AM"
  },
  {
    name: "Diego López",
    role: "Gamer",
    content: "He traído varios componentes de PC desde USA. Siempre llegan bien empacados y en perfectas condiciones. 100% recomendado.",
    rating: 5,
    initials: "DL"
  }
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Miles de clientes satisfechos confían en Rhino para sus importaciones
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 style={{ fontWeight: 600 }}>{testimonial.name}</h4>
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        {testimonial.role}
                      </p>
                    </div>
                    <Quote className="text-primary opacity-20" size={32} />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-secondary fill-secondary" size={16} />
                    ))}
                  </div>

                  <p className="text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
