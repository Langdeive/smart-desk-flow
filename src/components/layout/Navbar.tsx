
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 glass-effect shadow-modern' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Logo variant="full" />

        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#features" 
            className="text-sm font-medium text-gray-dark hover:text-turquoise-vibrant transition-colors duration-300 relative group"
          >
            Funcionalidades
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-vibrant transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="#plans" 
            className="text-sm font-medium text-gray-dark hover:text-turquoise-vibrant transition-colors duration-300 relative group"
          >
            Planos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-vibrant transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="#faq" 
            className="text-sm font-medium text-gray-dark hover:text-turquoise-vibrant transition-colors duration-300 relative group"
          >
            FAQ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-vibrant transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <RouterLink 
            to="/login"
            className="text-sm font-medium text-turquoise-vibrant hover:text-blue-deep transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-turquoise-vibrant/10"
          >
            Login
          </RouterLink>
          <Button 
            asChild 
            size="sm" 
            className="modern-button bg-gradient-primary text-white shadow-glow font-medium px-6 py-2"
          >
            <RouterLink to="/register">Cadastrar</RouterLink>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
