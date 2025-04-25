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
  InsertBugReport
} from "@shared/schema";

// Interfaz para las operaciones CRUD de la aplicación
export interface IStorage {
  // Staff members
  getAllStaffMembers(): Promise<StaffMember[]>;
  getStaffMemberById(id: number): Promise<StaffMember | undefined>;
  createStaffMember(staffMember: InsertStaffMember): Promise<StaffMember>;
  updateStaffMember(id: number, staffMember: Partial<InsertStaffMember>): Promise<StaffMember | undefined>;
  deleteStaffMember(id: number): Promise<boolean>;
  
  // Reglas y categorías
  getAllRuleCategories(): Promise<RuleCategory[]>;
  getRuleCategoryById(id: number): Promise<RuleCategory | undefined>;
  createRuleCategory(category: InsertRuleCategory): Promise<RuleCategory>;
  updateRuleCategory(id: number, category: Partial<InsertRuleCategory>): Promise<RuleCategory | undefined>;
  deleteRuleCategory(id: number): Promise<boolean>;
  
  getRulesByCategoryId(categoryId: number): Promise<Rule[]>;
  getRuleById(id: number): Promise<Rule | undefined>;
  createRule(rule: InsertRule): Promise<Rule>;
  updateRule(id: number, rule: Partial<InsertRule>): Promise<Rule | undefined>;
  deleteRule(id: number): Promise<boolean>;
  
  // Anuncios
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncementById(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Reportes de bugs
  getAllBugReports(): Promise<BugReport[]>;
  getBugReportById(id: number): Promise<BugReport | undefined>;
  createBugReport(bugReport: InsertBugReport): Promise<BugReport>;
  updateBugReport(id: number, bugReport: Partial<BugReport>): Promise<BugReport | undefined>;
  deleteBugReport(id: number): Promise<boolean>;
  
  getPendingBugReports(): Promise<BugReport[]>;
  getValidatedBugReports(): Promise<BugReport[]>;
  validateBugReport(id: number): Promise<BugReport | undefined>;
  rejectBugReport(id: number): Promise<boolean>;
  resolveBugReport(id: number): Promise<BugReport | undefined>;
}