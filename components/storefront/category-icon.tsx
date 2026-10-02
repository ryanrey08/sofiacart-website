import { createElement } from "react";
import {
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Home,
  Laptop,
  Shirt,
  ShoppingBag,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { ProductImage } from "@/components/storefront/product-image";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/domain";

const iconRules: [RegExp, LucideIcon][] = [
  [/electr|gadget|phone|computer/i, Laptop],
  [/home|living|furni|kitchen/i, Home],
  [/apparel|fashion|cloth|shoe/i, Shirt],
  [/beauty|health|care/i, Sparkles],
  [/grocer|food|essential/i, ShoppingBag],
  [/sport|outdoor|fitness/i, Dumbbell],
  [/toy|kid|bab/i, Baby],
  [/auto|car|motor/i, Car],
  [/book|office|station/i, BookOpen],
];

export function categoryIcon(name: string): LucideIcon {
  return iconRules.find(([pattern]) => pattern.test(name))?.[1] ?? Tag;
}

/** The category's image from the API when it has one, otherwise an icon picked from its name. */
export function CategoryVisual({ category, className }: { category: Category; className?: string }) {
  if (category.imageUrl) {
    return <ProductImage src={category.imageUrl} alt={category.name} className={cn("rounded-xl", className)} />;
  }

  return (
    <div className={cn("flex items-center justify-center rounded-xl bg-brand/5 text-brand", className)}>
      {createElement(categoryIcon(category.name), { className: "h-1/2 w-1/2" })}
    </div>
  );
}
