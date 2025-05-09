
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, className, variant = "default", iconLeft, iconRight, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {iconLeft && iconLeft}
        {children}
        {iconRight && iconRight}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
