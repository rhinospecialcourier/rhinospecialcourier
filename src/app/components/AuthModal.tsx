import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { supabase } from "../../supabase";

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
  const [recoveryStep, setRecoveryStep] = useState<"email" | "code" | "reset">("email");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("email", loginData.email)
      .eq("password", loginData.password)
      .single();

    setIsLoading(false);

    if (error || !data) {
      toast.error("Correo o contraseña incorrectos");
      return;
    }

    onLogin(data);
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

    const { data: existing } = await supabase
      .from("clientes")
      .select("id")
      .eq("email", registerData.email);

    if (existing && existing.length > 0) {
      toast.error("Este correo ya está registrado");
      setIsLoading(false);
      return;
    }

    const { data: lastClient } = await supabase
      .from("clientes")
      .select("numero_casillero")
      .order("numero_casillero", { ascending: false })
      .limit(1);

    let nextCasilleroNumber = 1218001;
    if (lastClient && lastClient.length > 0 && lastClient[0].numero_casillero) {
      const lastNumber = parseInt(lastClient[0].numero_casillero.replace("RHN", ""));
      if (!isNaN(lastNumber)) {
        nextCasilleroNumber = lastNumber + 1;
      }
    }
    const casilleroNumber = `RHN${String(nextCasilleroNumber).padStart(7, '0')}`;

    const { data, error } = await supabase
      .from("clientes")
      .insert([{
        nombre: registerData.name,
        razon_social: registerData.businessName,
        documento: registerData.document,
        telefono: registerData.phone,
        email: registerData.email,
        password: registerData.password,
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
      toast.error("Error al registrar. Intenta de nuevo.");
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

  const handleSendRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from("clientes")
      .select("id")
      .eq("email", recoveryEmail)
      .single();

    if (data) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setRecoveryStep("code");
      toast.success(`Código enviado a ${recoveryEmail}. Código de prueba: ${code}`);
    } else {
      toast.error("No existe una cuenta con ese correo electrónico");
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode === generatedCode) {
      setRecoveryStep("reset");
      toast.success("Código verificado correctamente");
    } else {
      toast.error("Código incorrecto. Por favor verifica e intenta de nuevo.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .update({ password: newPassword })
      .eq("email", recoveryEmail);

    if (error) {
      toast.error("Error al cambiar la contraseña");
      return;
    }

    toast.success("¡Contraseña actualizada exitosamente!");
    resetRecoveryFlow();
  };

  const resetRecoveryFlow = () => {
    setShowForgotPassword(false);
    setRecoveryStep("email");
    setRecoveryEmail("");
    setGeneratedCode("");
    setEnteredCode("");
    setNewPassword("");
    setConfirmPassword("");
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
                {recoveryStep === "email" && "Ingresa tu correo electrónico para recibir un código"}
                {recoveryStep === "code" && "Ingresa el código de 6 dígitos que enviamos a tu correo"}
                {recoveryStep === "reset" && "Ingresa tu nueva contraseña"}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {recoveryStep === "email" && (
                <form onSubmit={handleSendRecoveryCode} className="space-y-4">
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
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Enviar Código de Seguridad
                  </Button>
                </form>
              )}

              {recoveryStep === "code" && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-code">Código de 6 Dígitos</Label>
                    <Input
                      id="recovery-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="123456"
                      className="bg-input-background text-center tracking-widest"
                      style={{ fontSize: '1.5rem' }}
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enviado a: {recoveryEmail}</p>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Verificar Código
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setRecoveryStep("email")}>
                    Volver a enviar código
                  </Button>
                </form>
              )}

              {recoveryStep === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="bg-input-background pl-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Repite tu contraseña"
                        className="bg-input-background pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Cambiar Contraseña
                  </Button>
                </form>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}