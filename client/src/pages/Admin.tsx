import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  BarChart4, 
  Package, 
  Tags, 
  ShieldCheck, 
  Users, 
  ShoppingCart,
  PlusCircle,
  Pencil,
  Trash,
} from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Product, InsertProduct, LicenseType, InsertLicenseType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");

  // Get initial tab from URL if present
  useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['products', 'categories', 'license-types', 'users', 'orders', 'analytics'].includes(hash)) {
      setActiveTab(hash);
    }
  });

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/">
          <Button variant="outline">Back to Site</Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="license-types" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            License Types
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="license-types">
          <LicenseTypesTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsTab() {
  const { toast } = useToast();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Fetch products
  const { data: products = [] as Product[], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: InsertProduct) => {
      return apiRequest('POST', '/api/admin/products', newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: Product) => {
      return apiRequest('PUT', `/api/admin/products/${updatedProduct.id}`, updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setProductToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return apiRequest('DELETE', `/api/admin/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Form handler for adding a product
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: InsertProduct = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      isPopular: formData.get('isPopular') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
      isNew: formData.get('isNew') === 'on',
    };

    addProductMutation.mutate(newProduct);
  };

  // Form handler for editing a product
  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productToEdit) return;
    
    const formData = new FormData(e.currentTarget);
    
    const updatedProduct: Product = {
      ...productToEdit,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      isPopular: formData.get('isPopular') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
      isNew: formData.get('isNew') === 'on',
    };

    updateProductMutation.mutate(updatedProduct);
  };

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your software products</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new software product to sell on your marketplace
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" name="shortDescription" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" required />
                </div>
              </div>
              <div className="space-y-2 flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Input id="isPopular" name="isPopular" type="checkbox" className="w-4 h-4" />
                  <Label htmlFor="isPopular">Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input id="isBestSeller" name="isBestSeller" type="checkbox" className="w-4 h-4" />
                  <Label htmlFor="isBestSeller">Best Seller</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input id="isNew" name="isNew" type="checkbox" className="w-4 h-4" />
                  <Label htmlFor="isNew">New</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {product.isPopular && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Popular</span>}
                    {product.isBestSeller && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Best Seller</span>}
                    {product.isNew && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={!!productToEdit && productToEdit.id === product.id} onOpenChange={(open) => !open && setProductToEdit(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setProductToEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {productToEdit && productToEdit.id === product.id && (
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Update product information
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input id="edit-name" name="name" defaultValue={productToEdit.name} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Input id="edit-category" name="category" defaultValue={productToEdit.category} required />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-shortDescription">Short Description</Label>
                              <Input id="edit-shortDescription" name="shortDescription" defaultValue={productToEdit.shortDescription} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Full Description</Label>
                              <Input id="edit-description" name="description" defaultValue={productToEdit.description} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input id="edit-price" name="price" type="number" step="0.01" min="0" defaultValue={productToEdit.price} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-imageUrl">Image URL</Label>
                                <Input id="edit-imageUrl" name="imageUrl" defaultValue={productToEdit.imageUrl} required />
                              </div>
                            </div>
                            <div className="space-y-2 flex items-center gap-6">
                              <div className="flex items-center space-x-2">
                                <Input id="edit-isPopular" name="isPopular" type="checkbox" className="w-4 h-4" defaultChecked={productToEdit.isPopular || false} />
                                <Label htmlFor="edit-isPopular">Popular</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input id="edit-isBestSeller" name="isBestSeller" type="checkbox" className="w-4 h-4" defaultChecked={productToEdit.isBestSeller || false} />
                                <Label htmlFor="edit-isBestSeller">Best Seller</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input id="edit-isNew" name="isNew" type="checkbox" className="w-4 h-4" defaultChecked={productToEdit.isNew || false} />
                                <Label htmlFor="edit-isNew">New</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={updateProductMutation.isPending}>
                                {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      )}
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {product.name}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategoriesTab() {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  
  // Example categories - this would come from the API in a real implementation
  const [categories, setCategories] = useState([
    "Developer Tools", 
    "Database Software", 
    "Cloud & DevOps", 
    "Security Tools",
    "Business Software"
  ]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would be an API call
    setCategories([...categories, newCategory]);
    setNewCategory("");
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleDeleteCategory = (category: string) => {
    // In a real implementation, this would be an API call
    setCategories(categories.filter(c => c !== category));
    
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Manage product categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <Input 
            placeholder="New category name" 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{category}" category. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LicenseTypesTab() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [licenseTypeToEdit, setLicenseTypeToEdit] = useState<LicenseType | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Fetch products for the product dropdown
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest<Product[]>('/api/products'),
  });

  // Fetch license types for the selected product
  const { data: licenseTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/products', selectedProductId, 'license-types'],
    queryFn: () => selectedProductId 
      ? apiRequest<LicenseType[]>(`/api/products/${selectedProductId}/license-types`)
      : Promise.resolve([]),
    enabled: !!selectedProductId,
  });

  // Add license type mutation
  const addLicenseTypeMutation = useMutation({
    mutationFn: async (newLicenseType: InsertLicenseType) => {
      return apiRequest<LicenseType>('/api/license-types', {
        method: 'POST',
        body: JSON.stringify(newLicenseType),
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "License type added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add license type",
        variant: "destructive",
      });
    },
  });

  // Update license type mutation
  const updateLicenseTypeMutation = useMutation({
    mutationFn: async (updatedLicenseType: LicenseType) => {
      return apiRequest<LicenseType>(`/api/license-types/${updatedLicenseType.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedLicenseType),
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "License type updated successfully",
      });
      setLicenseTypeToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update license type",
        variant: "destructive",
      });
    },
  });

  // Delete license type mutation
  const deleteLicenseTypeMutation = useMutation({
    mutationFn: async (licenseTypeId: number) => {
      return apiRequest(`/api/license-types/${licenseTypeId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "License type deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete license type",
        variant: "destructive",
      });
    },
  });

  // Form handler for adding a license type
  const handleAddLicenseType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    const formData = new FormData(e.currentTarget);
    
    const newLicenseType: InsertLicenseType = {
      productId: selectedProductId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      maxUsers: parseInt(formData.get('maxUsers') as string, 10) || null,
    };

    addLicenseTypeMutation.mutate(newLicenseType);
  };

  // Form handler for editing a license type
  const handleEditLicenseType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!licenseTypeToEdit) return;
    
    const formData = new FormData(e.currentTarget);
    
    const updatedLicenseType: LicenseType = {
      ...licenseTypeToEdit,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      maxUsers: parseInt(formData.get('maxUsers') as string, 10) || null,
    };

    updateLicenseTypeMutation.mutate(updatedLicenseType);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>License Types</CardTitle>
          <CardDescription>Manage license types for your products</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1 max-w-sm">
              <Label htmlFor="product-select">Select Product</Label>
              <select
                id="product-select"
                className="w-full border border-gray-300 rounded-md p-2"
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                value={selectedProductId || ""}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={!selectedProductId}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add License Type
            </Button>
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New License Type</DialogTitle>
              <DialogDescription>
                Create a new license type for the selected product
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLicenseType} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">License Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Max Users (optional)</Label>
                  <Input id="maxUsers" name="maxUsers" type="number" min="1" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addLicenseTypeMutation.isPending}>
                  {addLicenseTypeMutation.isPending ? "Adding..." : "Add License Type"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {selectedProductId ? (
          isLoading ? (
            <div>Loading license types...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Max Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenseTypes.map((licenseType) => (
                  <TableRow key={licenseType.id}>
                    <TableCell>{licenseType.id}</TableCell>
                    <TableCell>{licenseType.name}</TableCell>
                    <TableCell>{licenseType.description}</TableCell>
                    <TableCell>${licenseType.price.toFixed(2)}</TableCell>
                    <TableCell>{licenseType.maxUsers || 'Unlimited'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog open={!!licenseTypeToEdit && licenseTypeToEdit.id === licenseType.id} onOpenChange={(open) => !open && setLicenseTypeToEdit(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setLicenseTypeToEdit(licenseType)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {licenseTypeToEdit && licenseTypeToEdit.id === licenseType.id && (
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit License Type</DialogTitle>
                                <DialogDescription>
                                  Update license type information
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditLicenseType} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">License Name</Label>
                                  <Input id="edit-name" name="name" defaultValue={licenseTypeToEdit.name} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Input id="edit-description" name="description" defaultValue={licenseTypeToEdit.description} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-price">Price ($)</Label>
                                    <Input id="edit-price" name="price" type="number" step="0.01" min="0" defaultValue={licenseTypeToEdit.price} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-maxUsers">Max Users (optional)</Label>
                                    <Input id="edit-maxUsers" name="maxUsers" type="number" min="1" defaultValue={licenseTypeToEdit.maxUsers || ""} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" disabled={updateLicenseTypeMutation.isPending}>
                                    {updateLicenseTypeMutation.isPending ? "Saving..." : "Save Changes"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          )}
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the {licenseType.name} license type. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteLicenseTypeMutation.mutate(licenseType.id)}
                                disabled={deleteLicenseTypeMutation.isPending}
                              >
                                {deleteLicenseTypeMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {licenseTypes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No license types found for this product. Add your first license type to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a product to manage its license types
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab() {
  // Mock data - in a real application this would come from an API call
  const users = [
    { id: 1, username: "johndoe", email: "john@example.com", role: "admin", createdAt: "2023-01-01" },
    { id: 2, username: "janedoe", email: "jane@example.com", role: "customer", createdAt: "2023-01-15" },
    { id: 3, username: "bobsmith", email: "bob@example.com", role: "customer", createdAt: "2023-02-10" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrdersTab() {
  // Mock order data - would come from API in real implementation
  const orders = [
    { id: 1, userId: 2, total: 99.99, status: "completed", items: 2, createdAt: "2023-03-15" },
    { id: 2, userId: 3, total: 149.99, status: "processing", items: 1, createdAt: "2023-03-20" },
    { id: 3, userId: 2, total: 49.99, status: "completed", items: 1, createdAt: "2023-04-05" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  // This would be real data from an API in a production application
  const salesByMonth = [
    { month: "Jan", sales: 4500 },
    { month: "Feb", sales: 5200 },
    { month: "Mar", sales: 7800 },
    { month: "Apr", sales: 6300 },
    { month: "May", sales: 9100 },
    { month: "Jun", sales: 8400 },
  ];

  const productPerformance = [
    { name: "Developer Suite Pro", sales: 125, revenue: 12375 },
    { name: "Database Manager Enterprise", sales: 90, revenue: 13500 },
    { name: "Cloud DevOps Toolkit", sales: 75, revenue: 7425 },
    { name: "Security Shield Premium", sales: 60, revenue: 5940 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>View your sales performance over time</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full h-60 flex items-center justify-center text-center text-gray-500">
            [Sales Chart Visualization Would Appear Here]
            <br />
            This would be implemented with Recharts in a production app
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPerformance.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-primary">$39,240</div>
                <div className="text-sm text-green-600">+12% from last month</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-secondary">350</div>
                <div className="text-sm text-green-600">+8% from last month</div>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Active Licenses</div>
                <div className="text-2xl font-bold text-amber-600">752</div>
                <div className="text-sm text-green-600">+15% from last month</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="text-sm text-gray-600">New Customers</div>
                <div className="text-2xl font-bold text-purple-600">48</div>
                <div className="text-sm text-green-600">+5% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}