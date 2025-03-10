import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LicenseCard from "../components/LicenseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the License type which matches the enhanced license from the API
interface License {
  id: number;
  userId: number;
  productId: number;
  licenseTypeId: number;
  licenseKey: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
    category: string;
    description: string;
    shortDescription: string;
    price: number;
    imageUrl: string;
  };
  licenseType: {
    id: number;
    name: string;
    description: string;
    price: number;
    maxUsers: number;
  };
}

export default function LicenseManagement() {
  // In a real app, we would get the userId from an auth context
  // For now, we'll use a hardcoded userId
  const userId = 1;
  const [activeTab, setActiveTab] = useState("active");

  const { data: licenses, isLoading, error } = useQuery<License[]>({
    queryKey: [`/api/users/${userId}/licenses`],
    // In a real app, we would enable this only if the user is logged in
    enabled: true,
  });

  // Filter licenses based on active tab
  const activeLicenses = licenses?.filter(license => license.isActive) || [];
  const expiredLicenses = licenses?.filter(license => !license.isActive) || [];
  
  // For pending tab, in a real app we might have a different status
  // Here we'll just show an empty array
  const pendingLicenses: License[] = [];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">License Management</h2>
          <p className="mt-4 text-lg text-gray-600">Easily manage your software licenses in one place</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm rounded-lg overflow-hidden">
            <Tabs defaultValue="active" onValueChange={setActiveTab}>
              <div className="border-b border-gray-200">
                <TabsList className="p-0">
                  <TabsTrigger 
                    value="active" 
                    className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary px-1 pb-4 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
                  >
                    Active Licenses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="expired" 
                    className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary px-1 pb-4 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
                  >
                    Expired
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary px-1 pb-4 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
                  >
                    Pending
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-100 p-4 rounded-md">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500 mb-4">Error loading licenses</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                ) : activeLicenses.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You don't have any active licenses</p>
                    <Button onClick={() => window.location.href = "/products"}>Browse Products</Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {activeLicenses.map((license) => (
                      <li key={license.id} className="p-6">
                        <LicenseCard license={license} />
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              
              <TabsContent value="expired">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="mt-4 bg-gray-100 p-4 rounded-md">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500 mb-4">Error loading licenses</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                ) : expiredLicenses.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">You don't have any expired licenses</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {expiredLicenses.map((license) => (
                      <li key={license.id} className="p-6">
                        <LicenseCard license={license} />
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : pendingLicenses.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">You don't have any pending licenses</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {pendingLicenses.map((license) => (
                      <li key={license.id} className="p-6">
                        <LicenseCard license={license} />
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
