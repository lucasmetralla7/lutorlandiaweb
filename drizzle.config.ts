import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
// Carga las variables de entorno
dotenv.config();
export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: '172.17.0.1',
    port: 3306,
    database: 's1_web',
    user: 'u1_JUNKQitG3T',
    password: 'dUvT=vVADtppgU=UAZ!vaYSu',
  },
} satisfies Config;
EOL
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
