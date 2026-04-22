import { motion } from "motion/react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calculator as CalcIcon, DollarSign, Check, MessageCircle } from "lucide-react";

export function Calculator() {
  const [modality, setModality] = useState("courier");
  const [weight, setWeight] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [productValue, setProductValue] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [estimate, setEstimate] = useState<{
    shippingCost: number;
    fixedCost: number;
    insurance: number;
    cellPhoneCost: number;
    volumeCost: number;
    arancel: number;
    iva: number;
    total: number;
    volumetricWeight: number;
    billableWeight: number;
    actualWeight: number;
    cityName: string;
    categoryName: string;
    warning?: string;
  } | null>(null);

  const calculateShipping = () => {
    if (!city) return;

    const declaredValue = parseFloat(productValue) || 0;
    
    // Validar peso para modalidad comercial
    const weightLbs = parseFloat(weight);
    let warningMessage = "";
    let effectiveWeight = weightLbs; // Peso efectivo para el cálculo
    
    if (modality === "comercial" && category !== "cellphones" && weightLbs < 10) {
      // En comercial, si es menor a 10 libras, se cobra como 10 libras
      effectiveWeight = 10;
      warningMessage = "⚠️ El cobro mínimo en modalidad COMERCIAL es de 10 libras. El costo mostrado corresponde a 10 libras.";
    }

    // Costos por libra y volumen según la ciudad y modalidad
    let pricePerLb = 0;
    let pricePerVolumeLb = 0; // Precio por libra de volumen excedente
    let volumeDivisor = 6000; // Divisor para cálculo volumétrico
    let cityName = "";
    
    if (city === "miami") {
      pricePerLb = modality === "courier" ? 2.00 : 4.50;
      pricePerVolumeLb = 0.50;
      volumeDivisor = 6000;
      cityName = "Miami, USA";
    } else if (city === "madrid") {
      pricePerLb = modality === "courier" ? 7.50 : 9.00;
      pricePerVolumeLb = 4.00;
      volumeDivisor = 6000;
      cityName = "Madrid, España";
    } else if (city === "guangzhou") {
      pricePerLb = modality === "courier" ? 8.00 : 11.00;
      pricePerVolumeLb = 5.00;
      volumeDivisor = 5000;
      cityName = "Guangzhou, China";
    } else if (city === "panama") {
      pricePerLb = modality === "courier" ? 0 : 7.20;
      pricePerVolumeLb = modality === "courier" ? 0 : 5.00;
      volumeDivisor = 5000;
      cityName = "Ciudad de Panamá, Panamá";
    }

    // Nombre de la categoría
    let categoryName = "";
    if (category === "electronics") categoryName = "Electrónicos";
    else if (category === "clothing") categoryName = "Ropa y Accesorios";
    else if (category === "books") categoryName = "Libros";
    else if (category === "cellphones") categoryName = "Celulares";
    else if (category === "other") categoryName = "Otros";
    else categoryName = "No especificado";

    // CASO ESPECIAL: CELULARES
    // Solo se aceptan desde Miami y tienen tarifa fija de $45 USD
    if (category === "cellphones") {
      if (city !== "miami") {
        // No se aceptan celulares desde España o China
        alert("Lo sentimos, solo aceptamos envíos de celulares desde Miami, Estados Unidos.");
        return;
      }
      // Para celulares desde Miami: tarifa fija de $45 USD sin otros cargos
      setEstimate({
        shippingCost: 0,
        fixedCost: 0,
        insurance: 0,
        cellPhoneCost: 45,
        volumeCost: 0,
        arancel: 0,
        iva: 0,
        total: 45,
        volumetricWeight: 0,
        billableWeight: 0,
        actualWeight: 0,
        cityName,
        categoryName
      });
      return;
    }

    // PARA OTROS PRODUCTOS (no celulares)
    if (!weightLbs) return;

    // Calcular peso volumétrico según el país
    // Fórmula: (largo × ancho × alto) / divisor * 2.2046
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const volumetricWeight = (l * w * h) / volumeDivisor * 2.2046;

    // El peso facturable (billable) es el mayor entre peso real y peso volumétrico
    const billableWeight = Math.max(effectiveWeight, volumetricWeight);

    // Costo base de envío: se cobra sobre el peso efectivo (mínimo 10 libras en comercial)
    const shippingCost = effectiveWeight * pricePerLb;

    // Costo adicional por volumen
    // Si el peso volumétrico es mayor que el físico, se cobra la diferencia al precio por volumen
    let volumeCost = 0;
    if (volumetricWeight > weightLbs) {
      const volumeDifference = volumetricWeight - weightLbs;
      volumeCost = volumeDifference * pricePerVolumeLb;
    }

    // Costos fijos y seguro según modalidad
    let fixedCost = 0;
    let insurance = 0;
    
    if (modality === "courier") {
      // MODALIDAD COURIER:
      // - Miami: costos fijos GRATIS si > 15 libras, pero seguro SÍ se cobra
      // - España y China: costos fijos y seguro se cobran SIEMPRE
      if (city === "miami") {
        fixedCost = billableWeight > 15 ? 0 : 5;
        insurance = 3; // Seguro SIEMPRE se cobra en Miami
      } else if (city === "madrid" || city === "guangzhou") {
        fixedCost = 5; // Costos fijos SIEMPRE en España y China
        insurance = 3; // Seguro SIEMPRE en España y China
      } else {
        // Para otros orígenes (como Panama en courier, aunque no es común)
        fixedCost = billableWeight > 15 ? 0 : 5;
        insurance = 3;
      }
    } else {
      // MODALIDAD COMERCIAL:
      // - Sin costo fijo
      // - Seguro de $5 SIEMPRE desde todos los orígenes
      fixedCost = 0;
      insurance = 5; // Seguro SIEMPRE en comercial
    }

    // Cálculo de impuestos según país y valor declarado
    // IMPORTANTE: Los impuestos solo aplican en modalidad COURIER, no en COMERCIAL
    let arancel = 0;
    let iva = 0;

    if (modality === "courier") {
      if (city === "miami") {
        // PARA MIAMI: Solo aplica si valor > $200 USD (desde $201 en adelante)
        if (declaredValue > 200) {
          arancel = declaredValue * 0.10; // 10% de arancel
          iva = (declaredValue + arancel) * 0.19; // 19% de IVA sobre (valor + arancel)
        }
      } else if (city === "madrid" || city === "guangzhou") {
        // PARA ESPAÑA Y CHINA
        if (declaredValue >= 1) {
          // Desde $1 USD aplica IVA
          if (declaredValue > 200) {
            // Mayor a $200: aplica ARANCEL + IVA
            arancel = declaredValue * 0.10; // 10% de arancel
            iva = (declaredValue + arancel) * 0.19; // 19% de IVA sobre (valor + arancel)
          } else {
            // Entre $1 y $200: solo IVA
            iva = declaredValue * 0.19; // 19% de IVA
          }
        }
      }
    }

    // Total
    const total = shippingCost + volumeCost + fixedCost + insurance + arancel + iva;

    setEstimate({
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      fixedCost,
      insurance,
      cellPhoneCost: 0,
      volumeCost: parseFloat(volumeCost.toFixed(2)),
      arancel: parseFloat(arancel.toFixed(2)),
      iva: parseFloat(iva.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      volumetricWeight: parseFloat(volumetricWeight.toFixed(2)),
      billableWeight: parseFloat(billableWeight.toFixed(2)),
      actualWeight: weightLbs,
      cityName,
      categoryName,
      warning: warningMessage
    });
  };

  return (
    <section id="calculator" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <CalcIcon className="text-primary" size={18} />
            <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Calculadora de Envíos
            </span>
          </motion.div>

          {/* Title with Gradient */}
          <h2 className="mb-4 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent" 
              style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }}>
            Cotiza tu Envío
          </h2>
          
          <p className="text-muted-foreground mb-8" style={{ fontSize: '1.125rem' }}>
            Calcula el costo de tu importación en segundos
          </p>

          {/* Información de Costos y Restricciones */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            {/* Tabla Modalidad COURIER */}
            <div className="bg-card/80 border border-primary/30 rounded-xl p-6">
              <h3 className="text-primary mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                📦 Modalidad COURIER
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">💰 <strong>Costo Fijo:</strong> $5.00 USD</p>
                  <p className="text-xs text-muted-foreground ml-5">Incluye: Guía internacional, liberación aduanal, nacionalización y entrega en Colombia</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">🛡️ <strong>Seguro:</strong> $3.00 USD</p>
                  <p className="text-xs text-muted-foreground ml-5">Cubre hasta $100 USD por pérdida o daño al 100%</p>
                </div>

                <div className="text-sm text-amber-400 bg-amber-400/10 p-2 rounded">
                  <p className="mb-1">⚠️ <strong>Restricciones:</strong></p>
                  <p className="text-xs ml-5">• Medidas máximas: 150 CM por lado</p>
                  <p className="text-xs ml-5">• Valor declarado máximo: $2,000 USD</p>
                  <p className="text-xs ml-5">• Productos con valor declarado menor a $200 NO pagan impuestos desde Estados Unidos</p>
                  <p className="text-xs ml-5">• Los demás países de origen pagan IVA desde $1 USD y mayor a $200 USD paga ARANCEL E IVA</p>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Costo por libra (peso real):</strong></p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Miami</p>
                    <p className="text-white">$2.00</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Madrid</p>
                    <p className="text-white">$7.50</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Guangzhou</p>
                    <p className="text-white">$8.00</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Costo por libra volumen:</strong></p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Miami</p>
                    <p className="text-white">$0.50</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Madrid</p>
                    <p className="text-white">$4.00</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-primary font-semibold">Guangzhou</p>
                    <p className="text-white">$5.00</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Fórmulas de peso volumétrico:</strong></p>
                <div className="text-xs space-y-1 bg-background/30 p-2 rounded">
                  <p className="text-white"><strong>Miami/Madrid:</strong> (L×A×P CM) / 6000 × 2.2046 = Peso volumen</p>
                  <p className="text-white"><strong>Guangzhou:</strong> (L×A×P CM) / 5000 × 2.2046 = Peso volumen</p>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-3 mt-3">
                <p className="text-xs text-cyan-400">
                  ℹ️ Para consolidar paquetes, indique el valor declarado total de los paquetes y los números de tracking
                </p>
              </div>
            </div>

            {/* Tabla Modalidad COMERCIAL */}
            <div className="bg-card/80 border border-secondary/30 rounded-xl p-6">
              <h3 className="text-secondary mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                🏢 Modalidad COMERCIAL
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">💼 <strong>Carga Consolidada</strong></p>
                  <p className="text-xs text-muted-foreground mt-1">Todo incluido hasta la entrega en Bogotá</p>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">🛡️ <strong>Seguro:</strong> $5.00 USD (fijo)</p>
                  <p className="text-xs text-muted-foreground ml-5">Incluido en el servicio</p>
                  <p className="text-xs text-muted-foreground ml-5">Cubre hasta $200 USD por pérdida o daño al 100%</p>
                </div>

                <div className="text-sm text-green-400 bg-green-400/10 p-2 rounded">
                  <p className="mb-1">✅ <strong>Ventajas:</strong></p>
                  <p className="text-xs ml-5">• Sin costos fijos adicionales</p>
                  <p className="text-xs ml-5">• Sin impuestos de importación</p>
                  <p className="text-xs ml-5">• Peso mínimo: 10 libras</p>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Costo por libra (peso real):</strong></p>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Miami</p>
                    <p className="text-white">$4.50</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Madrid</p>
                    <p className="text-white">$9.00</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Guangzhou</p>
                    <p className="text-white">$11.00</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Panamá</p>
                    <p className="text-white">$7.20</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Costo por libra volumen:</strong></p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Miami</p>
                    <p className="text-white">$0.50</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Madrid</p>
                    <p className="text-white">$4.00</p>
                  </div>
                  <div className="bg-background/50 p-2 rounded text-center">
                    <p className="text-secondary font-semibold">Guangzhou</p>
                    <p className="text-white">$5.00</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2"><strong>Fórmulas de peso volumétrico:</strong></p>
                <div className="text-xs space-y-1 bg-background/30 p-2 rounded">
                  <p className="text-white"><strong>Miami/Madrid:</strong> (L×A×P CM) / 6000 × 2.2046 = Peso volumen</p>
                  <p className="text-white"><strong>Guangzhou/Panamá:</strong> (L×A×P CM) / 5000 × 2.2046 = Peso volumen</p>
                  <p className="text-amber-400 mt-2"><strong>Panamá:</strong> Si el volumen es mayor al peso desde Panamá, se cobrará en su totalidad.</p>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-3 mt-3">
                <p className="text-xs text-purple-400">
                  ℹ️ Ideal para envíos comerciales de mayor volumen
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recuadro de EXPORTACIONES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/40 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-secondary text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            EXPORTACIONES
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Para todas las exportaciones se cotiza bajo la información compartida, ten en cuenta que para exportación necesitamos <strong className="text-white">nombre del producto, cantidad, valor declarado, destino, medidas de empaque y foto</strong> para confirmar el ingreso del producto con las autoridades aduaneras correspondientes.
          </p>
          <div className="text-center">
            <p className="text-muted-foreground mb-3">Cualquier duda o solicitud escríbenos:</p>
            <a 
              href="https://wa.me/573204775878" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <MessageCircle size={20} />
              <span style={{ fontWeight: 600 }}>WhatsApp</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Modalidad de Importación */}
          <div className="mb-8">
            <h3 className="text-primary text-center mb-6" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              Modalidad de Importación
            </h3>
            <RadioGroup value={modality} onValueChange={setModality} className="flex gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="courier" id="courier" className="border-primary text-primary" />
                <Label 
                  htmlFor="courier" 
                  className="cursor-pointer flex-1 p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: modality === "courier" ? "#00D9FF" : "rgba(0, 217, 255, 0.2)",
                    backgroundColor: modality === "courier" ? "rgba(0, 217, 255, 0.1)" : "transparent"
                  }}
                >
                  <div>
                    <div className="font-semibold text-foreground">Courier</div>
                    <div className="text-sm text-muted-foreground">Envíos estándar</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="comercial" id="comercial" className="border-primary text-primary" />
                <Label 
                  htmlFor="comercial" 
                  className="cursor-pointer flex-1 p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: modality === "comercial" ? "#00D9FF" : "rgba(0, 217, 255, 0.2)",
                    backgroundColor: modality === "comercial" ? "rgba(0, 217, 255, 0.1)" : "transparent"
                  }}
                >
                  <div>
                    <div className="font-semibold text-foreground">Comercial</div>
                    <div className="text-sm text-muted-foreground">Importación comercial</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Form Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* País de Origen */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">País de Origen</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city" className="bg-background/50 border-primary/30 h-12">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miami">Miami, USA</SelectItem>
                  <SelectItem value="madrid">Madrid, España</SelectItem>
                  <SelectItem value="guangzhou">Guangzhou, China</SelectItem>
                  <SelectItem value="panama">Ciudad de Panamá, Panamá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoría del Producto */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">Categoría del Producto</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-background/50 border-primary/30 h-12">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electrónicos</SelectItem>
                  <SelectItem value="cellphones">Celulares</SelectItem>
                  <SelectItem value="clothing">Ropa y Accesorios</SelectItem>
                  <SelectItem value="books">Libros</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-foreground">Peso (libras)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-background/50 border-primary/30 h-12"
              />
            </div>

            {/* Valor del Producto */}
            <div className="space-y-2">
              <Label htmlFor="value" className="text-foreground">Valor del Producto (USD)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                className="bg-background/50 border-primary/30 h-12"
              />
            </div>

            {/* Largo */}
            <div className="space-y-2">
              <Label htmlFor="length" className="text-foreground">Largo (cm)</Label>
              <Input
                id="length"
                type="number"
                placeholder="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-background/50 border-primary/30 h-12"
              />
            </div>

            {/* Ancho */}
            <div className="space-y-2">
              <Label htmlFor="width" className="text-foreground">Ancho (cm)</Label>
              <Input
                id="width"
                type="number"
                placeholder="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="bg-background/50 border-primary/30 h-12"
              />
            </div>

            {/* Alto */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="height" className="text-foreground">Alto (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-background/50 border-primary/30 h-12"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={calculateShipping} 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 transition-all"
            disabled={category === "cellphones" ? !city : (!weight || !city)}
          >
            <CalcIcon className="mr-2" size={20} />
            Calcular Costo de Envío
          </Button>

          {/* Results */}
          {estimate !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              {/* Resultado de Cotización */}
              <div className="p-6 rounded-xl bg-[#1a1f3a] border border-primary/30 space-y-4">
                {/* Título */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-[#00D9FF]" size={24} />
                  <h3 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Resultado de Cotización
                  </h3>
                </div>

                {/* Nota verde si es mayor a 15 libras */}
                {estimate.billableWeight > 15 && estimate.cityName === "Miami, USA" && modality === "courier" && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-900/30 border border-green-600/50">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-green-400" style={{ fontSize: '0.9rem' }}>
                      Envío mayor a 15 libras desde Miami: Costos fijos GRATIS. Seguro: $3.00 USD
                    </p>
                  </div>
                )}

                {/* Mensaje de advertencia para peso mínimo comercial */}
                {estimate.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-900/30 border border-amber-600/50">
                    <div className="text-amber-400" style={{ fontSize: '0.9rem' }}>
                      {estimate.warning}
                    </div>
                  </div>
                )}

                {/* Info principal: País y Categoría */}
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-600/50">
                  <div>
                    <span className="text-slate-400" style={{ fontSize: '0.9rem' }}>País:</span>
                    <span className="text-white ml-2" style={{ fontWeight: 500 }}>{estimate.cityName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400" style={{ fontSize: '0.9rem' }}>Categoría:</span>
                    <span className="text-white ml-2" style={{ fontWeight: 500 }}>{estimate.categoryName}</span>
                  </div>
                </div>

                {/* Peso Volumen y Libras a Cobrar */}
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-600/50">
                  <div>
                    <span className="text-slate-400" style={{ fontSize: '0.9rem' }}>Peso Volumen:</span>
                    <span className="text-white ml-2" style={{ fontWeight: 500 }}>{estimate.volumetricWeight.toFixed(2)} lb</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400" style={{ fontSize: '0.9rem' }}>Libras Volumen a Cobrar:</span>
                    <span className="text-white ml-2" style={{ fontWeight: 500 }}>
                      {estimate.volumetricWeight > estimate.actualWeight 
                        ? (estimate.volumetricWeight - estimate.actualWeight).toFixed(2) 
                        : "0.00"} lb
                    </span>
                  </div>
                </div>

                {/* Desglose de costos */}
                <div className="space-y-2 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Costo de Envío:</span>
                    <span className="text-white" style={{ fontWeight: 500 }}>${estimate.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {estimate.cellPhoneCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Costo por Celular:</span>
                      <span className="text-white" style={{ fontWeight: 500 }}>${estimate.cellPhoneCost.toFixed(2)}</span>
                    </div>
                  )}

                  {estimate.volumeCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Costo por Volumen:</span>
                      <span className="text-white" style={{ fontWeight: 500 }}>${estimate.volumeCost.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={(estimate.billableWeight > 15 && estimate.cityName === "Miami, USA" && modality === "courier") ? "text-green-500" : "text-slate-300"}>
                      Costo Fijo:
                    </span>
                    <span className={(estimate.billableWeight > 15 && estimate.cityName === "Miami, USA" && modality === "courier") ? "text-green-500 line-through" : "text-white"} 
                          style={{ fontWeight: 500 }}>
                      ${estimate.fixedCost.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      Seguro:
                    </span>
                    <span className="text-white" 
                          style={{ fontWeight: 500 }}>
                      ${estimate.insurance.toFixed(2)}
                    </span>
                  </div>

                  {estimate.arancel > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Arancel (10%):</span>
                      <span className="text-white" style={{ fontWeight: 500 }}>${estimate.arancel.toFixed(2)}</span>
                    </div>
                  )}

                  {estimate.iva > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">IVA (19%):</span>
                      <span className="text-white" style={{ fontWeight: 500 }}>${estimate.iva.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-slate-600/50">
                  <div className="flex justify-between items-center">
                    <span className="text-white" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      TOTAL:
                    </span>
                    <span className="text-[#00D9FF]" style={{ fontSize: '2rem', fontWeight: 700 }}>
                      ${estimate.total.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}