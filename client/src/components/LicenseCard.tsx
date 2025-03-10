import { useState } from "react";
import { Copy, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface LicenseCardProps {
  license: {
    id: number;
    licenseKey: string;
    isActive: boolean;
    expiresAt: string;
    product: {
      name: string;
      category: string;
    };
    licenseType: {
      name: string;
      maxUsers: number;
    };
  };
}

export default function LicenseCard({ license }: LicenseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCopyLicenseKey = () => {
    navigator.clipboard.writeText(license.licenseKey);
    toast({
      title: "License key copied to clipboard",
      duration: 3000,
    });
  };
  
  const handleDownload = () => {
    const licenseText = 
`License Key: ${license.licenseKey}
Product: ${license.product.name}
License Type: ${license.licenseType.name}
Expires: ${new Date(license.expiresAt).toLocaleDateString()}
    
Activation Instructions:
1. Download the software from your account or using the download link in your confirmation email.
2. Install the software on your computer.
3. When prompted, enter the license key exactly as shown above.
4. Your software will validate the license key and activate your product.`;

    const blob = new Blob([licenseText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${license.product.name.replace(/\s+/g, "_").toLowerCase()}_license.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "License file downloaded",
      duration: 3000,
    });
  };

  // Format expiration date
  const expirationDate = new Date(license.expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-primary rounded-md flex items-center justify-center">
              <span className="text-lg font-bold">{license.product.name.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">{license.product.name}</h4>
              <div className="text-sm text-gray-600 flex items-center flex-wrap gap-2">
                <Badge variant={license.isActive ? "success" : "destructive"} className="mr-2">
                  {license.isActive ? "Active" : "Expired"}
                </Badge>
                <span>
                  {license.licenseType.name}
                  {license.licenseType.maxUsers > 1 && ` (${license.licenseType.maxUsers} users)`}
                  {' • '}
                  Expires: {expirationDate}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">License Key:</span>
                <code className="license-key text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono tracking-wider">
                  {license.licenseKey}
                </code>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyLicenseKey}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5 mr-1" /> Download
              </Button>
            </div>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium text-gray-500 p-0">
                <span>Activation Instructions</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 text-sm text-gray-600 space-y-1">
              <p>1. Download the software from your account or using the download link in your confirmation email.</p>
              <p>2. Install the software on your computer.</p>
              <p>3. When prompted, enter the license key exactly as shown above.</p>
              <p>4. Your software will validate the license key and activate your product.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
