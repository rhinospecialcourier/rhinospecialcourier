import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Search, MapPin, Package, Plane, Truck, CheckCircle, Building2, Bell } from "lucide-react";
import { toast } from "sonner";

export function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  const trackPackage = () => {
    if (!trackingNumber) {
      toast.error("Por favor ingresa un número de tracking");
      return;
    }

    // Buscar en pre-alertas reales de localStorage
    const storedAlerts = localStorage.getItem('rhinoPreAlerts');
    
    if (storedAlerts) {
      try {
        const allAlerts = JSON.parse(storedAlerts);
        const preAlert = allAlerts.find(
          (alert: any) => alert.tracking_number.toUpperCase() === trackingNumber.toUpperCase()
        );

        if (preAlert) {
          // Construir timeline según el estado de la pre-alerta
          let completedSteps = 1; // Por defecto "Pre-Alertado"
          let currentStatus = "Pre-Alertado";
          let estimatedDelivery = "Pendiente de recepción";

          if (preAlert.status === "received") {
            completedSteps = 2; // Hasta "Recibido en Miami"
            currentStatus = "Recibido en Bodega";
            if (preAlert.received_at) {
              const receivedDate = new Date(preAlert.received_at);
              const deliveryDate = new Date(receivedDate.getTime() + 6 * 24 * 60 * 60 * 1000);
              estimatedDelivery = deliveryDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }
          } else if (preAlert.status === "processed") {
            completedSteps = 4; // Hasta "Aduanas Colombia"
            currentStatus = "En Proceso Aduanal";
            if (preAlert.received_at) {
              const receivedDate = new Date(preAlert.received_at);
              const deliveryDate = new Date(receivedDate.getTime() + 4 * 24 * 60 * 60 * 1000);
              estimatedDelivery = deliveryDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }
          }

          const timeline = [
            { 
              status: "Pre-Alertado", 
              location: preAlert.origin_city, 
              date: preAlert.created_at, 
              completed: completedSteps >= 1, 
              icon: Bell 
            },
            { 
              status: "Recibido en Miami", 
              location: "Miami, EE.UU.", 
              date: preAlert.received_at || "Pendiente", 
              completed: completedSteps >= 2, 
              icon: Package 
            },
            { 
              status: "Tránsito Internacional", 
              location: "En Vuelo", 
              date: completedSteps >= 3 ? "En tránsito" : "Pendiente", 
              completed: completedSteps >= 3, 
              icon: Plane 
            },
            { 
              status: "Aduanas Colombia", 
              location: "Bogotá, Colombia", 
              date: completedSteps >= 4 ? "En proceso" : "Pendiente", 
              completed: completedSteps >= 4, 
              icon: Building2 
            },
            { 
              status: "Bodega Bogotá", 
              location: preAlert.warehouse, 
              date: completedSteps >= 5 ? "En bodega" : "Pendiente", 
              completed: completedSteps >= 5, 
              icon: MapPin 
            },
            { 
              status: "En Ruta", 
              location: "Camino a tu dirección", 
              date: completedSteps >= 6 ? "En ruta" : "Pendiente", 
              completed: completedSteps >= 6, 
              icon: Truck 
            },
            { 
              status: "Entregado", 
              location: "Tu Dirección", 
              date: completedSteps >= 7 ? "Entregado" : estimatedDelivery, 
              completed: completedSteps >= 7, 
              icon: CheckCircle 
            }
          ];

          setTrackingData({
            number: trackingNumber,
            status: currentStatus,
            currentLocation: timeline.find(t => t.completed && !timeline[timeline.indexOf(t) + 1]?.completed)?.location || preAlert.warehouse,
            estimatedDelivery: estimatedDelivery,
            description: preAlert.description,
            service: preAlert.service,
            timeline: timeline
          });

          toast.success("Envío encontrado", {
            description: `${preAlert.description} - ${currentStatus}`,
            style: {
              background: '#22c55e',
              color: 'white',
              border: 'none',
            },
            className: 'toast-success-custom',
          });
          return;
        }
      } catch (error) {
        console.error('Error loading pre-alerts:', error);
      }
    }

    // Si no se encuentra, mostrar error
    setTrackingData(null);
    toast.error("Tracking no encontrado", {
      description: "Este número de tracking no ha sido pre-alertado. Por favor verifica el número o crea una pre-alerta.",
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
      },
      className: 'toast-error-custom',
    });
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
                    <Button onClick={trackPackage} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Search size={20} />
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