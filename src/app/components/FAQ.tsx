import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "¿Cuánto tiempo tarda un envío?",
    answer: "Los envíos generalmente tardan entre 5-7 días hábiles desde que recibimos tu paquete en nuestra bodega hasta la entrega en tu domicilio en Colombia. Los tiempos pueden variar según el país de origen y la ciudad de destino."
  },
  {
    question: "¿Cómo funciona la dirección en el extranjero?",
    answer: "Al registrarte, te asignamos una dirección única en USA y otros países. Usas esta dirección al hacer tus compras online. Cuando el paquete llega a nuestra bodega, lo preparamos y enviamos a Colombia."
  },
  {
    question: "¿Qué incluye el precio del envío?",
    answer: "Nuestro precio incluye el transporte internacional, gestión aduanera completa, seguro del paquete, y entrega a domicilio en Colombia. No hay costos ocultos."
  },
  {
    question: "¿Puedo consolidar varios paquetes?",
    answer: "¡Sí! Puedes acumular hasta 4 paquetes en nuestra bodega bajo la modalidad de Courier y solicitar que los enviemos todos juntos. Si es por modalidad comercial no hay límite de paquetes a juntar. Ten en cuenta que tienen que llegar 8 días calendario y prealertarlos. Esto te ayuda a ahorrar significativamente en costos de envío. Si no los prealertas, Rhino Special Courier no se hace responsable y realizará el cobro correspondiente."
  },
  {
    question: "¿Qué productos no se pueden importar?",
    answer: "No podemos enviar productos prohibidos como armas, sustancias ilegales, alimentos perecederos, o líquidos inflamables. Para una lista completa, contáctanos."
  },
  {
    question: "¿Cómo puedo rastrear mi paquete?",
    answer: "Te enviamos un número de rastreo único por email. Puedes ingresar este número en nuestra página de rastreo para ver la ubicación exacta y estado de tu paquete en tiempo real."
  },
  {
    question: "¿Qué pasa si mi paquete se daña?",
    answer: "Todos los envíos incluyen seguro completo. Si tu paquete llega dañado, solo necesitas reportarlo dentro de las 24 horas siguientes a la entrega y procesaremos tu reclamo inmediatamente."
  },
  {
    question: "¿Entregan en toda Colombia?",
    answer: "Sí, hacemos entregas en todas las ciudades principales de Colombia. Para zonas rurales o apartadas, podemos coordinar la entrega en las principales oficina de la transportadora o asumes el costo de flete por ser una zona sin cobertura."
  }
];

export function FAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Todo lo que necesitas saber sobre nuestro servicio de courier
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}