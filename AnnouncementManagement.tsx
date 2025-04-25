import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Esquema para validar anuncios
const announcementSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  content: z
    .string()
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(1000, "El contenido no puede exceder los 1000 caracteres"),
  type: z.enum(["EVENTO", "ACTUALIZACIÓN", "TIENDA"]),
  image: z
    .string()
    .url("Debe ser una URL válida"),
  date: z.string(),
  time: z.string().optional(),
  link: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

// Tipo para un anuncio
type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
  type: "EVENTO" | "ACTUALIZACIÓN" | "TIENDA";
  image: string;
  time?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
};

// Componente para mostrar una etiqueta de tipo con color según el tipo
const TypeLabel = ({ type }: { type: string }) => {
  let variant: any = "default";

  switch (type) {
    case "EVENTO":
      variant = "destructive";
      break;
    case "ACTUALIZACIÓN":
      variant = "default";
      break;
    case "TIENDA":
      variant = "outline";
      break;
    default:
      variant = "secondary";
  }

  return <Badge variant={variant}>{type}</Badge>;
};

export default function AnnouncementManagement() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  // Obtener anuncios
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    refetchOnWindowFocus: false,
  });

  // Formularios
  const addForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "EVENTO",
      image: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      link: "",
    },
  });

  const editForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "EVENTO",
      image: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      link: "",
    },
  });

  // Mutación para crear un anuncio
  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormValues) => {
      return await apiRequest("/api/announcements", {
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Anuncio creado correctamente",
      });
      setIsAddOpen(false);
      addForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo crear el anuncio: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para actualizar un anuncio
  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AnnouncementFormValues }) => {
      return await apiRequest(`/api/announcements/${id}`, {
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Anuncio actualizado correctamente",
      });
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el anuncio: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para eliminar un anuncio
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/announcements/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Anuncio eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el anuncio: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Manejar la creación de un anuncio
  const handleAddAnnouncement = (data: AnnouncementFormValues) => {
    createAnnouncementMutation.mutate(data);
  };

  // Manejar la actualización de un anuncio
  const handleEditAnnouncement = (data: AnnouncementFormValues) => {
    if (currentAnnouncement) {
      updateAnnouncementMutation.mutate({
        id: currentAnnouncement.id,
        data,
      });
    }
  };

  // Abrir el diálogo de edición y establecer el anuncio actual
  const openEditDialog = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    editForm.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      image: announcement.image,
      date: announcement.date,
      time: announcement.time || "",
      link: announcement.link || "",
    });
    setIsEditOpen(true);
  };

  // Confirmar eliminación de un anuncio
  const confirmDelete = (announcement: Announcement) => {
    if (window.confirm(`¿Estás seguro de eliminar el anuncio "${announcement.title}"?`)) {
      deleteAnnouncementMutation.mutate(announcement.id);
    }
  };

  // Formatear fecha
  const formatDate = (dateStr: string, timeStr?: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }

      if (timeStr) {
        const [hours, minutes] = timeStr.split(":");
        date.setHours(Number(hours), Number(minutes));
      }

      return format(date, "PPP", { locale: es });
    } catch (error) {
      return dateStr;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            No se pudieron cargar los anuncios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Error al cargar los datos. Por favor, intenta de nuevo más tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Administración de Anuncios
          </CardTitle>
          <CardDescription>
            Gestiona los anuncios y eventos del servidor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No hay anuncios. Agrega uno nuevo con el botón de abajo.
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">
                        {announcement.title}
                      </TableCell>
                      <TableCell>
                        <TypeLabel type={announcement.type} />
                      </TableCell>
                      <TableCell>
                        {formatDate(announcement.date, announcement.time)}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(announcement)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(announcement)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Crear Anuncio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Anuncio</DialogTitle>
                <DialogDescription>
                  Completa el formulario para agregar un nuevo anuncio o evento
                </DialogDescription>
              </DialogHeader>

              <Form {...addForm}>
                <form
                  onSubmit={addForm.handleSubmit(handleAddAnnouncement)}
                  className="space-y-4"
                >
                  <FormField
                    control={addForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título del anuncio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EVENTO">Evento</SelectItem>
                            <SelectItem value="ACTUALIZACIÓN">
                              Actualización
                            </SelectItem>
                            <SelectItem value="TIENDA">Tienda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora (opcional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={addForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="URL de la imagen"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enlace (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enlace adicional"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contenido del anuncio"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Crear Anuncio</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Anuncio</DialogTitle>
                <DialogDescription>
                  Modifica la información del anuncio
                </DialogDescription>
              </DialogHeader>

              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEditAnnouncement)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título del anuncio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EVENTO">Evento</SelectItem>
                            <SelectItem value="ACTUALIZACIÓN">
                              Actualización
                            </SelectItem>
                            <SelectItem value="TIENDA">Tienda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora (opcional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="URL de la imagen"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enlace (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enlace adicional"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contenido del anuncio"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Actualizar Anuncio</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}