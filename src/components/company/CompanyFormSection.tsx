
import React from 'react';
import { Control } from 'react-hook-form';
import { FormInput } from '@/components/auth/FormFields';
import { User, Mail, Building, Phone } from 'lucide-react';

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyCnpj: string;
};

type CompanyFormSectionProps = {
  control: Control<any>;
};

export function CompanyFormSection({ control }: CompanyFormSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>
      <div className="space-y-4">
        <FormInput
          control={control}
          name="companyName"
          label="Nome da Empresa*"
          placeholder="Nome da empresa"
          icon={<Building />}
        />
        
        <FormInput
          control={control}
          name="companyEmail"
          label="E-mail da Empresa*"
          placeholder="email@empresa.com"
          icon={<Mail />}
          type="email"
          description="Este será o e-mail de suporte principal"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="companyPhone"
            label="Telefone (opcional)"
            placeholder="(00) 00000-0000"
            icon={<Phone />}
          />
          
          <FormInput
            control={control}
            name="companyCnpj"
            label="CNPJ (opcional)"
            placeholder="00.000.000/0000-00"
            icon={<Building />}
          />
        </div>
      </div>
    </div>
  );
}
