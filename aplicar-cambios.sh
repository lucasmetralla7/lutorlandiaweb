#!/bin/bash
# Script para aplicar los cambios al proyecto Lutorlandia en el servidor dedicado

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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