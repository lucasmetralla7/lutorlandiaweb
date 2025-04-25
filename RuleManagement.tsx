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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema para validar categorías
const ruleCategorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(200, "La descripción no puede exceder los 200 caracteres"),
  order: z.coerce.number().int().min(0),
});

// Esquema para validar reglas
const ruleSchema = z.object({
  categoryId: z.coerce.number().int().min(1, "Debes seleccionar una categoría"),
  title: z
    .string()
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(1000, "La descripción no puede exceder los 1000 caracteres"),
  order: z.coerce.number().int().min(0),
});

type RuleCategoryFormValues = z.infer<typeof ruleCategorySchema>;
type RuleFormValues = z.infer<typeof ruleSchema>;

// Tipos para las reglas y categorías
type RuleCategory = {
  id: number;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type Rule = {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export default function RuleManagement() {
  // Estados para controlar los diálogos
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
  const [isEditRuleDialogOpen, setIsEditRuleDialogOpen] = useState(false);
  
  // Estados para los elementos actualmente seleccionados
  const [currentCategory, setCurrentCategory] = useState<RuleCategory | null>(null);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [activeTab, setActiveTab] = useState("categories");
  
  // Estado para confirmar eliminaciones
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteRuleId, setDeleteRuleId] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Consultas para obtener datos
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery<RuleCategory[]>({
    queryKey: ["/api/rule-categories"],
    refetchOnWindowFocus: false,
  });

  const {
    data: rules = [],
    isLoading: isRulesLoading,
    error: rulesError,
  } = useQuery<Rule[]>({
    queryKey: ["/api/rules"],
    refetchOnWindowFocus: false,
  });

  // Formularios para categorías
  const addCategoryForm = useForm<RuleCategoryFormValues>({
    resolver: zodResolver(ruleCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
  });

  const editCategoryForm = useForm<RuleCategoryFormValues>({
    resolver: zodResolver(ruleCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
  });

  // Formularios para reglas
  const addRuleForm = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      categoryId: 0,
      title: "",
      description: "",
      order: 0,
    },
  });

  const editRuleForm = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      categoryId: 0,
      title: "",
      description: "",
      order: 0,
    },
  });

  // Mutaciones para categorías
  const createCategoryMutation = useMutation({
    mutationFn: async (data: RuleCategoryFormValues) => {
      return await apiRequest("/api/rule-categories", {
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
      setIsAddCategoryDialogOpen(false);
      addCategoryForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/rule-categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RuleCategoryFormValues }) => {
      return await apiRequest(`/api/rule-categories/${id}`, {
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
      setIsEditCategoryDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/rule-categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/rule-categories/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
      setDeleteCategoryId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/rule-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    },
  });

  // Mutaciones para reglas
  const createRuleMutation = useMutation({
    mutationFn: async (data: RuleFormValues) => {
      return await apiRequest("/api/rules", {
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Regla creada correctamente",
      });
      setIsAddRuleDialogOpen(false);
      addRuleForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la regla",
        variant: "destructive",
      });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RuleFormValues }) => {
      return await apiRequest(`/api/rules/${id}`, {
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Regla actualizada correctamente",
      });
      setIsEditRuleDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la regla",
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/rules/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Regla eliminada correctamente",
      });
      setDeleteRuleId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la regla",
        variant: "destructive",
      });
    },
  });

  // Manejadores para categorías
  const handleAddCategory = (data: RuleCategoryFormValues) => {
    createCategoryMutation.mutate(data);
  };

  const handleEditCategory = (data: RuleCategoryFormValues) => {
    if (currentCategory) {
      updateCategoryMutation.mutate({ id: currentCategory.id, data });
    }
  };

  const openEditCategoryDialog = (category: RuleCategory) => {
    setCurrentCategory(category);
    editCategoryForm.reset({
      name: category.name,
      description: category.description,
      order: category.order,
    });
    setIsEditCategoryDialogOpen(true);
  };

  const confirmDeleteCategory = (category: RuleCategory) => {
    setDeleteCategoryId(category.id);
  };

  // Manejadores para reglas
  const handleAddRule = (data: RuleFormValues) => {
    createRuleMutation.mutate(data);
  };

  const handleEditRule = (data: RuleFormValues) => {
    if (currentRule) {
      updateRuleMutation.mutate({ id: currentRule.id, data });
    }
  };

  const openEditRuleDialog = (rule: Rule) => {
    setCurrentRule(rule);
    editRuleForm.reset({
      categoryId: rule.categoryId,
      title: rule.title,
      description: rule.description,
      order: rule.order,
    });
    setIsEditRuleDialogOpen(true);
  };

  const confirmDeleteRule = (rule: Rule) => {
    setDeleteRuleId(rule.id);
  };

  // Filtrar reglas por categoría
  const getRulesByCategory = (categoryId: number) => {
    return rules.filter(rule => rule.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  };

  if (categoriesError || rulesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            No se pudieron cargar las reglas o categorías
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

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reglas del Servidor</h2>
        <p className="text-muted-foreground">
          Administra las reglas y normativas del servidor
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="rules">Reglas</TabsTrigger>
        </TabsList>
        
        {/* Tab para administrar categorías */}
        <TabsContent value="categories" className="py-4">
          <div className="flex justify-end mb-6">
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>
                    Crea una nueva categoría para organizar las reglas del servidor.
                  </DialogDescription>
                </DialogHeader>
                <Form {...addCategoryForm}>
                  <form onSubmit={addCategoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
                    <FormField
                      control={addCategoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de la categoría" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addCategoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción breve de la categoría" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addCategoryForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="Orden de aparición (0 = primero)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={createCategoryMutation.isPending}
                      >
                        {createCategoryMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Crear Categoría
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isCategoriesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>Orden: {category.order}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{category.description}</p>
                    <div className="mt-4">
                      <strong>Reglas en esta categoría:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {getRulesByCategory(category.id).map((rule) => (
                          <li key={rule.id}>{rule.title}</li>
                        ))}
                      </ul>
                      {getRulesByCategory(category.id).length === 0 && (
                        <p className="text-muted-foreground text-sm mt-2">No hay reglas en esta categoría</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditCategoryDialog(category)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => confirmDeleteCategory(category)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      
                      {deleteCategoryId === category.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la categoría y todas sus reglas asociadas. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteCategoryId(null)}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
                              disabled={deleteCategoryMutation.isPending}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteCategoryMutation.isPending && (
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
              <p className="text-muted-foreground">No hay categorías disponibles.</p>
              <p className="mt-2">Crea una nueva categoría usando el botón "Nueva Categoría".</p>
            </div>
          )}
          
          {/* Diálogo para editar categoría */}
          <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Categoría</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la categoría.
                </DialogDescription>
              </DialogHeader>
              {currentCategory && (
                <Form {...editCategoryForm}>
                  <form onSubmit={editCategoryForm.handleSubmit(handleEditCategory)} className="space-y-4">
                    <FormField
                      control={editCategoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de la categoría" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editCategoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción breve de la categoría" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editCategoryForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="Orden de aparición (0 = primero)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={() => {
                          setIsEditCategoryDialogOpen(false);
                          setCurrentCategory(null);
                        }}>
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={updateCategoryMutation.isPending}
                      >
                        {updateCategoryMutation.isPending && (
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
        </TabsContent>
        
        {/* Tab para administrar reglas */}
        <TabsContent value="rules" className="py-4">
          <div className="flex justify-end mb-6">
            <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Regla
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Regla</DialogTitle>
                  <DialogDescription>
                    Añade una nueva regla al servidor.
                  </DialogDescription>
                </DialogHeader>
                <Form {...addRuleForm}>
                  <form onSubmit={addRuleForm.handleSubmit(handleAddRule)} className="space-y-4">
                    <FormField
                      control={addRuleForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sortedCategories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addRuleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título de la regla" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addRuleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción detallada de la regla" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addRuleForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="Orden de aparición (0 = primero)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={createRuleMutation.isPending}
                      >
                        {createRuleMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Crear Regla
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isRulesLoading || isCategoriesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rules.length > 0 && categories.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {sortedCategories.map((category) => {
                const categoryRules = getRulesByCategory(category.id);
                
                return (
                  <AccordionItem key={category.id} value={`category-${category.id}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {category.name} ({categoryRules.length} reglas)
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      {categoryRules.length > 0 ? (
                        <div className="space-y-4">
                          {categoryRules.map((rule) => (
                            <Card key={rule.id}>
                              <CardHeader>
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                                  <span className="text-sm text-muted-foreground">
                                    Orden: {rule.order}
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p>{rule.description}</p>
                              </CardContent>
                              <CardFooter className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openEditRuleDialog(rule)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => confirmDeleteRule(rule)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </Button>
                                  </AlertDialogTrigger>
                                  
                                  {deleteRuleId === rule.id && (
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción eliminará la regla. Esta acción no se puede deshacer.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteRuleId(null)}>
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteRuleMutation.mutate(rule.id)}
                                          disabled={deleteRuleMutation.isPending}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {deleteRuleMutation.isPending && (
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
                        <div className="text-center py-6 border rounded-lg bg-card">
                          <p className="text-muted-foreground">No hay reglas en esta categoría.</p>
                          <p className="mt-2">Añade reglas usando el botón "Nueva Regla".</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-card">
              <p className="text-muted-foreground">
                {categories.length === 0 
                  ? "No hay categorías disponibles. Crea categorías primero antes de añadir reglas." 
                  : "No hay reglas disponibles."}
              </p>
              <p className="mt-2">
                {categories.length === 0 
                  ? "Ve a la pestaña 'Categorías' para crear una categoría." 
                  : "Crea una nueva regla usando el botón 'Nueva Regla'."}
              </p>
            </div>
          )}
          
          {/* Diálogo para editar regla */}
          <Dialog open={isEditRuleDialogOpen} onOpenChange={setIsEditRuleDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Regla</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la regla.
                </DialogDescription>
              </DialogHeader>
              {currentRule && (
                <Form {...editRuleForm}>
                  <form onSubmit={editRuleForm.handleSubmit(handleEditRule)} className="space-y-4">
                    <FormField
                      control={editRuleForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sortedCategories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editRuleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título de la regla" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editRuleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción detallada de la regla" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editRuleForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="Orden de aparición (0 = primero)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={() => {
                          setIsEditRuleDialogOpen(false);
                          setCurrentRule(null);
                        }}>
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={updateRuleMutation.isPending}
                      >
                        {updateRuleMutation.isPending && (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}