import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../supabase";

interface ResetPasswordProps {
  onDone: () => void;
}

export function ResetPassword({ onDone }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  // El enlace del correo deja a Supabase crear una sesión temporal especial
  // para poder cambiar la contraseña. Verificamos que exista antes de mostrar el formulario.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasValidSession(!!data.session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsLoading(false);

    if (error) {
      toast.error("No se pudo actualizar la contraseña. El enlace puede haber expirado.");
      return;
    }

    setIsSuccess(true);
    toast.success("¡Contraseña actualizada correctamente!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="text-primary" size={24} />
          </div>
          <CardTitle>Restablecer Contraseña</CardTitle>
          <CardDescription>Rhino Special Courier</CardDescription>
        </CardHeader>
        <CardContent>
          {hasValidSession === null && (
            <p className="text-center text-muted-foreground">Verificando enlace...</p>
          )}

          {hasValidSession === false && (
            <div className="text-center space-y-4 py-4">
              <ShieldAlert className="mx-auto text-destructive" size={48} />
              <p className="text-foreground">
                Este enlace no es válido o ya expiró.
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                Vuelve a solicitar la recuperación de contraseña desde la página principal.
              </p>
              <Button onClick={onDone} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Volver al inicio
              </Button>
            </div>
          )}

          {hasValidSession === true && !isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="bg-input-background"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repite tu contraseña"
                  className="bg-input-background"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isLoading ? "Guardando..." : "Guardar Nueva Contraseña"}
              </Button>
            </form>
          )}

          {isSuccess && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="mx-auto text-primary" size={48} />
              <p className="text-foreground">Tu contraseña se actualizó correctamente.</p>
              <Button onClick={onDone} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Ir a Iniciar Sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}