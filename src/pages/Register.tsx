
import React from "react";
import { ImprovedRegisterForm } from "@/components/auth/ImprovedRegisterForm";
import { SecureCspHeaders } from "@/components/security/SecureCspHeaders";

const Register = () => {
  return (
    <>
      <SecureCspHeaders />
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          minHeight: '100vh'
        }}
      >
        <ImprovedRegisterForm />
      </div>
    </>
  );
};

export default Register;
