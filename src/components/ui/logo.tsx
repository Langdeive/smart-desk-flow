
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "hero";
  spin?: boolean;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, variant = "full", spin = false, glow = false }) => {
  const isHero = variant === "hero";
  const showText = variant === "full";

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
            isHero ? "h-20" : "h-8"
          )}
        />
      </div>
      
      {showText && (
        <div className={cn(
          "font-manrope font-semibold tracking-heading bg-gradient-to-r from-primary-a to-primary-b bg-clip-text text-transparent",
          isHero ? "ml-3 text-5xl" : "ml-2 text-xl"
        )}>
          Solveflow
        </div>
      )}
    </div>
  );
};

export default Logo;
