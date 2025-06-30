
import React from 'react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/utils/passwordValidation';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
  userInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  className?: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  userInfo, 
  className = '' 
}: PasswordStrengthIndicatorProps) {
  const strength = validatePassword(password, userInfo);

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Força da senha:</span>
        <span className={`text-sm font-medium ${getPasswordStrengthColor(strength.level)}`}>
          {getPasswordStrengthText(strength.level)}
        </span>
      </div>
      
      <Progress 
        value={strength.score} 
        className="h-2"
        style={{
          '--progress-foreground': strength.level === 'strong' ? 'hsl(142, 76%, 36%)' :
                                 strength.level === 'good' ? 'hsl(221, 83%, 53%)' :
                                 strength.level === 'fair' ? 'hsl(45, 93%, 47%)' :
                                 strength.level === 'weak' ? 'hsl(0, 84%, 60%)' :
                                 'hsl(0, 84%, 50%)'
        } as React.CSSProperties}
      />
      
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-red-600 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              {feedback}
            </li>
          ))}
        </ul>
      )}
      
      {strength.isValid && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <span className="text-green-500">✓</span>
          Senha atende aos requisitos de segurança
        </div>
      )}
    </div>
  );
}
