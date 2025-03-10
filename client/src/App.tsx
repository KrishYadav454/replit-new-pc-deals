import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import LicenseManagement from "./pages/LicenseManagement";
import Admin from "./pages/Admin";
import AuthPage from "./pages/auth-page";
import AdminAuthPage from "./pages/admin-auth-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Main website routes */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/checkout">
        {() => <ProtectedRoute path="/checkout" component={Checkout} />}
      </Route>
      <Route path="/licenses">
        {() => <ProtectedRoute path="/licenses" component={LicenseManagement} />}
      </Route>
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminAuthPage} />
      <Route path="/admin">
        {() => <ProtectedRoute path="/admin" component={Admin} requireAdmin={true} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
