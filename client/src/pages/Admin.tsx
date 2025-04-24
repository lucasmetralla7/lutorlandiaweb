import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import StaffManagement from "@/components/StaffManagement";
import AnnouncementManagement from "@/components/AnnouncementManagement";
import BugReportManagement from "@/components/BugReportManagement";
import RuleManagement from "@/components/RuleManagement";
import LoginForm from "@/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Megaphone, Book, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Comprobar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  // Callback para cuando el inicio de sesión es exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <Helmet>
        <title>Panel de Administración - Lutorlandia</title>
      </Helmet>

      <div className="container py-10">
        {isAuthenticated ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold">Panel de Administración</h1>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={16} />
                Cerrar Sesión
              </Button>
            </div>
            <p className="text-lg mb-8 text-zinc-400">
              Gestiona la información del servidor y sus miembros.
            </p>

            <Tabs defaultValue="staff" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users size={16} />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-2">
                  <Megaphone size={16} />
                  Anuncios
                </TabsTrigger>
                <TabsTrigger value="rules" className="flex items-center gap-2">
                  <Book size={16} />
                  Reglas
                </TabsTrigger>
                <TabsTrigger value="bugs" className="flex items-center gap-2">
                  <Bug size={16} />
                  Bugs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="staff">
                <StaffManagement />
              </TabsContent>
              
              <TabsContent value="announcements">
                <AnnouncementManagement />
              </TabsContent>
              
              <TabsContent value="rules">
                <RuleManagement />
              </TabsContent>
              
              <TabsContent value="bugs">
                <BugReportManagement />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[70vh]">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        )}
      </div>
    </>
  );
}