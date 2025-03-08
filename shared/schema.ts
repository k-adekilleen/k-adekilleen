import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  type: text("type").notNull(), // indica, sativa, hybrid
  thcContent: text("thc_content").notNull(),
  cbdContent: text("cbd_content").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  effects: text("effects").array().notNull(),
  flavors: text("flavors").array().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  brand: true,
  type: true,
  thcContent: true,
  cbdContent: true,
  description: true,
  imageUrl: true,
  effects: true,
  flavors: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
