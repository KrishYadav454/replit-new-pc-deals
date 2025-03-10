import { Link } from "wouter";
import { IconType } from "../lib/icons";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: IconType;
  href: string;
}

export default function CategoryCard({ title, description, icon: Icon, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group cursor-pointer">
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center text-center group-hover:border-primary">
        <div className="h-16 w-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
