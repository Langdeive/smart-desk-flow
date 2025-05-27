
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getConfigurationSource, SystemSettingKey } from "@/services/settingsService";
import { Building, Globe, AlertCircle } from "lucide-react";

interface ConfigurationIndicatorProps {
  companyId: string;
  settingKey: SystemSettingKey;
  label: string;
}

const ConfigurationIndicator: React.FC<ConfigurationIndicatorProps> = ({
  companyId,
  settingKey,
  label
}) => {
  const [source, setSource] = useState<'company' | 'global' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSource = async () => {
      try {
        setIsLoading(true);
        const configSource = await getConfigurationSource(companyId, settingKey);
        setSource(configSource);
      } catch (error) {
        console.error("Error checking configuration source:", error);
        setSource('none');
      } finally {
        setIsLoading(false);
      }
    };

    checkSource();
  }, [companyId, settingKey]);

  if (isLoading) {
    return <Badge variant="outline">Carregando...</Badge>;
  }

  const getIndicatorProps = () => {
    switch (source) {
      case 'company':
        return {
          variant: "default" as const,
          icon: <Building className="h-3 w-3" />,
          text: "Empresa",
          tooltip: `${label} configurado especificamente para esta empresa`
        };
      case 'global':
        return {
          variant: "secondary" as const,
          icon: <Globe className="h-3 w-3" />,
          text: "Global",
          tooltip: `${label} usando configuração global (fallback)`
        };
      case 'none':
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-3 w-3" />,
          text: "Não configurado",
          tooltip: `${label} não configurado nem globalmente nem para esta empresa`
        };
    }
  };

  const { variant, icon, text, tooltip } = getIndicatorProps();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="flex items-center gap-1">
            {icon}
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfigurationIndicator;
