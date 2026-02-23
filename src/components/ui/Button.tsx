import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg" | "full";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-zinc-200 active:scale-[0.96] border border-transparent",
      secondary: "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.96] border border-zinc-800",
      outline: "border-2 border-zinc-800 bg-transparent text-white hover:bg-zinc-900 active:scale-[0.96]",
      ghost: "bg-transparent text-white hover:bg-zinc-900 active:scale-[0.96]",
      whatsapp: "bg-white text-black hover:bg-zinc-200 active:scale-[0.96] border border-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      full: "h-14 w-full text-lg",
    };

    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-rivo-green focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
