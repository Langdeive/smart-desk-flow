
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  spin?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, variant = "full", spin = false }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "relative flex items-center justify-center",
        spin && "animate-logo-spin"
      )}>
        <img 
          src="/lovable-uploads/b566d515-d82e-4f1c-af28-0e2d1e91140d.png" 
          alt="Solveflow Logo" 
          className="h-8 w-auto"
        />
      </div>
      
      {variant === "full" && (
        <div className="ml-2 text-xl font-manrope font-semibold tracking-heading bg-gradient-to-r from-primary-a to-primary-b bg-clip-text text-transparent">
          Solveflow
        </div>
      )}
    </div>
  );
};

export default Logo;
