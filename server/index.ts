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
<<<<<<< HEAD
    // Registrar todas las rutas (ya no esperamos un servidor de retorno)
    await registerRoutes(app);
=======
    // Registrar todas las rutas
    const server = await registerRoutes(app);
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

<<<<<<< HEAD
    // Crear el servidor HTTP directamente aquí
    const server = createServer(app);

=======
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
    // Configurar Vite o servir estáticos
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

<<<<<<< HEAD
    const port = process.env.PORT || "3000";
=======
    const port = process.env.PORT || "5000";
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
