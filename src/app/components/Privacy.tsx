import { motion } from "motion/react";
import { Lock, Database, Share2, FileCheck } from "lucide-react";
import { Button } from "./ui/button";

interface PrivacyProps {
  onBack: () => void;
}

export function Privacy({ onBack }: PrivacyProps) {
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

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Lock className="text-secondary" size={24} />
            </div>
            <h1 className="text-secondary" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Política de Privacidad
            </h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground leading-relaxed">
                En <strong className="text-foreground">Rhino Special Courier SAS</strong>, estamos comprometidos con la protección 
                y el manejo responsable de su información personal. Esta política describe cómo recolectamos, utilizamos y protegemos 
                los datos que nos proporciona al utilizar nuestros servicios de Courier y Carga Comercial.
              </p>
            </div>

            {/* Información Recolectada */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  1. Información Recolectada
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Recolectamos la información estrictamente necesaria para gestionar sus envíos, la cual puede incluir:
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 style={{ fontWeight: 600 }} className="mb-2">
                      • Datos Personales:
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nombre completo, dirección, número de teléfono, correo electrónico, y número de identificación 
                      (cédula/pasaporte/RUC) del remitente y el destinatario.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600 }} className="mb-2">
                      • Datos de Envío:
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Detalles de la carga (descripción, peso, dimensiones, valor declarado) y rastreo.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600 }} className="mb-2">
                      • Datos Comerciales:
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Factura y Packing List para la importación, esta si se llega a necesitar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uso de la Información */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FileCheck className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  2. Uso de la Información
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  La información recolectada es utilizada exclusivamente para:
                </p>
                <div className="space-y-2">
                  <p className="text-muted-foreground leading-relaxed">
                    • Procesar, rastrear y entregar sus envíos.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Realizar la gestión aduanal y fiscal requerida para el despacho de la mercancía.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Comunicarnos con usted sobre el estado de su envío o cualquier incidencia.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Mejorar la calidad de nuestros servicios y la experiencia del cliente.
                  </p>
                </div>
              </div>
            </div>

            {/* Compartición de la Información */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Share2 className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  3. Compartición de la Información
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Compartiremos sus datos solo con terceros indispensables para la prestación del servicio, tales como aerolíneas, 
                  agentes de aduana, transportistas locales y autoridades gubernamentales (en caso de requerimiento legal).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Rhino Special Courier SAS garantiza</strong> que no venderá, alquilará ni 
                  cederá su información a terceros con fines comerciales ajenos al servicio.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20">
              <p className="text-muted-foreground leading-relaxed">
                Su privacidad es nuestra prioridad. Si tiene preguntas sobre cómo manejamos sus datos, no dude en contactarnos.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
