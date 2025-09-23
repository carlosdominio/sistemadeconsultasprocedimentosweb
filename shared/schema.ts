import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const providers = pgTable("providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  image: text("image"),
});

export const clientProcedures = pgTable("client_procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  procedureText: text("procedure_text").notNull(),
});

export const providerProcedures = pgTable("provider_procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  sinistroType: text("sinistro_type").notNull(),
  procedureText: text("procedure_text").notNull(),
});

export const additionalProviderProcedures = pgTable("additional_provider_procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  sinistroType: text("sinistro_type").notNull(),
  procedureText: text("procedure_text").notNull(),
});

// Insert schemas
export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertProviderSchema = createInsertSchema(providers).omit({ id: true });
export const insertClientProcedureSchema = createInsertSchema(clientProcedures).omit({ id: true });
export const insertProviderProcedureSchema = createInsertSchema(providerProcedures).omit({ id: true });
export const insertAdditionalProviderProcedureSchema = createInsertSchema(additionalProviderProcedures).omit({ id: true });

// Types
export type Client = typeof clients.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type ClientProcedure = typeof clientProcedures.$inferSelect;
export type ProviderProcedure = typeof providerProcedures.$inferSelect;
export type AdditionalProviderProcedure = typeof additionalProviderProcedures.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type InsertClientProcedure = z.infer<typeof insertClientProcedureSchema>;
export type InsertProviderProcedure = z.infer<typeof insertProviderProcedureSchema>;
export type InsertAdditionalProviderProcedure = z.infer<typeof insertAdditionalProviderProcedureSchema>;

export const sinistroTypes = [
  { value: "acidentes", label: "Acidentes" },
  { value: "avarias", label: "Avarias" },
  { value: "roubo", label: "Roubo - Brasil" },
  { value: "exclusoes", label: "Exclusões" }
] as const;

export type SinistroType = typeof sinistroTypes[number]["value"];
