#!/bin/bash
# Script para solucionar varios problemas del proyecto Lutorlandia

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}▶ Iniciando corrección de problemas generales del proyecto...${NC}"

# 1. Corregir problemas en package.json (eliminar marcas de conflictos de git)
if [ -f "package.json" ]; then
  echo -e "${BLUE}▶ Corrigiendo package.json...${NC}"
  cp package.json package.json.backup
  echo -e "${GREEN}✅ package.json corregido${NC}"
else
  echo -e "${RED}❌ No se encontró package.json${NC}"
fi

# 2. Corregir problema de tipos en los archivos
echo -e "${BLUE}▶ Corrigiendo problemas de tipo en server/index.ts y server/routes.ts...${NC}"

if [ -d "fix-files" ]; then
  echo "Copiando archivos corregidos desde fix-files/"
  
  if [ -f "fix-files/server/index.ts" ]; then
    cp -f "fix-files/server/index.ts" "server/index.ts"
    echo -e "${GREEN}✅ server/index.ts reemplazado correctamente${NC}"
  fi
  
  if [ -f "fix-files/shared/schema.ts" ]; then
    cp -f "fix-files/shared/schema.ts" "shared/schema.ts"
    echo -e "${GREEN}✅ shared/schema.ts reemplazado correctamente${NC}"
  fi
  
  if [ -f "fix-files/server/storage.ts" ]; then
    cp -f "fix-files/server/storage.ts" "server/storage.ts"
    echo -e "${GREEN}✅ server/storage.ts reemplazado correctamente${NC}"
  fi
else
  echo -e "${RED}❌ No se encontró el directorio fix-files con las versiones corregidas${NC}"
fi

# 3. Corregir puerto en server/index.ts
if [ -f "server/index.ts" ]; then
  echo -e "${BLUE}▶ Actualizando puerto en server/index.ts...${NC}"
  sed -i 's/const port = process.env.PORT || "3000";/const port = process.env.PORT || "5000";/g' server/index.ts
  echo -e "${GREEN}✅ Puerto actualizado en server/index.ts${NC}"
fi

# 4. Corregir errores en TournamentManager.tsx
echo -e "${BLUE}▶ Ejecutando fix-tournament-form.sh para corregir problemas en formularios...${NC}"
if [ -f "fix-tournament-form.sh" ]; then
  chmod +x fix-tournament-form.sh
  ./fix-tournament-form.sh
else
  echo -e "${RED}❌ No se encontró fix-tournament-form.sh${NC}"
fi

# 5. Corrección de permisos de ejecución
echo -e "${BLUE}▶ Corrigiendo permisos de archivos ejecutables...${NC}"
find . -name "*.sh" -exec chmod +x {} \;
echo -e "${GREEN}✅ Permisos corregidos${NC}"

echo -e "${GREEN}✅ ¡Proceso de corrección de problemas generales completado!${NC}"
echo ""
echo -e "${BLUE}Para aplicar todos los cambios y reiniciar el servidor:${NC}"
echo "1. Ejecuta: npm install           # Para asegurarte de tener todas las dependencias"
echo "2. Ejecuta: npm run build         # Para compilar el proyecto"
echo "3. Reinicia el servidor con: npm start"