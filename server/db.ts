import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

console.log("Configurando conexión a la base de datos...");

// Configuración para la conexión a la base de datos MySQL a partir de variables de entorno
const DB_CONFIG = {
  host: process.env.DB_HOST || '172.17.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 's1_web',
  user: process.env.DB_USER || 'u1_JUNKQitG3T',
  password: process.env.DB_PASSWORD || 'dUvT=vVADtppgU=UAZ!vaYSu',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '20000')
};

// Definimos la conexión a usar
let dbClient: any;

try {
  // Conexión a la base de datos MySQL con la configuración
  const poolConnection = mysql.createPool(DB_CONFIG);

  // Configuración del cliente Drizzle
  dbClient = drizzle(poolConnection, { 
    schema,
    mode: 'default'
  });

  // Verificamos la conexión a la base de datos
  poolConnection.getConnection()
    .then(conn => {
      console.log("✓ Conexión a la base de datos MySQL establecida correctamente");
      console.log(`  → Host: ${DB_CONFIG.host}`);
      console.log(`  → Base de datos: ${DB_CONFIG.database}`);
      conn.release();
    })
    .catch(err => {
      console.error("Error al conectar a la base de datos:", err);
      console.error("Usando almacenamiento en memoria como fallback");
      // No propagamos el error, simplemente establecemos dbClient a null para usar memoria
      dbClient = null;
    });
} catch (error) {
  console.error("Error al configurar la base de datos:", error);
  console.log("Usando almacenamiento en memoria como fallback");
}

// Exportamos el cliente Drizzle
export const db = dbClient;