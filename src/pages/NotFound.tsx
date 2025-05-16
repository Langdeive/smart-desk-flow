
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Página não encontrada</p>
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-primary-a hover:bg-primary-a-600"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
