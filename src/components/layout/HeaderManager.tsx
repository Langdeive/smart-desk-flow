
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { useLayout } from '@/contexts/LayoutContext';

interface HeaderManagerProps {
  children?: React.ReactNode;
}

export function HeaderManager({ children }: HeaderManagerProps) {
  const { registerHeader, addDebugInfo, headerInstances } = useLayout();
  const location = useLocation();
  const instanceId = useRef(`header-${Date.now()}-${Math.random()}`);
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (!hasRegistered.current) {
      const unregister = registerHeader();
      hasRegistered.current = true;
      
      addDebugInfo({
        route: location.pathname,
        componentId: instanceId.current,
      });

      return unregister;
    }
  }, [registerHeader, addDebugInfo, location.pathname]);

  // Se já existe outro header, não renderizar este
  if (headerInstances > 1) {
    console.warn('🚫 Evitando renderização de header duplicado:', instanceId.current);
    return children ? <>{children}</> : null;
  }

  return (
    <>
      <TopBar 
        data-testid="main-topbar"
        data-instance-id={instanceId.current}
        data-route={location.pathname}
      />
      {children}
    </>
  );
}
