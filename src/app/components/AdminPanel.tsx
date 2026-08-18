import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Bell, Package, Users, CheckCircle2, Search, ShieldCheck, LogOut, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../supabase";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_wt92143";
const EMAILJS_STATUS_TEMPLATE_ID = "template_5svrz3sa";
const EMAILJS_PUBLIC_KEY = "4b8JPEJ2J6J6mg8wY";

interface AdminPanelProps {
  onLogout: () => void;
}

const estadosPaquete = [
  "Pre-Alertado",
  "Recibido en Bodega",
  "Tránsito Internacional",
  "Aduanas Colombia",
  "Bodega Bogotá",
  "En Ruta",
  "Entregado",
];

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [preAlerts, setPreAlerts] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [savingPackageId, setSavingPackageId] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");

  const loadAll = async () => {
    setIsLoading(true);

    const [preAlertsRes, packagesRes, clientsRes] = await Promise.all([
      supabase.from("prealertas").select("*").order("created_at", { ascending: false }),
      supabase.from("Paquetes").select("*").order("created_at", { ascending: false }),
      supabase.from("clientes").select("*").order("created_at", { ascending: false }),
    ]);

    if (!preAlertsRes.error && preAlertsRes.data) setPreAlerts(preAlertsRes.data);
    if (!packagesRes.error && packagesRes.data) setPackages(packagesRes.data);
    if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data);

    setIsLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Envía el correo de notificación al cliente cuando cambia el estado de su paquete
  const sendStatusEmail = async (params: {
    client_name: string;
    to_email: string;
    tracking_number: string;
    new_status: string;
    package_description: string;
  }) => {
    if (!params.to_email) return;
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_STATUS_TEMPLATE_ID,
        params,
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Error enviando correo de notificación:", error);
      toast.error("El estado se actualizó, pero el correo de notificación no se pudo enviar");
    }
  };

  // Abre WhatsApp con el mensaje de notificación ya redactado (envío manual, gratis)
  // Siempre busca el teléfono más reciente en la tabla clientes, no el guardado en el paquete
  const openWhatsAppNotification = async (pkg: any) => {
    const { data: cliente } = await supabase
      .from("clientes")
      .select("nombre, telefono")
      .eq("email", pkg.cliente_email)
      .single();

    const telefono = cliente?.telefono || pkg.cliente_telefono;
    const nombre = cliente?.nombre || pkg.cliente_nombre;

    if (!telefono) {
      toast.error("Este cliente no tiene teléfono registrado");
      return;
    }
    const wave = String.fromCodePoint(0x1F44B);
    const bookmark = String.fromCodePoint(0x1F516);
    const pin = String.fromCodePoint(0x1F4CD);
    const rhino = String.fromCodePoint(0x1F98F);
    const message = `Buen día ${nombre || ""} ${wave}\n\nTe informamos que tu paquete ha tenido una actualización en su estado de envío.\n\n${bookmark} Tracking: ${pkg.tracking_number}\n${pin} Nuevo estado: *${pkg.estado}*\n\nGracias por confiar en Rhino Special Courier. ${rhino}`;
    const phone = telefono.replace(/\D/g, "");
    window.open(`https://web.whatsapp.com/send?phone=57${phone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  // Abre WhatsApp con un solo mensaje que agrupa todos los paquetes NO entregados de un cliente
  const openWhatsAppCombinedNotification = async (client: any) => {
    const pendingPackages = packages.filter(
      p => p.cliente_email === client.email && p.estado !== "Entregado"
    );

    if (pendingPackages.length === 0) {
      toast.error("Este cliente no tiene paquetes pendientes por notificar");
      return;
    }

    const { data: freshClient } = await supabase
      .from("clientes")
      .select("nombre, telefono")
      .eq("email", client.email)
      .single();

    const telefono = freshClient?.telefono || client.telefono;
    const nombre = freshClient?.nombre || client.nombre;

    if (!telefono) {
      toast.error("Este cliente no tiene teléfono registrado");
      return;
    }

    const wave = String.fromCodePoint(0x1F44B);
    const rhino = String.fromCodePoint(0x1F98F);
    const numeroEmoji = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (n) => String.fromCodePoint(0x30 + n, 0xFE0F, 0x20E3)
    );

    const lineas = pendingPackages
      .map((p, i) => `${numeroEmoji[i] || `${i + 1}.`} Tracking: ${p.tracking_number} — Estado: *${p.estado}*`)
      .join("\n");

    const message = `Buen día ${nombre || ""} ${wave}\n\nTe informamos que tienes actualizaciones en tus envíos con Rhino Special Courier.\n\n${lineas}\n\nGracias por confiar en Rhino Special Courier. ${rhino}`;

    const phone = telefono.replace(/\D/g, "");
    window.open(`https://web.whatsapp.com/send?phone=57${phone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  // Confirmar recepción: crea el registro real en Paquetes y marca la pre-alerta como recibida
  const handleConfirmReception = async (alert: any) => {
    setConfirmingId(alert.id);

    // Traer nombre y teléfono del cliente
    const { data: cliente } = await supabase
      .from("clientes")
      .select("nombre, telefono")
      .eq("email", alert.user_email)
      .single();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const { error: insertError } = await supabase
      .from("Paquetes")
      .insert([{
        tracking_number: alert.tracking_number,
        cliente_nombre: cliente?.nombre || "",
        cliente_email: alert.user_email,
        cliente_telefono: cliente?.telefono || "",
        origen: alert.origin_city,
        estado: "Recibido en Bodega",
        descripcion: alert.description,
        fecha_envio: today,
        fecha_estimada: null,
      }]);

    if (insertError) {
      console.error("Error creando paquete:", insertError);
      toast.error("No se pudo confirmar la recepción. Intenta de nuevo.");
      setConfirmingId(null);
      return;
    }

    const { error: updateError } = await supabase
      .from("prealertas")
      .update({ status: "received", received_at: today })
      .eq("id", alert.id);

    if (updateError) {
      console.error("Error actualizando pre-alerta:", updateError);
    }

    await sendStatusEmail({
      client_name: cliente?.nombre || "Cliente",
      to_email: alert.user_email,
      tracking_number: alert.tracking_number,
      new_status: "Recibido en Bodega",
      package_description: alert.description,
    });

    toast.success(`Paquete ${alert.tracking_number} confirmado y creado en Paquetes`);
    setConfirmingId(null);
    loadAll();
  };

  const handleUpdatePackageStatus = async (pkg: any, newStatus: string) => {
    setSavingPackageId(pkg.id);

    const { error } = await supabase
      .from("Paquetes")
      .update({ estado: newStatus })
      .eq("id", pkg.id);

    setSavingPackageId(null);

    if (error) {
      console.error("Error actualizando estado:", error);
      toast.error("No se pudo actualizar el estado");
      return;
    }

    setPackages(packages.map(p => p.id === pkg.id ? { ...p, estado: newStatus } : p));
    toast.success(`Estado actualizado a "${newStatus}"`);

    const { data: cliente } = await supabase
      .from("clientes")
      .select("nombre")
      .eq("email", pkg.cliente_email)
      .single();

    await sendStatusEmail({
      client_name: cliente?.nombre || pkg.cliente_nombre || "Cliente",
      to_email: pkg.cliente_email,
      tracking_number: pkg.tracking_number,
      new_status: newStatus,
      package_description: pkg.descripcion || "",
    });
  };

  const pendingPreAlerts = preAlerts.filter(a => a.status === "pending");
  const filteredClients = clients.filter(c => {
    const term = clientSearch.toLowerCase();
    return (
      c.nombre?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.numero_casillero?.toLowerCase().includes(term)
    );
  });

  const formatDate = (value: string) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 mb-8 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" size={28} />
            <div>
              <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Panel de Administrador</h2>
              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Rhino Special Courier</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-2">
            <LogOut size={16} />
            Cerrar Sesión
          </Button>
        </div>

        {isLoading ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Cargando datos del panel...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="prealerts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="prealerts" className="flex items-center gap-2">
                <Bell size={18} />
                Pre-Alertas {pendingPreAlerts.length > 0 && `(${pendingPreAlerts.length})`}
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package size={18} />
                Paquetes
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users size={18} />
                Clientes
              </TabsTrigger>
            </TabsList>

            {/* Tab: Pre-Alertas */}
            <TabsContent value="prealerts" className="space-y-4">
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                Pre-Alertas Pendientes ({pendingPreAlerts.length})
              </h3>

              {pendingPreAlerts.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Bell className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">No hay pre-alertas pendientes por confirmar.</p>
                  </CardContent>
                </Card>
              ) : (
                pendingPreAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-card border-border hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 style={{ fontWeight: 600 }}>{alert.description}</h4>
                          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                            Cliente: {alert.user_email}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                          Pendiente
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Tracking</p>
                          <p style={{ fontWeight: 500 }}>{alert.tracking_number}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Servicio</p>
                          <p style={{ fontWeight: 500 }}>{alert.service}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Origen</p>
                          <p style={{ fontWeight: 500 }}>{alert.origin_city}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Cantidad</p>
                          <p style={{ fontWeight: 500 }}>{alert.quantity}</p>
                        </div>
                      </div>

                      {alert.shipping_instructions && (
                        <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm">
                          <p className="text-muted-foreground mb-1">Instrucciones:</p>
                          <p>{alert.shipping_instructions}</p>
                        </div>
                      )}

                      <Button
                        onClick={() => handleConfirmReception(alert)}
                        disabled={confirmingId === alert.id}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        {confirmingId === alert.id ? "Confirmando..." : "Confirmar Recepción en Bodega"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Tab: Paquetes */}
            <TabsContent value="packages" className="space-y-4">
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                Todos los Paquetes ({packages.length})
              </h3>

              {packages.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">Todavía no hay paquetes registrados.</p>
                  </CardContent>
                </Card>
              ) : (
                packages.map((pkg) => (
                  <Card key={pkg.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 style={{ fontWeight: 600 }}>{pkg.descripcion || pkg.tracking_number}</h4>
                          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                            {pkg.tracking_number} · {pkg.cliente_email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Origen</p>
                          <p style={{ fontWeight: 500 }}>{pkg.origen}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Fecha Envío</p>
                          <p style={{ fontWeight: 500 }}>{formatDate(pkg.fecha_envio)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Fecha Estimada</p>
                          <p style={{ fontWeight: 500 }}>{formatDate(pkg.fecha_estimada)}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 md:items-end">
                        <div className="space-y-2 flex-1">
                          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Estado actual</p>
                          <Select
                            value={pkg.estado}
                            onValueChange={(value) => handleUpdatePackageStatus(pkg, value)}
                            disabled={savingPackageId === pkg.id}
                          >
                            <SelectTrigger className="w-full md:w-64">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {estadosPaquete.map((estado) => (
                                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={() => openWhatsAppNotification(pkg)}
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-600/10 flex items-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Notificar por WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Tab: Clientes */}
            <TabsContent value="clients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Todos los Clientes ({filteredClients.length})
                </h3>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar por nombre, correo o casillero..."
                  className="pl-10 bg-input-background"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>

              {filteredClients.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">No se encontraron clientes.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredClients.map((client) => (
                  <Card key={client.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 style={{ fontWeight: 600 }}>{client.nombre}</h4>
                          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{client.email}</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {client.numero_casillero}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Documento</p>
                          <p style={{ fontWeight: 500 }}>{client.documento}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Teléfono</p>
                          <p style={{ fontWeight: 500 }}>{client.telefono}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Ciudad</p>
                          <p style={{ fontWeight: 500 }}>{client.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Estado</p>
                          <p style={{ fontWeight: 500 }}>{client.estado_cuenta}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openWhatsAppCombinedNotification(client)}
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-600 hover:bg-green-600/10 flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Notificar Pendientes por WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}