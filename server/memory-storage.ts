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
  BugStatus
} from "@shared/schema";
import { IStorage } from "./storage-interface";

// Implementación de almacenamiento en memoria para desarrollo/fallback
export class MemoryStorage implements IStorage {
  private staffMembers: StaffMember[] = [];
  private ruleCategories: RuleCategory[] = [];
  private rules: Rule[] = [];
  private announcements: Announcement[] = [];
  private bugReports: BugReport[] = [];
  
  private nextIds = {
    staffMember: 1,
    ruleCategory: 1,
    rule: 1,
    announcement: 1,
    bugReport: 1
  };

  // Staff members
  async getAllStaffMembers(): Promise<StaffMember[]> {
    return this.staffMembers;
  }

  async getStaffMemberById(id: number): Promise<StaffMember | undefined> {
    return this.staffMembers.find(member => member.id === id);
  }

  async createStaffMember(member: InsertStaffMember): Promise<StaffMember> {
    const id = this.nextIds.staffMember++;
    const now = new Date().toISOString();
    
    const newMember: StaffMember = {
      id,
      ...member,
      createdAt: now,
      updatedAt: now
    };
    
    this.staffMembers.push(newMember);
    return newMember;
  }

  async updateStaffMember(id: number, member: Partial<InsertStaffMember>): Promise<StaffMember | undefined> {
    const index = this.staffMembers.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    this.staffMembers[index] = {
      ...this.staffMembers[index],
      ...member,
      updatedAt: new Date().toISOString()
    };
    
    return this.staffMembers[index];
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    const initialLength = this.staffMembers.length;
    this.staffMembers = this.staffMembers.filter(member => member.id !== id);
    return initialLength > this.staffMembers.length;
  }

  // Categorías de reglas
  async getAllRuleCategories(): Promise<RuleCategory[]> {
    return [...this.ruleCategories].sort((a, b) => a.order - b.order);
  }

  async getRuleCategoryById(id: number): Promise<RuleCategory | undefined> {
    return this.ruleCategories.find(category => category.id === id);
  }

  async createRuleCategory(category: InsertRuleCategory): Promise<RuleCategory> {
    const id = this.nextIds.ruleCategory++;
    const now = new Date().toISOString();
    
    // Determinar el próximo orden
    const maxOrder = this.ruleCategories.reduce((max, cat) => Math.max(max, cat.order), 0);
    const order = category.order || maxOrder + 1;
    
    const newCategory: RuleCategory = {
      id,
      ...category,
      order,
      createdAt: now,
      updatedAt: now
    };
    
    this.ruleCategories.push(newCategory);
    return newCategory;
  }

  async updateRuleCategory(id: number, category: Partial<InsertRuleCategory>): Promise<RuleCategory | undefined> {
    const index = this.ruleCategories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.ruleCategories[index] = {
      ...this.ruleCategories[index],
      ...category,
      updatedAt: new Date().toISOString()
    };
    
    return this.ruleCategories[index];
  }

  async deleteRuleCategory(id: number): Promise<boolean> {
    // Primero eliminar todas las reglas asociadas
    this.rules = this.rules.filter(rule => rule.categoryId !== id);
    
    // Luego eliminar la categoría
    const initialLength = this.ruleCategories.length;
    this.ruleCategories = this.ruleCategories.filter(category => category.id !== id);
    return initialLength > this.ruleCategories.length;
  }

  // Reglas
  async getRulesByCategoryId(categoryId: number): Promise<Rule[]> {
    return this.rules
      .filter(rule => rule.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }

  async getRuleById(id: number): Promise<Rule | undefined> {
    return this.rules.find(rule => rule.id === id);
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    const id = this.nextIds.rule++;
    const now = new Date().toISOString();
    
    // Determinar el próximo orden para la categoría
    const rulesInCategory = this.rules.filter(r => r.categoryId === rule.categoryId);
    const maxOrder = rulesInCategory.reduce((max, r) => Math.max(max, r.order), 0);
    const order = rule.order || maxOrder + 1;
    
    const newRule: Rule = {
      id,
      ...rule,
      order,
      createdAt: now,
      updatedAt: now
    };
    
    this.rules.push(newRule);
    return newRule;
  }

  async updateRule(id: number, rule: Partial<InsertRule>): Promise<Rule | undefined> {
    const index = this.rules.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.rules[index] = {
      ...this.rules[index],
      ...rule,
      updatedAt: new Date().toISOString()
    };
    
    return this.rules[index];
  }

  async deleteRule(id: number): Promise<boolean> {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(rule => rule.id !== id);
    return initialLength > this.rules.length;
  }

  // Anuncios
  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcements;
  }

  async getAnnouncementById(id: number): Promise<Announcement | undefined> {
    return this.announcements.find(announcement => announcement.id === id);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.nextIds.announcement++;
    const now = new Date().toISOString();
    
    const newAnnouncement: Announcement = {
      id,
      ...announcement,
      link: announcement.link || null,
      time: announcement.time || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.announcements[index] = {
      ...this.announcements[index],
      ...announcement,
      link: announcement.link || this.announcements[index].link,
      time: announcement.time || this.announcements[index].time,
      updatedAt: new Date().toISOString()
    };
    
    return this.announcements[index];
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const initialLength = this.announcements.length;
    this.announcements = this.announcements.filter(announcement => announcement.id !== id);
    return initialLength > this.announcements.length;
  }
  
  // Reportes de bugs
  async getAllBugReports(): Promise<BugReport[]> {
    return this.bugReports;
  }
  
  async getBugReportById(id: number): Promise<BugReport | undefined> {
    return this.bugReports.find(report => report.id === id);
  }
  
  async createBugReport(report: InsertBugReport): Promise<BugReport> {
    const id = this.nextIds.bugReport++;
    const now = new Date().toISOString();
    
    const newReport: BugReport = {
      id,
      ...report,
      status: BugStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      validatedAt: null,
      resolvedAt: null
    };
    
    this.bugReports.push(newReport);
    return newReport;
  }
  
  async updateBugReport(id: number, report: Partial<BugReport>): Promise<BugReport | undefined> {
    const index = this.bugReports.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.bugReports[index] = {
      ...this.bugReports[index],
      ...report,
      updatedAt: new Date().toISOString()
    };
    
    return this.bugReports[index];
  }
  
  async deleteBugReport(id: number): Promise<boolean> {
    const initialLength = this.bugReports.length;
    this.bugReports = this.bugReports.filter(report => report.id !== id);
    return initialLength > this.bugReports.length;
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
      updatedAt: now
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
      updatedAt: now
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
      updatedAt: now
    };
    
    return this.bugReports[index];
  }
}