
import React from 'react';
import { Control } from 'react-hook-form';
import { FormInput, PasswordInput } from '@/components/auth/FormFields';
import { User, Mail } from 'lucide-react';

type AdminFormSectionProps = {
  control: Control<any>;
};

export function AdminFormSection({ control }: AdminFormSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dados do Administrador</h2>
      <div className="space-y-4">
        <FormInput
          control={control}
          name="adminName"
          label="Nome completo*"
          placeholder="Nome do administrador"
          icon={<User />}
        />
        
        <FormInput
          control={control}
          name="adminEmail"
          label="E-mail*"
          placeholder="admin@email.com"
          icon={<Mail />}
          type="email"
          description="Este será seu e-mail de acesso ao sistema"
        />
        
        <PasswordInput
          control={control}
          name="password"
          label="Senha*"
          placeholder="******"
          description="Mínimo de 6 caracteres"
        />
      </div>
    </div>
  );
}
