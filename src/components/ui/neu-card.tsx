import { cn } from "@/lib/utils";

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "pressed";
}

export function NeuCard({ className, variant = "flat", children, ...props }: NeuCardProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] bg-[#FBF9F6] p-6 transition-all duration-300",
        variant === "flat" ? "shadow-neu-flat" : "shadow-neu-pressed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
