import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  company: true,
  isAdmin: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  shortDescription: true,
  price: true,
  imageUrl: true,
  category: true,
  isPopular: true,
  isBestSeller: true,
  isNew: true,
});

// License types schema
export const licenseTypes = pgTable("license_types", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  maxUsers: integer("max_users").default(1),
});

export const insertLicenseTypeSchema = createInsertSchema(licenseTypes).pick({
  productId: true,
  name: true,
  description: true,
  price: true,
  maxUsers: true,
});

// License keys schema
export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  licenseTypeId: integer("license_type_id").notNull().references(() => licenseTypes.id),
  licenseKey: text("license_key").notNull().unique(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLicenseSchema = createInsertSchema(licenses).pick({
  userId: true,
  productId: true,
  licenseTypeId: true,
  licenseKey: true,
  isActive: true,
  expiresAt: true,
});

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  status: true,
}).extend({
  // Ensure status is always provided, even though it has a default in the table schema
  status: z.string().default("pending")
});

// Order items schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  licenseTypeId: integer("license_type_id").notNull().references(() => licenseTypes.id),
  quantity: integer("quantity").notNull().default(1),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  licenseTypeId: true,
  quantity: true,
  price: true,
}).extend({
  // Ensure quantity is always provided, even though it has a default in the table schema
  quantity: z.number().default(1)
});

// Cart items schema (for in-memory storage)
export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.number(),
  product: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    category: z.string(),
    isPopular: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isNew: z.boolean().optional(),
  }),
  licenseTypeId: z.number(),
  licenseType: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    maxUsers: z.number().optional(),
  }),
  quantity: z.number(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type LicenseType = typeof licenseTypes.$inferSelect;
export type InsertLicenseType = z.infer<typeof insertLicenseTypeSchema>;

export type License = typeof licenses.$inferSelect;
export type InsertLicense = z.infer<typeof insertLicenseSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;
