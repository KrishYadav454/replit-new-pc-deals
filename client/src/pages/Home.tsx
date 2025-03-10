import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import FeatureCard from "../components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { Code, Database, Cloud, Shield, Sync, Zap, Headphones, Tag, History } from "../lib/icons";

export default function Home() {
  const { data: featuredProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const categories = [
    {
      title: "Development Tools",
      description: "IDEs, code editors, compilers, and debugging tools",
      icon: Code,
      href: "/products/category/Development%20Tools",
    },
    {
      title: "Database Software",
      description: "Database management, analytics, and optimization tools",
      icon: Database,
      href: "/products/category/Database%20Software",
    },
    {
      title: "Cloud & DevOps",
      description: "Deployment, monitoring, and infrastructure management",
      icon: Cloud,
      href: "/products/category/Cloud%20&%20DevOps",
    },
    {
      title: "Security Tools",
      description: "Encryption, penetration testing, and vulnerability scanners",
      icon: Shield,
      href: "/products/category/Security%20Tools",
    },
  ];

  const features = [
    {
      title: "Secure License Delivery",
      description: "Our encrypted delivery system ensures your license keys remain secure throughout the entire process.",
      icon: Shield,
    },
    {
      title: "Automatic License Renewal",
      description: "Set up automatic renewals to ensure uninterrupted access to your favorite software tools.",
      icon: Sync,
    },
    {
      title: "Instant Delivery",
      description: "Purchase and receive your license keys instantly, allowing you to get started right away.",
      icon: Zap,
    },
    {
      title: "24/7 Support",
      description: "Our support team is available around the clock to assist with any license activation or usage issues.",
      icon: Headphones,
    },
    {
      title: "Exclusive Pricing",
      description: "Access special discounts and bundle offers not available elsewhere for premium software.",
      icon: Tag,
    },
    {
      title: "License History",
      description: "Keep track of all your past and current licenses in one unified dashboard for easy reference.",
      icon: History,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Premium Software Licenses at Your Fingertips</h1>
              <p className="text-xl text-indigo-100">Buy, manage, and deploy software licenses for your business or personal projects.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button className="px-6 py-3 bg-white text-primary font-medium hover:bg-gray-100">
                    Browse Products
                  </Button>
                </Link>
                <Button variant="outline" className="px-6 py-3 bg-transparent border border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Software licenses visualization" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Software</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular software licenses and tools for developers and businesses.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load products. Please try again later.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts?.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link href="/products">
                  <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-primary">
                    View All Products <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Find the perfect software solution for your specific needs</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                description={category.description}
                icon={category.icon}
                href={category.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose LicenseHub?</h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
              Our platform makes software license management simple and secure
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Browse our catalog of premium software today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-3">
            <Link href="/products">
              <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50">
                Browse Products
              </Button>
            </Link>
            <Button variant="secondary" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
