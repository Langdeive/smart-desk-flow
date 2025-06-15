
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Forbidden = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "403 Error: User attempted to access restricted route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema para solicitar acesso.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary-a hover:bg-primary-a-600"
          >
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
