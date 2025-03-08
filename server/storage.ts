import { products, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Blue Dream",
        brand: "GreenLeaf",
        type: "hybrid",
        thcContent: "18%",
        cbdContent: "0.5%",
        description: "A sweet and relaxing hybrid strain perfect for daytime use",
        imageUrl: "https://images.unsplash.com/photo-1503262028195-93c528f03218",
        effects: ["relaxed", "happy", "euphoric"],
        flavors: ["berry", "sweet", "herbal"],
      },
      {
        name: "OG Kush",
        brand: "PureCanna",
        type: "indica",
        thcContent: "23%",
        cbdContent: "0.3%",
        description: "Classic indica strain with powerful relaxing effects",
        imageUrl: "https://images.unsplash.com/photo-1518292806887-e50c8ca5a844",
        effects: ["relaxed", "sleepy", "hungry"],
        flavors: ["earthy", "pine", "woody"],
      },
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase().trim();
    return Array.from(this.products.values()).filter(product => {
      // Search across all relevant text fields
      const searchableFields = [
        product.name,
        product.brand,
        product.type,
        product.description,
        ...product.effects,
        ...product.flavors
      ].map(field => field.toLowerCase());

      // Return true if any field contains the search query
      return searchableFields.some(field => field.includes(lowercaseQuery));
    });
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
}

export const storage = new MemStorage();