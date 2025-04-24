import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Users, Megaphone, FileText, Bug } from "lucide-react";
import StaffManagement from "@/components/StaffManagement";
import AnnouncementManagement from "@/components/AnnouncementManagement";
import RuleManagement from "@/components/RuleManagement";
import BugReportManagement from "@/components/BugReportManagement";

export default function AdminPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("staff");
  const { logoutMutation } = useAuth();
  
  // Función para cerrar sesión
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      }
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabecera */}
      <header className="bg-[#030F26] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://i.imgur.com/uXFUkqf.png" 
            alt="Lutorlandia Logo" 
            className="h-10 mr-4"
          />
          <h1 className="text-xl font-bold">Panel de Administración</h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-white hover:text-white/80"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </header>
      
      {/* Contenido principal */}
      <main className="flex-1 container mx-auto p-6">
        <Tabs defaultValue="staff" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="staff" className="text-lg py-3 px-4">
                <Users className="h-4 w-4 mr-2" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-lg py-3 px-4">
                <Megaphone className="h-4 w-4 mr-2" />
                Anuncios
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-lg py-3 px-4">
                <FileText className="h-4 w-4 mr-2" />
                Reglas
              </TabsTrigger>
              <TabsTrigger value="bugs" className="text-lg py-3 px-4">
                <Bug className="h-4 w-4 mr-2" />
                Bugs
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="staff" className="mt-6">
            <StaffManagement />
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-6">
            <AnnouncementManagement />
          </TabsContent>
          
          <TabsContent value="rules" className="mt-6">
            <RuleManagement />
          </TabsContent>
          
          <TabsContent value="bugs" className="mt-6">
            <BugReportManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Pie de página */}
      <footer className="bg-[#030F26] text-white py-3 px-6 text-center text-sm">
        <p>© 2025 Lutorlandia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}