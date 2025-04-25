import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle, Clock, Bug, Check, X, ListFilter } from "lucide-react";
import { BugStatus } from "@shared/schema";

type BugReport = {
  id: number;
  username: string;
  rank: string;
  gameMode: string;
  title: string;
  description: string;
  imageUrl?: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  resolvedAt?: string;
};

export default function BugReportManagement() {
  const { toast } = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedBugReport, setSelectedBugReport] = useState<BugReport | null>(null);

  // Fetch pending bug reports
  const {
    data: pendingBugs = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = useQuery({
    queryKey: ["/api/bug-reports/pending"],
    queryFn: async () => {
      const res = await fetch("/api/bug-reports/pending");
      if (!res.ok) throw new Error("Error al cargar reportes pendientes");
      return res.json();
    },
  });

  // Fetch validated bug reports
  const {
    data: validatedBugs = [],
    isLoading: validatedLoading,
    error: validatedError,
  } = useQuery({
    queryKey: ["/api/bug-reports/validated"],
    queryFn: async () => {
      const res = await fetch("/api/bug-reports/validated");
      if (!res.ok) throw new Error("Error al cargar reportes validados");
      return res.json();
    },
  });
  
  // Fetch all bug reports for history
  const {
    data: allBugs = [],
    isLoading: allBugsLoading,
    error: allBugsError,
  } = useQuery({
    queryKey: ["/api/bug-reports"],
    queryFn: async () => {
      const res = await fetch("/api/bug-reports");
      if (!res.ok) throw new Error("Error al cargar historial de reportes");
      return res.json();
    },
  });

  // Mutation for validating bug reports
  const validateMutation = useMutation({
    mutationFn: async (id: number) => {
      // Utilizar directamente fetch en lugar de apiRequest
      const res = await fetch(`/api/bug-reports/${id}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Error desconocido al validar el bug");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports/validated"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports"] });
      toast({
        title: "Reporte validado",
        description: "El reporte ha sido validado correctamente.",
      });
    },
    onError: (error: Error) => {
      console.error("Error al validar el bug:", error);
      toast({
        title: "Error",
        description: "No se pudo validar el reporte: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for rejecting bug reports
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      // Ahora usamos PUT en lugar de DELETE
      const res = await fetch(`/api/bug-reports/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Error desconocido al rechazar el bug");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports"] });
      toast({
        title: "Reporte rechazado",
        description: "El reporte ha sido rechazado correctamente.",
      });
      setDeleteConfirmOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error al rechazar el bug:", error);
      toast({
        title: "Error",
        description: "No se pudo rechazar el reporte: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for resolving bug reports
  const resolveMutation = useMutation({
    mutationFn: async (id: number) => {
      // Utilizar directamente fetch en lugar de apiRequest
      const res = await fetch(`/api/bug-reports/${id}/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Error desconocido al resolver el bug");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports/validated"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports"] });
      toast({
        title: "Bug resuelto",
        description: "El bug ha sido marcado como resuelto.",
      });
    },
    onError: (error: Error) => {
      console.error("Error al resolver el bug:", error);
      toast({
        title: "Error",
        description: "No se pudo resolver el bug: " + error.message,
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleValidateBug = (bugReport: BugReport) => {
    validateMutation.mutate(bugReport.id);
  };

  const confirmRejectBug = (bugReport: BugReport) => {
    setSelectedBugReport(bugReport);
    setDeleteConfirmOpen(true);
  };

  const handleRejectBug = () => {
    if (selectedBugReport) {
      rejectMutation.mutate(selectedBugReport.id);
    }
  };

  const handleResolveBug = (bugReport: BugReport) => {
    resolveMutation.mutate(bugReport.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "ALTA":
        return "bg-red-500 border border-red-400 shadow-sm shadow-red-900/50";
      case "MEDIA":
        return "bg-yellow-500 border border-yellow-400 shadow-sm shadow-yellow-900/50";
      case "BAJA":
        return "bg-green-500 border border-green-400 shadow-sm shadow-green-900/50";
      default:
        return "bg-gray-500 border border-gray-400 shadow-sm shadow-gray-900/50";
    }
  };

  const renderBugCard = (bug: BugReport, isValidated: boolean) => (
    <Card key={bug.id} className={`mb-4 overflow-hidden border-2 ${
      isValidated ? "bg-yellow-950/40 border-yellow-500" : "bg-blue-950/40 border-blue-500"
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{bug.title}</CardTitle>
            <CardDescription className="text-gray-400">
              Reportado por: {bug.username} ({bug.rank}) - {formatDate(bug.createdAt)}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={`${getPriorityColor(bug.priority)} text-white`}>
              {bug.priority}
            </Badge>
            <Badge className={`${
              isValidated ? "bg-yellow-600 border border-yellow-400 shadow-md shadow-yellow-900/50" : "bg-blue-600 border border-blue-400 shadow-md shadow-blue-900/50"
            } text-white font-medium`}>
              {isValidated ? "Validado" : "Pendiente"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-400">Modo de juego</p>
            <p className="text-white">{bug.gameMode}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Descripción</p>
            <p className="text-white whitespace-pre-line">{bug.description}</p>
          </div>
          {bug.imageUrl && (
            <div>
              <p className="text-sm font-medium text-gray-400">Imagen</p>
              <a 
                href={bug.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Ver imagen
              </a>
            </div>
          )}
          
          <div className="pt-2 flex justify-end space-x-2">
            {!isValidated ? (
              <>
                <Button
                  onClick={() => handleValidateBug(bug)}
                  disabled={validateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {validateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Validar
                </Button>
                <Button
                  onClick={() => confirmRejectBug(bug)}
                  disabled={rejectMutation.isPending}
                  variant="destructive"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Rechazar
                </Button>
              </>
            ) : (
              <>
                {bug.status !== BugStatus.RESOLVED && bug.status !== "RESUELTO" && (
                  <Button
                    onClick={() => handleResolveBug(bug)}
                    disabled={resolveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {resolveMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Marcar como resuelto
                  </Button>
                )}
                {(bug.status === BugStatus.RESOLVED || bug.status === "RESUELTO") && (
                  <Badge className="bg-green-600 border border-green-400 shadow-md shadow-green-900/50 text-white font-medium">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Resuelto el {formatDate(bug.resolvedAt || "")}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center">
            <Bug className="h-6 w-6 text-minecraft-blue mr-2" />
            <CardTitle className="text-white">Gestión de Reportes de Bugs</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Revisa y gestiona los reportes de bugs enviados por los usuarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger 
                value="pending"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-900/40 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pendientes ({pendingBugs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="validated"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-yellow-900/40 data-[state=active]:border-b-2 data-[state=active]:border-yellow-500"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Validados ({validatedBugs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-900/60 data-[state=active]:border-b-2 data-[state=active]:border-gray-500"
              >
                <ListFilter className="h-4 w-4 mr-2" />
                Histórico ({allBugs.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {pendingLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-minecraft-blue" />
                </div>
              ) : pendingError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-white">Error al cargar los reportes pendientes.</p>
                </div>
              ) : pendingBugs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No hay reportes pendientes de revisión.</p>
                </div>
              ) : (
                <div>
                  {pendingBugs.map((bug: BugReport) => renderBugCard(bug, false))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="validated" className="mt-4">
              {validatedLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-minecraft-blue" />
                </div>
              ) : validatedError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-white">Error al cargar los reportes validados.</p>
                </div>
              ) : validatedBugs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No hay reportes validados.</p>
                </div>
              ) : (
                <div>
                  {validatedBugs.map((bug: BugReport) => renderBugCard(bug, true))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              {allBugsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-minecraft-blue" />
                </div>
              ) : allBugsError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-white">Error al cargar el historial de reportes.</p>
                </div>
              ) : allBugs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No hay reportes de bugs registrados.</p>
                </div>
              ) : (
                <div>
                  {allBugs.map((bug: BugReport) => (
                    <Card key={bug.id} className={`mb-4 border-2 overflow-hidden ${
                      bug.status === "RECHAZADO" ? "bg-red-950/40 border-red-600" : 
                      bug.status === "VALIDADO" ? "bg-yellow-950/40 border-yellow-500" : 
                      bug.status === "RESOLVED" || bug.status === "RESUELTO" ? "bg-green-950/40 border-green-500" : 
                      bug.status === "PENDIENTE" ? "bg-blue-950/40 border-blue-500" : 
                      "bg-gray-800 border-gray-700"
                    }`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{bug.title}</CardTitle>
                            <CardDescription className="text-gray-400">
                              Reportado por: {bug.username} ({bug.rank}) - {formatDate(bug.createdAt)}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge className={`${getPriorityColor(bug.priority)} text-white`}>
                              {bug.priority}
                            </Badge>
                            <Badge className={`${
                              bug.status === "RECHAZADO" ? "bg-red-600 border border-red-400 shadow-md shadow-red-900/50" : 
                              bug.status === "VALIDADO" ? "bg-yellow-600 border border-yellow-400 shadow-md shadow-yellow-900/50" : 
                              bug.status === "RESOLVED" || bug.status === "RESUELTO" ? "bg-green-600 border border-green-400 shadow-md shadow-green-900/50" : 
                              bug.status === "PENDIENTE" ? "bg-blue-600 border border-blue-400 shadow-md shadow-blue-900/50" : 
                              "bg-gray-600"
                            } text-white font-medium`}>
                              {bug.status === "RECHAZADO" ? "Denegado" : 
                               bug.status === "VALIDADO" ? "Validado" : 
                               bug.status === "RESOLVED" || bug.status === "RESUELTO" ? "Resuelto" : 
                               bug.status === "PENDIENTE" ? "Pendiente" : 
                               bug.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-400">Modo de juego</p>
                            <p className="text-white">{bug.gameMode}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-400">Descripción</p>
                            <p className="text-white whitespace-pre-line">{bug.description}</p>
                          </div>
                          {bug.imageUrl && (
                            <div>
                              <p className="text-sm font-medium text-gray-400">Imagen</p>
                              <a 
                                href={bug.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                              >
                                Ver imagen
                              </a>
                            </div>
                          )}
                          
                          <div className="space-y-2 mt-2">
                            {bug.validatedAt && (
                              <div className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-950/30 border border-yellow-700/50">
                                <CheckCircle2 className="h-3 w-3 text-yellow-400 mr-1" />
                                <p className="text-xs font-medium text-yellow-400">
                                  Validado el {formatDate(bug.validatedAt)}
                                </p>
                              </div>
                            )}
                            {bug.resolvedAt && (
                              <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-950/30 border border-green-700/50">
                                <CheckCircle2 className="h-3 w-3 text-green-400 mr-1" />
                                <p className="text-xs font-medium text-green-400">
                                  Resuelto el {formatDate(bug.resolvedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción rechazará el reporte de bug y lo eliminará del sistema. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectBug}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Rechazar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}