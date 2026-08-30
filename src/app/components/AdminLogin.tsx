import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Mail, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../supabase";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      setIsLoading(false);
      toast.error("Correo o contraseña incorrectos");
      return;
    }

    // Solo se permite el acceso si el usuario tiene la etiqueta "role": "admin"
    const isAdmin = data.session.user.user_metadata?.role === 'admin';

    if (!isAdmin) {
      await supabase.auth.signOut();
      setIsLoading(false);
      toast.error("Esta cuenta no tiene permisos de administrador");
      return;
    }

    setIsLoading(false);
    toast.success("Bienvenido al panel de administrador");
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="text-primary" size={24} />
          </div>
          <CardTitle>Panel de Administrador</CardTitle>
          <CardDescription>Acceso exclusivo para el equipo de Rhino Special Courier</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@rhino.com"
                  className="bg-input-background pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-input-background pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? "Ingresando..." : "Ingresar al Panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}