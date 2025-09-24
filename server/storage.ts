import { 
  type Client, 
  type Provider, 
  type ClientProcedure, 
  type ProviderProcedure, 
  type AdditionalProviderProcedure,
  type InsertClient, 
  type InsertProvider, 
  type InsertClientProcedure, 
  type InsertProviderProcedure, 
  type InsertAdditionalProviderProcedure,
  clients,
  providers,
  clientProcedures,
  providerProcedures,
  additionalProviderProcedures
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Providers
  getProviders(): Promise<Provider[]>;
  getProvider(id: string): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  updateProvider(id: string, provider: Partial<InsertProvider>): Promise<Provider | undefined>;
  deleteProvider(id: string): Promise<boolean>;

  // Client Procedures
  getClientProcedures(clientId: string): Promise<ClientProcedure[]>;
  createClientProcedure(procedure: InsertClientProcedure): Promise<ClientProcedure>;
  updateClientProcedure(id: string, procedure: Partial<InsertClientProcedure>): Promise<ClientProcedure | undefined>;
  deleteClientProcedure(id: string): Promise<boolean>;

  // Provider Procedures
  getProviderProcedures(providerId: string, sinistroType: string): Promise<ProviderProcedure[]>;
  createProviderProcedure(procedure: InsertProviderProcedure): Promise<ProviderProcedure>;
  updateProviderProcedure(id: string, procedure: Partial<InsertProviderProcedure>): Promise<ProviderProcedure | undefined>;
  deleteProviderProcedure(id: string): Promise<boolean>;

  // Additional Provider Procedures
  getAdditionalProviderProcedures(providerId: string, sinistroType: string): Promise<AdditionalProviderProcedure[]>;
  createAdditionalProviderProcedure(procedure: InsertAdditionalProviderProcedure): Promise<AdditionalProviderProcedure>;
  updateAdditionalProviderProcedure(id: string, procedure: Partial<InsertAdditionalProviderProcedure>): Promise<AdditionalProviderProcedure | undefined>;
  deleteAdditionalProviderProcedure(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db.update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  // Providers
  async getProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  async getProvider(id: string): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider || undefined;
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db.insert(providers).values(provider).returning();
    return newProvider;
  }

  async updateProvider(id: string, provider: Partial<InsertProvider>): Promise<Provider | undefined> {
    const [updated] = await db.update(providers)
      .set(provider)
      .where(eq(providers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProvider(id: string): Promise<boolean> {
    const result = await db.delete(providers).where(eq(providers.id, id));
    return result.rowCount > 0;
  }

  // Client Procedures
  async getClientProcedures(clientId: string): Promise<ClientProcedure[]> {
    return await db.select().from(clientProcedures).where(eq(clientProcedures.clientId, clientId));
  }

  async createClientProcedure(procedure: InsertClientProcedure): Promise<ClientProcedure> {
    const [newProcedure] = await db.insert(clientProcedures).values(procedure).returning();
    return newProcedure;
  }

  async updateClientProcedure(id: string, procedure: Partial<InsertClientProcedure>): Promise<ClientProcedure | undefined> {
    const [updated] = await db.update(clientProcedures)
      .set(procedure)
      .where(eq(clientProcedures.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteClientProcedure(id: string): Promise<boolean> {
    const result = await db.delete(clientProcedures).where(eq(clientProcedures.id, id));
    return result.rowCount > 0;
  }

  // Provider Procedures
  async getProviderProcedures(providerId: string, sinistroType: string): Promise<ProviderProcedure[]> {
    return await db.select().from(providerProcedures)
      .where(and(
        eq(providerProcedures.providerId, providerId),
        eq(providerProcedures.sinistroType, sinistroType)
      ));
  }

  async createProviderProcedure(procedure: InsertProviderProcedure): Promise<ProviderProcedure> {
    const [newProcedure] = await db.insert(providerProcedures).values(procedure).returning();
    return newProcedure;
  }

  async updateProviderProcedure(id: string, procedure: Partial<InsertProviderProcedure>): Promise<ProviderProcedure | undefined> {
    const [updated] = await db.update(providerProcedures)
      .set(procedure)
      .where(eq(providerProcedures.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProviderProcedure(id: string): Promise<boolean> {
    const result = await db.delete(providerProcedures).where(eq(providerProcedures.id, id));
    return result.rowCount > 0;
  }

  // Additional Provider Procedures
  async getAdditionalProviderProcedures(providerId: string, sinistroType: string): Promise<AdditionalProviderProcedure[]> {
    return await db.select().from(additionalProviderProcedures)
      .where(and(
        eq(additionalProviderProcedures.providerId, providerId),
        eq(additionalProviderProcedures.sinistroType, sinistroType)
      ));
  }

  async createAdditionalProviderProcedure(procedure: InsertAdditionalProviderProcedure): Promise<AdditionalProviderProcedure> {
    const [newProcedure] = await db.insert(additionalProviderProcedures).values(procedure).returning();
    return newProcedure;
  }

  async updateAdditionalProviderProcedure(id: string, procedure: Partial<InsertAdditionalProviderProcedure>): Promise<AdditionalProviderProcedure | undefined> {
    const [updated] = await db.update(additionalProviderProcedures)
      .set(procedure)
      .where(eq(additionalProviderProcedures.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAdditionalProviderProcedure(id: string): Promise<boolean> {
    const result = await db.delete(additionalProviderProcedures).where(eq(additionalProviderProcedures.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();