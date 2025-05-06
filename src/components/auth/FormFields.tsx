
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Mail, Building, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  description?: string;
}

export const FormInput = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  icon, 
  type = "text",
  description 
}: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
                {icon}
              </div>
              <Input placeholder={placeholder} className="pl-9" type={type} {...field} />
            </div>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const PasswordInput = ({ control, name, label, placeholder, description }: Omit<FormInputProps, 'icon' | 'type'>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder={placeholder} 
                className="pl-9 pr-9" 
                {...field} 
              />
              <button 
                type="button"
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
