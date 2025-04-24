import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

// Definir la extensión del tipo User para Express
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

// Función para hashear contraseñas
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Función para comparar contraseñas
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware para verificar autenticación
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log('Estado de autenticación:', req.isAuthenticated());
  console.log('Información de sesión:', req.session);
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "No autorizado" });
};

export function setupAuth(app: Express) {
  // Configuración de la sesión
  const isProduction = app.get("env") === "production";
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "lutorlandia-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // 24 horas
    }),
    cookie: {
      secure: isProduction, // Solo establecer a true en producción con HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: 'lax'
    },
  };

  // Configuración de Express y Passport
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Estrategia de autenticación local
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Por ahora, usamos una autenticación simple
        if (username === "lutorlandia" && password === "Olaoladelta123!") {
          return done(null, { id: 1, username: "lutorlandia" });
        } else {
          return done(null, false, { message: "Credenciales incorrectas" });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialización y deserialización del usuario
  passport.serializeUser((user, done) => {
    console.log('Serializando usuario:', user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    console.log('Deserializando usuario con ID:', id);
    // Por ahora, simplemente devolvemos un usuario hardcodeado
    if (id === 1) {
      done(null, { id: 1, username: "lutorlandia" });
    } else {
      done(new Error("Usuario no encontrado"), null);
    }
  });

  // Endpoints de autenticación
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        console.log('Usuario autenticado:', user);
        console.log('Sesión ID:', req.sessionID);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
  });
}