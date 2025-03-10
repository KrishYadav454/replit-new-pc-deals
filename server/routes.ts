import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertProductSchema,
  insertLicenseTypeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes with /api prefix
  
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get featured products
  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  // Get products by category
  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  
  // Get a single product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Get license types for a product
  app.get("/api/products/:id/license-types", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const licenseTypes = await storage.getLicenseTypes(productId);
      res.json(licenseTypes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch license types" });
    }
  });
  
  // Register a new user
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with the same email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if user with the same username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // In a real app, we would hash the password here
      const user = await storage.createUser(userData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // User login
  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would use sessions or JWT here
      // For now, just return the user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Get user licenses
  app.get("/api/users/:id/licenses", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const licenses = await storage.getLicenses(userId);
      
      // Enhance the license data with product and license type info
      const enhancedLicenses = await Promise.all(licenses.map(async (license) => {
        const product = await storage.getProduct(license.productId);
        const licenseType = await storage.getLicenseType(license.licenseTypeId);
        return {
          ...license,
          product,
          licenseType
        };
      }));
      
      res.json(enhancedLicenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });
  
  // Get active licenses for a user
  app.get("/api/users/:id/licenses/active", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const licenses = await storage.getLicensesByStatus(userId, true);
      
      // Enhance the license data with product and license type info
      const enhancedLicenses = await Promise.all(licenses.map(async (license) => {
        const product = await storage.getProduct(license.productId);
        const licenseType = await storage.getLicenseType(license.licenseTypeId);
        return {
          ...license,
          product,
          licenseType
        };
      }));
      
      res.json(enhancedLicenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch active licenses" });
    }
  });
  
  // Create a new order (checkout)
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { order, items } = z.object({
        order: insertOrderSchema,
        items: z.array(z.object({
          productId: z.number(),
          licenseTypeId: z.number(),
          quantity: z.number().default(1),
        }))
      }).parse(req.body);
      
      // Create the order
      const createdOrder = await storage.createOrder(order);
      
      // Create order items and generate licenses
      const orderItems = [];
      const licenses = [];
      
      for (const item of items) {
        // Get product and license type to get the correct price
        const product = await storage.getProduct(item.productId);
        const licenseType = await storage.getLicenseType(item.licenseTypeId);
        
        if (!product || !licenseType) {
          return res.status(400).json({ 
            message: "Invalid product or license type",
            productId: item.productId,
            licenseTypeId: item.licenseTypeId
          });
        }
        
        // Create order item
        const orderItem = await storage.createOrderItem({
          orderId: createdOrder.id,
          productId: item.productId,
          licenseTypeId: item.licenseTypeId,
          quantity: item.quantity,
          price: licenseType.price,
        });
        
        orderItems.push(orderItem);
        
        // Generate license key and create license
        const licenseKey = storage.generateLicenseKey(item.productId, item.licenseTypeId);
        
        // Set expiration date to 1 year from now
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        
        const license = await storage.createLicense({
          userId: order.userId,
          productId: item.productId,
          licenseTypeId: item.licenseTypeId,
          licenseKey,
          isActive: true,
          expiresAt,
        });
        
        licenses.push({
          ...license,
          product,
          licenseType
        });
      }
      
      res.status(201).json({
        order: createdOrder,
        orderItems,
        licenses
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Get user orders
  app.get("/api/users/:id/orders", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getOrders(userId);
      
      // Enhance the order data with order items
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        
        // Enhance each order item with product and license type info
        const enhancedItems = await Promise.all(items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          const licenseType = await storage.getLicenseType(item.licenseTypeId);
          return {
            ...item,
            product,
            licenseType
          };
        }));
        
        return {
          ...order,
          items: enhancedItems
        };
      }));
      
      res.json(enhancedOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // ===== ADMIN API ENDPOINTS =====
  
  // Get all users (admin)
  app.get("/api/admin/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      
      // Don't return passwords in the response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Get all orders (admin)
  app.get("/api/admin/orders", async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      
      // Enhance the order data with order items
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        
        // Enhance each order item with product and license type info
        const enhancedItems = await Promise.all(items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          const licenseType = await storage.getLicenseType(item.licenseTypeId);
          return {
            ...item,
            product,
            licenseType
          };
        }));
        
        return {
          ...order,
          items: enhancedItems
        };
      }));
      
      res.json(enhancedOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  // Create a new product (admin)
  app.post("/api/admin/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  // Update a product (admin)
  app.put("/api/admin/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productData = req.body;
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  // Delete a product (admin)
  app.delete("/api/admin/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Create a new license type (admin)
  app.post("/api/admin/license-types", async (req: Request, res: Response) => {
    try {
      const licenseTypeData = insertLicenseTypeSchema.parse(req.body);
      const licenseType = await storage.createLicenseType(licenseTypeData);
      res.status(201).json(licenseType);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license type data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create license type" });
    }
  });
  
  // Update a license type (admin)
  app.put("/api/admin/license-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid license type ID" });
      }
      
      const licenseTypeData = req.body;
      const licenseType = await storage.updateLicenseType(id, licenseTypeData);
      res.json(licenseType);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update license type" });
    }
  });
  
  // Delete a license type (admin)
  app.delete("/api/admin/license-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid license type ID" });
      }
      
      const success = await storage.deleteLicenseType(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "License type not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete license type" });
    }
  });
  
  // Get all categories (admin)
  app.get("/api/admin/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Create a new category (admin)
  app.post("/api/admin/categories", async (req: Request, res: Response) => {
    try {
      const { name } = z.object({ name: z.string() }).parse(req.body);
      const category = await storage.createCategory(name);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  // Delete a category (admin)
  app.delete("/api/admin/categories/:name", async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const success = await storage.deleteCategory(name);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
