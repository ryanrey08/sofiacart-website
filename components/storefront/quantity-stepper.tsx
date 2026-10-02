import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  max = 999,
  disabled,
  onChange,
}: {
  value: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/50 p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex h-6 w-6 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-xs font-bold text-slate-800">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-6 w-6 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
