
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  href: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  href,
  ariaLabel,
  className,
  style,
}: KpiCardProps) {
  return (
    <Link 
      to={href} 
      aria-label={ariaLabel || `Ver detalhes de ${title}`}
      title={`Ver detalhes de ${title}`}
      className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
    >
      <Card className={cn("h-full overflow-hidden", className)} style={style}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-blue-deep font-outfit">{title}</CardTitle>
            {description && <CardDescription className="text-purple-intense/70">{description}</CardDescription>}
          </div>
          {icon && <div className="text-turquoise-vibrant">{icon}</div>}
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold gradient-text">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
