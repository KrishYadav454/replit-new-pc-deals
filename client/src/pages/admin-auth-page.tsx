import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Shield } from "lucide-react";

// Admin login schema
const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminAuthPage() {
  const { user, isLoading, loginMutation } = useAuth();

  // Admin login form
  const loginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: AdminLoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Redirect if already logged in as admin
  if (user && user.isAdmin) {
    return <Redirect to="/admin" />;
  }
  
  // Redirect to main site if logged in as regular user
  if (user && !user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Admin auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Sign in to the administration panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter admin username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter admin password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginMutation.isPending || isLoading}>
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Log in to Admin Portal"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <p className="text-center text-sm text-muted-foreground">
              This area is restricted to authorized administrators only.
            </p>
            <a href="/" className="text-sm text-center text-primary hover:underline">
              Return to main site
            </a>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Admin info section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
        <div className="max-w-lg mx-auto flex flex-col justify-center">
          <h1 className="text-3xl font-bold">License Marketplace Administration</h1>
          <p className="mt-4 text-lg text-slate-300">
            Welcome to the admin portal. This secure area provides tools to manage the license marketplace platform.
          </p>
          <div className="mt-8 space-y-6">
            <div className="flex items-start">
              <div className="mr-4 p-2 bg-white/10 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Product Management</h3>
                <p className="text-slate-300">Add, update, or remove products and license types</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 p-2 bg-white/10 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">User Management</h3>
                <p className="text-slate-300">View and manage user accounts and permissions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 p-2 bg-white/10 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart">
                  <line x1="12" x2="12" y1="20" y2="10"/>
                  <line x1="18" x2="18" y1="20" y2="4"/>
                  <line x1="6" x2="6" y1="20" y2="16"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Analytics Dashboard</h3>
                <p className="text-slate-300">Monitor sales performance and license activations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}