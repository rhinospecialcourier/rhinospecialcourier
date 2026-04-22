import { motion } from "motion/react";
import { FileText, Truck, Shield, DollarSign, AlertTriangle, Package } from "lucide-react";
import { Button } from "./ui/button";

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
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
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary" size={24} />
            </div>
            <h1 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Términos y Condiciones
            </h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground leading-relaxed">
                Bienvenido(a) a los Términos y Condiciones de <strong className="text-foreground">Rhino Special Courier SAS</strong>. 
                Al utilizar nuestros servicios de transporte y logística, ya sea bajo la modalidad de Courier o Carga Comercial, 
                usted acepta las siguientes condiciones:
              </p>
            </div>

            {/* Servicios Ofrecidos */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  1. Servicios Ofrecidos
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    • Courier (Envíos Expresos):
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Dirigido a documentos y paquetes de bajo peso y volumen que requieren tránsito rápido, 
                    sujetos a las limitaciones de peso y valor declaradas.
                  </p>
                  <ul className="text-muted-foreground text-sm space-y-1 ml-4">
                    <li>• Tus paquetes los puedes asegurar hasta los $2,000 USD y el costo del seguro será el 3% del valor declarado a asegurar.</li>
                    <li>• Peso máximo para importar bajo esta modalidad es hasta 50 KG.</li>
                    <li>• Se puede consolidar hasta 5 paquetes en 1 guía internacional en la modalidad de Courier.</li>
                    <li>• Mayor a 15 libras por la modalidad de Courier no pagan costos fijos ni seguro.</li>
                    <li>• Máximo hasta 5 productos del mismo artículo.</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    • Carga Comercial:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Destinado a mercancías de mayor volumen, peso y/o valor comercial, que requieren manejo aduanal y 
                    documentación específica (facturas comerciales, listas de empaque, etc.).
                  </p>
                </div>
              </div>
            </div>

            {/* Responsabilidad y Limitaciones */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Shield className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  2. Responsabilidad y Limitaciones
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  • La responsabilidad de Rhino Special Courier SAS se limita al valor declarado de la mercancía o a los 
                  límites establecidos por las leyes aplicables, en tu envío.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  • No nos hacemos responsables por demoras causadas por trámites aduanales, condiciones climáticas, fuerza mayor 
                  o información de envío incompleta/incorrecta suministrada por el cliente.
                </p>
              </div>
            </div>

            {/* Mercancías Prohibidas */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="text-destructive" size={20} />
                </div>
                <h2 className="text-destructive" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  3. Mercancías Prohibidas
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  El cliente es responsable de asegurar que los artículos a enviar no se encuentren en la lista de mercancías 
                  prohibidas o restringidas por las leyes del país de origen y destino (ej. armas, explosivos, drogas, artículos 
                  perecederos, etc.).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Rhino Special Courier SAS se reserva el derecho de inspeccionar y rechazar cualquier envío sospechoso.
                </p>
              </div>
            </div>

            {/* Tarifas y Pagos */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  4. Tarifas y Pagos
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Las tarifas de los servicios se basan en el peso (real y volumétrico) y la modalidad de envío seleccionada. 
                  Todos los costos de transporte, manejo, seguro y aranceles (si aplica) deberán ser cubiertos según lo acordado 
                  antes de la entrega final de la carga.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Importante:</strong> La factura se te genera en Colombia, cuando se haya 
                  prestado el servicio de importación hasta llegar a nuestra bodega en Bogotá.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Aclaración importante:</strong> Todos los impuestos, flete internacional y logística, 
                  se calcula acorde a la TRM de la DIAN en la semana que se liberó la carga.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">España y China:</strong> Todos los paquetes desde España y China pagan IVA desde $1 USD 
                  y mayor a $200 USD pagará ARANCEL e IVA.
                </p>
              </div>
            </div>

            {/* Bodegaje */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Package className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  5. Almacenamiento y Bodegaje
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Importante:</strong> Paquetes que duren más de 1 mes en bodega, pagan bodegaje de $5 USD por mes 
                  hasta los 2 meses. Después de estos 2 meses el paquete pasa a ser propiedad de Rhino Special Courier SAS por abandono legal.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <p className="text-muted-foreground leading-relaxed">
                Al utilizar nuestros servicios, usted confirma que ha leído, entendido y aceptado estos términos y condiciones en su totalidad.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}