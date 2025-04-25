#!/bin/bash
# Script para corregir los problemas de despliegue del proyecto Lutorlandia

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando la corrección del proyecto Lutorlandia...${NC}"

# 1. Crear copias de seguridad
echo -e "${BLUE}Creando copias de seguridad...${NC}"
mkdir -p backups
cp package.json backups/package.json
cp server/index.ts backups/index.ts
cp server/routes.ts backups/routes.ts
cp server/vite.ts backups/vite.ts
cp server/storage.ts backups/storage.ts
cp shared/schema.ts backups/schema.ts

echo -e "${BLUE}Copias de seguridad creadas en el directorio 'backups'${NC}"

# 2. Corregir package.json (eliminar conflictos de merge)
echo -e "${BLUE}Corrigiendo package.json...${NC}"

# 3. Corregir server/index.ts (actualizar puerto y eliminar conflictos)
echo -e "${BLUE}Corrigiendo server/index.ts...${NC}"
cat > server/index.ts << 'EOL'
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalJson = res.json;
  res.json = function (body: any) {
    capturedJsonResponse = body;
    return originalJson.call(this, body);
  };

  res.once("finish", () => {
    const duration = Date.now() - start;
    const size = capturedJsonResponse
      ? JSON.stringify(capturedJsonResponse).length
      : 0;
    log(
      `${req.method} ${path} ${res.statusCode} - ${duration}ms ${size} bytes`,
      "express"
    );
  });

  next();
});

async function bootstrap() {
  log("Configurando conexión a la base de datos...");

  try {
    // Registrar todas las rutas
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Configurar Vite o servir estáticos
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

    const port = process.env.PORT || "5000";
    server.listen({
      port: parseInt(port, 10),
      host: "0.0.0.0",
    });
    log(`Server running at http://localhost:${port}`);
  } catch (err) {
    log(`Error starting server: ${err}`);
    process.exit(1);
  }
}

bootstrap().catch((e) => {
  console.error("Unhandled error during bootstrap", e);
  process.exit(1);
});
EOL

# 4. Corregir shared/schema.ts (eliminar conflictos)
echo -e "${BLUE}Corrigiendo shared/schema.ts...${NC}"
cat > shared/schema.ts << 'EOL'
import { mysqlTable, varchar, int, text, json, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Definición de roles del staff
export const StaffRoles = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  SRMOD: "SRMOD", 
  MOD: "MOD",
  BUILDER: "BUILDER",
} as const;

export const staffRoleSchema = z.enum([
  StaffRoles.OWNER,
  StaffRoles.ADMIN,
  StaffRoles.SRMOD,
  StaffRoles.MOD,
  StaffRoles.BUILDER,
]);

export type StaffRole = z.infer<typeof staffRoleSchema>;

// Staff members table
export const staffMembers = mysqlTable("staff_members", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(), // Título del rol (ej: "Administrador")
  roleLabel: varchar("role_label", { length: 255 }).notNull(), // Tipo de rol (OWNER, ADMIN, SRMOD, MOD, BUILDER)
  description: text("description").notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(), // URL de la cabeza de Minecraft
  createdAt: varchar("created_at", { length: 255 }).notNull().default(new Date().toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default(new Date().toISOString()),
});

export const insertStaffMemberSchema = createInsertSchema(staffMembers)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    roleLabel: staffRoleSchema,
  });

// Announcements table
export const announcements = mysqlTable("announcements", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // Contenido enriquecido (HTML)
  date: varchar("date", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(), // EVENTO, ACTUALIZACIÓN, TIENDA
  image: varchar("image", { length: 255 }).notNull(),
  time: varchar("time", { length: 255 }),
  link: varchar("link", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull().default(new Date().toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default(new Date().toISOString()),
});

export const insertAnnouncementSchema = createInsertSchema(announcements)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// Server status table for tracking status history
export const serverStatus = mysqlTable("server_status", {
  id: int("id").primaryKey().autoincrement(),
  timestamp: varchar("timestamp", { length: 255 }).notNull(),
  online: varchar("online", { length: 255 }).notNull(),
  players: json("players").notNull(), // { online: number, max: number }
  version: varchar("version", { length: 255 }).notNull(),
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
});

// Categorías de reglas
export const ruleCategories = mysqlTable("rule_categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  order: int("order").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull().default(new Date().toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default(new Date().toISOString()),
});

export const insertRuleCategorySchema = createInsertSchema(ruleCategories)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    order: true,
  });

// Reglas
export const rules = mysqlTable("rules", {
  id: int("id").primaryKey().autoincrement(),
  categoryId: int("category_id").notNull(), // Referencia a la categoría
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  order: int("order").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull().default(new Date().toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default(new Date().toISOString()),
});

export const insertRuleSchema = createInsertSchema(rules)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    order: true,
  });

// Constantes para los tipos de anuncios
export const ANNOUNCEMENT_TYPES = {
  EVENT: "EVENTO",
  UPDATE: "ACTUALIZACIÓN",
  STORE: "TIENDA",
} as const;

// Bug priority levels
export const BugPriorities = {
  HIGH: "ALTA",
  MEDIUM: "MEDIA",
  LOW: "BAJA",
} as const;

export const bugPrioritySchema = z.enum([
  BugPriorities.HIGH,
  BugPriorities.MEDIUM,
  BugPriorities.LOW,
]);

export type BugPriority = z.infer<typeof bugPrioritySchema>;

// Bug report status
export const BugStatus = {
  PENDING: "PENDIENTE",
  VALIDATED: "VALIDADO",
  REJECTED: "RECHAZADO",
  RESOLVED: "RESUELTO",
} as const;

export const bugStatusSchema = z.enum([
  BugStatus.PENDING,
  BugStatus.VALIDATED,
  BugStatus.REJECTED,
  BugStatus.RESOLVED,
]);

export type BugStatusType = z.infer<typeof bugStatusSchema>;

// Game modes for bug reports
export const GameModes = {
  SURVIVAL: "SURVIVAL",
  SKYBLOCK: "SKYBLOCK",
  PIXELMON: "PIXELMON",
  FACTIONS: "FACTIONS",
  OTHER: "OTRO",
} as const;

export const gameModeSchema = z.enum([
  GameModes.SURVIVAL,
  GameModes.SKYBLOCK,
  GameModes.PIXELMON,
  GameModes.FACTIONS,
  GameModes.OTHER,
]);

export type GameMode = z.infer<typeof gameModeSchema>;

// Bugs table
export const bugReports = mysqlTable("bug_reports", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 255 }).notNull(),
  gameMode: varchar("game_mode", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  priority: varchar("priority", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default(BugStatus.PENDING),
  createdAt: varchar("created_at", { length: 255 }).notNull().default(new Date().toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default(new Date().toISOString()),
  validatedAt: varchar("validated_at", { length: 255 }),
  resolvedAt: varchar("resolved_at", { length: 255 }),
});

export const insertBugReportSchema = createInsertSchema(bugReports)
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    validatedAt: true,
    resolvedAt: true,
  })
  .extend({
    gameMode: gameModeSchema,
    priority: bugPrioritySchema,
  });

// Users table for authentication
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Type definitions
export type InsertStaffMember = z.infer<typeof insertStaffMemberSchema>;
export type StaffMember = typeof staffMembers.$inferSelect;

export type InsertRuleCategory = z.infer<typeof insertRuleCategorySchema>;
export type RuleCategory = typeof ruleCategories.$inferSelect;

export type InsertRule = z.infer<typeof insertRuleSchema>;
export type Rule = typeof rules.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;
export type ServerStatus = typeof serverStatus.$inferSelect;

export type InsertBugReport = z.infer<typeof insertBugReportSchema>;
export type BugReport = typeof bugReports.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
EOL

# 5. Corregir componente TournamentManager.tsx para permitir desplazamiento
echo -e "${BLUE}Corrigiendo el componente TournamentManager.tsx...${NC}"

# Buscar el archivo TournamentManager.tsx
TOURNAMENT_PATH=$(find client -name "TournamentManager.tsx" | grep -v "node_modules")

if [ -n "$TOURNAMENT_PATH" ]; then
  echo -e "${GREEN}Archivo TournamentManager.tsx encontrado en: $TOURNAMENT_PATH${NC}"
  
  # Hacer copia de seguridad
  cp "$TOURNAMENT_PATH" "backups/$(basename "$TOURNAMENT_PATH")"
  
  # Corregir DialogContent para permitir desplazamiento
  sed -i 's/<DialogContent className="max-w-md">/<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">/g' "$TOURNAMENT_PATH"
  sed -i 's/<DialogContent className="max-w-2xl">/<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">/g' "$TOURNAMENT_PATH"
  
  # Corregir validación de campos en el esquema
  sed -i '/const tournamentFormSchema = z.object({/,/});/ s/z.nativeEnum(GameModes, {.*}/z.string().min(1, { message: "La modalidad de juego es obligatoria" })/g' "$TOURNAMENT_PATH"
  sed -i '/const tournamentFormSchema = z.object({/,/});/ s/z.nativeEnum(TournamentStatus, {.*}/z.string().min(1, { message: "El estado es obligatorio" })/g' "$TOURNAMENT_PATH"
  
  # Corregir formato de llamadas API
  sed -i '/mutationFn: async (id: number) => {/,/await apiRequest("DELETE"/ s/await apiRequest("DELETE", `\/api\/podium\/${id}`);/await apiRequest(`\/api\/podium\/${id}`, { method: "DELETE" });/g' "$TOURNAMENT_PATH"
  sed -i '/apiRequest("PATCH"/,/apiRequest("POST"/ s/apiRequest("PATCH", `\/api\/form-fields\/${selectedFormField.id}`, fieldData);/apiRequest(`\/api\/form-fields\/${selectedFormField.id}`, {\n          method: "PATCH",\n          data: fieldData\n        });/g' "$TOURNAMENT_PATH"
  sed -i '/apiRequest("POST", "\/api\/form-fields"/,/json()/ s/apiRequest("POST", "\/api\/form-fields", fieldData);/apiRequest("\/api\/form-fields", {\n          method: "POST",\n          data: fieldData\n        });/g' "$TOURNAMENT_PATH"
  sed -i '/await apiRequest("DELETE", `\/api\/form-fields/,/});/ s/await apiRequest("DELETE", `\/api\/form-fields\/${id}`);/await apiRequest(`\/api\/form-fields\/${id}`, { method: "DELETE" });/g' "$TOURNAMENT_PATH"
  sed -i '/await apiRequest("POST", `\/api\/registrations\/${id}\/approve`);/ s/await apiRequest("POST", `\/api\/registrations\/${id}\/approve`);/await apiRequest(`\/api\/registrations\/${id}\/approve`, { method: "POST" });/g' "$TOURNAMENT_PATH"
  sed -i '/await apiRequest("DELETE", `\/api\/registrations\/${id}`);/ s/await apiRequest("DELETE", `\/api\/registrations\/${id}`);/await apiRequest(`\/api\/registrations\/${id}`, { method: "DELETE" });/g' "$TOURNAMENT_PATH"
  
  echo -e "${GREEN}Componente TournamentManager.tsx corregido correctamente${NC}"
else
  echo -e "${RED}No se pudo encontrar el archivo TournamentManager.tsx${NC}"
fi

# 7. Reiniciar el servidor o processos necesarios
echo -e "${BLUE}Completando proceso de corrección...${NC}"
echo -e "${GREEN}¡Proceso de corrección completado!${NC}"
echo -e "${BLUE}Para aplicar estos cambios en tu entorno de producción:${NC}"
echo "1. Sube este script a tu servidor"
echo "2. Ejecuta: chmod +x lutorlandia-deployment-fix.sh"
echo "3. Ejecuta: ./lutorlandia-deployment-fix.sh"
echo "4. Reinicia los servicios necesarios (nginx, apache, etc.)"
echo "5. Verifica que todo funcione correctamente"