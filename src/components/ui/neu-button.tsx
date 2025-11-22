import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FBF9F6] text-[#2E403B] shadow-neu-flat hover:-translate-y-1 hover:shadow-lg active:shadow-neu-pressed",
        primary: "bg-[#2E403B] text-[#FBF9F6] shadow-neu-flat hover:bg-[#2E403B]/90 hover:-translate-y-1 active:shadow-inner",
        secondary: "bg-[#800020] text-white shadow-neu-flat hover:bg-[#800020]/90 hover:-translate-y-1",
        accent: "bg-[#800020] text-white shadow-neu-flat hover:bg-[#800020]/90 hover:-translate-y-1",
        ghost: "hover:bg-[#2E403B]/5 text-[#2E403B]",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-6 py-2",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const NeuButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NeuButton.displayName = "NeuButton"

export { NeuButton, buttonVariants };
