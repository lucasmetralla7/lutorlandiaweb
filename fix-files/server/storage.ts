import { and, eq, isNull, ne } from "drizzle-orm";
import { db } from "./db";
import {
  StaffMember,
  InsertStaffMember,
  RuleCategory,
  InsertRuleCategory,
  Rule,
  InsertRule,
  Announcement,
  InsertAnnouncement,
  BugReport,
  InsertBugReport,
  BugStatus,
  staffMembers,
  ruleCategories,
  rules,
  announcements,
  bugReports,
  users,
  User,
  InsertUser,
  tournaments,
  tournamentPodiums,
  formFields,
  InsertTournament,
  Tournament,
  InsertTournamentPodium,
  TournamentPodium,
  InsertFormField,
  FormField,
  TournamentRegistration,
  InsertTournamentRegistration,
  tournamentRegistrations,
  TournamentRegistrationStatus,
} from "@shared/schema";
import type { IStorage } from "./storage-interface";
import { createPool, Pool } from 'mysql2/promise';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

/**
 * Clase para almacenamiento en base de datos MySQL
 */
class DatabaseStorage implements IStorage {
  private db: MySql2Database;
  public sessionStore: session.SessionStore;

  constructor(db: MySql2Database) {
    this.db = db;
    // Intentamos usar PostgreSQL primero, si falla usamos MemoryStore
    try {
      this.sessionStore = new PostgresSessionStore({ 
        pool, 
        createTableIfMissing: true 
      });
    } catch (error) {
      console.log("Error al crear PostgresSessionStore, usando MemoryStore", error);
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000,
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  // Staff members
  async getAllStaffMembers(): Promise<StaffMember[]> {
    return await this.db.select().from(staffMembers).orderBy(staffMembers.id);
  }

  async getStaffMemberById(id: number): Promise<StaffMember | undefined> {
    const [member] = await this.db.select().from(staffMembers).where(eq(staffMembers.id, id));
    return member;
  }

  async createStaffMember(member: InsertStaffMember): Promise<StaffMember> {
    const now = new Date().toISOString();
    const [newMember] = await this.db.insert(staffMembers).values({
      ...member,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newMember;
  }

  async updateStaffMember(id: number, member: Partial<InsertStaffMember>): Promise<StaffMember | undefined> {
    const now = new Date().toISOString();
    const [updatedMember] = await this.db.update(staffMembers)
      .set({
        ...member,
        updatedAt: now,
      })
      .where(eq(staffMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(staffMembers).where(eq(staffMembers.id, id)).returning();
    return !!deleted;
  }

  // Rule categories
  async getAllRuleCategories(): Promise<RuleCategory[]> {
    return await this.db.select().from(ruleCategories).orderBy(ruleCategories.order);
  }

  async getRuleCategoryById(id: number): Promise<RuleCategory | undefined> {
    const [category] = await this.db.select().from(ruleCategories).where(eq(ruleCategories.id, id));
    return category;
  }

  async createRuleCategory(category: InsertRuleCategory): Promise<RuleCategory> {
    // Get the current max order
    const allCategories = await this.getAllRuleCategories();
    const maxOrder = allCategories.length > 0 
      ? Math.max(...allCategories.map(c => c.order)) 
      : 0;
    
    const now = new Date().toISOString();
    const [newCategory] = await this.db.insert(ruleCategories).values({
      ...category,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newCategory;
  }

  async updateRuleCategory(id: number, category: Partial<InsertRuleCategory>): Promise<RuleCategory | undefined> {
    const now = new Date().toISOString();
    const [updatedCategory] = await this.db.update(ruleCategories)
      .set({
        ...category,
        updatedAt: now,
      })
      .where(eq(ruleCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteRuleCategory(id: number): Promise<boolean> {
    // Delete all rules in this category first
    await this.db.delete(rules).where(eq(rules.categoryId, id));
    
    // Then delete the category
    const [deleted] = await this.db.delete(ruleCategories).where(eq(ruleCategories.id, id)).returning();
    return !!deleted;
  }

  // Rules
  async getRulesByCategoryId(categoryId: number): Promise<Rule[]> {
    return await this.db.select().from(rules)
      .where(eq(rules.categoryId, categoryId))
      .orderBy(rules.order);
  }

  async getRuleById(id: number): Promise<Rule | undefined> {
    const [rule] = await this.db.select().from(rules).where(eq(rules.id, id));
    return rule;
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    // Get the current max order for this category
    const categoryRules = await this.getRulesByCategoryId(rule.categoryId);
    const maxOrder = categoryRules.length > 0 
      ? Math.max(...categoryRules.map(r => r.order)) 
      : 0;
    
    const now = new Date().toISOString();
    const [newRule] = await this.db.insert(rules).values({
      ...rule,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newRule;
  }

  async updateRule(id: number, rule: Partial<InsertRule>): Promise<Rule | undefined> {
    const now = new Date().toISOString();
    const [updatedRule] = await this.db.update(rules)
      .set({
        ...rule,
        updatedAt: now,
      })
      .where(eq(rules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteRule(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(rules).where(eq(rules.id, id)).returning();
    return !!deleted;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return await this.db.select().from(announcements).orderBy(announcements.id);
  }

  async getAnnouncementById(id: number): Promise<Announcement | undefined> {
    const [announcement] = await this.db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const now = new Date().toISOString();
    const [newAnnouncement] = await this.db.insert(announcements).values({
      ...announcement,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const now = new Date().toISOString();
    const [updatedAnnouncement] = await this.db.update(announcements)
      .set({
        ...announcement,
        updatedAt: now,
      })
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(announcements).where(eq(announcements.id, id)).returning();
    return !!deleted;
  }

  // Bug Reports
  async getAllBugReports(): Promise<BugReport[]> {
    return await this.db.select().from(bugReports).orderBy(bugReports.id);
  }

  async getBugReportById(id: number): Promise<BugReport | undefined> {
    const [report] = await this.db.select().from(bugReports).where(eq(bugReports.id, id));
    return report;
  }

  async createBugReport(report: InsertBugReport): Promise<BugReport> {
    const now = new Date().toISOString();
    const [newReport] = await this.db.insert(bugReports).values({
      ...report,
      status: BugStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newReport;
  }

  async updateBugReport(id: number, report: Partial<BugReport>): Promise<BugReport | undefined> {
    const now = new Date().toISOString();
    const [updatedReport] = await this.db.update(bugReports)
      .set({
        ...report,
        updatedAt: now,
      })
      .where(eq(bugReports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteBugReport(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(bugReports).where(eq(bugReports.id, id)).returning();
    return !!deleted;
  }

  async getPendingBugReports(): Promise<BugReport[]> {
    return await this.db.select().from(bugReports)
      .where(eq(bugReports.status, BugStatus.PENDING))
      .orderBy(bugReports.id);
  }

  async getValidatedBugReports(): Promise<BugReport[]> {
    return await this.db.select().from(bugReports)
      .where(eq(bugReports.status, BugStatus.VALIDATED))
      .orderBy(bugReports.id);
  }

  async validateBugReport(id: number): Promise<BugReport | undefined> {
    const now = new Date().toISOString();
    const [updatedReport] = await this.db.update(bugReports)
      .set({
        status: BugStatus.VALIDATED,
        validatedAt: now,
        updatedAt: now,
      })
      .where(eq(bugReports.id, id))
      .returning();
    return updatedReport;
  }

  async rejectBugReport(id: number): Promise<boolean> {
    const now = new Date().toISOString();
    const [deleted] = await this.db.update(bugReports)
      .set({
        status: BugStatus.REJECTED,
        updatedAt: now,
      })
      .where(eq(bugReports.id, id))
      .returning();
    return !!deleted;
  }

  async resolveBugReport(id: number): Promise<BugReport | undefined> {
    const now = new Date().toISOString();
    const [updatedReport] = await this.db.update(bugReports)
      .set({
        status: BugStatus.RESOLVED,
        resolvedAt: now,
        updatedAt: now,
      })
      .where(eq(bugReports.id, id))
      .returning();
    return updatedReport;
  }

  // Tournament methods
  async getAllTournaments(): Promise<Tournament[]> {
    return await this.db.select().from(tournaments).orderBy(tournaments.id);
  }

  async getTournamentById(id: number): Promise<Tournament | undefined> {
    const [tournament] = await this.db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const now = new Date().toISOString();
    const [newTournament] = await this.db.insert(tournaments).values({
      ...tournament,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newTournament;
  }

  async updateTournament(id: number, tournament: Partial<InsertTournament>): Promise<Tournament | undefined> {
    const now = new Date().toISOString();
    const [updatedTournament] = await this.db.update(tournaments)
      .set({
        ...tournament,
        updatedAt: now,
      })
      .where(eq(tournaments.id, id))
      .returning();
    return updatedTournament;
  }

  async deleteTournament(id: number): Promise<boolean> {
    // Delete all podiums for this tournament
    await this.db.delete(tournamentPodiums).where(eq(tournamentPodiums.tournamentId, id));
    
    // Delete all form fields for this tournament
    await this.db.delete(formFields).where(eq(formFields.tournamentId, id));
    
    // Delete all registrations for this tournament
    await this.db.delete(tournamentRegistrations).where(eq(tournamentRegistrations.tournamentId, id));
    
    // Then delete the tournament
    const [deleted] = await this.db.delete(tournaments).where(eq(tournaments.id, id)).returning();
    return !!deleted;
  }

  // Tournament podium methods
  async getPodiumsByTournamentId(tournamentId: number): Promise<TournamentPodium[]> {
    return await this.db.select().from(tournamentPodiums)
      .where(eq(tournamentPodiums.tournamentId, tournamentId))
      .orderBy(tournamentPodiums.position);
  }

  async getPodiumById(id: number): Promise<TournamentPodium | undefined> {
    const [podium] = await this.db.select().from(tournamentPodiums).where(eq(tournamentPodiums.id, id));
    return podium;
  }

  async createPodium(podium: InsertTournamentPodium): Promise<TournamentPodium> {
    const now = new Date().toISOString();
    const [newPodium] = await this.db.insert(tournamentPodiums).values({
      ...podium,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newPodium;
  }

  async updatePodium(id: number, podium: Partial<InsertTournamentPodium>): Promise<TournamentPodium | undefined> {
    const now = new Date().toISOString();
    const [updatedPodium] = await this.db.update(tournamentPodiums)
      .set({
        ...podium,
        updatedAt: now,
      })
      .where(eq(tournamentPodiums.id, id))
      .returning();
    return updatedPodium;
  }

  async deletePodium(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(tournamentPodiums).where(eq(tournamentPodiums.id, id)).returning();
    return !!deleted;
  }

  // Form field methods
  async getFormFieldsByTournamentId(tournamentId: number): Promise<FormField[]> {
    return await this.db.select().from(formFields)
      .where(eq(formFields.tournamentId, tournamentId))
      .orderBy(formFields.order);
  }

  async getFormFieldById(id: number): Promise<FormField | undefined> {
    const [field] = await this.db.select().from(formFields).where(eq(formFields.id, id));
    return field;
  }

  async createFormField(field: InsertFormField): Promise<FormField> {
    // Get the current max order for this tournament
    const tournamentFields = await this.getFormFieldsByTournamentId(field.tournamentId);
    const maxOrder = tournamentFields.length > 0 
      ? Math.max(...tournamentFields.map(f => f.order)) 
      : 0;
    
    const now = new Date().toISOString();
    const [newField] = await this.db.insert(formFields).values({
      ...field,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newField;
  }

  async updateFormField(id: number, field: Partial<InsertFormField>): Promise<FormField | undefined> {
    const now = new Date().toISOString();
    const [updatedField] = await this.db.update(formFields)
      .set({
        ...field,
        updatedAt: now,
      })
      .where(eq(formFields.id, id))
      .returning();
    return updatedField;
  }

  async deleteFormField(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(formFields).where(eq(formFields.id, id)).returning();
    return !!deleted;
  }

  // Tournament registration methods
  async getRegistrationsByTournamentId(tournamentId: number): Promise<TournamentRegistration[]> {
    return await this.db.select().from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.tournamentId, tournamentId))
      .orderBy(tournamentRegistrations.id);
  }

  async getRegistrationById(id: number): Promise<TournamentRegistration | undefined> {
    const [registration] = await this.db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.id, id));
    return registration;
  }

  async createRegistration(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const now = new Date().toISOString();
    const [newRegistration] = await this.db.insert(tournamentRegistrations).values({
      ...registration,
      status: TournamentRegistrationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return newRegistration;
  }

  async approveRegistration(id: number): Promise<TournamentRegistration | undefined> {
    const now = new Date().toISOString();
    const [updatedRegistration] = await this.db.update(tournamentRegistrations)
      .set({
        status: TournamentRegistrationStatus.APPROVED,
        updatedAt: now,
      })
      .where(eq(tournamentRegistrations.id, id))
      .returning();
    return updatedRegistration;
  }

  async rejectRegistration(id: number): Promise<TournamentRegistration | undefined> {
    const now = new Date().toISOString();
    const [updatedRegistration] = await this.db.update(tournamentRegistrations)
      .set({
        status: TournamentRegistrationStatus.REJECTED,
        updatedAt: now,
      })
      .where(eq(tournamentRegistrations.id, id))
      .returning();
    return updatedRegistration;
  }

  async deleteRegistration(id: number): Promise<boolean> {
    const [deleted] = await this.db.delete(tournamentRegistrations).where(eq(tournamentRegistrations.id, id)).returning();
    return !!deleted;
  }
}

/**
 * Clase para almacenamiento en memoria (fallback)
 */
class MemoryStorage implements IStorage {
  private staffMembers: StaffMember[] = [];
  private ruleCategories: RuleCategory[] = [];
  private rules: Rule[] = [];
  private announcements: Announcement[] = [];
  private bugReports: BugReport[] = [];
  private users: User[] = [
    {
      id: 1,
      username: "lutorlandia",
      password: "$2a$10$xn3LI/AjqicFYZFruSwve.j1pk4K6ToLymHhtkftg5q.yvonC3e3W", // Olaoladelta123!
    }
  ];
  private tournaments: Tournament[] = [];
  private tournamentPodiums: TournamentPodium[] = [];
  private formFields: FormField[] = [];
  private tournamentRegistrations: TournamentRegistration[] = [];
  public sessionStore: session.SessionStore;

  private nextIds = {
    staffMembers: 1,
    ruleCategories: 1,
    rules: 1,
    announcements: 1,
    bugReports: 1,
    users: 2, // Ya tenemos un usuario con id 1
    tournaments: 1,
    tournamentPodiums: 1,
    formFields: 1,
    tournamentRegistrations: 1,
  };

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextIds.users++;
    const newUser: User = {
      id,
      ...insertUser,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getAllStaffMembers(): Promise<StaffMember[]> {
    return [...this.staffMembers];
  }

  async getStaffMemberById(id: number): Promise<StaffMember | undefined> {
    return this.staffMembers.find(member => member.id === id);
  }

  async createStaffMember(member: InsertStaffMember): Promise<StaffMember> {
    const id = this.nextIds.staffMembers++;
    const now = new Date().toISOString();
    const newMember: StaffMember = {
      id,
      ...member,
      createdAt: now,
      updatedAt: now,
    };
    this.staffMembers.push(newMember);
    return newMember;
  }

  async updateStaffMember(id: number, member: Partial<InsertStaffMember>): Promise<StaffMember | undefined> {
    const index = this.staffMembers.findIndex(m => m.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.staffMembers[index] = {
      ...this.staffMembers[index],
      ...member,
      updatedAt: now,
    };
    return this.staffMembers[index];
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    const initialLength = this.staffMembers.length;
    this.staffMembers = this.staffMembers.filter(member => member.id !== id);
    return initialLength !== this.staffMembers.length;
  }

  async getAllRuleCategories(): Promise<RuleCategory[]> {
    return [...this.ruleCategories].sort((a, b) => a.order - b.order);
  }

  async getRuleCategoryById(id: number): Promise<RuleCategory | undefined> {
    return this.ruleCategories.find(category => category.id === id);
  }

  async createRuleCategory(category: InsertRuleCategory): Promise<RuleCategory> {
    const id = this.nextIds.ruleCategories++;
    const now = new Date().toISOString();
    const maxOrder = this.ruleCategories.length > 0 
      ? Math.max(...this.ruleCategories.map(c => c.order))
      : 0;
    const newCategory: RuleCategory = {
      id,
      ...category,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    this.ruleCategories.push(newCategory);
    return newCategory;
  }

  async updateRuleCategory(id: number, category: Partial<InsertRuleCategory>): Promise<RuleCategory | undefined> {
    const index = this.ruleCategories.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.ruleCategories[index] = {
      ...this.ruleCategories[index],
      ...category,
      updatedAt: now,
    };
    return this.ruleCategories[index];
  }

  async deleteRuleCategory(id: number): Promise<boolean> {
    // Delete all rules in this category first
    this.rules = this.rules.filter(rule => rule.categoryId !== id);
    
    // Then delete the category
    const initialLength = this.ruleCategories.length;
    this.ruleCategories = this.ruleCategories.filter(category => category.id !== id);
    return initialLength !== this.ruleCategories.length;
  }

  async getRulesByCategoryId(categoryId: number): Promise<Rule[]> {
    return this.rules
      .filter(rule => rule.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }

  async getRuleById(id: number): Promise<Rule | undefined> {
    return this.rules.find(rule => rule.id === id);
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    const id = this.nextIds.rules++;
    const now = new Date().toISOString();
    const categoryRules = this.rules.filter(r => r.categoryId === rule.categoryId);
    const maxOrder = categoryRules.length > 0 
      ? Math.max(...categoryRules.map(r => r.order))
      : 0;
    const newRule: Rule = {
      id,
      ...rule,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    this.rules.push(newRule);
    return newRule;
  }

  async updateRule(id: number, rule: Partial<InsertRule>): Promise<Rule | undefined> {
    const index = this.rules.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.rules[index] = {
      ...this.rules[index],
      ...rule,
      updatedAt: now,
    };
    return this.rules[index];
  }

  async deleteRule(id: number): Promise<boolean> {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(rule => rule.id !== id);
    return initialLength !== this.rules.length;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return [...this.announcements];
  }

  async getAnnouncementById(id: number): Promise<Announcement | undefined> {
    return this.announcements.find(announcement => announcement.id === id);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.nextIds.announcements++;
    const now = new Date().toISOString();
    const newAnnouncement: Announcement = {
      id,
      ...announcement,
      createdAt: now,
      updatedAt: now,
    };
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.announcements[index] = {
      ...this.announcements[index],
      ...announcement,
      updatedAt: now,
    };
    return this.announcements[index];
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const initialLength = this.announcements.length;
    this.announcements = this.announcements.filter(announcement => announcement.id !== id);
    return initialLength !== this.announcements.length;
  }

  async getAllBugReports(): Promise<BugReport[]> {
    return [...this.bugReports];
  }

  async getBugReportById(id: number): Promise<BugReport | undefined> {
    return this.bugReports.find(report => report.id === id);
  }

  async createBugReport(report: InsertBugReport): Promise<BugReport> {
    const id = this.nextIds.bugReports++;
    const now = new Date().toISOString();
    const newReport: BugReport = {
      id,
      ...report,
      status: BugStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    this.bugReports.push(newReport);
    return newReport;
  }

  async updateBugReport(id: number, report: Partial<BugReport>): Promise<BugReport | undefined> {
    const index = this.bugReports.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      ...report,
      updatedAt: now,
    };
    return this.bugReports[index];
  }

  async deleteBugReport(id: number): Promise<boolean> {
    const initialLength = this.bugReports.length;
    this.bugReports = this.bugReports.filter(report => report.id !== id);
    return initialLength !== this.bugReports.length;
  }

  async getPendingBugReports(): Promise<BugReport[]> {
    return this.bugReports.filter(report => report.status === BugStatus.PENDING);
  }

  async getValidatedBugReports(): Promise<BugReport[]> {
    return this.bugReports.filter(report => report.status === BugStatus.VALIDATED);
  }

  async validateBugReport(id: number): Promise<BugReport | undefined> {
    const index = this.bugReports.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.VALIDATED,
      validatedAt: now,
      updatedAt: now,
    };
    return this.bugReports[index];
  }

  async rejectBugReport(id: number): Promise<boolean> {
    const index = this.bugReports.findIndex(r => r.id === id);
    if (index === -1) return false;

    const now = new Date().toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.REJECTED,
      updatedAt: now,
    };
    return true;
  }

  async resolveBugReport(id: number): Promise<BugReport | undefined> {
    const index = this.bugReports.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.bugReports[index] = {
      ...this.bugReports[index],
      status: BugStatus.RESOLVED,
      resolvedAt: now,
      updatedAt: now,
    };
    return this.bugReports[index];
  }

  // Tournament methods
  async getAllTournaments(): Promise<Tournament[]> {
    return [...this.tournaments];
  }

  async getTournamentById(id: number): Promise<Tournament | undefined> {
    return this.tournaments.find(tournament => tournament.id === id);
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.nextIds.tournaments++;
    const now = new Date().toISOString();
    const newTournament: Tournament = {
      id,
      ...tournament,
      createdAt: now,
      updatedAt: now,
    };
    this.tournaments.push(newTournament);
    return newTournament;
  }

  async updateTournament(id: number, tournament: Partial<InsertTournament>): Promise<Tournament | undefined> {
    const index = this.tournaments.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.tournaments[index] = {
      ...this.tournaments[index],
      ...tournament,
      updatedAt: now,
    };
    return this.tournaments[index];
  }

  async deleteTournament(id: number): Promise<boolean> {
    // Delete all podiums for this tournament
    this.tournamentPodiums = this.tournamentPodiums.filter(p => p.tournamentId !== id);
    
    // Delete all form fields for this tournament
    this.formFields = this.formFields.filter(f => f.tournamentId !== id);
    
    // Delete all registrations for this tournament
    this.tournamentRegistrations = this.tournamentRegistrations.filter(r => r.tournamentId !== id);
    
    // Then delete the tournament
    const initialLength = this.tournaments.length;
    this.tournaments = this.tournaments.filter(t => t.id !== id);
    return initialLength !== this.tournaments.length;
  }

  // Tournament podium methods
  async getPodiumsByTournamentId(tournamentId: number): Promise<TournamentPodium[]> {
    return this.tournamentPodiums
      .filter(podium => podium.tournamentId === tournamentId)
      .sort((a, b) => a.position - b.position);
  }

  async getPodiumById(id: number): Promise<TournamentPodium | undefined> {
    return this.tournamentPodiums.find(podium => podium.id === id);
  }

  async createPodium(podium: InsertTournamentPodium): Promise<TournamentPodium> {
    const id = this.nextIds.tournamentPodiums++;
    const now = new Date().toISOString();
    const newPodium: TournamentPodium = {
      id,
      ...podium,
      createdAt: now,
      updatedAt: now,
    };
    this.tournamentPodiums.push(newPodium);
    return newPodium;
  }

  async updatePodium(id: number, podium: Partial<InsertTournamentPodium>): Promise<TournamentPodium | undefined> {
    const index = this.tournamentPodiums.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.tournamentPodiums[index] = {
      ...this.tournamentPodiums[index],
      ...podium,
      updatedAt: now,
    };
    return this.tournamentPodiums[index];
  }

  async deletePodium(id: number): Promise<boolean> {
    const initialLength = this.tournamentPodiums.length;
    this.tournamentPodiums = this.tournamentPodiums.filter(p => p.id !== id);
    return initialLength !== this.tournamentPodiums.length;
  }

  // Form field methods
  async getFormFieldsByTournamentId(tournamentId: number): Promise<FormField[]> {
    return this.formFields
      .filter(field => field.tournamentId === tournamentId)
      .sort((a, b) => a.order - b.order);
  }

  async getFormFieldById(id: number): Promise<FormField | undefined> {
    return this.formFields.find(field => field.id === id);
  }

  async createFormField(field: InsertFormField): Promise<FormField> {
    const id = this.nextIds.formFields++;
    const now = new Date().toISOString();
    const tournamentFields = this.formFields.filter(f => f.tournamentId === field.tournamentId);
    const maxOrder = tournamentFields.length > 0 
      ? Math.max(...tournamentFields.map(f => f.order))
      : 0;
    const newField: FormField = {
      id,
      ...field,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    this.formFields.push(newField);
    return newField;
  }

  async updateFormField(id: number, field: Partial<InsertFormField>): Promise<FormField | undefined> {
    const index = this.formFields.findIndex(f => f.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.formFields[index] = {
      ...this.formFields[index],
      ...field,
      updatedAt: now,
    };
    return this.formFields[index];
  }

  async deleteFormField(id: number): Promise<boolean> {
    const initialLength = this.formFields.length;
    this.formFields = this.formFields.filter(f => f.id !== id);
    return initialLength !== this.formFields.length;
  }

  // Tournament registration methods
  async getRegistrationsByTournamentId(tournamentId: number): Promise<TournamentRegistration[]> {
    return this.tournamentRegistrations.filter(reg => reg.tournamentId === tournamentId);
  }

  async getRegistrationById(id: number): Promise<TournamentRegistration | undefined> {
    return this.tournamentRegistrations.find(reg => reg.id === id);
  }

  async createRegistration(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const id = this.nextIds.tournamentRegistrations++;
    const now = new Date().toISOString();
    const newRegistration: TournamentRegistration = {
      id,
      ...registration,
      status: TournamentRegistrationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    this.tournamentRegistrations.push(newRegistration);
    return newRegistration;
  }

  async approveRegistration(id: number): Promise<TournamentRegistration | undefined> {
    const index = this.tournamentRegistrations.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.tournamentRegistrations[index] = {
      ...this.tournamentRegistrations[index],
      status: TournamentRegistrationStatus.APPROVED,
      updatedAt: now,
    };
    return this.tournamentRegistrations[index];
  }

  async rejectRegistration(id: number): Promise<TournamentRegistration | undefined> {
    const index = this.tournamentRegistrations.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    this.tournamentRegistrations[index] = {
      ...this.tournamentRegistrations[index],
      status: TournamentRegistrationStatus.REJECTED,
      updatedAt: now,
    };
    return this.tournamentRegistrations[index];
  }

  async deleteRegistration(id: number): Promise<boolean> {
    const initialLength = this.tournamentRegistrations.length;
    this.tournamentRegistrations = this.tournamentRegistrations.filter(r => r.id !== id);
    return initialLength !== this.tournamentRegistrations.length;
  }
}

// Variable para almacenar la instancia de almacenamiento
let storageInstance: IStorage;

/**
 * Función para inicializar el almacenamiento
 * Intenta usar la base de datos MySQL, pero si no está disponible,
 * utiliza el almacenamiento en memoria como fallback
 */
function createStorage(): IStorage {
  // Comprobar si ya existe una instancia
  if (storageInstance) {
    return storageInstance;
  }

  console.log("Configurando conexión a la base de datos...");

  try {
    // Intentar crear una instancia de almacenamiento MySQL
    const dbStorage = new DatabaseStorage(db);
    
    // Verificar que la conexión funciona
    db.select({ value: 1 }).then(() => {
      console.log("✅ Conexión a la base de datos establecida correctamente");
    }).catch((err: Error) => {
      console.log(`❌ Error al verificar la conexión a la base de datos: ${err}`);
      console.log("🔶 Usando almacenamiento en memoria como fallback");
      storageInstance = new MemoryStorage();
    });
    
    storageInstance = dbStorage;
    return dbStorage;
  } catch (err: any) {
    // Si hay un error al conectar con MySQL, usar almacenamiento en memoria
    console.log(`Error al conectar a la base de datos: ${err}`);
    console.log("Usando almacenamiento en memoria como fallback");
    storageInstance = new MemoryStorage();
    return storageInstance;
  }
}

// Exportar la instancia de almacenamiento
export const storage = createStorage();