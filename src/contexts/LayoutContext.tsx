
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
  showTopBar: boolean;
  setShowTopBar: (show: boolean) => void;
  headerInstances: number;
  registerHeader: () => () => void;
  debugInfo: {
    renderedAt: Date;
    route: string;
    componentId: string;
  }[];
  addDebugInfo: (info: { route: string; componentId: string }) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [headerInstances, setHeaderInstances] = useState(0);
  const [debugInfo, setDebugInfo] = useState<LayoutContextType['debugInfo']>([]);

  const registerHeader = () => {
    setHeaderInstances(prev => prev + 1);
    console.log('🔍 Header registered, total instances:', headerInstances + 1);
    
    return () => {
      setHeaderInstances(prev => prev - 1);
      console.log('🔍 Header unregistered, total instances:', headerInstances - 1);
    };
  };

  const addDebugInfo = (info: { route: string; componentId: string }) => {
    const newInfo = {
      ...info,
      renderedAt: new Date(),
    };
    
    setDebugInfo(prev => [...prev, newInfo]);
    console.log('🔍 Layout Debug Info:', newInfo);
  };

  // Log quando há múltiplas instâncias
  useEffect(() => {
    if (headerInstances > 1) {
      console.warn('⚠️ MÚLTIPLAS INSTÂNCIAS DE HEADER DETECTADAS:', headerInstances);
    }
  }, [headerInstances]);

  return (
    <LayoutContext.Provider 
      value={{ 
        showTopBar, 
        setShowTopBar, 
        headerInstances, 
        registerHeader,
        debugInfo,
        addDebugInfo
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
