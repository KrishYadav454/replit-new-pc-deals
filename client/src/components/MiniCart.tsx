import { useCart } from "../contexts/CartContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "wouter";

export default function MiniCart() {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, getCartTotal } = useCart();
  const [, navigate] = useLocation();
  
  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  const cartTotal = getCartTotal();

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Your Cart ({cartItems.length})</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-gray-500 p-2 h-8 w-8" onClick={toggleCart}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Your cart is empty</p>
              <Button
                variant="link"
                className="mt-4 text-primary"
                onClick={toggleCart}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4 border-b border-gray-200 pb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.licenseType.name}</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm font-medium text-gray-900">${item.licenseType.price.toFixed(2)}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 text-xs hover:text-red-700 h-6 p-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500">Taxes calculated at checkout.</p>
            <Button 
              className="w-full"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{" "}
                <Button variant="link" className="text-primary font-medium hover:text-primary-dark p-0" onClick={toggleCart}>
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
