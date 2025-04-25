import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BugPriorities, GameModes, insertBugReportSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bugFormSchema = insertBugReportSchema.extend({
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  rank: z.string().min(1, {
    message: "Por favor, ingresa tu rango en el servidor.",
  }),
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
});

type BugFormValues = z.infer<typeof bugFormSchema>;

export default function Bugs() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BugFormValues>({
    resolver: zodResolver(bugFormSchema),
    defaultValues: {
      username: "",
      rank: "",
      gameMode: "SURVIVAL",
      title: "",
      description: "",
      imageUrl: "",
      priority: "MEDIA",
    },
  });

  const createBugMutation = useMutation({
    mutationFn: async (data: BugFormValues) => {
      const res = await apiRequest("/api/bug-reports", { method: "POST", data });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bug-reports"] });
      setSubmitted(true);
      toast({
        title: "Reporte enviado",
        description: "Tu reporte de bug ha sido enviado correctamente y será revisado por el equipo.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
      console.error("Error al enviar el reporte:", error);
    },
  });

  const onSubmit = (data: BugFormValues) => {
    createBugMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-success-50 border-success-200">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-success-900 mb-2">¡Reporte enviado con éxito!</h2>
            <p className="text-success-700 mb-4">
              Gracias por ayudarnos a mejorar Lutorlandia. Tu reporte ha sido recibido y será revisado por nuestro equipo.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4">
              Enviar otro reporte
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h1 className="text-4xl font-bold mb-6 text-minecraft-blue">Reportar Bugs</h1>
            <p className="text-gray-200 mb-4">
              ¿Encontraste un error en el servidor? Ayúdanos a mejorarlo reportándolo aquí. Todos los reportes son revisados por nuestro equipo.
            </p>
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-400">¿Qué es un bug?</CardTitle>
                <CardDescription className="text-gray-300">
                  Un bug es cualquier error o comportamiento inesperado que ocurre en el servidor y afecta tu experiencia de juego.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Ejemplos de bugs:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Items que desaparecen sin razón</li>
                  <li>Bloques que no funcionan correctamente</li>
                  <li>Problemas con los comandos</li>
                  <li>Errores en la economía del servidor</li>
                  <li>Glitches en el mundo o construcciones</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-minecraft-blue">Formulario de Reporte</CardTitle>
              <CardDescription className="text-gray-300">
                Completa el formulario con todos los detalles que puedas proporcionar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Nombre de usuario en Minecraft</Label>
                    <Input
                      id="username"
                      placeholder="Tu nombre en el servidor"
                      {...form.register("username")}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {form.formState.errors.username && (
                      <p className="text-red-500 text-sm">{form.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank" className="text-white">Rango en el servidor</Label>
                    <Input
                      id="rank"
                      placeholder="Ej: VIP, Normal, etc."
                      {...form.register("rank")}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {form.formState.errors.rank && (
                      <p className="text-red-500 text-sm">{form.formState.errors.rank.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameMode" className="text-white">Modalidad de juego</Label>
                    <Select
                      defaultValue="SURVIVAL"
                      onValueChange={(value) => form.setValue("gameMode", value as any)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona la modalidad" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value={GameModes.SURVIVAL}>{GameModes.SURVIVAL}</SelectItem>
                        <SelectItem value={GameModes.SKYBLOCK}>{GameModes.SKYBLOCK}</SelectItem>
                        <SelectItem value={GameModes.PIXELMON}>{GameModes.PIXELMON}</SelectItem>
                        <SelectItem value={GameModes.FACTIONS}>{GameModes.FACTIONS}</SelectItem>
                        <SelectItem value={GameModes.OTHER}>{GameModes.OTHER}</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gameMode && (
                      <p className="text-red-500 text-sm">{form.formState.errors.gameMode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-white">Prioridad</Label>
                    <Select
                      defaultValue="MEDIA"
                      onValueChange={(value) => form.setValue("priority", value as any)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona la prioridad" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value={BugPriorities.HIGH}>{BugPriorities.HIGH}</SelectItem>
                        <SelectItem value={BugPriorities.MEDIUM}>{BugPriorities.MEDIUM}</SelectItem>
                        <SelectItem value={BugPriorities.LOW}>{BugPriorities.LOW}</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.priority && (
                      <p className="text-red-500 text-sm">{form.formState.errors.priority.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título del bug</Label>
                  <Input
                    id="title"
                    placeholder="Describe brevemente el bug"
                    {...form.register("title")}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Descripción detallada</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe con detalle qué ocurre, cómo reproducirlo, y cualquier información relevante"
                    rows={5}
                    {...form.register("description")}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-white">URL de imagen (opcional)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="Enlace a una imagen que muestre el bug (imgur, etc.)"
                    {...form.register("imageUrl")}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {form.formState.errors.imageUrl && (
                    <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    Puedes subir una imagen a servicios como Imgur y pegar el enlace aquí.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={createBugMutation.isPending}
                  className="w-full bg-minecraft-blue hover:bg-minecraft-blue/90"
                >
                  {createBugMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Reporte"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}