import { motion } from "motion/react";
import { MapPin, Phone, Clock, Building2, User, AlertCircle, Plane } from "lucide-react";
import { Button } from "./ui/button";

interface LocationsProps {
  onBack: () => void;
}

export function Locations({ onBack }: LocationsProps) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="text-primary" size={24} />
            </div>
            <h1 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Nuestras Sedes
            </h1>
          </div>

          {/* Instrucciones Importantes */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/50">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <h3 className="text-secondary" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                INSTRUCCIONES IMPORTANTES
              </h3>
            </div>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>POR FAVOR, PARA TODOS LOS PAQUETES NOTIFICAR EL NÚMERO DE TRACKING, COMO VA MARCADO, AGREGAR NÚMERO DE CASILLERO, CONTENIDO Y VALOR DECLARADO.</strong>
              </p>
              <p className="text-muted-foreground">
                TODO LOS PAQUETES DEBEN SER PREALERTADOS, DE NO SER ASÍ RHINO SPECIAL COURIER NO SE HACE RESPONSABLE SI SE NECESITABA CONSOLIDAR, REAJUSTES, RETENCIÓN, MODALIDAD DE IMPORTACIÓN Y POSIBLES NOVEDADES.
              </p>
              <p className="text-amber-400 bg-amber-400/10 p-3 rounded-lg">
                Los tiempos de importación y entrega son tiempos promedio, ya que puede variar por novedades en origen retrasando los vuelos o reprogramándolos acorde a la salida de carga y de igual manera en Aduanas de Colombia por autorización de liberación en la carga.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* United States to Colombia */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇺🇸</div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  United States to Colombia
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">10900 NW 21st Suite 220</p>
                    <p className="text-foreground">Doral, FL</p>
                    <p className="text-muted-foreground">ZP 33172</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <a href="tel:+17868459180" className="text-primary hover:underline">
                    +1 786 845 9180
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600 }}>Horario:</p>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 – 16:30</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-foreground text-sm">
                    <strong className="text-primary">Marcar el paquete:</strong> Nombre Cliente / Número de Casillero
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <Plane className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-green-400 text-sm">
                      <strong>Tiempo de importación y entrega:</strong> 5-7 días
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* China to Colombia Air */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇨🇳</div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  China to Colombia Air
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">广州市 天河区珠江新城 华强路3号富力盈力大厦南塔 2505</p>
                    <p className="text-muted-foreground text-sm">
                      Room 2505, South Tower, R&F Yingli Building, No. 3 Huaqiang Road, Zhujiang New Town, Tianhe District
                    </p>
                    <p className="text-foreground mt-2">Guangzhou, China</p>
                    <p className="text-muted-foreground">ZP 510000</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <a href="tel:+15920104310" className="text-secondary hover:underline">
                    +1 592 010 4310
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground flex-shrink-0" size={18} />
                  <p className="text-foreground">Contacto: Green</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600 }}>Horario:</p>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 – 16:30</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-foreground text-sm">
                    <strong className="text-secondary">Marcar el paquete:</strong> MASA-NGR / Casillero / Nombre Cliente
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <Plane className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-green-400 text-sm">
                      <strong>Tiempo de importación y entrega:</strong> 15 días, sale cada viernes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* China to Colombia Maritime */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇨🇳</div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  China to Colombia Maritime
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">义乌青口东苑工业区东山路33号</p>
                    <p className="text-muted-foreground text-sm">
                      No. 33, Dongshan Road, Dongyuan Industrial Zone, Qingkou, Yiwu
                    </p>
                    <p className="text-foreground mt-2">Guangzhou, China</p>
                    <p className="text-muted-foreground">ZP 510000</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <a href="tel:+15920104310" className="text-primary hover:underline">
                    +1 592 010 4310
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground flex-shrink-0" size={18} />
                  <p className="text-foreground">Contacto: Green</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600 }}>Horario:</p>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 – 16:30</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-foreground text-sm">
                    <strong className="text-primary">Marcar el paquete:</strong> MASA-NGR / Casillero / Nombre Cliente
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <Plane className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-green-400 text-sm">
                      <strong>Tiempo de importación y entrega:</strong> 15 días, sale cada viernes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* España to Colombia */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇪🇸</div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  España to Colombia
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <User className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <p className="text-foreground">Destinatario: Nombre y Apellido</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">Calle San Jaime 1</p>
                    <p className="text-foreground">28031, Madrid</p>
                    <p className="text-muted-foreground mt-2">Oficina: HA009</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="text-muted-foreground flex-shrink-0" size={18} />
                  <p className="text-foreground">Empresa: Anka Cargo Logistics S.L</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <a href="tel:+34606510862" className="text-secondary hover:underline">
                    +34 606 510 862
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600 }}>Horario:</p>
                    <p className="text-muted-foreground">Lunes a Jueves:</p>
                    <p className="text-muted-foreground ml-4">• 9:00 – 14:00</p>
                    <p className="text-muted-foreground ml-4">• 15:00 – 17:30</p>
                    <p className="text-muted-foreground mt-2">Viernes:</p>
                    <p className="text-muted-foreground ml-4">• 9:30 – 14:30</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-foreground text-sm">
                    <strong className="text-secondary">Marcar el paquete:</strong> Nombre Cliente
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <Plane className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-green-400 text-sm">
                      <strong>Tiempo de importación y entrega:</strong> 12 días, sale todos los viernes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panamá to Colombia */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇵🇦</div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Panamá to Colombia
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">Zona Libre de Colón</p>
                    <p className="text-foreground">Lote 2 manzana 33B Avenida Boyd</p>
                    <p className="text-foreground">Roosevelt, al lado de las bodega de Sirena</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground flex-shrink-0" size={18} />
                  <p className="text-foreground">Contacto: JENNY MATALLANA</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+50769835118" className="text-primary hover:underline">
                      📱 +507 6983 5118
                    </a>
                    <a href="tel:+5074746315" className="text-primary hover:underline">
                      ☎ +507 474-6315 / 474-6316
                    </a>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-foreground text-sm">
                    <strong className="text-primary">Marcar el paquete:</strong> Felipe++
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <Plane className="text-green-500 flex-shrink-0" size={18} />
                    <p className="text-green-400 text-sm">
                      <strong>Tiempo de importación y entrega:</strong> 12 días, sale todos los viernes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colombia */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🇨🇴</div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Colombia
                </h2>
              </div>
              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground">TV 93 # 53 - 32 INT 15</p>
                    <p className="text-foreground">Parque Empresarial El Dorado</p>
                    <p className="text-foreground">Bogotá, Colombia</p>
                    <p className="text-muted-foreground">ZP 111071</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground flex-shrink-0" size={18} />
                  <a href="tel:+5714263000" className="text-primary hover:underline">
                    +57 1 426 3000
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600 }}>Horario:</p>
                    <p className="text-muted-foreground">Lunes a Viernes: 8:30 – 16:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje Final */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20">
              <p className="text-muted-foreground leading-relaxed text-center">
                Estamos presentes en los principales puntos de origen de tu carga. <strong className="text-foreground">Rhino Special Courier</strong> conecta el mundo con Colombia. 🦏
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}