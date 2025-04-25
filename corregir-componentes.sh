#!/bin/bash

# Script para corregir los problemas de className duplicado en los componentes React de Lutorlandia
# Este script debe ser ejecutado en el servidor de producción

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Corrección de errores de sintaxis en componentes React de Lutorlandia ===${NC}"
echo -e "${BLUE}Este script corregirá los problemas de className duplicado en los diálogos${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -d "/var/www/lutorlandia/client/src/components" ]; then
  echo -e "${RED}Error: No se encontró el directorio de componentes.${NC}"
  echo "Este script debe ejecutarse en el servidor donde está instalada la aplicación."
  echo "Por favor, asegúrate de que la ruta /var/www/lutorlandia/client/src/components existe."
  exit 1
fi

# Crear directorio de respaldo
BACKUP_DIR="/var/www/lutorlandia/backups/$(date +%Y%m%d-%H%M%S)"
echo -e "${BLUE}Creando directorio de respaldo: ${BACKUP_DIR}${NC}"
mkdir -p "$BACKUP_DIR"

# Respaldar archivos antes de modificarlos
echo -e "${BLUE}Haciendo copia de seguridad de los archivos originales...${NC}"
cp -v /var/www/lutorlandia/client/src/components/StaffManagement.tsx "$BACKUP_DIR/"
cp -v /var/www/lutorlandia/client/src/components/AnnouncementManagement.tsx "$BACKUP_DIR/"
cp -v /var/www/lutorlandia/client/src/components/RuleManagement.tsx "$BACKUP_DIR/"

# Corregir StaffManagement.tsx
echo -e "${BLUE}Corrigiendo StaffManagement.tsx...${NC}"
sed -i 's/<DialogContent[^>]*\(<DialogContent[^>]*\)/<DialogContent/g' /var/www/lutorlandia/client/src/components/StaffManagement.tsx
sed -i 's/<DialogContent className="[^"]*"/<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"/g' /var/www/lutorlandia/client/src/components/StaffManagement.tsx

# Corregir AnnouncementManagement.tsx
echo -e "${BLUE}Corrigiendo AnnouncementManagement.tsx...${NC}"
sed -i 's/<DialogContent[^>]*\(<DialogContent[^>]*\)/<DialogContent/g' /var/www/lutorlandia/client/src/components/AnnouncementManagement.tsx
sed -i 's/<DialogContent className="[^"]*"/<DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"/g' /var/www/lutorlandia/client/src/components/AnnouncementManagement.tsx

# Corregir RuleManagement.tsx
echo -e "${BLUE}Corrigiendo RuleManagement.tsx...${NC}"
sed -i 's/<DialogContent[^>]*\(<DialogContent[^>]*\)/<DialogContent/g' /var/www/lutorlandia/client/src/components/RuleManagement.tsx
sed -i 's/<DialogContent className="[^"]*"/<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"/g' /var/www/lutorlandia/client/src/components/RuleManagement.tsx

echo -e "${GREEN}✓ Correcciones aplicadas exitosamente.${NC}"

# Reconstruir la aplicación y reiniciar el servicio
echo -e "${BLUE}Reconstruyendo la aplicación...${NC}"
cd /var/www/lutorlandia && npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Aplicación reconstruida exitosamente.${NC}"
  
  echo -e "${BLUE}Reiniciando el servicio...${NC}"
  pm2 restart lutorlandia
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Servicio reiniciado exitosamente.${NC}"
    echo -e "${GREEN}=== Corrección completada con éxito ===${NC}"
    echo "Los archivos originales se han respaldado en $BACKUP_DIR"
  else
    echo -e "${RED}Error al reiniciar el servicio.${NC}"
    echo "Puedes intentar reiniciarlo manualmente con: pm2 restart lutorlandia"
  fi
else
  echo -e "${RED}Error al reconstruir la aplicación.${NC}"
  echo "Por favor, revisa los logs de errores para más detalles."
fi
