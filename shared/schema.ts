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

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  userName: text("user_name").notNull(),
  createdAt: text("created_at").notNull(),
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

export const insertReviewSchema = createInsertSchema(reviews)
  .pick({
    productId: true,
    rating: true,
    comment: true,
    userName: true,
  })
  .extend({
    rating: z.number().min(1).max(5),
    comment: z.string().min(1, "Comment is required"),
    userName: z.string().min(1, "Name is required"),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;