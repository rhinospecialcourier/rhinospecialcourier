import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bell, Package, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PreAlert {
  id: string;
  trackingNumber: string;
  store: string;
  description: string;
  estimatedValue: number;
  origin: string;
  category: string;
  status: "pending" | "received" | "processing" | "cancelled";
  createdAt: string;
  receivedAt?: string;
}

export function PreAlerts() {
  const [preAlerts, setPreAlerts] = useState<PreAlert[]>(() => {
    const saved = localStorage.getItem("rhinoPreAlerts");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    trackingNumber: "",
    store: "",
    description: "",
    estimatedValue: "",
    origin: "",
    category: "",
  });

  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.trackingNumber || !formData.store || !formData.description || 
        !formData.estimatedValue || !formData.origin || !formData.category) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const newPreAlert: PreAlert = {
      id: Date.now().toString(),
      trackingNumber: formData.trackingNumber,
      store: formData.store,
      description: formData.description,
      estimatedValue: parseFloat(formData.estimatedValue),
      origin: formData.origin,
      category: formData.category,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedPreAlerts = [...preAlerts, newPreAlert];
    setPreAlerts(updatedPreAlerts);
    localStorage.setItem("rhinoPreAlerts", JSON.stringify(updatedPreAlerts));

    toast.success("¡Pre-alerta creada exitosamente!");
    
    setFormData({
      trackingNumber: "",
      store: "",
      description: "",
      estimatedValue: "",
      origin: "",
      category: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getStatusIcon = (status: PreAlert["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="text-yellow-500" size={20} />;
      case "received":
        return <CheckCircle className="text-green-500" size={20} />;
      case "processing":
        return <Truck className="text-blue-500" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusText = (status: PreAlert["status"]) => {
    switch (status) {
      case "pending":
        return "Esperando en bodega";
      case "received":
        return "Recibido en warehouse";
      case "processing":
        return "En proceso de envío";
      case "cancelled":
        return "Cancelado";
    }
  };

  const getOriginName = (origin: string) => {
    switch (origin) {
      case "miami":
        return "Miami, USA";
      case "madrid":
        return "Madrid, España";
      case "guangzhou":
        return "Guangzhou, China";
      case "panama":
        return "Panamá";
      default:
        return origin;
    }
  };

  return (
    <section id="pre-alerts" className="py-20 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Bell className="text-primary" size={18} />
            <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Sistema de Pre-Alertas
            </span>
          </motion.div>

          <h2 className="mb-4 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent" 
              style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }}>
            Pre-Alertas de Paquetes
          </h2>
          
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Registra tus compras antes de que lleguen al warehouse para un mejor seguimiento
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setShowForm(true)} 
              variant={showForm ? "default" : "outline"}
              className={showForm ? "bg-primary text-primary-foreground" : "border-primary text-primary"}
            >
              <Package className="mr-2" size={18} />
              Crear Pre-Alerta
            </Button>
            <Button 
              onClick={() => setShowForm(false)} 
              variant={!showForm ? "default" : "outline"}
              className={!showForm ? "bg-primary text-primary-foreground" : "border-primary text-primary"}
            >
              <Bell className="mr-2" size={18} />
              Mis Pre-Alertas ({preAlerts.length})
            </Button>
          </div>
        </motion.div>

        {/* Formulario de Pre-Alerta */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Crear Nueva Pre-Alerta</CardTitle>
                <CardDescription>
                  Completa los detalles de tu compra para que podamos identificarla cuando llegue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Número de Tracking */}
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">Número de Tracking</Label>
                      <Input
                        id="trackingNumber"
                        placeholder="Ej: 1Z999AA10123456784"
                        value={formData.trackingNumber}
                        onChange={(e) => handleChange("trackingNumber", e.target.value)}
                        className="bg-input-background"
                        required
                      />
                    </div>

                    {/* Tienda */}
                    <div className="space-y-2">
                      <Label htmlFor="store">Tienda donde compraste</Label>
                      <Input
                        id="store"
                        placeholder="Ej: Amazon, eBay, AliExpress"
                        value={formData.store}
                        onChange={(e) => handleChange("store", e.target.value)}
                        className="bg-input-background"
                        required
                      />
                    </div>

                    {/* País de Origen */}
                    <div className="space-y-2">
                      <Label htmlFor="origin">País de Origen</Label>
                      <Select value={formData.origin} onValueChange={(value) => handleChange("origin", value)}>
                        <SelectTrigger id="origin" className="bg-input-background">
                          <SelectValue placeholder="Seleccionar origen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="miami">Miami, USA</SelectItem>
                          <SelectItem value="madrid">Madrid, España</SelectItem>
                          <SelectItem value="guangzhou">Guangzhou, China</SelectItem>
                          <SelectItem value="panama">Panamá</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría del Producto</Label>
                      <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                        <SelectTrigger id="category" className="bg-input-background">
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

                    {/* Valor Estimado */}
                    <div className="space-y-2">
                      <Label htmlFor="estimatedValue">Valor Estimado (USD)</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.estimatedValue}
                        onChange={(e) => handleChange("estimatedValue", e.target.value)}
                        className="bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción del Producto</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el producto que compraste..."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="bg-input-background min-h-24"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Bell className="mr-2" size={20} />
                    Crear Pre-Alerta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lista de Pre-Alertas */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {preAlerts.length === 0 ? (
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="py-12 text-center">
                  <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <h3 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    No tienes pre-alertas aún
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Crea tu primera pre-alerta para hacer seguimiento a tus compras
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Crear Pre-Alerta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {preAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="text-primary" size={24} />
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 600 }} className="mb-1">
                              {alert.store}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-1">
                              Tracking: {alert.trackingNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {alert.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <span className="text-sm" style={{ fontWeight: 500 }}>
                            {getStatusText(alert.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Origen</p>
                          <p className="text-sm" style={{ fontWeight: 500 }}>
                            {getOriginName(alert.origin)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                          <p className="text-sm" style={{ fontWeight: 500 }}>
                            {alert.category === "electronics" && "Electrónicos"}
                            {alert.category === "cellphones" && "Celulares"}
                            {alert.category === "clothing" && "Ropa y Accesorios"}
                            {alert.category === "books" && "Libros"}
                            {alert.category === "other" && "Otros"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Valor Estimado</p>
                          <p className="text-sm" style={{ fontWeight: 500 }}>
                            ${alert.estimatedValue.toFixed(2)} USD
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de Registro</p>
                          <p className="text-sm" style={{ fontWeight: 500 }}>
                            {new Date(alert.createdAt).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}