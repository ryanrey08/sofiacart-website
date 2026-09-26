import Link from "next/link";

import { primaryNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", className)}>
      {primaryNavigation.map((item) => (
        <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
