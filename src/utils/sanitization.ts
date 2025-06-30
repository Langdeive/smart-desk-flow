
import DOMPurify from 'dompurify';

// Configuração do DOMPurify para sanitização segura
const createDOMPurify = () => {
  const purify = DOMPurify;
  
  // Configurações restritivas para máxima segurança
  purify.addHook('beforeSanitizeElements', (node) => {
    // Remove todos os elementos script
    if (node.nodeName && node.nodeName.toLowerCase() === 'script') {
      node.remove();
    }
  });
  
  return purify;
};

const sanitizer = createDOMPurify();

// Configurações padrão restritivas
const defaultConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['class'],
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'style'],
  ALLOW_DATA_ATTR: false
};

// Configuração ainda mais restritiva para conteúdo de usuário
const strictConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
  ALLOWED_ATTR: [],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'style', 'href', 'src'],
  ALLOW_DATA_ATTR: false
};

export const sanitizeHtml = (dirty: string, useStrictMode = false): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  const config = useStrictMode ? strictConfig : defaultConfig;
  return sanitizer.sanitize(dirty, config);
};

// Sanitização de texto simples (sem HTML)
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validação de URLs para prevenir javascript: e data: schemes
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Sanitização de parâmetros de URL
export const sanitizeUrlParams = (params: Record<string, string>): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    const cleanKey = sanitizeText(key);
    const cleanValue = sanitizeText(value);
    if (cleanKey && cleanValue) {
      sanitized[cleanKey] = cleanValue;
    }
  });
  
  return sanitized;
};
