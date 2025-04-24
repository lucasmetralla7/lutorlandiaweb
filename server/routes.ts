import express, { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { ZodError, z } from "zod";
import { 
  insertStaffMemberSchema, 
  insertRuleCategorySchema, 
  insertRuleSchema, 
  insertAnnouncementSchema, 
  insertBugReportSchema,
  StaffRoles
} from "@shared/schema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { log } from "./vite";

// Configuración de autenticación
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware para verificar autenticación
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "No autorizado" });
};

export async function registerRoutes(app: express.Express): Promise<void> {
  // Configuración de sesiones
  app.use(
    session({
      secret: "lutorlandia-secret-key",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Inicializar passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configurar estrategia local
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // En un entorno real, esto buscaría usuarios en la base de datos
        if (username === "lutorlandia" && password === "Olaoladelta123!") {
          return done(null, { id: 1, username: "lutorlandia" });
        }
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    // En un entorno real, esto buscaría el usuario por ID en la base de datos
    if (id === 1) {
      done(null, { id: 1, username: "lutorlandia" });
    } else {
      done(new Error("User not found"), null);
    }
  });

  // Rutas de autenticación
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "No autorizado" });
    }
  });

  // API para Staff Members
  app.get("/api/staff", async (req, res) => {
    try {
      const staffMembers = await storage.getAllStaffMembers();
      res.json(staffMembers);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({
        error: "Error al obtener los miembros del staff",
      });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffMember = await storage.getStaffMemberById(id);
      if (!staffMember) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado",
        });
      }
      res.json(staffMember);
    } catch (error) {
      console.error("Error fetching staff member:", error);
      res.status(500).json({
        error: "Error al obtener el miembro del staff",
      });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      console.log('Body recibido en POST /api/staff:', req.body);

      // Convertir roleLabel a role_label si es necesario
      let dataToInsert = { ...req.body };

      if (req.body.roleLabel && !req.body.role_label) {
        dataToInsert.role_label = req.body.roleLabel;
        delete dataToInsert.roleLabel;
      }

      console.log('Datos procesados para inserción:', dataToInsert);

      const newStaffMember = insertStaffMemberSchema.parse(dataToInsert);
      console.log('Datos validados:', newStaffMember);

      const createdStaffMember = await storage.createStaffMember(newStaffMember);
      console.log('Miembro creado:', createdStaffMember);

      res.status(201).json(createdStaffMember);
    } catch (error) {
      console.error('Error creating staff member:', error);

      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
      }

      res.status(error instanceof z.ZodError ? 400 : 500)
        .json({
          error: 'Error al crear el miembro del staff',
          details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error')
        });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Convertir roleLabel a role_label si es necesario
      let dataToUpdate = { ...req.body };
      
      if (req.body.roleLabel && !req.body.role_label) {
        dataToUpdate.role_label = req.body.roleLabel;
        delete dataToUpdate.roleLabel;
      }
      
      const staffMember = insertStaffMemberSchema.partial().parse(dataToUpdate);
      const updatedStaffMember = await storage.updateStaffMember(id, staffMember);
      
      if (!updatedStaffMember) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado",
        });
      }
      
      res.json(updatedStaffMember);
    } catch (error) {
      console.error("Error updating staff member:", error);
      
      res.status(error instanceof z.ZodError ? 400 : 500)
        .json({
          error: "Error al actualizar el miembro del staff",
          details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error')
        });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStaffMember(id);
      
      if (!success) {
        return res.status(404).json({
          error: "Miembro del staff no encontrado",
        });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting staff member:", error);
      
      res.status(500).json({
        error: "Error al eliminar el miembro del staff",
      });
    }
  });

  // API para Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllRuleCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching rule categories:", error);
      res.status(500).json({
        error: "Error al obtener las categorías de reglas",
      });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getRuleCategoryById(id);
      if (!category) {
        return res.status(404).json({
          error: "Categoría no encontrada",
        });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching rule category:", error);
      res.status(500).json({
        error: "Error al obtener la categoría de reglas",
      });
    }
  });

  app.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const newCategory = insertRuleCategorySchema.parse(req.body);
      const createdCategory = await storage.createRuleCategory(newCategory);
      res.status(201).json(createdCategory);
    } catch (error) {
      console.error("Error creating rule category:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al crear la categoría de reglas",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.put("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = insertRuleCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateRuleCategory(id, category);
      if (!updatedCategory) {
        return res.status(404).json({
          error: "Categoría no encontrada",
        });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating rule category:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al actualizar la categoría de reglas",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRuleCategory(id);
      if (!success) {
        return res.status(404).json({
          error: "Categoría no encontrada",
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting rule category:", error);
      res.status(500).json({
        error: "Error al eliminar la categoría de reglas",
      });
    }
  });

  // API para Rules
  app.get("/api/categories/:categoryId/rules", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const rules = await storage.getRulesByCategoryId(categoryId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching rules by category:", error);
      res.status(500).json({
        error: "Error al obtener las reglas por categoría",
      });
    }
  });

  app.get("/api/rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await storage.getRuleById(id);
      if (!rule) {
        return res.status(404).json({
          error: "Regla no encontrada",
        });
      }
      res.json(rule);
    } catch (error) {
      console.error("Error fetching rule:", error);
      res.status(500).json({
        error: "Error al obtener la regla",
      });
    }
  });

  app.post("/api/rules", isAuthenticated, async (req, res) => {
    try {
      const newRule = insertRuleSchema.parse(req.body);
      const createdRule = await storage.createRule(newRule);
      res.status(201).json(createdRule);
    } catch (error) {
      console.error("Error creating rule:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al crear la regla",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.put("/api/rules/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = insertRuleSchema.partial().parse(req.body);
      const updatedRule = await storage.updateRule(id, rule);
      if (!updatedRule) {
        return res.status(404).json({
          error: "Regla no encontrada",
        });
      }
      res.json(updatedRule);
    } catch (error) {
      console.error("Error updating rule:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al actualizar la regla",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.delete("/api/rules/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRule(id);
      if (!success) {
        return res.status(404).json({
          error: "Regla no encontrada",
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting rule:", error);
      res.status(500).json({
        error: "Error al eliminar la regla",
      });
    }
  });

  // API para Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({
        error: "Error al obtener los anuncios",
      });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = await storage.getAnnouncementById(id);
      if (!announcement) {
        return res.status(404).json({
          error: "Anuncio no encontrado",
        });
      }
      res.json(announcement);
    } catch (error) {
      console.error("Error fetching announcement:", error);
      res.status(500).json({
        error: "Error al obtener el anuncio",
      });
    }
  });

  app.post("/api/announcements", isAuthenticated, async (req, res) => {
    try {
      const newAnnouncement = insertAnnouncementSchema.parse(req.body);
      const createdAnnouncement = await storage.createAnnouncement(newAnnouncement);
      res.status(201).json(createdAnnouncement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al crear el anuncio",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.put("/api/announcements/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = insertAnnouncementSchema.partial().parse(req.body);
      const updatedAnnouncement = await storage.updateAnnouncement(id, announcement);
      if (!updatedAnnouncement) {
        return res.status(404).json({
          error: "Anuncio no encontrado",
        });
      }
      res.json(updatedAnnouncement);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al actualizar el anuncio",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.delete("/api/announcements/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({
          error: "Anuncio no encontrado",
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({
        error: "Error al eliminar el anuncio",
      });
    }
  });

  // API para Bug Reports
  app.get("/api/bugs", async (req, res) => {
    try {
      const bugs = await storage.getAllBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs",
      });
    }
  });

  app.get("/api/bugs/pending", async (req, res) => {
    try {
      const bugs = await storage.getPendingBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching pending bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs pendientes",
      });
    }
  });

  app.get("/api/bugs/validated", async (req, res) => {
    try {
      const bugs = await storage.getValidatedBugReports();
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching validated bug reports:", error);
      res.status(500).json({
        error: "Error al obtener los reportes de bugs validados",
      });
    }
  });

  app.get("/api/bugs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bug = await storage.getBugReportById(id);
      if (!bug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado",
        });
      }
      res.json(bug);
    } catch (error) {
      console.error("Error fetching bug report:", error);
      res.status(500).json({
        error: "Error al obtener el reporte de bug",
      });
    }
  });

  app.post("/api/bugs", async (req, res) => {
    try {
      const newBug = insertBugReportSchema.parse(req.body);
      const createdBug = await storage.createBugReport(newBug);
      res.status(201).json(createdBug);
    } catch (error) {
      console.error("Error creating bug report:", error);
      res.status(error instanceof z.ZodError ? 400 : 500).json({
        error: "Error al crear el reporte de bug",
        details: error instanceof z.ZodError ? error.errors : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  });

  app.put("/api/bugs/:id/validate", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedBug = await storage.validateBugReport(id);
      if (!validatedBug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado",
        });
      }
      res.json(validatedBug);
    } catch (error) {
      console.error("Error validating bug report:", error);
      res.status(500).json({
        error: "Error al validar el reporte de bug",
      });
    }
  });

  app.put("/api/bugs/:id/reject", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.rejectBugReport(id);
      if (!success) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado",
        });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error rejecting bug report:", error);
      res.status(500).json({
        error: "Error al rechazar el reporte de bug",
      });
    }
  });

  app.put("/api/bugs/:id/resolve", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resolvedBug = await storage.resolveBugReport(id);
      if (!resolvedBug) {
        return res.status(404).json({
          error: "Reporte de bug no encontrado",
        });
      }
      res.json(resolvedBug);
    } catch (error) {
      console.error("Error resolving bug report:", error);
      res.status(500).json({
        error: "Error al resolver el reporte de bug",
      });
    }
  });
}
