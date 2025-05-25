import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Handle HTML routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
  
  app.get('/calculators/:calculator', (req, res) => {
    const calculatorFile = path.join(process.cwd(), 'public', 'calculators', `${req.params.calculator}.html`);
    res.sendFile(calculatorFile, (err) => {
      if (err) {
        res.status(404).sendFile(path.join(process.cwd(), 'public', 'index.html'));
      }
    });
  });

  // API routes can be added here if needed
  // prefix all routes with /api

  const httpServer = createServer(app);

  return httpServer;
}
