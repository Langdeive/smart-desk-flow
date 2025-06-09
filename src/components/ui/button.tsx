
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-vibrant focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-deep to-turquoise-vibrant text-white hover:from-blue-deep/90 hover:to-turquoise-vibrant/90 shadow-modern hover:shadow-modern-lg transform hover:scale-[1.02]",
        destructive: "bg-gradient-to-r from-red-alert to-red-600 text-white hover:from-red-alert/90 hover:to-red-600/90 shadow-modern",
        outline: "border-2 border-turquoise-vibrant text-turquoise-vibrant bg-transparent hover:bg-gradient-to-r hover:from-turquoise-vibrant hover:to-blue-deep hover:text-white hover:border-transparent shadow-sm hover:shadow-modern",
        secondary: "bg-gradient-to-r from-purple-intense/10 to-turquoise-vibrant/10 text-purple-intense border border-purple-intense/20 hover:from-purple-intense/20 hover:to-turquoise-vibrant/20 hover:border-purple-intense/30",
        ghost: "text-blue-deep hover:bg-gradient-to-r hover:from-turquoise-vibrant/10 hover:to-purple-intense/10 hover:text-turquoise-vibrant",
        link: "text-turquoise-vibrant underline-offset-4 hover:underline hover:text-purple-intense",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
Button.displayName = "Button"

export { Button, buttonVariants }
