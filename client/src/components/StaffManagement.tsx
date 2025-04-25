import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StaffRoles } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";

// Esquema para validar los datos de formulario
const staffFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  role: z
    .string()
    .min(2, "El rol debe tener al menos 2 caracteres")
    .max(50, "El rol no puede exceder los 50 caracteres"),
  roleLabel: z.enum([
    StaffRoles.OWNER,
    StaffRoles.ADMIN,
    StaffRoles.SRMOD,
    StaffRoles.MOD,
    StaffRoles.BUILDER,
  ]),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  avatar: z
    .string()
    .url()
    .refine((url) => url.includes("mc-heads.net"), {
      message: "Debe ser una URL de mc-heads.net"
    }),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

// Tipo para un miembro del staff
type StaffMember = {
  id: number;
  name: string;
  role: string;
  roleLabel: string;
  description: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

// Componente para mostrar una etiqueta de rol con color según el tipo
const RoleLabel = ({ roleLabel }: { roleLabel: string }) => {
  let variant: any = "default";

  switch (roleLabel) {
    case StaffRoles.OWNER:
      variant = "destructive";
      break;
    case StaffRoles.ADMIN:
      variant = "destructive";
      break;
    case StaffRoles.SRMOD:
      variant = "warning";
      break;
    case StaffRoles.MOD:
      variant = "secondary";
      break;
    case StaffRoles.BUILDER:
      variant = "outline";
      break;
    default:
      variant = "default";
  }

  return <Badge variant={variant}>{roleLabel}</Badge>;
};

export default function StaffManagement() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obtener miembros del staff
  const {
    data: staffMembers = [],
    isLoading,
    error,
  } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    refetchOnWindowFocus: false,
  });

  // Formulario para editar staff
  const editForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      role: "",
      roleLabel: StaffRoles.MOD,
      description: "",
      avatar: "",
    },
  });

  // Formulario para agregar staff
  const addForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      role: "",
      roleLabel: StaffRoles.MOD,
      description: "",
      avatar: "",
    },
  });

  // Actualizar el formulario cuando se selecciona un miembro del staff para editar
  useEffect(() => {
    if (currentStaff) {
      editForm.reset({
        name: currentStaff.name,
        role: currentStaff.role,
        roleLabel: currentStaff.roleLabel as any,
        description: currentStaff.description,
        avatar: currentStaff.avatar,
      });
    }
  }, [currentStaff, editForm]);

  // Mutación para crear un miembro del staff
  const createStaffMutation = useMutation({
    mutationFn: async (newStaff: StaffFormValues) => {
      console.log("Enviando datos:", newStaff); // Para depuración
      
      // Asegurar que roleLabel está presente
      const staffData = {
        ...newStaff,
        // También incluimos role_label para compatibilidad con el backend
        role_label: newStaff.roleLabel
      };
      
      console.log("Datos preparados:", staffData);
      
      return await apiRequest("/api/staff", {
        method: "POST",
        data: staffData,
      });
        method: "POST",
        data: newStaff,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Miembro del staff creado correctamente",
      });
      setIsAddOpen(false);
      addForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo crear el miembro del staff: " + (error.message || ''),
        variant: "destructive",
      });
      console.error("Error creating staff member:", error);
    },
  });

  // Mutación para actualizar un miembro del staff
  const updateStaffMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: StaffFormValues;
    }) => {
      console.log("Actualizando datos:", data); // Para depuración
      
      // Asegurar que roleLabel está presente
      const staffData = {
        ...data,
        // También incluimos role_label para compatibilidad con el backend
        role_label: data.roleLabel
      };
      
      console.log("Datos preparados para actualización:", staffData);
      
      return await apiRequest(`/api/staff/${id}`, {
        method: "PUT",
        data: staffData,
      });
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Miembro del staff actualizado correctamente",
      });
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el miembro del staff: " + (error.message || ''),
        variant: "destructive",
      });
      console.error("Error updating staff member:", error);
    },
  });

  // Mutación para eliminar un miembro del staff
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/staff/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Miembro del staff eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el miembro del staff: " + (error.message || ''),
        variant: "destructive",
      });
      console.error("Error deleting staff member:", error);
    },
  });

  // Manejar la creación de un miembro del staff
  const handleAddStaff = (data: StaffFormValues) => {
    console.log("Datos a enviar:", data); // Para depuración
    createStaffMutation.mutate(data);
  };

  // Manejar la actualización de un miembro del staff
  const handleEditStaff = (data: StaffFormValues) => {
    if (currentStaff) {
      console.log("Datos a actualizar:", data); // Para depuración
      updateStaffMutation.mutate({ id: currentStaff.id, data });
    }
  };

  // Abrir el diálogo de edición y establecer el miembro del staff actual
  const openEditDialog = (staff: StaffMember) => {
    setCurrentStaff(staff);
    setIsEditOpen(true);
  };

  // Confirmar eliminación de un miembro del staff
  const confirmDelete = (staff: StaffMember) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${staff.name}?`)) {
      deleteStaffMutation.mutate(staff.id);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            No se pudieron cargar los miembros del staff
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
            Administración del Staff
          </CardTitle>
          <CardDescription>
            Gestiona los miembros del equipo del servidor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(staffMembers) && staffMembers.map((staff: StaffMember) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-10 h-10 rounded"
                      />
                    </TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <RoleLabel roleLabel={staff.roleLabel} />
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(staff)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(staff)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {Array.isArray(staffMembers) && staffMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-400">
                      No hay miembros del staff. Agrega uno nuevo con el botón de abajo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Agregar Miembro</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
                <DialogDescription>
                  Completa el formulario para agregar un nuevo miembro al staff
                </DialogDescription>
              </DialogHeader>

              <Form {...addForm}>
                <form
                  onSubmit={addForm.handleSubmit(handleAddStaff)}
                  className="space-y-4"
                >
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del miembro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título del rol (ej: Administrador)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="roleLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiqueta de Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={StaffRoles.OWNER}>
                              OWNER
                            </SelectItem>
                            <SelectItem value={StaffRoles.ADMIN}>
                              ADMIN
                            </SelectItem>
                            <SelectItem value={StaffRoles.SRMOD}>
                              SRMOD
                            </SelectItem>
                            <SelectItem value={StaffRoles.MOD}>MOD</SelectItem>
                            <SelectItem value={StaffRoles.BUILDER}>
                              BUILDER
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del rol y responsabilidades"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar (URL de mc-heads.net)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://mc-heads.net/avatar/Notch/100.png"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createStaffMutation.isPending}
                    >
                      {createStaffMutation.isPending
                        ? "Guardando..."
                        : "Guardar"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Miembro del Staff</DialogTitle>
                <DialogDescription>
                  Actualiza la información del miembro del staff
                </DialogDescription>
              </DialogHeader>

              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEditStaff)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del miembro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título del rol (ej: Administrador)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="roleLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiqueta de Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={StaffRoles.OWNER}>
                              OWNER
                            </SelectItem>
                            <SelectItem value={StaffRoles.ADMIN}>
                              ADMIN
                            </SelectItem>
                            <SelectItem value={StaffRoles.SRMOD}>
                              SRMOD
                            </SelectItem>
                            <SelectItem value={StaffRoles.MOD}>MOD</SelectItem>
                            <SelectItem value={StaffRoles.BUILDER}>
                              BUILDER
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del rol y responsabilidades"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar (URL de mc-heads.net)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://mc-heads.net/avatar/Notch/100.png"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={updateStaffMutation.isPending}
                    >
                      {updateStaffMutation.isPending
                        ? "Actualizando..."
                        : "Actualizar"}
                    </Button>
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