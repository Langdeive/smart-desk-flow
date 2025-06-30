
import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { useLocation } from 'react-router-dom';

export function useLayoutDebug(componentName: string) {
  const { headerInstances, debugInfo } = useLayout();
  const location = useLocation();

  useEffect(() => {
    console.log(`🔍 [${componentName}] Layout Debug:`, {
      route: location.pathname,
      headerInstances,
      debugInfo: debugInfo.slice(-5), // últimas 5 entradas
      timestamp: new Date().toISOString(),
    });
  }, [componentName, location.pathname, headerInstances, debugInfo]);

  // Função para forçar log do estado atual
  const logCurrentState = () => {
    console.table({
      'Current Route': location.pathname,
      'Header Instances': headerInstances,
      'Component': componentName,
      'Debug Entries': debugInfo.length,
    });
    
    if (debugInfo.length > 0) {
      console.log('📊 Debug History:', debugInfo);
    }
  };

  return { logCurrentState, headerInstances, debugInfo };
}
