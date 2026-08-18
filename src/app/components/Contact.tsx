import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }
    setIsSending(true);
    try {
      await emailjs.send(
        "service_wt92143",
        "template_s0656gm",
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        "4b8JPEJ2J6J6mg8wY"
      );
      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Error al enviar. Intenta de nuevo.");
    }
    setIsSending(false);
  };

  const handleWhatsAppSubmit = () => {
    if (!formData.name || !formData.message) {
      toast.error("Por favor completa tu nombre y mensaje.");
      return;
    }
    const text = `Hola, soy ${formData.name}.%0ATeléfono: ${formData.phone}%0ACorreo: ${formData.email}%0AMensaje: ${formData.message}`;
    window.open(`https://wa.me/573107767143?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
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
            Contáctanos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            ¿Tienes preguntas? Estamos aquí para ayudarte 24/7
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }} className="mb-1">Email</h4>
                    <p className="text-muted-foreground">rhinospecialcourier@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }} className="mb-1">Teléfono</h4>
                    <p className="text-muted-foreground">Celular: 310 776 7143</p>
                    <p className="text-muted-foreground">WhatsApp: +57 310 776 7143</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }} className="mb-1">Oficina Principal</h4>
                    <p className="text-muted-foreground">Calle 52B SUR # 24 - 45</p>
                    <p className="text-muted-foreground">Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <h4 style={{ fontWeight: 600 }} className="mb-2">Horario de Atención</h4>
              <p className="text-muted-foreground mb-1">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
              <p className="text-muted-foreground mb-1">Sábados: 8:00 AM - 12:00 PM</p>
              <p className="text-muted-foreground">Soporte en línea: 24/7</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <Card className="bg-card border-border w-full">
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y te responderemos en menos de 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+57 300 123 4567" value={formData.phone} onChange={handleChange} className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea id="message" name="message" placeholder="¿En qué podemos ayudarte?" value={formData.message} onChange={handleChange} required className="bg-input-background min-h-32" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleWhatsAppSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2" size={18} />
                      Enviar WhatsApp
                    </Button>
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={isSending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="mr-2" size={18} />
                      {isSending ? "Enviando..." : "Enviar Correo"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}