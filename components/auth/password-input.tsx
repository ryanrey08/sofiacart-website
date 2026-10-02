"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <Input
        type={visible ? "text" : "password"}
        className={cn("h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 pr-9 text-xs focus-visible:ring-brand", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
