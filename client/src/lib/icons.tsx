import { 
  Code as LucideCode, 
  Database as LucideDatabase, 
  Cloud as LucideCloud, 
  Shield as LucideShield,
  RefreshCw as LucideRefreshCw,
  Zap as LucideZap,
  Headphones as LucideHeadphones,
  Tag as LucideTag,
  History as LucideHistory,
  Bug as LucideBug,
  Languages as LucideLanguages,
  Gauge as LucideGauge,
  Component
} from "lucide-react";

// Define the icon type to help with type checking
export type IconType = typeof Component;

// Re-export icons so we can use them consistently throughout the app
export const Code = LucideCode;
export const Database = LucideDatabase;
export const Cloud = LucideCloud;
export const Shield = LucideShield;
export const Sync = LucideRefreshCw;
export const Zap = LucideZap;
export const Headphones = LucideHeadphones;
export const Tag = LucideTag;
export const History = LucideHistory;
export const Bug = LucideBug;
export const Languages = LucideLanguages;
export const Gauge = LucideGauge;

/**
 * Gets the appropriate icon for a product category
 * @param category The product category name
 * @returns The corresponding icon component
 */
export function getCategoryIcon(category: string): IconType {
  switch (category.toLowerCase()) {
    case "development tools":
      return Code;
    case "database software":
      return Database;
    case "cloud & devops":
      return Cloud;
    case "security tools":
      return Shield;
    default:
      return Code;
  }
}

/**
 * Gets the appropriate icon for a feature
 * @param feature The feature name
 * @returns The corresponding icon component
 */
export function getFeatureIcon(feature: string): IconType {
  const featureToIconMap: Record<string, IconType> = {
    "secure": Shield,
    "security": Shield,
    "renewal": Sync,
    "automatic": Sync,
    "instant": Zap,
    "fast": Zap,
    "delivery": Zap,
    "support": Headphones,
    "pricing": Tag,
    "discount": Tag,
    "history": History,
    "debugging": Bug,
    "languages": Languages,
    "performance": Gauge,
  };
  
  // Find a matching keyword in the feature name
  for (const [keyword, icon] of Object.entries(featureToIconMap)) {
    if (feature.toLowerCase().includes(keyword)) {
      return icon;
    }
  }
  
  // Default icon if no match found
  return Zap;
}
