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

<<<<<<< HEAD
=======
// Users table for authentication
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
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
<<<<<<< HEAD
=======

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
