import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  /** Filled = solid dot that expands into a light pill. Glass = frosted. */
  variant?: "glass" | "solid";
}

/**
 * Interactive hover button: the label slides out to the right while a dot in
 * the corner expands to fill the pill, revealing the label again with an
 * arrow. Built for the frosted-glass surfaces used across the site.
 */
const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, variant = "glass", ...props }, ref) => {
  const solid = variant === "solid";

  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border px-6 py-3 text-center text-[13px] font-semibold tracking-wide",
        solid
          ? "border-white/20 bg-white text-neutral-900"
          : "border-white/25 bg-white/10 text-white backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <span className="relative z-20 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div
        className={cn(
          "absolute top-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100",
          solid ? "text-neutral-900" : "text-neutral-900",
        )}
      >
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
      <div
        className={cn(
          "absolute left-[20%] top-[40%] z-10 h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:rounded-none",
          solid ? "bg-neutral-900/80 group-hover:bg-white" : "bg-white group-hover:bg-white",
        )}
      />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
