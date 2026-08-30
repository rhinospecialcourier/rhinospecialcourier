import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "../../supabase";

const SITE_URL = "https://rhinospecialcourier.vercel.app";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: any) => void;
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    businessName: "",
    name: "",
    document: "",
    phone: "",
    address: "",
    addressType: "",
    city: "",
    department: "",
    country: "Colombia",
    postalCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (authError || !authData.user) {
      setIsLoading(false);
      toast.error("Correo o contraseña incorrectos");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("clientes")
      .select("*")
      .eq("email", loginData.email)
      .single();

    setIsLoading(false);

    if (profileError || !profile) {
      toast.error("No se encontró tu perfil. Contáctanos por WhatsApp para ayudarte.");
      return;
    }

    onLogin(profile);
    toast.success("¡Bienvenido! Has iniciado sesión correctamente.");
    onOpenChange(false);
    setLoginData({ email: "", password: "" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.document || !registerData.phone ||
        !registerData.address || !registerData.addressType || !registerData.city ||
        !registerData.department || !registerData.postalCode || !registerData.email ||
        !registerData.password) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    // Paso 1: crear el usuario en el sistema de autenticación de Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });

    if (authError) {
      setIsLoading(false);
      if (authError.message.toLowerCase().includes("already registered") || authError.message.toLowerCase().includes("already exists")) {
        toast.error("Este correo ya está registrado");
      } else {
        toast.error("Error al registrar. Intenta de nuevo.");
      }
      return;
    }

    // Paso 2: calcular el número de casillero consecutivo
    const { data: lastClient } = await supabase
      .from("clientes")
      .select("numero_casillero")
      .order("numero_casillero", { ascending: false })
      .limit(1);

    let nextCasilleroNumber = 1218001;
    if (lastClient && lastClient.length > 0 && lastClient[0].numero_casillero) {
      const lastNumber = parseInt(lastClient[0].numero_casillero.replace("RHN", ""));
      if (!isNaN(lastNumber)) {
        nextCasilleroNumber = Math.max(lastNumber + 1, nextCasilleroNumber);
      }
    }
    const casilleroNumber = `RHN${String(nextCasilleroNumber).padStart(7, '0')}`;

    // Paso 3: crear el perfil del cliente, vinculado por correo al usuario de Auth
    const { data, error } = await supabase
      .from("clientes")
      .insert([{
        nombre: registerData.name,
        razon_social: registerData.businessName,
        documento: registerData.document,
        telefono: registerData.phone,
        email: registerData.email,
        direccion: registerData.address,
        direccion_tipo: registerData.addressType,
        ciudad: registerData.city,
        departamento: registerData.department,
        pais: registerData.country,
        codigo_postal: registerData.postalCode,
        numero_casillero: casilleroNumber,
        estado_cuenta: "Activo"
      }])
      .select()
      .single();

    setIsLoading(false);

    if (error || !data) {
      toast.error("Tu cuenta se creó, pero hubo un problema guardando tu perfil. Contáctanos por WhatsApp.");
      return;
    }

    onLogin(data);
    toast.success(`¡Registro exitoso! Tu número de casillero es: ${casilleroNumber}`);
    onOpenChange(false);
    setRegisterData({
      businessName: "",
      name: "",
      document: "",
      phone: "",
      address: "",
      addressType: "",
      city: "",
      department: "",
      country: "Colombia",
      postalCode: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${SITE_URL}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast.error("No se pudo enviar el correo de recuperación. Intenta de nuevo.");
      return;
    }

    setRecoveryEmailSent(true);
  };

  const resetRecoveryFlow = () => {
    setShowForgotPassword(false);
    setRecoveryEmail("");
    setRecoveryEmailSent(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {!showForgotPassword ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-primary">Portal de Clientes</DialogTitle>
              <DialogDescription>
                Ingresa a tu cuenta o regístrate para rastrear tus envíos
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Ingresar</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="bg-input-background pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-input-background pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {isLoading ? "Ingresando..." : "Ingresar"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
                  <form onSubmit={handleRegister} className="space-y-4">

                    <div className="space-y-2">
                      <Label htmlFor="register-business">Razón Social (opcional)</Label>
                      <Input
                        id="register-business"
                        placeholder="Nombre de la empresa"
                        className="bg-input-background"
                        value={registerData.businessName}
                        onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nombre Completo *</Label>
                      <Input
                        id="register-name"
                        placeholder="Nombre completo"
                        className="bg-input-background"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-document">CC o NIT *</Label>
                      <Input
                        id="register-document"
                        inputMode="numeric"
                        placeholder="Número de documento"
                        className="bg-input-background"
                        value={registerData.document}
                        onChange={(e) => setRegisterData({ ...registerData, document: e.target.value.replace(/\D/g, '') })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Teléfono *</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="3001234567"
                        className="bg-input-background"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value.replace(/\D/g, '') })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-country">País</Label>
                      <Input
                        id="register-country"
                        value="Colombia"
                        className="bg-input-background"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-department">Departamento *</Label>
                      <Select value={registerData.department} onValueChange={(value) => setRegisterData({ ...registerData, department: value })}>
                        <SelectTrigger id="register-department" className="bg-input-background">
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Amazonas">Amazonas</SelectItem>
                          <SelectItem value="Antioquia">Antioquia</SelectItem>
                          <SelectItem value="Arauca">Arauca</SelectItem>
                          <SelectItem value="Atlántico">Atlántico</SelectItem>
                          <SelectItem value="Bogotá">Bogotá</SelectItem>
                          <SelectItem value="Bolívar">Bolívar</SelectItem>
                          <SelectItem value="Boyacá">Boyacá</SelectItem>
                          <SelectItem value="Caldas">Caldas</SelectItem>
                          <SelectItem value="Caquetá">Caquetá</SelectItem>
                          <SelectItem value="Casanare">Casanare</SelectItem>
                          <SelectItem value="Cauca">Cauca</SelectItem>
                          <SelectItem value="Cesar">Cesar</SelectItem>
                          <SelectItem value="Chocó">Chocó</SelectItem>
                          <SelectItem value="Córdoba">Córdoba</SelectItem>
                          <SelectItem value="Cundinamarca">Cundinamarca</SelectItem>
                          <SelectItem value="Guainía">Guainía</SelectItem>
                          <SelectItem value="Guaviare">Guaviare</SelectItem>
                          <SelectItem value="Huila">Huila</SelectItem>
                          <SelectItem value="La Guajira">La Guajira</SelectItem>
                          <SelectItem value="Magdalena">Magdalena</SelectItem>
                          <SelectItem value="Meta">Meta</SelectItem>
                          <SelectItem value="Nariño">Nariño</SelectItem>
                          <SelectItem value="Norte de Santander">Norte de Santander</SelectItem>
                          <SelectItem value="Putumayo">Putumayo</SelectItem>
                          <SelectItem value="Quindío">Quindío</SelectItem>
                          <SelectItem value="Risaralda">Risaralda</SelectItem>
                          <SelectItem value="San Andrés">San Andrés</SelectItem>
                          <SelectItem value="Santander">Santander</SelectItem>
                          <SelectItem value="Sucre">Sucre</SelectItem>
                          <SelectItem value="Tolima">Tolima</SelectItem>
                          <SelectItem value="Valle del Cauca">Valle del Cauca</SelectItem>
                          <SelectItem value="Vaupés">Vaupés</SelectItem>
                          <SelectItem value="Vichada">Vichada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-city">Ciudad *</Label>
                      <Input
                        id="register-city"
                        placeholder="Ciudad"
                        className="bg-input-background"
                        value={registerData.city}
                        onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-address">Dirección *</Label>
                      <Input
                        id="register-address"
                        placeholder="Dirección completa"
                        className="bg-input-background"
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-address-type">Bloque, Casa, Apartamento, etc. *</Label>
                      <Input
                        id="register-address-type"
                        placeholder="Ej: Apto 301, Casa 12, Bloque B"
                        className="bg-input-background"
                        value={registerData.addressType}
                        onChange={(e) => setRegisterData({ ...registerData, addressType: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-postal">Código Postal *</Label>
                      <Input
                        id="register-postal"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Ej: 110111"
                        className="bg-input-background"
                        value={registerData.postalCode}
                        onChange={(e) => setRegisterData({ ...registerData, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Correo Electrónico *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="bg-input-background"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña *</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          className="bg-input-background pl-10"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirmar Contraseña *</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Repite tu contraseña"
                          className="bg-input-background pl-10"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      {isLoading ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetRecoveryFlow}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <ArrowLeft size={20} className="text-primary" />
                </Button>
                <DialogTitle className="text-primary">Recuperar Contraseña</DialogTitle>
              </div>
              <DialogDescription>
                {recoveryEmailSent
                  ? "Revisa tu correo para continuar"
                  : "Ingresa tu correo electrónico para recibir un enlace de recuperación"}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {!recoveryEmailSent ? (
                <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="bg-input-background pl-10"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="mx-auto text-primary" size={48} />
                  <p className="text-foreground">
                    Si el correo <strong>{recoveryEmail}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Revisa también tu carpeta de spam.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={resetRecoveryFlow}
                  >
                    Volver al inicio de sesión
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}