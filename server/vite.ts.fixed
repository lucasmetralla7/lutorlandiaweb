import { createServer as createViteServer } from "vite";
import type { Express } from "express";
import type { Server } from "http";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server }
    },
    appType: "custom",
    optimizeDeps: {
      entries: ["./client/index.html"],
    },
    root: process.cwd(),
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // If it's an API request, skip Vite's handling
      if (url.startsWith("/api/")) {
        return next();
      }

      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(process.cwd(), "client/index.html"),
        "utf-8"
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. This should be in sync with 
      // client/src/main.tsx 
      //
      // note that the module path should be relative to the Vite root, not the current file
      const { render } = await vite.ssrLoadModule("/server/entry.tsx");
      
      // 4. render the app HTML
      const appHtml = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--app-html-->`, appHtml);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const publicDir = path.resolve(process.cwd(), "dist/public");
  const indexPath = path.resolve(publicDir, "index.html");

  app.use(
    (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith("/api")) {
        return next();
      }

      // Check if file exists in public directory
      const filePath = path.resolve(publicDir, req.path.substring(1));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }

      // Serve index.html for all other routes
      res.sendFile(indexPath);
    }
  );
}