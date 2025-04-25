<<<<<<< HEAD
# Lutorlandia Web

Página web oficial del servidor de Minecraft Lutorlandia.

## Instalación

1. Ejecuta `./setup.sh` para instalar dependencias y crear el archivo .env
2. Edita el archivo .env con tus credenciales
3. Ejecuta `npm run db:push` para configurar la base de datos
4. Ejecuta `npm run build` para compilar el frontend
5. Ejecuta `npm start` para iniciar el servidor

Para más detalles, consulta el archivo `deploy-instructions.md`.
=======
# Lutorlandia - Sitio Web Oficial

Este es el repositorio oficial del sitio web de Lutorlandia, un servidor de Minecraft. El sitio web proporciona información sobre el servidor, su personal, reglas, eventos, estado del servidor y más.

## Características

- Panel de Administración para gestionar personal, anuncios, reglas y más
- Sistema de reportes de bugs con seguimiento de SLA
- Vista de estado del servidor en tiempo real con UptimeRobot
- Sistema de sanciones para rastrear bans, mutes y kicks
- Sistema de torneos con formularios personalizables y podio de ganadores
- Sección de tienda con redirección a la tienda externa
- Diseño temático de Minecraft

## Requisitos Técnicos

- Node.js 18+
- MySQL o MariaDB
- NPM
- Servidor dedicado o VPS con soporte Node.js

## Instalación

1. Clona este repositorio
2. Ejecuta `npm install` para instalar todas las dependencias
3. Configura tu archivo `.env` basándote en `.env.example`
4. Ejecuta `npm run build` para compilar la aplicación
5. Ejecuta `npm start` para iniciar el servidor

## Actualización

Para actualizar el sitio web:

1. Descarga el archivo lutorlandia-web.zip más reciente
2. Sube el archivo a tu servidor junto con el script aplicar-cambios.sh
3. Ejecuta `chmod +x aplicar-cambios.sh`
4. Ejecuta `./aplicar-cambios.sh`
5. Reinicia tus servicios si es necesario

## Soporte

Si encuentras algún problema o necesitas asistencia, contacta a los desarrolladores via Discord.
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
