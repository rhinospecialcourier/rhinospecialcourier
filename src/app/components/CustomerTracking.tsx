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
import { Package, MapPin, Plane, Building2, Truck, CheckCircle2, Search, Bell, Plus, Trash2, User, Pencil, Save, X, Phone, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../supabase";

interface CustomerTrackingProps {
  user: any;
  onLogout: () => void;
  onUpdateUser: (user: any) => void;
}

const departamentosColombia = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

const trackingSteps = [
  { id: 1, name: "Pre-Alertado", icon: Bell, color: "primary" },
  { id: 2, name: "Recibido en Bodega", icon: Package, color: "secondary" },
  { id: 3, name: "Tránsito Internacional", icon: Plane, color: "primary" },
  { id: 4, name: "Aduanas Colombia", icon: Building2, color: "secondary" },
  { id: 5, name: "Bodega Bogotá", icon: MapPin, color: "primary" },
  { id: 6, name: "En Ruta", icon: Truck, color: "secondary" },
  { id: 7, name: "Entregado", icon: CheckCircle2, color: "primary" },
];

const stepMap: Record<string, number> = {
  "Pre-Alertado": 1,
  "Recibido en Bodega": 2,
  "Tránsito Internacional": 3,
  "Aduanas Colombia": 4,
  "Bodega Bogotá": 5,
  "En Ruta": 6,
  "Entregado": 7,
};

const sedes = [
  {
    flag: "🇺🇸",
    title: "Estados Unidos - Casillero Internacional / Courier",
    address: ["10900 NW 21st Suite 220", "Doral, FL", "ZP 33172"],
    phone: "+1 786 845 9180",
    phoneHref: "tel:+17868459180",
    schedule: ["Lunes a Viernes: 9:00 – 16:30"],
    marking: "Nombre Cliente / Número de Casillero",
    delivery: "5-7 días",
  },
  {
    flag: "🇺🇸",
    title: "Estados Unidos - Carga Comercial",
    address: ["5141 NW 49TH AVENUE UNIT 30C"],
    phone: "+1 786 266 0324",
    phoneHref: "tel:+17862660324",
    schedule: ["Lunes a Viernes: 9:00 – 16:30"],
    marking: "RHINO SPECIAL / DL-00199",
    delivery: "5-7 días",
  },
  {
    flag: "🇨🇳",
    title: "China - Vía Aérea",
    address: [
      "广州市 天河区珠江新城 华强路3号富力盈力大厦南塔 2505",
      "Room 2505, South Tower, R&F Yingli Building, No. 3 Huaqiang Road, Zhujiang New Town, Tianhe District",
      "Guangzhou, China",
      "ZP 510000",
    ],
    phone: "+1 592 010 4310",
    phoneHref: "tel:+15920104310",
    contact: "Green",
    schedule: ["Lunes a Viernes: 9:00 – 16:30"],
    marking: "MASA-NGR / Casillero / Nombre Cliente",
    delivery: "15 días, sale cada viernes",
  },
  {
    flag: "🇨🇳",
    title: "China - Vía Marítima",
    address: [
      "义乌青口东苑工业区东山路33号",
      "No. 33, Dongshan Road, Dongyuan Industrial Zone, Qingkou, Yiwu",
      "Guangzhou, China",
      "ZP 510000",
    ],
    phone: "+1 592 010 4310",
    phoneHref: "tel:+15920104310",
    contact: "Green",
    schedule: ["Lunes a Viernes: 9:00 – 16:30"],
    marking: "MASA-NGR / Casillero / Nombre Cliente",
    delivery: "15 días, sale cada viernes",
  },
  {
    flag: "🇪🇸",
    title: "España",
    address: ["Calle San Jaime 1", "28031, Madrid", "Oficina: HA009"],
    company: "Anka Cargo Logistics S.L",
    phone: "+34 606 510 862",
    phoneHref: "tel:+34606510862",
    schedule: ["Lunes a Jueves: 9:00–14:00 y 15:00–17:30", "Viernes: 9:30–14:30"],
    marking: "Nombre Cliente",
    delivery: "12 días, sale todos los viernes",
  },
  {
    flag: "🇵🇦",
    title: "Panamá",
    address: ["Zona Libre de Colón", "Lote 2 manzana 33B Avenida Boyd", "Roosevelt, al lado de la bodega de Sirena"],
    contact: "Jenny Matallana",
    phone: "+507 6983 5118",
    phoneHref: "tel:+50769835118",
    phone2: "+507 474-6315 / 474-6316",
    phone2Href: "tel:+5074746315",
    marking: "Felipe++",
    delivery: "12 días, sale todos los viernes",
  },
  {
    flag: "🇨🇴",
    title: "Colombia - Oficina Principal",
    address: ["TV 93 # 53 - 32 INT 15", "Parque Empresarial El Dorado", "Bogotá, Colombia", "ZP 111071"],
    phone: "+57 1 426 3000",
    phoneHref: "tel:+5714263000",
    schedule: ["Lunes a Viernes: 8:30 – 16:30"],
  },
];

export function CustomerTracking({ user, onLogout, onUpdateUser }: CustomerTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [preAlerts, setPreAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [isSavingAlert, setIsSavingAlert] = useState(false);

  // Paquetes reales del cliente (tabla Paquetes)
  const [myPackages, setMyPackages] = useState<any[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Perfil del cliente
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: user.nombre || "",
    razon_social: user.razon_social || "",
    documento: user.documento || "",
    telefono: user.telefono || "",
    direccion: user.direccion || "",
    direccion_tipo: user.direccion_tipo || "",
    ciudad: user.ciudad || "",
    departamento: user.departamento || "",
    codigo_postal: user.codigo_postal || "",
  });

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

  // Cargar pre-alertas desde Supabase
  const loadPreAlerts = async () => {
    setIsLoadingAlerts(true);
    const { data, error } = await supabase
      .from("prealertas")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando pre-alertas:", error);
      toast.error("No se pudieron cargar tus pre-alertas");
    } else if (data) {
      setPreAlerts(data);
    }
    setIsLoadingAlerts(false);
  };

  // Cargar paquetes reales desde Supabase (tabla Paquetes)
  const loadMyPackages = async () => {
    setIsLoadingPackages(true);
    const { data, error } = await supabase
      .from("Paquetes")
      .select("*")
      .eq("cliente_email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando paquetes:", error);
    } else if (data) {
      setMyPackages(data);
    }
    setIsLoadingPackages(false);
  };

  useEffect(() => {
    loadPreAlerts();
    loadMyPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.email]);

  const handleSearch = () => {
    if (!trackingNumber) {
      toast.error("Por favor ingresa un número de tracking");
      return;
    }

    const searchTerm = trackingNumber.toUpperCase();

    // Buscar en paquetes reales
    const realPackage = myPackages.find(
      pkg => pkg.tracking_number?.toUpperCase() === searchTerm
    );

    if (realPackage) {
      setSelectedShipment({
        tracking: realPackage.tracking_number,
        status: realPackage.estado,
        currentStep: stepMap[realPackage.estado] || 1,
        origin: realPackage.origen,
        destination: "Bogotá, Colombia",
        estimatedDelivery: realPackage.fecha_estimada || "Por confirmar",
        description: realPackage.descripcion,
        isPreAlert: false,
      });
      toast.success("Envío encontrado");
      return;
    }

    // Buscar en pre-alertas (todavía no confirmadas por Rhino)
    const preAlert = preAlerts.find(
      alert => alert.tracking_number.toUpperCase() === searchTerm
    );

    if (preAlert) {
      setSelectedShipment({
        tracking: preAlert.tracking_number,
        status: "Pre-Alertado",
        currentStep: 1,
        origin: preAlert.origin_city,
        destination: preAlert.warehouse,
        estimatedDelivery: "Pendiente de recepción en bodega",
        description: preAlert.description,
        isPreAlert: true,
      });
      toast.success(`Pre-alerta encontrada: ${preAlert.description}`);
      return;
    }

    // No se encontró nada
    setSelectedShipment(null);
    toast.error("Tracking no encontrado", {
      description: "Este número de tracking no ha sido pre-alertado. Por favor crea una pre-alerta primero.",
    });
  };

  const handleCreatePreAlert = async () => {
    if (!newAlert.tracking_number || !newAlert.origin_city || !newAlert.description || !newAlert.declared_value) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const insuredValue = parseFloat(newAlert.insured_value || "0");
    if (insuredValue > 2000) {
      toast.error("El valor máximo a asegurar es $2,000 USD");
      return;
    }

    setIsSavingAlert(true);

    const { data, error } = await supabase
      .from("prealertas")
      .insert([{
        user_email: user.email,
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
      }])
      .select()
      .single();

    setIsSavingAlert(false);

    if (error || !data) {
      console.error("Error creando pre-alerta:", error);
      toast.error("No se pudo crear la pre-alerta. Intenta de nuevo.");
      return;
    }

    setPreAlerts([data, ...preAlerts]);
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

  const handleDeletePreAlert = async (id: string) => {
    const { error } = await supabase
      .from("prealertas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando pre-alerta:", error);
      toast.error("No se pudo eliminar la pre-alerta");
      return;
    }

    setPreAlerts(preAlerts.filter(alert => alert.id !== id));
    toast.success("Pre-alerta eliminada");
  };

  const handleSaveProfile = async () => {
    if (!profileForm.nombre || !profileForm.documento || !profileForm.telefono ||
        !profileForm.direccion || !profileForm.direccion_tipo || !profileForm.ciudad ||
        !profileForm.departamento || !profileForm.codigo_postal) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsSavingProfile(true);

    const { data, error } = await supabase
      .from("clientes")
      .update({
        nombre: profileForm.nombre,
        razon_social: profileForm.razon_social,
        documento: profileForm.documento,
        telefono: profileForm.telefono,
        direccion: profileForm.direccion,
        direccion_tipo: profileForm.direccion_tipo,
        ciudad: profileForm.ciudad,
        departamento: profileForm.departamento,
        codigo_postal: profileForm.codigo_postal,
      })
      .eq("id", user.id)
      .select()
      .single();

    setIsSavingProfile(false);

    if (error || !data) {
      console.error("Error actualizando perfil:", error);
      toast.error("No se pudo actualizar tu información. Intenta de nuevo.");
      return;
    }

    onUpdateUser(data);
    setIsEditingProfile(false);
    toast.success("Tus datos se actualizaron correctamente");
  };

  const handleCancelEditProfile = () => {
    setProfileForm({
      nombre: user.nombre || "",
      razon_social: user.razon_social || "",
      documento: user.documento || "",
      telefono: user.telefono || "",
      direccion: user.direccion || "",
      direccion_tipo: user.direccion_tipo || "",
      ciudad: user.ciudad || "",
      departamento: user.departamento || "",
      codigo_postal: user.codigo_postal || "",
    });
    setIsEditingProfile(false);
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

  const formatDate = (value: string) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return value;
    }
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
                Bienvenido, {user.nombre}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-muted-foreground">{user.ciudad}</p>
              {user.numero_casillero && (
                <p className="text-primary mt-2" style={{ fontWeight: 600 }}>
                  Tu Casillero: {user.numero_casillero}
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
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package size={18} />
                Mis Paquetes
              </TabsTrigger>
              <TabsTrigger value="prealerts" className="flex items-center gap-2">
                <Bell size={18} />
                Pre-Alertas
              </TabsTrigger>
              <TabsTrigger value="sedes" className="flex items-center gap-2">
                <MapPin size={18} />
                Sedes
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={18} />
                Mi Perfil
              </TabsTrigger>
            </TabsList>

            {/* Tab: Mis Paquetes (búsqueda + historial real, unificado) */}
            <TabsContent value="packages" className="space-y-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Rastrear un Envío</CardTitle>
                  <CardDescription>
                    Ingresa tu número de guía para ver el detalle paso a paso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="tracking">Número de Tracking</Label>
                      <Input
                        id="tracking"
                        placeholder="Ej: 1Z999AA10123456784"
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
                </CardContent>
              </Card>

              {selectedShipment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                              {index < trackingSteps.length - 1 && (
                                <div
                                  className={`absolute left-6 top-12 w-0.5 h-16 ${
                                      step.id < selectedShipment.currentStep
                                        ? step.color === "primary" ? "bg-primary" : "bg-secondary"
                                        : "bg-border"
                                  }`}
                                />
                              )}

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

              {/* Historial completo de paquetes reales */}
              <div className="space-y-4">
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Historial de Paquetes ({myPackages.length})
                </h3>

                {isLoadingPackages ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Cargando tus paquetes...</p>
                    </CardContent>
                  </Card>
                ) : myPackages.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <Truck className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">
                        Todavía no tienes paquetes registrados con nosotros.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  myPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setTrackingNumber(pkg.tracking_number);
                        setSelectedShipment({
                          tracking: pkg.tracking_number,
                          status: pkg.estado,
                          currentStep: stepMap[pkg.estado] || 1,
                          origin: pkg.origen,
                          destination: "Bogotá, Colombia",
                          estimatedDelivery: pkg.fecha_estimada || "Por confirmar",
                          description: pkg.descripcion,
                          isPreAlert: false,
                        });
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 style={{ fontWeight: 600 }}>{pkg.descripcion || pkg.tracking_number}</h4>
                            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                              Tracking: {pkg.tracking_number}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {pkg.estado}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
                          <div>
                            <p className="text-muted-foreground mb-1">Origen</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>{pkg.origen}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Fecha de Envío</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>{formatDate(pkg.fecha_envio) || "Por confirmar"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Entrega Estimada</p>
                            <p className="text-foreground" style={{ fontWeight: 500 }}>{formatDate(pkg.fecha_estimada) || "Por confirmar"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Tab: Pre-Alertas */}
            <TabsContent value="prealerts" className="space-y-8">
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
                        disabled={isSavingAlert}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="mr-2" size={18} />
                        {isSavingAlert ? "Guardando..." : "Crear Pre-Alerta"}
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

              <div className="space-y-4">
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Mis Pre-Alertas ({preAlerts.length})
                </h3>

                {isLoadingAlerts ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Cargando tus pre-alertas...</p>
                    </CardContent>
                  </Card>
                ) : preAlerts.length === 0 ? (
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
                              <span className="text-foreground">{formatDate(alert.created_at)}</span>
                            </div>
                            {alert.received_at && (
                              <div>
                                <span className="text-muted-foreground">Recibido: </span>
                                <span className="text-secondary" style={{ fontWeight: 500 }}>
                                  {formatDate(alert.received_at)}
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

            {/* Tab: Sedes */}
            <TabsContent value="sedes" className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/50">
                <div className="flex items-start gap-3 mb-2">
                  <AlertCircle className="text-secondary flex-shrink-0 mt-1" size={20} />
                  <h3 className="text-secondary" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Instrucciones Importantes
                  </h3>
                </div>
                <p className="text-foreground" style={{ fontSize: '0.875rem' }}>
                  Para todos los paquetes, notifica el número de tracking, marca como se indica en cada sede, agrega tu número de casillero, contenido y valor declarado. Todo paquete debe ser pre-alertado.
                </p>
              </div>

              {sedes.map((sede) => (
                <Card key={sede.title} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div style={{ fontSize: '1.75rem' }}>{sede.flag}</div>
                      <CardTitle style={{ fontSize: '1.1rem' }}>{sede.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sede.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="text-muted-foreground mt-1 flex-shrink-0" size={16} />
                        <div>
                          {sede.address.map((line, i) => (
                            <p key={i} className={i === 0 ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: '0.875rem' }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {sede.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="text-muted-foreground flex-shrink-0" size={16} />
                        <p className="text-foreground" style={{ fontSize: '0.875rem' }}>Empresa: {sede.company}</p>
                      </div>
                    )}
                    {sede.contact && (
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground flex-shrink-0" size={16} />
                        <p className="text-foreground" style={{ fontSize: '0.875rem' }}>Contacto: {sede.contact}</p>
                      </div>
                    )}
                    {sede.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="text-muted-foreground flex-shrink-0" size={16} />
                        <a href={sede.phoneHref} className="text-primary hover:underline" style={{ fontSize: '0.875rem' }}>
                          {sede.phone}
                        </a>
                      </div>
                    )}
                    {sede.phone2 && (
                      <div className="flex items-center gap-2 ml-6">
                        <a href={sede.phone2Href} className="text-primary hover:underline" style={{ fontSize: '0.875rem' }}>
                          {sede.phone2}
                        </a>
                      </div>
                    )}
                    {sede.schedule && (
                      <div className="flex items-start gap-2">
                        <Clock className="text-muted-foreground mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-foreground" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Horario:</p>
                          {sede.schedule.map((line, i) => (
                            <p key={i} className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {sede.marking && (
                      <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-foreground" style={{ fontSize: '0.875rem' }}>
                          <strong className="text-primary">Marcar el paquete:</strong> {sede.marking}
                        </p>
                      </div>
                    )}
                    {sede.delivery && (
                      <div className="p-3 rounded-lg bg-green-900/20 border border-green-600/30">
                        <div className="flex items-center gap-2">
                          <Plane className="text-green-500 flex-shrink-0" size={16} />
                          <p className="text-green-400" style={{ fontSize: '0.875rem' }}>
                            <strong>Tiempo de importación y entrega:</strong> {sede.delivery}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Tab: Mi Perfil */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Mis Datos Personales</CardTitle>
                      <CardDescription>
                        Esta es la información que tenemos registrada para tus envíos
                      </CardDescription>
                    </div>
                    {!isEditingProfile ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelEditProfile}
                          className="flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Save size={16} />
                          {isSavingProfile ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Datos de solo lectura */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Correo Electrónico</p>
                      <p style={{ fontWeight: 500 }}>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Número de Casillero</p>
                      <p className="text-primary" style={{ fontWeight: 600 }}>{user.numero_casillero}</p>
                    </div>
                  </div>

                  {!isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Nombre Completo</p>
                        <p style={{ fontWeight: 500 }}>{user.nombre || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Razón Social</p>
                        <p style={{ fontWeight: 500 }}>{user.razon_social || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>CC o NIT</p>
                        <p style={{ fontWeight: 500 }}>{user.documento || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Teléfono</p>
                        <p style={{ fontWeight: 500 }}>{user.telefono || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Dirección</p>
                        <p style={{ fontWeight: 500 }}>{user.direccion || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Bloque / Casa / Apto</p>
                        <p style={{ fontWeight: 500 }}>{user.direccion_tipo || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Ciudad</p>
                        <p style={{ fontWeight: 500 }}>{user.ciudad || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Departamento</p>
                        <p style={{ fontWeight: 500 }}>{user.departamento || "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Código Postal</p>
                        <p style={{ fontWeight: 500 }}>{user.codigo_postal || "-"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-nombre">Nombre Completo *</Label>
                        <Input
                          id="profile-nombre"
                          value={profileForm.nombre}
                          onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-business">Razón Social (opcional)</Label>
                        <Input
                          id="profile-business"
                          value={profileForm.razon_social}
                          onChange={(e) => setProfileForm({ ...profileForm, razon_social: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-documento">CC o NIT *</Label>
                        <Input
                          id="profile-documento"
                          inputMode="numeric"
                          value={profileForm.documento}
                          onChange={(e) => setProfileForm({ ...profileForm, documento: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-telefono">Teléfono *</Label>
                        <Input
                          id="profile-telefono"
                          inputMode="numeric"
                          value={profileForm.telefono}
                          onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-direccion">Dirección *</Label>
                        <Input
                          id="profile-direccion"
                          value={profileForm.direccion}
                          onChange={(e) => setProfileForm({ ...profileForm, direccion: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-direccion-tipo">Bloque / Casa / Apto *</Label>
                        <Input
                          id="profile-direccion-tipo"
                          value={profileForm.direccion_tipo}
                          onChange={(e) => setProfileForm({ ...profileForm, direccion_tipo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-ciudad">Ciudad *</Label>
                        <Input
                          id="profile-ciudad"
                          value={profileForm.ciudad}
                          onChange={(e) => setProfileForm({ ...profileForm, ciudad: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-departamento">Departamento *</Label>
                        <Select
                          value={profileForm.departamento}
                          onValueChange={(value) => setProfileForm({ ...profileForm, departamento: value })}
                        >
                          <SelectTrigger id="profile-departamento">
                            <SelectValue placeholder="Selecciona departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departamentosColombia.map((dep) => (
                              <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-postal">Código Postal *</Label>
                        <Input
                          id="profile-postal"
                          inputMode="numeric"
                          maxLength={6}
                          value={profileForm.codigo_postal}
                          onChange={(e) => setProfileForm({ ...profileForm, codigo_postal: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}