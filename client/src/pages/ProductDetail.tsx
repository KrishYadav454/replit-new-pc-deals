import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product, LicenseType } from "@shared/schema";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, Check, Star, StarHalf } from "lucide-react";
import { Code, Bug, Languages, Gauge } from "../lib/icons";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedLicenseTypeId, setSelectedLicenseTypeId] = useState<number>(0);
  
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });
  
  const { data: licenseTypes, isLoading: isLoadingLicenseTypes, error: licenseTypesError } = useQuery<LicenseType[]>({
    queryKey: [`/api/products/${id}/license-types`],
    enabled: !!product,
  });
  
  const isLoading = isLoadingProduct || isLoadingLicenseTypes;
  const error = productError || licenseTypesError;

  const handleAddToCart = () => {
    if (!product || !licenseTypes || licenseTypes.length === 0) return;
    
    const selectedLicenseType = licenseTypes.find(lt => lt.id === selectedLicenseTypeId) || licenseTypes[0];
    
    addToCart({
      productId: product.id,
      licenseTypeId: selectedLicenseType.id,
      product,
      licenseType: selectedLicenseType,
      quantity: 1,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedLicenseType.name}) has been added to your cart.`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-200 w-full h-96"></div>
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
        <p className="text-gray-600 mb-6">We couldn't load the product information. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }
  
  // Set the first license type as selected by default if not already set
  if (licenseTypes && licenseTypes.length > 0 && selectedLicenseTypeId === 0) {
    setSelectedLicenseTypeId(licenseTypes[0].id);
  }
  
  // Get the selected license type
  const selectedLicenseType = licenseTypes?.find(lt => lt.id === selectedLicenseTypeId) || licenseTypes?.[0];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Left column: Product images */}
          <div className="flex flex-col-reverse">
            <div className="hidden mt-6 lg:grid grid-cols-4 gap-2">
              <div className="col-span-1 cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-primary">
                <img src={product.imageUrl} alt={`${product.name} thumbnail 1`} className="w-full h-auto" />
              </div>
              <div className="col-span-1 cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-primary">
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713" alt={`${product.name} thumbnail 2`} className="w-full h-auto" />
              </div>
              <div className="col-span-1 cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-primary">
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt={`${product.name} thumbnail 3`} className="w-full h-auto" />
              </div>
              <div className="col-span-1 cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-primary">
                <img src="https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1" alt={`${product.name} thumbnail 4`} className="w-full h-auto" />
              </div>
            </div>
            
            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-center object-cover rounded-lg" 
              />
            </div>
          </div>

          {/* Right column: Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${selectedLicenseType?.price.toFixed(2) || product.price.toFixed(2)}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <StarHalf className="h-5 w-5 fill-current" />
                </div>
                <Button variant="link" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  117 reviews
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-gray-500">In stock and ready for instant delivery</p>
              </div>
            </div>

            {/* License options */}
            {licenseTypes && licenseTypes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">License Type</h3>
                </div>

                <RadioGroup 
                  value={selectedLicenseTypeId.toString()} 
                  onValueChange={(value) => setSelectedLicenseTypeId(parseInt(value))}
                  className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {licenseTypes.map((licenseType) => (
                    <div key={licenseType.id} className="relative">
                      <RadioGroupItem
                        value={licenseType.id.toString()}
                        id={`license-type-${licenseType.id}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`license-type-${licenseType.id}`}
                        className={`relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none ${
                          selectedLicenseTypeId === licenseType.id ? 'border-primary' : ''
                        }`}
                      >
                        <div className="flex-1 flex">
                          <div className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900">{licenseType.name}</span>
                            <span className="mt-1 flex items-center text-sm text-gray-500">{licenseType.description}</span>
                            <span className="mt-6 text-sm font-medium text-gray-900">${licenseType.price.toFixed(2)}</span>
                          </div>
                        </div>
                        {selectedLicenseTypeId === licenseType.id && (
                          <div className="absolute -inset-px rounded-lg border-2 pointer-events-none border-primary" aria-hidden="true"></div>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="mt-10 flex sm:flex-col1">
              <Button 
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button variant="ghost" size="icon" className="ml-4 p-3 rounded-md">
                <Heart className="h-6 w-6" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>

            {/* License features */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul className="pl-4 list-disc space-y-2 text-sm text-gray-600">
                  <li>Advanced code completion and suggestion</li>
                  <li>Integrated debugging and testing tools</li>
                  <li>Multi-language support with syntax highlighting</li>
                  <li>Performance profiling and optimization</li>
                  <li>Git integration and version control</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab sections for more information */}
        <div className="max-w-2xl mx-auto mt-16 sm:mt-24 lg:max-w-none">
          <Tabs defaultValue="features">
            <TabsList className="border-b border-gray-200 w-full justify-start space-x-8">
              <TabsTrigger 
                value="features"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-1 font-medium text-sm"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="requirements"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-1 font-medium text-sm"
              >
                System Requirements
              </TabsTrigger>
              <TabsTrigger 
                value="license"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-1 font-medium text-sm"
              >
                License Details
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-4 px-1 font-medium text-sm"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="pt-10 lg:pt-12">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <FeatureItem
                    icon={Code}
                    title="Intelligent Code Completion"
                    description="Smart code suggestions that understand your project context and code patterns to increase productivity."
                  />
                  
                  <FeatureItem
                    icon={Bug}
                    title="Advanced Debugging"
                    description="Set breakpoints, inspect variables, and step through code execution with our powerful debugging suite."
                  />
                  
                  <FeatureItem
                    icon={Languages}
                    title="Multi-Language Support"
                    description="Support for over 40 programming languages with syntax highlighting and language-specific tools."
                  />
                  
                  <FeatureItem
                    icon={Gauge}
                    title="Performance Profiling"
                    description="Identify performance bottlenecks and optimize your code with integrated profiling tools."
                  />
                </div>
                
                <div className="mt-10">
                  <Button variant="link" className="text-primary hover:text-indigo-600 font-medium p-0">
                    View all features <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="requirements" className="pt-10 lg:pt-12">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">System Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium mb-2">Windows</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>Windows 10 or higher (64-bit)</li>
                        <li>4 GB RAM minimum, 8 GB RAM recommended</li>
                        <li>2 GB available disk space</li>
                        <li>.NET Framework 4.6.2 or higher</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">macOS</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>macOS 10.15 or higher</li>
                        <li>4 GB RAM minimum, 8 GB RAM recommended</li>
                        <li>2 GB available disk space</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="license" className="pt-10 lg:pt-12">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">License Details</h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">License Duration:</span> 1 year from activation date with option to renew
                    </p>
                    <p>
                      <span className="font-medium">Updates:</span> Free updates during the license period
                    </p>
                    <p>
                      <span className="font-medium">Support:</span> Email support with 24-hour response time
                    </p>
                    <p>
                      <span className="font-medium">Number of Installations:</span> Depends on license type (Single User or Team License)
                    </p>
                    <p>
                      <span className="font-medium">Refund Policy:</span> 30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-10 lg:pt-12">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <StarHalf className="h-5 w-5 fill-current" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">117 reviews</span>
                    </div>
                    
                    <p className="text-sm text-gray-600">Reviews will be shown here.</p>
                    
                    <Button>Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

interface FeatureItemProps {
  icon: any;
  title: string;
  description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h4 className="ml-4 text-lg font-medium text-gray-900">{title}</h4>
      </div>
      <p className="mt-2 ml-16 text-base text-gray-500">{description}</p>
    </div>
  );
}
