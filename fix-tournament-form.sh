#!/bin/bash
# Script para corregir problemas específicos en el componente TournamentManager.tsx

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}▶ Iniciando corrección del componente TournamentManager.tsx...${NC}"

# Buscar el archivo TournamentManager.tsx
TOURNAMENT_PATH=$(find client -name "TournamentManager.tsx" -type f | grep -v "node_modules")

if [ -n "$TOURNAMENT_PATH" ]; then
  echo -e "${GREEN}✅ Archivo TournamentManager.tsx encontrado en: $TOURNAMENT_PATH${NC}"
  
  # Hacer copia de seguridad
  cp "$TOURNAMENT_PATH" "${TOURNAMENT_PATH}.backup"
  
  # Corregir DialogContent para permitir desplazamiento
  sed -i 's/<DialogContent className="max-w-md">/<DialogContent className="max-w-md max-h-\[90vh\] overflow-y-auto">/g' "$TOURNAMENT_PATH"
  sed -i 's/<DialogContent className="max-w-2xl">/<DialogContent className="max-w-2xl max-h-\[90vh\] overflow-y-auto">/g' "$TOURNAMENT_PATH"
  
  # Corregir validación de campos en el esquema
  sed -i '/const tournamentFormSchema = z.object({/,/});/ s/z.nativeEnum(GameModes, {.*}/z.string().min(1, { message: "La modalidad de juego es obligatoria" })/g' "$TOURNAMENT_PATH"
  sed -i '/const tournamentFormSchema = z.object({/,/});/ s/z.nativeEnum(TournamentStatus, {.*}/z.string().min(1, { message: "El estado es obligatorio" })/g' "$TOURNAMENT_PATH"
  
  # Corregir formato de llamadas API
  sed -i 's/apiRequest("DELETE", `\/api\/podium\/${id}`)/apiRequest(`\/api\/podium\/${id}`, { method: "DELETE" })/g' "$TOURNAMENT_PATH"
  sed -i 's/apiRequest("PATCH", `\/api\/form-fields\/${selectedFormField.id}`, fieldData)/apiRequest(`\/api\/form-fields\/${selectedFormField.id}`, {\n            method: "PATCH",\n            data: fieldData\n          })/g' "$TOURNAMENT_PATH"
  sed -i 's/apiRequest("POST", "\/api\/form-fields", fieldData)/apiRequest("\/api\/form-fields", {\n            method: "POST",\n            data: fieldData\n          })/g' "$TOURNAMENT_PATH"
  sed -i 's/apiRequest("DELETE", `\/api\/form-fields\/${id}`)/apiRequest(`\/api\/form-fields\/${id}`, { method: "DELETE" })/g' "$TOURNAMENT_PATH"
  sed -i 's/apiRequest("POST", `\/api\/registrations\/${id}\/approve`)/apiRequest(`\/api\/registrations\/${id}\/approve`, { method: "POST" })/g' "$TOURNAMENT_PATH"
  sed -i 's/apiRequest("DELETE", `\/api\/registrations\/${id}`)/apiRequest(`\/api\/registrations\/${id}`, { method: "DELETE" })/g' "$TOURNAMENT_PATH"
  
  echo -e "${GREEN}✅ Componente TournamentManager.tsx corregido correctamente${NC}"
else
  echo -e "${RED}❌ No se pudo encontrar el archivo TournamentManager.tsx${NC}"
fi

# También buscar y corregir todos los componentes que usan DialogContent
echo -e "${BLUE}▶ Corrigiendo DialogContent en otros componentes...${NC}"

# Lista de directorios donde buscar componentes
COMPONENTS_DIRS=("client/src/components" "client/src/pages")

for dir in "${COMPONENTS_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    DIALOG_FILES=$(grep -l "DialogContent" "$dir"/*.tsx "$dir"/**/*.tsx 2>/dev/null || true)
    
    if [ -n "$DIALOG_FILES" ]; then
      echo -e "${BLUE}Encontrados componentes con DialogContent en $dir:${NC}"
      for file in $DIALOG_FILES; do
        echo "  - Corrigiendo: $file"
        # Hacer copia de seguridad
        cp "$file" "${file}.backup"
        
        # Corregir DialogContent para permitir desplazamiento si no tiene ya max-h
        sed -i 's/<DialogContent className="[^"]*">\([^<]*\)/<DialogContent className="&\1" className="max-h-\[90vh\] overflow-y-auto">/g' "$file"
      done
      echo -e "${GREEN}✅ Diálogos corregidos en $dir${NC}"
    else
      echo -e "${BLUE}No se encontraron componentes con DialogContent en $dir${NC}"
    fi
  fi
done

echo -e "${GREEN}✅ ¡Proceso de corrección completado!${NC}"