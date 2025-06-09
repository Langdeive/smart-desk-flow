
import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        minHeight: '100vh'
      }}
    >
      <RegisterForm />
    </div>
  );
};

export default Register;
