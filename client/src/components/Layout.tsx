import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MiniCart from "./MiniCart";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <MiniCart />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
