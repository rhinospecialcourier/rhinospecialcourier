import { motion } from "motion/react";
import { FileText, ClipboardCheck, AlertCircle, TrendingUp, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface CustomsManagementProps {
  onBack: () => void;
}

export function CustomsManagement({ onBack }: CustomsManagementProps) {
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
              Gestión Aduanera
            </h1>
          </div>

          <div className="space-y-6">
            {/* Introducción */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Rhino Special Courier</strong> como agencia de carga internacional (courier, freight forwarder o intermediario logístico), nuestro rol es ser el facilitador entre el cliente/importador y la autoridad aduanera (DIAN) en cada proceso de importación. No somos el dueño de la carga, pero sí el responsable operativo del proceso.
              </p>
            </div>

            {/* Funciones Principales */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <ClipboardCheck className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Nuestras Principales Funciones
                </h2>
              </div>
              <div className="space-y-2 ml-13">
                <p className="text-muted-foreground leading-relaxed">• Recepción y consolidación de carga internacional</p>
                <p className="text-muted-foreground leading-relaxed">• Revisión documental (facturas, guías, declaraciones, etc.)</p>
                <p className="text-muted-foreground leading-relaxed">• Clasificación preliminar de mercancía (apoyo al proceso arancelario)</p>
                <p className="text-muted-foreground leading-relaxed">• Transmisión de información a la DIAN</p>
                <p className="text-muted-foreground leading-relaxed">• Gestión de nacionalización</p>
                <p className="text-muted-foreground leading-relaxed">• Coordinación de inspecciones</p>
                <p className="text-muted-foreground leading-relaxed">• Gestión de pagos (Aranceles e IVA)</p>
                <p className="text-muted-foreground leading-relaxed">• Custodia de la carga mientras está en proceso</p>
                <p className="text-muted-foreground leading-relaxed">• Entrega final al cliente (última milla)</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 ml-13">
                Como agencia de carga, manejar estos conceptos es diario, ya que en cada asesoramiento y liberación se realizan estos pasos para mantener la mejor operación en cada ocasión.
              </p>
            </div>

            {/* Normas para el Importador */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <h2 className="text-primary mb-4" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Tú como importador y dueño de la carga debes tener en cuenta las siguientes normas para la importación:
              </h2>
            </div>

            {/* 1. Cambio de Modalidad */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  1. Cambio de Modalidad
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Es cuando la aduana (DIAN) decide que un envío no puede ser procesado como <strong className="text-foreground">"Courier"</strong> (Tráfico Postal y Envíos Urgentes) y debe pasar a <strong className="text-foreground">"Importación Ordinaria"</strong>.
                </p>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    ¿Por qué sucede?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Generalmente porque el paquete viola los límites de la categoría: supera los USD 2,000, pesa más de 50 kg, tiene más de 6 unidades de la misma referencia o requiere vistos buenos (ej. INVIMA) que no se pueden tramitar de forma simplificada.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    • Modificar la destinación de la carga por restricciones o valor
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pasar de tráfico postal (courier) a importación ordinaria.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    Consecuencia:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    El paquete se traslada a un depósito aduanero general. El cliente deberá contratar una Agencia de Aduanas externa y pagar aranceles completos según la partida arancelaria específica, perdiendo la agilidad y la tarifa plana del Courier.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Estos cambios se realizan cuando la mercancía no cumple las condiciones del régimen inicial, ya sea por valor, peso, tipo de producto o requerimientos normativos exigidos por la DIAN.
                </p>
              </div>
            </div>

            {/* 2. Retención */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <AlertCircle className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  2. Retención
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Es una medida cautelar donde la mercancía queda inmovilizada físicamente en la bodega de la agencia o de la aduana.
                </p>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    En qué consiste:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    La carga no recibe el "levante" (autorización de salida) porque la autoridad detectó alguna inconsistencia que debe aclararse.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    Causas comunes:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dudas sobre el valor declarado (subvaloración), falta de descripción detallada en la guía, o sospecha de mercancía restringida no declarada.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Durante la retención, la carga no puede ser entregada hasta que se subsanen las observaciones.
                </p>
              </div>
            </div>

            {/* 3. Reajustes */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  3. Reajustes
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Los reajustes en aduanas corresponden a la modificación de los valores inicialmente declarados, especialmente en lo relacionado con los impuestos de una mercancía tras una revisión aduanera.
                </p>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    En qué consiste:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Si declaraste que un producto vale USD 100 pero la aduana, tras consultar sus bases de datos de precios internacionales, determina que vale USD 300, ellos emiten un reajuste de valor.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    Impacto:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Esto obliga a pagar la diferencia de impuestos (IVA y Arancel) sobre la nueva base. Esto se le notifica al cliente (Dueño del paquete) para que asuma el excedente antes de que el paquete sea liberado.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Esto ocurre cuando la DIAN determina diferencias frente a la información presentada, generando cobros adicionales o correcciones obligatorias antes de la liberación de la mercancía.
                </p>
              </div>
            </div>

            {/* 4. Proceso de Apelación */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="text-secondary" size={20} />
                </div>
                <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  4. Proceso de Apelación
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  El proceso de apelación es el mecanismo mediante el cual el importador o su intermediario (agencia) puede controvertir una decisión tomada por la DIAN (como un reajuste o una sanción).
                </p>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    • Recurso de Reposición:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Se presenta ante el mismo funcionario que tomó la decisión para que la revise.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    • Recurso de la solicitud:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estos procesos se suelen realizar en los reajustes de valor y clasificación arancelaria incorrecta por parte del funcionario.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Nota importante:</strong> Estos procesos suelen requerir pruebas sólidas (facturas originales de compra, comprobantes de pago bancarios, pantallazos de la tienda online) que demuestran que el valor declarado era el real.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Liberación de Carga */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="text-primary" size={20} />
                </div>
                <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  5. Liberación de Carga
                </h2>
              </div>
              <div className="space-y-4 ml-13">
                <p className="text-muted-foreground leading-relaxed">
                  Es el objetivo final: el momento en que la autoridad otorga el <strong className="text-foreground">"Levante"</strong>.
                </p>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    En qué consiste:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Es el acto administrativo que permite que la mercancía salga de la zona primaria aduanera para ser entregada al destinatario final.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }} className="mb-2">
                    Requisitos:
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Haber pagado la totalidad de los impuestos, haber superado con éxito las inspecciones (si las hubo) y tener todos los documentos (factura, guía y manifiesto) correctamente cargados en el sistema informático aduanero y levante autorizado de la DIAN.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Después de la liberación, se procede a realizar la entrega al cliente final.
                </p>
              </div>
            </div>

            {/* Mensaje Final */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20">
              <p className="text-foreground leading-relaxed text-center">
                <strong>Rhino Special Courier</strong> te acompaña en todo el proceso, ya que seremos los primeros en ser notificados de los reajustes, retenciones, cambios de modalidad, aprehensión, apelaciones y liberación final. 🦏
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
