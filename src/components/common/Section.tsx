
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  alternate?: boolean;
}

export function Section({ children, className, id, alternate = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 w-full", // Added w-full to ensure full width
        alternate ? "section-alt" : "section-white",
        className
      )}
    >
      <div className="container mx-auto">{children}</div>
    </section>
  );
}
