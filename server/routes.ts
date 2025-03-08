import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProductSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    const query = req.query.q as string | undefined;
    const effects = Array.isArray(req.query.effect) 
      ? req.query.effect as string[]
      : req.query.effect
      ? [req.query.effect as string]
      : [];

    console.log("Search query received:", query); // Add debugging
    console.log("Effects filter:", effects); // Add debugging

    let products = query 
      ? await storage.searchProducts(query)
      : await storage.getAllProducts();

    // Filter by effects if specified
    if (effects.length > 0) {
      products = products.filter(product =>
        effects.every(effect => 
          product.effects.some(e => e.toLowerCase() === effect.toLowerCase())
        )
      );
    }

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

  // Reviews endpoints
  app.get("/api/products/:id/reviews", async (req, res) => {
    const productId = parseInt(req.params.id);
    const reviews = await storage.getProductReviews(productId);
    res.json(reviews);
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      const reviewData = { ...req.body, productId };
      const review = insertReviewSchema.parse(reviewData);
      const created = await storage.createReview(review);

      // Broadcast the new review to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'NEW_REVIEW',
            productId,
            review: created
          }));
        }
      });

      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  const server = createServer(app);

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return server;
}