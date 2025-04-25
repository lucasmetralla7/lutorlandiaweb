import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Esquema para validar las credenciales
const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { loginMutation, user, isLoading } = useAuth();

  // Formulario para el inicio de sesión
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Función para manejar el inicio de sesión
  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/admin");
      }
    });
  };

  return (
    <div className="flex h-screen">
      {/* Columna izquierda: Formulario de inicio de sesión */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al panel de administración.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nombre de usuario" 
                          {...field} 
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Contraseña" 
                          {...field} 
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              El acceso es exclusivo para administradores de Lutorlandia.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Columna derecha: Hero */}
      <div className="hidden md:w-1/2 md:flex flex-col justify-center items-center p-8 bg-[#030F26] text-white">
        <div className="max-w-md space-y-6">
          <img 
            src="https://i.imgur.com/uXFUkqf.png" 
            alt="Lutorlandia Logo" 
            className="w-60 mx-auto"
          />
          <h1 className="text-3xl font-bold text-center">
            Administración de Lutorlandia
          </h1>
          <div className="space-y-4">
            <p className="text-center text-white/80">
              Gestiona el contenido del sitio web del servidor de Minecraft Lutorlandia,
              incluyendo staff, anuncios y reglas.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Administra el staff del servidor
              </li>
              <li className="flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Crea y gestiona anuncios
              </li>
              <li className="flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full p-1 mr-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Edita las reglas del servidor
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}