import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const productLinks = [
    { name: "Developer Tools", href: "#" },
    { name: "Database Software", href: "#" },
    { name: "Cloud & DevOps", href: "#" },
    { name: "Security Tools", href: "#" },
  ];

  const supportLinks = [
    { name: "Documentation", href: "#" },
    { name: "Contact Support", href: "#" },
    { name: "License Activation", href: "#" },
    { name: "FAQs", href: "#" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "License Agreement", href: "#" },
    { name: "Refund Policy", href: "#" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Products</h3>
            <ul className="mt-4 space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white cursor-pointer">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white cursor-pointer">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white cursor-pointer">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white cursor-pointer">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-white font-bold text-xl cursor-pointer">
                LicenseHub
              </Link>
              <p className="ml-3 text-base text-gray-400">The secure software license marketplace</p>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-8 text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} LicenseHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
