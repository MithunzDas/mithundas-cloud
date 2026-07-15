import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "cyan" | "green" | "amber" | "red" | "blue";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border-subtle bg-background-elevated text-text-secondary",
  cyan: "border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan",
  green: "border-accent-green/20 bg-accent-green/10 text-accent-green",
  amber: "border-accent-amber/20 bg-accent-amber/10 text-accent-amber",
  red: "border-accent-red/20 bg-accent-red/10 text-accent-red",
  blue: "border-accent-blue/20 bg-accent-blue/10 text-accent-blue",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-label font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
