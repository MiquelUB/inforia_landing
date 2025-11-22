"use client";
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const NeuSwitch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#FBF9F6] data-[state=unchecked]:bg-[#FBF9F6] shadow-neu-pressed",
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-6 w-6 rounded-full bg-[#FBF9F6] shadow-neu-convex ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-[#2E403B]"
            )}
        />
    </SwitchPrimitives.Root>
))
NeuSwitch.displayName = SwitchPrimitives.Root.displayName

export { NeuSwitch };
