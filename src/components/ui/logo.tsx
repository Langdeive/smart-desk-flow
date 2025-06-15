
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  spin?: boolean;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, variant = "full", size = "sm", spin = false, glow = false }) => {
  const showText = variant === "full";

  const sizeStyles = {
    sm: { img: "h-10", text: "ml-2 text-xl" },
    md: { img: "h-14", text: "ml-2.5 text-3xl" },
    lg: { img: "h-20", text: "ml-3 text-5xl" },
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "relative flex items-center justify-center",
        spin && "animate-logo-spin",
        glow && "animate-logo-glow"
      )}>
        <img 
          src="/lovable-uploads/acb38c4c-968d-49c7-a3e2-c9f9d9478b75.png" 
          alt="Solveflow Logo" 
          className={cn(
            "w-auto",
            sizeStyles[size].img
          )}
        />
      </div>
      
      {showText && (
        <div className={cn(
          "font-manrope font-semibold tracking-heading bg-gradient-to-r from-primary-a to-primary-b bg-clip-text text-transparent",
          sizeStyles[size].text
        )}>
          Solveflow
        </div>
      )}
    </div>
  );
};

export default Logo;
