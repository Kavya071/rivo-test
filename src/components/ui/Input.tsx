import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-rivo-text-secondary ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-white ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rivo-green focus:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
