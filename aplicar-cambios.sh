#!/bin/bash
# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
echo -e "${BLUE}Aplicando cambios a los archivos...${NC}"
# 1. Hacer copia de seguridad
echo -e "${BLUE}Creando copias de seguridad...${NC}"
cp server/routes.ts server/routes.ts.backup
cp client/src/components/StaffManagement.tsx client/src/components/StaffManagement.tsx.backup
# 2. Modificar server/routes.ts
echo -e "${BLUE}Modificando server/routes.ts...${NC}"
sed -i '/app.post("\/api\/staff", isAuthenticated, async (req, res) => {/,/});/c\
  app.post("/api/staff", isAuthenticated, async (req, res) => {\
    try {\
      console.log("POST /api/staff - Body recibido:", JSON.stringify(req.body));\
      // Verificar si el campo roleLabel está presente\
      if (!req.body.roleLabel && req.body.role_label) {\
        console.log("Convirtiendo role_label a roleLabel...");\
        req.body.roleLabel = req.body.role_label;\
      }\
      \
      // Intentar hacer el parsing después de asegurar que roleLabel existe\
      const newStaffMember = insertStaffMemberSchema.parse(req.body);\
      console.log("Datos validados correctamente:", JSON.stringify(newStaffMember));\
      \
      const createdStaffMember = await storage.createStaffMember(newStaffMember);\
      res.status(201).json(createdStaffMember);\
    } catch (error) {\
      console.error("Error creating staff member:", error);\
      res.status(error instanceof z.ZodError ? 400 : 500)\
        .json({ \
          error: "Error al crear el miembro del staff",\
          details: error instanceof z.ZodError ? error.errors : undefined\
        });\
    }\
  });' server/routes.ts
# 3. Modificar StaffManagement.tsx para createStaffMutation
echo -e "${BLUE}Modificando StaffManagement.tsx (createStaffMutation)...${NC}"
sed -i '/const createStaffMutation = useMutation({/,/return await apiRequest/c\
  const createStaffMutation = useMutation({\
    mutationFn: async (newStaff: StaffFormValues) => {\
      console.log("Enviando datos:", newStaff); // Para depuración\
      \
      // Asegurar que roleLabel está presente\
      const staffData = {\
        ...newStaff,\
        // También incluimos role_label para compatibilidad con el backend\
        role_label: newStaff.roleLabel\
      };\
      \
      console.log("Datos preparados:", staffData);\
      \
      return await apiRequest("/api/staff", {\
        method: "POST",\
        data: staffData,\
      });' client/src/components/StaffManagement.tsx
# 4. Modificar StaffManagement.tsx para updateStaffMutation
echo -e "${BLUE}Modificando StaffManagement.tsx (updateStaffMutation)...${NC}"
sed -i '/const updateStaffMutation = useMutation({/,/return await apiRequest/c\
  const updateStaffMutation = useMutation({\
    mutationFn: async ({\
      id,\
      data,\
    }: {\
      id: number;\
      data: StaffFormValues;\
    }) => {\
      console.log("Actualizando datos:", data); // Para depuración\
      \
      // Asegurar que roleLabel está presente\
      const staffData = {\
        ...data,\
        // También incluimos role_label para compatibilidad con el backend\
        role_label: data.roleLabel\
      };\
      \
      console.log("Datos preparados para actualización:", staffData);\
      \
      return await apiRequest(`/api/staff/${id}`, {\
        method: "PUT",\
        data: staffData,\
      });' client/src/components/StaffManagement.tsx
# 5. Reiniciar el servidor web (ajusta según tu configuración)
echo -e "${BLUE}Reiniciando el servidor web...${NC}"
# Descomenta la línea adecuada para tu configuración:
# systemctl restart apache2
# systemctl restart nginx
# service apache2 restart
# service nginx restart
echo -e "${GREEN}¡Cambios aplicados con éxito!${NC}"
echo -e "${BLUE}Si encuentras algún problema, puedes restaurar las copias de seguridad:${NC}"
echo "  cp server/routes.ts.backup server/routes.ts"
echo "  cp client/src/components/StaffManagement.tsx.backup client/src/components/StaffManagement.tsx"
