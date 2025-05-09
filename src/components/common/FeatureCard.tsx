
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function FeatureCard({ icon, title, description, className, children }: FeatureCardProps) {
  return (
    <Card className={cn("hover-card transition-all", className)}>
      <CardHeader className="pb-2">
        {icon && <div className="feature-icon mb-4">{icon}</div>}
        <CardTitle className="text-h2 mb-2">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      {(children) && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
