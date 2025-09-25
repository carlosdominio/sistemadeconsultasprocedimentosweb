import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertProviderSchema, 
  insertClientProcedureSchema, 
  insertProviderProcedureSchema, 
  insertAdditionalProviderProcedureSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      if (!data.email) {
        data.email = `example_${Date.now()}@example.com`;
      }
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const data = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, data);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const success = await storage.deleteClient(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Provider routes
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ error: "Failed to fetch providers" });
    }
  });

  app.post("/api/providers", async (req, res) => {
    try {
      const data = insertProviderSchema.parse(req.body);
      const provider = await storage.createProvider(data);
      res.status(201).json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid provider data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create provider" });
    }
  });

  app.put("/api/providers/:id", async (req, res) => {
    try {
      const data = insertProviderSchema.partial().parse(req.body);
      const provider = await storage.updateProvider(req.params.id, data);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid provider data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update provider" });
    }
  });

  app.delete("/api/providers/:id", async (req, res) => {
    try {
      const success = await storage.deleteProvider(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete provider" });
    }
  });

  // Client procedure routes
  app.get("/api/clients/:clientId/procedures", async (req, res) => {
    try {
      const procedures = await storage.getClientProcedures(req.params.clientId);
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client procedures" });
    }
  });

  app.post("/api/clients/:clientId/procedures", async (req, res) => {
    try {
      const data = insertClientProcedureSchema.parse({
        ...req.body,
        clientId: req.params.clientId
      });
      const procedure = await storage.createClientProcedure(data);
      res.status(201).json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create procedure" });
    }
  });

  app.put("/api/procedures/:id", async (req, res) => {
    try {
      const data = insertClientProcedureSchema.partial().parse(req.body);
      const procedure = await storage.updateClientProcedure(req.params.id, data);
      if (!procedure) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update procedure" });
    }
  });

  app.delete("/api/procedures/:id", async (req, res) => {
    try {
      const success = await storage.deleteClientProcedure(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Procedure not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete procedure" });
    }
  });

  // Provider procedure routes
  app.get("/api/providers/:providerId/procedures/:sinistroType", async (req, res) => {
    try {
      const procedures = await storage.getProviderProcedures(req.params.providerId, req.params.sinistroType);
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider procedures" });
    }
  });

  app.post("/api/providers/:providerId/procedures", async (req, res) => {
    try {
      const data = insertProviderProcedureSchema.parse({
        ...req.body,
        providerId: req.params.providerId
      });
      const procedure = await storage.createProviderProcedure(data);
      res.status(201).json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create provider procedure" });
    }
  });

  app.put("/api/provider-procedures/:id", async (req, res) => {
    try {
      const data = insertProviderProcedureSchema.partial().parse(req.body);
      const procedure = await storage.updateProviderProcedure(req.params.id, data);
      if (!procedure) {
        return res.status(404).json({ error: "Provider procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update provider procedure" });
    }
  });

  app.delete("/api/provider-procedures/:id", async (req, res) => {
    try {
      const success = await storage.deleteProviderProcedure(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Provider procedure not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete provider procedure" });
    }
  });

  // Additional provider procedure routes
  app.get("/api/providers/:providerId/additional-procedures/:sinistroType", async (req, res) => {
    try {
      const procedures = await storage.getAdditionalProviderProcedures(req.params.providerId, req.params.sinistroType);
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch additional provider procedures" });
    }
  });

  app.post("/api/providers/:providerId/additional-procedures", async (req, res) => {
    try {
      const data = insertAdditionalProviderProcedureSchema.parse({
        ...req.body,
        providerId: req.params.providerId
      });
      const procedure = await storage.createAdditionalProviderProcedure(data);
      res.status(201).json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create additional provider procedure" });
    }
  });

  app.put("/api/additional-provider-procedures/:id", async (req, res) => {
    try {
      const data = insertAdditionalProviderProcedureSchema.partial().parse(req.body);
      const procedure = await storage.updateAdditionalProviderProcedure(req.params.id, data);
      if (!procedure) {
        return res.status(404).json({ error: "Additional provider procedure not found" });
      }
      res.json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid procedure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update additional provider procedure" });
    }
  });

  app.delete("/api/additional-provider-procedures/:id", async (req, res) => {
    try {
      const success = await storage.deleteAdditionalProviderProcedure(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Additional provider procedure not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete additional provider procedure" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
