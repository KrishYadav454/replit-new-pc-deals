import { 
  User, InsertUser, 
  Product, InsertProduct, 
  LicenseType, InsertLicenseType,
  License, InsertLicense,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  CartItem
} from "@shared/schema";
import crypto from 'crypto';

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>; // Added for admin
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>; // Added for admin
  deleteProduct(id: number): Promise<boolean>; // Added for admin
  
  // License Type operations
  getLicenseTypes(productId: number): Promise<LicenseType[]>;
  getLicenseType(id: number): Promise<LicenseType | undefined>;
  createLicenseType(licenseType: InsertLicenseType): Promise<LicenseType>;
  updateLicenseType(id: number, licenseType: Partial<LicenseType>): Promise<LicenseType>; // Added for admin
  deleteLicenseType(id: number): Promise<boolean>; // Added for admin
  
  // License operations
  getLicenses(userId: number): Promise<License[]>;
  getLicensesByStatus(userId: number, isActive: boolean): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;
  getLicenseByKey(licenseKey: string): Promise<License | undefined>;
  createLicense(license: InsertLicense): Promise<License>;
  generateLicenseKey(productId: number, licenseTypeId: number): string;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>; // Added for admin
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Order Item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Category operations (for admin)
  getCategories(): Promise<string[]>;
  createCategory(name: string): Promise<string>;
  deleteCategory(name: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private licenseTypes: Map<number, LicenseType>;
  private licenses: Map<number, License>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private categories: Set<string>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private licenseTypeIdCounter: number;
  private licenseIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.licenseTypes = new Map();
    this.licenses = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.categories = new Set();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.licenseTypeIdCounter = 1;
    this.licenseIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    
    // Initialize with some sample data
    this.initSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      id,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      company: userData.company || null,
      isAdmin: userData.isAdmin || false,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isPopular || product.isBestSeller || product.isNew
    );
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = { 
      id,
      name: productData.name,
      description: productData.description,
      shortDescription: productData.shortDescription,
      price: productData.price,
      imageUrl: productData.imageUrl,
      category: productData.category,
      isPopular: productData.isPopular || false,
      isBestSeller: productData.isBestSeller || false,
      isNew: productData.isNew || false,
      createdAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  // License Type operations
  async getLicenseTypes(productId: number): Promise<LicenseType[]> {
    return Array.from(this.licenseTypes.values()).filter(
      (licenseType) => licenseType.productId === productId
    );
  }
  
  async getLicenseType(id: number): Promise<LicenseType | undefined> {
    return this.licenseTypes.get(id);
  }
  
  async createLicenseType(licenseTypeData: InsertLicenseType): Promise<LicenseType> {
    const id = this.licenseTypeIdCounter++;
    const licenseType: LicenseType = { 
      id,
      name: licenseTypeData.name,
      description: licenseTypeData.description,
      price: licenseTypeData.price,
      productId: licenseTypeData.productId,
      maxUsers: licenseTypeData.maxUsers ?? 1
    };
    this.licenseTypes.set(id, licenseType);
    return licenseType;
  }
  
  // License operations
  async getLicenses(userId: number): Promise<License[]> {
    return Array.from(this.licenses.values()).filter(
      (license) => license.userId === userId
    );
  }
  
  async getLicensesByStatus(userId: number, isActive: boolean): Promise<License[]> {
    return Array.from(this.licenses.values()).filter(
      (license) => license.userId === userId && license.isActive === isActive
    );
  }
  
  async getLicense(id: number): Promise<License | undefined> {
    return this.licenses.get(id);
  }
  
  async getLicenseByKey(licenseKey: string): Promise<License | undefined> {
    return Array.from(this.licenses.values()).find(
      (license) => license.licenseKey === licenseKey
    );
  }
  
  async createLicense(licenseData: InsertLicense): Promise<License> {
    const id = this.licenseIdCounter++;
    const now = new Date();
    const license: License = { 
      id, 
      userId: licenseData.userId,
      productId: licenseData.productId,
      licenseTypeId: licenseData.licenseTypeId,
      licenseKey: licenseData.licenseKey,
      isActive: licenseData.isActive ?? true,
      expiresAt: licenseData.expiresAt ?? null,
      createdAt: now 
    };
    this.licenses.set(id, license);
    return license;
  }
  
  generateLicenseKey(productId: number, licenseTypeId: number): string {
    const product = this.products.get(productId);
    const licenseType = this.licenseTypes.get(licenseTypeId);
    
    if (!product || !licenseType) {
      throw new Error('Product or license type not found');
    }
    
    // Generate a prefix based on the product name and license type
    const productPrefix = product.name.substring(0, 4).toUpperCase();
    const maxUsers = licenseType.maxUsers ?? 1;
    const typePrefix = maxUsers > 1 ? `TEAM${maxUsers}` : 'XXXX';
    
    // Generate random segments for the license key
    const segments = Array.from({ length: 3 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    
    // Combine everything into a license key format
    return `${productPrefix}-${typePrefix}-${segments.join('-')}`;
  }
  
  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    // Ensure status is set to a default value if not provided
    const status = orderData.status || "pending";
    const order: Order = { 
      ...orderData, 
      id, 
      createdAt: now,
      status // Explicitly set status to ensure it's not undefined
    };
    this.orders.set(id, order);
    return order;
  }
  
  // Order Item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (orderItem) => orderItem.orderId === orderId
    );
  }
  
  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    // Ensure quantity is set to a default value if not provided
    const quantity = orderItemData.quantity || 1;
    const orderItem: OrderItem = { 
      ...orderItemData, 
      id,
      quantity // Explicitly set quantity to ensure it's not undefined
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Admin methods for users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Admin methods for products
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const product = this.products.get(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Admin methods for license types
  async updateLicenseType(id: number, licenseTypeData: Partial<LicenseType>): Promise<LicenseType> {
    const licenseType = this.licenseTypes.get(id);
    if (!licenseType) {
      throw new Error('License type not found');
    }
    
    const updatedLicenseType = { ...licenseType, ...licenseTypeData };
    this.licenseTypes.set(id, updatedLicenseType);
    return updatedLicenseType;
  }
  
  async deleteLicenseType(id: number): Promise<boolean> {
    return this.licenseTypes.delete(id);
  }
  
  // Admin methods for orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  // Admin methods for categories
  async getCategories(): Promise<string[]> {
    // Get unique categories from products
    const categories = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  }
  
  async createCategory(name: string): Promise<string> {
    this.categories.add(name);
    return name;
  }
  
  async deleteCategory(name: string): Promise<boolean> {
    return this.categories.delete(name);
  }
  
  // Initialize with sample data
  private initSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This would be hashed in real implementation
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      company: "License Marketplace Inc.",
      isAdmin: true,
    });
    
    // Create regular user
    this.createUser({
      username: "user",
      password: "user123", // This would be hashed in real implementation
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User",
      company: "Customer Company",
      isAdmin: false,
    });
    
    // Initialize categories
    const categories = [
      "Development Tools", 
      "Database Software", 
      "Cloud & DevOps", 
      "Security Tools",
      "Business Software"
    ];
    
    categories.forEach(category => this.categories.add(category));
    
    // Create products
    const devSuitePro = this.createProduct({
      name: "Developer Suite Pro",
      description: "Complete development toolkit with IDE, debugging tools, and advanced code completion. The Developer Suite Pro provides everything you need for professional software development across multiple platforms. This license includes 1 year of updates and priority technical support.",
      shortDescription: "Complete development toolkit with IDE, debugging tools, and advanced code completion.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44",
      category: "Development Tools",
      isPopular: false,
      isBestSeller: true,
      isNew: false,
    });
    
    const sqlDatabaseManager = this.createProduct({
      name: "SQL Database Manager",
      description: "Powerful database management tool with visual query builder and performance analytics. Easily manage your database schemas, run optimized queries, and monitor performance metrics.",
      shortDescription: "Powerful database management tool with visual query builder and performance analytics.",
      price: 79.99,
      imageUrl: "https://images.unsplash.com/photo-1591017403725-fc69ef973fb7",
      category: "Database Software",
      isPopular: true,
      isBestSeller: false,
      isNew: false,
    });
    
    const cloudDeploymentSuite = this.createProduct({
      name: "Cloud Deployment Suite",
      description: "Simplified cloud infrastructure management with integrated CI/CD pipelines and monitoring. Deploy applications to multiple cloud providers with ease and monitor performance in real-time.",
      shortDescription: "Simplified cloud infrastructure management with integrated CI/CD pipelines and monitoring.",
      price: 129.99,
      imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
      category: "Cloud & DevOps",
      isPopular: false,
      isBestSeller: false,
      isNew: true,
    });
    
    // Create license types
    this.createLicenseType({
      productId: 1,
      name: "Single User",
      description: "For individual developers",
      price: 89.99,
      maxUsers: 1,
    });
    
    this.createLicenseType({
      productId: 1,
      name: "Team License",
      description: "For teams up to 5 developers",
      price: 299.99,
      maxUsers: 5,
    });
    
    this.createLicenseType({
      productId: 2,
      name: "Single User",
      description: "For individual database administrators",
      price: 79.99,
      maxUsers: 1,
    });
    
    this.createLicenseType({
      productId: 2,
      name: "Team License",
      description: "For teams up to 5 database administrators",
      price: 199.99,
      maxUsers: 5,
    });
    
    this.createLicenseType({
      productId: 3,
      name: "Single User",
      description: "For individual DevOps engineers",
      price: 129.99,
      maxUsers: 1,
    });
    
    this.createLicenseType({
      productId: 3,
      name: "Team License",
      description: "For teams up to 5 DevOps engineers",
      price: 499.99,
      maxUsers: 5,
    });
  }
}

export const storage = new MemStorage();
