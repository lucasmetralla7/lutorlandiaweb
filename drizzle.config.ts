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