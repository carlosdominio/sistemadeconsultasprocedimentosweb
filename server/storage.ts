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
  type InsertAdditionalProviderProcedure 
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private clients: Map<string, Client> = new Map();
  private providers: Map<string, Provider> = new Map();
  private clientProcedures: Map<string, ClientProcedure> = new Map();
  private providerProcedures: Map<string, ProviderProcedure> = new Map();
  private additionalProviderProcedures: Map<string, AdditionalProviderProcedure> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    const clientA = { id: randomUUID(), name: "Cliente A" };
    const clientB = { id: randomUUID(), name: "Cliente B" };
    const clientC = { id: randomUUID(), name: "Cliente C" };

    this.clients.set(clientA.id, clientA);
    this.clients.set(clientB.id, clientB);
    this.clients.set(clientC.id, clientC);

    // Client procedures
    const procedures = [
      { id: randomUUID(), clientId: clientA.id, procedureText: "Contato inicial" },
      { id: randomUUID(), clientId: clientA.id, procedureText: "Análise de requisitos" },
      { id: randomUUID(), clientId: clientA.id, procedureText: "Proposta" },
      { id: randomUUID(), clientId: clientB.id, procedureText: "Reunião de briefing" },
      { id: randomUUID(), clientId: clientB.id, procedureText: "Desenvolvimento" },
    ];

    procedures.forEach(proc => this.clientProcedures.set(proc.id, proc));

    // Providers
    const providerX = { id: randomUUID(), name: "Prestador X", image: "" };
    const providerY = { id: randomUUID(), name: "Prestador Y", image: "" };
    
    this.providers.set(providerX.id, providerX);
    this.providers.set(providerY.id, providerY);

    // Provider procedures
    const providerProcs = [
      { id: randomUUID(), providerId: providerX.id, sinistroType: "acidentes", procedureText: "Avaliação de danos" },
      { id: randomUUID(), providerId: providerX.id, sinistroType: "acidentes", procedureText: "Contato com cliente" },
      { id: randomUUID(), providerId: providerY.id, sinistroType: "avarias", procedureText: "Inspeção visual" },
    ];

    providerProcs.forEach(proc => this.providerProcedures.set(proc.id, proc));

    // Additional provider procedures
    const additionalProcs = [
      { id: randomUUID(), providerId: providerX.id, sinistroType: "acidentes", procedureText: "Revisão" },
      { id: randomUUID(), providerId: providerX.id, sinistroType: "acidentes", procedureText: "Aprovação" },
    ];

    additionalProcs.forEach(proc => this.additionalProviderProcedures.set(proc.id, proc));
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = randomUUID();
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...client };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    // Delete associated procedures
    Array.from(this.clientProcedures.entries()).forEach(([procId, proc]) => {
      if (proc.clientId === id) {
        this.clientProcedures.delete(procId);
      }
    });
    return this.clients.delete(id);
  }

  // Providers
  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async getProvider(id: string): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const id = randomUUID();
    const newProvider: Provider = { ...provider, id, image: provider.image || null };
    this.providers.set(id, newProvider);
    return newProvider;
  }

  async updateProvider(id: string, provider: Partial<InsertProvider>): Promise<Provider | undefined> {
    const existing = this.providers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...provider };
    this.providers.set(id, updated);
    return updated;
  }

  async deleteProvider(id: string): Promise<boolean> {
    // Delete associated procedures
    Array.from(this.providerProcedures.entries()).forEach(([procId, proc]) => {
      if (proc.providerId === id) {
        this.providerProcedures.delete(procId);
      }
    });
    Array.from(this.additionalProviderProcedures.entries()).forEach(([procId, proc]) => {
      if (proc.providerId === id) {
        this.additionalProviderProcedures.delete(procId);
      }
    });
    return this.providers.delete(id);
  }

  // Client Procedures
  async getClientProcedures(clientId: string): Promise<ClientProcedure[]> {
    return Array.from(this.clientProcedures.values()).filter(proc => proc.clientId === clientId);
  }

  async createClientProcedure(procedure: InsertClientProcedure): Promise<ClientProcedure> {
    const id = randomUUID();
    const newProcedure: ClientProcedure = { ...procedure, id };
    this.clientProcedures.set(id, newProcedure);
    return newProcedure;
  }

  async updateClientProcedure(id: string, procedure: Partial<InsertClientProcedure>): Promise<ClientProcedure | undefined> {
    const existing = this.clientProcedures.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...procedure };
    this.clientProcedures.set(id, updated);
    return updated;
  }

  async deleteClientProcedure(id: string): Promise<boolean> {
    return this.clientProcedures.delete(id);
  }

  // Provider Procedures
  async getProviderProcedures(providerId: string, sinistroType: string): Promise<ProviderProcedure[]> {
    return Array.from(this.providerProcedures.values())
      .filter(proc => proc.providerId === providerId && proc.sinistroType === sinistroType);
  }

  async createProviderProcedure(procedure: InsertProviderProcedure): Promise<ProviderProcedure> {
    const id = randomUUID();
    const newProcedure: ProviderProcedure = { ...procedure, id };
    this.providerProcedures.set(id, newProcedure);
    return newProcedure;
  }

  async updateProviderProcedure(id: string, procedure: Partial<InsertProviderProcedure>): Promise<ProviderProcedure | undefined> {
    const existing = this.providerProcedures.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...procedure };
    this.providerProcedures.set(id, updated);
    return updated;
  }

  async deleteProviderProcedure(id: string): Promise<boolean> {
    return this.providerProcedures.delete(id);
  }

  // Additional Provider Procedures
  async getAdditionalProviderProcedures(providerId: string, sinistroType: string): Promise<AdditionalProviderProcedure[]> {
    return Array.from(this.additionalProviderProcedures.values())
      .filter(proc => proc.providerId === providerId && proc.sinistroType === sinistroType);
  }

  async createAdditionalProviderProcedure(procedure: InsertAdditionalProviderProcedure): Promise<AdditionalProviderProcedure> {
    const id = randomUUID();
    const newProcedure: AdditionalProviderProcedure = { ...procedure, id };
    this.additionalProviderProcedures.set(id, newProcedure);
    return newProcedure;
  }

  async updateAdditionalProviderProcedure(id: string, procedure: Partial<InsertAdditionalProviderProcedure>): Promise<AdditionalProviderProcedure | undefined> {
    const existing = this.additionalProviderProcedures.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...procedure };
    this.additionalProviderProcedures.set(id, updated);
    return updated;
  }

  async deleteAdditionalProviderProcedure(id: string): Promise<boolean> {
    return this.additionalProviderProcedures.delete(id);
  }
}

export const storage = new MemStorage();
