#!/bin/bash
<<<<<<< HEAD
=======
# Script para aplicar los cambios al proyecto Lutorlandia en el servidor dedicado

>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
<<<<<<< HEAD
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
=======

echo -e "${BLUE}▶ Iniciando actualización del proyecto Lutorlandia...${NC}"

# 1. Crear copias de seguridad
echo -e "${BLUE}▶ Creando copias de seguridad...${NC}"
BACKUP_DIR="backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Listado de archivos importantes a respaldar
cp -f package.json $BACKUP_DIR/package.json 2>/dev/null || echo "No existe package.json para respaldar"
cp -f server/index.ts $BACKUP_DIR/index.ts 2>/dev/null || echo "No existe server/index.ts para respaldar"
cp -f server/routes.ts $BACKUP_DIR/routes.ts 2>/dev/null || echo "No existe server/routes.ts para respaldar"
cp -f server/vite.ts $BACKUP_DIR/vite.ts 2>/dev/null || echo "No existe server/vite.ts para respaldar"
cp -f server/storage.ts $BACKUP_DIR/storage.ts 2>/dev/null || echo "No existe server/storage.ts para respaldar"
cp -f shared/schema.ts $BACKUP_DIR/schema.ts 2>/dev/null || echo "No existe shared/schema.ts para respaldar"

echo -e "${GREEN}✅ Copias de seguridad creadas en el directorio '$BACKUP_DIR'${NC}"

# 2. Descomprimir el archivo ZIP con los nuevos archivos
echo -e "${BLUE}▶ Instalando nuevos archivos...${NC}"

# Verificar si existe el archivo lutorlandia-web.zip
if [ ! -f "lutorlandia-web.zip" ]; then
  echo -e "${RED}❌ Error: No se encontró el archivo lutorlandia-web.zip${NC}"
  echo "Por favor, coloca el archivo lutorlandia-web.zip en el mismo directorio que este script."
  exit 1
fi

# Extraer los archivos del ZIP
unzip -o lutorlandia-web.zip

echo -e "${GREEN}✅ Archivos extraídos correctamente${NC}"

# 3. Actualizar permisos de archivos
echo -e "${BLUE}▶ Actualizando permisos...${NC}"
chmod -R 755 .

# 4. Reiniciar servicios necesarios
echo -e "${BLUE}▶ Reiniciando servicios...${NC}"

# Verificar si estamos usando PM2
if command -v pm2 &> /dev/null; then
  echo "Detectado PM2, reiniciando la aplicación..."
  pm2 restart all || echo -e "${RED}❌ Error al reiniciar PM2${NC}"
else
  echo "PM2 no detectado, buscando otros servicios..."
  
  # Intentar reiniciar servicios comunes
  if systemctl is-active --quiet nginx; then
    echo "Reiniciando Nginx..."
    systemctl restart nginx || echo -e "${RED}❌ Error al reiniciar Nginx${NC}"
  fi
  
  if systemctl is-active --quiet apache2; then
    echo "Reiniciando Apache..."
    systemctl restart apache2 || echo -e "${RED}❌ Error al reiniciar Apache${NC}"
  fi
fi

echo -e "${GREEN}✅ ¡Proceso de actualización completado!${NC}"
echo ""
echo -e "${BLUE}Para que los cambios surtan efecto completamente, es posible que debas:${NC}"
echo "1. Instalar dependencias nuevas: npm install"
echo "2. Compilar la aplicación: npm run build"
echo "3. Reiniciar manualmente el servidor: node dist/server.js"
echo ""
echo -e "${GREEN}¡Gracias por usar el actualizador de Lutorlandia!${NC}"
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
