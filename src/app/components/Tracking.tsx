import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Search, MapPin, Package, Plane, Truck, CheckCircle, Building2, Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../supabase";

export function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackPackage = async () => {
    if (!trackingNumber) {
      toast.error("Por favor ingresa un número de tracking");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from("Paquetes")
      .select("*")
      .ilike("tracking_number", trackingNumber)
      .single();

    setIsLoading(false);

    if (error || !data) {
      setTrackingData(null);
      toast.error("Tracking no encontrado", {
        description: "Este número de tracking no existe. Por favor verifica el número.",
      });
      return;
    }

    const estadosOrden = [
      "Pre-Alertado",
      "Recibido en Bodega",
      "Tránsito Internacional",
      "Aduanas Colombia",
      "Bodega Bogotá",
      "En Ruta",
      "Entregado"
    ];

    const iconos = [Bell, Package, Plane, Building2, MapPin, Truck, CheckCircle];
    const ubicaciones = [
      data.origen || "Origen",
      "Miami, EE.UU.",
      "En Vuelo",
      "Bogotá, Colombia",
      "Bodega Bogotá",
      "Camino a tu dirección",
      "Tu Dirección"
    ];

    const estadoActualIndex = estadosOrden.indexOf(data.estado);

    const timeline = estadosOrden.map((estado, index) => ({
      status: estado,
      location: ubicaciones[index],
      date: index <= estadoActualIndex ? (index === 0 ? data.fecha_envio : "Completado") : "Pendiente",
      completed: index <= estadoActualIndex,
      icon: iconos[index]
    }));

    setTrackingData({
      number: trackingNumber,
      status: data.estado,
      estimatedDelivery: data.fecha_estimada || "Por confirmar",
      description: data.descripcion,
      timeline: timeline
    });

    toast.success("Envío encontrado");
  };

  return (
    <section id="tracking" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Rastrea tu Paquete
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Sigue tu envío en tiempo real desde el origen hasta tu puerta
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border mb-8">
              <CardHeader>
                <CardTitle>Buscar Envío</CardTitle>
                <CardDescription>
                  Ingresa tu número de rastreo para ver el estado de tu paquete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Número de Rastreo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tracking"
                      placeholder="Ej: RHINO123456789"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="bg-input-background"
                      onKeyPress={(e) => e.key === 'Enter' && trackPackage()}
                    />
                    <Button onClick={trackPackage} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {isLoading ? "..." : <Search size={20} />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trackingData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Rastreo: {trackingData.number}</CardTitle>
                        <CardDescription className="mt-2">
                          Estado: <span className="text-primary">{trackingData.status}</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Entrega Estimada</p>
                        <p className="text-primary" style={{ fontWeight: 600 }}>{trackingData.estimatedDelivery}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {trackingData.timeline.map((event: any, index: number) => {
                        const Icon = event.icon;
                        return (
                          <div key={index} className="relative">
                            <div className="flex gap-4">
                              <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  event.completed
                                    ? 'bg-primary/20 border-2 border-primary'
                                    : 'bg-muted border-2 border-border'
                                }`}>
                                  <Icon className={event.completed ? 'text-primary' : 'text-muted-foreground'} size={20} />
                                </div>
                                {index < trackingData.timeline.length - 1 && (
                                  <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 ${
                                    event.completed ? 'bg-primary' : 'bg-border'
                                  }`}></div>
                                )}
                              </div>
                              <div className="flex-1 pb-8">
                                <h4 className={event.completed ? 'text-foreground' : 'text-muted-foreground'} style={{ fontWeight: 600 }}>
                                  {event.status}
                                </h4>
                                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                  {event.location}
                                </p>
                                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                  {event.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}