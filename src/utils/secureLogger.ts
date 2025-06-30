
// Sistema de logging seguro que evita exposição de dados sensíveis
interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const CURRENT_LOG_LEVEL = import.meta.env.PROD ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;

interface LogContext {
  userId?: string;
  companyId?: string;
  action?: string;
  timestamp?: string;
}

// Lista de campos sensíveis que devem ser mascarados
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'key',
  'secret',
  'email',
  'phone',
  'cpf',
  'cnpj',
  'api_key',
  'webhook_url',
  'ip_address',
  'user_agent'
];

// Função para mascarar dados sensíveis
const maskSensitiveData = (data: any): any => {
  if (typeof data === 'string') {
    return data.length > 4 ? `${data.substring(0, 2)}***${data.substring(data.length - 2)}` : '***';
  }
  
  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  }
  
  if (data && typeof data === 'object') {
    const masked = { ...data };
    Object.keys(masked).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
        masked[key] = '***MASKED***';
      } else if (typeof masked[key] === 'object') {
        masked[key] = maskSensitiveData(masked[key]);
      }
    });
    return masked;
  }
  
  return data;
};

class SecureLogger {
  private static formatMessage(level: string, message: string, context?: LogContext, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
    const dataStr = data ? ` - Data: ${JSON.stringify(maskSensitiveData(data))}` : '';
    return `[${timestamp}] ${level}${contextStr}: ${message}${dataStr}`;
  }

  static debug(message: string, context?: LogContext, data?: any): void {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, context, data));
    }
  }

  static info(message: string, context?: LogContext, data?: any): void {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info(this.formatMessage('INFO', message, context, data));
    }
  }

  static warn(message: string, context?: LogContext, data?: any): void {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, context, data));
    }
  }

  static error(message: string, context?: LogContext, data?: any): void {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, context, data));
    }
  }

  // Para uso em produção - só registra erros críticos
  static critical(message: string, context?: LogContext, error?: Error): void {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: import.meta.env.PROD ? 'Hidden in production' : error.stack
    } : undefined;
    
    console.error(this.formatMessage('CRITICAL', message, context, errorInfo));
    
    // Em produção, poderia enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      // TODO: Integrar com serviço de monitoramento (Sentry, etc.)
    }
  }
}

export { SecureLogger, type LogContext };
