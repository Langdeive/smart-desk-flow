
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ClientAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function ClientAvatar({ name, size = "md" }: ClientAvatarProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Set avatar size
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <Avatar className={`bg-neutral-100 text-neutral-700 ${sizeClasses[size]}`}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
