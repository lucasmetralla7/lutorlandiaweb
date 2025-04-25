var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq } from "drizzle-orm";

// server/db.ts
import { drizzle } from "drizzle-orm/mysql2";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  ANNOUNCEMENT_TYPES: () => ANNOUNCEMENT_TYPES,
  BugPriorities: () => BugPriorities,
  BugStatus: () => BugStatus,
  GameModes: () => GameModes,
  StaffRoles: () => StaffRoles,
  TournamentRegistrationStatus: () => TournamentRegistrationStatus,
  TournamentStatus: () => TournamentStatus,
  announcements: () => announcements,
  bugPrioritySchema: () => bugPrioritySchema,
  bugReports: () => bugReports,
  bugStatusSchema: () => bugStatusSchema,
  formFields: () => formFields,
  gameModeSchema: () => gameModeSchema,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertBugReportSchema: () => insertBugReportSchema,
  insertFormFieldSchema: () => insertFormFieldSchema,
  insertRuleCategorySchema: () => insertRuleCategorySchema,
  insertRuleSchema: () => insertRuleSchema,
  insertServerStatusSchema: () => insertServerStatusSchema,
  insertStaffMemberSchema: () => insertStaffMemberSchema,
  insertTournamentPodiumSchema: () => insertTournamentPodiumSchema,
  insertTournamentRegistrationSchema: () => insertTournamentRegistrationSchema,
  insertTournamentSchema: () => insertTournamentSchema,
  insertUserSchema: () => insertUserSchema,
  ruleCategories: () => ruleCategories,
  rules: () => rules,
  serverStatus: () => serverStatus,
  staffMembers: () => staffMembers,
  staffRoleSchema: () => staffRoleSchema,
  tournamentPodiums: () => tournamentPodiums,
  tournamentRegistrationStatusSchema: () => tournamentRegistrationStatusSchema,
  tournamentRegistrations: () => tournamentRegistrations,
  tournamentStatusSchema: () => tournamentStatusSchema,
  tournaments: () => tournaments,
  users: () => users
});
import { mysqlTable, varchar, int, text, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var StaffRoles = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  SRMOD: "SRMOD",
  MOD: "MOD",
  BUILDER: "BUILDER"
};
var staffRoleSchema = z.enum([
  StaffRoles.OWNER,
  StaffRoles.ADMIN,
  StaffRoles.SRMOD,
  StaffRoles.MOD,
  StaffRoles.BUILDER
]);
var staffMembers = mysqlTable("staff_members", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  // Título del rol (ej: "Administrador")
  roleLabel: varchar("role_label", { length: 255 }).notNull(),
  // Tipo de rol (OWNER, ADMIN, SRMOD, MOD, BUILDER)
  description: text("description").notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
  // URL de la cabeza de Minecraft
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertStaffMemberSchema = createInsertSchema(staffMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  roleLabel: staffRoleSchema
});
var announcements = mysqlTable("announcements", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  // Contenido enriquecido (HTML)
  date: varchar("date", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  // EVENTO, ACTUALIZACIÓN, TIENDA
  image: varchar("image", { length: 255 }).notNull(),
  time: varchar("time", { length: 255 }),
  link: varchar("link", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var serverStatus = mysqlTable("server_status", {
  id: int("id").primaryKey().autoincrement(),
  timestamp: varchar("timestamp", { length: 255 }).notNull(),
  online: varchar("online", { length: 255 }).notNull(),
  players: json("players").notNull(),
  // { online: number, max: number }
  version: varchar("version", { length: 255 }).notNull()
});
var insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true
});
var ruleCategories = mysqlTable("rule_categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  order: int("order").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertRuleCategorySchema = createInsertSchema(ruleCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true
});
var rules = mysqlTable("rules", {
  id: int("id").primaryKey().autoincrement(),
  categoryId: int("category_id").notNull(),
  // Referencia a la categoría
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  order: int("order").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertRuleSchema = createInsertSchema(rules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true
});
var ANNOUNCEMENT_TYPES = {
  EVENT: "EVENTO",
  UPDATE: "ACTUALIZACI\xD3N",
  STORE: "TIENDA"
};
var BugPriorities = {
  HIGH: "ALTA",
  MEDIUM: "MEDIA",
  LOW: "BAJA"
};
var bugPrioritySchema = z.enum([
  BugPriorities.HIGH,
  BugPriorities.MEDIUM,
  BugPriorities.LOW
]);
var BugStatus = {
  PENDING: "PENDIENTE",
  VALIDATED: "VALIDADO",
  REJECTED: "RECHAZADO",
  RESOLVED: "RESUELTO"
};
var bugStatusSchema = z.enum([
  BugStatus.PENDING,
  BugStatus.VALIDATED,
  BugStatus.REJECTED,
  BugStatus.RESOLVED
]);
var GameModes = {
  SURVIVAL: "SURVIVAL",
  SKYBLOCK: "SKYBLOCK",
  PIXELMON: "PIXELMON",
  FACTIONS: "FACTIONS",
  OTHER: "OTRO"
};
var gameModeSchema = z.enum([
  GameModes.SURVIVAL,
  GameModes.SKYBLOCK,
  GameModes.PIXELMON,
  GameModes.FACTIONS,
  GameModes.OTHER
]);
var bugReports = mysqlTable("bug_reports", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 255 }).notNull(),
  gameMode: varchar("game_mode", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  priority: varchar("priority", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default(BugStatus.PENDING),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  validatedAt: varchar("validated_at", { length: 255 }),
  resolvedAt: varchar("resolved_at", { length: 255 })
});
var insertBugReportSchema = createInsertSchema(bugReports).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  validatedAt: true,
  resolvedAt: true
}).extend({
  gameMode: gameModeSchema,
  priority: bugPrioritySchema
});
var users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var TournamentStatus = {
  UPCOMING: "PR\xD3XIMO",
  ACTIVE: "ACTIVO",
  COMPLETED: "COMPLETADO"
};
var tournamentStatusSchema = z.enum([
  TournamentStatus.UPCOMING,
  TournamentStatus.ACTIVE,
  TournamentStatus.COMPLETED
]);
var tournaments = mysqlTable("tournaments", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: varchar("date", { length: 255 }).notNull(),
  time: varchar("time", { length: 255 }).notNull(),
  gameMode: varchar("game_mode", { length: 255 }).notNull(),
  maxParticipants: int("max_participants").notNull(),
  prizes: text("prizes").notNull(),
  bannerImage: varchar("banner_image", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default(TournamentStatus.UPCOMING),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  gameMode: gameModeSchema,
  status: tournamentStatusSchema
});
var tournamentPodiums = mysqlTable("tournament_podiums", {
  id: int("id").primaryKey().autoincrement(),
  tournamentId: int("tournament_id").notNull(),
  playerUsername: varchar("player_username", { length: 255 }).notNull(),
  position: int("position").notNull(),
  prize: varchar("prize", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertTournamentPodiumSchema = createInsertSchema(tournamentPodiums).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var formFields = mysqlTable("form_fields", {
  id: int("id").primaryKey().autoincrement(),
  tournamentId: int("tournament_id").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  fieldType: varchar("field_type", { length: 50 }).notNull(),
  required: int("required").notNull().default(1),
  options: text("options"),
  order: int("order").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertFormFieldSchema = createInsertSchema(formFields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true
});
var TournamentRegistrationStatus = {
  PENDING: "PENDIENTE",
  APPROVED: "APROBADO",
  REJECTED: "RECHAZADO"
};
var tournamentRegistrationStatusSchema = z.enum([
  TournamentRegistrationStatus.PENDING,
  TournamentRegistrationStatus.APPROVED,
  TournamentRegistrationStatus.REJECTED
]);
var tournamentRegistrations = mysqlTable("tournament_registrations", {
  id: int("id").primaryKey().autoincrement(),
  tournamentId: int("tournament_id").notNull(),
  playerUsername: varchar("player_username", { length: 255 }).notNull(),
  formData: json("form_data").notNull(),
  status: varchar("status", { length: 50 }).notNull().default(TournamentRegistrationStatus.PENDING),
  createdAt: varchar("created_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: varchar("updated_at", { length: 255 }).notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { createPool } from "mysql2/promise";
import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
function createMySqlClient() {
  try {
    const pool2 = createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "lutorlandia",
      port: parseInt(process.env.DB_PORT || "3306"),
      connectionLimit: 10
    });
    return drizzle(pool2, { schema: schema_exports, mode: "default" });
  } catch (error) {
    console.error("Error al crear el cliente MySQL:", error);
    throw error;
  }
}
function createNeonClient() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("\u26A0\uFE0F No DATABASE_URL found, using dummy connection");
    }
    const neonPool = new NeonPool({
      connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/dummy"
    });
    return { pool: neonPool, db: drizzle(neonPool, { schema: schema_exports }) };
  } catch (error) {
    console.error("Error al crear el cliente Neon:", error);
    throw error;
  }
}
var dbClient;
var pgPool;
if (process.env.DATABASE_URL) {
  const neonClient = createNeonClient();
  pgPool = neonClient.pool;
  dbClient = neonClient.db;
} else {
  dbClient = createMySqlClient();
}
var pool = pgPool;
var db = dbClient;

// server/storage.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
var PostgresSessionStore = connectPg(session);
var MemoryStore = createMemoryStore(session);
var DatabaseStorage = class {
  db;
  sessionStore;
  constructor(db2) {
    this.db = db2;
    try {
      this.sessionStore = new PostgresSessionStore({
        pool,
        createTableIfMissing: true
      });
    } catch (error) {
      console.log("Error al crear PostgresSessionStore, usando MemoryStore", error);
      this.sessionStore = new MemoryStore({
        checkPeriod: 864e5
      });
    }
  }
  async getUser(id) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }
  // Staff members
  async getAllStaffMembers() {
    return await this.db.select().from(staffMembers).orderBy(staffMembers.id);
  }
  async getStaffMemberById(id) {
    const [member] = await this.db.select().from(staffMembers).where(eq(staffMembers.id, id));
    return member;
  }
  async createStaffMember(member) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newMember] = await this.db.insert(staffMembers).values({
      ...member,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newMember;
  }
  async updateStaffMember(id, member) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedMember] = await this.db.update(staffMembers).set({
      ...member,
      updatedAt: now
    }).where(eq(staffMembers.id, id)).returning();
    return updatedMember;
  }
  async deleteStaffMember(id) {
    const [deleted] = await this.db.delete(staffMembers).where(eq(staffMembers.id, id)).returning();
    return !!deleted;
  }
  // Rule categories
  async getAllRuleCategories() {
    return await this.db.select().from(ruleCategories).orderBy(ruleCategories.order);
  }
  async getRuleCategoryById(id) {
    const [category] = await this.db.select().from(ruleCategories).where(eq(ruleCategories.id, id));
    return category;
  }
  async createRuleCategory(category) {
    const allCategories = await this.getAllRuleCategories();
    const maxOrder = allCategories.length > 0 ? Math.max(...allCategories.map((c) => c.order)) : 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newCategory] = await this.db.insert(ruleCategories).values({
      ...category,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newCategory;
  }
  async updateRuleCategory(id, category) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedCategory] = await this.db.update(ruleCategories).set({
      ...category,
      updatedAt: now
    }).where(eq(ruleCategories.id, id)).returning();
    return updatedCategory;
  }
  async deleteRuleCategory(id) {
    await this.db.delete(rules).where(eq(rules.categoryId, id));
    const [deleted] = await this.db.delete(ruleCategories).where(eq(ruleCategories.id, id)).returning();
    return !!deleted;
  }
  // Rules
  async getRulesByCategoryId(categoryId) {
    return await this.db.select().from(rules).where(eq(rules.categoryId, categoryId)).orderBy(rules.order);
  }
  async getRuleById(id) {
    const [rule] = await this.db.select().from(rules).where(eq(rules.id, id));
    return rule;
  }
  async createRule(rule) {
    const categoryRules = await this.getRulesByCategoryId(rule.categoryId);
    const maxOrder = categoryRules.length > 0 ? Math.max(...categoryRules.map((r) => r.order)) : 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newRule] = await this.db.insert(rules).values({
      ...rule,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newRule;
  }
  async updateRule(id, rule) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedRule] = await this.db.update(rules).set({
      ...rule,
      updatedAt: now
    }).where(eq(rules.id, id)).returning();
    return updatedRule;
  }
  async deleteRule(id) {
    const [deleted] = await this.db.delete(rules).where(eq(rules.id, id)).returning();
    return !!deleted;
  }
  // Announcements
  async getAllAnnouncements() {
    return await this.db.select().from(announcements).orderBy(announcements.id);
  }
  async getAnnouncementById(id) {
    const [announcement] = await this.db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }
  async createAnnouncement(announcement) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newAnnouncement] = await this.db.insert(announcements).values({
      ...announcement,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newAnnouncement;
  }
  async updateAnnouncement(id, announcement) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedAnnouncement] = await this.db.update(announcements).set({
      ...announcement,
      updatedAt: now
    }).where(eq(announcements.id, id)).returning();
    return updatedAnnouncement;
  }
  async deleteAnnouncement(id) {
    const [deleted] = await this.db.delete(announcements).where(eq(announcements.id, id)).returning();
    return !!deleted;
  }
  // Bug Reports
  async getAllBugReports() {
    return await this.db.select().from(bugReports).orderBy(bugReports.id);
  }
  async getBugReportById(id) {
    const [report] = await this.db.select().from(bugReports).where(eq(bugReports.id, id));
    return report;
  }
  async createBugReport(report) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newReport] = await this.db.insert(bugReports).values({
      ...report,
      status: BugStatus.PENDING,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newReport;
  }
  async updateBugReport(id, report) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedReport] = await this.db.update(bugReports).set({
      ...report,
      updatedAt: now
    }).where(eq(bugReports.id, id)).returning();
    return updatedReport;
  }
  async deleteBugReport(id) {
    const [deleted] = await this.db.delete(bugReports).where(eq(bugReports.id, id)).returning();
    return !!deleted;
  }
  async getPendingBugReports() {
    return await this.db.select().from(bugReports).where(eq(bugReports.status, BugStatus.PENDING)).orderBy(bugReports.id);
  }
  async getValidatedBugReports() {
    return await this.db.select().from(bugReports).where(eq(bugReports.status, BugStatus.VALIDATED)).orderBy(bugReports.id);
  }
  async validateBugReport(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedReport] = await this.db.update(bugReports).set({
      status: BugStatus.VALIDATED,
      validatedAt: now,
      updatedAt: now
    }).where(eq(bugReports.id, id)).returning();
    return updatedReport;
  }
  async rejectBugReport(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [deleted] = await this.db.update(bugReports).set({
      status: BugStatus.REJECTED,
      updatedAt: now
    }).where(eq(bugReports.id, id)).returning();
    return !!deleted;
  }
  async resolveBugReport(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedReport] = await this.db.update(bugReports).set({
      status: BugStatus.RESOLVED,
      resolvedAt: now,
      updatedAt: now
    }).where(eq(bugReports.id, id)).returning();
    return updatedReport;
  }
  // Tournament methods
  async getAllTournaments() {
    return await this.db.select().from(tournaments).orderBy(tournaments.id);
  }
  async getTournamentById(id) {
    const [tournament] = await this.db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }
  async createTournament(tournament) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newTournament] = await this.db.insert(tournaments).values({
      ...tournament,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newTournament;
  }
  async updateTournament(id, tournament) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedTournament] = await this.db.update(tournaments).set({
      ...tournament,
      updatedAt: now
    }).where(eq(tournaments.id, id)).returning();
    return updatedTournament;
  }
  async deleteTournament(id) {
    await this.db.delete(tournamentPodiums).where(eq(tournamentPodiums.tournamentId, id));
    await this.db.delete(formFields).where(eq(formFields.tournamentId, id));
    await this.db.delete(tournamentRegistrations).where(eq(tournamentRegistrations.tournamentId, id));
    const [deleted] = await this.db.delete(tournaments).where(eq(tournaments.id, id)).returning();
    return !!deleted;
  }
  // Tournament podium methods
  async getPodiumsByTournamentId(tournamentId) {
    return await this.db.select().from(tournamentPodiums).where(eq(tournamentPodiums.tournamentId, tournamentId)).orderBy(tournamentPodiums.position);
  }
  async getPodiumById(id) {
    const [podium] = await this.db.select().from(tournamentPodiums).where(eq(tournamentPodiums.id, id));
    return podium;
  }
  async createPodium(podium) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newPodium] = await this.db.insert(tournamentPodiums).values({
      ...podium,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newPodium;
  }
  async updatePodium(id, podium) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedPodium] = await this.db.update(tournamentPodiums).set({
      ...podium,
      updatedAt: now
    }).where(eq(tournamentPodiums.id, id)).returning();
    return updatedPodium;
  }
  async deletePodium(id) {
    const [deleted] = await this.db.delete(tournamentPodiums).where(eq(tournamentPodiums.id, id)).returning();
    return !!deleted;
  }
  // Form field methods
  async getFormFieldsByTournamentId(tournamentId) {
    return await this.db.select().from(formFields).where(eq(formFields.tournamentId, tournamentId)).orderBy(formFields.order);
  }
  async getFormFieldById(id) {
    const [field] = await this.db.select().from(formFields).where(eq(formFields.id, id));
    return field;
  }
  async createFormField(field) {
    const tournamentFields = await this.getFormFieldsByTournamentId(field.tournamentId);
    const maxOrder = tournamentFields.length > 0 ? Math.max(...tournamentFields.map((f) => f.order)) : 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newField] = await this.db.insert(formFields).values({
      ...field,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newField;
  }
  async updateFormField(id, field) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedField] = await this.db.update(formFields).set({
      ...field,
      updatedAt: now
    }).where(eq(formFields.id, id)).returning();
    return updatedField;
  }
  async deleteFormField(id) {
    const [deleted] = await this.db.delete(formFields).where(eq(formFields.id, id)).returning();
    return !!deleted;
  }
  // Tournament registration methods
  async getRegistrationsByTournamentId(tournamentId) {
    return await this.db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.tournamentId, tournamentId)).orderBy(tournamentRegistrations.id);
  }
  async getRegistrationById(id) {
    const [registration] = await this.db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.id, id));
    return registration;
  }
  async createRegistration(registration) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [newRegistration] = await this.db.insert(tournamentRegistrations).values({
      ...registration,
      status: TournamentRegistrationStatus.PENDING,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newRegistration;
  }
  async approveRegistration(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedRegistration] = await this.db.update(tournamentRegistrations).set({
      status: TournamentRegistrationStatus.APPROVED,
      updatedAt: now
    }).where(eq(tournamentRegistrations.id, id)).returning();
    return updatedRegistration;
  }
  async rejectRegistration(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const [updatedRegistration] = await this.db.update(tournamentRegistrations).set({
      status: TournamentRegistrationStatus.REJECTED,
      updatedAt: now
    }).where(eq(tournamentRegistrations.id, id)).returning();
    return updatedRegistration;
  }
  async deleteRegistration(id) {
    const [deleted] = await this.db.delete(tournamentRegistrations).where(eq(tournamentRegistrations.id, id)).returning();
    return !!deleted;
  }
};
var MemoryStorage = class {
  staffMembers = [];
  ruleCategories = [];
  rules = [];
  announcements = [];
  bugReports = [];
  users = [
    {
      id: 1,
      username: "lutorlandia",
      password: "$2a$10$xn3LI/AjqicFYZFruSwve.j1pk4K6ToLymHhtkftg5q.yvonC3e3W"
      // Olaoladelta123!
    }
  ];
  tournaments = [];
  tournamentPodiums = [];
  formFields = [];
  tournamentRegistrations = [];
  sessionStore;
  nextIds = {
    staffMembers: 1,
    ruleCategories: 1,
    rules: 1,
    announcements: 1,
    bugReports: 1,
    users: 2,
    // Ya tenemos un usuario con id 1
    tournaments: 1,
    tournamentPodiums: 1,
    formFields: 1,
    tournamentRegistrations: 1
  };
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
  }
  async getUser(id) {
    return this.users.find((user) => user.id === id);
  }
  async getUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = this.nextIds.users++;
    const newUser = {
      id,
      ...insertUser
    };
    this.users.push(newUser);
    return newUser;
  }
  async getAllStaffMembers() {
    return [...this.staffMembers];
  }
  async getStaffMemberById(id) {
    return this.staffMembers.find((member) => member.id === id);
  }
  async createStaffMember(member) {
    const id = this.nextIds.staffMembers++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newMember = {
      id,
      ...member,
      createdAt: now,
      updatedAt: now
    };
    this.staffMembers.push(newMember);
    return newMember;
  }
  async updateStaffMember(id, member) {
    const index = this.staffMembers.findIndex((m) => m.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.staffMembers[index] = {
      ...this.staffMembers[index],
      ...member,
      updatedAt: now
    };
    return this.staffMembers[index];
  }
  async deleteStaffMember(id) {
    const initialLength = this.staffMembers.length;
    this.staffMembers = this.staffMembers.filter((member) => member.id !== id);
    return initialLength !== this.staffMembers.length;
  }
  async getAllRuleCategories() {
    return [...this.ruleCategories].sort((a, b) => a.order - b.order);
  }
  async getRuleCategoryById(id) {
    return this.ruleCategories.find((category) => category.id === id);
  }
  async createRuleCategory(category) {
    const id = this.nextIds.ruleCategories++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const maxOrder = this.ruleCategories.length > 0 ? Math.max(...this.ruleCategories.map((c) => c.order)) : 0;
    const newCategory = {
      id,
      ...category,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };
    this.ruleCategories.push(newCategory);
    return newCategory;
  }
  async updateRuleCategory(id, category) {
    const index = this.ruleCategories.findIndex((c) => c.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.ruleCategories[index] = {
      ...this.ruleCategories[index],
      ...category,
      updatedAt: now
    };
    return this.ruleCategories[index];
  }
  async deleteRuleCategory(id) {
    this.rules = this.rules.filter((rule) => rule.categoryId !== id);
    const initialLength = this.ruleCategories.length;
    this.ruleCategories = this.ruleCategories.filter((category) => category.id !== id);
    return initialLength !== this.ruleCategories.length;
  }
  async getRulesByCategoryId(categoryId) {
    return this.rules.filter((rule) => rule.categoryId === categoryId).sort((a, b) => a.order - b.order);
  }
  async getRuleById(id) {
    return this.rules.find((rule) => rule.id === id);
  }
  async createRule(rule) {
    const id = this.nextIds.rules++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const categoryRules = this.rules.filter((r) => r.categoryId === rule.categoryId);
    const maxOrder = categoryRules.length > 0 ? Math.max(...categoryRules.map((r) => r.order)) : 0;
    const newRule = {
      id,
      ...rule,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };
    this.rules.push(newRule);
    return newRule;
  }
  async updateRule(id, rule) {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.rules[index] = {
      ...this.rules[index],
      ...rule,
      updatedAt: now
    };
    return this.rules[index];
  }
  async deleteRule(id) {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter((rule) => rule.id !== id);
    return initialLength !== this.rules.length;
  }
  async getAllAnnouncements() {
    return [...this.announcements];
  }
  async getAnnouncementById(id) {
    return this.announcements.find((announcement) => announcement.id === id);
  }
  async createAnnouncement(announcement) {
    const id = this.nextIds.announcements++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newAnnouncement = {
      id,
      ...announcement,
      createdAt: now,
      updatedAt: now
    };
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }
  async updateAnnouncement(id, announcement) {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.announcements[index] = {
      ...this.announcements[index],
      ...announcement,
      updatedAt: now
    };
    return this.announcements[index];
  }
  async deleteAnnouncement(id) {
    const initialLength = this.announcements.length;
    this.announcements = this.announcements.filter((announcement) => announcement.id !== id);
    return initialLength !== this.announcements.length;
  }
  async getAllBugReports() {
    return [...this.bugReports];
  }
  async getBugReportById(id) {
    return this.bugReports.find((report) => report.id === id);
  }
  async createBugReport(report) {
    const id = this.nextIds.bugReports++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newReport = {
      id,
      ...report,
      status: BugStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    this.bugReports.push(newReport);
    return newReport;
  }
  async updateBugReport(id, report) {
    const index = this.bugReports.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      ...report,
      updatedAt: now
    };
    return this.bugReports[index];
  }
  async deleteBugReport(id) {
    const initialLength = this.bugReports.length;
    this.bugReports = this.bugReports.filter((report) => report.id !== id);
    return initialLength !== this.bugReports.length;
  }
  async getPendingBugReports() {
    return this.bugReports.filter((report) => report.status === BugStatus.PENDING);
  }
  async getValidatedBugReports() {
    return this.bugReports.filter((report) => report.status === BugStatus.VALIDATED);
  }
  async validateBugReport(id) {
    const index = this.bugReports.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.VALIDATED,
      validatedAt: now,
      updatedAt: now
    };
    return this.bugReports[index];
  }
  async rejectBugReport(id) {
    const index = this.bugReports.findIndex((r) => r.id === id);
    if (index === -1) return false;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.REJECTED,
      updatedAt: now
    };
    return true;
  }
  async resolveBugReport(id) {
    const index = this.bugReports.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.RESOLVED,
      resolvedAt: now,
      updatedAt: now
    };
    return this.bugReports[index];
  }
  // Tournament methods
  async getAllTournaments() {
    return [...this.tournaments];
  }
  async getTournamentById(id) {
    return this.tournaments.find((tournament) => tournament.id === id);
  }
  async createTournament(tournament) {
    const id = this.nextIds.tournaments++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newTournament = {
      id,
      ...tournament,
      createdAt: now,
      updatedAt: now
    };
    this.tournaments.push(newTournament);
    return newTournament;
  }
  async updateTournament(id, tournament) {
    const index = this.tournaments.findIndex((t) => t.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.tournaments[index] = {
      ...this.tournaments[index],
      ...tournament,
      updatedAt: now
    };
    return this.tournaments[index];
  }
  async deleteTournament(id) {
    this.tournamentPodiums = this.tournamentPodiums.filter((p) => p.tournamentId !== id);
    this.formFields = this.formFields.filter((f) => f.tournamentId !== id);
    this.tournamentRegistrations = this.tournamentRegistrations.filter((r) => r.tournamentId !== id);
    const initialLength = this.tournaments.length;
    this.tournaments = this.tournaments.filter((t) => t.id !== id);
    return initialLength !== this.tournaments.length;
  }
  // Tournament podium methods
  async getPodiumsByTournamentId(tournamentId) {
    return this.tournamentPodiums.filter((podium) => podium.tournamentId === tournamentId).sort((a, b) => a.position - b.position);
  }
  async getPodiumById(id) {
    return this.tournamentPodiums.find((podium) => podium.id === id);
  }
  async createPodium(podium) {
    const id = this.nextIds.tournamentPodiums++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newPodium = {
      id,
      ...podium,
      createdAt: now,
      updatedAt: now
    };
    this.tournamentPodiums.push(newPodium);
    return newPodium;
  }
  async updatePodium(id, podium) {
    const index = this.tournamentPodiums.findIndex((p) => p.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.tournamentPodiums[index] = {
      ...this.tournamentPodiums[index],
      ...podium,
      updatedAt: now
    };
    return this.tournamentPodiums[index];
  }
  async deletePodium(id) {
    const initialLength = this.tournamentPodiums.length;
    this.tournamentPodiums = this.tournamentPodiums.filter((p) => p.id !== id);
    return initialLength !== this.tournamentPodiums.length;
  }
  // Form field methods
  async getFormFieldsByTournamentId(tournamentId) {
    return this.formFields.filter((field) => field.tournamentId === tournamentId).sort((a, b) => a.order - b.order);
  }
  async getFormFieldById(id) {
    return this.formFields.find((field) => field.id === id);
  }
  async createFormField(field) {
    const id = this.nextIds.formFields++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tournamentFields = this.formFields.filter((f) => f.tournamentId === field.tournamentId);
    const maxOrder = tournamentFields.length > 0 ? Math.max(...tournamentFields.map((f) => f.order)) : 0;
    const newField = {
      id,
      ...field,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };
    this.formFields.push(newField);
    return newField;
  }
  async updateFormField(id, field) {
    const index = this.formFields.findIndex((f) => f.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.formFields[index] = {
      ...this.formFields[index],
      ...field,
      updatedAt: now
    };
    return this.formFields[index];
  }
  async deleteFormField(id) {
    const initialLength = this.formFields.length;
    this.formFields = this.formFields.filter((f) => f.id !== id);
    return initialLength !== this.formFields.length;
  }
  // Tournament registration methods
  async getRegistrationsByTournamentId(tournamentId) {
    return this.tournamentRegistrations.filter((reg) => reg.tournamentId === tournamentId);
  }
  async getRegistrationById(id) {
    return this.tournamentRegistrations.find((reg) => reg.id === id);
  }
  async createRegistration(registration) {
    const id = this.nextIds.tournamentRegistrations++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newRegistration = {
      id,
      ...registration,
      status: TournamentRegistrationStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    this.tournamentRegistrations.push(newRegistration);
    return newRegistration;
  }
  async approveRegistration(id) {
    const index = this.tournamentRegistrations.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.tournamentRegistrations[index] = {
      ...this.tournamentRegistrations[index],
      status: TournamentRegistrationStatus.APPROVED,
      updatedAt: now
    };
    return this.tournamentRegistrations[index];
  }
  async rejectRegistration(id) {
    const index = this.tournamentRegistrations.findIndex((r) => r.id === id);
    if (index === -1) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.tournamentRegistrations[index] = {
      ...this.tournamentRegistrations[index],
      status: TournamentRegistrationStatus.REJECTED,
      updatedAt: now
    };
    return this.tournamentRegistrations[index];
  }
  async deleteRegistration(id) {
    const initialLength = this.tournamentRegistrations.length;
    this.tournamentRegistrations = this.tournamentRegistrations.filter((r) => r.id !== id);
    return initialLength !== this.tournamentRegistrations.length;
  }
};
var storageInstance;
function createStorage() {
  if (storageInstance) {
    return storageInstance;
  }
  console.log("Configurando conexi\xF3n a la base de datos...");
  try {
    const dbStorage = new DatabaseStorage(db);
    db.select({ value: 1 }).then(() => {
      console.log("\u2705 Conexi\xF3n a la base de datos establecida correctamente");
    }).catch((err) => {
      console.log(`\u274C Error al verificar la conexi\xF3n a la base de datos: ${err}`);
      console.log("\u{1F536} Usando almacenamiento en memoria como fallback");
      storageInstance = new MemoryStorage();
    });
    storageInstance = dbStorage;
    return dbStorage;
  } catch (err) {
    console.log(`Error al conectar a la base de datos: ${err}`);
    console.log("Usando almacenamiento en memoria como fallback");
    storageInstance = new MemoryStorage();
    return storageInstance;
  }
}
var storage = createStorage();

// server/routes.ts
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z as z2 } from "zod";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
var scryptAsync = promisify(scrypt);
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "No autorizado" });
};
async function registerRoutes(app2) {
  app2.use(
    session2({
      secret: "lutorlandia-secret-key",
      resave: false,
      saveUninitialized: false
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        if (username === "lutorlandia" && password === "Olaoladelta123!") {
          return done(null, { id: 1, username: "lutorlandia" });
        }
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    if (id === 1) {
      done(null, { id: 1, username: "lutorlandia" });
    } else {
      done(new Error("User not found"), null);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "No autorizado" });
    }
  });
  app2.get("/api/staff", async (req, res) => {
    try {
      const staffMembers2 = await storage.getAllStaffMembers();
      res.json(staffMembers2);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({
        error: "Error al obtener los miembros del staff"
      });
    }
  });
  app2.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffMember = await storage.getStaffMemberById(id);
      if (!staffMember) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado"
        });
      }
      res.json(staffMember);
    } catch (error) {
      console.error("Error fetching staff member:", error);
      res.status(500).json({
        error: "Error al obtener el miembro del staff"
      });
    }
  });
  app2.post("/api/staff", isAuthenticated, async (req, res) => {
    try {
      console.log("POST /api/staff - Body recibido:", JSON.stringify(req.body));
      if (!req.body.roleLabel && req.body.role_label) {
        console.log("Convirtiendo role_label a roleLabel...");
        req.body.roleLabel = req.body.role_label;
      }
      const newStaffMember = insertStaffMemberSchema.parse(req.body);
      console.log("Datos validados correctamente:", JSON.stringify(newStaffMember));
      const createdStaffMember = await storage.createStaffMember(newStaffMember);
      res.status(201).json(createdStaffMember);
    } catch (error) {
      console.error("Error creating staff member:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al crear el miembro del staff",
        details: error instanceof z2.ZodError ? error.errors : void 0
      });
    }
  });
  app2.put("/api/staff/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let dataToUpdate = { ...req.body };
      if (req.body.roleLabel && !req.body.role_label) {
        dataToUpdate.role_label = req.body.roleLabel;
        delete dataToUpdate.roleLabel;
      }
      const staffMember = insertStaffMemberSchema.partial().parse(dataToUpdate);
      const updatedStaffMember = await storage.updateStaffMember(id, staffMember);
      if (!updatedStaffMember) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado"
        });
      }
      res.json(updatedStaffMember);
    } catch (error) {
      console.error("Error updating staff member:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al actualizar el miembro del staff",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/staff/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStaffMember(id);
      if (!success) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado"
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting staff member:", error);
      res.status(500).json({
        error: "Error al eliminar el miembro del staff"
      });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllRuleCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching rule categories:", error);
      res.status(500).json({
        error: "Error al obtener las categor\xEDas de reglas"
      });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getRuleCategoryById(id);
      if (!category) {
        return res.status(404).json({
          error: "Categor\xEDa no encontrada"
        });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching rule category:", error);
      res.status(500).json({
        error: "Error al obtener la categor\xEDa de reglas"
      });
    }
  });
  app2.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const newCategory = insertRuleCategorySchema.parse(req.body);
      const createdCategory = await storage.createRuleCategory(newCategory);
      res.status(201).json(createdCategory);
    } catch (error) {
      console.error("Error creating rule category:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al crear la categor\xEDa de reglas",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.put("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = insertRuleCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateRuleCategory(id, category);
      if (!updatedCategory) {
        return res.status(404).json({
          error: "Categor\xEDa no encontrada"
        });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating rule category:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al actualizar la categor\xEDa de reglas",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRuleCategory(id);
      if (!success) {
        return res.status(404).json({
          error: "Categor\xEDa no encontrada"
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting rule category:", error);
      res.status(500).json({
        error: "Error al eliminar la categor\xEDa de reglas"
      });
    }
  });
  app2.get("/api/categories/:categoryId/rules", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const rules2 = await storage.getRulesByCategoryId(categoryId);
      res.json(rules2);
    } catch (error) {
      console.error("Error fetching rules by category:", error);
      res.status(500).json({
        error: "Error al obtener las reglas por categor\xEDa"
      });
    }
  });
  app2.get("/api/rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await storage.getRuleById(id);
      if (!rule) {
        return res.status(404).json({
          error: "Regla no encontrada"
        });
      }
      res.json(rule);
    } catch (error) {
      console.error("Error fetching rule:", error);
      res.status(500).json({
        error: "Error al obtener la regla"
      });
    }
  });
  app2.post("/api/rules", isAuthenticated, async (req, res) => {
    try {
      const newRule = insertRuleSchema.parse(req.body);
      const createdRule = await storage.createRule(newRule);
      res.status(201).json(createdRule);
    } catch (error) {
      console.error("Error creating rule:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al crear la regla",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.put("/api/rules/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = insertRuleSchema.partial().parse(req.body);
      const updatedRule = await storage.updateRule(id, rule);
      if (!updatedRule) {
        return res.status(404).json({
          error: "Regla no encontrada"
        });
      }
      res.json(updatedRule);
    } catch (error) {
      console.error("Error updating rule:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al actualizar la regla",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/rules/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRule(id);
      if (!success) {
        return res.status(404).json({
          error: "Regla no encontrada"
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting rule:", error);
      res.status(500).json({
        error: "Error al eliminar la regla"
      });
    }
  });
  app2.get("/api/announcements", async (req, res) => {
    try {
      const announcements2 = await storage.getAllAnnouncements();
      res.json(announcements2);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({
        error: "Error al obtener los anuncios"
      });
    }
  });
  app2.get("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = await storage.getAnnouncementById(id);
      if (!announcement) {
        return res.status(404).json({
          error: "Anuncio no encontrado"
        });
      }
      res.json(announcement);
    } catch (error) {
      console.error("Error fetching announcement:", error);
      res.status(500).json({
        error: "Error al obtener el anuncio"
      });
    }
  });
  app2.post("/api/announcements", isAuthenticated, async (req, res) => {
    try {
      const newAnnouncement = insertAnnouncementSchema.parse(req.body);
      const createdAnnouncement = await storage.createAnnouncement(newAnnouncement);
      res.status(201).json(createdAnnouncement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al crear el anuncio",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.put("/api/announcements/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = insertAnnouncementSchema.partial().parse(req.body);
      const updatedAnnouncement = await storage.updateAnnouncement(id, announcement);
      if (!updatedAnnouncement) {
        return res.status(404).json({
          error: "Anuncio no encontrado"
        });
      }
      res.json(updatedAnnouncement);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al actualizar el anuncio",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/announcements/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({
          error: "Anuncio no encontrado"
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({
        error: "Error al eliminar el anuncio"
      });
    }
  });
  app2.get("/api/bugs", async (req, res) => {
    try {
      const bugs = await storage.getAllBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs"
      });
    }
  });
  app2.get("/api/bugs/pending", async (req, res) => {
    try {
      const bugs = await storage.getPendingBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching pending bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs pendientes"
      });
    }
  });
  app2.get("/api/bugs/validated", async (req, res) => {
    try {
      const bugs = await storage.getValidatedBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching validated bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs validados"
      });
    }
  });
  app2.get("/api/bugs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bug = await storage.getBugReportById(id);
      if (!bug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado"
        });
      }
      res.json(bug);
    } catch (error) {
      console.error("Error fetching bug report:", error);
      res.status(500).json({
        error: "Error al obtener el reporte de bug"
      });
    }
  });
  app2.post("/api/bugs", async (req, res) => {
    try {
      const newBug = insertBugReportSchema.parse(req.body);
      const createdBug = await storage.createBugReport(newBug);
      res.status(201).json(createdBug);
    } catch (error) {
      console.error("Error creating bug report:", error);
      res.status(error instanceof z2.ZodError ? 400 : 500).json({
        error: "Error al crear el reporte de bug",
        details: error instanceof z2.ZodError ? error.errors : error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/bugs/:id/validate", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedBug = await storage.validateBugReport(id);
      if (!validatedBug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado"
        });
      }
      res.json(validatedBug);
    } catch (error) {
      console.error("Error validating bug report:", error);
      res.status(500).json({
        error: "Error al validar el reporte de bug"
      });
    }
  });
  app2.post("/api/bugs/:id/reject", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.rejectBugReport(id);
      if (!success) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado"
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error rejecting bug report:", error);
      res.status(500).json({
        error: "Error al rechazar el reporte de bug"
      });
    }
  });
  app2.post("/api/bugs/:id/resolve", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resolvedBug = await storage.resolveBugReport(id);
      if (!resolvedBug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado"
        });
      }
      res.json(resolvedBug);
    } catch (error) {
      console.error("Error resolving bug report:", error);
      res.status(500).json({
        error: "Error al resolver el reporte de bug"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
function log(message, source = "express") {
  const time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  console.log(`${time} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server }
    },
    appType: "custom",
    optimizeDeps: {
      entries: ["./client/index.html"]
    },
    root: process.cwd()
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      if (url.startsWith("/api/")) {
        return next();
      }
      let template = fs.readFileSync(
        path.resolve(process.cwd(), "client/index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/server/entry.tsx");
      const appHtml = await render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const publicDir = path.resolve(process.cwd(), "dist/public");
  const indexPath = path.resolve(publicDir, "index.html");
  app2.use(
    (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      const filePath = path.resolve(publicDir, req.path.substring(1));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }
      res.sendFile(indexPath);
    }
  );
}

// server/index.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalJson = res.json;
  res.json = function(body) {
    capturedJsonResponse = body;
    return originalJson.call(this, body);
  };
  res.once("finish", () => {
    const duration = Date.now() - start;
    const size = capturedJsonResponse ? JSON.stringify(capturedJsonResponse).length : 0;
    log(
      `${req.method} ${path2} ${res.statusCode} - ${duration}ms ${size} bytes`,
      "express"
    );
  });
  next();
});
async function bootstrap() {
  log("Configurando conexi\xF3n a la base de datos...");
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }
    const port = process.env.PORT || "5000";
    server.listen({
      port: parseInt(port, 10),
      host: "0.0.0.0"
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
