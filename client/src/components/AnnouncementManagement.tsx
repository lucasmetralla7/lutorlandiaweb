import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ANNOUNCEMENT_TYPES } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";

// Esquema para validar los anuncios
const announcementSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  date: z.string().min(5, "La fecha es requerida"),
  type: z.enum(["EVENTO", "ACTUALIZACIÓN", "TIENDA"], {
    required_error: "El tipo de anuncio es requerido",
  }),
  image: z.string().url("Debe ser una URL válida para la imagen"),
  time: z.string().optional(),
  link: z.string().url("Debe ser una URL válida").optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

// Tipo para los datos del anuncio
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

export default function AnnouncementManagement() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState<number | null>(null);

  // Consulta para obtener todos los anuncios
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements");
      if (!res.ok) {
        throw new Error("Error al cargar los anuncios");
      }
      return await res.json() as Announcement[];
    },
  });

  // Mutación para crear un nuevo anuncio
  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormValues) => {
      const res = await apiRequest("/api/announcements", {
        method: "POST",
        data
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear el anuncio");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Anuncio creado",
        description: "El anuncio ha sido creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para actualizar un anuncio
  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AnnouncementFormValues }) => {
      const res = await apiRequest(`/api/announcements/${id}`, {
        method: "PUT",
        data
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar el anuncio");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Anuncio actualizado",
        description: "El anuncio ha sido actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsEditDialogOpen(false);
      setEditingAnnouncement(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para eliminar un anuncio
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(`/api/announcements/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Error al eliminar el anuncio");
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Anuncio eliminado",
        description: "El anuncio ha sido eliminado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setDeleteAnnouncementId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Formulario para añadir un nuevo anuncio
  const addForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" }),
      type: "EVENTO",
      image: "",
      time: "",
      link: "",
    },
  });

  // Formulario para editar un anuncio
  const editForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      date: "",
      type: "EVENTO",
      image: "",
      time: "",
      link: "",
    },
  });

  // Función para manejar la creación de un nuevo anuncio
  const handleAddAnnouncement = (data: AnnouncementFormValues) => {
    createAnnouncementMutation.mutate(data);
  };

  // Función para manejar la edición de un anuncio
  const handleEditAnnouncement = (data: AnnouncementFormValues) => {
    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({ id: editingAnnouncement.id, data });
    }
  };

  // Función para abrir el diálogo de edición y cargar los datos del anuncio
  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    editForm.reset({
      title: announcement.title,
      content: announcement.content,
      date: announcement.date,
      type: announcement.type,
      image: announcement.image,
      time: announcement.time || "",
      link: announcement.link || "",
    });
    setIsEditDialogOpen(true);
  };

  // Función para confirmar la eliminación de un anuncio
  const confirmDelete = (announcement: Announcement) => {
    setDeleteAnnouncementId(announcement.id);
  };

  // Renderizar el componente
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Administración de Anuncios</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Anuncio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Anuncio</DialogTitle>
              <DialogDescription>
                Añade un nuevo anuncio a la página principal.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddAnnouncement)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título del anuncio" {...field} />
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
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 23 de Julio, 2023" {...field} />
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EVENTO">{ANNOUNCEMENT_TYPES.EVENT}</SelectItem>
                            <SelectItem value="ACTUALIZACIÓN">{ANNOUNCEMENT_TYPES.UPDATE}</SelectItem>
                            <SelectItem value="TIENDA">{ANNOUNCEMENT_TYPES.STORE}</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>URL de la imagen</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 5PM EST" {...field} />
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
                          <Input placeholder="https://ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={createAnnouncementMutation.isPending}
                  >
                    {createAnnouncementMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Crear Anuncio
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={announcement.image} 
                  alt={announcement.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                  {announcement.type}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{announcement.title}</CardTitle>
                <CardDescription>{announcement.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{announcement.content}</p>
                {announcement.time && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hora: {announcement.time}
                  </p>
                )}
                {announcement.link && (
                  <p className="mt-1 text-sm">
                    <a href={announcement.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Enlace externo
                    </a>
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => openEditDialog(announcement)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => confirmDelete(announcement)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  
                  {deleteAnnouncementId === announcement.id && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteAnnouncementId(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                          disabled={deleteAnnouncementMutation.isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteAnnouncementMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card">
          <p className="text-muted-foreground">No hay anuncios disponibles.</p>
          <p className="mt-2">Crea un nuevo anuncio usando el botón "Nuevo Anuncio".</p>
        </div>
      )}
      
      {/* Diálogo para editar un anuncio */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Anuncio</DialogTitle>
            <DialogDescription>
              Modifica los detalles del anuncio.
            </DialogDescription>
          </DialogHeader>
          {editingAnnouncement && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditAnnouncement)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título del anuncio" {...field} />
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
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 23 de Julio, 2023" {...field} />
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EVENTO">{ANNOUNCEMENT_TYPES.EVENT}</SelectItem>
                            <SelectItem value="ACTUALIZACIÓN">{ANNOUNCEMENT_TYPES.UPDATE}</SelectItem>
                            <SelectItem value="TIENDA">{ANNOUNCEMENT_TYPES.STORE}</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>URL de la imagen</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 5PM EST" {...field} />
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
                          <Input placeholder="https://ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingAnnouncement(null);
                    }}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={updateAnnouncementMutation.isPending}
                  >
                    {updateAnnouncementMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar Cambios
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}