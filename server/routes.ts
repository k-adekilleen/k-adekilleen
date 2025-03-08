import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    const query = req.query.q as string | undefined;
    console.log("Search query received:", query); // Add debugging
    const products = query 
      ? await storage.searchProducts(query)
      : await storage.getAllProducts();
    console.log("Found products:", products.length); // Add debugging
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    try {
      const product = insertProductSchema.parse(req.body);
      const created = await storage.createProduct(product);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  return createServer(app);
}