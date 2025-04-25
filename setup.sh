#!/bin/bash
# Script de configuración inicial

echo "⚙️ Configurando Lutorlandia Web..."
npm install
cp .env.example .env
echo "✅ Por favor, edita el archivo .env con tus credenciales"
echo "📊 Luego ejecuta: npm run db:push para configurar la base de datos"
