import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Package, MapPin, Plane, Building2, Truck, CheckCircle2, Search, Bell, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CustomerTrackingProps {
  user: any;
  onLogout: () => void;
}

// Datos simulados de envíos (en producción vendrían de Supabase)
const mockShipments = [
  {
    tracking: "RHI2025001",
    status: "Entregado",
    currentStep: 7,
    origin: "Miami, FL",
    destination: "Bogotá, Colombia",
    estimatedDelivery: "2025-01-10",
  },
  {
    tracking: "RHI2025002",
    status: "En ruta",
    currentStep: 6,
    origin: "España, Madrid",
    destination: "Medellín, Colombia",
    estimatedDelivery: "2025-01-15",
  },
];

// Datos iniciales de pre-alertas (solo para inicialización)
const initialPreAlerts = [
  {
    id: "PA001",
    tracking_number: "1Z999AA10123456784",
    origin_city: "Miami EE.UU.",
    description: "iPhone 15 Pro Max 256GB",
    declared_value: 1200,
    insured_value: 100,
    quantity: 1,
    warehouse: "Bogotá, Colombia",
    service: "Courier",
    shipping_instructions: "",
    status: "pending", // pending, received, processed
    created_at: "2025-01-10",
    user_email: "demo@rhino.com", // Asociar a usuario
  },
  {
    id: "PA002",
    tracking_number: "92612901234567890",
    origin_city: "Madrid, España",
    description: "MacBook Air M2",
    declared_value: 999,
    insured_value: 200,
    quantity: 1,
    warehouse: "Bogotá, Colombia",
    service: "Comercial",
    shipping_instructions: "Entregar a María López - Calle 123 #45-67 Apto 301 - Tel: +57 300 123 4567",
    status: "received",
    created_at: "2025-01-08",
    received_at: "2025-01-12",
    user_email: "demo@rhino.com",
  },
];

export function CustomerTracking({ user, onLogout }: CustomerTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [preAlerts, setPreAlerts] = useState<any[]>([]);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  
  // Form state para nueva pre-alerta
  const [newAlert, setNewAlert] = useState({
    tracking_number: "",
    origin_city: "Miami EE.UU.",
    description: "",
    declared_value: "",
    insured_value: "",
    quantity: "1",
    warehouse: "Bogotá, Colombia",
    service: "Courier",
    shipping_instructions: "",
  });

  const trackingSteps = [
    { id: 1, name: "Pre-Alertado", icon: Bell, color: "primary" },
    { id: 2, name: "Recibido en Miami", icon: Package, color: "secondary" },
    { id: 3, name: "Tránsito Internacional", icon: Plane, color: "primary" },
    { id: 4, name: "Aduanas Colombia", icon: Building2, color: "secondary" },
    { id: 5, name: "Bodega Bogotá", icon: MapPin, color: "primary" },
    { id: 6, name: "En ruta", icon: Truck, color: "secondary" },
    { id: 7, name: "Entregado", icon: CheckCircle2, color: "primary" },
  ];

  // Cargar pre-alertas desde localStorage al montar el componente
  useEffect(() => {
    const storedAlerts = localStorage.getItem('rhinoPreAlerts');
    if (storedAlerts) {
      try {
        const allAlerts = JSON.parse(storedAlerts);
        // Filtrar solo las del usuario actual
        const userAlerts = allAlerts.filter((alert: any) => alert.user_email === user.email);
        setPreAlerts(userAlerts);
      } catch (error) {
        console.error('Error loading pre-alerts:', error);
        // Si hay error, cargar las iniciales
        const userPreAlerts = initialPreAlerts.filter(alert => alert.user_email === user.email);
        setPreAlerts(userPreAlerts);
      }
    } else {
      // Primera vez: cargar datos iniciales y guardarlos
      localStorage.setItem('rhinoPreAlerts', JSON.stringify(initialPreAlerts));
      const userPreAlerts = initialPreAlerts.filter(alert => alert.user_email === user.email);
      setPreAlerts(userPreAlerts);
    }
  }, [user.email]);

  // Guardar pre-alertas en localStorage cada vez que cambien
  useEffect(() => {
    if (preAlerts.length > 0 || localStorage.getItem('rhinoPreAlerts')) {
      const storedAlerts = localStorage.getItem('rhinoPreAlerts');
      let allAlerts = storedAlerts ? JSON.parse(storedAlerts) : [];
      
      // Eliminar pre-alertas antiguas del usuario actual
      allAlerts = allAlerts.filter((alert: any) => alert.user_email !== user.email);
      
      // Agregar las pre-alertas actuales del usuario
      allAlerts = [...allAlerts, ...preAlerts];
      
      localStorage.setItem('rhinoPreAlerts', JSON.stringify(allAlerts));
    }
  }, [preAlerts, user.email]);

  const handleSearch = () => {
    if (!trackingNumber) {
      toast.error("Por favor ingresa un número de tracking");
      return;
    }

    const searchTerm = trackingNumber.toUpperCase();

    // Buscar primero en pre-alertas
    const preAlert = preAlerts.find(
      alert => alert.tracking_number.toUpperCase() === searchTerm
    );

    if (preAlert) {
      // Convertir pre-alerta a formato de envío para mostrar
      let currentStep = 1; // Pre-alertado
      let status = "Pre-Alertado";

      if (preAlert.status === "received") {
        currentStep = 2; // Recibido en bodega
        status = "Recibido en Bodega";
      } else if (preAlert.status === "processed") {
        currentStep = 4; // En proceso
        status = "En Proceso";
      }

      const shipmentFromPreAlert = {
        tracking: preAlert.tracking_number,
        status: status,
        currentStep: currentStep,
        origin: preAlert.origin_city,
        destination: preAlert.warehouse,
        estimatedDelivery: preAlert.received_at 
          ? new Date(new Date(preAlert.received_at).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : "Pendiente de recepción",
        description: preAlert.description,
        isPreAlert: true,
      };

      setSelectedShipment(shipmentFromPreAlert);
      toast.success(`Pre-alerta encontrada: ${preAlert.description}`);
      return;
    }

    // Buscar en envíos simulados
    const shipment = mockShipments.find(s => s.tracking === searchTerm);
    
    if (shipment) {
      setSelectedShipment({...shipment, isPreAlert: false});
      toast.success("Envío encontrado");
      return;
    }

    // No se encontró nada
    setSelectedShipment(null);
    toast.error("Tracking no encontrado", {
      description: "Este número de tracking no ha sido pre-alertado. Por favor crea una pre-alerta primero.",
    });
  };

  const handleCreatePreAlert = () => {
    if (!newAlert.tracking_number || !newAlert.origin_city || !newAlert.description || !newAlert.declared_value) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    // Validar valor asegurado
    const insuredValue = parseFloat(newAlert.insured_value || "0");
    if (insuredValue > 2000) {
      toast.error("El valor máximo a asegurar es $2,000 USD");
      return;
    }

    const alert = {
      id: `PA${String(preAlerts.length + 1).padStart(3, '0')}`,
      tracking_number: newAlert.tracking_number,
      origin_city: newAlert.origin_city,
      description: newAlert.description,
      declared_value: parseFloat(newAlert.declared_value),
      insured_value: insuredValue,
      quantity: parseInt(newAlert.quantity),
      warehouse: newAlert.warehouse,
      service: newAlert.service,
      shipping_instructions: newAlert.shipping_instructions,
      status: "pending",
      created_at: new Date().toISOString().split('T')[0],
      user_email: user.email,
    };

    setPreAlerts([alert, ...preAlerts]);
    setNewAlert({
      tracking_number: "",
      origin_city: "Miami EE.UU.",
      description: "",
      declared_value: "",
      insured_value: "",
      quantity: "1",
      warehouse: "Bogotá, Colombia",
      service: "Courier",
      shipping_instructions: "",
    });
    setIsCreatingAlert(false);
    toast.success("Pre-alerta creada exitosamente");
  };

  const handleDeletePreAlert = (id: string) => {
    setPreAlerts(preAlerts.filter(alert => alert.id !== id));
    toast.success("Pre-alerta eliminada");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", className: "bg-primary/20 text-primary border-primary/40" },
      received: { label: "Recibido", className: "bg-secondary/20 text-secondary border-secondary/40" },
      processed: { label: "Procesado", className: "bg-green-500/20 text-green-400 border-green-500/40" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div>
              <h2 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Bienvenido, {user.name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-muted-foreground">{user.city}</p>
              {user.casillero && (
                <p className="text-primary mt-2" style={{ fontWeight: 600 }}>
                  Tu Casillero: {user.casillero}
                </p>
              )}
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              Cerrar Sesión
            </Button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="tracking" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Package size={18} />
                Mis Envíos
              </TabsTrigger>
              <TabsTrigger value="prealerts" className="flex items-center gap-2">
                <Bell size={18} />
                Pre-Alertas
              </TabsTrigger>
            </TabsList>

            {/* Tab: Mis Envíos */}
            <TabsContent value="tracking" className="space-y-8">
              {/* Tracking Search */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Rastrear Envío</CardTitle>
                  <CardDescription>
                    Ingresa tu número de guía para rastrear tu paquete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tracking">Número de Tracking</Label>
                      <Input
                        id="tracking"
                        placeholder="Ej: RHI2025001"
                        className="bg-input-background"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleSearch}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Search className="mr-2" size={20} />
                        Buscar
                      </Button>
                    </div>
                  </div>

                  {/* Tracking numbers demo */}
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-2" style={{ fontSize: '0.875rem' }}>
                      <strong>Números de prueba:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mockShipments.map((shipment) => (
                        <button
                          key={shipment.tracking}
                          onClick={() => {
                            setTrackingNumber(shipment.tracking);
                            setSelectedShipment({...shipment, isPreAlert: false});
                          }}
                          className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          style={{ fontSize: '0.875rem' }}
                        >
                          {shipment.tracking}
                        </button>
                      ))}
                      {preAlerts.map((alert) => (
                        <button
                          key={alert.tracking_number}
                          onClick={() => {
                            setTrackingNumber(alert.tracking_number);
                            handleSearch();
                          }}
                          className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                          style={{ fontSize: '0.875rem' }}
                        >
                          {alert.tracking_number}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              {selectedShipment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Tracking: {selectedShipment.tracking}</CardTitle>
                          <CardDescription className="mt-2">
                            Origen: {selectedShipment.origin} → Destino: {selectedShipment.destination}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                            <p className="text-primary" style={{ fontWeight: 600 }}>
                              {selectedShipment.status}
                            </p>
                            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                              Est: {selectedShipment.estimatedDelivery}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {trackingSteps.map((step, index) => {
                          const isCompleted = step.id <= selectedShipment.currentStep;
                          const isCurrent = step.id === selectedShipment.currentStep;
                          const Icon = step.icon;

                          return (
                            <div key={step.id} className="relative">
                              {/* Vertical Line */}
                              {index < trackingSteps.length - 1 && (
                                <div
                                  className={`absolute left-6 top-12 w-0.5 h-16 ${
                                      step.id < selectedShipment.currentStep
                                        ? step.color === "primary" ? "bg-primary" : "bg-secondary"
                                        : "bg-border"
                                  }`}
                                />
                              )}

                              {/* Step */}
                              <div className="flex items-start gap-4 mb-8 relative">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                                    isCompleted
                                      ? step.color === "primary"
                                        ? "bg-primary/20 border-primary"
                                        : "bg-secondary/20 border-secondary"
                                      : "bg-muted border-border"
                                  } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                                >
                                  <Icon
                                    className={
                                      isCompleted
                                        ? step.color === "primary"
                                          ? "text-primary"
                                          : "text-secondary"
                                        : "text-muted-foreground"
                                    }
                                    size={24}
                                  />
                                </div>

                                <div className="flex-1 pt-2">
                                  <h3
                                    className={isCompleted ? "text-foreground" : "text-muted-foreground"}
                                    style={{ fontWeight: 600 }}
                                  >
                                    {step.name}
                                  </h3>
                                  {isCurrent && (
                                    <p className="text-primary mt-1" style={{ fontSize: '0.875rem' }}>
                                      Estado actual
                                    </p>
                                  )}
                                  {isCompleted && !isCurrent && (
                                    <p className="text-muted-foreground mt-1" style={{ fontSize: '0.875rem' }}>
                                      Completado
                                    </p>
                                  )}
                                </div>

                                {isCurrent && (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* Tab: Pre-Alertas */}
            <TabsContent value="prealerts" className="space-y-8">
              {/* Create Pre-Alert Button */}
              {!isCreatingAlert && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsCreatingAlert(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="mr-2" size={20} />
                    Nueva Pre-Alerta
                  </Button>
                </div>
              )}

              {/* Create Pre-Alert Form */}
              {isCreatingAlert && (
                <Card className="bg-card border-border border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-primary">Crear Nueva Pre-Alerta</CardTitle>
                    <CardDescription>
                      Registra tu compra internacional antes de que llegue a nuestra bodega
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alert-tracking">Número de Tracking *</Label>
                        <Input
                          id="alert-tracking"
                          placeholder="Ej: 1Z999AA10123456784"
                          value={newAlert.tracking_number}
                          onChange={(e) => setNewAlert({...newAlert, tracking_number: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-service">Servicio *</Label>
                        <Select
                          value={newAlert.service}
                          onValueChange={(value) => setNewAlert({...newAlert, service: value})}
                        >
                          <SelectTrigger id="alert-service">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Courier">Courier</SelectItem>
                            <SelectItem value="Comercial">Comercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alert-origin">Ciudad Origen *</Label>
                        <Select
                          value={newAlert.origin_city}
                          onValueChange={(value) => setNewAlert({...newAlert, origin_city: value})}>
                          <SelectTrigger id="alert-origin">
                            <SelectValue placeholder="Selecciona ciudad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Miami EE.UU.">Miami EE.UU.</SelectItem>
                            <SelectItem value="Madrid, España">Madrid, España</SelectItem>
                            <SelectItem value="Guangzhou, China">Guangzhou, China</SelectItem>
                            <SelectItem value="Panamá">Panamá</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-warehouse">Ciudad Destino</Label>
                        <Input
                          id="alert-warehouse"
                          value="Bogotá, Colombia"
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-description">Descripción del Producto *</Label>
                      <Textarea
                        id="alert-description"
                        placeholder="Ej: iPhone 15 Pro Max 256GB Color Negro"
                        value={newAlert.description}
                        onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alert-value">Valor Declarado (USD) *</Label>
                        <Input
                          id="alert-value"
                          type="number"
                          step="0.01"
                          placeholder="999.99"
                          value={newAlert.declared_value}
                          onChange={(e) => setNewAlert({...newAlert, declared_value: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-insured">
                          Valor a Asegurar (USD)
                          <span className="text-muted-foreground text-xs ml-1">
                            (Máx. $2,000)
                          </span>
                        </Label>
                        <Input
                          id="alert-insured"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          max="2000"
                          value={newAlert.insured_value}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (value <= 2000) {
                              setNewAlert({...newAlert, insured_value: e.target.value});
                            }
                          }}
                        />
                        {newAlert.insured_value && parseFloat(newAlert.insured_value) > 0 && (() => {
                          const insuredVal = parseFloat(newAlert.insured_value);
                          let insuranceCost = 0;
                          
                          if (newAlert.service === "Courier") {
                            insuranceCost = insuredVal <= 100 ? 3 : insuredVal * 0.04;
                          } else {
                            insuranceCost = insuredVal <= 200 ? 6 : insuredVal * 0.04;
                          }
                          
                          return (
                            <p className="text-xs text-muted-foreground">
                              Costo seguro: ${insuranceCost.toFixed(2)} USD
                              {newAlert.service === "Courier" && insuredVal <= 100 && " (Tarifa fija)"}
                              {newAlert.service === "Comercial" && insuredVal <= 200 && " (Tarifa fija)"}
                              {((newAlert.service === "Courier" && insuredVal > 100) || (newAlert.service === "Comercial" && insuredVal > 200)) && " (4% del valor)"}
                            </p>
                          );
                        })()}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-quantity">Cantidad</Label>
                        <Input
                          id="alert-quantity"
                          type="number"
                          min="1"
                          value={newAlert.quantity}
                          onChange={(e) => setNewAlert({...newAlert, quantity: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-instructions">Instrucciones de Envío</Label>
                      <Textarea
                        id="alert-instructions"
                        placeholder="Ej: Entregar a María López - Calle 123 #45-67 Apto 301 - Tel: +57 300 123 4567"
                        value={newAlert.shipping_instructions}
                        onChange={(e) => setNewAlert({...newAlert, shipping_instructions: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreatePreAlert}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="mr-2" size={18} />
                        Crear Pre-Alerta
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCreatingAlert(false);
                          setNewAlert({
                            tracking_number: "",
                            origin_city: "Miami EE.UU.",
                            description: "",
                            declared_value: "",
                            insured_value: "",
                            quantity: "1",
                            warehouse: "Bogotá, Colombia",
                            service: "Courier",
                            shipping_instructions: "",
                          });
                        }}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pre-Alerts List */}
              <div className="space-y-4">
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Mis Pre-Alertas ({preAlerts.length})
                </h3>

                {preAlerts.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <Bell className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">
                        No tienes pre-alertas registradas. Crea una para registrar tus compras internacionales.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  preAlerts.map((alert) => (
                    <Card key={alert.id} className="bg-card border-border hover:border-primary/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 style={{ fontWeight: 600 }}>{alert.description}</h4>
                              {getStatusBadge(alert.status)}
                            </div>
                            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                              ID: {alert.id}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeletePreAlert(alert.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Tracking</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              {alert.tracking_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Servicio</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              {alert.service}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Ciudad Origen</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              {alert.origin_city}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Bodega</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              {alert.warehouse}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
                          <div>
                            <p className="text-muted-foreground mb-1">Valor Declarado</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              ${alert.declared_value} USD
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Valor Asegurado</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              ${alert.insured_value} USD
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Costo: ${(() => {
                                const insuredVal = alert.insured_value;
                                if (alert.service === "Courier") {
                                  return insuredVal <= 100 ? "3.00" : (insuredVal * 0.04).toFixed(2);
                                } else {
                                  return insuredVal <= 200 ? "6.00" : (insuredVal * 0.04).toFixed(2);
                                }
                              })()} USD
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Cantidad</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>
                              {alert.quantity}
                            </p>
                          </div>
                        </div>

                        {alert.shipping_instructions && (
                          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                            <p className="text-muted-foreground mb-1">Instrucciones de Envío:</p>
                            <p className="text-foreground">{alert.shipping_instructions}</p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-muted-foreground">Creado: </span>
                              <span className="text-foreground">{alert.created_at}</span>
                            </div>
                            {alert.received_at && (
                              <div>
                                <span className="text-muted-foreground">Recibido: </span>
                                <span className="text-secondary" style={{ fontWeight: 500 }}>
                                  {alert.received_at}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}