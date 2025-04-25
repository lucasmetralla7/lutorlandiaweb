import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Staff from "@/pages/Staff";
import Reglas from "@/pages/Reglas";
import Bugs from "@/pages/Bugs";
import AdminPage from "@/pages/admin-page";
import AuthPage from "@/pages/auth-page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Componente para las rutas con layout completo (navbar y footer)
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Componente para las rutas sin layout (panel de admin y auth)
function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Verificar si la ruta actual debe mostrar el layout completo
  const isFullscreenRoute = location === "/admin" || location === "/auth";
  
  if (isFullscreenRoute) {
    return (
      <FullscreenLayout>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </FullscreenLayout>
    );
  }
  
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/staff" component={Staff} />
        <Route path="/reglas" component={Reglas} />
        <Route path="/bugs" component={Bugs} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
