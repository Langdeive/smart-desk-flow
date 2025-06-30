
// Gerenciamento seguro de sessões
import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from './secureLogger';

interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  maxInactivityMinutes: number;
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  timeoutMinutes: 480, // 8 horas
  warningMinutes: 15,  // Aviso 15 min antes
  maxInactivityMinutes: 30 // Logout após 30 min inativo
};

class SessionManager {
  private static instance: SessionManager;
  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private config: SessionConfig = DEFAULT_SESSION_CONFIG;
  private onWarning?: () => void;
  private onTimeout?: () => void;

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setCallbacks(onWarning?: () => void, onTimeout?: () => void): void {
    this.onWarning = onWarning;
    this.onTimeout = onTimeout;
  }

  startSession(): void {
    this.lastActivity = Date.now();
    this.resetTimers();
    this.setupActivityListeners();
    SecureLogger.info('Session started', { timestamp: new Date().toISOString() });
  }

  private resetTimers(): void {
    this.clearTimers();
    
    // Timer para aviso
    const warningMs = (this.config.timeoutMinutes - this.config.warningMinutes) * 60 * 1000;
    this.warningTimeoutId = setTimeout(() => {
      SecureLogger.warn('Session warning triggered');
      this.onWarning?.();
    }, warningMs);

    // Timer para logout automático
    const timeoutMs = this.config.timeoutMinutes * 60 * 1000;
    this.timeoutId = setTimeout(() => {
      SecureLogger.warn('Session timeout triggered');
      this.endSession();
    }, timeoutMs);
  }

  private clearTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.lastActivity;
      
      // Se passou mais que o tempo de inatividade máximo, fazer logout
      if (timeSinceLastActivity > this.config.maxInactivityMinutes * 60 * 1000) {
        SecureLogger.warn('Max inactivity reached, ending session');
        this.endSession();
        return;
      }
      
      // Atualizar última atividade e resetar timers
      this.lastActivity = now;
      this.resetTimers();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });
  }

  extendSession(): void {
    this.lastActivity = Date.now();
    this.resetTimers();
    SecureLogger.info('Session extended');
  }

  async endSession(): Promise<void> {
    try {
      this.clearTimers();
      
      // Limpar dados sensíveis do storage
      this.clearSensitiveData();
      
      // Fazer logout no Supabase
      await supabase.auth.signOut();
      
      SecureLogger.info('Session ended securely');
      
      // Callback de timeout
      this.onTimeout?.();
      
      // Redirecionar para login
      window.location.href = '/login';
      
    } catch (error) {
      SecureLogger.error('Error ending session', undefined, error);
    }
  }

  private clearSensitiveData(): void {
    try {
      // Limpar localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth') || key.includes('token'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Limpar sessionStorage
      sessionStorage.clear();

      // Limpar cookies relacionados à autenticação
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes('auth') || name.includes('token') || name.includes('session')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });

      SecureLogger.info('Sensitive data cleared from storage');
    } catch (error) {
      SecureLogger.error('Error clearing sensitive data', undefined, error);
    }
  }

  getTimeUntilTimeout(): number {
    if (!this.timeoutId) return 0;
    const elapsed = Date.now() - this.lastActivity;
    const remaining = (this.config.timeoutMinutes * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
  }

  isSessionExpired(): boolean {
    const elapsed = Date.now() - this.lastActivity;
    return elapsed > (this.config.timeoutMinutes * 60 * 1000);
  }
}

export { SessionManager, type SessionConfig };
