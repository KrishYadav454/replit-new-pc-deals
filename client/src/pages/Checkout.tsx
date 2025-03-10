import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, User, CreditCard, CheckCircle } from "lucide-react";

type CheckoutStep = "cart" | "account" | "payment" | "complete";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  createAccount: boolean;
  password?: string;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("account");
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    createAccount: false,
  });

  // Calculate cart totals
  const subtotal = getCartTotal();
  const taxRate = 0.06; // 6% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (userData: { email: string; firstName: string; lastName: string; company?: string }) => {
      // In a real app, this would create a user account or use a guest checkout
      // For now, we'll create a mock user with ID 1
      const userId = 1;

      const orderData = {
        order: {
          userId,
          total,
          status: "pending",
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          licenseTypeId: item.licenseTypeId,
          quantity: item.quantity,
        })),
      };

      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      // Move to complete step
      setCurrentStep("complete");
      clearCart();
      toast({
        title: "Order Completed Successfully",
        description: "Your licenses are now available in your account.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, createAccount: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // If this were a real application, we would validate email format,
    // and handle password validation if createAccount is true

    // Process the payment (mock)
    if (currentStep === "account") {
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      // Submit the order
      createOrderMutation.mutate({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || undefined,
      });
    }
  };

  const goBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("account");
    } else if (currentStep === "account") {
      navigate("/");
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0 && currentStep !== "complete") {
    navigate("/");
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
          <p className="mt-4 text-lg text-gray-600">Complete your purchase to receive your license keys</p>
        </div>
        
        <div className="relative">
          <div className="max-w-2xl mx-auto">
            {/* Checkout Steps */}
            <nav aria-label="Progress" className="mb-8">
              <ol className="flex items-center">
                <CheckoutStep 
                  step="cart" 
                  currentStep={currentStep}
                  label="Cart"
                  icon={<ShoppingCart className="h-4 w-4" />} 
                />
                <CheckoutStep 
                  step="account" 
                  currentStep={currentStep}
                  label="Account"
                  icon={<User className="h-4 w-4" />} 
                />
                <CheckoutStep 
                  step="payment" 
                  currentStep={currentStep}
                  label="Payment"
                  icon={<CreditCard className="h-4 w-4" />} 
                />
                <CheckoutStep 
                  step="complete" 
                  currentStep={currentStep}
                  label="Complete"
                  icon={<CheckCircle className="h-4 w-4" />} 
                  isLast
                />
              </ol>
            </nav>
            
            {currentStep === "account" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 pb-4 border-b">Account Information</h3>
                  
                  <form className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4" onSubmit={handleSubmit}>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <div className="flex items-start">
                        <Checkbox
                          id="createAccount"
                          checked={formData.createAccount}
                          onCheckedChange={handleCheckboxChange}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label 
                            htmlFor="createAccount" 
                            className="font-medium text-gray-700"
                          >
                            Create an account for faster checkout and license management
                          </Label>
                          <p className="text-gray-500 text-sm">You'll be able to manage your licenses and download your products anytime.</p>
                        </div>
                      </div>
                    </div>
                    
                    {formData.createAccount && (
                      <div className="sm:col-span-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                          required={formData.createAccount}
                        />
                      </div>
                    )}
                    
                    <div className="sm:col-span-2 pt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                      >
                        Back to Cart
                      </Button>
                      <Button type="submit" className="ml-3">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 pb-4 border-b">Payment Information</h3>
                  
                  <form className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4" onSubmit={handleSubmit}>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 mb-4">
                        This is a demo checkout. In a real application, you would integrate with a payment processor here.
                      </p>
                      <p className="text-gray-500 mb-4">
                        Click "Complete Order" to simulate a successful payment and generate your license keys.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-2 pt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="ml-3" 
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? "Processing..." : "Complete Order"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === "complete" && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Order Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your license keys are now available in your account.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => navigate("/licenses")}>
                      View My Licenses
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/products")}>
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Order Summary */}
            {(currentStep === "account" || currentStep === "payment") && (
              <Card className="mt-10">
                <CardContent className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex justify-between text-sm">
                      <p className="font-medium text-gray-900">Subtotal</p>
                      <p className="text-gray-700">${subtotal.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-sm">
                      <p className="font-medium text-gray-900">Tax</p>
                      <p className="text-gray-700">${tax.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-sm">
                      <p className="font-medium text-gray-900">Total</p>
                      <p className="font-bold text-primary">${total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Items</h4>
                    
                    <ul className="mt-2 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                            <p className="text-sm text-gray-500">{item.licenseType.name}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">${item.licenseType.price.toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CheckoutStepProps {
  step: CheckoutStep;
  currentStep: CheckoutStep;
  label: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

function CheckoutStep({ step, currentStep, label, icon, isLast = false }: CheckoutStepProps) {
  // Determine the step status
  const isCompleted = 
    (currentStep === "account" && step === "cart") ||
    (currentStep === "payment" && (step === "cart" || step === "account")) ||
    (currentStep === "complete" && (step === "cart" || step === "account" || step === "payment"));
  
  const isCurrent = currentStep === step;

  return (
    <li className={`relative ${isLast ? "" : "pr-8 sm:pr-20 flex-1"}`}>
      {!isLast && (
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className={`h-0.5 w-full ${isCompleted ? "bg-primary" : "bg-gray-200"}`}></div>
        </div>
      )}
      <div 
        className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
          isCompleted || isCurrent ? "bg-primary text-white" : "bg-white border-2 border-gray-300 text-gray-400"
        }`}
      >
        {icon}
      </div>
      <span className={`text-sm font-medium mt-2 absolute top-8 left-0 ${
        isCompleted || isCurrent ? "text-primary" : "text-gray-500"
      }`}>
        {label}
      </span>
    </li>
  );
}
