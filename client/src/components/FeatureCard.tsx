import { IconType } from "../lib/icons";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="pt-6">
      <div className="bg-white rounded-lg shadow-sm px-6 pb-8">
        <div className="-mt-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{title}</h3>
          <p className="mt-4 text-base text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
