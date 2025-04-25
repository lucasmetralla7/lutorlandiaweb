import { 
  staffMembers, 
  type StaffMember, 
  type InsertStaffMember,
  type StaffRole,
  ruleCategories,
  type RuleCategory,
  type InsertRuleCategory,
  rules,
  type Rule,
  type InsertRule,
  announcements,
  type Announcement,
  type InsertAnnouncement,
  bugReports,
  type BugReport,
  type InsertBugReport,
  BugStatus,
  users,
  type User,
  type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, asc, sql } from "drizzle-orm";
import { IStorage } from "./storage-interface";
import { MemoryStorage } from "./memory-storage";

// Variable para almacenar la instancia de almacenamiento
let storageInstance: IStorage;

/**
 * Clase para almacenamiento en base de datos MySQL
 */
class DatabaseStorage implements IStorage {
  // Métodos de usuarios
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Staff members
  async getAllStaffMembers(): Promise<StaffMember[]> {
    return await db.select().from(staffMembers);
  }

  async getStaffMemberById(id: number): Promise<StaffMember | undefined> {
    const [staffMember] = await db.select()
      .from(staffMembers)
      .where(eq(staffMembers.id, id));
    return staffMember;
  }

  async createStaffMember(member: InsertStaffMember): Promise<StaffMember> {
    const now = new Date().toISOString();
    const result = await db.insert(staffMembers)
      .values({
        ...member,
        createdAt: now,
        updatedAt: now
      });
    
    // MySQL devuelve el ID insertado en insertId
    const id = Number(result.insertId);
    // Obtenemos el registro recién creado
    const createdMember = await this.getStaffMemberById(id);
    if (!createdMember) {
      throw new Error("Error al crear miembro del staff");
    }
    return createdMember;
  }

  async updateStaffMember(id: number, member: Partial<InsertStaffMember>): Promise<StaffMember | undefined> {
    await db.update(staffMembers)
      .set({
        ...member,
        updatedAt: new Date().toISOString()
      })
      .where(eq(staffMembers.id, id));
    
    // Obtener el registro actualizado
    return await this.getStaffMemberById(id);
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    const result = await db.delete(staffMembers)
      .where(eq(staffMembers.id, id));
    return !!result.rowsAffected;
  }

  // Categorías de reglas
  async getAllRuleCategories(): Promise<RuleCategory[]> {
    return await db.select()
      .from(ruleCategories)
      .orderBy(asc(ruleCategories.order));
  }

  async getRuleCategoryById(id: number): Promise<RuleCategory | undefined> {
    const [category] = await db.select()
      .from(ruleCategories)
      .where(eq(ruleCategories.id, id));
    return category;
  }

  async createRuleCategory(category: InsertRuleCategory): Promise<RuleCategory> {
    // Obtener el último orden
    const result = await db.select({ maxOrder: ruleCategories.order })
      .from(ruleCategories)
      .orderBy(asc(ruleCategories.order))
      .limit(1);
    
    const nextOrder = result.length > 0 ? result[0].maxOrder + 1 : 1;
    const now = new Date().toISOString();
    
    const insertResult = await db.insert(ruleCategories)
      .values({
        ...category,
        order: nextOrder,
        createdAt: now,
        updatedAt: now
      });
    
    // MySQL devuelve el ID insertado en insertId
    const id = Number(insertResult.insertId);
    // Obtenemos el registro recién creado
    const createdCategory = await this.getRuleCategoryById(id);
    if (!createdCategory) {
      throw new Error("Error al crear categoría");
    }
    return createdCategory;
  }

  async updateRuleCategory(id: number, category: Partial<InsertRuleCategory>): Promise<RuleCategory | undefined> {
    await db.update(ruleCategories)
      .set({
        ...category,
        updatedAt: new Date().toISOString()
      })
      .where(eq(ruleCategories.id, id));
    
    // Obtener la categoría actualizada
    return await this.getRuleCategoryById(id);
  }

  async deleteRuleCategory(id: number): Promise<boolean> {
    // Primero eliminar todas las reglas asociadas
    await db.delete(rules)
      .where(eq(rules.categoryId, id));
    
    // Luego eliminar la categoría
    const result = await db.delete(ruleCategories)
      .where(eq(ruleCategories.id, id));
    
    return !!result.rowsAffected;
  }

  // Reglas
  async getRulesByCategoryId(categoryId: number): Promise<Rule[]> {
    return await db.select()
      .from(rules)
      .where(sql`${rules.categoryId} = ${categoryId}`)
      .orderBy(asc(rules.order));
  }

  async getRuleById(id: number): Promise<Rule | undefined> {
    const [rule] = await db.select()
      .from(rules)
      .where(eq(rules.id, id));
    return rule;
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    // Obtener el último orden para la categoría
    const result = await db.select({ maxOrder: rules.order })
      .from(rules)
      .where(sql`${rules.categoryId} = ${rule.categoryId}`)
      .orderBy(asc(rules.order))
      .limit(1);
    
    const nextOrder = result.length > 0 ? result[0].maxOrder + 1 : 1;
    const now = new Date().toISOString();
    
    const insertResult = await db.insert(rules)
      .values({
        ...rule,
        order: nextOrder,
        createdAt: now,
        updatedAt: now
      });
    
    // MySQL devuelve el ID insertado en insertId
    const id = Number(insertResult.insertId);
    // Obtenemos el registro recién creado
    const createdRule = await this.getRuleById(id);
    if (!createdRule) {
      throw new Error("Error al crear regla");
    }
    return createdRule;
  }

  async updateRule(id: number, rule: Partial<InsertRule>): Promise<Rule | undefined> {
    await db.update(rules)
      .set({
        ...rule,
        updatedAt: new Date().toISOString()
      })
      .where(eq(rules.id, id));
    
    // Obtener la regla actualizada
    return await this.getRuleById(id);
  }

  async deleteRule(id: number): Promise<boolean> {
    const result = await db.delete(rules)
      .where(eq(rules.id, id));
    
    return !!result.rowsAffected;
  }

  // Anuncios
  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  async getAnnouncementById(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select()
      .from(announcements)
      .where(eq(announcements.id, id));
    return announcement;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const now = new Date().toISOString();
    const insertResult = await db.insert(announcements)
      .values({
        ...announcement,
        createdAt: now,
        updatedAt: now
      });
    
    // MySQL devuelve el ID insertado en insertId
    const id = Number(insertResult.insertId);
    // Obtenemos el registro recién creado
    const createdAnnouncement = await this.getAnnouncementById(id);
    if (!createdAnnouncement) {
      throw new Error("Error al crear anuncio");
    }
    return createdAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    await db.update(announcements)
      .set({
        ...announcement,
        updatedAt: new Date().toISOString()
      })
      .where(eq(announcements.id, id));
    
    // Obtener el anuncio actualizado
    return await this.getAnnouncementById(id);
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements)
      .where(eq(announcements.id, id));
    return !!result.rowsAffected;
  }
  
  // Reportes de bugs
  async getAllBugReports(): Promise<BugReport[]> {
    return await db.select().from(bugReports);
  }
  
  async getBugReportById(id: number): Promise<BugReport | undefined> {
    const [bugReport] = await db.select()
      .from(bugReports)
      .where(eq(bugReports.id, id));
    return bugReport;
  }
  
  async createBugReport(report: InsertBugReport): Promise<BugReport> {
    const now = new Date().toISOString();
    const insertResult = await db.insert(bugReports)
      .values({
        ...report,
        status: BugStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      });
    
    // MySQL devuelve el ID insertado en insertId
    const id = Number(insertResult.insertId);
    // Obtenemos el registro recién creado
    const createdReport = await this.getBugReportById(id);
    if (!createdReport) {
      throw new Error("Error al crear reporte de bug");
    }
    return createdReport;
  }
  
  async updateBugReport(id: number, report: Partial<BugReport>): Promise<BugReport | undefined> {
    await db.update(bugReports)
      .set({
        ...report,
        updatedAt: new Date().toISOString()
      })
      .where(eq(bugReports.id, id));
      
    // Obtener el reporte actualizado
    return await this.getBugReportById(id);
  }
  
  async deleteBugReport(id: number): Promise<boolean> {
    const result = await db.delete(bugReports)
      .where(eq(bugReports.id, id));
    return !!result.rowsAffected;
  }
  
  async getPendingBugReports(): Promise<BugReport[]> {
    return await db.select()
      .from(bugReports)
      .where(eq(bugReports.status, BugStatus.PENDING));
  }
  
  async getValidatedBugReports(): Promise<BugReport[]> {
    return await db.select()
      .from(bugReports)
      .where(eq(bugReports.status, BugStatus.VALIDATED));
  }
  
  async validateBugReport(id: number): Promise<BugReport | undefined> {
    const now = new Date().toISOString();
    await db.update(bugReports)
      .set({
        status: BugStatus.VALIDATED,
        validatedAt: now,
        updatedAt: now
      })
      .where(eq(bugReports.id, id));
    
    // Obtener el reporte actualizado
    return await this.getBugReportById(id);
  }
  
  async rejectBugReport(id: number): Promise<boolean> {
    // Marcar como rechazado en lugar de eliminar
    const now = new Date().toISOString();
    const result = await db
      .update(bugReports)
      .set({
        status: "RECHAZADO",
        updatedAt: now
      })
      .where(eq(bugReports.id, id));
    
    return !!result.rowsAffected;
  }
  
  async resolveBugReport(id: number): Promise<BugReport | undefined> {
    const now = new Date().toISOString();
    await db.update(bugReports)
      .set({
        status: BugStatus.RESOLVED,
        resolvedAt: now,
        updatedAt: now
      })
      .where(eq(bugReports.id, id));
    
    // Obtener el reporte actualizado
    return await this.getBugReportById(id);
  }
}

/**
 * Función para inicializar el almacenamiento
 * Intenta usar la base de datos MySQL, pero si no está disponible,
 * utiliza el almacenamiento en memoria como fallback
 */
function createStorage(): IStorage {
  try {
    // Verificar si tenemos una instancia de db válida
    if (!db) {
      console.log("🔶 Base de datos MySQL no disponible, usando almacenamiento en memoria");
      return new MemoryStorage();
    }
    
    // Intentar una operación simple para verificar la conexión
    db.select().from(staffMembers).limit(1)
      .then(() => {
        console.log("✅ Conexión a la base de datos MySQL verificada");
      })
      .catch((err: Error) => {
        console.error("❌ Error al verificar la conexión a la base de datos:", err);
        console.log("🔶 Usando almacenamiento en memoria como fallback");
        storageInstance = new MemoryStorage();
      });
    
    return new DatabaseStorage();
  } catch (error) {
    console.error("❌ Error al inicializar el almacenamiento:", error);
    console.log("🔶 Usando almacenamiento en memoria como fallback");
    return new MemoryStorage();
  }
}

// Inicializar el almacenamiento
export const storage = createStorage();