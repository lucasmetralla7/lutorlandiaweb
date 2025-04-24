# Instrucciones de Despliegue para Lutorlandia

Este documento contiene las instrucciones para desplegar correctamente el sitio web de Lutorlandia en un servidor dedicado.

## Requisitos del Servidor

- Node.js v18.x o superior
- MySQL 8.0 o superior
- NPM 9.x o superior
- PM2 (opcional, para gestión de procesos)

## Pasos para el Despliegue

### 1. Configuración de la Base de Datos

1. Crea una base de datos MySQL:
   ```sql
   CREATE DATABASE lutorlandia_web;
   CREATE USER 'lutorlandia_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
   GRANT ALL PRIVILEGES ON lutorlandia_web.* TO 'lutorlandia_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Configura las variables de entorno para la conexión:

   Crea un archivo `.env` en la raíz del proyecto con la siguiente información:
   ```
   # Configuración de la Base de Datos
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=lutorlandia_web
   DB_USER=lutorlandia_user
   DB_PASSWORD=tu_contraseña_segura
   
   # Configuración del Servidor
   PORT=3000
   NODE_ENV=production
   SESSION_SECRET=una_clave_secreta_muy_larga_y_segura
   ```

### 2. Instalación y Configuración

1. Descomprime el archivo ZIP en el directorio deseado:
   ```bash
   unzip lutorlandia-web.zip -d /ruta/a/tu/aplicacion
   cd /ruta/a/tu/aplicacion
   ```

2. Instala las dependencias:
   ```bash
   npm install --omit=dev
   ```

3. Ejecuta las migraciones para crear las tablas en la base de datos:
   ```bash
   npm run db:push
   ```

### 3. Compilación y Ejecución

1. Compila el frontend:
   ```bash
   npm run build
   ```

2. Inicia el servidor:
   ```bash
   npm start
   ```

   O con PM2 para mantenerlo ejecutándose:
   ```bash
   pm2 start npm --name "lutorlandia-web" -- start
   pm2 save
   ```

### 4. Configuración del Servidor Web (Nginx)

Aquí hay una configuración básica de Nginx para servir la aplicación:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Certificado SSL (Opcional pero recomendado)

Instala Certbot y configura SSL:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

## Resolución de Problemas

### Problemas de Conexión a la Base de Datos

Si tienes problemas para conectar a la base de datos:
- Verifica que el servidor MySQL esté ejecutándose
- Comprueba las credenciales en el archivo `.env`
- Asegúrate de que el usuario tenga los permisos correctos

### Problemas con el Puerto

Si el puerto 3000 ya está en uso, puedes cambiarlo en el archivo `.env`

## Mantenimiento

Para reiniciar la aplicación después de actualizaciones:
```bash
# Si usas PM2:
pm2 restart lutorlandia-web

# Si no usas PM2:
npm restart
```

Para verificar los logs:
```bash
# Si usas PM2:
pm2 logs lutorlandia-web

# Si no usas PM2:
tail -f logs/server.log
```