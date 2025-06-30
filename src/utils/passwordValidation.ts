
// Sistema robusto de validação de senhas
interface PasswordStrength {
  score: number; // 0-100
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  isValid: boolean;
}

// Lista de senhas comuns (versão reduzida para exemplo)
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  '111111', '1234567', 'letmein', 'welcome', 'monkey', 'dragon',
  'pass', 'master', 'hello', 'freedom', 'whatever', 'qazwsx',
  'trustno1', '000000', 'admin', 'login', 'guest', 'test'
];

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbidCommon: true,
  forbidPersonalInfo: true
};

export const validatePassword = (
  password: string, 
  userInfo?: { name?: string; email?: string; company?: string }
): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Verificação de comprimento
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    feedback.push(`A senha deve ter pelo menos ${PASSWORD_REQUIREMENTS.minLength} caracteres`);
  } else if (password.length >= 12) {
    score += 20;
  } else if (password.length >= 8) {
    score += 10;
  }

  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    feedback.push(`A senha não pode ter mais de ${PASSWORD_REQUIREMENTS.maxLength} caracteres`);
  }

  // Verificação de complexidade
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUppercase && PASSWORD_REQUIREMENTS.requireUppercase) {
    feedback.push('A senha deve conter pelo menos uma letra maiúscula');
  } else if (hasUppercase) {
    score += 15;
  }

  if (!hasLowercase && PASSWORD_REQUIREMENTS.requireLowercase) {
    feedback.push('A senha deve conter pelo menos uma letra minúscula');
  } else if (hasLowercase) {
    score += 15;
  }

  if (!hasNumbers && PASSWORD_REQUIREMENTS.requireNumbers) {
    feedback.push('A senha deve conter pelo menos um número');
  } else if (hasNumbers) {
    score += 15;
  }

  if (!hasSpecialChars && PASSWORD_REQUIREMENTS.requireSpecialChars) {
    feedback.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*...)');
  } else if (hasSpecialChars) {
    score += 15;
  }

  // Verificação contra senhas comuns
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    feedback.push('A senha não pode conter palavras comuns');
    score -= 30;
  }

  // Verificação contra informações pessoais
  if (userInfo && PASSWORD_REQUIREMENTS.forbidPersonalInfo) {
    const personalInfo = [
      userInfo.name?.toLowerCase(),
      userInfo.email?.split('@')[0]?.toLowerCase(),
      userInfo.company?.toLowerCase()
    ].filter(Boolean);

    const containsPersonalInfo = personalInfo.some(info => 
      info && lowerPassword.includes(info)
    );

    if (containsPersonalInfo) {
      feedback.push('A senha não pode conter informações pessoais');
      score -= 25;
    }
  }

  // Verificação de padrões repetitivos
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('A senha não pode conter caracteres repetidos consecutivos');
    score -= 15;
  }

  // Verificação de sequências
  const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
  if (sequences.some(seq => lowerPassword.includes(seq))) {
    feedback.push('A senha não pode conter sequências óbvias');
    score -= 10;
  }

  // Bônus para diversidade de caracteres
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) {
    score += 10;
  }

  // Normalizar score
  score = Math.max(0, Math.min(100, score));

  // Determinar nível
  let level: PasswordStrength['level'];
  if (score >= 80) level = 'strong';
  else if (score >= 60) level = 'good';
  else if (score >= 40) level = 'fair';
  else if (score >= 20) level = 'weak';
  else level = 'very-weak';

  // Senha é válida se não há feedback negativo e score >= 60
  const isValid = feedback.length === 0 && score >= 60;

  return { score, level, feedback, isValid };
};

export const getPasswordStrengthColor = (level: PasswordStrength['level']): string => {
  switch (level) {
    case 'very-weak': return 'text-red-600';
    case 'weak': return 'text-red-500';
    case 'fair': return 'text-yellow-500';
    case 'good': return 'text-blue-500';
    case 'strong': return 'text-green-600';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (level: PasswordStrength['level']): string => {
  switch (level) {
    case 'very-weak': return 'Muito Fraca';
    case 'weak': return 'Fraca';
    case 'fair': return 'Regular';
    case 'good': return 'Boa';
    case 'strong': return 'Forte';
    default: return 'Indefinida';
  }
};
